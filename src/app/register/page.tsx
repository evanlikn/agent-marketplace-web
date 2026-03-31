"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { setAuthSession } from "../../lib/auth-client";
import { registerUser } from "../../lib/api";

export default function RegisterPage(): JSX.Element {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await registerUser({
        display_name: displayName,
        email,
        password
      });
      setAuthSession({
        accessToken: result.access_token,
        apiKey: result.api_key,
        user: result.user
      });
      router.push("/account");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1>Register</h1>
        <p className="muted">Create a caller account and receive your first API key.</p>
        <form className="space-y" onSubmit={onSubmit}>
          <label className="field">
            <span>Display Name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </label>
          {error ? <div className="card">Register failed: {error}</div> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}
