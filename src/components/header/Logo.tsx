import { cn } from "cn";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 select-none group cursor-pointer",
        className,
      )}
      aria-label="BookNook Home"
    >
      {/* Styled Book Stack Icon */}
      <svg
        className={cn(
          "text-foreground",
          size === "sm" && "h-6 w-6",
          size === "md" && "h-7 w-7 sm:h-8 sm:w-8",
          size === "lg" && "h-9 w-9",
        )}
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

        {/* Primary color underline shelf */}
        <path
          d="M4 29H29"
          stroke="var(--primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Logo Text */}
      <div className="flex flex-col relative">
        <span
          className={cn(
            "font-black tracking-tight text-foreground flex items-center",
            size === "sm" && "text-lg",
            size === "md" && "text-xl sm:text-2xl",
            size === "lg" && "text-2xl sm:text-3xl",
          )}
        >
          Book<span className="text-primary">Nook</span>
        </span>
        <span className="h-0.75 sm:h-[3.5px] bg-primary w-full rounded-full -mt-0.5" />
      </div>
    </Link>
  );
}
