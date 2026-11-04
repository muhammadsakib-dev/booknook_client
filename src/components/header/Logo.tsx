// OK

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | string;
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps = {}) {
  const sizeClasses: Record<string, string> = {
    sm: "h-10 w-auto max-sm:h-9",
    md: "h-14 w-auto max-sm:h-16",
    lg: "h-18 w-auto max-sm:h-16",
  };

  const imageClass = sizeClasses[size] || sizeClasses.md;

  return (
    <Link href="/" className={cn("inline-block", className)}>
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
