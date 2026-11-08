// Ready
interface RequestsStatsProps {
  pendingCount: number;
  returnCount: number;
  activeCount: number;
  totalCount: number;
}

export function RequestsStats({
  pendingCount,
  returnCount,
  activeCount,
  totalCount,
}: RequestsStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          Pending Borrow Requests
        </p>
        <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
          {pendingCount}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          Return Confirmations
        </p>
        <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
          {returnCount}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Active Reader Loans
        </p>
        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
          {activeCount}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-muted-foreground font-medium">
          Total Borrow Records
        </p>
        <p className="text-2xl font-black text-foreground mt-1">{totalCount}</p>
      </div>
    </div>
  );
}
