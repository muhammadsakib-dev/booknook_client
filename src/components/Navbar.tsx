// Complete the Navbar component

"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../../public/data/nav_data";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-background/90 backdrop-blur-xs border-b border-border sticky top-0 z-40 transition-colors shadow-2xs hidden lg:block mb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation: Centered Links with Active Underline Indicator */}
        <div className="flex items-center justify-center h-12">
          <ul className="flex items-center gap-8 lg:gap-10 list-none m-0 p-0">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"? 
                    pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative py-1.5 block",
                      isActive
                        ? "text-primary font-bold"
                        : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all" />
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
