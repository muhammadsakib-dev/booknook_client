"use client";

import { cn } from "cn";
import { Check, LogIn, LogOut, Settings, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Theme, useTheme } from "@/hooks/use-theme";
import { signOut, useSession } from "@/lib/auth-client";

const THEME_OPTIONS: { label: string; value: Theme }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export function SettingsPopover() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            type="button"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors cursor-pointer max-sm:hidden h-9 px-2.5 rounded-xl border border-transparent hover:border-border"
            aria-label="Account profile and display settings"
          >
            {session?.user ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-2xs">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate hidden md:inline">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
            ) : (
              <Settings className="w-5 h-5 stroke-[1.8]" />
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-60 p-5 bg-card">
        {/* Theme Selection Section */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1.5 border-b border-border mb-2.5">
            Display Theme
          </h4>
          <div className="flex flex-col space-y-1 text-sm">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex items-center justify-between text-left transition-colors cursor-pointer py-1.5 px-2 rounded-lg text-xs font-medium",
                    isSelected
                      ? "text-primary font-bold bg-primary-subtle/50"
                      : "text-foreground hover:text-primary hover:bg-muted/60",
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1.5 border-b border-border mb-2.5">
            Reader Account
          </h4>
          <div className="flex flex-col space-y-1.5 text-sm">
            {session?.user ? (
              <>
                <div className="px-2 py-1.5 rounded-lg bg-muted/40 text-xs mb-1">
                  <p className="font-bold text-foreground truncate">
                    {session.user.name}
                  </p>
                  <p className="text-muted-foreground truncate text-[11px] mt-0.5">
                    {session.user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors py-1.5 px-2 rounded-lg cursor-pointer text-left w-full text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-muted/60 text-xs font-medium"
                >
                  <LogIn className="w-3.5 h-3.5 text-primary" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-muted/60 text-xs font-medium"
                >
                  <UserPlus className="w-3.5 h-3.5 text-primary" />
                  <span>Create Account</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
