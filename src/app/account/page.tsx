"use client";

import { useEffect, useState } from "react";
import { getAuthSession, setAuthSession } from "../../lib/auth-client";
import { createApiKey, getMyAuthInfo } from "../../lib/api";

export default function AccountPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [callerId, setCallerId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [keysCount, setKeysCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const session = getAuthSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setEmail(session.user.email);
      setCallerId(session.user.caller_id);
      setApiKey(session.apiKey);
      try {
        const me = await getMyAuthInfo(session.accessToken);
        setKeysCount(me.keys.length);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const onCreateNewApiKey = async () => {
    const session = getAuthSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }
    setError("");
    try {
      const created = await createApiKey(session.accessToken);
      const nextSession = {
        ...session,
        apiKey: created.api_key
      };
      setAuthSession(nextSession);
      setApiKey(created.api_key);
      const me = await getMyAuthInfo(session.accessToken);
      setKeysCount(me.keys.length);
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <main className="container">
      <div className="card">
        <h1>User Details</h1>
        <p className="muted">View your account info and manage API keys.</p>
        {loading ? <p>Loading...</p> : null}
        {!loading ? (
          <div className="space-y">
            <div className="card">
              <div>
                <strong>User</strong>: {email}
              </div>
              <div>
                <strong>Caller ID</strong>: {callerId}
              </div>
              <div>
                <strong>Stored Keys</strong>: {keysCount}
              </div>
            </div>
            <label className="field">
              <span>Current API Key (visible only now)</span>
              <textarea value={apiKey} readOnly rows={3} />
            </label>
            <div className="row">
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(apiKey);
                }}
              >
                Copy API Key
              </button>
              <button type="button" onClick={onCreateNewApiKey}>
                Generate New API Key
              </button>
            </div>
            {error ? <div className="card">Error: {error}</div> : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
