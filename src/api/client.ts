import getInitData from "../utils/getInitData";

const API_BASE = "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method?: RequestMethods;
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body, signal } = options;
  const headers: Record<string, string> = getAuthHeaders();

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(API_BASE + path, {
    headers,
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    let message = "Request failed, status: " + response.status;
    try {
      const data = JSON.parse(errorMsg);
      message = data?.error ?? message;
    } catch {
      // не JSON — остаётся заготовка
    }
    throw new ApiError(response.status, message);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  } else {
    return (await response.text()) as T;
  }
}

function getAuthHeaders(): Record<string, string> {
  const initData = getInitData();
  if (!initData) return {};
  return { Authorization: "tma " + initData };
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
