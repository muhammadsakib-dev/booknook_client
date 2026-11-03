// Complete the SearchBar component

"use client";

import { ArrowRight, BookOpen, Loader2, Search, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getBooks } from "@/services/read/getBooks";
import { type NormalizedBook, normalizeBook } from "@/types/book";

interface SearchBarProps {
  onSearchSubmit?: () => void;
}

export function SearchBar({ onSearchSubmit }: SearchBarProps = {}) {
  const [query, setQuery] = useState("");
  const [allBooks, setAllBooks] = useState<NormalizedBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load books list on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getBooks()
      .then((raw) => {
        if (isMounted) {
          setAllBooks(raw.map(normalizeBook));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch books for search:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter books matching search query (instant onChange)
  const trimmed = query.trim().toLowerCase();
  const results: NormalizedBook[] = trimmed
    ? allBooks
        .filter((b) => {
          const title = b.title.toLowerCase();
          const author = b.author.toLowerCase();
          const category = b.category.toLowerCase();
          return (
            title.includes(trimmed) ||
            author.includes(trimmed) ||
            category.includes(trimmed)
          );
        })
        .slice(0, 5)
    : [];

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Handle single book selection
  const handleSelectBook = (id: string) => {
    setIsOpen(false);
    router.push(`/books/${id}`);
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  // Handle full search page navigation
  const handleSearchAll = () => {
    setIsOpen(false);
    const searchParam = query.trim();
    if (searchParam) {
      router.push(`/books?search=${encodeURIComponent(searchParam)}`);
    } else {
      router.push("/books");
    }
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  // Form submit handler
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      handleSelectBook(results[selectedIndex].id);
      return;
    }
    handleSearchAll();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "ArrowDown" && query.trim() !== "") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Clear query button
  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full h-12 rounded-full border border-border bg-card shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden"
      >
        <div className="pl-4 text-muted-foreground flex items-center justify-center pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search books, authors, genres..."
          className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
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

      {/* লাইভ সার্চ ড্রপডাউন রেজাল্ট */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {isLoading && allBooks.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Searching library...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              {/* হেডার */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border/60 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Related Books ({results.length})
                </span>
                <span className="text-[10px] lowercase text-muted-foreground/70 hidden sm:inline">
                  use ↑↓ to navigate, Enter to view
                </span>
              </div>

              {/* বইয়ের তালিকা */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border/40 scrollbar-thin  flex flex-col">
                {results.map((book, idx) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => handleSelectBook(book.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors cursor-pointer group ${
                      selectedIndex === idx ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <Image
                      src={
                        book.image && book.image.trim() !== ""
                          ? book.image
                          : "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={book.title}
                      width={44}
                      height={58}
                      unoptimized
                      className="w-10 h-15 object-cover rounded-sm border border-border/60 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        by {book.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/40">
                          {book.category}
                        </span>
                        <span className="max-sm:hidden flex items-center gap-0.5 text-[11px] font-medium text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {book.rating}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ml-auto ${
                            book.isAvailable
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {book.isAvailable ? "Available" : "Borrowed"}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </button>
                ))}
              </div>

              {/* ফুটার: সমস্ত ফলাফল দেখার বাটন */}
              <button
                type="button"
                onClick={handleSearchAll}
                className="flex items-center justify-between px-5 py-3 border-t border-border/60 bg-muted/20 hover:bg-muted/60 text-xs font-semibold text-primary transition-colors cursor-pointer"
              >
                <span>See all results for &quot;{query.trim()}&quot;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-semibold text-foreground">
                No matching books found
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                No results for &quot;{query.trim()}&quot;. Try searching for
                another book title, author, or genre.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
