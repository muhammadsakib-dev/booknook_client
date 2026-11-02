// Complete the CommunityImpact component

import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Quote,
  Star,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BORROW_STEPS,
  IMPACT_METRICS,
  READER_STORIES,
} from "../../../public/data/community_data";

export function CommunityImpact() {
  return (
    <section
      aria-labelledby="community-impact-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
    >
      {/* 1. Impact Metrics Grid */}
      <div className="bg-secondary/40 border border-border rounded-3xl p-6 sm:p-10 shadow-xs mb-14 sm:mb-20">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-subtle text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Community Circulation</span>
          </div>
          <h2
            id="community-impact-heading"
            className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight"
          >
            A Library Built on{" "}
            <span className="text-primary">Shared Trust</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Every physical copy in BookNook stays in active circulation through
            the mindful participation of local readers and contributors.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {IMPACT_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-colors hover:border-primary/40 shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-xs font-bold text-foreground mt-1">
                    {metric.label}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {metric.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Reader Stories & Testimonials Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-accent/15 text-accent-foreground border border-accent/30 text-xs font-semibold px-3 py-1 rounded-full w-fit">
            <Quote className="w-3.5 h-3.5" />
            <span>Reader Perspectives</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Loved by Readers Across Our Community
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Read how BookNook makes physical books accessible, communal, and
            delightful for book lovers of all backgrounds.
          </p>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover transition-colors group self-start sm:self-auto"
        >
          <span>Join as a Reader</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 3. Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {READER_STORIES.map((reader) => (
          <div
            key={reader.id}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div>
              {/* Star Rating Row */}
              <div className="flex items-center gap-1 text-accent mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`star-${reader.id}-${i}`}
                    className="w-4 h-4 fill-accent"
                  />
                ))}
              </div>

              {/* Reader Quote */}
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic mb-6">
                &ldquo;{reader.quote}&rdquo;
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-border flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                  reader.initialsBg,
                )}
              >
                {reader.initials}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                  {reader.name}
                </h4>
                <p className="text-[11px] text-muted-foreground truncate">
                  {reader.role}
                </p>
                <div className="inline-flex items-center gap-1 text-[10px] text-primary font-semibold mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span>{reader.badge}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Three-Step Physical Borrowing Flow */}
      <div className="mt-12 sm:mt-16 bg-surface-subtle border border-border rounded-3xl p-6 sm:p-10">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            How It Works
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            Borrowing in Three Simple Steps
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {BORROW_STEPS.map((step) => (
            <div
              key={step.step}
              className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border/70 shadow-2xs"
            >
              <div className="text-lg font-black text-primary/70 shrink-0 mt-0.5">
                {step.step}
              </div>
              <div>
                <h5 className="text-sm font-bold text-foreground mb-1">
                  {step.title}
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/books"
            className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Explore Catalog
          </Link>
          <Link
            href="/add-book"
            className="inline-flex items-center justify-center rounded-xl bg-surface border border-border text-foreground px-6 py-2.5 text-xs sm:text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            Contribute a Book
          </Link>
        </div>
      </div>
    </section>
  );
}
