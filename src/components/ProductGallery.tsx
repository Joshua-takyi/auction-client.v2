"use client";

import Image from "next/image";
import { MouseEvent, useRef, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop";

export default function ProductGallery({
  images: rawImages,
  name,
}: ProductGalleryProps) {
  const images = rawImages?.filter((img) => !!img) || [];
  const displayImages = images.length > 0 ? images : [FALLBACK_IMAGE];

  const [selectedImage, setSelectedImage] = useState(displayImages[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex gap-4 lg:gap-5 flex-col-reverse md:flex-row">
      {/* Thumbnails */}
      <div className="flex flex-row md:flex-col gap-4 w-full md:w-20 lg:w-24 shrink-0 overflow-x-auto md:overflow-visible ">
        {displayImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(img)}
            className={`mt-2 relative aspect-square w-20 md:w-full bg-muted overflow-hidden transition-all shrink-0 ${selectedImage === img
                ? "opacity-100 ring-2 ring-foreground"
                : "opacity-60 hover:opacity-100"
              }`}
          >
            <Image
              src={img || FALLBACK_IMAGE}
              alt={`Detail ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image View */}
      <div
        ref={imageRef}
        className="relative aspect-square md:aspect-auto md:h-[600px] lg:h-[700px] w-full bg-background flex-1 overflow-hidden cursor-crosshair group border-none"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setShowLightbox(true)}
      >
        <Image
          src={selectedImage || FALLBACK_IMAGE}
          alt={name}
          fill
          className={`object-contain transition-transform will-change-transform ${isZoomed
              ? "scale-[2.5] duration-0"
              : "scale-100 duration-300 ease-out"
            }`}
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
          }}
          priority
          quality={75}
        />

        {/* Subtle overlay hint */}
        <div className="absolute bottom-4 right-4 bg-background/50 backdrop-blur-md text-foreground px-3 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Click to expand
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center animate-fade-in"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-6 right-6 text-foreground hover:text-muted-foreground z-50"
            onClick={() => setShowLightbox(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage || FALLBACK_IMAGE}
              alt={name}
              fill
              className="object-contain"
              quality={75}
            />
          </div>
        </div>
      )}
    </div>
  );
}
