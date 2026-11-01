"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BANNER_SLIDES } from "../../public/data/banner_data";

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slide = BANNER_SLIDES[currentSlide];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-4">
      <div className="relative mx-auto h-112 sm:h-128 lg:h-144 max-w-7xl w-full rounded-3xl overflow-hidden shadow-lg border border-border/50">
        {/* Background Images with smooth fade transition */}
        {BANNER_SLIDES.map((s, index) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
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
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />

        {/* Content Container: Responsive padding across 390px, 768px, 1024px, 1440px */}
        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-6 sm:px-12 lg:px-16 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            {slide.title.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-4 max-w-lg text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
            {slide.description}
          </p>

          <div className="mt-7">
            <Link
              href={slide.buttonHref}
              className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 sm:px-8 py-3 text-sm sm:text-base font-bold shadow-md transition-all duration-200 hover:bg-primary-hover active:scale-95 cursor-pointer"
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>

        {/* Accessible Pagination Dots */}
        <div
          className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5"
          role="tablist"
          aria-label="Carousel pagination"
        >
          {BANNER_SLIDES.map((s, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                  isActive
                    ? "w-7 bg-white shadow-xs"
                    : "w-2.5 bg-white/50 hover:bg-white/80",
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
