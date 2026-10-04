import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useAdminAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for auth token
    const token = localStorage.getItem("khushi_admin_auth");
    setLoggedIn(!!token);
  }, [navigate]);

  const login = (password: string) => {
    if (password === "K9374320711") {
      localStorage.setItem("khushi_admin_auth", "verified");
      setLoggedIn(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid password");
    }
  };

  const logout = () => {
    localStorage.removeItem("khushi_admin_auth");
    setLoggedIn(false);
    toast.success("Logged out");
  };

  return { loggedIn, login, logout };
}
