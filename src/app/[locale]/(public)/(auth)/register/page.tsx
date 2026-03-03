"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-messages";
import { registerCustomer } from "@/services/auth";
import { AuthLayout } from "@/components/auth-layout";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerCustomer({ name, email, password });
      toast.success("Account created! Check your email to verify.");
      setName(""); setEmail(""); setPassword("");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Start managing your files with VaultTier">
      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-10 sm:pl-11" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-10 sm:pl-11" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-10 sm:pl-11" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <UserPlus size={16} />}
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
      <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

