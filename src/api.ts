/**
 * NATAN ADMIN API
 * ط§ظ„ط§طھطµط§ظ„ ط¨ط§ظ„ط³ظٹط±ظپط± ط§ظ„ط­ظ‚ظٹظ‚ظٹ
 */

export const DEFAULT_SERVER_URL = "https://natan-server.onrender.com";

/**
 * ط§ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط¹ظ†ظˆط§ظ† ط§ظ„ط³ظٹط±ظپط±.
 *
 * ط§ظ„ط£ظˆظ„ظˆظٹط©:
 * 1) ط§ظ„ط¹ظ†ظˆط§ظ† ط§ظ„ظ…ط­ظپظˆط¸ ظپظٹ ط§ظ„ظ‡ط§طھظپ
 * 2) VITE_API_URL
 * 3) ط§ظ„ط³ظٹط±ظپط± ط§ظ„ط§ظپطھط±ط§ط¶ظٹ
 */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("natan_custom_api_url");

    if (custom && custom.trim()) {
      return normalizeApiUrl(custom);
    }
  }

  const envUrl =
    typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_API_URL
      : undefined;

  return normalizeApiUrl(
    envUrl || DEFAULT_SERVER_URL
  );
}

/**
 * طھظ†ط¸ظٹظپ ط¹ظ†ظˆط§ظ† ط§ظ„ط³ظٹط±ظپط±.
 */
function normalizeApiUrl(url: string): string {
  let value = String(url || "").trim();

  if (!value) {
    return DEFAULT_SERVER_URL;
  }

  // ط¥ط²ط§ظ„ط© / ظپظٹ ط§ظ„ظ†ظ‡ط§ظٹط©
  value = value.replace(/\/+$/, "");

  // ط¥ط°ط§ ظƒط§ظ† ط§ظ„ظ…ط³طھط®ط¯ظ… ط£ط¯ط®ظ„ /api ظپظٹ ط§ظ„ظ†ظ‡ط§ظٹط©
  // ظ†ط²ظٹظ„ظ‡ط§ ظ„ط£ظ† ط§ظ„ط·ظ„ط¨ط§طھ طھط¶ظٹظپ ط§ظ„ظ…ط³ط§ط± ط¨ظ†ظپط³ظ‡ط§.
  if (value.endsWith("/api")) {
    value = value.slice(0, -4);
  }

  return value;
}

/**
 * ط­ظپط¸ ط¹ظ†ظˆط§ظ† ط§ظ„ط³ظٹط±ظپط±.
 */
export function setApiUrl(url: string) {
  if (typeof window !== "undefined") {
    const value = String(url || "").trim();

    if (value) {
      localStorage.setItem(
        "natan_custom_api_url",
        normalizeApiUrl(value)
      );
    } else {
      localStorage.removeItem(
        "natan_custom_api_url"
      );
    }
  }
}

/**
 * طھظ†ظپظٹط° ط·ظ„ط¨ API.
 */
async function request(
  path: string,
  options: RequestInit = {}
) {
  const API_URL = getApiUrl();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("natan_admin_token")
      : null;

  const buildUrl = (p: string) => {
    const cleanBase =
      API_URL.replace(/\/+$/, "");

    const cleanPath =
      p.startsWith("/") ? p : `/${p}`;

    return `${cleanBase}${cleanPath}`;
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...((options.headers as Record<string, string>) ||
      {}),
  };

  let response: Response;

  try {
    response = await fetch(
      buildUrl(path),
      {
        ...options,
        headers,
      }
    );

    /**
     * ط¥ط°ط§ ظ„ظ… ظٹط¬ط¯ ط§ظ„ط³ظٹط±ظپط± /api
     * ظ†ط¬ط±ط¨ ط§ظ„ظ…ط³ط§ط± ط¨ط¯ظˆظ† /api.
     */
    if (
      response.status === 404 &&
      path.startsWith("/api/")
    ) {
      const altPath =
        path.replace("/api/", "/");

      const altResponse =
        await fetch(
          buildUrl(altPath),
          {
            ...options,
            headers,
          }
        ).catch(() => null);

      if (altResponse) {
        response = altResponse;
      }
    }
  } catch (err: any) {
    throw new Error(
      `طھط¹ط°ط± ط§ظ„ط§طھطµط§ظ„ ط¨ط§ظ„ط³ظٹط±ظپط±: ${
        err?.message || "Network Error"
      }`
    );
  }

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(
          "natan_admin_token"
        );

        localStorage.removeItem(
          "natan_admin_refresh_token"
        );
      }
    }

    const serverMessage =
      data?.message ||
      data?.error ||
      data?.detail ||
      "";

    throw new Error(
      serverMessage ||
        `HTTP ${response.status} - ${API_URL}`
    );
  }

  return data;
}

/**
 * ظپط­طµ ط§طھطµط§ظ„ ط§ظ„ط³ظٹط±ظپط±.
 */
export async function checkServer() {
  const API_URL = getApiUrl();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("natan_admin_token")
      : null;

  const headers: Record<string, string> = {
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };

  const endpoints = [
    "/api/health",
    "/health",
    "",
  ];

  for (const ep of endpoints) {
    try {
      const url = `${API_URL}${ep}`;

      const res = await fetch(url, {
        method: "GET",
        headers,
      });

      if (res.ok) {
        return await res.json().catch(() => ({
          success: true,
          status: "ok",
        }));
      }
    } catch {
      // طھط¬ط±ط¨ط© ط§ظ„ظ…ط³ط§ط± ط§ظ„طھط§ظ„ظٹ
    }
  }

  return request("/api/health");
}

/**
 * طھط³ط¬ظٹظ„ ط¯ط®ظˆظ„ ط§ظ„ط£ط¯ظ…ظ†.
 */
export async function adminLogin(
  username: string,
  password: string
) {
  const cleanUsername =
    username.trim();

  if (!cleanUsername) {
    throw new Error(
      "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…"
    );
  }

  if (!password) {
    throw new Error(
      "ظٹط±ط¬ظ‰ ط¥ط¯ط®ط§ظ„ ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±"
    );
  }

  const result = await request(
    "/api/admin/login",
    {
      method: "POST",

      body: JSON.stringify({
        username: cleanUsername,
        password,
      }),
    }
  );

  /**
   * ط¯ط¹ظ… ط£ظƒط«ط± ظ…ظ† طµظٹط؛ط© ظ„ظ„ظ€ token.
   */
  const token =
    result?.token ||
    result?.accessToken ||
    result?.data?.token ||
    result?.data?.accessToken ||
    result?.session?.access_token;

  if (!token) {
    throw new Error(
      "ط§ظ„ط³ظٹط±ظپط± ظ„ظ… ظٹط±ط¬ط¹ ط±ظ…ط² طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ (token)"
    );
  }

  localStorage.setItem(
    "natan_admin_token",
    token
  );

  const refreshToken =
    result?.refreshToken ||
    result?.data?.refreshToken ||
    result?.session?.refresh_token;

  if (refreshToken) {
    localStorage.setItem(
      "natan_admin_refresh_token",
      refreshToken
    );
  }

  return result;
}

/**
 * ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط¬ظ„ط³ط© ط§ظ„ط£ط¯ظ…ظ†.
 */
export async function verifyAdminSession() {
  return request(
    "/api/admin/users"
  );
}

/**
 * ط¬ظ„ط¨ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†.
 */
export async function getUsers() {
  return request(
    "/api/admin/users"
  );
}

/**
 * طھط¹ط¯ظٹظ„ ظ…ط³طھط®ط¯ظ….
 */
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

/**
 * ط­ط°ظپ ظ…ط³طھط®ط¯ظ….
 */
export async function deleteUser(
  id: string
) {
  return request(
    `/api/admin/users/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * ط¬ظ„ط¨ ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„.
 */
export async function getActivationCodes() {
  return request(
    "/api/admin/activation-codes"
  );
}

/**
 * ط¥ظ†ط´ط§ط، ط£ظƒظˆط§ط¯ طھظپط¹ظٹظ„.
 */
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

/**
 * طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬.
 */
export function adminLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(
      "natan_admin_token"
    );

    localStorage.removeItem(
      "natan_admin_refresh_token"
    );
  }
}

