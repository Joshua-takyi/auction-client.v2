"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import AuthModal from "./AuthModal";
import { useSessionStore } from "@/store/sessionStore";
import SearchComponent from "./searchInput";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { isAuthenticated } = useSessionStore();
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for transparency/blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when search opens
  // useEffect(() => {
  //   if (isSearchOpen) setIsOpen(false);
  // }, [isSearchOpen]);

  // // Close search when mobile menu opens
  // useEffect(() => {
  //   if (isOpen) setIsSearchOpen(false);
  // }, [isOpen]);

  const openAuth = (view: "login" | "signup") => {
    setAuthView(view);
    setIsAuthOpen(true);
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-border bg-background/95 backdrop-blur-md shadow-sm"
            : "border-transparent bg-background/50 backdrop-blur-sm"
        }`}
      >
        <div className="container-lux flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-1 md:flex-none">
            <Link
              href="/"
              className="text-3xl font-serif font-bold tracking-widest text-foreground hover:opacity-80 transition-opacity"
            >
              AURUM
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-center gap-10 text-sm font-medium tracking-wide text-muted-foreground">
            {["Auctions", "Sell with Us", "About", "Journal"].map((item) => (
              <Link
                key={item}
                href={
                  item === "Auctions"
                    ? "/"
                    : `/${item.toLowerCase().replace(/ /g, "-")}`
                }
                className="group relative transition-colors hover:text-foreground"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 justify-end flex-1 md:flex-none">
            {/* Search Toggle & Input */}
            <SearchComponent
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
            />

            {/* Account/User Icon */}
            {isAuthenticated ? (
              <Link
                href="/profile"
                className="text-foreground hover:text-muted-foreground transition-colors p-1"
              >
                <span className="sr-only">Profile</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => openAuth("login")}
                className="text-foreground hover:text-muted-foreground transition-colors p-1"
              >
                <span className="sr-only">Account</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => openAuth("signup")}
                className="hidden md:block text-xs font-semibold uppercase tracking-wider bg-foreground text-background px-6 py-2.5 rounded-none hover:bg-neutral-800 transition-colors"
              >
                Sign up
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground relative z-10"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "top-2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 top-2 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "top-2 -rotate-45" : "top-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border bg-background ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container-lux py-8 flex flex-col gap-6 text-lg font-serif">
            {["Auctions", "Sell with Us", "About", "Journal"].map((item) => (
              <Link
                key={item}
                href={
                  item === "Auctions"
                    ? "/"
                    : `/${item.toLowerCase().replace(/ /g, "-")}`
                }
                className="hover:text-muted-foreground transition-colors border-b border-border pb-2"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex flex-col gap-4 mt-4 pt-4">
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  className="text-center text-sm font-semibold uppercase tracking-wider bg-foreground text-background px-6 py-3 hover:bg-neutral-800"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => openAuth("login")}
                    className="text-left text-sm font-medium hover:text-muted-foreground"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openAuth("signup")}
                    className="text-center text-sm font-semibold uppercase tracking-wider bg-foreground text-background px-6 py-3 hover:bg-neutral-800"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialView={authView}
      />
    </>
  );
}
