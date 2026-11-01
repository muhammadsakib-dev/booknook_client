# 📚 BookNook — Modern Community Library Platform (Frontend)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-v1.7-purple)](https://www.better-auth.com/)
[![Biome](https://img.shields.io/badge/Biome-2.4-60a5fa?logo=biome)](https://biomejs.dev/)

> **BookNook** is a specialized, production-ready web application designed for browsing, reserving, and managing a physical community library. Built with the **Next.js 16 App Router (Turbopack)**, **React 19**, and **BetterAuth**, BookNook pairs an artisanal, bookish visual identity with strict enterprise-grade security and state management.

---

## 🏛 Architecture & Tech Stack

- **Framework**: Next.js 16.4.3 (App Router with Turbopack & React Compiler)
- **UI Components**: shadcn/ui (`base-nova` style built atop `@base-ui/react` primitives)
- **Styling**: Tailwind CSS v4 with custom brand tokens in `src/app/globals.css`
- **Authentication**: BetterAuth 1.7 (MongoDB Adapter, Email/Password validation, Google OAuth 2.0)
- **Token Exchange**: JWT plugin with 15-minute cryptographically signed tokens delivered to the Express backend via `Authorization: Bearer <token>`
- **Quality Assurance**: Biome 2 (Linter, Formatter & Import Organizer)

---

## 🎨 Visual Identity & Brand Palette

BookNook avoids generic SaaS templates in favor of a warm, tactile, editorial aesthetic inspired by vintage libraries and archival paper:

| Color Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Deep Forest Green** | `#243C35` | Primary brand accent, headers, high-emphasis CTAs |
| **Warm Ivory** | `#F5F0E7` | Background foundation, parchment aesthetic |
| **Muted Gold** | `#C18A55` | Badges, rating stars, subtle highlights |
| **Charcoal** | `#30332E` | High-contrast readable typography |
| **Sage Green** | `#D9E0D7` | Muted backgrounds, borders, card outlines |
| **Soft Beige** | `#E8DFD1` | Card backgrounds, input surfaces |

---

## ✨ Key Features & User Workflows

### 1. Public Book Catalog & Search (`/books`)
- **Full-Text Live Search**: URL-synchronized search (`/books?search=...`) with debounced inputs and instant state reconciliation.
- **Category Filtering**: Presets for *Fiction*, *Non-Fiction*, *Science*, *History*, *Philosophy*, *Technology*, and *Children*.
- **Real-Time Stock Badges**: Distinct visual states for *In Stock*, *Low Stock*, and *Out of Stock*.

### 2. Single Book Showcase (`/books/[id]`)
- Detailed book metadata, synopses, contributor attribution, and availability counter.
- Direct "Borrow This Book" quick-action and "Add to Borrow Bag" selection drawer trigger.

### 3. Borrow Bag Drawer (Non-Commercial Selection)
- Completely free of commercial e-commerce terms (*no shopping cart, buy now, or checkout price*).
- Displays selected books, requested copies, stock availability validation, and expected 14-day return date.
- One-click multi-book reservation transaction.

### 4. Authenticated Book Management (`/add-book`, `/my-books`)
- **Add Book**: Controlled form with live preview card, image URL validation, and genre selection.
- **My Books Dashboard**: 4 summary metric formulas:
  - **Total Books**: Active books owned by the current user.
  - **Total Copies**: Aggregate physical inventory across all owned books.
  - **Available Copies**: Copies currently on library shelves.
  - **Currently Loaned**: $\text{Total Copies} - \text{Available Copies}$.
- **Edit Modal**: Update title, author, genre, and adjust `totalCopies` safely without violating active loan thresholds.
- **Deletion Safety Guard**: Permanently blocks deleting books while active reader loans exist.

### 5. Reader Loan Management (`/my-borrows`)
- Chronological loan history with 14-day countdown timers.
- Visual status indicators: *Active*, *Due Today*, *Overdue*, and *Returned*.
- Instant one-click book return restoring library inventory in real time.

---

## 🔐 Authentication Architecture

1. **Email & Password**: Enforces at least one uppercase letter, one lowercase letter, and a minimum of 6 characters on both frontend and server.
2. **Google OAuth 2.0**: Native sign-in via Google Cloud Console credentials with offline access.
3. **Session to JWT Bridge**: BetterAuth maintains server session cookies while issuing a short-lived, signed JWT (`/api/auth/token`) used by the API client to authenticate requests with the Express backend (`Authorization: Bearer <token>`).

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js `v20.x` or `v22.x`
- Git

### 2. Clone and Install Dependencies
```bash
cd booknook_client
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required configuration:
```env
# Public Express API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# BetterAuth Server Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_32_character_jwt_secret_matching_backend
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority

# Google OAuth (Optional for local testing)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Code Quality & Verification
```bash
npm run lint      # Biome linter, formatter & import checker
npm run format    # Auto-format codebase
npm run build     # Next.js 16 production build & typecheck
```

---

## 🌐 Production Deployment (Vercel)

1. Import the `booknook_client` repository into **Vercel**.
2. Framework Preset: **Next.js**.
3. Configure the Production Environment Variables in Vercel Project Settings:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render backend URL (e.g., `https://booknook-api.onrender.com`).
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production domain (e.g., `https://booknook.vercel.app`).
   - `BETTER_AUTH_URL`: Same as `NEXT_PUBLIC_APP_URL`.
   - `BETTER_AUTH_SECRET`: Same 32+ character key used in your backend.
   - `MONGODB_URL`: Your production MongoDB Atlas connection string.
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
4. In **Google Cloud Console**, add your production redirect URI:
   ```
   https://<your-vercel-domain>.vercel.app/api/auth/callback/google
   ```
5. Deploy and verify!

---

## 📂 Project Directory Structure

```
booknook_client/
├── docs/                      # Architectural specifications & audits
├── public/                    # Static assets & seed data
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── add-book/          # Contributor book registration
│   │   ├── api/auth/          # BetterAuth route handlers & JWT bridge
│   │   ├── books/             # Public catalog & [id] details page
│   │   ├── login/             # Email & Google OAuth login
│   │   ├── my-books/          # Contributor inventory dashboard
│   │   ├── my-borrows/        # Reader loans & return dashboard
│   │   ├── register/          # Account creation
│   │   ├── globals.css        # Tailwind v4 theme & brand tokens
│   │   └── layout.tsx         # Root layout with Cart & Auth providers
│   ├── components/            # Modular React components
│   │   ├── books/             # BookCard, filters, search bars
│   │   ├── header/            # Navbar, CartSheet, UserMenu
│   │   └── ui/                # Base UI / shadcn base-nova primitives
│   ├── hooks/                 # Custom React hooks (useCart, useTheme)
│   ├── lib/                   # Auth, BetterAuth client & API clients
│   └── types/                 # TypeScript interfaces and schemas
├── biome.json                 # Biome 2 linter/formatter config
├── next.config.ts             # Next.js 16 config & image remote patterns
└── package.json
```
