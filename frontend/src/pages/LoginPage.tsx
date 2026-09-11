import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Button, FormInput } from "../components";

export function LoginPage() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      notify("Welcome back", "success");
      navigate("/dashboard");
    } catch (error) {
      notify((error as Error).message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-teal-400">Northline Distribution</p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">Mini ERP + CRM Operations Portal</h1>
          <p className="mt-4 max-w-md text-slate-300">
            One workspace for customers, inventory, and sales challans — with stock that never goes negative.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-2xl font-semibold">CRM</p>
            <p className="mt-1 text-slate-400">Follow-ups and GST-ready customer records</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-2xl font-semibold">Stock</p>
            <p className="mt-1 text-slate-400">IN/OUT movements with audit trail</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-2xl font-semibold">Challan</p>
            <p className="mt-1 text-slate-400">Draft first, confirm only when stock exists</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-navy-900">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Use the seeded demo accounts. Password: Password123!</p>
          <div className="mt-6 space-y-4">
            <FormInput label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <FormInput label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <Button className="mt-6 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </Button>
          <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-slate-500">
            <p>admin@example.com</p>
            <p>sales@example.com</p>
            <p>warehouse@example.com</p>
            <p>accounts@example.com</p>
          </div>
        </form>
      </div>
    </div>
  );
}
