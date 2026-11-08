// Ready
import type { Metadata } from "next";
import { Suspense } from "react";
import BooksCatalog from "./BooksCatalog";

export const metadata: Metadata = {
  title: "All Books",
  description:
    "Explore physical books available for loan in the community catalog",
};

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <BooksCatalog />
    </Suspense>
  );
}
