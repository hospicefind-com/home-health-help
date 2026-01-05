import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Dongle } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/base-ui/navbar";
import Providers from "@/app/providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Find Hospices",
  description: "The best way to find the hospice that's right for you.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const dongle = Dongle({
  weight: "400",
  variable: "--font-dongle",
  subsets: ["latin"],
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${dongle.className} antialiased root`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
