import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | string;
}

export function Logo({ className }: LogoProps = {}) {
  return (
    <Link href="/" className={className}>
      <Image
        src="/book_00.png"
        alt="BookNook Logo"
        width={360}
        height={360}
        className="h-22 w-auto max-sm:h-16 max-sm:w-auto max-md:h-20 max-md:w-auto"
      />
    </Link>
  );
}
