"use client";

import { useAuctionStore } from "@/hooks/useAuction";
import useApiStore from "@/store/apistore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddToAuction() {
  const { id } = useParams();
  const router = useRouter();
  const { createAuction } = useAuctionStore();
  const { mutateAsync: createAuctionMutation, isPending: isCreating } =
    createAuction();
  const { api } = useApiStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    start_price: "",
    min_increment: "",
    reserve_price: "",
    estimated_price: "",
    buy_now_price: "",
    buy_now: false,
    start_time: "",
    end_time: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.status === 200) {
          setProduct(res.data.data);
        } else {
          setError("Failed to fetch product details.");
        }
      } catch (err) {
        setError("Error loading product.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, api]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate dates
    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      setMessage({ type: "error", text: "End time must be after start time." });
      return;
    }

    try {
      await createAuctionMutation({
        product_id: product.id,
        category: product.category,
        start_price: parseFloat(formData.start_price),
        min_increment: parseFloat(formData.min_increment),
        reserve_price: formData.reserve_price
          ? parseFloat(formData.reserve_price)
          : undefined,
        estimated_price: parseFloat(formData.estimated_price),
        buy_now_price: parseFloat(formData.buy_now_price),
        buy_now: formData.buy_now,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        room_id: product.id, // Using product ID as room ID for now, or generate new UUID
      } as any);

      setMessage({ type: "success", text: "Auction created successfully!" });
      setTimeout(() => {
        router.push("/profile/products");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Failed to create auction.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center container-lux">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Product not found."}</p>
          <button
            onClick={() => router.back()}
            className="text-xs uppercase tracking-widest border-b border-black"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  font-sans pt-24 pb-20">
      <div className="container-lux max-w-4xl mx-auto px-6">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide mb-4">
            List for Auction
          </h1>
          <p className="text-sm tracking-widest uppercase">
            Product: {product.title}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
          {message && (
            <div
              className={`p-4 text-sm tracking-wide border ${message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
                }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-lg font-serif border-b border-border pb-2 mb-6">
                Financials
              </h2>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em]">
                  Starting Price ($)
                </label>
                <input
                  type="number"
                  name="start_price"
                  value={formData.start_price}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] ">
                  Min Increment ($)
                </label>
                <input
                  type="number"
                  name="min_increment"
                  value={formData.min_increment}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em]">
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  name="estimated_price"
                  value={formData.estimated_price}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em]">
                  Reserve Price (Optional)
                </label>
                <input
                  type="number"
                  name="reserve_price"
                  value={formData.reserve_price}
                  onChange={handleInputChange}
                  className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-serif border-b border-border pb-2 mb-6">
                Schedule & Options
              </h2>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em]">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-border py-2 text-base focus:outline-none focus:border-black bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em]">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-border py-2 text-base focus:outline-none focus:border-black bg-transparent"
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <input
                  type="checkbox"
                  id="buy_now"
                  name="buy_now"
                  checked={formData.buy_now}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-black"
                />
                <label
                  htmlFor="buy_now"
                  className="text-sm tracking-widest uppercase"
                >
                  Enable Buy Now
                </label>
              </div>

              {formData.buy_now && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-[10px] uppercase tracking-[0.2em]">
                    Buy Now Price ($)
                  </label>
                  <input
                    type="number"
                    name="buy_now_price"
                    value={formData.buy_now_price}
                    onChange={handleInputChange}
                    required={formData.buy_now}
                    className="w-full border-b border-border py-2 text-lg focus:outline-none focus:border-black bg-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-12 text-center">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-black text-white px-12 py-4 text-xs uppercase tracking-[0.3em] hover:bg-black/80 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? "Listing Masterpiece..." : "Launch Auction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
