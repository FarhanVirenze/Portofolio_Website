"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SPLASH_SESSION_KEY = "farhan_splash_seen";

interface LoadingContextType {
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoaded: false,
  setIsLoaded: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "true";
  });

  useEffect(() => {
    // Prevent scrolling while loading
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoaded]);

  return (
    <LoadingContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
}
