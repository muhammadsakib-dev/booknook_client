// Ready

"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { toast } from "@/components/ui/sonner";
import { signOut, useSession } from "@/lib/auth-client";
import { getBorrows } from "@/services/read/getBorrows";
import { getMyBooks } from "@/services/read/getMyBooks";
import type { Book, BorrowRecord } from "@/types/book";
import {
  AccountDetails,
  ProfileHeader,
  ProfileStats,
  RecentBorrowActivity,
} from "./components";

function ProfileContent() {
  const { data: session } = useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [borrowsData, booksData] = await Promise.all([
        getBorrows(),
        user?.id ? getMyBooks(user.id) : Promise.resolve([]),
      ]);
      setBorrows(borrowsData || []);
      setMyBooks(booksData || []);
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: load profile data on mount and userId change
  useEffect(() => {
    loadData();
    window.addEventListener("booknook:inventory-updated", loadData);
    return () => {
      window.removeEventListener("booknook:inventory-updated", loadData);
    };
  }, [user?.id]);

  const handleSignOut = async () => {
    toast.success("Signed out successfully.");
    await signOut();
    window.location.href = "/";
  };

  const activeBorrows = borrows.filter((b) => b.status === "Active");
  const returnedBorrows = borrows.filter((b) => b.status === "Returned");

  return (
    <div className="w-full min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ProfileHeader user={user} onSignOut={handleSignOut} />

        <ProfileStats
          activeCount={activeBorrows.length}
          totalBorrowedCount={borrows.length}
          completedCount={returnedBorrows.length}
          contributionsCount={myBooks.length}
          isLoading={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <AccountDetails user={user} />
          </div>

          <div className="lg:col-span-7">
            <RecentBorrowActivity borrows={borrows} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileClient() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
