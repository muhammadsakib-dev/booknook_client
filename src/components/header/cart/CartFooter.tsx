// OK
"use client";

import { Calendar, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartFooterProps {
  totalCount: number;
  dueDate: string;
  isSubmitting: boolean;
  onClear: () => void;
  onConfirm: () => void;
}

export function CartFooter({
  totalCount,
  dueDate,
  isSubmitting,
  onClear,
  onConfirm,
}: CartFooterProps) {
  return (
    <div className="pt-4 border-t border-border space-y-3">
      {/* Due Date Indicator */}
      <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          Expected Return Date:
        </span>
        <span className="font-bold text-foreground flex items-center gap-1">
          <Clock className="w-3 h-3 text-primary" />
          {dueDate} (14 Days)
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={isSubmitting}
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive cursor-pointer h-10 px-3"
          aria-label="Clear all books from borrow bag"
        >
          Clear Bag
        </Button>
        <Button
          size="sm"
          type="button"
          disabled={isSubmitting}
          onClick={onConfirm}
          className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground font-bold cursor-pointer h-10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              <span>Confirming Borrow...</span>
            </>
          ) : (
            <span>
              Confirm Borrowing ({totalCount}{" "}
              {totalCount === 1 ? "Book" : "Books"})
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
