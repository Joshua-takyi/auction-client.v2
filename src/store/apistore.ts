"use client";

import axios, { AxiosInstance } from "axios";

import { create } from "zustand";
interface ApiStore {
  api: AxiosInstance;
}

// Helper function to get CSRF token from cookies
const getCsrfTokenFromCookie = (): string | null => {
  const name = "csrf_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return null;
};

const apiUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:8080/api/v1" : "";
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor to add CSRF token to mutating requests
api.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    const url = config.url || "";

    // Check if this is a mutating request (POST, PUT, DELETE, PATCH)
    const isMutatingRequest = ["post", "put", "delete", "patch"].includes(
      method || ""
    );

    // Exclude signin and signup endpoints
    const isAuthEndpoint =
      url.includes("/public/users/login") ||
      (url.includes("/public/users") && method === "post");

    // Add CSRF token if it's a mutating request and not an auth endpoint
    if (isMutatingRequest && !isAuthEndpoint) {
      const csrfToken = getCsrfTokenFromCookie();
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url || "";

    // 1. Prevent infinite loops on auth endpoints
    const isAuthRequest =
      url.includes("/auth/refresh") ||
      url.includes("/users/login") ||
      url.includes("/auth/signout");

    // 2. If it's a 401 and we haven't retried yet and it's not an auth request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      // Use 'logged_in' cookie as a hint. If it's missing, don't bother refreshing.
      const isLoggedIn =
        typeof document !== "undefined" &&
        document.cookie.includes("logged_in=true");
      if (!isLoggedIn) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);

        // If refresh fails, and it's NOT just the profile check, redirect to home
        // This avoids loop if /users/profile keeps failing for guests
        const isProfileCheck = url.includes("/users/profile");
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/" &&
          !isProfileCheck
        ) {
          window.location.href = "/";
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
const useApiStore = create<ApiStore>((set) => ({
  api: api,
}));

export default useApiStore;
