import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VaultTier – Tiered File System",
  description: "Subscription-based file & folder management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
