import { classNames } from "../utils/format";

const tones: Record<string, string> = {
  LEAD: "bg-amber-50 text-amber-700 ring-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-200",
  DRAFT: "bg-sky-50 text-sky-700 ring-sky-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
  LOW_STOCK: "bg-rose-50 text-rose-700 ring-rose-200",
  IN_STOCK: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  RETAIL: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  WHOLESALE: "bg-teal-50 text-teal-800 ring-teal-200",
  DISTRIBUTOR: "bg-violet-50 text-violet-700 ring-violet-200",
  IN: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  OUT: "bg-orange-50 text-orange-700 ring-orange-200",
  ADMIN: "bg-navy-800 text-white ring-navy-800",
  SALES: "bg-teal-50 text-teal-800 ring-teal-200",
  WAREHOUSE: "bg-amber-50 text-amber-800 ring-amber-200",
  ACCOUNTS: "bg-slate-800 text-white ring-slate-800",
};

export function Badge({ value }: { value: string }) {
  return (
    <span className={classNames("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", tones[value] || "bg-slate-100 text-slate-700 ring-slate-200")}>
      {value.replaceAll("_", " ")}
    </span>
  );
}
