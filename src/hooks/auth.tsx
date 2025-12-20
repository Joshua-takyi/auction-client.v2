"use client";

import useApiStore from "@/store/apistore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSessionStore } from "@/store/sessionStore";
import { useEffect } from "react";

interface AuthCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const { api } = useApiStore();
  const queryClient = useQueryClient();
  const { setUser, clearUser } = useSessionStore();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await api.get("/users/profile");
        return res.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  // Sync user state with store
  useEffect(() => {
    if (user) {
      setUser(user);
    } else if (!isLoadingUser) {
      // Only clear if we're done loading and have no user (e.g. error or 401)
      clearUser();
    }
  }, [user, isLoadingUser, setUser, clearUser]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const res = await api.post("/users/login", credentials);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const res = await api.post("/users", credentials);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const signoutMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/users/signout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  return {
    login: loginMutation,
    signup: signupMutation,
    user,
    signout: signoutMutation,
    isLoadingUser,
  };
};
