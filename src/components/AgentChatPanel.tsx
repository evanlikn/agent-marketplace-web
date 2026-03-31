"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getAuthSession } from "../lib/auth-client";
import { invokeByCanonicalId } from "../lib/api";

interface ChatMessage {
  role: "user" | "agent";
  content: string;
}

export function AgentChatPanel({ canonicalId }: { canonicalId: string }): JSX.Element {
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = getAuthSession();
    setAccessToken(session?.accessToken ?? "");
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || !accessToken || loading) return;
    setLoading(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    try {
      const response = await invokeByCanonicalId({
        canonicalId,
        userInput: content,
        accessToken
      });
      setMessages((prev) => [...prev, { role: "agent", content: response.output }]);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <div className="card space-y">
        <h3 style={{ margin: 0 }}>Try This Agent</h3>
        <div className="muted">Login required before invoking this agent from web chat.</div>
        <div className="row">
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card space-y">
      <h3 style={{ margin: 0 }}>Try This Agent</h3>
      <div className="chat-panel">
        {messages.length === 0 ? <div className="muted">Send a message to start chatting with this agent.</div> : null}
        {messages.map((message, index) => (
          <div className={`chat-msg ${message.role}`} key={`${message.role}-${index}`}>
            <strong>{message.role === "user" ? "You" : "Agent"}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form className="row" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? "Calling..." : "Send"}
        </button>
      </form>
      {error ? <div className="card">Invoke failed: {error}</div> : null}
    </div>
  );
}
