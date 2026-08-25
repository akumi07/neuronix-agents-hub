import { env } from "../env";
import { ApiError, defaultMessage, kindForStatus } from "./errors";

const TOKEN_STORAGE_KEY = "neuronix.session";

export interface StoredSession {
  token: string;
  email: string;
  displayName: string;
  persistent: boolean;
}

/**
 * Session storage lives in one place so authentication concerns never leak into
 * UI components. `persistent` maps to "remember me".
 */
export const sessionStore = {
  read(): StoredSession | null {
    if (typeof window === "undefined") return null;
    const raw =
      window.localStorage.getItem(TOKEN_STORAGE_KEY) ??
      window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredSession;
    } catch {
      return null;
    }
  },
  write(session: StoredSession) {
    if (typeof window === "undefined") return;
    const target = session.persistent ? window.localStorage : window.sessionStorage;
    target.setItem(TOKEN_STORAGE_KEY, JSON.stringify(session));
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** Skip the Authorization header (login / register). */
  anonymous?: boolean;
}

interface BackendErrorBody {
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  fieldErrors?: Record<string, string>;
}

/**
 * Thin fetch wrapper around the NeuronixAI Spring Boot API. Every service goes
 * through this so auth, error normalisation and JSON handling are centralised.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!env.apiBaseUrl) {
    throw new ApiError({
      status: 0,
      kind: "network",
      message: "The NeuronixAI API is not configured for this environment yet.",
    });
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (!options.anonymous) {
    const session = sessionStore.read();
    if (session) headers["Authorization"] = `Bearer ${session.token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      signal: options.signal,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch (cause) {
    if (cause instanceof Error && cause.name === "AbortError") throw cause;
    throw new ApiError({ status: 0, kind: "network", message: defaultMessage("network") });
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const payload: unknown = text ? safeJson(text) : null;

  if (!response.ok) {
    const kind = kindForStatus(response.status);
    const body = (payload ?? {}) as BackendErrorBody;
    throw new ApiError({
      status: response.status,
      kind,
      // Backend stack traces / raw exception strings are intentionally dropped.
      message: defaultMessage(kind),
      fieldErrors: body.fieldErrors ?? body.errors ?? {},
    });
  }

  return payload as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
