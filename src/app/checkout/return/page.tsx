import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

type CheckoutReturnPageProps = {
  searchParams: Promise<{
    merchantOrderId?: string;
    reference?: string;
    resultCode?: string;
  }>;
};

function getStatus(resultCode?: string) {
  if (resultCode === "00") {
    return {
      icon: CheckCircle2,
      title: "Pembayaran Berhasil",
      description: "Terima kasih, pembayaran Anda tercatat berhasil di halaman pembayaran Duitku.",
      tone: "text-emerald-500",
    };
  }

  if (resultCode === "02") {
    return {
      icon: XCircle,
      title: "Pembayaran Dibatalkan",
      description: "Transaksi belum selesai atau dibatalkan. Anda dapat kembali ke halaman produk untuk membuat checkout baru.",
      tone: "text-destructive",
    };
  }

  return {
    icon: Clock,
    title: "Pembayaran Diproses",
    description: "Status pembayaran masih diproses. Konfirmasi final akan diterima melalui callback server Duitku.",
    tone: "text-primary",
  };
}

export default async function CheckoutReturnPage({ searchParams }: CheckoutReturnPageProps) {
  const params = await searchParams;
  const status = getStatus(params.resultCode);
  const StatusIcon = status.icon;

  return (
    <main className="min-h-screen bg-background px-6 py-24 text-foreground md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-10">
        <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted ${status.tone}`}>
          <StatusIcon className="h-8 w-8" />
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Duitku API V2</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{status.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{status.description}</p>

        <dl className="mt-8 grid w-full grid-cols-1 gap-3 text-left text-sm md:grid-cols-2">
          <div className="rounded-xl border border-border/70 p-4">
            <dt className="text-xs uppercase tracking-widest text-muted-foreground">Order ID</dt>
            <dd className="mt-1 break-words font-medium text-foreground">{params.merchantOrderId || "-"}</dd>
          </div>
          <div className="rounded-xl border border-border/70 p-4">
            <dt className="text-xs uppercase tracking-widest text-muted-foreground">Reference</dt>
            <dd className="mt-1 break-words font-medium text-foreground">{params.reference || "-"}</dd>
          </div>
        </dl>

        <Link
          href="/#products"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Kembali ke Produk
        </Link>
      </div>
    </main>
  );
}
