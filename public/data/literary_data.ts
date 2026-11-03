// OK
import { Coffee, Compass, Heart } from "lucide-react";

export interface LiteraryPillar {
  id: string;
  title: string;
  description: string;
  icon: typeof Coffee;
}

export const LITERARY_QUOTE = {
  quote: "I have always imagined that this modest gathering of books would one day become a library.",
  author: "Muhammad Sakib",
  role: "Founder Of BookNook",
};

export const LITERARY_PILLARS: LiteraryPillar[] = [
  {
    id: "quiet-escape",
    title: "Quiet Reading Moments",
    description:
      "Step away from daily noise into a calm world of stories, fresh ideas, and real books.",
    icon: Coffee,
  },
  {
    id: "shared-with-care",
    title: "Shared with Care",
    description:
      "Every book travels from one careful reader to another. Borrow freely, read happily, and return responsibly.",
    icon: Heart,
  },
  {
    id: "open-for-all",
    title: "Always Within Reach",
    description:
      "A handpicked collection of books that you can browse online, pick up yourself, and track anytime.",
    icon: Compass,
  },
];