import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SoundProvider } from "@/components/sound-provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://domain-anda.com'),
  title: {
    default: "Muhamad Farhan | Portofolio",
    template: "%s | Muhamad Farhan"
  },
  description: "Personal website of Muhamad Farhan, a Full-stack Engineer.",
  keywords: ["Muhamad Farhan", "Portfolio", "Full-stack Engineer", "Web Developer", "Next.js", "React"],
  authors: [{ name: "Muhamad Farhan" }],
  creator: "Muhamad Farhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Muhamad Farhan | Portofolio",
    description: "Personal website of Muhamad Farhan, a Full-stack Engineer.",
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
    title: "Muhamad Farhan | Portofolio",
    description: "Personal website of Muhamad Farhan, a Full-stack Engineer.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SoundProvider>
            {children}
            <Toaster />
            <Analytics />
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

