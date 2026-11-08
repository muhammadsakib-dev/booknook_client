// Ready
import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your user profile and reading activity summary",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
