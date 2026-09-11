import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, error, options, id, ...props }: Props) {
  const inputId = id || label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="block text-sm" htmlFor={inputId}>
      <span className="mb-1.5 block font-medium text-slate-700">{label}</span>
      <select
        id={inputId}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-navy-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 ${
          error ? "border-rose-400" : "border-slate-200"
        }`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}
