import type { ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "../utils/format";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: Props) {
  const styles = {
    primary: "bg-teal-600 text-white hover:bg-teal-500 disabled:bg-teal-600/50",
    secondary: "bg-white text-navy-800 ring-1 ring-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
  }[variant];

  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed",
        styles,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
