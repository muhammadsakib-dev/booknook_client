// Ready
"use client";

import { Search } from "lucide-react";

export type BorrowFilterStatus =
  | "all"
  | "pending"
  | "active"
  | "return-pending"
  | "returned";

interface BorrowsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: BorrowFilterStatus;
  onStatusFilterChange: (status: BorrowFilterStatus) => void;
  totalCount: number;
  pendingCount: number;
  activeCount: number;
  returnPendingCount: number;
  returnedCount: number;
}

export function BorrowsFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  pendingCount,
  activeCount,
  returnPendingCount,
  returnedCount,
}: BorrowsFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title, author, or contributor..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-card border border-border rounded-xl">
        <button
          type="button"
          onClick={() => onStatusFilterChange("all")}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            statusFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("pending")}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            statusFilter === "pending"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("active")}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            statusFilter === "active"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("return-pending")}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            statusFilter === "return-pending"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Return Pending ({returnPendingCount})
        </button>
        <button
          type="button"
          onClick={() => onStatusFilterChange("returned")}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            statusFilter === "returned"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          Returned ({returnedCount})
        </button>
      </div>
    </div>
  );
}
