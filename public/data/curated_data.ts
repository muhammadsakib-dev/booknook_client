import { Atom, Bookmark, Brain, Cpu, Landmark, Sparkles } from "lucide-react";

interface ShelfItem {
  id: string;
  category: string;
  title: string;
  description: string;
  approxCopies: string;
  accentClass: string;
  badgeClass: string;
  icon: typeof Bookmark;
}

export const SHELVES: ShelfItem[] = [
  {
    id: "fiction",
    category: "Fiction",
    title: "Literary Fiction & Novels",
    description:
      "Epoch-defining narratives, intimate character journeys, and contemporary masterpieces bound for physical reading.",
    approxCopies: "35+ Available",
    accentClass: "group-hover:border-primary/50 group-hover:bg-primary/5",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    icon: Bookmark,
  },
  {
    id: "science",
    category: "Science",
    title: "Scientific Horizons",
    description:
      "Cosmology, evolutionary biology, theoretical physics, and the empirical wonders shaping our universe.",
    approxCopies: "24+ Available",
    accentClass: "group-hover:border-sky-500/50 group-hover:bg-sky-500/5",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    icon: Atom,
  },
  {
    id: "history",
    category: "History",
    title: "Historical Chronicles",
    description:
      "Ancient empires, eyewitness wartime memoirs, and archival analyses of humanity's pivotal turning points.",
    approxCopies: "28+ Available",
    accentClass: "group-hover:border-accent/50 group-hover:bg-accent/5",
    badgeClass: "bg-accent/15 text-accent-foreground border-accent/30",
    icon: Landmark,
  },
  {
    id: "philosophy",
    category: "Philosophy",
    title: "Philosophy & Human Thought",
    description:
      "Classical ethics, metaphysics, existential dialogues, and enduring inquiries into morality and consciousness.",
    approxCopies: "18+ Available",
    accentClass: "group-hover:border-purple-500/50 group-hover:bg-purple-500/5",
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    icon: Brain,
  },
  {
    id: "technology",
    category: "Technology",
    title: "Computing & Digital Systems",
    description:
      "System design architecture, algorithmic theory, cybersecurity, and thoughtful perspectives on machine intelligence.",
    approxCopies: "26+ Available",
    accentClass:
      "group-hover:border-emerald-600/50 group-hover:bg-emerald-600/5",
    badgeClass:
      "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20",
    icon: Cpu,
  },
  {
    id: "children",
    category: "Children",
    title: "Young Minds & Illustrated Tales",
    description:
      "Wonder-filled storybooks, illustrated fables, and gentle foundational primers designed to kindle lifelong curiosity.",
    approxCopies: "19+ Available",
    accentClass: "group-hover:border-amber-500/50 group-hover:bg-amber-500/5",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Sparkles,
  },
];
