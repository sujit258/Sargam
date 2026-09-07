"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Globe, Search, Heart } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Compass, exact: true },
    { href: "/languages", label: "Explore", icon: Globe },
    { href: "/songs", label: "Search", icon: Search },
    { href: "/favourites", label: "Library", icon: Heart },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-50 flex h-14 items-center justify-around border-t border-white/10 bg-background/95 backdrop-blur-xl px-2 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-all ${
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon
              className={`size-5 transition-transform ${
                isActive ? "stroke-[2.25] scale-110 text-primary" : "stroke-[1.75]"
              }`}
            />
            <span
              className={`text-[10px] tracking-tight ${
                isActive ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
