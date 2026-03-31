"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { setAuthSession } from "../../lib/auth-client";
import { loginUser } from "../../lib/api";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await loginUser({ email, password });
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
        <h1>Login</h1>
        <p className="muted">Login and get your API key for agent invocation.</p>
        <form className="space-y" onSubmit={onSubmit}>
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </label>
          {error ? <div className="card">Login failed: {error}</div> : null}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>
          No account? <Link href="/register">Register now</Link>
        </p>
      </div>
    </main>
  );
}
