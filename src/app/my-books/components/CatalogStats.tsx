// Ready
interface CatalogStatsProps {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  loanedCopies: number;
}

export function CatalogStats({
  totalBooks,
  totalCopies,
  availableCopies,
  loanedCopies,
}: CatalogStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-muted-foreground font-medium">
          Total Titles
        </p>
        <p className="text-2xl font-black text-foreground mt-1">{totalBooks}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-muted-foreground font-medium">
          Total Copies
        </p>
        <p className="text-2xl font-black text-foreground mt-1">
          {totalCopies}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          Available Copies
        </p>
        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
          {availableCopies}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          Currently Loaned
        </p>
        <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
          {loanedCopies}
        </p>
      </div>
    </div>
  );
}
