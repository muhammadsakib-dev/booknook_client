// OK
"use client";

// Import essential libraries
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BANNER_SLIDES } from "../../public/data/banner_data";

// Main Banner Component
export function Banner() {
  // Track the current slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically change slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);

    // Clear interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  // Get current slide data
  const slide = BANNER_SLIDES[currentSlide];

  return (
    <section className="px-4 py-3 sm:px-6 lg:px-8">
      {/* Banner Container */}
      <div className="relative isolate mx-auto h-100 w-full max-w-7xl overflow-hidden rounded-2xl shadow-lg sm:h-110 sm:rounded-3xl lg:h-145">
        {/* Background Images */}
        {BANNER_SLIDES.map((s, index) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === currentSlide
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={s.imageUrl}
              alt={s.imageAlt}
              fill
              unoptimized
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-transparent" />

        {/* Banner Content */}
        <div className="relative z-10 flex h-full w-full max-w-2xl flex-col justify-center px-5 pb-10 text-white sm:px-10 lg:px-14 max-sm:mx-auto max-sm:items-center max-sm:text-center">
          {/* Title */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {slide.title.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
            {slide.description}
          </p>

          {/* Button */}
          <div className="mt-6">
            <Link
              href={slide.buttonHref}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>

        {/* Pagination Dots */}
        <nav
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
          aria-label="Carousel pagination"
        >
          {BANNER_SLIDES.map((s, index) => {
            const isActive = index === currentSlide;

            return (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={isActive}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                  isActive
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/60 hover:bg-white",
                )}
              />
            );
          })}
        </nav>
      </div>
    </section>
  );
}
