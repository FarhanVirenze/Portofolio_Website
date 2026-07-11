import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SoundProvider } from "@/components/sound-provider";
import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";
import { CookieConsent } from "@/components/cookie-consent";
import { GoogleAnalytics } from '@next/third-parties/google';
import { LenisProvider } from "@/components/lenis-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-inter", // Keep variable name same so we don't break Tailwind config if it uses it
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://xffarhans.my.id'),
  title: {
    default: "Muhamad Farhan | Produk Digital & Portofolio",
    template: "%s | Muhamad Farhan"
  },
  description: "Website Muhamad Farhan untuk portofolio, produk jasa pembuatan website, checkout, dan pembayaran online via Duitku Sandbox.",
  keywords: ["Muhamad Farhan", "Portfolio", "Produk Digital", "Jasa Website", "Checkout Duitku", "Web Developer", "Next.js", "React"],
  authors: [{ name: "Muhamad Farhan" }],
  creator: "Muhamad Farhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Muhamad Farhan | Produk Digital & Portofolio",
    description: "Portofolio dan produk jasa pembuatan website dengan checkout pembayaran online.",
    siteName: "Muhamad Farhan Portfolio",
    images: [
      {
        url: "/img/og-image.jpg", // Pastikan Anda memiliki gambar ini di public/img/og-image.jpg (opsional)
        width: 1200,
        height: 630,
        alt: "Muhamad Farhan | Portofolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhamad Farhan | Produk Digital & Portofolio",
    description: "Portofolio dan produk jasa pembuatan website dengan checkout pembayaran online.",
    creator: "@farhan", // Ganti dengan handle twitter jika ada
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("cookie_consent")?.value;
  const hasConsented = consentCookie !== undefined;
  const isAccepted = consentCookie === "accepted";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <SoundProvider>
            <LenisProvider>
              {children}
              <Toaster />
              <Analytics />
              {isAccepted && process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
              <CookieConsent hasConsented={hasConsented} />
            </LenisProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
