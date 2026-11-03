// Complete the Logo component

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | string;
}

export function Logo({ className, size = "md" }: LogoProps = {}) {
  const sizeClasses: Record<string, string> = {
    sm: "h-10 w-auto max-sm:h-9",
    md: "h-14 w-auto max-sm:h-12",
    lg: "h-20 w-auto max-sm:h-16",
  };

  const imageClass = sizeClasses[size] || "h-14 w-auto max-sm:h-12";

  return (
    <Link href="/" className={`inline-block ${className || ""}`}>
      <Image
        src="/book_00.png"
        alt="BookNook Logo"
        width={360}
        height={360}
        className={imageClass}
      />
    </Link>
  );
}
