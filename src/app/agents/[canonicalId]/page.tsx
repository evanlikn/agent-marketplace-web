import Link from "next/link";
import { AgentChatPanel } from "../../../components/AgentChatPanel";
import { InvokeGuidePanel } from "../../../components/InvokeGuidePanel";
import { getA2ACard, resolveCanonicalAgent } from "../../../lib/api";

export default async function AgentDetailPage({
  params
}: {
  params: { canonicalId: string };
}) {
  const canonicalId = decodeURIComponent(params.canonicalId);
  let resolveData: Awaited<ReturnType<typeof resolveCanonicalAgent>> | null = null;
  let card: Record<string, unknown> | null = null;
  let error = "";

  try {
    resolveData = await resolveCanonicalAgent(canonicalId);
    card = await getA2ACard(resolveData.listing_id);
  } catch (err) {
    error = String(err);
  }

  return (
    <main className="container space-y">
      <Link href="/">Back to list</Link>
      <h1 style={{ marginBottom: 0 }}>Agent Details</h1>
      <div className="muted" style={{ marginTop: 0 }}>
        Canonical ID: {canonicalId}
      </div>

      {error ? <div className="card">Failed to load detail: {error}</div> : null}

      {resolveData ? (
        <div className="card space-y">
          <div>
            <strong>Publisher:</strong> {resolveData.publisher_id}
          </div>
          <div>
            <strong>Agent ID:</strong> {resolveData.agent_id}
          </div>
          <div>
            <strong>Listing ID:</strong> {resolveData.listing_id}
          </div>
          <div>
            <strong>Visibility:</strong> {resolveData.visibility}
          </div>
        </div>
      ) : null}

      <AgentChatPanel canonicalId={canonicalId} />

      <InvokeGuidePanel canonicalId={canonicalId} />

      {card ? (
        <div className="card space-y">
          <h3 style={{ margin: 0 }}>A2A Agent Card</h3>
          <pre>{JSON.stringify(card, null, 2)}</pre>
        </div>
      ) : null}
    </main>
  );
}
