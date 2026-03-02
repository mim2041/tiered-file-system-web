import Link from "next/link";
import { ArrowRight, FolderOpen, Layers, Shield } from "lucide-react";

export default function HomePage() {
  const features = [
    { icon: Shield, title: "Tiered Access Control", desc: "Free, Silver, Gold, Diamond plans enforcing folder/file limits per user." },
    { icon: Layers, title: "Smart Subscriptions", desc: "Switch plans anytime. Existing data preserved, new limits apply instantly." },
    { icon: FolderOpen, title: "Full File Manager", desc: "Nested folders, file uploads, rename, delete with per-plan enforcement." },
  ];
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950">
      {/* Hero */}
      <div className="max-w-2xl text-center">
        <span className="badge bg-indigo-500/15 text-indigo-400 mb-4 px-3 py-1 text-xs uppercase tracking-widest">SaaS Storage Platform</span>
        <h1 className="mt-4 text-5xl font-bold leading-tight">
          <span className="gradient-text">Tiered File</span>
          <br />Management System
        </h1>
        <p className="mt-5 text-lg text-slate-400 leading-relaxed">
          Subscription-based storage where your plan determines every action. Upgrade anytime to unlock deeper folders, larger files, and more storage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
            Get Started <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn-secondary px-8 py-3.5 text-base">
            Sign In
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mt-20 grid w-full max-w-4xl gap-5 md:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card glass-hover group text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-brand opacity-90 group-hover:opacity-100 transition-opacity">
              <Icon size={22} className="text-white" />
            </div>
            <h3 className="mb-2 text-sm font-semibold text-slate-100">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
