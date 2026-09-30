export const DEFAULT_SERVER_URL =
  "https://yyaoixgbkfpcvjinzcbc.supabase.co/functions/v1/natan-api";

export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("natan_custom_api_url");
    if (custom && !custom.includes("onrender.com")) {
      return custom.trim().replace(/\/$/, "");
    }
  }
  return (
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    DEFAULT_SERVER_URL
  ).replace(/\/$/, "");
}

export function setApiUrl(url: string) {
  if (typeof window !== "undefined") {
    if (url && url.trim()) {
      localStorage.setItem("natan_custom_api_url", url.trim());
    } else {
      localStorage.removeItem("natan_custom_api_url");
    }
  }
}

async function request(
  path: string,
  options: RequestInit = {}
) {
  const API_URL = getApiUrl();
  const token = localStorage.getItem("natan_admin_token");

  const buildUrl = (p: string) => {
    const cleanBase = API_URL.replace(/\/$/, "");
    const cleanPath = p.startsWith("/") ? p : `/${p}`;
    return `${cleanBase}${cleanPath}`;
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });

    // If 404 and path started with /api/, try fallback path without /api/
    if (response.status === 404 && path.startsWith("/api/")) {
      const altPath = path.replace("/api/", "/");
      const altResponse = await fetch(buildUrl(altPath), {
        ...options,
        headers,
      }).catch(() => null);
      if (altResponse && altResponse.ok) {
        response = altResponse;
      }
    }
  } catch (err: any) {
    throw new Error(err.message || "تعذر الاتصال بالسيرفر");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("natan_admin_token");
    }

    throw new Error(
      data.message ||
        data.error ||
        `HTTP ${response.status}`
    );
  }

  return data;
}

export async function checkServer() {
  const API_URL = getApiUrl();
  const token = localStorage.getItem("natan_admin_token");
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Try standard endpoints
  const endpoints = ["/api/health", "/health", ""];
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${API_URL}${ep}`, {
        method: "GET",
        headers,
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({ status: "ok" }));
        return json;
      }
    } catch {
      // try next candidate
    }
  }

  return request("/api/health");
}

export async function adminLogin(
  username: string,
  password: string
) {
  const result = await request(
    "/api/admin/login",
    {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const token =
    result?.token ||
    result?.accessToken ||
    result?.data?.token ||
    result?.data?.accessToken;

  if (token) {
    localStorage.setItem(
      "natan_admin_token",
      token
    );
  }

  const refreshToken =
    result?.refreshToken ||
    result?.data?.refreshToken;
  if (refreshToken) {
    localStorage.setItem(
      "natan_admin_refresh_token",
      refreshToken
    );
  }

  return result;
}

/*
 * Verify that the currently stored admin JWT
 * is still valid.
 */
export async function verifyAdminSession() {
  return request("/api/admin/users");
}

export async function getUsers() {
  return request("/api/admin/users");
}

export async function updateUser(
  id: string,
  data: {
    username?: string;
    email?: string | null;
    fullName?: string | null;
    isActive?: boolean;
    maxDevices?: number;
    extendDays?: number;
    password?: string;
  }
) {
  return request(
    `/api/admin/users/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteUser(id: string) {
  return request(
    `/api/admin/users/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

export async function getActivationCodes() {
  return request(
    "/api/admin/activation-codes"
  );
}

export async function createActivationCodes(
  durationDays: number,
  count: number
) {
  return request(
    "/api/admin/activation-codes",
    {
      method: "POST",
      body: JSON.stringify({
        durationDays,
        count,
      }),
    }
  );
}

export function adminLogout() {
  localStorage.removeItem(
    "natan_admin_token"
  );
  localStorage.removeItem(
    "natan_admin_refresh_token"
  );
}

