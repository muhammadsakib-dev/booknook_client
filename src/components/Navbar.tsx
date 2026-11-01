"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "w-full bg-background/95 backdrop-blur-xs border-b border-border sticky top-0 z-40 transition-colors shadow-2xs hidden lg:block",
        className,
      )}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation: Centered Links with Active Underline Indicator */}
        <div className="flex items-center justify-center h-12">
          <ul className="flex items-center gap-8 lg:gap-10 list-none m-0 p-0">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative py-3 block",
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
