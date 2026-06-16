import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 pt-24 md:pt-32 px-4 max-w-7xl w-full mx-auto pb-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
