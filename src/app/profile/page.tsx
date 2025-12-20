"use client";

import { useState } from "react";
import Link from "next/link";
import { useSessionStore } from "@/store/sessionStore";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ActiveBids from "@/components/profile/ActiveBids";
import PurchaseHistory from "@/components/profile/PurchaseHistory";
import AccountSettings from "@/components/profile/AccountSettings";

export default function ProfilePage() {
  const { user } = useSessionStore();
  const [activeTab, setActiveTab] = useState<"bids" | "purchases" | "settings">(
    "bids"
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
        <h1 className="text-2xl font-serif mb-4">Access Restricted</h1>
        <p className="text-gray-500 mb-8">
          Please log in to view your profile.
        </p>
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-widest underline underline-offset-4"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-12 font-sans text-gray-900">
      <div className="container-lux px-6 md:px-12 mx-auto max-w-6xl">
        <ProfileHeader />

        <div className="flex flex-col md:flex-row gap-12">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Area */}
          <div className="flex-1 min-h-[500px]">
            {activeTab === "bids" && <ActiveBids />}
            {activeTab === "purchases" && <PurchaseHistory />}
            {activeTab === "settings" && <AccountSettings user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
