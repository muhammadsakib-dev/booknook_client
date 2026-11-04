// OK
import { BookOpen, Clock, Leaf, Sparkles } from "lucide-react";

export interface ReadingPerk {
  id: string;
  title: string;
  description: string;
  icon: typeof BookOpen;
}

export const READING_PERKS: ReadingPerk[] = [
  {
    id: "physical-print",
    title: "Real Paper Books",
    description:
      "Every book in our collection is a real printed copy. Enjoy the classic feel and smell of turning actual paper pages.",
    icon: BookOpen,
  },
  {
    id: "slow-reading",
    title: "14 Days to Read",
    description:
      "Keep each book for two full weeks. Read at your own pace and easily check your return date on the website.",
    icon: Clock,
  },
  {
    id: "free-access",
    title: "100% Free to Borrow",
    description:
      "No membership fees or hidden charges. Simply book online, pick it up yourself, and enjoy reading for free.",
    icon: Sparkles,
  },
  {
    id: "sustainable-circulation",
    title: "Read, Return, Repeat",
    description:
      "When you return a book with care, the next reader gets to enjoy it. Sharing keeps our favorite books alive.",
    icon: Leaf,
  },
];
