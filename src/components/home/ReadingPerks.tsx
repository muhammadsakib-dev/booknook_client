// Complete the ReadingPerks component

import { READING_PERKS } from "../../../public/data/reading_perks_data";

export function ReadingPerks() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 1. Section Header */}
      <div className="mb-8 text-center sm:mb-12">
        <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          The Reading Experience
        </span>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Crafted for the Love of <span className="text-primary">Books</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
          A dedicated sanctuary celebrating the timeless ritual of physical
          reading, thoughtful stewardship, and community knowledge.
        </p>
      </div>

      {/* 2. Perks Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {READING_PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <div
              key={perk.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/50 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {perk.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {perk.description}
                </p>
              </div>

              {/* Decorative Subtle Bottom Bar */}
              <div className="mt-5 h-0.5 w-8 rounded-full bg-border transition-all duration-300 group-hover:w-16 group-hover:bg-primary" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
