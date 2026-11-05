// Completed

"use client";

import { ArrowLeft, CheckCircle2, PlusCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BookCard } from "@/components/books/BookCard";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { createBook } from "@/services/create/createBook";
import { getBooks } from "@/services/read/getBooks";
import type { Book } from "@/types/book";

export default function AddBookPage() {
  const { data: session } = useSession();

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [copies, setCopies] = useState(5);
  const [rating, setRating] = useState(4.8);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdBook, setCreatedBook] = useState<Book | null>(null);

  // Fetch categories dynamically from database books
  useEffect(() => {
    getBooks().then((books) => {
      const uniqueCats = Array.from(
        new Set(
          books
            .map((b) => b.category?.trim())
            .filter((c): c is string => Boolean(c)),
        ),
      ).sort();

      if (uniqueCats.length > 0) {
        setDbCategories(uniqueCats);
        setCategory((prev) => (prev ? prev : uniqueCats[0]));
      } else {
        setDbCategories([
          "Fiction",
          "Non-Fiction",
          "Science",
          "History",
          "Technology",
        ]);
      }
    });
  }, []);

  // Simple
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !author.trim()) {
      setErrorMsg("Please enter both title and author.");
      return;
    }

    setLoading(true);

    const payload: Partial<Book> = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim() || "General",
      copies: Number(copies) || 1,
      totalCopies: Number(copies) || 1,
      rating: Number(rating) || 4.8,
      image: image.trim(),
      description:
        description.trim() ||
        "A wonderfully curated book from our modern library collection.",
    };

    const res = await createBook(payload);
    setLoading(false);

    if (res.success && res.book) {
      setCreatedBook(res.book);
    } else {
      setErrorMsg(res.message || "Failed to add book.");
    }
  };

  // Reset form
  const handleResetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory(dbCategories[0] || "Fiction");
    setCopies(5);
    setRating(4.8);
    setImage("");
    setDescription("");
    setCreatedBook(null);
    setErrorMsg(null);
  };

  // Live preview book object
  const previewBook: Book = {
    _id: "preview-id",
    title: title || "Untitled Book Title",
    author: author || "Author Name",
    category,
    rating,
    copies,
    totalCopies: copies,
    availableCopies: copies,
    status: "available",
    image,
    description:
      description ||
      "A wonderfully curated book from our modern library collection.",
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 1. Navigation */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <Link
              href="/books"
              className="hover:text-primary transition-colors"
            >
              Books
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Add New Book</span>
          </div>

          {/* 2. Header section */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Library Contribution
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Add a New Book to <span className="text-primary">BookNook</span>
            </h1>
            <p className="mt-2.5 text-base text-muted-foreground leading-relaxed">
              Register new titles in the central catalog with available copies
              so students and readers can borrow them.
            </p>
          </div>

          {/* 3. Success message or main form */}
          {createdBook ? (
            <div className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-lg max-w-xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Book Successfully Added!
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  <strong className="text-foreground">
                    {createdBook.title}
                  </strong>{" "}
                  by {createdBook.author} is now ready for borrowing.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <Link
                  href="/books"
                  className={buttonVariants({
                    className:
                      "bg-primary text-primary-foreground hover:bg-primary-hover px-6",
                  })}
                >
                  Browse Catalog
                </Link>
                <Button variant="outline" onClick={handleResetForm}>
                  Add Another Book
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* ফর্ম কলাম */}
              <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  {/* Book title */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="title"
                      className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Book Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Midnight Library"
                      required
                      className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Added By (Read-Only User Info) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="addedByName"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        User Name (Read-Only)
                      </label>
                      <input
                        id="addedByName"
                        type="text"
                        value={session?.user?.name || "Library Member"}
                        readOnly
                        className="w-full h-11 px-3.5 rounded-xl border border-border bg-muted/40 text-sm text-muted-foreground cursor-not-allowed select-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="addedByEmail"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        User Email (Read-Only)
                      </label>
                      <input
                        id="addedByEmail"
                        type="email"
                        value={session?.user?.email || "member@booknook.com"}
                        readOnly
                        className="w-full h-11 px-3.5 rounded-xl border border-border bg-muted/40 text-sm text-muted-foreground cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Author and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="author"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Author Name *
                      </label>
                      <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Matt Haig"
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="category"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Category *
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        {dbCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Available Copies and Rating */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="copies"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Available Copies *
                      </label>
                      <input
                        id="copies"
                        type="number"
                        min={1}
                        max={50}
                        value={copies}
                        onChange={(e) => setCopies(Number(e.target.value))}
                        required
                        className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="rating"
                        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        Rating (1.0 - 5.0)
                      </label>
                      <input
                        id="rating"
                        type="number"
                        step="0.1"
                        min={1}
                        max={5}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Cover Image URL */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="image"
                      className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Cover Image URL
                    </label>
                    <input
                      id="image"
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="description"
                      className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Synopsis / Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Short blurb about the contents of this book..."
                      className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-foreground outline-none focus:border-primary transition-colors resize-y min-h-20"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold cursor-pointer"
                    >
                      {loading ? (
                        <span>Saving to Library...</span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <PlusCircle className="w-4 h-4" />
                          Add Book to Catalog
                        </span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetForm}
                      disabled={loading}
                      className="h-11 border-border hover:bg-muted cursor-pointer"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </div>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Live Book Card Preview
                  </h3>
                  <Badge variant="outline" className="text-xs text-primary">
                    Real-time
                  </Badge>
                </div>

                <div className="max-w-xs mx-auto w-full">
                  <BookCard book={previewBook} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
