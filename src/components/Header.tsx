"use client";

import Link from "next/link";
import { Moon, Play, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as
      | "dark"
      | "light"
      | null;

    const current = saved || "dark";

    setTheme(current);

    document.documentElement.classList.toggle(
      "light",
      current === "light"
    );
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";

    setTheme(next);
    localStorage.setItem("theme", next);

    document.documentElement.classList.toggle(
      "light",
      next === "light"
    );
  };

  return (
    <header
      className="border-b"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600">
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
          </div>

          <span
            className="text-xl font-bold"
            style={{ color: "var(--text)" }}
          >
            YT Down
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="muted transition-colors hover:text-emerald-500"
          >
            Home
          </a>

          <a
            href="/#mp3"
            className="muted transition-colors hover:text-emerald-500"
          >
            MP3
          </a>

          <a
            href="/#mp4"
            className="muted transition-colors hover:text-emerald-500"
          >
            MP4
          </a>

          <a
            href="/#faq"
            className="muted transition-colors hover:text-emerald-500"
          >
            FAQ
          </a>

          <Link
            href="/about"
            className="muted transition-colors hover:text-emerald-500"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="muted transition-colors hover:text-emerald-500"
          >
            Contact
          </Link>
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-xl border transition-colors"
          style={{
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}