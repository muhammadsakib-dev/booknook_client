"use client";

import { cn } from "cn";
import { Search } from "lucide-react";
import { useState } from "react";
import { CartSheet } from "@/components/header/CartSheet";
import { Logo } from "@/components/header/Logo";
import { MobileNavSheet } from "@/components/header/MobileNavSheet";
import { SearchBar } from "@/components/header/SearchBar";
import { SettingsPopover } from "@/components/header/SettingsPopover";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header
      className={cn(
        "w-full bg-background border-b border-border transition-colors",
        // Sticky on mobile & tablet (< lg), static on desktop (where Navbar is sticky)
        "sticky top-0 z-40 lg:static shadow-2xs lg:shadow-none",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 lg:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* 1. Left: Mobile Nav Sheet & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <MobileNavSheet />
            <Logo />
          </div>

          {/* 2. Center: Search Bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-xl mx-2 sm:mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* 3. Right: Mobile Search Toggle, Cart & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
            {/* Mobile Search Toggle (< md) */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="md:hidden text-foreground hover:text-primary transition-colors cursor-pointer"
              aria-label="Toggle search bar"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </Button>

            {/* Shopping Cart Sheet */}
            <CartSheet />

            {/* Settings & Theme Popover */}
            <SettingsPopover />
          </div>
        </div>

        {/* 4. Mobile Search Bar (Expandable on < md) */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-border animate-in fade-in slide-in-from-top-2 duration-150">
            <SearchBar variant="compact" />
          </div>
        )}
      </div>
    </header>
  );
}
