"use client";

import { cn } from "cn";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  variant?: "default" | "compact";
}

export function SearchBar({
  className,
  placeholder = "Search books, authors, genres...",
  onSearch,
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/books?search=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/books");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center w-full rounded-xl border border-border bg-card shadow-2xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden",
        variant === "compact" ? "h-10" : "h-10 lg:h-11",
        className,
      )}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search library books by title, author, or genre"
        className="flex-1 bg-transparent px-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
      />
      <Button
        type="submit"
        size="default"
        className={cn(
          "rounded-none h-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer",
          variant === "compact" ? "px-3.5" : "px-4 sm:px-5",
        )}
        aria-label="Submit search"
      >
        <Search className="w-4 h-4 stroke-[2.2]" />
      </Button>
    </form>
  );
}
