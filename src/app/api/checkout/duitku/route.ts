import crypto from "node:crypto";
import { getServiceSupabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CheckoutRequest = {
  productId?: string;
};

const duitkuProductionCreateInvoiceUrl = "https://api-prod.duitku.com/api/merchant/createInvoice";

export const runtime = "nodejs";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "https://xffarhans.my.id").replace(/\/+$/, "");
}

function getEnv(name: string) {
  return process.env[name]?.trim();
}

function signPopHeader(merchantCode: string, timestamp: string, apiKey: string) {
  const stringToSign = merchantCode + timestamp;
  return crypto.createHmac("sha256", apiKey).update(stringToSign).digest("hex");
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  const firstName = parts.shift() || "Pelanggan";
  const lastName = parts.join(" ");

  return { firstName, lastName };
}

function getExpiryDate(expiryPeriodMinutes: number) {
  return new Date(Date.now() + expiryPeriodMinutes * 60 * 1000);
}

export async function POST(request: Request) {
  try {
    const merchantCode = getEnv("DUITKU_MERCHANT_CODE");
    const apiKey = getEnv("DUITKU_API_KEY");
    const duitkuMode = getEnv("DUITKU_MODE") || "sandbox";

    if (!merchantCode || !apiKey) {
      return Response.json(
        {
          message:
            "Kredensial Duitku belum dikonfigurasi. Pastikan DUITKU_MERCHANT_CODE dan DUITKU_API_KEY tersedia di environment server.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as CheckoutRequest;

    const supabase = getServiceSupabase();
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", body.productId)
      .eq("is_active", true)
      .single();

    if (!product) {
      return Response.json({ message: "Produk tidak ditemukan." }, { status: 400 });
    }

    const authSupabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await authSupabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { message: "Silakan login dulu sebelum checkout.", redirectTo: "/login" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("full_name, email, phone, address")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return Response.json(
        { message: "Profil belum tersedia. Lengkapi data checkout di Settings.", redirectTo: "/settings" },
        { status: 400 }
      );
    }

    const customerName = String(profile.full_name || "").trim();
    const email = String(profile.email || user.email || "").trim();
    const phone = String(profile.phone || "").trim();
    const address = String(profile.address || "").trim();

    if (!customerName || !email || !phone || !address) {
      return Response.json(
        { message: "Lengkapi nama, email, telepon, dan alamat di Settings sebelum checkout.", redirectTo: "/settings" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl();
    const merchantOrderId = `XF-${product.id.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12)}-${Date.now()}`;
    const { firstName, lastName } = splitName(customerName);
    const expiryPeriod = 60;
    const expiresAt = getExpiryDate(expiryPeriod);
    const timestamp = String(Date.now());

    const configuredCreateInvoiceUrl = getEnv("DUITKU_CREATE_INVOICE_URL");

    const createInvoiceUrl =
      configuredCreateInvoiceUrl || duitkuProductionCreateInvoiceUrl;

    const signature = signPopHeader(merchantCode, timestamp, apiKey);

    const customerAddress = {
      firstName,
      lastName,
      address: address.slice(0, 50),
      city: "Bantul",
      postalCode: "55183",
      phone,
      countryCode: "ID",
    };

    const payload = {
      paymentAmount: product.price,
      merchantOrderId,
      productDetails: product.name,
      additionalParam: product.id,
      merchantUserInfo: email,
      customerVaName: customerName.slice(0, 20),
      email,
      phoneNumber: phone,
      itemDetails: [
        {
          name: product.short_name.slice(0, 50),
          price: product.price,
          quantity: 1,
        },
      ],
      customerDetail: {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        billingAddress: customerAddress,
        shippingAddress: customerAddress,
      },
      callbackUrl: `${baseUrl}/api/duitku/callback`,
      returnUrl: `${baseUrl}/checkout/return`,
      expiryPeriod,
    };

    const { error: insertError } = await supabase.from("checkout_transactions").insert({
      user_id: user.id,
      merchant_order_id: merchantOrderId,
      product_id: product.id,
      product_name: product.name,
      payment_method: "POP",
      amount: product.price,
      status: "pending",
      customer_name: customerName,
      email,
      phone,
      billing_address: address,
      raw_request: payload,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error("Checkout insert error:", insertError);
      return Response.json({ message: "Failed to process checkout. Please try again." }, { status: 500 });
    }

    const duitkuResponse = await fetch(createInvoiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-duitku-merchantcode": merchantCode,
        "x-duitku-timestamp": timestamp,
        "x-duitku-signature": signature,
      },
      body: JSON.stringify(payload),
    });

    const data = await duitkuResponse.json().catch(() => null);

    if (!duitkuResponse.ok || data?.statusCode !== "00") {
      await supabase
        .from("checkout_transactions")
        .update({
          status: "failed",
          result_code: data?.statusCode ?? null,
          raw_response: data,
        })
        .eq("merchant_order_id", merchantOrderId);

      return Response.json(
        {
          message: data?.statusMessage || data?.Message || "Duitku belum bisa membuat transaksi.",
        },
        { status: duitkuResponse.status || 502 }
      );
    }

    await supabase
      .from("checkout_transactions")
      .update({
        duitku_reference: data.reference ?? null,
        payment_url: data.paymentUrl ?? null,
        result_code: data.statusCode ?? null,
        raw_response: data,
      })
      .eq("merchant_order_id", merchantOrderId);

    return Response.json({
      merchantOrderId,
      reference: data.reference,
      statusCode: data.statusCode,
      statusMessage: data.statusMessage,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json(
      { message: "Checkout failed. Please try again." },
      { status: 500 }
    );
  }
}
