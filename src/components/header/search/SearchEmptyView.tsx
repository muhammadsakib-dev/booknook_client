// Empty search result view

import { BookOpen } from "lucide-react";

interface SearchEmptyViewProps {
  query: string;
}

export function SearchEmptyView({ query }: SearchEmptyViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
      <BookOpen className="w-8 h-8 text-muted-foreground/40 mb-2 stroke-[1.5]" />
      <p className="text-sm font-semibold text-foreground">
        No matching books found
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
        No results for &quot;{query.trim()}&quot;. Try searching for another
        book title, author, or genre.
      </p>
    </div>
  );
}
