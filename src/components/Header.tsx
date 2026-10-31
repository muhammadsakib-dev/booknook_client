"use client";

import { cn } from "cn";
import { Search, Settings, ShoppingBag, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<
    "Light" | "Dark" | "System"
  >("Light");
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSettingsOpen(false);
        setIsCartOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "w-full bg-background border-b border-border transition-colors",
          className,
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* 1. BRAND LOGO (BookNook) */}
          <div className="flex items-center gap-2.5 shrink-0 select-none group cursor-pointer">
            {/* Styled Book Stack Icon matching the design */}
            <svg
              className="h-8 w-8 text-foreground"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Leaning book on the left */}
              <path
                d="M6 7L10 5V24L6 26V7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 9L9.5 8V23L7.5 24"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              {/* Top horizontal book */}
              <rect
                x="12"
                y="11"
                width="14"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M14 13.5H24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Bottom horizontal book */}
              <rect
                x="12"
                y="18"
                width="15"
                height="5"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M14 20.5H25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Primary color underline shelf */}
              <path
                d="M4 29H29"
                stroke="var(--primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Logo Text with dark green underline bar */}
            <div className="flex flex-col relative">
              <span className="text-2xl font-black tracking-tight text-foreground flex items-center">
                Book<span className="text-primary">Nook</span>
              </span>
              <span className="h-[3.5px] bg-primary w-full rounded-full -mt-0.5" />
            </div>
          </div>

          {/* 2. SEARCH BAR (Design Only) */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6 md:mx-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Just design - functionality to be set later
              }}
              className="flex items-center w-full rounded-md border border-border bg-card shadow-xs transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary overflow-hidden h-11"
            >
              <input
                type="text"
                placeholder="Search our store"
                className="flex-1 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
              <button
                type="button"
                className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary-hover px-6 h-full transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2.4]" />
              </button>
            </form>
          </div>

          {/* 3. RIGHT CONTROLS: CART & SETTINGS */}
          <div className="flex items-center gap-5 sm:gap-6 shrink-0">
            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 group cursor-pointer text-foreground hover:text-primary transition-colors select-none"
              aria-label="View shopping cart"
            >
              <div className="relative flex items-center">
                <ShoppingBag className="w-5 h-5 stroke-[1.8] text-foreground group-hover:text-primary transition-colors" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs">
                  0
                </span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                $0.00
              </span>
            </button>

            {/* Settings Trigger & Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className="text-foreground hover:text-primary transition-colors cursor-pointer p-1 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                aria-label="Settings"
                aria-expanded={isSettingsOpen}
              >
                <Settings className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Settings Dropdown Popover */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-md border border-border bg-popover text-popover-foreground shadow-lg p-5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* Theme Section (Replaced Currency with Theme as requested) */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium text-foreground pb-1.5 border-b border-border mb-3">
                      Theme
                    </h4>
                    <div className="flex flex-col space-y-2.5 text-sm">
                      <button
                        type="button"
                        onClick={() => setSelectedTheme("Light")}
                        className={cn(
                          "text-left transition-colors cursor-pointer",
                          selectedTheme === "Light"
                            ? "text-primary font-medium"
                            : "text-foreground hover:text-primary",
                        )}
                      >
                        Light
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTheme("Dark")}
                        className={cn(
                          "text-left transition-colors cursor-pointer",
                          selectedTheme === "Dark"
                            ? "text-primary font-medium"
                            : "text-foreground hover:text-primary",
                        )}
                      >
                        Dark
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTheme("System")}
                        className={cn(
                          "text-left transition-colors cursor-pointer",
                          selectedTheme === "System"
                            ? "text-primary font-medium"
                            : "text-foreground hover:text-primary",
                        )}
                      >
                        System
                      </button>
                    </div>
                  </div>

                  {/* Account Section */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground pb-1.5 border-b border-border mb-3">
                      Account
                    </h4>
                    <div className="flex flex-col space-y-2.5 text-sm">
                      <a
                        href="#login"
                        className="text-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        Login
                      </a>
                      <a
                        href="#create-account"
                        className="text-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        Create Account
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 4. SHOPPING CART DRAWER (Slide-over panel) */}
      {/* Backdrop */}
      {isCartOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity animate-in fade-in w-full h-full cursor-default"
          onClick={() => setIsCartOpen(false)}
          aria-label="Close cart backdrop"
        />
      )}

      {/* Cart Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-xs sm:max-w-sm bg-card text-card-foreground shadow-2xl border-l border-border transition-transform duration-300 ease-in-out p-6 flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">Shopping Cart</h3>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full cursor-pointer"
            aria-label="Close shopping cart"
          >
            <XCircle className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="py-8">
          <p className="text-muted-foreground text-sm">
            Your cart is empty now.
          </p>
        </div>
      </div>
    </>
  );
}
