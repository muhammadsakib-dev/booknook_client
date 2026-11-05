// OK

"use client";

import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut, useSession } from "@/lib/auth-client";

export function SettingsPopover() {
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <Popover>
      {/* 1. Popover Trigger */}
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            type="button"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors cursor-pointer h-12 px-2.5 rounded-xl border border-transparent hover:border-border"
            aria-label="Reader account settings"
          >
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-muted/60 animate-pulse border border-border/40 shrink-0" />
            ) : session?.user ? (
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shadow-2xs shrink-0">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User photo"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-2xs">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-xs font-semibold max-w-25 truncate hidden md:inline">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
            ) : (
              <User className="w-5.5! h-5.5! stroke-3" />
            )}
          </Button>
        }
      />

      {/* 2. Popover Content */}
      <PopoverContent align="end" className="w-72 px-4 py-3 bg-card">
        {/* Reader Account Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1.5 border-b border-border mb-2.5">
            Reader Account
          </h4>
          <div className="flex flex-col space-y-1.5 text-sm">
            {isPending ? (
              <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
                Verifying account...
              </div>
            ) : session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="px-2.5 py-2 rounded-sm hover:bg-primary/10 text-xs my-1 block transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {session.user.name}
                    </p>
                    <span className="text-[10px] bg-primary/10 text-primary font-semibold px-1.5 py-0.5 rounded-md">
                      Profile
                    </span>
                  </div>
                  <p className="text-muted-foreground truncate text-[11px] mt-0.5">
                    {session.user.email}
                  </p>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors py-1.5 px-2 rounded-sm cursor-pointer text-left w-full text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-sm hover:bg-muted/60 text-xs font-medium"
                >
                  <LogIn className="w-3.5 h-3.5 text-primary" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-1.5 px-2 rounded-sm hover:bg-muted/60 text-xs font-medium"
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
