"use client";

import Image from "next/image";
import { convertCurrency } from "@/utils";

const PURCHASES = [
  {
    id: "101",
    title: "Hermès Birkin 30 Himalaya",
    image:
      "https://res.cloudinary.com/techogs/image/upload/v1766026224/assets/c6u4r5c7x9m0w3h8s2k1.jpg",
    finalPrice: 85000,
    purchaseDate: "2024-11-15",
    status: "Delivered",
    trackingId: "DHL-99283812",
  },
  {
    id: "102",
    title: "Kaws 'Together' Vinyl Figure",
    image:
      "https://res.cloudinary.com/techogs/image/upload/v1766026229/assets/h5l9k2p4m8n1v6d3q7j0.jpg",
    finalPrice: 2400,
    purchaseDate: "2024-12-10",
    status: "Processing",
    trackingId: null,
  },
];

export default function PurchaseHistory() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif italic text-gray-900">
          Acquisition History
        </h2>
      </div>

      {PURCHASES.map((item) => (
        <div
          key={item.id}
          className="bg-white p-6 border border-gray-100 flex flex-col md:flex-row gap-6"
        >
          <div className="relative w-full md:w-24 aspect-square bg-gray-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-serif mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500 mb-4">
              Won on {new Date(item.purchaseDate).toLocaleDateString()}
            </p>

            <div className="flex gap-8">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                  Final Settlement
                </span>
                <span className="font-serif font-medium">
                  {convertCurrency(item.finalPrice)}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Status
              </span>
              <span className="text-xs font-bold text-gray-900">
                {item.status}
              </span>
            </div>
            {item.trackingId ? (
              <div className="bg-gray-50 p-3 text-center">
                <span className="block text-[9px] text-gray-400 uppercase tracking-wider mb-1">
                  Tracking Number
                </span>
                <span className="font-mono text-xs">{item.trackingId}</span>
              </div>
            ) : (
              <div className="bg-amber-50 p-3 text-center">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">
                  Awaiting Dispatch
                </span>
              </div>
            )}
            <button className="w-full py-2 border border-gray-200 text-[9px] font-bold uppercase tracking-widest hover:border-gray-900 transition-colors">
              Invoice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
