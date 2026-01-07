"use client"

import { Toast } from "@base-ui-components/react";
import { ThemeProvider } from "next-themes";
import GlobalToast from "../components/base-ui/globalToast";
import { toastManager } from "@/lib/toast";
import { SerwistProvider } from "@serwist/turbopack/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider swUrl="/serwist/sw.js">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toast.Provider toastManager={toastManager} timeout={2000}>
          {children}
          <GlobalToast />
        </Toast.Provider>
      </ThemeProvider>
    </SerwistProvider>
  );
}
