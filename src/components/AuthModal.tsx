"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialView = "login",
}: AuthModalProps) {
  const [view, setView] = useState<"login" | "signup">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { login, signup } = useAuth();

  const isLoading = login.isPending || signup.isPending;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (view === "login") {
        await login.mutateAsync({ email, password });
        // On success, close modal and maybe refresh page or update global state
        // For now, reload window to pick up cookies/state if needed or just close
        onClose();
        // window.location.reload(); // Removed to allow seamless update via React Query
      } else {
        await signup.mutateAsync({ email, password });
        setSuccessMsg("Account created successfully! Please log in.");
        setView("login");
        setEmail("");
        setPassword("");
        // Reset fields if desired?
        // setPassword("");
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Assuming server matches constants.Err* key or message
        // Adjust based on your backend error format: { message: "...", error: "..." }
        setErrorMsg(
          err.response.data.message ||
            err.response.data.error ||
            "Authentication failed"
        );
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  const switchView = (v: "login" | "signup") => {
    setView(v);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md overflow-hidden bg-background border border-border shadow-2xl animate-fade-in p-8 md:p-12">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 18 18" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-medium mb-2">
            {view === "login" ? "Welcome Back" : "Join AURUM"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {view === "login"
              ? "Access your curated collection"
              : "Begin your journey with us"}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm text-center">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-border bg-transparent py-3 text-sm focus:border-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/50"
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-border bg-transparent py-3 text-sm focus:border-foreground focus:outline-none transition-colors placeholder:text-muted-foreground/50"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-3 text-sm uppercase tracking-widest font-medium hover:bg-black/90 disabled:opacity-50 transition-colors"
            >
              {isLoading
                ? "Processing..."
                : view === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </div>
        </form>

        {/* Footer / Toggle */}
        <div className="mt-8 text-center text-sm text-muted-foreground space-y-4">
          {view === "login" ? (
            <>
              <p>
                <button
                  type="button"
                  className="hover:text-foreground underline underline-offset-4"
                >
                  Forgot your password?
                </button>
              </p>
              <p>
                Not a member?{" "}
                <button
                  onClick={() => switchView("signup")}
                  className="text-foreground font-medium hover:underline underline-offset-4"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => switchView("login")}
                className="text-foreground font-medium hover:underline underline-offset-4"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
