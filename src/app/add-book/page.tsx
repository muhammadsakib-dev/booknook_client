"use client";

import { cn } from "cn";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  PlusCircle,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { createBook } from "@/lib/books";
import type { Book } from "@/types/book";

const PRESET_COVERS = [
  {
    label: "Fiction",
    url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
  },
  {
    label: "Sci-Fi",
    url: "https://images.unsplash.com/photo-1618609377864-68609b857e90?auto=format&fit=crop&q=80&w=800",
  },
  {
    label: "Technology",
    url: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd9?auto=format&fit=crop&q=80&w=800",
  },
  {
    label: "Self-Help",
    url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
  },
  {
    label: "Mystery",
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
  },
];

const CATEGORIES = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Mystery",
  "Technology",
  "Self-Help",
  "Biography",
  "History",
  "Philosophy",
  "Romance",
  "Fantasy",
];

export default function AddBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [copies, setCopies] = useState(5);
  const [rating, setRating] = useState(4.8);
  const [image, setImage] = useState(PRESET_COVERS[0].url);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdBook, setCreatedBook] = useState<Book | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Please enter a book title.");
      return;
    }
    if (!author.trim()) {
      setErrorMsg("Please enter the author's name.");
      return;
    }
    if (copies < 1) {
      setErrorMsg("Number of copies must be at least 1.");
      return;
    }

    setLoading(true);

    const payload: Partial<Book> = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim() || "General",
      copies: Number(copies),
      totalCopies: Number(copies),
      rating: Number(rating) || 4.8,
      image:
        image.trim() ||
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
      description:
        description.trim() ||
        "A wonderfully curated book from our modern library collection.",
    };

    const res = await createBook(payload);

    setLoading(false);

    if (res.success && res.book) {
      setCreatedBook(res.book);
    } else {
      setErrorMsg(
        res.message || "Failed to add book. Please verify your backend server.",
      );
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setAuthor("");
    setCategory("Fiction");
    setCopies(5);
    setRating(4.8);
    setImage(PRESET_COVERS[0].url);
    setDescription("");
    setCreatedBook(null);
    setErrorMsg(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Breadcrumb */}
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

          {/* Header Title Section */}
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

          {/* Success Banner if book created */}
          {createdBook ? (
            <div className="bg-card border-2 border-primary/40 rounded-2xl p-8 sm:p-10 shadow-lg max-w-3xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
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
                  by {createdBook.author} is now available in the library
                  catalog with{" "}
                  <span className="text-primary font-semibold">
                    {createdBook.copies ?? copies} copies
                  </span>{" "}
                  ready for loan.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/books"
                  className={cn(
                    buttonVariants(),
                    "bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-11",
                  )}
                >
                  Browse in Catalog
                </Link>
                <Button
                  variant="outline"
                  onClick={handleResetForm}
                  className="border-border hover:bg-muted px-6 h-11"
                >
                  Add Another Book
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Form Column (7 Cols) */}
              <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  {/* 1. Title */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Book Title <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Midnight Library"
                      required
                      className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
                    />
                  </div>

                  {/* 2. Author & Category in 2 Cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="author"
                        className="block text-sm font-semibold text-foreground"
                      >
                        Author Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. Matt Haig"
                        required
                        className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="category"
                        className="block text-sm font-semibold text-foreground"
                      >
                        Category / Genre
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-11 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. Copies & Rating in 2 Cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="copies"
                        className="block text-sm font-semibold text-foreground"
                      >
                        Available Copies for Loan{" "}
                        <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="copies"
                        type="number"
                        min={1}
                        max={50}
                        value={copies}
                        onChange={(e) => setCopies(Number(e.target.value))}
                        required
                        className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
                      />
                      <p className="text-xs text-muted-foreground">
                        Total physical copies available for borrowing.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="rating"
                        className="block text-sm font-semibold text-foreground"
                      >
                        Rating (1.0 to 5.0)
                      </label>
                      <input
                        id="rating"
                        type="number"
                        step="0.1"
                        min={1}
                        max={5}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* 4. Cover Image URL */}
                  <div className="space-y-2">
                    <label
                      htmlFor="image"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Cover Image URL
                    </label>
                    <input
                      id="image"
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-11 px-3.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors"
                    />

                    {/* Preset quick buttons */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Sample Covers:
                      </span>
                      {PRESET_COVERS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setImage(preset.url)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                            image === preset.url
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Description */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Book Overview / Synopsis
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide a short synopsis or blurb about the contents of the book..."
                      className="w-full p-3.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary transition-colors resize-y min-h-[100px]"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto min-w-[200px] h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Saving to Library...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <PlusCircle className="w-4.5 h-4.5" />
                          Add Book to Catalog
                        </span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetForm}
                      disabled={loading}
                      className="w-full sm:w-auto h-11 border-border hover:bg-muted cursor-pointer"
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              </div>

              {/* Preview Column (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Live Book Card Preview
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-primary/40 text-primary text-xs"
                    >
                      Real-time
                    </Badge>
                  </div>

                  {/* Mock Book Card */}
                  <div className="bg-background rounded-2xl border border-border/80 overflow-hidden shadow-md max-w-sm mx-auto">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                      {image ? (
                        <Image
                          src={image}
                          alt={title || "Book Preview"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                          <Upload className="w-8 h-8 opacity-40" />
                          <span className="text-xs">No Cover Image</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/35 pointer-events-none" />

                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                        <Badge className="bg-primary/95 text-primary-foreground font-semibold text-[11px] px-2.5 py-0.5 rounded-full shadow-md">
                          {category || "Fiction"}
                        </Badge>
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-400 text-xs font-semibold shadow-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                          <span>{rating || 4.8}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col space-y-3">
                      <div>
                        <h4 className="font-bold text-base text-foreground line-clamp-1">
                          {title || "Untitled Book Title"}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          by {author || "Author Name"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs py-2 border-y border-border/60">
                        <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                          <Layers className="w-4 h-4 shrink-0" />
                          <span>
                            {copies || 1} {copies === 1 ? "Copy" : "Copies"}{" "}
                            Left
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>14 Days Loan</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {description ||
                          "A wonderfully curated book from our modern library collection."}
                      </p>

                      <Button
                        disabled
                        className="w-full h-10 bg-primary/20 text-primary cursor-not-allowed text-xs font-medium"
                      >
                        <BookOpen className="w-4 h-4 mr-1.5" />
                        Borrow Preview
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Information Notice */}
                <div className="bg-muted/40 border border-border/60 rounded-xl p-5 text-xs text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Borrowing Rules
                  </p>
                  <p>
                    Books added here are immediately listed in the catalog and
                    home showcase. Available copies determine how many readers
                    can borrow simultaneously.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
