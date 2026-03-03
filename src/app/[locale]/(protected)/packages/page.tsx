"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Zap, CheckCircle2, Folder, FileText, HardDrive,
  Layers, RefreshCw, Crown,
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/contexts/auth-context";
import { getApiErrorMessage } from "@/lib/error-messages";
import { getPackages } from "@/services/packages";
import { activateSubscription } from "@/services/subscriptions";
import { PackagePlan } from "@/types/api";
import { cn } from "@/lib/utils";

const planGradients: Record<string, string> = {
  free: "from-slate-700 to-slate-600",
  silver: "from-slate-500 to-slate-400",
  gold: "from-amber-600 to-yellow-500",
  diamond: "from-indigo-600 to-violet-500",
};
const planIcons: Record<string, React.ElementType> = {
  free: Zap,
  silver: Layers,
  gold: Crown,
  diamond: Crown,
};

export default function PackagesPage() {
  const { refreshMe, me } = useAuth();
  const [items, setItems] = useState<PackagePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await getPackages()); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onActivate = async (packageId: string) => {
    setActivatingId(packageId);
    try {
      await activateSubscription({ packageId });
      await refreshMe();
      toast.success("Subscription activated!");
    } catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { setActivatingId(null); }
  };

  const activePkgId = (me?.activeSubscription?.package as { id?: string })?.id
    ?? me?.activeSubscription?.packageId;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/10 to-slate-950 px-4 py-6 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Subscription Plans</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 line-clamp-2">Choose the plan that fits your needs. Switch anytime — existing data is preserved.</p>
            </div>
            <button onClick={load} className="btn-secondary w-full sm:w-auto text-xs sm:text-sm">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => {
                const slug = item.slug ?? item.name?.toLowerCase() ?? "free";
                const gradient = planGradients[slug] ?? planGradients.free;
                const Icon = planIcons[slug] ?? Zap;
                const isActive = item.id === activePkgId;
                const isActivating = activatingId === item.id;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "card flex flex-col gap-4 sm:gap-5 transition-all duration-300 glass-hover p-4 sm:p-6",
                      isActive && "ring-2 ring-indigo-500/60 shadow-lg shadow-indigo-500/10",
                    )}
                  >
                    {/* Header */}
                    <div>
                      <div className={cn("mb-3 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br", gradient)}>
                        <Icon size={16} className="text-white sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-white truncate">{item.name}</h2>
                        {isActive && <span className="badge bg-indigo-500/20 text-indigo-300 text-[9px] sm:text-[10px]">Active</span>}
                      </div>
                      {item.description && <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.description}</p>}
                    </div>

                    {/* Limits */}
                    <ul className="flex-1 space-y-1.5 sm:space-y-2 text-xs">
                      {[
                        { icon: Folder, label: "Max Folders", val: item.maxFolders },
                        { icon: Layers, label: "Nesting Levels", val: item.maxNestingLevel },
                        { icon: HardDrive, label: "Max File Size", val: item.maxFileSizeMb ? `${item.maxFileSizeMb} MB` : undefined },
                        { icon: FileText, label: "Total Files", val: item.totalFileLimit },
                        { icon: FileText, label: "Per Folder", val: item.filesPerFolderLimit },
                      ].map(({ icon: I, label, val }) => val !== undefined && (
                        <li key={label} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2">
                          <span className="flex items-center gap-1.5 text-slate-500"><I size={11} className="flex-shrink-0" /><span className="truncate">{label}</span></span>
                          <span className="font-semibold text-slate-200 text-right">{String(val)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* File types */}
                    {item.allowedFileTypes?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {item.allowedFileTypes.map((t: string) => (
                          <span key={t} className="badge bg-slate-700/50 text-slate-400 text-[9px] sm:text-[10px]">
                            {t.split("/")[1] ?? t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      disabled={isActive || isActivating}
                      onClick={() => onActivate(item.id)}
                      className={cn(
                        "w-full rounded-xl py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all",
                        isActive
                          ? "cursor-default bg-indigo-500/20 text-indigo-300"
                          : "btn-primary",
                      )}
                    >
                      {isActivating ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span className="hidden sm:inline">Activating…</span>
                        </span>
                      ) : isActive ? (
                        <span className="inline-flex items-center justify-center gap-1.5"><CheckCircle2 size={14} /><span className="hidden sm:inline">Current Plan</span></span>
                      ) : (
                        "Activate Plan"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

