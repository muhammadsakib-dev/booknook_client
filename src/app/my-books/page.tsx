// Ready

import type { Metadata } from "next";
import MyBooksClient from "./MyBooksClient";

export const metadata: Metadata = {
  title: "My Books & Requests",
  description:
    "Manage your contributed books, track loan requests, and approve returns",
};

export default function MyBooksPage() {
  return <MyBooksClient />;
}
