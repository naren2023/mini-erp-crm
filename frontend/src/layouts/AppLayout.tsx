import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Badge, Button } from "../components";
import { useState } from "react";
import type { Role } from "../types";

const nav: Array<{to:string;label:string;roles:Role[]}> = [
  { to: "/dashboard", label: "Dashboard", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
  { to: "/customers", label: "Customers", roles: ["ADMIN", "SALES", "ACCOUNTS"] },
  { to: "/products", label: "Products", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
  { to: "/inventory", label: "Inventory", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
  { to: "/challans", label: "Sales Challans", roles: ["ADMIN", "SALES", "ACCOUNTS"] },
  { to: "/settings", label: "Settings", roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
] as const;

const titles: Record<string, string> = {
  "/dashboard": "Operations overview",
  "/customers": "Customer CRM",
  "/customers/new": "Add customer",
  "/products": "Product catalogue",
  "/products/new": "Add product",
  "/inventory": "Inventory control",
  "/challans": "Sales challans",
  "/challans/new": "Create challan",
  "/settings": "Workspace settings",
};

export function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const title =
    titles[location.pathname] ||
    (location.pathname.startsWith("/customers")
      ? "Customer details"
      : location.pathname.startsWith("/products")
        ? "Product details"
        : location.pathname.startsWith("/challans")
          ? "Challan details"
          : "Northline ERP");

  const links = nav.filter((item) => user && item.roles.includes(user.role as Role));

  return (
    <div className="min-h-screen bg-[#f3f6fb] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className={`bg-navy-900 text-slate-200 lg:block ${open ? "block" : "hidden"} lg:min-h-screen`}>
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 font-bold text-white">N</div>
          <div>
            <p className="text-sm font-semibold text-white">Northline ERP</p>
            <p className="text-xs text-slate-400">Wholesale operations</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-navy-800 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
              ☰
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Mini ERP + CRM</p>
              <h1 className="text-base font-semibold text-navy-900">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-navy-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Badge value={user.role} />
                <Button
                  variant="secondary"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : null}
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
