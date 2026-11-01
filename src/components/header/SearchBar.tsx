// Complete the SearchBar component

"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearchSubmit?: () => void;
}

export function SearchBar({ onSearchSubmit }: SearchBarProps = {}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/books?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/books");
    }
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full h-12 rounded-full border border-border bg-card shadow-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-clip"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, authors, genres..."
        className="flex-1 bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
      />
      <Button
        type="submit"
        size="default"
        className="rounded-r-full h-full px-5 bg-primary text-primary-foreground hover:bg-primary-hover  cursor-pointer"
      >
        <Search className="w-4 h-4 stroke-[2.2]" />
      </Button>
    </form>
  );
}
