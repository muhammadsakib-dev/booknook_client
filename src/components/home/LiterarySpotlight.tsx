// OK

import { Quote } from "lucide-react";
import {
  LITERARY_PILLARS,
  LITERARY_QUOTE,
} from "../../../public/data/literary_data";

export function LiterarySpotlight() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 1. Feature Quote Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xs sm:p-12">
        {/* Subtle Decorative Background Quotation Accent */}
        <Quote className="max-sm:hidden pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-muted/30 stroke-1" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Quote className="h-5 w-5" />
          </div>

          <blockquote className="text-lg font-medium italic leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed">
            &ldquo;{LITERARY_QUOTE.quote}&rdquo;
          </blockquote>

          <div className="mt-5 flex flex-col items-center justify-center">
            <cite className="not-italic text-sm font-bold text-foreground">
              — {LITERARY_QUOTE.author}
            </cite>
            <span className="text-xs text-muted-foreground">
              {LITERARY_QUOTE.role}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Pillars Grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {LITERARY_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-2xs transition-all duration-300 hover:border-primary/40 hover:shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
