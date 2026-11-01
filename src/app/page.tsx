import { Banner } from "@/components/banner";
import { RecentBooksShowcase } from "@/components/books/RecentBooksShowcase";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      {/* 1. Hero Banner Carousel */}
      <Banner />

      {/* 2. Recent 6 Books Showcase Component */}
      <RecentBooksShowcase />
    </div>
  );
}
