"use client";

import { cn } from "cn";
import { Send } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "w-full bg-background border-t border-border mt-auto pt-16 pb-12 transition-colors",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand Logo & Newsletter */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            {/* BookNook Brand Logo */}
            <div className="flex items-center gap-2.5 select-none group cursor-pointer w-fit">
              <svg
                className="h-8 w-8 text-foreground"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Leaning book on left */}
                <path
                  d="M6 7L10 5V24L6 26V7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 9L9.5 8V23L7.5 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                {/* Top horizontal book */}
                <rect
                  x="12"
                  y="11"
                  width="14"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M14 13.5H24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Bottom horizontal book */}
                <rect
                  x="12"
                  y="18"
                  width="15"
                  height="5"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M14 20.5H25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Dark green underline shelf */}
                <path
                  d="M4 29H29"
                  stroke="var(--primary)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex flex-col relative">
                <span className="text-2xl font-black tracking-tight text-foreground flex items-center">
                  Book<span className="text-primary">Nook</span>
                </span>
                <span className="h-[3.5px] bg-primary w-full rounded-full -mt-0.5" />
              </div>
            </div>

            {/* Newsletter Prompt Text */}
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed pt-1">
              Subscribe to our newsletter, Enter your email address
            </p>

            {/* Newsletter Input & Submit */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Just design - set functionality later
              }}
              className="flex items-center max-w-xs w-full border border-border bg-card overflow-hidden h-11 shadow-2xs focus-within:border-primary transition-colors"
            >
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
              />
              <button
                type="submit"
                className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground px-4 h-full flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Subscribe to newsletter"
              >
                <Send className="w-4 h-4 stroke-[2]" />
              </button>
            </form>
          </div>

          {/* Column 2: Account Links */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="text-base font-semibold text-foreground mb-4">
              Account
            </h4>
            <ul className="space-y-3 text-sm list-none p-0 m-0">
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Footer Menu Links */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="text-base font-semibold text-foreground mb-4">
              Footer Menu
            </h4>
            <ul className="space-y-3 text-sm list-none p-0 m-0">
              <li>
                <Link
                  href="/search"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: About Store Info */}
          <div className="lg:col-span-4 md:col-span-2">
            <h4 className="text-base font-semibold text-foreground mb-4">
              About Store
            </h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <p>No. 96, Jecica City, NJ 07305, New York, USA</p>
              <p>
                Phone:{" "}
                <a
                  href="tel:1234567890"
                  className="hover:text-primary transition-colors"
                >
                  123-456-7890
                </a>
              </p>
              <p>
                <a
                  href="mailto:support@example.com"
                  className="hover:text-primary transition-colors"
                >
                  support@example.com
                </a>
              </p>
              <p>Open Hours: MN – ST: 8:00AM – 9:00PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} BookNook. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
