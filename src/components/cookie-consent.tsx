"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper to set cookie
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${secureFlag}`;
}

export function CookieConsent({ hasConsented }: { hasConsented: boolean }) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Tampilkan banner hanya jika user belum pernah memberikan persetujuan (belum ada cookie)
    if (!hasConsented) {
      // Sedikit delay agar animasinya terasa lebih natural saat halaman baru di-load
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasConsented]);

  const accept = () => {
    setCookie("cookie_consent", "accepted", 365);
    setShow(false);
    // Soft refresh: hanya me-refresh data server (layout.tsx membaca cookie baru)
    // tanpa full page reload, sehingga splash screen tidak muncul ulang
    router.refresh();
  };

  const reject = () => {
    setCookie("cookie_consent", "rejected", 365);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-card border border-border shadow-2xl p-6 rounded-2xl z-50"
        >
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full shrink-0">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Privasi & Cookies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Website ini menggunakan cookie analitik (Google Analytics) untuk membantu kami memahami bagaimana Anda menggunakan situs ini. Apakah Anda menyetujuinya?
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <Button onClick={reject} variant="outline" className="w-full sm:w-auto">
              Tolak
            </Button>
            <Button onClick={accept} className="w-full sm:w-auto">
              Terima Cookies
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
