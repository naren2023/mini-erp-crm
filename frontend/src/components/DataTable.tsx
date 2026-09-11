import type { ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  emptyTitle,
  emptyDescription,
  emptyMessage,
}: {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyMessage?: string;
}) {
  if (loading) return <LoadingSpinner />;
  if (!data.length) return <EmptyState title={emptyTitle || emptyMessage || "No records"} description={emptyDescription || "There is nothing to show yet."} />;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`px-4 py-3 font-semibold ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 text-navy-900 ${column.className ?? ""}`}>
                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
