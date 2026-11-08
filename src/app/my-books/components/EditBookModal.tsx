// Ready
"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/types/book";

interface EditBookModalProps {
  isOpen: boolean;
  book: Book | null;
  isUpdating: boolean;
  onClose: () => void;
  onSave: (
    bookId: string,
    updatedData: {
      title: string;
      author: string;
      category: string;
      totalCopies: number;
      description: string;
    },
  ) => Promise<void>;
}

export function EditBookModal({
  isOpen,
  book,
  isUpdating,
  onClose,
  onSave,
}: EditBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [totalCopies, setTotalCopies] = useState(1);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setCategory(book.category || "Fiction");
      setTotalCopies(Number(book.totalCopies ?? book.copies ?? 1));
      setDescription(book.description || "");
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bookId = book._id || book.id;
    if (!bookId) return;

    await onSave(bookId, {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      totalCopies: Number(totalCopies),
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h3 className="font-bold text-base text-foreground">
            Edit Book Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-xs font-semibold text-muted-foreground mb-1"
            >
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="edit-author"
                className="block text-xs font-semibold text-muted-foreground mb-1"
              >
                Author
              </label>
              <input
                id="edit-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="edit-copies"
                className="block text-xs font-semibold text-muted-foreground mb-1"
              >
                Total Copies
              </label>
              <input
                id="edit-copies"
                type="number"
                min={1}
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number(e.target.value))}
                required
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-category"
              className="block text-xs font-semibold text-muted-foreground mb-1"
            >
              Category
            </label>
            <input
              id="edit-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="block text-xs font-semibold text-muted-foreground mb-1"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isUpdating}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isUpdating}
              className="bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
