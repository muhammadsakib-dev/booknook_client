"use client";

import { CartSheet } from "@/components/header/CartSheet";
import { Logo } from "@/components/header/Logo";
import { MobileNavSheet } from "@/components/header/MobileNavSheet";
import { SearchBar } from "@/components/header/SearchBar";
import { SettingsPopover } from "@/components/header/SettingsPopover";

export function Header() {
  return (
    <header className="w-full border-b bg-background sticky top-0 z-40 lg:static">
      <div className="max-w-7xl mx-auto max-sm:px-6 lg:px-0">
        <div className="flex items-center max-sm:h-15 md:h-18 md:px-6 max-sm:px-0 justify-between">
          {/* 1. Left: Mobile Navigation Drawer & Desktop Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <MobileNavSheet />
            {/* Desktop / Tablet Logo (hidden on mobile, shown on md and up) */}
            <div className="hidden lg:block">
              <Logo />
            </div>
          </div>

          {/* 2. Mobile Center: Logo is perfectly centered on mobile screens (< md) */}
          <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <Logo />
          </div>

          {/* 3. Center: Clean Search Bar (Desktop & Tablet) */}
          <div className="hidden lg:flex flex-1 max-w-sm lg:max-w-xl mx-2 sm:mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* 4. Right: Borrow Bag (CartSheet) & Settings / Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
            <CartSheet />
            <SettingsPopover />
          </div>
        </div>
      </div>
    </header>
  );
}
