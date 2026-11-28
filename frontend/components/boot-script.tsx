"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

/*
 * A tiny script that has to run before the page is drawn, otherwise visitors
 * would see a flash of the wrong thing. It does two jobs:
 *
 * 1. Adds the `js` class to <html>. The scroll animations only hide content when
 *    this class is there, so people without JavaScript still see everything.
 *
 * 2. Picks light or dark mode. A choice saved by the theme toggle wins; otherwise
 *    it follows the device setting. Adding the `dark` class switches the colours
 *    (see the `.dark` block in globals.css).
 *
 * localStorage can throw in some private-browsing modes, hence the try/catch.
 */
const SCRIPT = `
(function () {
  var html = document.documentElement;
  html.classList.add("js");

  try {
    var savedTheme = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var useDark = savedTheme ? savedTheme === "dark" : prefersDark;
    html.classList.toggle("dark", useDark);
  } catch (error) {
    // No access to storage: stay on the default (light) theme.
  }
})();
`;

/**
 * Puts the script above into the server-rendered HTML, so the browser runs it
 * straight away, before anything is painted.
 *
 * Why not a plain <script> tag? React warns about <script> tags rendered by
 * components, and `next/script` runs too late to prevent the flash.
 * `useServerInsertedHTML` is the approach the Next.js docs recommend
 * (guide: "Preventing flash before hydration").
 */
export function BootScript() {
  // Next.js can call the callback more than once while rendering; only insert the script the first time.
  const alreadyInserted = useRef(false);

  useServerInsertedHTML(() => {
    if (alreadyInserted.current) return null;
    alreadyInserted.current = true;
    return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
  });

  return null;
}
