import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/ui/particle-background";
import { GsapProvider } from "@/components/gsap-provider";
import { LoadingProvider } from "@/components/loading-provider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadingProvider>
      <GsapProvider>
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </GsapProvider>
    </LoadingProvider>
  );
}
