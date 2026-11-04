// Search bar input form

import { Search, X } from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  query: string;
  onQueryChange: (val: string) => void;
  onFocus: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onSubmit: (e: FormEvent) => void;
}

export function SearchInput({
  query,
  onQueryChange,
  onFocus,
  onKeyDown,
  onClear,
  onSubmit,
}: SearchInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center w-full h-12 rounded-full border border-border bg-card shadow-xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden"
    >
      <div className="pl-4 text-muted-foreground flex items-center justify-center pointer-events-none">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder="Search books, authors, genres..."
        className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground outline-hidden w-full"
      />

      {query && (
        <button
          type="button"
          onClick={onClear}
          className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mr-1 cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <Button
        type="submit"
        size="default"
        className="rounded-r-full h-full px-5 bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer"
      >
        <Search className="w-4 h-4 stroke-[2.2]" />
      </Button>
    </form>
  );
}
