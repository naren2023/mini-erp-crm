import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CustomersPage, CustomerDetailPage, CustomerFormPage, CustomerEditPage } from "./pages/CustomersPage";
import { ProductsPage, ProductDetailPage, ProductFormPage } from "./pages/ProductsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ChallansPage, ChallanDetailPage, ChallanFormPage } from "./pages/ChallansPage";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute allowedRoles={["ADMIN","SALES","WAREHOUSE","ACCOUNTS"]} />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customers/new" element={<CustomerFormPage />} />
                <Route path="/customers/:id" element={<CustomerDetailPage />} />
                <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<ProductFormPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/products/:id/edit" element={<ProductFormPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/challans" element={<ChallansPage />} />
                <Route path="/challans/new" element={<ChallanFormPage />} />
                <Route path="/challans/:id" element={<ChallanDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-navy-900">Workspace settings</h2>
        <p className="mt-1 text-sm text-slate-500">Current environment and access information.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Application" value="Northline ERP + CRM" />
          <Info label="API" value={import.meta.env.VITE_API_URL || "http://localhost:4000/api"} />
          <Info label="Signed in as" value={user?.email || "—"} />
          <Info label="Role" value={user?.role || "—"} />
        </div>
      </section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="font-semibold text-amber-900">Demo accounts</p>
        <p className="mt-1 text-sm text-amber-800">Password: Password123!</p>
        <p className="mt-2 text-sm text-amber-800">admin@example.com · sales@example.com · warehouse@example.com · accounts@example.com</p>
      </section>
    </div>
  );
}
function Info({label,value}:{label:string;value:string}) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-all font-medium text-navy-900">{value}</p></div>;
}
