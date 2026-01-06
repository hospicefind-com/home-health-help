"use client";

import { SerwistProvider } from "@serwist/turbopack/react";
import { useEffect } from "react";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Manually check if registration is being attempted
    if ("serviceWorker" in navigator) {
      console.log("PWA: Service Worker is supported by this browser.");
    }
  }, []);

  return (
    <SerwistProvider
      swUrl="/serwist/sw.js"
      // This tells Serwist to register automatically
      register={true}
    >
      {children}
    </SerwistProvider>
  );
}
