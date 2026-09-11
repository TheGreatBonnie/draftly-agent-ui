const BASE_URL = "/api";

let _token: string | null = null;
let _pendingToken: Promise<string | null> | null = null;
let _authReadyResolve: (() => void) | null = null;
let _authReadyPromise: Promise<void> | null = null;

function ensureAuthReady(): Promise<void> {
  if (_token || _pendingToken) return Promise.resolve();
  if (!_authReadyPromise) {
    _authReadyPromise = new Promise((resolve) => {
      _authReadyResolve = resolve;
    });
  }
  return _authReadyPromise;
}

export function setApiToken(token: string | null) {
  _token = token;
  _pendingToken = token !== null ? Promise.resolve(token) : null;
  if (_authReadyResolve) {
    _authReadyResolve();
    _authReadyResolve = null;
  }
}

export function setPendingToken(promise: Promise<string | null>) {
  _pendingToken = promise;
  if (_authReadyResolve) {
    _authReadyResolve();
    _authReadyResolve = null;
  }
  promise.then((token) => {
    _token = token;
    _pendingToken = null;
  });
}

/** Current (or pending) Clerk token, for flows that cannot use request()
 *  such as EventSource ticket exchanges. */
export function getApiToken(): Promise<string | null> {
  return _pendingToken ?? Promise.resolve(_token);
}

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  await ensureAuthReady();
  if (_pendingToken) {
    await _pendingToken;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (_token) {
    headers["Authorization"] = `Bearer ${_token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { ...headers, ...options?.headers as Record<string, string> },
    ...options,
  });
  if (res.status === 401) {
    setApiToken(null);
    window.location.href = "/sign-in";
    throw new ApiError(401, "Session expired");
  }
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    if (contentType.includes("text/html")) {
      throw new ApiError(res.status, "Backend returned HTML — check if the API server is running");
    }
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    const message = Array.isArray(body.detail)
      ? body.detail.map((d: { msg?: string }) => d?.msg ?? "Request failed").join("; ")
      : body.detail ?? body.error ?? "Request failed";
    throw new ApiError(res.status, message);
  }
  if (contentType.includes("text/html")) {
    throw new ApiError(res.status, "Backend returned HTML — check if the API server is running");
  }
  return res.json();
}

export { request, ApiError };
