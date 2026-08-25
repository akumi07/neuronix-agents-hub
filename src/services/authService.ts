import { apiRequest, sessionStore } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { AuthResult, User } from "@/types/domain";

import { mockBackend } from "./mock/runtime";

export interface Credentials {
  email: string;
  password: string;
}

/**
 * Auth is the only service that touches session storage. Endpoints match the
 * NeuronixAI Spring Boot contract (`/api/auth/*`) and fall back to the mock
 * runtime when no API base URL is configured.
 */
export const authService = {
  async login(credentials: Credentials, remember: boolean): Promise<User> {
    const result = env.isMockMode
      ? await mockBackend.login(credentials.email, credentials.password)
      : await apiRequest<AuthResult>("/api/auth/login", {
          method: "POST",
          body: credentials,
          anonymous: true,
        });

    sessionStore.write({
      token: result.token,
      email: result.user.email,
      displayName: result.user.displayName,
      persistent: remember,
    });
    return result.user;
  },

  async register(credentials: Credentials): Promise<User> {
    const result = env.isMockMode
      ? await mockBackend.register(credentials.email, credentials.password)
      : await apiRequest<AuthResult>("/api/auth/register", {
          method: "POST",
          body: credentials,
          anonymous: true,
        });

    sessionStore.write({
      token: result.token,
      email: result.user.email,
      displayName: result.user.displayName,
      persistent: true,
    });
    return result.user;
  },

  /** Restores the user attached to a stored session, or null when none. */
  async restore(): Promise<User | null> {
    const session = sessionStore.read();
    if (!session) return null;
    try {
      return env.isMockMode
        ? await mockBackend.currentUser(session.email)
        : await apiRequest<User>("/api/auth/me");
    } catch {
      sessionStore.clear();
      return null;
    }
  },

  logout() {
    sessionStore.clear();
  },
};
