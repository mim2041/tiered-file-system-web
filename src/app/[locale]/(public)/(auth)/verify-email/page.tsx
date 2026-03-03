"use client";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Mail, ShieldCheck } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-messages";
import { resendVerifyEmail, verifyEmail } from "@/services/auth";
import { AuthLayout } from "@/components/auth-layout";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loadingResend, setLoadingResend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const onResend = async (e: FormEvent) => {
    e.preventDefault(); setLoadingResend(true);
    try { await resendVerifyEmail({ email }); toast.success("Verification email sent!"); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { setLoadingResend(false); }
  };

  const onVerify = async (e: FormEvent) => {
    e.preventDefault(); setLoadingVerify(true);
    try { await verifyEmail({ token }); toast.success("Email verified successfully!"); setToken(""); }
    catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { setLoadingVerify(false); }
  };

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the token from your inbox">
      <div className="space-y-4 sm:space-y-6">
        <form onSubmit={onResend} className="space-y-3 sm:space-y-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Resend verification</p>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-field pl-10 sm:pl-11" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" disabled={loadingResend} className="btn-secondary w-full">
            {loadingResend ? "Sending…" : "Resend Email"}
          </button>
        </form>

        <form onSubmit={onVerify} className="space-y-3 sm:space-y-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Enter token</p>
          <div className="relative">
            <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-field pl-10 sm:pl-11" placeholder="Verification token" value={token} onChange={e => setToken(e.target.value)} required />
          </div>
          <button type="submit" disabled={loadingVerify} className="btn-primary w-full">
            {loadingVerify ? "Verifying…" : "Verify Email"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

