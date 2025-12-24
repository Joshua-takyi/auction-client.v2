"use client";

import { useProductStore } from "@/hooks/product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function MyProductsPage() {
  const { useUserProducts } = useProductStore();
  const { data: productsData, isLoading, error } = useUserProducts();

  const products = productsData?.data || [];

  return (
    <div className="min-h-screen bg-white text-black font-sans pt-24 pb-20">
      <div className="container-lux mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-4">
            My Collection
          </h1>
          <p className="text-muted text-sm tracking-widest uppercase">
            Manage your curated products and list them for auction.
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-gray-100 animate-pulse rounded-sm"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-dashed border-border">
            <p className="text-red-500 mb-4">Failed to load products.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs uppercase tracking-widest border-b border-black pb-1"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-border bg-gray-50/30">
            <p className="text-muted mb-6 tracking-wide">
              Your collection is empty.
            </p>
            <Link
              href="/admin/create-product"
              className="bg-black text-white px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-black/80 transition-all inline-block"
            >
              Curate first item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.length > 0 &&
              products.map((product: any) => (
                <div
                  key={product.id}
                  className="group relative border border-border/50 p-4 hover:border-black transition-colors"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted/10 mb-4">
                    <img
                      src={product.images?.[0] || "/placeholder-artifact.jpg"}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-[8px] uppercase tracking-widest px-2 py-1 backdrop-blur-md border ${
                          product.status === "approved"
                            ? "bg-green-500/10 border-green-500/20 text-green-600"
                            : "bg-orange-500/10 border-orange-500/20 text-orange-600"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-serif mb-1 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
                    {product.category}
                  </p>

                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/admin/products/auctions/${product.id}`}
                      className="w-full text-center text-[10px] uppercase tracking-[0.2em] bg-black text-white py-3 hover:bg-black/80 transition-all"
                    >
                      List for Auction
                    </Link>
                    <Link
                      href={`/product/${product.slug}`}
                      className="w-full text-center text-[10px] uppercase tracking-[0.2em] border border-black py-3 hover:bg-black hover:text-white transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
