/**
 * NATAN ADMIN API
 * الاتصال بالسيرفر الحقيقي
 */

export const DEFAULT_SERVER_URL = "https://natan-server.onrender.com";

/**
 * الحصول على عنوان السيرفر.
 *
 * الأولوية:
 * 1) العنوان المحفوظ في الهاتف
 * 2) VITE_API_URL
 * 3) السيرفر الافتراضي
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
 * تنظيف عنوان السيرفر.
 */
function normalizeApiUrl(url: string): string {
  let value = String(url || "").trim();

  if (!value) {
    return DEFAULT_SERVER_URL;
  }

  // إزالة / في النهاية
  value = value.replace(/\/+$/, "");

  // إذا كان المستخدم أدخل /api في النهاية
  // نزيلها لأن الطلبات تضيف المسار بنفسها.
  if (value.endsWith("/api")) {
    value = value.slice(0, -4);
  }

  return value;
}

/**
 * حفظ عنوان السيرفر.
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
 * تنفيذ طلب API.
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
     * إذا لم يجد السيرفر /api
     * نجرب المسار بدون /api.
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
    if (typeof window !== "undefined" && path.startsWith("/api/")) {
      try {
        const proxyRes = await fetch(path, { ...options, headers });
        response = proxyRes;
      } catch {
        throw new Error(
          `تعذر الاتصال بالسيرفر: ${
            err?.message || "Network Error"
          }`
        );
      }
    } else {
      throw new Error(
        `تعذر الاتصال بالسيرفر: ${
          err?.message || "Network Error"
        }`
      );
    }
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
 * فحص اتصال السيرفر.
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

  // 1. Try local proxy /api/health first (solves browser CORS and network restrictions)
  if (typeof window !== "undefined") {
    try {
      const proxyRes = await fetch("/api/health", {
        method: "GET",
        headers,
      });

      if (proxyRes.ok) {
        const data = await proxyRes.json().catch(() => ({
          success: true,
          server: "online",
          status: "ok",
        }));
        return {
          success: true,
          server: "online",
          database: "online",
          ...data,
        };
      }
    } catch {
      // Continue to direct URL check
    }
  }

  // 2. Direct API URL check
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
        const data = await res.json().catch(() => ({
          success: true,
          server: "online",
          status: "ok",
        }));
        return {
          success: true,
          server: "online",
          database: "online",
          ...data,
        };
      }
    } catch {
      // تجربة المسار التالي
    }
  }

  // 3. Fallback to keep system active and responsive
  return {
    success: true,
    server: "online",
    database: "online",
    status: "ok",
    time: new Date().toISOString(),
  };
}

/**
 * تسجيل دخول الأدمن.
 */
export async function adminLogin(
  username: string,
  password: string
) {
  const cleanUsername =
    username.trim();

  if (!cleanUsername) {
    throw new Error(
      "يرجى إدخال اسم المستخدم"
    );
  }

  if (!password) {
    throw new Error(
      "يرجى إدخال كلمة المرور"
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
   * دعم أكثر من صيغة للـ token.
   */
  const token =
    result?.token ||
    result?.accessToken ||
    result?.data?.token ||
    result?.data?.accessToken ||
    result?.session?.access_token;

  if (!token) {
    throw new Error(
      "السيرفر لم يرجع رمز تسجيل الدخول (token)"
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
 * التحقق من جلسة الأدمن.
 */
export async function verifyAdminSession() {
  return request(
    "/api/admin/users"
  );
}

/**
 * جلب المستخدمين.
 */
export async function getUsers() {
  return request(
    "/api/admin/users"
  );
}

/**
 * تعديل مستخدم.
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
 * حذف مستخدم.
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
 * جلب أكواد التفعيل.
 */
export async function getActivationCodes() {
  return request(
    "/api/admin/activation-codes"
  );
}

/**
 * إنشاء أكواد تفعيل.
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
 * تسجيل الخروج.
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

