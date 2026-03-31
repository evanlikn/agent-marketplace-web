"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function AgentSearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultQ = params.get("q") ?? "";
  const defaultVisibility = (params.get("visibility") as "public" | "unlisted" | "private" | null) ?? "public";

  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const q = String(form.get("q") ?? "");
        const visibility = String(form.get("visibility") ?? "public");
        const search = new URLSearchParams();
        if (q) search.set("q", q);
        search.set("visibility", visibility);
        router.push(`/?${search.toString()}`);
      }}
    >
      <input name="q" defaultValue={defaultQ} placeholder="Search by name, description, publisher..." style={{ flex: 1 }} />
      <select name="visibility" defaultValue={defaultVisibility}>
        <option value="public">public</option>
        <option value="unlisted">unlisted</option>
        <option value="private">private</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
