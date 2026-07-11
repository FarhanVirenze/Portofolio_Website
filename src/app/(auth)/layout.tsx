import { GsapProvider } from "@/components/gsap-provider";
import { LoadingProvider } from "@/components/loading-provider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LoadingProvider>
      <GsapProvider>
        <main className="flex-1 w-full">
          {children}
        </main>
      </GsapProvider>
    </LoadingProvider>
  );
}
