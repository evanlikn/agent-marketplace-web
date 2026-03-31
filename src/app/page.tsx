import Link from "next/link";
import { AgentCard } from "../components/AgentCard";
import { AgentSearchBar } from "../components/AgentSearchBar";
import { getAgents } from "../lib/api";

export default async function Home({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const visibility =
    typeof searchParams.visibility === "string"
      ? (searchParams.visibility as "public" | "unlisted" | "private")
      : "public";

  let data:
    | Awaited<ReturnType<typeof getAgents>>
    | {
        items: [];
        total: number;
        page: number;
        page_size: number;
      } = { items: [], total: 0, page: 1, page_size: 20 };
  let error = "";
  try {
    data = await getAgents({
      q,
      page: Number.isFinite(page) && page > 0 ? page : 1,
      pageSize: 20,
      visibility
    });
  } catch (err) {
    error = String(err);
  }

  const hasPrev = data.page > 1;
  const hasNext = data.page * data.page_size < data.total;
  const makePageHref = (nextPage: number) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (visibility) qs.set("visibility", visibility);
    qs.set("page", String(nextPage));
    return `/?${qs.toString()}`;
  };

  return (
    <main className="container space-y">
      <h1 style={{ marginBottom: 0 }}>OpenClaw Agent Marketplace</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Discover published agents and copy canonical IDs (`publisher_id/agent_id`).
      </p>

      <AgentSearchBar />

      {error ? <div className="card">Failed to load agents: {error}</div> : null}
      {!error && data.items.length === 0 ? <div className="card">No agents found.</div> : null}
      {!error ? (
        <div className="space-y">
          {data.items.map((item) => (
            <AgentCard item={item} key={item.canonical_agent_id} />
          ))}
        </div>
      ) : null}

      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="muted">
          Total: {data.total} | Page {data.page}
        </span>
        <div className="row">
          {hasPrev ? <Link href={makePageHref(data.page - 1)}>Previous</Link> : <span className="muted">Previous</span>}
          {hasNext ? <Link href={makePageHref(data.page + 1)}>Next</Link> : <span className="muted">Next</span>}
        </div>
      </div>
    </main>
  );
}
