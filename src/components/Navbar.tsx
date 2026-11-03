// OK
"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../../public/data/nav_data";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 mb-5 hidden w-full border-b border-border bg-white  backdrop-blur-xs transition-colors lg:block shadow-2xl shadow-white">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation: Centered Links with Active Underline Indicator */}

        <div className="flex h-12 items-center justify-center">
          <ul className="flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block py-1.5 text-sm font-medium transition-colors hover:text-primary",
                      isActive
                        ? "font-bold text-primary"
                        : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary transition-all" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </div>

    </nav>
  );
}
