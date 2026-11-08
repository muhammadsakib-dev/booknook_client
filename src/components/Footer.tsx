// OK
"use client";

import { BookOpen, Clock, Mail, MapPin, ShieldCheck } from "lucide-react";
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
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <Logo size="md" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              BookNook is a community-driven digital library platform. Discover,
              borrow, and contribute books freely with a 14-day loan period.
            </p>

            {/* Contact Info */}
            <div className="space-y-1.5 text-xs text-muted-foreground flex flex-col items-center sm:items-start pt-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                <a
                  href="mailto:support@booknook.com"
                  className="hover:text-primary transition-colors"
                >
                  support@booknook.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social Links with New X Logo */}
            <div className="flex items-center gap-2.5 pt-1 text-muted-foreground">
              {/* Official New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow BookNook on X"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-muted hover:border-primary/40 transition-colors"
              >
                <span className="sr-only">Follow BookNook on X</span>
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/muhammadsakib-dev"
                target="_blank"
                rel="noreferrer"
                aria-label="BookNook GitHub Repository"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-muted hover:border-primary/40 transition-colors"
              >
                <span className="sr-only">BookNook on GitHub</span>
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/muhammadsakib-dev/"
                target="_blank"
                rel="noreferrer"
                aria-label="BookNook LinkedIn"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:text-foreground hover:bg-muted hover:border-primary/40 transition-colors"
              >
                <span className="sr-only">BookNook on LinkedIn</span>
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
                </svg>
              </a>
            </div>
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
