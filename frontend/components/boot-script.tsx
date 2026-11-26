"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

/**
 * Injects a blocking inline script into the server-rendered HTML so it runs before
 * first paint (theme class, `js` class for animations). Using useServerInsertedHTML
 * keeps React from rendering a <script> on the client, which it warns about.
 * See the Next.js guide "Preventing flash before hydration".
 */
export function BootScript({ code }: { code: string }) {
  const inserted = useRef(false);

  useServerInsertedHTML(() => {
    if (inserted.current) return null;
    inserted.current = true;
    return <script dangerouslySetInnerHTML={{ __html: code }} />;
  });

  return null;
}
