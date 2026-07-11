"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

let hasSeenSplashInRuntime = false;

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
  const [isLoaded, setIsLoadedState] = useState(hasSeenSplashInRuntime);

  const setIsLoaded = (loaded: boolean) => {
    if (loaded) {
      hasSeenSplashInRuntime = true;
    }

    setIsLoadedState(loaded);
  };

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
