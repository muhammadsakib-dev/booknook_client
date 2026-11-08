// Ready

import type { Metadata } from "next";
import { getBookById } from "@/services/read/getBookById";
import BookDetailsClient from "./BookDetailsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) {
    return {
      title: "Book Details",
    };
  }
  return {
    title: book.title,
    description: book.description || `Borrow ${book.title} by ${book.author}`,
  };
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookDetailsClient bookId={id} />;
}
