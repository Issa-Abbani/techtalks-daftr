"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="size-11"
      aria-label={label}
      title={label}
      onClick={toggle}
      data-testid="theme-toggle"
    >
      {/* Icons swap via CSS so server and client markup match regardless of theme. */}
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}
