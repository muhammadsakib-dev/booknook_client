import { Coffee, Compass, Heart } from "lucide-react";

export interface LiteraryPillar {
  id: string;
  title: string;
  description: string;
  icon: typeof Coffee;
}

export const LITERARY_QUOTE = {
  quote: "I have always imagined that Paradise will be a kind of a library.",
  author: "Jorge Luis Borges",
  role: "Argentine Writer & Bibliophile",
};

export const LITERARY_PILLARS: LiteraryPillar[] = [
  {
    id: "screen-free",
    title: "Screen-Free Haven",
    description:
      "Stepping away from endless digital feeds into quiet, unhurried moments surrounded by real books and thoughtful ideas.",
    icon: Coffee,
  },
  {
    id: "living-margins",
    title: "Living Margins",
    description:
      "Every copy carries the quiet history of readers who turned its pages before you, creating an unspoken shared bond.",
    icon: Heart,
  },
  {
    id: "curated-permanence",
    title: "Curated Permanence",
    description:
      "Literature that has stood the test of time, lovingly cataloged and made freely accessible for generations of readers.",
    icon: Compass,
  },
];
