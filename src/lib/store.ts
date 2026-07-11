export type Product = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  timeline: string;
  includes: string[];
};

export type PaymentMethod = {
  code: string;
  name: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "landing-page",
    name: "Landing Page Bisnis",
    shortName: "Landing Page",
    description:
      "Halaman promosi responsif untuk produk, event, atau jasa dengan copywriting ringkas, desain modern, dan optimasi tampilan mobile.",
    price: 10000,
    timeline: "3-5 hari kerja",
    includes: ["1 halaman utama", "Form kontak", "SEO dasar", "Deploy ke hosting"],
  },
  {
    id: "company-profile",
    name: "Website Company Profile",
    shortName: "Company Profile",
    description:
      "Website profil usaha lengkap untuk menampilkan layanan, portofolio, informasi kontak, dan kredibilitas brand secara profesional.",
    price: 1500000,
    timeline: "7-10 hari kerja",
    includes: ["Hingga 5 halaman", "Galeri/portofolio", "Integrasi WhatsApp", "SEO dasar"],
  },
  {
    id: "custom-web-app",
    name: "Aplikasi Web Custom",
    shortName: "Web App",
    description:
      "Pengembangan aplikasi web sesuai kebutuhan operasional seperti dashboard admin, katalog, booking, atau sistem internal sederhana.",
    price: 3500000,
    timeline: "14-21 hari kerja",
    includes: ["Dashboard admin", "Database", "Autentikasi", "Dokumentasi singkat"],
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    code: "VC",
    name: "Kartu Kredit",
    description: "Visa / MasterCard / JCB",
  },
  {
    code: "BC",
    name: "BCA Virtual Account",
    description: "Pembayaran melalui VA BCA",
  },
  {
    code: "M2",
    name: "Mandiri Virtual Account",
    description: "Pembayaran melalui VA Mandiri",
  },
  {
    code: "I1",
    name: "BNI Virtual Account",
    description: "Pembayaran melalui VA BNI",
  },
  {
    code: "BR",
    name: "BRIVA",
    description: "Pembayaran melalui BRI Virtual Account",
  },
  {
    code: "SP",
    name: "QRIS ShopeePay",
    description: "Pembayaran QRIS",
  },
];

export const supportContact = {
  email: "farhanvirenze18@gmail.com",
  phone: "+62 878-1718-4079",
  address: "Jl. Patriot Bangsa, Tamantirto, Kasihan, Bantul, Daerah Istimewa Yogyakarta",
};

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function findProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

export function findPaymentMethod(code: string) {
  return paymentMethods.find((method) => method.code === code);
}
