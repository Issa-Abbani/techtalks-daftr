"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * The sun/moon button that switches between light and dark mode.
 *
 * Clicking it adds or removes the `dark` class on <html> (that's what switches
 * the colours in globals.css) and remembers the choice in localStorage, so it
 * sticks on the next visit. BootScript reads that saved choice when the page loads.
 */
export function ThemeToggle({ label }: { label: string }) {
  function toggleTheme() {
    const isDarkNow = document.documentElement.classList.toggle("dark");

    try {
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    } catch {
      // Storage can be blocked (some private-browsing modes). The theme still
      // changes for this visit, it just won't be remembered.
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="size-11"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      data-testid="theme-toggle"
    >
      {/*
        Both icons are always rendered and CSS decides which one shows (moon in
        light mode, sun in dark mode). Doing it in CSS means the server and the
        browser render the same HTML, whatever theme the visitor uses.
      */}
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}
