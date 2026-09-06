"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Search, Radio, Heart } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Discover", icon: Compass, exact: true },
    { href: "/songs", label: "Search", icon: Search },
    { href: "/station/top-300", label: "Stations", icon: Radio },
    { href: "/favourites", label: "Library", icon: Heart },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-30 flex h-14 items-center justify-around border-t border-white/10 bg-background/95 backdrop-blur-lg px-2 lg:hidden"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`size-5 ${isActive ? "stroke-[2.25]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
