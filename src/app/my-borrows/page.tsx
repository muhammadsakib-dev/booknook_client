// Ready
import type { Metadata } from "next";
import MyBorrowsClient from "./MyBorrowsClient";

export const metadata: Metadata = {
  title: "My Borrow Requests",
  description:
    "Track your active book loans, return countdowns, and borrow status",
};

export default function MyBorrowsPage() {
  return <MyBorrowsClient />;
}
