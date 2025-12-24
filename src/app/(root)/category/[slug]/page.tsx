"use client";

import { use, useState } from "react";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { useFilterAuctions } from "@/hooks/useAuction";
import { capitalize } from "@/utils";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  // Initial category from slug
  const categoryName = slug
    .split("-")
    .map((s) => capitalize(s))
    .join(" ");

  const [filters, setFilters] = useState({
    category: decodeURIComponent(categoryName),
    min_price: undefined,
    max_price: undefined,
    status: undefined,
    sort_by: "newest",
  });

  const { data, isLoading } = useFilterAuctions(filters);
  const auctions = data?.data || [];

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container-lux">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
              Collections
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium">
              {filters.category || "All Acquisitions"}
            </h1>
          </div>

          {/* Mobile Filter Toggle Placeholder */}
          <button className="md:hidden w-full border border-border py-3 text-xs uppercase tracking-widest font-semibold hover:bg-foreground hover:text-background transition-colors">
            Filter & Sort
          </button>
        </div>

        <div className="flex gap-12 items-start">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 sticky top-32 shrink-0">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Toolbar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border/40">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="text-foreground font-medium">
                  {auctions.length}
                </span>{" "}
                results
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Sort By
                </span>
                <select
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                  value={filters.sort_by}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sort_by: e.target.value }))
                  }
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="ending_soon">Ending Soon</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="space-y-4 animate-pulse">
                    <div className="aspect-square bg-gray-100 rounded-sm" />
                    <div className="h-4 bg-gray-100 w-3/4" />
                    <div className="h-4 bg-gray-100 w-1/2" />
                  </div>
                ))}
              </div>
            ) : auctions.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-sm">
                <p className="text-muted-foreground font-serif italic text-lg">
                  No auctions found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-16">
                {auctions.map((auction) => (
                  // @ts-expect-error - ProductCard type mismatch
                  <ProductCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
