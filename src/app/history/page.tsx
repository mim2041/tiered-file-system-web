"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { History, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { getApiErrorMessage } from "@/lib/error-messages";
import { getMySubscriptions } from "@/services/subscriptions";
import { Subscription } from "@/types/api";

function fmt(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function HistoryPage() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setItems(await getMySubscriptions()); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/10 to-slate-950 p-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Subscription History</h1>
              <p className="mt-1 text-sm text-slate-400">Timeline of your plan activations</p>
            </div>
            <button onClick={load} className="btn-secondary">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
            </div>
          ) : !items.length ? (
            <div className="card text-center py-16">
              <History size={40} className="mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 font-medium">No subscription history yet</p>
              <p className="mt-1 text-sm text-slate-600">Activate a plan to see your history here</p>
            </div>
          ) : (
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 h-full w-px bg-white/5" />

              {items.map((item) => {
                const pkg = item.package as Record<string, unknown> | undefined;
                const name = (pkg?.name as string) ?? item.packageName ?? item.packageId;
                const isActive = !item.endedAt;
                return (
                  <div key={item.id} className="relative pl-14">
                    {/* Dot */}
                    <div className={`absolute left-4 top-5 h-4 w-4 rounded-full border-2 ${isActive ? "border-indigo-400 bg-indigo-500/30" : "border-slate-600 bg-slate-700"}`} />

                    <div className="card glass-hover">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{name}</h3>
                            {isActive ? (
                              <span className="badge bg-emerald-500/20 text-emerald-400 gap-1">
                                <CheckCircle2 size={10} /> Active
                              </span>
                            ) : (
                              <span className="badge bg-slate-700/50 text-slate-400">Ended</span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock size={11} />
                              Started: {fmt(item.startedAt) ?? fmt(item.createdAt) ?? "—"}
                            </span>
                            {item.endedAt && (
                              <span className="flex items-center gap-1.5">
                                <Clock size={11} />
                                Ended: {fmt(item.endedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Plan details */}
                      {pkg && (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                          {[
                            { label: "Folders", val: pkg.maxFolders },
                            { label: "File Size", val: pkg.maxFileSizeMb ? `${pkg.maxFileSizeMb}MB` : null },
                            { label: "Total Files", val: pkg.totalFileLimit },
                          ].map(({ label, val }) => val != null && (
                            <div key={label} className="rounded-lg bg-white/5 px-3 py-2 text-center">
                              <p className="text-xs text-slate-500">{label}</p>
                              <p className="text-sm font-semibold text-slate-200">{String(val)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
