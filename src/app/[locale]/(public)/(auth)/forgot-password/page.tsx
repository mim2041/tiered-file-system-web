"use client";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-messages";
import { forgotPassword } from "@/services/auth";
import { AuthLayout } from "@/components/auth-layout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await forgotPassword({ email }); setSent(true); toast.success("Reset link sent to your email."); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Reset password" subtitle="We'll send a link to your inbox">
      {sent ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-5 text-center">
          <p className="text-sm font-semibold text-emerald-400">Check your email!</p>
          <p className="mt-1 text-xs text-slate-500">A reset link has been sent to <strong className="text-slate-300">{email}</strong></p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-field pl-11" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

