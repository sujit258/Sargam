import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import React from "react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className = "py-20 text-center",
}: EmptyStateProps) {
  return (
    <div className={className}>
      {Icon && <Icon className="mx-auto size-8 text-muted-foreground/40" />}
      {title && (
        <h3 className="mt-3 text-base font-serif font-medium text-foreground">
          {title}
        </h3>
      )}
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {message}
      </p>
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-block rounded-full border border-white/15 px-4 py-2 text-xs transition hover:bg-white/10"
            >
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              type="button"
              onClick={action.onClick}
              className="inline-block rounded-full border border-white/15 px-4 py-2 text-xs transition hover:bg-white/10 cursor-pointer"
            >
              {action.label}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
