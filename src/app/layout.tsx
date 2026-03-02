import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "VaultTier – Tiered File System",
  description: "Subscription-based file & folder management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(15,16,32,0.95)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#e2e8f0",
                backdropFilter: "blur(16px)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
