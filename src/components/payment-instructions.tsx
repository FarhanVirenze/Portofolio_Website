"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, QrCode, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/store";
import { getPaymentInstructionType, type DuitkuInquiryResponse } from "@/lib/duitku";

type PaymentInstructionsProps = {
  paymentMethod: string;
  paymentMethodName: string;
  amount: number;
  paymentUrl: string;
  duitkuData: DuitkuInquiryResponse | null;
};

export function PaymentInstructions({
  paymentMethod,
  paymentMethodName,
  amount,
  paymentUrl,
  duitkuData,
}: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const instructionType = getPaymentInstructionType(paymentMethod);
  const vaNumber = duitkuData?.vaNumber?.trim();
  const qrString = duitkuData?.qrString?.trim();
  const appUrl = duitkuData?.appUrl?.trim();
  const displayAmount = duitkuData?.amount ? Number(duitkuData.amount) : amount;

  const copyValue = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <div className="flex min-h-[680px] flex-col rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Instruksi Pembayaran</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{paymentMethodName}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Halaman Duitku tidak bisa ditampilkan di iframe. Ikuti instruksi di bawah ini atau buka halaman resmi Duitku.
        </p>
      </div>

      <div className="space-y-4">
        <AmountCard amount={displayAmount} />

        {instructionType === "virtual-account" && vaNumber && (
          <CopyCard
            label="Nomor Virtual Account"
            value={vaNumber}
            copied={copiedField === "va"}
            onCopy={() => copyValue("va", vaNumber)}
          />
        )}

        {instructionType === "qris" && qrString && (
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
              <QrCode className="h-4 w-4 text-primary" />
              Scan QRIS
            </div>
            <div className="mx-auto flex w-fit rounded-xl border border-border bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrString)}`}
                alt="QRIS pembayaran"
                width={240}
                height={240}
                className="h-60 w-60"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Buka aplikasi e-wallet atau mobile banking, pilih scan QRIS, lalu bayar sesuai nominal.
            </p>
          </div>
        )}

        {instructionType === "ewallet" && appUrl && (
          <div className="rounded-2xl border border-border bg-background p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Smartphone className="h-4 w-4 text-primary" />
              Lanjutkan di aplikasi
            </div>
            <a
              href={appUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              <ExternalLink className="h-4 w-4" />
              Buka aplikasi pembayaran
            </a>
          </div>
        )}

        <InstructionList type={instructionType} paymentMethodName={paymentMethodName} />
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <Button asChild size="lg" className="h-11 w-full gap-2 rounded-xl">
          <a href={paymentUrl} target="_blank" rel="noreferrer">
            <Wallet className="h-4 w-4" />
            Buka halaman pembayaran Duitku
          </a>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Status pembayaran akan diperbarui otomatis setelah Duitku mengirim callback ke server.
        </p>
      </div>
    </div>
  );
}

function AmountCard({ amount }: { amount: number }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Nominal transfer</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">{formatRupiah(amount)}</p>
      <p className="mt-2 text-sm text-muted-foreground">Transfer persis sesuai nominal di atas.</p>
    </div>
  );
}

function CopyCard({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="break-all font-mono text-2xl font-semibold tracking-wide text-foreground">{value}</p>
        <Button type="button" variant="outline" className="h-10 shrink-0 gap-2 rounded-xl" onClick={onCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Tersalin" : "Salin"}
        </Button>
      </div>
    </div>
  );
}

function InstructionList({
  type,
  paymentMethodName,
}: {
  type: ReturnType<typeof getPaymentInstructionType>;
  paymentMethodName: string;
}) {
  const steps =
    type === "virtual-account"
      ? [
          `Buka mobile banking atau ATM ${paymentMethodName.replace(" Virtual Account", "").replace("BRIVA", "BRI")}.`,
          "Pilih menu transfer ke Virtual Account.",
          "Masukkan nomor VA di atas dan transfer sesuai nominal.",
          "Simpan bukti transfer sampai status pesanan berubah menjadi lunas.",
        ]
      : type === "qris"
        ? [
            "Scan QR code di atas menggunakan aplikasi pembayaran.",
            "Pastikan nominal transaksi sudah benar sebelum konfirmasi.",
            "Selesaikan pembayaran sebelum waktu expired.",
          ]
        : type === "ewallet"
          ? [
              "Buka aplikasi e-wallet yang dipilih.",
              "Konfirmasi pembayaran sesuai nominal transaksi.",
              "Tunggu hingga status pesanan diperbarui otomatis.",
            ]
          : [
              "Buka halaman pembayaran Duitku untuk menyelesaikan transaksi.",
              "Ikuti langkah verifikasi sesuai metode yang dipilih.",
              "Kembali ke halaman pesanan untuk melihat status terbaru.",
            ];

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-sm font-medium text-foreground">Langkah pembayaran</p>
      <ol className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
