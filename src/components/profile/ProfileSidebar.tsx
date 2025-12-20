"use client";

interface ProfileSidebarProps {
  activeTab: "bids" | "purchases" | "settings";
  setActiveTab: (tab: "bids" | "purchases" | "settings") => void;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: ProfileSidebarProps) {
  const tabs = [
    { id: "bids", label: "Active Bids" },
    { id: "purchases", label: "Won Lots" },
    { id: "settings", label: "Settings" },
  ] as const;

  return (
    <div className="w-full md:w-64 shrink-0">
      <nav className="flex md:flex-col gap-1 md:gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 md:flex-none text-left px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-gray-900 text-white"
                : "bg-transparent text-gray-400 hover:text-gray-900 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
