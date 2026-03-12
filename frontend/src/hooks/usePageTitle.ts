import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
      ? `${title} — Parichay`
      : "Parichay — Conversations Before Commitment";
    return () => {
      document.title = "Parichay — Conversations Before Commitment";
    };
  }, [title]);
}
