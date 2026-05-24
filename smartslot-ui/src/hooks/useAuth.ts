import { useCallback, useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));

  useEffect(() => {
    const sync = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
      setEmail(localStorage.getItem("email"));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const isLoggedIn = Boolean(token);
  const isAdmin = role === "Admin";
  const isCustomer = role === "Customer";

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setToken(null);
    setRole(null);
    setEmail(null);
  }, []);

  const setSession = useCallback((data: { token: string; role: string; email?: string }) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    if (data.email) {
      localStorage.setItem("email", data.email);
      setEmail(data.email);
    }
    setToken(data.token);
    setRole(data.role);
  }, []);

  return { token, role, email, isLoggedIn, isAdmin, isCustomer, logout, setSession };
}
