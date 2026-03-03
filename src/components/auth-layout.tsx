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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:py-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 sm:h-96 sm:w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-violet-700/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo mark */}
        <Link href="/" className="mb-6 sm:mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-indigo-500/30">
            <Vault size={16} className="text-white sm:w-4 sm:h-4" />
          </div>
          <span className="text-base sm:text-lg font-bold text-white">VaultTier</span>
        </Link>

        <div className="card border border-white/10 shadow-2xl shadow-black/50 p-5 sm:p-6">
          <h1 className="mb-1 text-xl sm:text-2xl font-bold text-white">{title}</h1>
          <p className="mb-5 sm:mb-7 text-xs sm:text-sm text-slate-400">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
