const API_BASE = "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(API_BASE + path, {
    headers: getAuthHeaders(),
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
  const initData = window.Telegram?.WebApp?.initData;
  if (!initData) return {};
  return { Authorization: "tma " + initData };
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}
