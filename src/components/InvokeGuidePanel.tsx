export function InvokeGuidePanel({ canonicalId }: { canonicalId: string }) {
  const [publisherId, agentId] = canonicalId.split("/");
  const invokePath = `/v1/invoke/by-agent/${publisherId}/${agentId}`;
  const a2aPath = `/v1/a2a/invoke/by-agent/${publisherId}/${agentId}`;
  return (
    <div className="card space-y">
      <h3 style={{ margin: 0 }}>Invoke Guide</h3>
      <div className="muted">Bearer token invoke:</div>
      <pre>{`curl -X POST "$API_BASE_URL${invokePath}" \\
  -H "content-type: application/json" \\
  -H "authorization: Bearer <caller_access_token>" \\
  -d '{"input":"hello"}'`}</pre>
      <div className="muted">API key invoke:</div>
      <pre>{`curl -X POST "$API_BASE_URL${invokePath}" \\
  -H "content-type: application/json" \\
  -H "x-api-key: <caller_api_key>" \\
  -d '{"input":"hello"}'`}</pre>
      <div className="muted">A2A invoke:</div>
      <pre>{`curl -X POST "$API_BASE_URL${a2aPath}" \\
  -H "content-type: application/json" \\
  -H "authorization: Bearer <caller_access_token>" \\
  -d '{"input":"hello"}'`}</pre>
    </div>
  );
}
