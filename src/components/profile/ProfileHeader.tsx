"use client";

import { useAuth } from "@/hooks/auth";
import { useSessionStore } from "@/store/sessionStore";

export default function ProfileHeader() {
  const { signout } = useAuth();
  const { user, clearUser } = useSessionStore();

  if (!user) return null;

  const handleSignout = () => {
    signout.mutate();
    clearUser();
  };
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-gray-200 pb-8">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">
          Member Profile
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-2">
          {user.fullName || user.name || "Valued Member"}
        </h1>
        <p className="text-gray-500 font-light">{user.email}</p>
      </div>
      <div className="mt-6 md:mt-0">
        <button
          onClick={handleSignout}
          className="text-xs font-bold uppercase tracking-widest text-red-800 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
