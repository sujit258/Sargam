import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import React from "react";

export interface SectionHeaderAction {
  label: string;
  href: string;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  badge?: React.ReactNode;
  action?: SectionHeaderAction | React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconClassName = "text-primary",
  badge,
  action,
  className = "mb-4",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`size-4 ${iconClassName}`} />}
          <h2 className="text-xl sm:text-2xl font-serif text-foreground">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div>
          {React.isValidElement(action) ? (
            action
          ) : typeof action === "object" && "href" in action && "label" in action ? (
            <Link
              href={(action as SectionHeaderAction).href}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              {(action as SectionHeaderAction).label} <ArrowRight className="size-3" />
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
