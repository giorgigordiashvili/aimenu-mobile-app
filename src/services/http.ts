import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "https://admin.aimenu.ge";

async function refreshAccessToken() {
  const refresh = await AsyncStorage.getItem("auth_refresh_token");

  if (!refresh) {
    throw new Error("SESSION_EXPIRED");
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    await AsyncStorage.multiRemove([
      "auth_token",
      "auth_refresh_token",
      "auth_user",
    ]);
    throw new Error("SESSION_EXPIRED");
  }

  const data = await res.json();
  await AsyncStorage.setItem("auth_token", data.access);
  return data.access as string;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let token = await AsyncStorage.getItem("auth_token");

  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }

  const doRequest = (t: string) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${t}`,
      },
    });

  let response = await doRequest(token);

  if (response.status === 401) {
    try {
      token = await refreshAccessToken();
      response = await doRequest(token);
    } catch {
      throw new Error("SESSION_EXPIRED");
    }
  }

  return response;
}

export const api = {
  get: async (
    path: string,
    options?: { params?: Record<string, string | number> },
  ): Promise<any> => {
    const url = new URL(`${API_BASE_URL}/api/v1${path}`);
    if (options?.params) {
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null)
          url.searchParams.append(k, String(v));
      });
    }
    const res = await authFetch(url.toString(), { method: "GET" });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  },

  post: async (path: string, body?: unknown): Promise<any> => {
    const res = await authFetch(`${API_BASE_URL}/api/v1${path}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} - ${text}`);
    }
    return res.json();
  },

  patch: async (path: string, body?: unknown): Promise<any> => {
    const res = await authFetch(`${API_BASE_URL}/api/v1${path}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} - ${text}`);
    }
    return res.json();
  },

  delete: async (path: string): Promise<void> => {
    const res = await authFetch(`${API_BASE_URL}/api/v1${path}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 204) {
      const text = await res.text();
      throw new Error(`${res.status} - ${text}`);
    }
  },
};
