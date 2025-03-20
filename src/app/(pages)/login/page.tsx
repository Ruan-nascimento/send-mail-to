"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuth } from "../../../lib/context/auth.context";
import { ModalErrorInLogin } from "@/app/_components/modalErrorInLogin";
import { API_URL } from "@/lib/context/globals";

const loginSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push(`${API_URL}/`);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      loginSchema.parse({ name, email, password });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt,
        });

        localStorage.setItem("authToken", data.token);
        router.push(`${API_URL}/`);
      } else {
        setError(data.error || "An error occurred during login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-zinc-800 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-zinc-100 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-300"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 w-full border-zinc-600 bg-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full border-zinc-600 bg-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full border-zinc-600 bg-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-zinc-900 hover:bg-amber-500 cursor-pointer"
          >
            {loading ? "Loading..." : "Sign In"}
          </Button>
        </form>

        <ModalErrorInLogin closeModal={closeModal} error={error} />
      </div>
    </div>
  );
}