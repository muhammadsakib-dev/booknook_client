// Ready
import type { Metadata } from "next";
import AddBookForm from "./AddBookForm";

export const metadata: Metadata = {
  title: "Add Book",
  description: "Contribute a new book to the BookNook community catalog",
};

export default function AddBookPage() {
  return <AddBookForm />;
}
