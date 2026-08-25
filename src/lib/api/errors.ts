/**
 * Central error normalisation. Raw backend exceptions and transport errors are
 * never surfaced to users — they are mapped to a stable, user-facing message.
 */
export type ApiErrorKind =
  | "network"
  | "validation"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "server"
  | "unknown";

export class ApiError extends Error {
  readonly status: number;
  readonly kind: ApiErrorKind;
  readonly fieldErrors: Record<string, string>;

  constructor(options: {
    status: number;
    kind: ApiErrorKind;
    message: string;
    fieldErrors?: Record<string, string>;
  }) {
    super(options.message);
    this.name = "ApiError";
    this.status = options.status;
    this.kind = options.kind;
    this.fieldErrors = options.fieldErrors ?? {};
  }
}

export function kindForStatus(status: number): ApiErrorKind {
  if (status === 0) return "network";
  if (status === 400 || status === 422) return "validation";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
}

const MESSAGES: Record<ApiErrorKind, string> = {
  network: "We couldn't reach NeuronixAI. Check your connection and try again.",
  validation: "Some of the information provided isn't valid. Please review and retry.",
  unauthorized: "Your session has expired. Please log in again.",
  forbidden: "You don't have permission to perform this action.",
  not_found: "We couldn't find what you were looking for.",
  conflict: "That request conflicts with existing data.",
  rate_limited: "Too many requests. Please wait a moment and try again.",
  server: "Something went wrong on our side. Please try again.",
  unknown: "Something unexpected happened. Please try again.",
};

/** Human message for any thrown value, safe to render in the UI. */
export function toUserMessage(error: unknown, overrides?: Partial<Record<ApiErrorKind, string>>): string {
  if (error instanceof ApiError) {
    return overrides?.[error.kind] ?? error.message ?? MESSAGES[error.kind];
  }
  if (error instanceof Error && error.name === "AbortError") {
    return "The request was cancelled.";
  }
  return overrides?.unknown ?? MESSAGES.unknown;
}

export function defaultMessage(kind: ApiErrorKind): string {
  return MESSAGES[kind];
}
