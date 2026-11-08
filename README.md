# 📚 BookNook — Peer-to-Peer Community Library Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.0-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Native_Driver-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-v1.7-purple?style=for-the-badge)](https://www.better-auth.com/)
[![Biome](https://img.shields.io/badge/Biome-2.4-60a5fa?style=for-the-badge&logo=biome)](https://biomejs.dev/)

> **BookNook** is a modern, peer-to-peer (P2P) community library and book sharing web application. Readers can discover physical books, reserve copies into a non-commercial borrow bag, and submit borrow requests directly to community book contributors. Contributors review and approve loans, while borrowers request returns that contributors verify upon physical receipt.

---

## 📑 Table of Contents

1. [🏛️ Architecture & Technologies](#️-architecture--technologies)
2. [✨ Core Features](#-core-features)
3. [🔄 Peer-to-Peer (P2P) Lending Lifecycle](#-peer-to-peer-p2p-lending-lifecycle)
4. [📖 User Guide & How to Use (ব্যবহার বিধি)](#-user-guide--how-to-use-ব্যবহার-বিধি)
5. [🔔 Toast Notification System](#-toast-notification-system)
6. [🔐 Authentication & Security](#-authentication--security)
7. [⚙️ Environment Variables (Unified Setup)](#️-environment-variables-unified-setup)
8. [🚀 Getting Started Locally](#-getting-started-locally)
9. [📂 Project Directory Structure](#-project-directory-structure)

---

## 🏛️ Architecture & Technologies

BookNook is built with a modern decoupled full-stack architecture pairing a Next.js 16 frontend with an Express 5 REST API and MongoDB Atlas.

### 🎨 Frontend (`booknook_client`)

| Technology | Version | Purpose & Description |
| :--- | :--- | :--- |
| **Next.js** | `16.4.3` | React Framework with App Router, Turbopack, and Server/Client Components |
| **React** | `19.3.0` | Core UI library powered by the React Compiler (`reactCompiler: true`) |
| **TypeScript** | `v5` | End-to-end static type safety and interface contracts |
| **Tailwind CSS** | `v4` | Modern CSS engine with `@theme` brand tokens in `src/app/globals.css` |
| **shadcn/ui** | `base-nova` | Accessible UI primitives built on top of `@base-ui/react` (no Radix) |
| **Sonner** | `2.0.8` | Toast notification system with rich colors, animations, and icons |
| **BetterAuth** | `1.7.14` | Client & server authentication, sessions, MongoDB adapter, and JWT plugin |
| **Lucide React** | `1.65.0` | Iconography throughout headers, cards, badges, and modals |
| **Biome** | `2.4.2` | Replacement for ESLint and Prettier for formatting and linting |

### 🛠️ Backend (`booksnook_backend`)

| Technology | Version | Purpose & Description |
| :--- | :--- | :--- |
| **Express.js** | `v5.0` | REST API routing and middleware management |
| **Node.js** | `v20+` | Server runtime with native ES Modules (`"type": "module"`) |
| **MongoDB Driver** | `7.8.0` | Native MongoDB driver for high-performance atomic BSON operations (no Mongoose bloat) |
| **jose** | `6.2.14` | Cryptographic JWT verification and JWKS validation |
| **dotenv** | `16.4.7` | Environment variable management |
| **cors** | `2.8.5` | Cross-Origin Resource Sharing with credentials support |

---

## ✨ Core Features

### 1. 📚 Public Catalog & Discovery (`/books`)
- **Real-Time Live Search**: Debounced title, author, and category search with URL synchronization (`/books?search=...`).
- **Category Filter Tabs**: Dynamic category chips derived directly from live database entries (*Fiction, Non-Fiction, Philosophy, Technology, History, etc.*).
- **Multi-Criterion Sorting**: Sort by Availability, Rating, Available Copies, or Newest Additions.
- **Client-Side Pagination**: Clean 8-book paginated grid with responsive page navigation.
- **Stock Indicators**: Real-time badges for *In Stock*, *Low Stock (≤2 copies)*, and *Out of Stock*.

### 2. 🔍 Single Book Details (`/books/[id]`)
- **Contributor Attribution**: Prominently displays the book contributor's name, email, and contribution date.
- **Copy Reservation Selector**: Dynamic quantity selector capped at available shelf inventory.
- **Self-Borrow Prevention**: Book contributors cannot borrow their own uploaded books; warning alerts and disabled buttons prevent accidental self-loans.
- **Live Inventory Counter**: Real-time counter reflecting reserved vs. available shelf copies.

### 3. 🛍️ Non-Commercial Borrow Bag (`CartSheet.tsx`)
- **Non-Commercial Design**: Strictly avoids e-commerce terms (*no prices, checkout carts, or payment buttons*).
- **Batch Borrow Requests**: Add multiple books to your bag and submit a unified loan request.
- **Quantity Adjuster**: Increment, decrement, or remove items with automatic available stock limits.
- **Return Due Date Calculation**: Calculates and previews the standard 14-day borrowing loan window.

### 4. 🤝 Peer-to-Peer (P2P) Lending & Approvals (`/my-books`)
- **Contributor Dashboard**: Books uploaded by the user with 4 aggregate metrics:
  - **Total Books**: Contributed catalog titles.
  - **Total Copies**: Aggregate physical inventory across all titles.
  - **Available Copies**: Copies currently on library shelves ready for loan.
  - **Currently Loaned**: $\text{Total Copies} - \text{Available Copies}$.
- **Incoming Requests Tab**: Review reader borrow requests:
  - **Approve**: Activates the loan and begins the 14-day countdown.
  - **Decline**: Declines the request and immediately releases reserved copies back to public shelf inventory.
- **Return Approvals Tab**: Verify when readers return books in person:
  - **Confirm Return**: Marks loan as `Returned` and increments available copies.
- **Book Edit Modal**: Update title, author, category, description, and total copies with active-loan lower bound safeguards.
- **Safe Soft-Deletion**: Permanently blocks deleting books while active or pending loans exist.

### 5. 📖 Reader Loans Dashboard (`/my-borrows`)
- **Status Filter Tabs**: Filter by *All*, *Pending Approval*, *Active Loans*, *Return Pending*, and *Returned*.
- **Countdown Due Timers**: Real-time visual tracking of loan due dates with *Active*, *Due Today*, or *Overdue* states.
- **Borrower Actions**:
  - **Cancel Request**: Cancel pending borrow requests before contributor approval, instantly restoring copies.
  - **Request Return**: Initiate book return when ready to return physical copies.

### 6. ⚡ Global Real-Time Inventory Event Bus
- Custom window event (`booknook:inventory-updated`) emitted across all mutating services (*add, edit, delete, borrow, approve, return*).
- Automatically revalidates Catalog, Showcase, SearchBar, and Dashboards in real time without hard browser reloads.

---

## 🔄 Peer-to-Peer (P2P) Lending Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PublicCatalog: Contributor Adds Book
    PublicCatalog --> BorrowBag: Reader Adds to Bag
    BorrowBag --> Pending: Reader Submits Borrow Request\n(1 copy reserved from stock)
    
    state Pending {
      [*] --> WaitingApproval
      WaitingApproval --> Cancelled: Borrower Cancels Request\n(+1 copy restored to stock)
      WaitingApproval --> Rejected: Contributor Declines Request\n(+1 copy restored to stock)
      WaitingApproval --> Active: Contributor Approves Loan\n(14-day timer starts)
    }

    state Active {
      [*] --> ReadingPeriod
      ReadingPeriod --> ReturnPending: Borrower Clicks 'Request Return'
    }

    state ReturnPending {
      [*] --> PhysicalHandover
      PhysicalHandover --> Returned: Contributor Clicks 'Confirm Return'\n(+1 copy restored to stock)
    }

    Returned --> [*]
    Cancelled --> [*]
    Rejected --> [*]
```

---

## 📖 User Guide & How to Use (ব্যবহার বিধি)

### ১. বই অনুসন্ধান ও ব্রাউজিং (Browse & Search)
1. **হেডার সার্চবার**: পৃষ্ঠার শীর্ষে থাকা সার্চবারে বইয়ের নাম, লেখক বা ক্যাটাগরি লিখে দ্রুত ফলাফল দেখুন।
2. **ক্যাটালগ পেজ (`/books`)**: ফিল্টার চিপস চেপে নির্দিষ্ট ঘরানার বই বা সর্টিং ড্রপডাউন ব্যবহার করে বইয়ের তালিকা দেখুন।

### ২. বই ধার নেওয়ার আবেদন (Requesting a Book Loan)
1. বইয়ের কার্ডে **"Borrow"** বাটনে অথবা বইয়ের বিস্তারিত পেজে (`/books/[id]`) গিয়ে **"Add to Bag"** চাপুন।
2. হেডারের **ব্যাগ আইকন (Borrow Bag)**-এ ক্লিক করে আপনার সংরক্ষিত বইয়ের তালিকা পরীক্ষা করুন।
3. **"Confirm Borrow Request"** বাটনে চাপুন।
4. সাথে সাথে বইটির ১টি কপি ইনভেন্টরি থেকে সাময়িকভাবে রিজার্ভ হবে এবং স্ট্যাটাস হবে **`Pending`**।
5. আপনি আপনার **`My Borrows`** পেজে গিয়ে পেন্ডিং রিকোয়েস্টটি দেখতে পারবেন এবং চাইলে কনট্রিবিউটর অনুমোদন করার পূর্বে তা **Cancel** করতে পারবেন।

### ৩. কনট্রিবিউটরের অনুমোদন ও রিটার্ন নিশ্চিতকরণ (Contributor Workflow)
1. আপনি যেসব বই আপলোড করেছেন, সেগুলোর জন্য রিকোয়েস্ট আসলে **`My Books`** পেজের **Incoming Requests** ট্যাবে দেখতে পাবেন।
2. **Approve**: রিকোয়েস্টটি অনুমোদন করলে বইটির লোন সক্রিয় হবে এবং ১৪ দিনের রিটার্ন মেয়াদ গণনা শুরু হবে।
3. **Decline**: রিকোয়েস্ট বাতিল করলে সংরক্ষিত কপিটি পুনরায় জনসাধারণের জন্য ক্যাটালগে যুক্ত হবে।
4. পাঠক বই ফেরত দিতে চাইলে তা **Return Requests** ট্যাবে আসবে। বই হাতে পাওয়ার পর **"Confirm Return"** বাটনে চাপলেই লোন সমাপ্ত হবে এবং বইটির স্টক পুনরুদ্ধার হবে।

### ৪. নতুন বই যুক্ত ও সম্পাদনা (Adding & Managing Books)
1. **নতুন বই যোগ (`/add-book`)**: শিরোনাম, লেখক, ধরণ, কপির সংখ্যা এবং কভার ছবির লিঙ্ক দিয়ে বই আপলোড করুন।
2. **বই সম্পাদনা (`/my-books`)**: আপনার বইয়ের বিবরণ ও কপির সংখ্যা পরিবর্তন করুন (চলমান লোনের চেয়ে কম কপিতে নামানো যাবে না)।
3. **বই ডিলিট (`/my-books`)**: কোনো চলমান বা পেন্ডিং লোন না থাকলে বইটি মুছে ফেলতে পারবেন।

---

## 🔔 Toast Notification System

BookNook-এ **Sonner** লাইব্রেরির মাধ্যমে একটি সম্পূর্ণ ইন্টিগ্রেটেড গ্লোবাল টোস্ট সিস্টেম যুক্ত রয়েছে:

- 🟢 **Success Toasts**: বই কার্টে যুক্ত করা, ধার রিকোয়েস্ট নিশ্চিত করা, নতুন বই যোগ করা, বই এডিট/ডিলিট, রিকোয়েস্ট অ্যাপ্রুভ এবং লগইন/রেজিস্ট্রেশন সাফল্য।
- 🔴 **Error Toasts**: স্টক না থাকা, লগইন ছাড়া ধার করার চেষ্টা, অবৈধ ইনপুট ভ্যালিডেশন এবং এপিআই ব্যর্থতা।
- 🟡 **Warning Toasts**: নিজের আপলোড করা বই নিজে ধার করার চেষ্টা করলে সতর্কবার্তা।
- 🔵 **Info Toasts**: ব্যাগ থেকে বই বাদ দেওয়া বা ব্যাগ খালি করার নোটিফিকেশন।

---

## 🔐 Authentication & Security

- **দ্বৈত অথেনটিকেশন**:
  - **ইমেইল ও পাসওয়ার্ড**: সর্বনিম্ন ৬ অক্ষর, কমপক্ষে একটি বড় হাতের ও একটি ছোট হাতের অক্ষরের কঠোর ভ্যালিডেশন।
  - **গুগল ও-অথ (Google OAuth 2.0)**: গুগল ক্লাউড কনসোলের মাধ্যমে এক ক্লিকে নিরাপদ সোশ্যাল সাইন-ইন।
- **স্টেটলেস JWT ভেরিফিকেশন**: Better-Auth ফ্রন্টএন্ডে সেশন তৈরি করে এবং ব্যাকএন্ডের জন্য ক্রিপ্টোগ্রাফিকালি সাইন করা JWT টোকেন ইস্যু করে (`Authorization: Bearer <token>`)।
- **নিরাপদ রাউট গার্ড (`ProtectedRoute`)**: অননুমোদিত ব্যবহারকারীদের স্বয়ংক্রিয়ভাবে রিডাইরেক্ট করে লগইন পেজে নিয়ে যায়।

---

## ⚙️ Environment Variables (Unified Setup)

ফ্রন্টএন্ড এবং ব্যাকএন্ড উভয় রিপোজিটরিতে একই রকম ৪টি মূল এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করা হয়:

### ফ্রন্টএন্ড (`booknook_client/.env`)

```env
# Production Environment Variables
# API_URL=https://booksnook-backend.vercel.app
# APP_URL=https://booknook-client-gamma-five.vercel.app
# BETTER_AUTH_SECRET=A6aErmnfAplYP1ZxrLMyAPzbsRlzcbTr
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.p16xpfx.mongodb.net/
# GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your_google_client_secret

# Development Environment Variables
API_URL=http://localhost:8000
APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=A6aErmnfAplYP1ZxrLMyAPzbsRlzcbTr
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.p16xpfx.mongodb.net/
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### ব্যাকএন্ড (`booksnook_backend/.env`)

```env
PORT=8000
NODE_ENV=development
API_URL=http://localhost:8000
APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=A6aErmnfAplYP1ZxrLMyAPzbsRlzcbTr
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.p16xpfx.mongodb.net/
DB_NAME=assignment-08
```

> **নোট**: ব্যাকএন্ড স্বয়ংক্রিয়ভাবে `APP_URL` থেকে `ALLOWED_ORIGIN`, `TOKEN_ISSUER`, এবং `JWKS_URL` তৈরি করে নেয়। তাই অতিরিক্ত কোনো ভেরিয়েবল আলাদাভাবে লেখার প্রয়োজন হয় না।

---

## 🚀 Getting Started Locally

### ১. ফ্রন্টএন্ড চালানো (`booknook_client`)
```bash
# ডিপেনডেন্সি ইনস্টল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন (Turbopack)
npm run dev
```
ব্রাউজারে ওপেন করুন: [http://localhost:3000](http://localhost:3000)

### ২. ব্যাকএন্ড চালানো (`booksnook_backend`)
```bash
# ব্যাকএন্ড ফোল্ডারে যান
cd ../booksnook_backend

# ডিপেনডেন্সি ইনস্টল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```
ব্যাকএন্ড এপিআই চালু হবে: [http://localhost:8000](http://localhost:8000)

### ৩. কোড যাচাই ও ফরম্যাটিং
```bash
# ফ্রন্টএন্ড লিন্ট ও ফরম্যাট চেক (Biome)
npm run lint

# অটো-ফিক্স ও ফরম্যাট
npx biome check --write src

# ব্যাকএন্ড টাইপচেক
npx tsc --noEmit
```

---

## 📂 Project Directory Structure

```
booknook_client/
├── public/                    # স্ট্যাটিক অ্যাসেট ও সিড ডাটা
├── src/
│   ├── app/                   # Next.js 16 App Router পেজ ও এপিআই
│   │   ├── add-book/          # নতুন বই যুক্ত করার ফর্ম
│   │   ├── api/auth/          # BetterAuth হ্যান্ডলার
│   │   ├── books/             # পাবলিক ক্যাটালগ ও বইয়ের বিস্তারিত পেজ [id]
│   │   ├── login/             # ইমেইল ও গুগল ও-অথ লগইন পেজ
│   │   ├── my-books/          # কনট্রিবিউটর ড্যাশবোর্ড ও লোন অ্যাপ্রুভাল
│   │   ├── my-borrows/        # পাঠকের ধার তালিকা ও রিটার্ন ড্যাশবোর্ড
│   │   ├── profile/           # ব্যবহারকারীর প্রোফাইল ও লোন সারাংশ
│   │   ├── register/          # নতুন অ্যাকাউন্ট খোলার পেজ
│   │   ├── globals.css        # Tailwind v4 থিম ও কালার টোকেন
│   │   └── layout.tsx         # গ্লোবাল লেআউট ও Sonner Toaster
│   ├── components/            # রিইউজেবল রিঅ্যাক্ট কম্পোনেন্ট
│   │   ├── auth/              # ProtectedRoute কম্পোনেন্ট
│   │   ├── books/             # BookCard, RecentBooksShowcase
│   │   ├── header/            # Navbar, CartSheet, SearchBar, UserMenu
│   │   ├── home/              # Banner, LiterarySpotlight, ReadingPerks
│   │   └── ui/                # shadcn base-nova ও Sonner কম্পোনেন্ট
│   ├── lib/                   # Auth কনফিগারেশন, ইউটিলিটি ও ক্লায়েন্ট
│   ├── providers/             # CartProvider ও গ্লোবাল স্টেট
│   ├── services/              # ক্লিন এপিআই সার্ভিসেস (CRUD & Approval)
│   └── types/                 # TypeScript টাইপ ও ইন্টারফেস
├── biome.json                 # Biome 2 কনফিগারেশন
├── next.config.ts             # Next.js 16 কনফিগারেশন
└── package.json
```

---

## 👨‍💻 Developer & Attribution

- **Project**: BookNook — Assignment 08 Community Library
- **Author**: Muhammad Sakib
- **License**: MIT
