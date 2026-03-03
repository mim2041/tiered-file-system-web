"use client";
import { toast } from "sonner";
import {
  User, Layers, FolderOpen, CheckCircle2, AlertCircle,
  RefreshCw, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { getApiErrorMessage } from "@/lib/error-messages";

export default function DashboardPage() {
  const { me, refreshMe, loading } = useAuth();

  const onRefresh = async () => {
    try { await refreshMe(); toast.success("Profile refreshed"); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
  };

  const plan = me?.activeSubscription;
  const pkg = plan?.package as Record<string, unknown> | undefined;

  const stats = [
    { label: "Max Folders", value: pkg?.maxFolders ?? "—", icon: FolderOpen },
    { label: "Max Nesting", value: pkg?.maxNestingLevel ? `Level ${pkg.maxNestingLevel}` : "—", icon: Layers },
    { label: "Max File Size", value: pkg?.maxFileSizeMb ? `${pkg.maxFileSizeMb} MB` : "—", icon: Layers },
    { label: "Total Files", value: pkg?.totalFileLimit ?? "—", icon: Layers },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/10 to-slate-950 px-4 py-6 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Welcome back{me?.user?.name ? `, ${me.user.name.split(" ")[0]}` : ""}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">Here&apos;s your account overview</p>
            </div>
            <button onClick={onRefresh} className="btn-secondary gap-2 w-full sm:w-auto text-sm">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* User + Plan cards */}
          <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
            {/* Profile card */}
            <div className="card space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl gradient-brand flex-shrink-0">
                  <User size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Account</p>
                  <p className="font-semibold text-white truncate text-sm sm:text-base">{me?.user?.name ?? "—"}</p>
                </div>
              </div>
              <div className="space-y-2 rounded-xl bg-white/5 p-3 sm:p-4 text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-200 truncate text-right">{me?.user?.email ?? "—"}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">Role</span>
                  <span className="badge bg-slate-700/50 text-slate-300 text-xs">{me?.user?.role ?? "USER"}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-500">Email Verified</span>
                  {me?.user?.isVerified ? (
                    <span className="badge bg-emerald-500/20 text-emerald-400 gap-1 text-xs"><CheckCircle2 size={11} /> Verified</span>
                  ) : (
                    <span className="badge bg-amber-500/20 text-amber-400 gap-1 text-xs"><AlertCircle size={11} /> Pending</span>
                  )}
                </div>
              </div>
              {!me?.user?.isVerified && (
                <Link href="/verify-email" className="btn-secondary w-full text-xs">
                  Verify Email →
                </Link>
              )}
            </div>

            {/* Plan card */}
            <div className="card space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-violet-500/20 flex-shrink-0">
                  <Layers size={18} className="text-violet-400 sm:w-5 sm:h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Active Plan</p>
                  <p className="font-semibold text-white truncate text-sm sm:text-base">
                    {(pkg?.name as string) ?? plan?.packageName ?? "No active plan"}
                  </p>
                </div>
              </div>

              {plan ? (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {stats.map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-white/5 p-2 sm:p-3">
                      <p className="text-xs text-slate-500 truncate">{label}</p>
                      <p className="mt-0.5 text-sm sm:text-base font-semibold text-slate-100">{String(value)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm">
                  <p className="font-semibold text-amber-400">No active subscription</p>
                  <p className="mt-1 text-xs text-slate-500">Choose a plan to start managing files and folders.</p>
                </div>
              )}

              <Link href="/packages" className="btn-primary w-full text-xs sm:text-sm">
                {plan ? "Switch Plan" : "Choose a Plan"}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="mb-3 sm:mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Quick Actions</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { href: "/packages", label: "View Plans", desc: "Upgrade or change subscription", icon: Layers, color: "text-violet-400" },
                { href: "/explorer", label: "File Explorer", desc: "Manage folders and files", icon: FolderOpen, color: "text-indigo-400" },
                { href: "/history", label: "Subscription History", desc: "View plan timeline", icon: Layers, color: "text-emerald-400" },
              ].map(({ href, label, desc, icon: Icon, color }) => (
                <Link key={href} href={href} className="card glass-hover flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-4">
                  <Icon size={20} className={`${color} flex-shrink-0 hidden sm:block`} />
                  <Icon size={18} className={`${color} flex-shrink-0 sm:hidden`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100">{label}</p>
                    <p className="text-xs text-slate-500 truncate">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

