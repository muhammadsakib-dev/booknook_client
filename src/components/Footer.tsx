"use client";

import { cn } from "cn";
import { BookOpen, Check, Clock, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/header/Logo";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 3500);
  };

  return (
    <footer
      className={cn(
        "w-full bg-card border-t border-border mt-auto py-12 sm:py-16 transition-colors",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Logo & Reading Circle Digest */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col space-y-4">
            <Logo size="lg" />

            <p className="text-sm text-muted-foreground leading-relaxed pt-1 max-w-sm">
              BookNook is a community-driven digital physical library management
              platform. Discover, borrow, and contribute books freely with a
              14-day loan duration.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Reading Circle Digest
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex items-center max-w-xs w-full rounded-xl border border-border bg-background h-10 transition-colors focus-within:border-primary overflow-hidden shadow-2xs"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@booknook.lib"
                  required
                  aria-label="Email address for monthly reading digest"
                  className="flex-1 bg-transparent px-3 text-xs text-foreground placeholder:text-muted-foreground outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary-hover w-10 h-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Subscribe to reading digest"
                >
                  {isSubscribed ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
              {isSubscribed && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed to reading announcements!</span>
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Explore Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/add-book"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Contribute a Book
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Reader Portal */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              Reader Portal
            </h4>
            <ul className="space-y-2.5 text-sm list-none p-0 m-0">
              <li>
                <Link
                  href="/my-books"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  My Books & Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/my-borrows"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  My Borrowed Books
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Library Guidelines & Policy */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              Library Policies
            </h4>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>14-Day Loan Period:</strong> All physical book
                  borrowings default to 14 calendar days.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Real-Time Stock:</strong> Available copies update
                  atomically upon loan and return.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Community First:</strong> Free open lending designed
                  to share knowledge without fees.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BookNook. Built for readers.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/books"
              className="hover:text-primary transition-colors"
            >
              Catalog
            </Link>
            <Link
              href="/my-books"
              className="hover:text-primary transition-colors"
            >
              Inventory
            </Link>
            <Link
              href="/my-borrows"
              className="hover:text-primary transition-colors"
            >
              Borrows
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
