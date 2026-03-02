import { ReactNode } from "react";
import Link from "next/link";
import { Vault } from "lucide-react";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-700/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo mark */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-indigo-500/30">
            <Vault size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">VaultTier</span>
        </Link>

        <div className="card border border-white/10 shadow-2xl shadow-black/50">
          <h1 className="mb-1 text-2xl font-bold text-white">{title}</h1>
          <p className="mb-7 text-sm text-slate-400">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
