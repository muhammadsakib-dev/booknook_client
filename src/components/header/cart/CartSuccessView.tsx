// OK
"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface CartSuccessViewProps {
  dueDate: string;
  onClose: () => void;
}

export function CartSuccessView({ dueDate, onClose }: CartSuccessViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12 px-2 animate-in zoom-in-95">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-8 h-8 stroke-2" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        Borrowing Confirmed!
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
        Your physical book borrowing request has been approved. Copies must be
        returned by <strong className="text-foreground">{dueDate}</strong>.
      </p>
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        <SheetClose
          nativeButton={false}
          render={
            <Link
              href="/my-borrows"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold cursor-pointer",
              )}
            >
              View in My Borrows
            </Link>
          }
        />
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onClose}
          className="w-full text-xs cursor-pointer"
        >
          Close Drawer
        </Button>
      </div>
    </div>
  );
}
