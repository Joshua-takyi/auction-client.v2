"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=2548&auto=format&fit=crop",
    alt: "Gothic Cathedral Interior",
    bgColor: "#0f0f0f",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?q=80&w=2000&auto=format&fit=crop",
    alt: "Medieval Architecture Detail",
    bgColor: "#1a1a1a",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=2000&auto=format&fit=crop",
    alt: "Classical Sculpture",
    bgColor: "#1c1c1c",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1582560475093-6d1dcb76840d?q=80&w=2000&auto=format&fit=crop",
    alt: "Antique Map",
    bgColor: "#2a2a2a",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); // Auto-advance every 6s
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  return (
    <section className="w-full">
      <div className="relative h-[40dvh] min-h-[400px] w-full overflow-hidden isolate bg-black">
        {/* Background Slides */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            style={{ backgroundColor: slide.bgColor }}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover opacity-90"
                priority={index === 0}
              />
            </div>
            {/* Cinematic Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent z-1" />
          </div>
        ))}

        {/* Unique Floating Content - Left Aligned & Glass */}
        <div className="absolute bottom-12 left-8 md:left-16 z-30 max-w-lg">
          <div className="overflow-hidden">
            <h2 className="text-white text-5xl md:text-7xl font-serif leading-[0.9] tracking-tighter drop-shadow-lg mb-6 mix-blend-overlay opacity-90">
              Luxury <br /> <span className="italic font-light">Week</span>
            </h2>
          </div>

          <div className="bg-background/10 backdrop-blur-xl border border-foreground/20 p-6 md:p-8 rounded-2xl text-foreground shadow-xl max-w-md transform transition-all hover:bg-background/15">
            <p className="text-sm md:text-base leading-relaxed font-light mb-6 text-foreground/90">
              An extraordinary week of the very finest jewelry, watches,
              handbags, sports collectibles, wine & spirits.
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 text-foreground text-xs font-bold tracking-widest uppercase hover:text-foreground/80 transition-colors group"
            >
              Browse Catalogues
              <span className="w-8 h-px bg-foreground group-hover:w-12 transition-all" />
            </Link>
          </div>
        </div>

        {/* Minimal Bottom Right Navigation */}
        <div className="absolute bottom-12 right-8 md:right-16 z-30 flex items-center gap-6">
          {/* Progress Indicator */}
          <div className="flex items-end gap-1 font-mono text-white/80 text-sm">
            <span className="text-2xl leading-none font-medium">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <span className="text-white/40 mb-1">/</span>
            <span className="text-white/40 mb-1">
              {String(HERO_SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-foreground/20 hover:bg-foreground text-foreground hover:text-background flex items-center justify-center transition-all backdrop-blur-sm"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-foreground/20 hover:bg-foreground text-foreground hover:text-background flex items-center justify-center transition-all backdrop-blur-sm"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
