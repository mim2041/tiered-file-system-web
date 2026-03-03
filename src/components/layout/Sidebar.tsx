"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FolderOpen,
  History,
  LogOut,
  LogIn,
  UserPlus,
  Vault,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { useState } from "react";

const publicLinks = [
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/register", label: "Register", icon: UserPlus },
];

const privateLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/packages", label: "Packages", icon: Layers },
  { href: "/explorer", label: "Explorer", icon: FolderOpen },
  { href: "/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout, me } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthPage = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"].includes(pathname);
  if (isAuthPage) return null;

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 text-white md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-[35] flex h-screen w-64 flex-col border-r border-white/5 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 transition-transform duration-300 md:sticky md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-brand">
          <Vault size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">VaultTier</p>
          <p className="text-xs text-indigo-400">File System</p>
        </div>
      </div>

      {/* User pill */}
      {token && me?.user && (
        <div className="mx-4 mt-4 rounded-xl glass px-4 py-3">
          <p className="truncate text-xs font-semibold text-slate-200">{me.user.name ?? me.user.email}</p>
          <p className="truncate text-xs text-slate-500">{me.user.email}</p>
          {me.activeSubscription && (
            <span className="badge mt-1.5 bg-indigo-500/20 text-indigo-300">
              {(me.activeSubscription.package as { name?: string })?.name ??
                me.activeSubscription.packageName ??
                "Active Plan"}
            </span>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {(token ? privateLinks : publicLinks).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === href
                ? "gradient-brand text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {token ? (
        <button
          type="button"
          onClick={() => { logout(); handleNavClick(); router.push("/login"); }}
          className="mx-4 mb-6 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={17} />
          Logout
        </button>
      ) : null}
    </aside>
    </>
  );
}

