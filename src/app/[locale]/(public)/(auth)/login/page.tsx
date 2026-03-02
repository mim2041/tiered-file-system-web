"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { getApiErrorMessage } from "@/lib/error-messages";
import { loginCustomer } from "@/services/auth";
import { AuthLayout } from "@/components/auth-layout";

export default function LoginPage() {
  const router = useRouter();
  const { setToken, refreshMe } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { accessToken } = await loginCustomer({ email, password });
      setToken(accessToken);
      await refreshMe();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your VaultTier account">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-11" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-11" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <LogIn size={16} />}
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">Create one</Link>
      </p>
    </AuthLayout>
  );
}

