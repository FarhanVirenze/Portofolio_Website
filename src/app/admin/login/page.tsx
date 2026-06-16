"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Lock, Mail, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const initialState = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      className="w-full relative overflow-hidden group rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20"
      disabled={pending}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 font-semibold">
        {pending ? "Authenticating..." : "Secure Login"}
        {!pending && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </span>
      {/* Button hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
    </Button>
  );
}

export default function AdminLogin() {
  const [state, formAction] = useActionState(loginAction, initialState as any);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Aesthetic Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[20%] w-[25rem] h-[25rem] bg-indigo-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }} />

      {/* Main Login Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="backdrop-blur-2xl bg-card/60 border border-border/50 rounded-3xl p-8 shadow-2xl shadow-primary/10 relative overflow-hidden">
          
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-inner">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-mono mb-2">
              <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Farhan</span>();
            </h1>
            <p className="text-muted-foreground font-medium">Admin Access Portal</p>
          </div>

          <form action={formAction} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 relative">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Mail className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Admin Email"
                    required
                    className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Lock className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>
            
            <SubmitButton />
          </form>

        </div>
      </motion.div>
    </div>
  );
}
