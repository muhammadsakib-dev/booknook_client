// Ready

"use client";

import { BookOpen, Edit3, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { normalizeBook } from "@/lib/book-utils";
import type { Book } from "@/types/book";
import { BookThumbnail } from "./BookThumbnail";

interface CatalogTableProps {
  books: Book[];
  loading: boolean;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export function CatalogTable({
  books,
  loading,
  onEdit,
  onDelete,
}: CatalogTableProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const normalizedList = books.map(normalizeBook);

  const categories = [
    "All",
    ...Array.from(new Set(normalizedList.map((b) => b.category))),
  ];

  const filteredBooks = normalizedList.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* সার্চ ও ফিল্টার বার */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your books..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs text-foreground outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* বই তালিকা / লোডিং / খালি অবস্থা */}
      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading your books...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-foreground mb-1">
            No Books Found
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {search
              ? "No books match your search."
              : "You have not added any books to BookNook yet."}
          </p>
          <Link
            href="/add-book"
            className={buttonVariants({
              size: "sm",
              className: "bg-primary text-primary-foreground gap-1.5",
            })}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Book</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBooks.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <BookThumbnail src={item.image} alt={item.title} />
                        <div>
                          <Link
                            href={`/books/${item.id}`}
                            className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-primary/10 text-primary font-medium"
                      >
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          item.availableCopies > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-500"
                        }`}
                      >
                        {item.availableCopies}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {item.totalCopies}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.isAvailable
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "All Loaned"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted cursor-pointer"
                          onClick={() => {
                            const raw = books.find(
                              (orig) => (orig._id || orig.id) === item.id,
                            );
                            if (raw) onEdit(raw);
                          }}
                          aria-label="Edit book"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive cursor-pointer"
                          onClick={() => onDelete(item.id)}
                          aria-label="Delete book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
