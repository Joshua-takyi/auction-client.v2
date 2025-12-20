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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const url = originalRequest.url || "";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !url.includes("/auth/refresh") &&
      !url.includes("/auth/signout") &&
      !url.includes("/users/login") &&
      !url.includes("/users/profile")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (err) {
        // If refresh fails, clear cookies/state and redirect
        // We don't await the signout here if it's going to loop,
        // better to just redirect to where the user can re-auth
        window.location.href = "/";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
const useApiStore = create<ApiStore>((set) => ({
  api: api,
}));

export default useApiStore;
