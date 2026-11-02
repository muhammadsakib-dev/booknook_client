import { BookOpenCheck, Clock, ShieldCheck, Users } from "lucide-react";

export interface ImpactMetric {
  label: string;
  value: string;
  subtext: string;
  icon: typeof BookOpenCheck;
}

export interface ReaderStory {
  id: string;
  name: string;
  role: string;
  badge: string;
  quote: string;
  favShelf: string;
  initials: string;
  initialsBg: string;
}

export interface BorrowStep {
  step: string;
  title: string;
  detail: string;
}

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    label: "Books Circulated",
    value: "5,400+",
    subtext: "Free physical loans completed",
    icon: BookOpenCheck,
  },
  {
    label: "Active Readers",
    value: "1,850+",
    subtext: "Community members registered",
    icon: Users,
  },
  {
    label: "Standard Loan Window",
    value: "14 Days",
    subtext: "Generous time for thoughtful reading",
    icon: Clock,
  },
  {
    label: "On-Time Return Rate",
    value: "99.2%",
    subtext: "Preserving copies for neighbors",
    icon: ShieldCheck,
  },
];

export const READER_STORIES: ReaderStory[] = [
  {
    id: "reader-1",
    name: "Eleanor Vance",
    role: "Literature Instructor & Resident",
    badge: "Verified Reader • 24 Loans",
    quote:
      "Having access to physical, hardcover historical classics without subscription barriers or checkout fees has revived my weekend reading routine. The 14-day loan tracker gives me just the right cadence.",
    favShelf: "Historical Chronicles",
    initials: "EV",
    initialsBg: "bg-emerald-900 text-emerald-200",
  },
  {
    id: "reader-2",
    name: "Marcus Chen",
    role: "Software Architect & Parent",
    badge: "Contributor • 18 Books Shared",
    quote:
      "I donated surplus copies from my home library and now borrow illustrated bedtime books for my kids every fortnight. The Borrow Bag drawer feels refreshingly personal and entirely non-commercial.",
    favShelf: "Young Minds & Tech",
    initials: "MC",
    initialsBg: "bg-amber-900 text-amber-200",
  },
  {
    id: "reader-3",
    name: "Dr. Sophia Al-Mansoor",
    role: "Postdoctoral Humanities Fellow",
    badge: "Active Borrower • Philosophy Circle",
    quote:
      "Digital screens fragment focus. BookNook's physical borrowing model allows our neighborhood reading circle to pass tactile volumes of political philosophy and ethics from hand to hand.",
    favShelf: "Philosophy & Thought",
    initials: "SA",
    initialsBg: "bg-teal-900 text-teal-200",
  },
];

export const BORROW_STEPS: BorrowStep[] = [
  {
    step: "01",
    title: "Browse & Select",
    detail: "Choose titles and add to your personal Borrow Bag.",
  },
  {
    step: "02",
    title: "14-Day Physical Loan",
    detail: "Immerse yourself at your own pace with automatic return tracking.",
  },
  {
    step: "03",
    title: "Return & Replenish",
    detail: "Return on time with one click so fellow readers can enjoy.",
  },
];
