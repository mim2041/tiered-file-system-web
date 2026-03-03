"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, Lock } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-messages";
import { resetPassword } from "@/services/auth";
import { AuthLayout } from "@/components/auth-layout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await resetPassword({ token, newPassword });
      toast.success("Password reset! Please sign in.");
      router.push("/login");
    } catch (err) { toast.error(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <AuthLayout title="New password" subtitle="Enter your reset token and choose a new password">
      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-10 sm:pl-11" placeholder="Reset token" value={token} onChange={e => setToken(e.target.value)} required />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input-field pl-10 sm:pl-11" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Updating…" : "Set New Password"}
        </button>
      </form>
    </AuthLayout>
  );
}

