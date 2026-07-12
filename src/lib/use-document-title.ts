import { useEffect } from "react";

/**
 * Sets document.title for the lifetime of the page that calls it.
 * Replaces the per-route `head: () => ({ meta: [{ title: ... }] })`
 * config that TanStack Start's SSR router used to apply.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
