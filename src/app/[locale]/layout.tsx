import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { Sidebar } from "@/components/sidebar";

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-auto pt-16 md:pt-0">{children}</main>
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
  );
}

