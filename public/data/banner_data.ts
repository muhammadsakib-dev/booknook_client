// OK
export interface BannerSlide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageUrl: string;
  imageAlt: string;
}

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    title: "Find & Book Your\nNext Read Online.",
    description:
      "Browse our shelves from home, check which books are available right now, and reserve your favorite copy in just a few clicks.",
    buttonText: "Browse Books",
    buttonHref: "/books",
    imageUrl:
      "https://ik.imagekit.io/muhammadsakib/Assignment-08/B_01.jpg?updatedAt=1793722358335",
    imageAlt:
      "Warmly lit wooden bookshelf filled with organized hardcover and paperback books",
  },
  {
    id: 2,
    title: "Pick It Up Yourself,\nRead in Peace.",
    description:
      "No waiting in line. Visit the shelf, pick up your reserved book on your own responsibility, and enjoy the quiet joy of real paper pages.",
    buttonText: "Explore the Shelves",
    buttonHref: "/books",
    imageUrl:
      "https://ik.imagekit.io/muhammadsakib/Assignment-08/B_02.jpg?updatedAt=1793751399828",
    imageAlt:
      "Reader gently taking a book directly from a wooden library shelf",
  },
  {
    id: 3,
    title: "Tracked Online,\nBuilt on Trust.",
    description:
      "Check your return dates anytime from your account. When you finish reading, simply place the book back on the shelf for the next reader.",
    buttonText: "Join the Library",
    buttonHref: "/add-book",
    imageUrl: "https://ik.imagekit.io/muhammadsakib/Assignment-08/B_03.jpg",
    imageAlt:
      "Neatly stacked books on a wooden table ready for the next reader",
  },
];
