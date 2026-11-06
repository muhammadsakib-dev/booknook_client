// OK

"use client";

import { cn } from "cn";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SearchBar } from "@/components/header/SearchBar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { navItems } from "../../../public/data/nav_data";

export function MobileNavSheet() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const visibleItems = navItems;

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
            <Menu className="w-6! h-6! stroke-3" />
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
              {visibleItems.map((item) => {
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

          {/* Account Section */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
              Account
            </h4>
            <div className="flex flex-col space-y-2 text-sm px-2">
              {isPending ? (
                <div className="py-2 text-xs text-muted-foreground animate-pulse">
                  Verifying account...
                </div>
              ) : session?.user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="p-2.5 rounded-xl bg-muted/40 text-xs mb-1 block hover:bg-muted transition-colors border border-border/50 group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {session.user.name}
                      </p>
                      <span className="text-[10px] bg-primary/10 text-primary font-semibold px-1.5 py-0.5 rounded-md">
                        Profile
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate text-xs mt-0.5">
                      {session.user.email}
                    </p>
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setOpen(false);
                      toast.success("Signed out successfully.");
                      await signOut();
                      window.location.reload();
                    }}
                    className="text-destructive font-semibold text-left py-1 text-xs hover:underline cursor-pointer"
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
