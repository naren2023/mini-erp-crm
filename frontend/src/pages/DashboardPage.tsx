import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/dashboard.service";
import type { DashboardData } from "../types";
import { Badge, LoadingSpinner } from "../components";
import { formatDate } from "../utils/format";
import { useToast } from "../context/ToastContext";

export function DashboardPage() {
  const { notify } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((error) => notify(error.message, "error"))
      .finally(() => setLoading(false));
  }, [notify]);

  if (loading || !data) return <LoadingSpinner label="Loading dashboard" />;

  const cards = [
    { label: "Total customers", value: data.cards.totalCustomers, hint: "Active CRM records" },
    { label: "Total products", value: data.cards.totalProducts, hint: "SKU catalogue" },
    { label: "Low stock products", value: data.cards.lowStockProducts, hint: "At or below minimum" },
    { label: "Total challans", value: data.cards.totalChallans, hint: "Draft + confirmed" },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-navy-900">{card.value}</p>
            <p className="mt-2 text-xs text-slate-400">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Recent challans</h2>
            <Link className="text-sm text-teal-700" to="/challans">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentChallans.map((challan) => (
              <Link key={challan.id} to={`/challans/${challan.id}`} className="block rounded-xl border border-slate-100 p-3 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{challan.challanNumber}</p>
                  <Badge value={challan.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{challan.customer?.businessName}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Low stock</h2>
            <Link className="text-sm text-teal-700" to="/inventory">
              Inventory
            </Link>
          </div>
          <div className="space-y-3">
            {data.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/40 p-3">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.sku}</p>
                </div>
                <p className="text-sm font-semibold text-rose-700">
                  {product.currentStock}/{product.minimumStock}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-navy-900">Customer follow-ups</h2>
          <div className="space-y-3">
            {data.followUps.map((customer) => (
              <Link key={customer.id} to={`/customers/${customer.id}`} className="block rounded-xl border border-slate-100 p-3 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{customer.name}</p>
                  <Badge value={customer.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {customer.businessName} · {formatDate(customer.followUpDate)}
                </p>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
