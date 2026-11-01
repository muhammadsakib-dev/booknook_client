"use client";

import { cn } from "cn";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SearchBar } from "@/components/header/SearchBar";
import { navItems } from "../../../public/data/nav_data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type Theme, useTheme } from "@/hooks/use-theme";
import { signOut, useSession } from "@/lib/auth-client";

const THEME_OPTIONS: { label: string; value: Theme }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export function MobileNavSheet() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground hover:text-primary -ml-2 cursor-pointer"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div className="flex flex-col space-y-6">
          {/* Drawer Header */}
          <SheetHeader className="p-0 pb-3 border-b border-border">
            <SheetTitle className="text-xl font-black tracking-tight text-foreground flex items-center">
              Book<span className="text-primary">Nook</span>
            </SheetTitle>
          </SheetHeader>

          {/* Search Bar in Mobile Menu */}
          <div className="pt-1">
            <SearchBar onSearchSubmit={() => setOpen(false)} />
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-between",
                      isActive
                        ? "bg-primary-subtle text-primary font-semibold"
                        : "text-foreground hover:bg-muted hover:text-primary",
                    )}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <Separator />

          {/* Theme Selector Section */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
              Theme
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={theme === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(opt.value)}
                  className="text-xs cursor-pointer capitalize"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Account Section */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
              Account
            </h4>
            <div className="flex flex-col space-y-2 text-sm px-2">
              {session?.user ? (
                <>
                  <div className="py-1">
                    <p className="font-bold text-foreground truncate">
                      {session.user.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      setOpen(false);
                      await signOut();
                      window.location.reload();
                    }}
                    className="text-destructive font-semibold text-left py-1 hover:underline cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-foreground hover:text-primary transition-colors py-1"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="text-foreground hover:text-primary transition-colors py-1"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-border text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
