import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/ui/particle-background";
import { GsapProvider } from "@/components/gsap-provider";
import { LoadingProvider } from "@/components/loading-provider";
import { SplashScreen } from "@/components/splash-screen";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadingProvider>
      <GsapProvider>
        <SplashScreen />
        <ParticleBackground />
        <Navbar />
        <main className="flex-1 pt-24 md:pt-32 px-4 max-w-7xl w-full mx-auto pb-20">
          {children}
        </main>
        <Footer />
      </GsapProvider>
    </LoadingProvider>
  );
}
