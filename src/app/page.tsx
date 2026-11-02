// Complete the HomePage component

import { Banner } from "@/components/banner";
import { RecentBooksShowcase } from "@/components/books/RecentBooksShowcase";
import { LiterarySpotlight } from "@/components/home/LiterarySpotlight";
import { ReadingPerks } from "@/components/home/ReadingPerks";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-12 sm:gap-12 sm:pb-16">
      {/* 1. Hero Banner Carousel */}
      <Banner />

      {/* 2. Recent 6 Books Showcase ("Latest Additions to BookNook") */}
      <RecentBooksShowcase />

      {/* 3. Mindful Reading Perks (Aesthetic Showcase) */}
      <ReadingPerks />

      {/* 4. Literary Spotlight & Reflections (Aesthetic Showcase) */}
      <LiterarySpotlight />
    </div>
  );
}
