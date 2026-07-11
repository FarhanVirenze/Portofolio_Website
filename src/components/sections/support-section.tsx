import { Headphones, Mail, MapPin, Phone } from "lucide-react";
import { supportContact } from "@/lib/store";

export function SupportSection() {
  return (
    <section id="support" className="relative z-10 w-full bg-background py-20">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Kontak Support</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Bantuan Pembelian
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Hubungi support untuk bantuan transaksi, konsultasi produk, atau konfirmasi pembayaran.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a
              href={`mailto:${supportContact.email}`}
              className="flex items-start gap-3 rounded-xl border border-border/70 p-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">Email</span>
                {supportContact.email}
              </span>
            </a>
            <a
              href="https://wa.me/6287817184079"
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-xl border border-border/70 p-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">Telepon</span>
                {supportContact.phone}
              </span>
            </a>
            <div className="flex items-start gap-3 rounded-xl border border-border/70 p-4 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground">Alamat Usaha</span>
                {supportContact.address}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
