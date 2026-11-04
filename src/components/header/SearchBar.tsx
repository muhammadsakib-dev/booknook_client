// Complete the SearchBar component

"use client";

import { useRouter } from "next/navigation";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { getBooks } from "@/services/read/getBooks";
import { type NormalizedBook, normalizeBook } from "@/types/book";
import { SearchDropdown } from "./search/SearchDropdown";
import { SearchInput } from "./search/SearchInput";

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

  // Lazy load books on mount
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

  // Filter books matching search query
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

  // Close dropdown on outside click
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

  // Navigate to single book
  const handleSelectBook = (id: string) => {
    setIsOpen(false);
    router.push(`/books/${id}`);
    onSearchSubmit?.();
  };

  // Navigate to full search page
  const handleSearchAll = () => {
    setIsOpen(false);
    const searchParam = query.trim();
    if (searchParam) {
      router.push(`/books?search=${encodeURIComponent(searchParam)}`);
    } else {
      router.push("/books");
    }
    onSearchSubmit?.();
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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
      <SearchInput
        query={query}
        onQueryChange={(val) => {
          setQuery(val);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => {
          if (query.trim()) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        onClear={handleClear}
        onSubmit={handleSearch}
      />

      {isOpen && query.trim() !== "" && (
        <SearchDropdown
          query={query}
          isLoading={isLoading && allBooks.length === 0}
          results={results}
          selectedIndex={selectedIndex}
          onSelectBook={handleSelectBook}
          onHoverIndex={setSelectedIndex}
          onSearchAll={handleSearchAll}
        />
      )}
    </div>
  );
}
