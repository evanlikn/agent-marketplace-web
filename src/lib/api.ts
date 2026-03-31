export interface AgentListItem {
  canonical_agent_id: string;
  publisher_id: string;
  agent_id: string;
  display_name: string;
  description: string;
  skills: Array<{ id: string; name: string; tags: string[] }>;
  visibility: "public" | "unlisted" | "private";
  updated_at: string;
}

export interface AgentListResponse {
  items: AgentListItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface ResolveResponse {
  canonical_agent_id: string;
  listing_id: string;
  publisher_id: string;
  agent_id: string;
  visibility: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  return (await response.json()) as T;
}

async function fetchJsonWithInit<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  return (await response.json()) as T;
}

export async function getAgents(params: {
  q?: string;
  page?: number;
  pageSize?: number;
  visibility?: "public" | "unlisted" | "private";
}): Promise<AgentListResponse> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("page_size", String(params.pageSize));
  if (params.visibility) search.set("visibility", params.visibility);
  const query = search.toString();
  return fetchJson<AgentListResponse>(`/v1/agents${query ? `?${query}` : ""}`);
}

export async function resolveCanonicalAgent(canonicalId: string): Promise<ResolveResponse> {
  const [publisherId, agentId] = canonicalId.split("/");
  if (!publisherId || !agentId) {
    throw new Error("Invalid canonical id");
  }
  return fetchJson<ResolveResponse>(
    `/v1/agents/resolve/${encodeURIComponent(publisherId)}/${encodeURIComponent(agentId)}`
  );
}

export async function getA2ACard(listingId: string): Promise<Record<string, unknown>> {
  return fetchJson<Record<string, unknown>>(`/v1/a2a/agent-card/${encodeURIComponent(listingId)}`);
}

export interface AuthResponse {
  user: {
    user_id: string;
    email: string;
    display_name: string;
    caller_id: string;
  };
  access_token: string;
  api_key: string;
  api_key_id: string;
}

export async function registerUser(input: {
  email: string;
  password: string;
  display_name: string;
}): Promise<AuthResponse> {
  return fetchJsonWithInit<AuthResponse>("/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return fetchJsonWithInit<AuthResponse>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function createApiKey(accessToken: string): Promise<{ key_id: string; api_key: string }> {
  return fetchJsonWithInit<{ key_id: string; api_key: string }>("/v1/auth/api-key/create", {
    method: "POST",
    body: JSON.stringify({}),
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });
}

export async function getMyAuthInfo(accessToken: string): Promise<{
  caller_id: string;
  auth_type: string;
  keys: Array<{ key_id: string; scope: string; status: string; created_at: string }>;
}> {
  const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  return (await response.json()) as {
    caller_id: string;
    auth_type: string;
    keys: Array<{ key_id: string; scope: string; status: string; created_at: string }>;
  };
}

export async function invokeByCanonicalId(input: {
  canonicalId: string;
  userInput: string;
  accessToken: string;
}): Promise<{ request_id: string; output: string; token_usage?: unknown; cost?: number }> {
  const [publisherId, agentId] = input.canonicalId.split("/");
  if (!publisherId || !agentId) {
    throw new Error("Invalid canonical id");
  }
  return fetchJsonWithInit<{ request_id: string; output: string; token_usage?: unknown; cost?: number }>(
    `/v1/invoke/by-agent/${encodeURIComponent(publisherId)}/${encodeURIComponent(agentId)}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${input.accessToken}`
      },
      body: JSON.stringify({
        input: input.userInput
      })
    }
  );
}
