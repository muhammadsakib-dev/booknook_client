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
    title: "Tangible Paper Print",
    description:
      "Every book in our collection is a real physical volume, offering the irreplaceable smell, weight, and texture of genuine paper.",
    icon: BookOpen,
  },
  {
    id: "slow-reading",
    title: "14-Day Relaxed Loan",
    description:
      "Enjoy two full weeks with each borrowed copy—ample time for unhurried, mindful evening reading without stress.",
    icon: Clock,
  },
  {
    id: "free-access",
    title: "Zero Borrowing Fees",
    description:
      "A community-supported literary repository where borrowing is open, transparent, and completely free of charge.",
    icon: Sparkles,
  },
  {
    id: "sustainable-circulation",
    title: "Mindful Circulation",
    description:
      "Prolonging the lifespan of printed books by keeping beloved copies in continuous rotation across neighborly readers.",
    icon: Leaf,
  },
];
