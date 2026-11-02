// Complete the HomePage component

import { Banner } from "@/components/banner";
import { RecentBooksShowcase } from "@/components/books/RecentBooksShowcase";
import { CommunityImpact } from "@/components/home/CommunityImpact";
import { CuratedShelves } from "@/components/home/CuratedShelves";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 sm:gap-10 pb-12 sm:pb-16">
      {/* 1. Hero Banner Carousel */}
      <Banner />

      {/* 2. Recent 6 Books Showcase ("Latest Additions to BookNook") */}
      <RecentBooksShowcase />

      {/* 3. Curated Library Shelves & Reading Categories */}
      <CuratedShelves />

      {/* 4. Community Circulation Metrics & Reader Testimonials */}
      <CommunityImpact />
    </div>
  );
}
