import { BookOpen, Home, Library, PlusCircle, Repeat } from "lucide-react";

export const NAV_LINKS = [
  { name: "Home", href: "/", icon: Home, shortLabel: "Home" },
  {
    name: "Browse Books",
    href: "/books",
    icon: BookOpen,
    shortLabel: "Browse",
  },
  {
    name: "Add Book",
    href: "/books-add",
    icon: PlusCircle,
    shortLabel: "Add Book",
  },
  {
    name: "My Books",
    href: "/my-books",
    icon: Library,
    shortLabel: "My Books",
  },
  {
    name: "My Borrows",
    href: "/my-borrows",
    icon: Repeat,
    shortLabel: "Borrows",
  },
] as const;
