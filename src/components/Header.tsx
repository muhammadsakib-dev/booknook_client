// Complete the Header component

"use client";

import { CartSheet } from "@/components/header/CartSheet";
import { Logo } from "@/components/header/Logo";
import { MobileNavSheet } from "@/components/header/MobileNavSheet";
import { SearchBar } from "@/components/header/SearchBar";
import { SettingsPopover } from "@/components/header/SettingsPopover";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-2xs lg:relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-4 md:h-18">
          {/* 1. Left: Mobile Navigation Drawer & Desktop Logo */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <MobileNavSheet />
            <div className="hidden lg:block">
              <Logo />
            </div>
          </div>

          {/* 2. Center (Mobile): Centered Brand Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
            <Logo />
          </div>

          {/* 3. Center (Desktop): Search Bar */}
          <div className="hidden flex-1 justify-center px-4 lg:flex lg:max-w-xl">
            <SearchBar />
          </div>

          {/* 4. Right: Borrow Bag (CartSheet) & Settings / Profile */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <CartSheet />
            <SettingsPopover />
          </div>
        </div>
      </div>
    </header>
  );
}
