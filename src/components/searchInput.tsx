"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface searchProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export default function SearchComponent({
  isSearchOpen,
  setIsSearchOpen,
}: searchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleSearch = (e: React.MouseEvent) => {
    if (!isSearchOpen) {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    } else if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center relative">
      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          isSearchOpen ? "w-40 sm:w-64 opacity-100 mr-2" : "w-0 opacity-0"
        }`}
      >
        <input
          type="text"
          placeholder="Search collections..."
          className="w-full border-b border-foreground/20 bg-transparent py-1 text-sm focus:border-foreground focus:outline-none placeholder:text-muted-foreground/30 font-light"
          autoFocus={isSearchOpen}
          value={searchQuery}
          onBlur={(e) => {
            if (!e.target.value) {
              // Delay slightly to allow click on search button
              setTimeout(() => setIsSearchOpen(false), 200);
            }
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button
        type={isSearchOpen ? "submit" : "button"}
        onClick={toggleSearch}
        className="text-foreground hover:text-muted-foreground transition-colors p-1"
      >
        <span className="sr-only">Search</span>
        {isSearchOpen ? (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </button>
    </form>
  );
}
