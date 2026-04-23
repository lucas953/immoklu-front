const DEFAULT_API_URL = "http://localhost:4000";

let refreshRequest: Promise<boolean> | null = null;

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json") ? await response.json() : null;
}

async function executeRequest(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const hasJsonBody = init.body !== undefined && !headers.has("Content-Type");

  if (hasJsonBody) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getApiBaseUrl()}/v1${path}`, {
    ...init,
    headers,
    credentials: "include"
  });

  const data = await parseResponse(response);

  return { response, data };
}

async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      const { response } = await executeRequest("/auth/refresh", {
        method: "POST"
      });

      return response.ok;
    })().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

function shouldAttemptRefresh(path: string, status: number, retryCount: number) {
  if (status !== 401 || retryCount > 0) {
    return false;
  }

  return !path.startsWith("/auth/login") &&
    !path.startsWith("/auth/register") &&
    !path.startsWith("/auth/refresh") &&
    !path.startsWith("/auth/password/forgot") &&
    !path.startsWith("/auth/password/reset")
    ? true
    : false;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, retryCount = 0): Promise<T> {
  const { response, data } = await executeRequest(path, init);

  if (shouldAttemptRefresh(path, response.status, retryCount)) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return apiRequest<T>(path, init, retryCount + 1);
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Request to ${path} failed with status ${response.status}.`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
