// Ready

import type { Metadata } from "next";
import { Banner } from "@/components/banner";
import { RecentBooksShowcase } from "@/components/books/RecentBooksShowcase";
import { LiterarySpotlight } from "@/components/home/LiterarySpotlight";
import { ReadingPerks } from "@/components/home/ReadingPerks";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-12 sm:gap-12 sm:pb-16">
      <Banner />
      <RecentBooksShowcase />
      <ReadingPerks />
      <LiterarySpotlight />
    </div>
  );
}
