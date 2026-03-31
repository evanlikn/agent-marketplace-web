import Link from "next/link";
import { AgentListItem } from "../lib/api";
import { CopyCanonicalIdButton } from "./CopyCanonicalIdButton";

export function AgentCard({ item }: { item: AgentListItem }) {
  return (
    <div className="card space-y">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: 0 }}>{item.display_name}</h3>
          <div className="muted">{item.publisher_id}</div>
        </div>
        <CopyCanonicalIdButton canonicalId={item.canonical_agent_id} />
      </div>
      <div>{item.description}</div>
      <div className="muted">Canonical ID: {item.canonical_agent_id}</div>
      <div className="muted">Skills: {item.skills.map((s) => s.name).join(", ") || "N/A"}</div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="muted">Updated: {new Date(item.updated_at).toLocaleString()}</span>
        <Link href={`/agents/${encodeURIComponent(item.canonical_agent_id)}`}>View Details</Link>
      </div>
    </div>
  );
}
