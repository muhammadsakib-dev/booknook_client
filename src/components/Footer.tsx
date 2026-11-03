// OK
"use client";

import { BookOpen, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/header/Logo";
import { useSession } from "@/lib/auth-client";

export function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="w-full bg-card border-t border-border mt-auto py-10 sm:py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
            <Logo size="md" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              BookNook is a community-driven digital library platform. Discover,
              borrow, and contribute books freely with a 14-day loan period.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            {/* Quick Links */}
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3.5">
                Explore
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm flex flex-col items-center sm:items-start">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/books"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/add-book"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contribute a Book
                  </Link>
                </li>
              </ul>
            </div>

            {/* Reader Portal */}
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3.5">
                Reader Portal
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm flex flex-col items-center sm:items-start">
                <li>
                  <Link
                    href="/profile"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Account Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-borrows"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    My Borrowed Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-books"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    My Book Inventory
                  </Link>
                </li>
                {!session?.user && (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Create Account
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Library Policies */}
            <div className="flex flex-col items-center sm:items-start">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3.5">
                Library Policies
              </h4>
              <div className="space-y-3 text-xs text-muted-foreground flex flex-col items-center sm:items-start">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary shrink-0 sm:mt-0.5" />
                  <span>
                    <strong className="text-foreground">14-Day Loans:</strong>{" "}
                    Standard duration for all physical book loans.
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0 sm:mt-0.5" />
                  <span>
                    <strong className="text-foreground">
                      Real-Time Stock:
                    </strong>{" "}
                    Available copies update automatically on checkout.
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary shrink-0 sm:mt-0.5" />
                  <span>
                    <strong className="text-foreground">
                      Community First:
                    </strong>{" "}
                    Free open lending designed to share knowledge.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p>
          <div className="flex items-center justify-center gap-5">
            <Link
              href="/books"
              className="hover:text-primary transition-colors"
            >
              Catalog
            </Link>
            <Link
              href="/my-borrows"
              className="hover:text-primary transition-colors"
            >
              Borrows
            </Link>
            <Link
              href="/profile"
              className="hover:text-primary transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}