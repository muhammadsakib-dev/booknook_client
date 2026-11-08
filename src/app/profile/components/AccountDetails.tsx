// Ready
"use client";

import { PlusCircle, User } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface AccountDetailsProps {
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function AccountDetails({ user }: AccountDetailsProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Reader Account Details
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Your credentials and personal library account privileges.
        </p>
      </div>

      <div className="divide-y divide-border/60 text-xs">
        <div className="py-3 flex items-center justify-between">
          <span className="text-muted-foreground">Full Name</span>
          <span className="font-semibold text-foreground text-right">
            {user?.name || "Reader"}
          </span>
        </div>

        <div className="py-3 flex items-center justify-between">
          <span className="text-muted-foreground">Email Address</span>
          <span className="font-semibold text-foreground text-right">
            {user?.email || "reader@booknook.lib"}
          </span>
        </div>

        <div className="py-3 flex items-center justify-between">
          <span className="text-muted-foreground">Account Status</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Reader
          </span>
        </div>

        <div className="py-3 flex items-center justify-between">
          <span className="text-muted-foreground">Borrowing Quota</span>
          <span className="font-semibold text-foreground">
            Up to 3 concurrent books
          </span>
        </div>

        <div className="py-3 flex items-center justify-between">
          <span className="text-muted-foreground">Standard Loan Period</span>
          <span className="font-semibold text-foreground">
            14 Days per book
          </span>
        </div>

        <div className="py-3 flex items-center justify-between">
          <span className="text-muted-foreground">Library Role</span>
          <span className="font-semibold text-foreground">
            Community Reader / Member
          </span>
        </div>

        <div className="py-3 flex items-center justify-between">
          <span className="text-muted-foreground">Security</span>
          <span className="font-semibold text-foreground">
            JWT Session Verified
          </span>
        </div>
      </div>

      {/* কুইক শর্টকাট বাটন */}
      <div className="pt-2 flex flex-col gap-2">
        <Link
          href="/add-book"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className:
              "w-full justify-center gap-2 rounded-xl text-xs font-semibold",
          })}
        >
          <PlusCircle className="w-4 h-4 text-primary" />
          <span>Contribute / Add a Book</span>
        </Link>
      </div>
    </div>
  );
}
