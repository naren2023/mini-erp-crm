import type { ReactNode } from "react";
import { Button } from "./Button";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close dialog">
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
