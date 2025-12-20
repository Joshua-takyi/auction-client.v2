"use client";

import { convertCurrency } from "@/utils";
import { useState, useRef, useEffect } from "react";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

export default function FilterSidebar({
  onFilterChange,
  activeFilters,
}: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState(activeFilters.min_price || 0);
  const [maxPrice, setMaxPrice] = useState(activeFilters.max_price || 500000);

  // Debounce price changes to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        ...activeFilters,
        min_price: minPrice > 0 ? minPrice : undefined,
        max_price: maxPrice < 500000 ? maxPrice : undefined,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = [
    "Watches",
    "Cars",
    "Art",
    "Jewelry",
    "Furniture",
    "Fashion",
    "Handbags",
    "Wine & Spirits",
    "Rare Books",
    "Antiquities",
    "Numismatics",
    "Ceramics",
    "Sculpture",
    "Militaria",
  ];

  const statuses = [
    { label: "Live Auctions", value: "live" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ended", value: "ended" }, // 'buynow' maps to what? Assuming ended or specific logic
  ];

  const toggleCategory = (cat: string) => {
    // Single select for now as per RPC, but UI could support multi-select later
    // For now, toggle: if same clicked, clear it.
    const newVal = activeFilters.category === cat ? undefined : cat;
    onFilterChange({ ...activeFilters, category: newVal });
  };

  const toggleStatus = (statusVal: string) => {
    // Single select for status as well for now
    const newVal = activeFilters.status === statusVal ? undefined : statusVal;
    onFilterChange({ ...activeFilters, status: newVal });
  };

  return (
    <div className="space-y-10">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Categories
        </h3>
        <ul className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
          {categories.map((category) => (
            <li key={category}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${
                    activeFilters.category === category
                      ? "bg-foreground border-foreground"
                      : "border-border group-hover:border-foreground"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCategory(category);
                  }}
                >
                  {activeFilters.category === category && (
                    <svg
                      className="w-2.5 h-2.5 text-background"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm font-light transition-colors ${
                    activeFilters.category === category
                      ? "text-foreground font-medium"
                      : "text-foreground/80 group-hover:text-foreground"
                  }`}
                >
                  {category}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Price Range
          </h3>
          <span className="text-[10px] text-muted-foreground font-mono"></span>
        </div>

        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="500000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="w-full h-0.5 bg-border rounded-lg appearance-none cursor-pointer accent-foreground"
          />
          <div className="flex items-center justify-between text-xs font-medium font-mono">
            <span>{convertCurrency(minPrice).toLocaleString()}</span>
            <span>{convertCurrency(maxPrice).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Status
        </h3>
        <ul className="space-y-2">
          {statuses.map((status) => (
            <li key={status.value}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${
                    activeFilters.status === status.value
                      ? "bg-foreground border-foreground"
                      : "border-border group-hover:border-foreground"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleStatus(status.value);
                  }}
                >
                  {activeFilters.status === status.value && (
                    <svg
                      className="w-2.5 h-2.5 text-background"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm font-light transition-colors ${
                    activeFilters.status === status.value
                      ? "text-foreground font-medium"
                      : "text-foreground/80 group-hover:text-foreground"
                  }`}
                >
                  {status.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
