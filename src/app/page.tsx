"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/context/auth.context";
import { API_URL } from "@/lib/context/globals";

export default function Home() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
     router.push(`${API_URL}/login`);
    } else {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("authToken");
          router.push(`${API_URL}/login`);
        } else {
          if (!user) {
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              password: decoded.password,
              createdAt: "",
              updatedAt: "",
            });
          }
        }
      } catch (error) {
        localStorage.removeItem("authToken");
        router.push(`${API_URL}/login`);
      }
    }
  }, [router, user, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push(`${API_URL}/login`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="text-zinc-100 text-center space-y-4">
        {user ? (
          <div>
            <h1 className="text-2xl">Welcome, {user.name}!</h1>
            <p>Email: {user.email}</p>
            <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
            <Button
              onClick={handleLogout}
              className="mt-4 bg-amber-600 cursor-pointer text-zinc-900 hover:bg-amber-500"
            >
              Logout
            </Button>
          </div>
        ) : (
          <h1 className="text-2xl">Please log in</h1>
        )}
      </div>
    </div>
  );
}