/**
 * Runtime configuration. The backend base URL is never hardcoded — it comes
 * from the environment (VITE_API_BASE_URL). When it is absent the app runs in
 * "mock mode" so the UI is fully explorable before the Spring Boot API is
 * reachable.
 */
const rawBaseUrl = (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.trim();

export const env = {
  apiBaseUrl: rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl.replace(/\/$/, "") : null,
  get isMockMode(): boolean {
    return this.apiBaseUrl === null;
  },
} as const;
