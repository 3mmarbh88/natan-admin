import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import { useEffect, useMemo, useState } from "react";
import {
  adminLogin,
  adminLogout,
  checkServer,
  createActivationCodes,
  deleteUser,
  getActivationCodes,
  getUsers,
  updateUser,
  verifyAdminSession,
} from "./api";
import "./App.css";

type User = {
  id: string;
  username?: string | null;
  email?: string | null;
  full_name?: string | null;
  is_active?: boolean;
  activation_expires_at?: string | null;
  max_devices?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ActivationCode = {
  id: string;
  code: string;
  duration_days: number;
  is_used: boolean;
  used_by?: string | null;
  expires_at?: string | null;
  created_at?: string | null;
};

type IconName =
  | "grid"
  | "users"
  | "key"
  | "server"
  | "settings"
  | "logout"
  | "menu"
  | "sun"
  | "moon"
  | "refresh"
  | "plus"
  | "copy"
  | "check"
  | "clock"
  | "shield"
  | "activity"
  | "search"
  | "chevron"
  | "edit"
  | "trash"
  | "close"
  | "fingerprint";

function Icon({
  name,
  size = 20,
}: {
  name: IconName;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "key":
      return (
        <svg {...common}>
          <circle cx="7.5" cy="15.5" r="3.5" />
          <path d="m10 13 8-8" />
          <path d="m17 5 2 2" />
          <path d="m14 8 2 2" />
        </svg>
      );

    case "server":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="7" rx="2" />
          <rect x="3" y="14" width="18" height="7" rx="2" />
          <path d="M7 7h.01" />
          <path d="M7 18h.01" />
          <path d="M11 7h6" />
          <path d="M11 18h6" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.4 1.4-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-2v-.6a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.4-1.4.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5v-2h.6a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.4-1.4.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.4 1.4-.06.06a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1.51 1H21v2h-.6a1.65 1.65 0 0 0-1 1Z" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      );

    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.42 1.42" />
          <path d="m17.65 17.65 1.42 1.42" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.35 17.65-1.42 1.42" />
          <path d="m19.07 4.93-1.42 1.42" />
        </svg>
      );

    case "moon":
      return (
        <svg {...common}>
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
          <path d="M4 4v5h5" />
          <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
          <path d="M20 20v-5h-5" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "copy":
      return (
        <svg {...common}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );

    case "trash":
      return (
        <svg {...common}>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 15H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "fingerprint":
      return (
        <svg {...common}>
          <path d="M12 11a2 2 0 0 1 2 2v4" />
          <path d="M9 17v-4a3 3 0 0 1 6 0v4" />
          <path d="M6 17v-4a6 6 0 0 1 12 0v4" />
          <path d="M4 17v-4a8 8 0 0 1 16 0v4" />
          <path d="M12 7a6 6 0 0 1 6 6" />
        </svg>
      );

    default:
      return null;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "â€”";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "â€”";

  return new Intl.DateTimeFormat("ar-BH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatDateTime(value?: string | null) {
  if (!value) return "â€”";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "â€”";

  return new Intl.DateTimeFormat("ar-BH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isExpired(value?: string | null) {
  if (!value) return false;

  const time = new Date(value).getTime();

  if (Number.isNaN(time)) return false;

  return time < Date.now();
}

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("natan_admin_token"))
  );

  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("natan_admin_dark") === "true"
  );

  const [serverOnline, setServerOnline] = useState(false);
  const [serverTime, setServerTime] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);

  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [biometricAvailable, setBiometricAvailable] =
    useState(false);

  const [biometricEnabled, setBiometricEnabled] =
    useState(
      localStorage.getItem("natan_biometric_enabled") === "true"
    );

  const [biometricLoading, setBiometricLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [userSaving, setUserSaving] = useState(false);
  const [userDeleting, setUserDeleting] = useState(false);

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    fullName: "",
    isActive: true,
    maxDevices: 1,
    extendDays: 0,
    password: "",
  });

  const [durationDays, setDurationDays] = useState(30);
  const [count, setCount] = useState(1);

  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode
      ? "dark"
      : "light";

    localStorage.setItem(
      "natan_admin_dark",
      String(darkMode)
    );
  }, [darkMode]);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    loadData();

    const timer = window.setInterval(() => {
      checkServerStatus();
    }, 30000);

    return () => window.clearInterval(timer);
  }, [loggedIn]);

  async function checkServerStatus() {
    try {
      const result = await checkServer();

      setServerOnline(result?.success === true);

      setServerTime(
        result?.timestamp ||
          result?.time ||
          ""
      );
    } catch {
      setServerOnline(false);
    }
  }

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [server, userResult, codeResult] =
        await Promise.all([
          checkServer(),
          getUsers(),
          getActivationCodes(),
        ]);

      setServerOnline(server?.success === true);

      setServerTime(
        server?.timestamp ||
          server?.time ||
          ""
      );

      setUsers(
        userResult?.users ||
          userResult?.data ||
          []
      );

      setCodes(
        codeResult?.codes ||
          codeResult?.data ||
          []
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل البيانات";

      setError(message);

      if (
        message.includes("401") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("invalid token")
      ) {
        adminLogout();
        setLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function checkBiometricAvailability() {
    try {
      const result =
        await BiometricAuth.checkBiometry();

      console.log(
        "NATAN BIOMETRIC CHECK:",
        result
      );

      setBiometricAvailable(
        result?.isAvailable === true
      );

      if (result?.isAvailable !== true) {
        console.log(
          "Biometric unavailable:",
          result?.reason,
          result?.code
        );
      }
    } catch (err) {
      console.error(
        "Biometric check failed:",
        err
      );

      setBiometricAvailable(false);
    }
  }

  async function handleBiometricLogin() {
    const refreshToken =
      localStorage.getItem(
        "natan_admin_refresh_token"
      );

    const savedUsername =
      localStorage.getItem(
        "natan_biometric_username"
      );

    if (!refreshToken || !savedUsername) {
      setError(
        "يجب تسجيل الدخول بكلمة المرور مرة واحدة أولاً."
      );
      return;
    }

    setBiometricLoading(true);
    setError("");

    try {
      console.log(
        "NATAN: starting biometric authentication"
      );

      await BiometricAuth.authenticate({
        reason:
          "تسجيل الدخول إلى NATAN ADMIN",

        cancelTitle:
          "إلغاء",

        androidTitle:
          "NATAN ADMIN",

        androidSubtitle:
          "استخدم بصمة الإصبع أو قفل الجهاز",

        androidConfirmationRequired:
          false,

        allowDeviceCredential:
          true,

        androidBiometryStrength:
          "strong" as any,
      });

      console.log(
        "NATAN: biometric authentication successful"
      );

      /*
       * verifyAdminSession() uses the access token.
       * If it has expired, api.ts automatically
       * refreshes it using natan_admin_refresh_token.
       */
      try {
        await verifyAdminSession();
      } catch (sessionError) {
        console.error(
          "NATAN: saved session is invalid:",
          sessionError
        );

        localStorage.removeItem(
          "natan_admin_token"
        );

        localStorage.removeItem(
          "natan_admin_refresh_token"
        );

        localStorage.removeItem(
          "natan_biometric_username"
        );

        localStorage.removeItem(
          "natan_biometric_enabled"
        );

        setBiometricEnabled(false);
        setLoggedIn(false);

        setError(
          "انتهت جلسة الدخول. يرجى تسجيل الدخول بكلمة المرور مرة أخرى."
        );

        return;
      }

      setUsername(savedUsername);
      setLoggedIn(true);

      showToast(
        "success",
        "تم تسجيل الدخول بالبصمة"
      );

    } catch (err) {
      console.error(
        "NATAN biometric authentication error:",
        err
      );

      const biometricError =
        err as {
          code?: string;
          message?: string;
        };

      console.error(
        "Biometric error code:",
        biometricError?.code
      );

      console.error(
        "Biometric error message:",
        biometricError?.message
      );

      switch (
        biometricError?.code
      ) {
        case "biometryNotEnrolled":
          setError(
            "لا توجد بصمة مسجلة في الهاتف. سجّل بصمة من إعدادات الهاتف أولاً."
          );
          break;

        case "biometryNotAvailable":
          setError(
            "البصمة غير متاحة على هذا الجهاز."
          );
          break;

        case "biometryLockout":
          setError(
            "تم قفل البصمة مؤقتًا. افتح الهاتف باستخدام PIN أو كلمة المرور ثم حاول مرة أخرى."
          );
          break;

        case "passcodeNotSet":
        case "noDeviceCredential":
          setError(
            "يجب إعداد PIN أو نمط أو كلمة مرور للهاتف أولاً."
          );
          break;

        case "userCancel":
        case "systemCancel":
          setError(
            "تم إلغاء التحقق بالبصمة."
          );
          break;

        default:
          setError(
            biometricError?.message ||
              "لم يتم التحقق من البصمة."
          );
      }

    } finally {
      setBiometricLoading(false);
    }
  }
  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoginLoading(true);
    setError("");

    try {
      await adminLogin(
        username,
        password
      );

      localStorage.setItem(
        "natan_biometric_username",
        username.trim()
      );

      if (biometricAvailable) {
        localStorage.setItem(
          "natan_biometric_enabled",
          "true"
        );

        setBiometricEnabled(true);
      }

      setLoggedIn(true);
      setPassword("");

      showToast(
        "success",
        "تم تسجيل الدخول بنجاح"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "بيانات الدخول غير صحيحة"
      );
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    adminLogout();

    setLoggedIn(false);
    setUsers([]);
    setCodes([]);
  }

  function showToast(
    type: "success" | "error",
    message: string
  ) {
    setToast({
      type,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(code);

      showToast(
        "success",
        "تم نسخ كود التفعيل"
      );

      window.setTimeout(() => {
        setCopied("");
      }, 1800);
    } catch {
      showToast(
        "error",
        "تعذر نسخ الكود"
      );
    }
  }

  async function handleCreateCodes() {
    setLoading(true);
    setError("");

    try {
      const result =
        await createActivationCodes(
          durationDays,
          count
        );

      const newCodes =
        result?.codes ||
        result?.data ||
        [];

      setCodes((current) => [
        ...newCodes,
        ...current,
      ]);

      setShowConfirmModal(false);
      setShowCreateModal(false);

      showToast(
        "success",
        `تم إنشاء ${newCodes.length} كود تفعيل بنجاح`
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "تعذر إنشاء أكواد التفعيل";

      setError(message);

      showToast(
        "error",
        message
      );
    } finally {
      setLoading(false);
    }
  }

  function openEditUser(user: User) {
    setSelectedUser(user);

    setUserForm({
      username: user.username || "",
      email: user.email || "",
      fullName: user.full_name || "",
      isActive: user.is_active !== false,
      maxDevices: Math.max(
        1,
        Math.min(
          20,
          Number(
            user.max_devices || 1
          )
        )
      ),
      extendDays: 0,
      password: "",
    });

    setShowUserModal(true);
  }

  function openDeleteUser(user: User) {
    setSelectedUser(user);
    setShowDeleteUserModal(true);
  }

  function closeUserModal() {
    if (userSaving) return;

    setShowUserModal(false);
    setSelectedUser(null);
  }

  async function handleSaveUser() {
    if (!selectedUser) return;

    const cleanUsername =
      userForm.username.trim();

    if (!cleanUsername) {
      showToast(
        "error",
        "اسم المستخدم مطلوب"
      );
      return;
    }

    if (
      userForm.maxDevices < 1 ||
      userForm.maxDevices > 20
    ) {
      showToast(
        "error",
        "عدد الأجهزة يجب أن يكون بين 1 و20"
      );
      return;
    }

    if (
      userForm.extendDays < 0 ||
      userForm.extendDays > 3650
    ) {
      showToast(
        "error",
        "مدة التمديد يجب أن تكون بين 0 و3650 يومًا"
      );
      return;
    }

    if (
      userForm.password &&
      userForm.password.length < 6
    ) {
      showToast(
        "error",
        "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
      );
      return;
    }

    setUserSaving(true);

    try {
      const body = {
        username: cleanUsername,
        email:
          userForm.email.trim() ||
          null,
        fullName:
          userForm.fullName.trim() ||
          null,
        isActive:
          userForm.isActive,
        maxDevices:
          userForm.maxDevices,

        ...(userForm.extendDays > 0
          ? {
              extendDays:
                userForm.extendDays,
            }
          : {}),

        ...(userForm.password
          ? {
              password:
                userForm.password,
            }
          : {}),
      };

      const result =
        await updateUser(
          selectedUser.id,
          body
        );

      const updatedUser =
        result?.user ||
        result?.data;

      if (updatedUser?.id) {
        setUsers((current) =>
          current.map(
            (item) =>
              item.id ===
              updatedUser.id
                ? {
                    ...item,
                    ...updatedUser,
                  }
                : item
          )
        );
      } else {
        await loadData();
      }

      setShowUserModal(false);
      setSelectedUser(null);

      showToast(
        "success",
        "تم تحديث بيانات المستخدم بنجاح"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "تعذر تحديث المستخدم";

      showToast(
        "error",
        message
      );
    } finally {
      setUserSaving(false);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;

    setUserDeleting(true);

    try {
      await deleteUser(
        selectedUser.id
      );

      setUsers((current) =>
        current.filter(
          (user) =>
            user.id !==
            selectedUser.id
        )
      );

      setShowDeleteUserModal(false);
      setSelectedUser(null);

      showToast(
        "success",
        "تم حذف المستخدم بنجاح"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "تعذر حذف المستخدم";

      showToast(
        "error",
        message
      );
    } finally {
      setUserDeleting(false);
    }
  }

  const availableCodes =
    codes.filter(
      (code) =>
        !code.is_used &&
        !isExpired(
          code.expires_at
        )
    ).length;

  const usedCodes =
    codes.filter(
      (code) =>
        code.is_used
    ).length;

  const expiredCodes =
    codes.filter(
      (code) =>
        !code.is_used &&
        isExpired(
          code.expires_at
        )
    ).length;

  const activeUsers =
    users.filter(
      (user) =>
        user.is_active !== false &&
        !isExpired(
          user.activation_expires_at
        )
    ).length;

  const filteredCodes =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) return codes;

      return codes.filter(
        (code) =>
          [
            code.code,
            code.duration_days,
            code.used_by,
            code.is_used
              ? "used"
              : "available",
          ]
            .join(" ")
            .toLowerCase()
            .includes(value)
      );
    }, [codes, search]);

  const recentCodes =
    codes.slice(0, 5);

  if (!loggedIn) {
    return (
      <div
        className="login-page"
        dir="rtl"
      >
        <div className="login-background">
          <div className="glow glow-one" />
          <div className="glow glow-two" />
        </div>

        <div className="login-card">
          <div className="login-brand">
            <div className="brand-mark">
              <Icon
                name="shield"
                size={30}
              />
            </div>

            <div>
              <strong>
                NATAN
              </strong>

              <span>
                ADMIN CONTROL
              </span>
            </div>
          </div>

          <div className="login-heading">
            <h1>
              مرحبًا بعودتك
            </h1>

            <p>
              سجّل الدخول إلى لوحة تحكم
              NATAN لإدارة النظام.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="login-form"
          >
            <label>
              اسم المستخدم

              <input
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                autoComplete="username"
                placeholder="admin"
              />
            </label>

            <label>
              كلمة المرور

              <input
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                type="password"
                autoComplete="current-password"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              />
            </label>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button
              className="primary-button login-button"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <span className="spinner" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  دخول إلى لوحة التحكم

                  <Icon
                    name="chevron"
                    size={18}
                  />
                </>
              )}
            </button>

            {biometricAvailable &&
              biometricEnabled &&
              localStorage.getItem(
                "natan_biometric_username"
              ) && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    handleBiometricLogin
                  }
                  disabled={
                    biometricLoading
                  }
                  style={{
                    width: "100%",
                    marginTop: "12px",
                  }}
                >
                  {biometricLoading ? (
                    <>
                      <span className="spinner" />
                      جارٍ التحقق...
                    </>
                  ) : (
                    <>
                      <Icon
                        name="fingerprint"
                        size={20}
                      />

                      تسجيل الدخول بالبصمة
                    </>
                  )}
                </button>
              )}
          </form>

          <div className="login-footer">
            <span className="status-dot online" />

            Supabase

            <span>â€¢</span>

            نظام الإدارة الآمن
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      id: "dashboard",
      label: "الرئيسية",
      icon: "grid" as IconName,
    },
    {
      id: "users",
      label: "المستخدمون",
      icon: "users" as IconName,
      badge: users.length,
    },
    {
      id: "codes",
      label: "أكواد التفعيل",
      icon: "key" as IconName,
      badge: availableCodes,
    },
    {
      id: "server",
      label: "حالة السيرفر",
      icon: "server" as IconName,
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: "settings" as IconName,
    },
  ];

  return (
    <div
      className={`app-shell ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-collapsed"
      }`}
      dir="rtl"
    >
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">
            <Icon
              name="shield"
              size={23}
            />
          </div>

          {sidebarOpen && (
            <div className="brand-text">
              <strong>
                NATAN
              </strong>

              <span>
                ADMIN
              </span>
            </div>
          )}
        </div>

        <div className="sidebar-section-title">
          {sidebarOpen
            ? "لوحة التحكم"
            : ""}
        </div>

        <nav>
          {navigation.map(
            (item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  page === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPage(item.id)
                }
                title={
                  !sidebarOpen
                    ? item.label
                    : undefined
                }
              >
                <Icon
                  name={item.icon}
                  size={20}
                />

                {sidebarOpen && (
                  <>
                    <span>
                      {item.label}
                    </span>

                    {typeof item.badge ===
                      "number" &&
                      item.badge > 0 && (
                        <small>
                          {item.badge}
                        </small>
                      )}
                  </>
                )}
              </button>
            )
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-server">
            <span
              className={`status-dot ${
                serverOnline
                  ? "online"
                  : "offline"
              }`}
            />

            {sidebarOpen && (
              <div>
                <strong>
                  {serverOnline
                    ? "السيرفر متصل"
                    : "السيرفر غير متصل"}
                </strong>

                <span>
                  {serverOnline
                    ? "Supabase"
                    : "تحقق من الاتصال"}
                </span>
              </div>
            )}
          </div>

          <button
            className="logout-button"
            onClick={
              handleLogout
            }
            title={
              !sidebarOpen
                ? "تسجيل الخروج"
                : undefined
            }
          >
            <Icon
              name="logout"
              size={19}
            />

            {sidebarOpen && (
              <span>
                تسجيل الخروج
              </span>
            )}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-right">
            <button
              className="icon-button menu-button"
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              title="القائمة"
            >
              <Icon
                name="menu"
                size={21}
              />
            </button>

            <div>
              <div className="breadcrumb">
                NATAN <span>/</span>{" "}
                {
                  navigation.find(
                    (x) =>
                      x.id === page
                  )?.label
                }
              </div>

              <h2>
                {page ===
                  "dashboard" &&
                  "نظرة عامة"}

                {page === "users" &&
                  "إدارة المستخدمين"}

                {page === "codes" &&
                  "أكواد التفعيل"}

                {page === "server" &&
                  "حالة النظام"}

                {page === "settings" &&
                  "إعدادات الإدارة"}
              </h2>
            </div>
          </div>

          <div className="topbar-left">
            <div className="live-status">
              <span
                className={`status-dot ${
                  serverOnline
                    ? "online"
                    : "offline"
                }`}
              />

              <span>
                {serverOnline
                  ? "متصل الآن"
                  : "غير متصل"}
              </span>
            </div>

            <button
              className="icon-button"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              title="تغيير المظهر"
            >
              <Icon
                name={
                  darkMode
                    ? "sun"
                    : "moon"
                }
                size={19}
              />
            </button>

            <button
              className="icon-button"
              onClick={
                loadData
              }
              title="تحديث البيانات"
            >
              <Icon
                name="refresh"
                size={19}
              />
            </button>

            <div className="admin-profile">
              <div className="avatar">
                A
              </div>

              <div>
                <strong>
                  Administrator
                </strong>

                <span>
                  مدير النظام
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          {error && (
            <div className="global-error">
              <span>
                {error}
              </span>

              <button
                onClick={() =>
                  setError("")
                }
              >
                أ—
              </button>
            </div>
          )}

          {page ===
            "dashboard" && (
            <>
              <section className="hero-section">
                <div>
                  <span className="eyebrow">
                    NATAN CONTROL CENTER
                  </span>

                  <h1>
                    إدارة النظام
                    <br />
                    <span>
                      بشكل أكثر ذكاءً.
                    </span>
                  </h1>

                  <p>
                    مركز تحكم موحد لمتابعة
                    المستخدمين، التفعيل،
                    وحالة خدمة NATAN.
                  </p>
                </div>

                <div className="hero-server">
                  <div className="hero-server-icon">
                    <Icon
                      name="activity"
                      size={25}
                    />
                  </div>

                  <div>
                    <span>
                      حالة الخادم
                    </span>

                    <strong>
                      {serverOnline
                        ? "Operational"
                        : "Offline"}
                    </strong>
                  </div>

                  <span
                    className={`large-status ${
                      serverOnline
                        ? "online"
                        : "offline"
                    }`}
                  />
                </div>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <Icon
                      name="users"
                      size={21}
                    />
                  </div>

                  <div className="stat-info">
                    <span>
                      إجمالي المستخدمين
                    </span>

                    <strong>
                      {users.length}
                    </strong>

                    <small>
                      <b>
                        {activeUsers}
                      </b>{" "}
                      مستخدم نشط
                    </small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon blue">
                    <Icon
                      name="key"
                      size={21}
                    />
                  </div>

                  <div className="stat-info">
                    <span>
                      أكواد التفعيل
                    </span>

                    <strong>
                      {codes.length}
                    </strong>

                    <small>
                      <b>
                        {availableCodes}
                      </b>{" "}
                      متاح للاستخدام
                    </small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">
                    <Icon
                      name="check"
                      size={21}
                    />
                  </div>

                  <div className="stat-info">
                    <span>
                      أكواد مستخدمة
                    </span>

                    <strong>
                      {usedCodes}
                    </strong>

                    <small>
                      من إجمالي الأكواد
                    </small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orange">
                    <Icon
                      name="clock"
                      size={21}
                    />
                  </div>

                  <div className="stat-info">
                    <span>
                      أكواد منتهية
                    </span>

                    <strong>
                      {expiredCodes}
                    </strong>

                    <small>
                      تحتاج إلى أكواد جديدة
                    </small>
                  </div>
                </div>
              </section>

              <section className="dashboard-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>
                        توزيع أكواد التفعيل
                      </h3>

                      <p>
                        الحالة الحالية لجميع
                        الأكواد
                      </p>
                    </div>

                    <Icon
                      name="key"
                      size={20}
                    />
                  </div>

                  <div className="code-chart">
                    <div
                      className="donut"
                      style={{
                        background:
                          `conic-gradient(
                            var(--success) 0 ${
                              codes.length
                                ? (availableCodes /
                                    codes.length) *
                                  100
                                : 0
                            }%,
                            var(--primary) ${
                              codes.length
                                ? (availableCodes /
                                    codes.length) *
                                  100
                                : 0
                            }% ${
                              codes.length
                                ? ((availableCodes +
                                    usedCodes) /
                                    codes.length) *
                                  100
                                : 0
                            }%,
                            var(--warning) 0
                          )`,
                      }}
                    >
                      <div>
                        <strong>
                          {codes.length}
                        </strong>

                        <span>
                          كود
                        </span>
                      </div>
                    </div>

                    <div className="chart-legend">
                      <div>
                        <span className="legend-dot green" />
                        <label>
                          متاحة
                        </label>
                        <strong>
                          {availableCodes}
                        </strong>
                      </div>

                      <div>
                        <span className="legend-dot blue" />
                        <label>
                          مستخدمة
                        </label>
                        <strong>
                          {usedCodes}
                        </strong>
                      </div>

                      <div>
                        <span className="legend-dot orange" />
                        <label>
                          منتهية
                        </label>
                        <strong>
                          {expiredCodes}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>
                        آخر أكواد التفعيل
                      </h3>

                      <p>
                        أحدث الأكواد التي تم
                        إنشاؤها
                      </p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() =>
                        setPage("codes")
                      }
                    >
                      عرض الكل

                      <Icon
                        name="chevron"
                        size={15}
                      />
                    </button>
                  </div>

                  <div className="recent-list">
                    {recentCodes.length ===
                    0 ? (
                      <div className="empty-state small">
                        لا توجد أكواد حتى الآن
                      </div>
                    ) : (
                      recentCodes.map(
                        (code) => (
                          <div
                            className="recent-item"
                            key={
                              code.id
                            }
                          >
                            <div className="recent-key">
                              <Icon
                                name="key"
                                size={17}
                              />
                            </div>

                            <div className="recent-code">
                              <strong>
                                {code.code}
                              </strong>

                              <span>
                                {
                                  code.duration_days
                                }{" "}
                                يوم
                              </span>
                            </div>

                            <span
                              className={`status-badge ${
                                code.is_used
                                  ? "used"
                                  : isExpired(
                                      code.expires_at
                                    )
                                  ? "expired"
                                  : "available"
                              }`}
                            >
                              {code.is_used
                                ? "مستخدم"
                                : isExpired(
                                    code.expires_at
                                  )
                                ? "منتهي"
                                : "متاح"}
                            </span>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </section>

              <section className="quick-actions">
                <button
                  className="quick-action primary"
                  onClick={() => {
                    setShowCreateModal(
                      true
                    );
                    setPage(
                      "codes"
                    );
                  }}
                >
                  <div>
                    <Icon
                      name="plus"
                      size={23}
                    />
                  </div>

                  <span>
                    <strong>
                      إنشاء كود تفعيل
                    </strong>

                    <small>
                      إصدار كود جديد للمستخدم
                    </small>
                  </span>
                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    setPage(
                      "users"
                    )
                  }
                >
                  <div>
                    <Icon
                      name="users"
                      size={23}
                    />
                  </div>

                  <span>
                    <strong>
                      إدارة المستخدمين
                    </strong>

                    <small>
                      متابعة الحسابات وحالتها
                    </small>
                  </span>
                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    setPage(
                      "server"
                    )
                  }
                >
                  <div>
                    <Icon
                      name="server"
                      size={23}
                    />
                  </div>

                  <span>
                    <strong>
                      فحص السيرفر
                    </strong>

                    <small>
                      آخر حالة لاتصال النظام
                    </small>
                  </span>
                </button>
              </section>
            </>
          )}

          {page === "users" && (
            <section className="panel full-panel">
              <div className="panel-header">
                <div>
                  <h3>
                    المستخدمون
                  </h3>

                  <p>
                    جميع حسابات مستخدمي NATAN
                    المسجلة
                  </p>
                </div>

                <button
                  className="icon-text-button"
                  onClick={
                    loadData
                  }
                  disabled={loading}
                >
                  <Icon
                    name="refresh"
                    size={17}
                  />

                  {loading
                    ? "جاري التحديث..."
                    : "تحديث"}
                </button>
              </div>

              {users.length ===
              0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Icon
                      name="users"
                      size={28}
                    />
                  </div>

                  <h4>
                    لا يوجد مستخدمون حتى الآن
                  </h4>

                  <p>
                    عندما يقوم أول مستخدم
                    بالتسجيل سيظهر حسابه هنا.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          المستخدم
                        </th>

                        <th>
                          الاسم الكامل
                        </th>

                        <th>
                          البريد الإلكتروني
                        </th>

                        <th>
                          الحالة
                        </th>

                        <th>
                          الأجهزة
                        </th>

                        <th>
                          انتهاء التفعيل
                        </th>

                        <th>
                          التسجيل
                        </th>

                        <th>
                          الإدارة
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map(
                        (user) => {
                          const expired =
                            isExpired(
                              user.activation_expires_at
                            );

                          return (
                            <tr
                              key={
                                user.id
                              }
                            >
                              <td>
                                <div className="user-cell">
                                  <div className="user-avatar">
                                    {(
                                      user.username ||
                                      "U"
                                    )[0].toUpperCase()}
                                  </div>

                                  <strong>
                                    {user.username ||
                                      "â€”"}
                                  </strong>
                                </div>
                              </td>

                              <td>
                                {user.full_name ||
                                  "â€”"}
                              </td>

                              <td>
                                {user.email ||
                                  "â€”"}
                              </td>

                              <td>
                                <span
                                  className={`status-badge ${
                                    user.is_active !==
                                      false &&
                                    !expired
                                      ? "available"
                                      : "expired"
                                  }`}
                                >
                                  {user.is_active ===
                                  false
                                    ? "غير نشط"
                                    : expired
                                    ? "منتهي"
                                    : "نشط"}
                                </span>
                              </td>

                              <td>
                                {user.max_devices ||
                                  1}
                              </td>

                              <td>
                                {formatDate(
                                  user.activation_expires_at
                                )}
                              </td>

                              <td>
                                {formatDate(
                                  user.created_at
                                )}
                              </td>

                              <td>
                                <div
                                  style={{
                                    display:
                                      "flex",
                                    gap: "6px",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "flex-start",
                                    flexWrap:
                                      "wrap",
                                  }}
                                >
                                  <button
                                    className="mini-icon-button"
                                    onClick={() =>
                                      openEditUser(
                                        user
                                      )
                                    }
                                    title="تعديل المستخدم"
                                  >
                                    <Icon
                                      name="edit"
                                      size={15}
                                    />
                                  </button>

                                  <button
                                    className="mini-icon-button"
                                    onClick={() =>
                                      openEditUser(
                                        {
                                          ...user,
                                          is_active:
                                            user.is_active ===
                                            false,
                                        }
                                      )
                                    }
                                    title={
                                      user.is_active ===
                                      false
                                        ? "تفعيل المستخدم"
                                        : "تعطيل المستخدم"
                                    }
                                  >
                                    <Icon
                                      name="check"
                                      size={15}
                                    />
                                  </button>

                                  <button
                                    className="mini-icon-button"
                                    onClick={() =>
                                      openDeleteUser(
                                        user
                                      )
                                    }
                                    title="حذف المستخدم"
                                  >
                                    <Icon
                                      name="trash"
                                      size={15}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {page === "codes" && (
            <section className="panel full-panel">
              <div className="panel-header codes-header">
                <div>
                  <h3>
                    أكواد التفعيل
                  </h3>

                  <p>
                    إنشاء ومتابعة أكواد تفعيل
                    NATAN
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    setShowCreateModal(
                      true
                    )
                  }
                >
                  <Icon
                    name="plus"
                    size={18}
                  />

                  إنشاء أكواد
                </button>
              </div>

              <div className="toolbar">
                <div className="search-box">
                  <Icon
                    name="search"
                    size={18}
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="ابحث عن كود..."
                  />
                </div>

                <div className="toolbar-count">
                  عرض{" "}
                  {
                    filteredCodes.length
                  }{" "}
                  من{" "}
                  {
                    codes.length
                  }
                </div>
              </div>

              {filteredCodes.length ===
              0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Icon
                      name="key"
                      size={28}
                    />
                  </div>

                  <h4>
                    {codes.length ===
                    0
                      ? "لا توجد أكواد"
                      : "لا توجد نتائج"}
                  </h4>

                  <p>
                    {codes.length ===
                    0
                      ? "أنشئ أول كود تفعيل من الزر أعلاه."
                      : "جرّب البحث باستخدام كود مختلف."}
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          كود التفعيل
                        </th>

                        <th>
                          المدة
                        </th>

                        <th>
                          الحالة
                        </th>

                        <th>
                          المستخدم
                        </th>

                        <th>
                          تاريخ الانتهاء
                        </th>

                        <th>
                          تاريخ الإنشاء
                        </th>

                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCodes.map(
                        (code) => {
                          const expired =
                            !code.is_used &&
                            isExpired(
                              code.expires_at
                            );

                          return (
                            <tr
                              key={
                                code.id
                              }
                            >
                              <td>
                                <div className="code-cell">
                                  <span>
                                    {code.code}
                                  </span>

                                  <button
                                    className="mini-icon-button"
                                    onClick={() =>
                                      copyCode(
                                        code.code
                                      )
                                    }
                                    title="نسخ"
                                  >
                                    <Icon
                                      name={
                                        copied ===
                                        code.code
                                          ? "check"
                                          : "copy"
                                      }
                                      size={
                                        15
                                      }
                                    />
                                  </button>
                                </div>
                              </td>

                              <td>
                                {
                                  code.duration_days
                                }{" "}
                                يوم
                              </td>

                              <td>
                                <span
                                  className={`status-badge ${
                                    code.is_used
                                      ? "used"
                                      : expired
                                      ? "expired"
                                      : "available"
                                  }`}
                                >
                                  {code.is_used
                                    ? "مستخدم"
                                    : expired
                                    ? "منتهي"
                                    : "متاح"}
                                </span>
                              </td>

                              <td>
                                {code.used_by ||
                                  "â€”"}
                              </td>

                              <td>
                                {formatDate(
                                  code.expires_at
                                )}
                              </td>

                              <td>
                                {formatDate(
                                  code.created_at
                                )}
                              </td>

                              <td>
                                {!code.is_used &&
                                  !expired && (
                                    <button
                                      className="copy-button"
                                      onClick={() =>
                                        copyCode(
                                          code.code
                                        )
                                      }
                                    >
                                      <Icon
                                        name="copy"
                                        size={15}
                                      />

                                      نسخ
                                    </button>
                                  )}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {page === "server" && (
            <section className="server-page">
              <div
                className={`server-main-card ${
                  serverOnline
                    ? "server-online"
                    : "server-offline"
                }`}
              >
                <div className="server-visual">
                  <div className="server-pulse">
                    <Icon
                      name="server"
                      size={38}
                    />
                  </div>
                </div>

                <div className="server-main-info">
                  <span>
                    حالة NATAN SERVER
                  </span>

                  <h1>
                    {serverOnline
                      ? "السيرفر يعمل بشكل طبيعي"
                      : "السيرفر غير متصل"}
                  </h1>

                  <p>
                    {serverOnline
                      ? "الاتصال بقاعدة البيانات وواجهة API يعملان حاليًا عبر Supabase."
                      : "تعذر الوصول إلى واجهة API الخاصة بـ Supabase."}
                  </p>

                  <button
                    className="primary-button"
                    onClick={
                      checkServerStatus
                    }
                  >
                    <Icon
                      name="refresh"
                      size={17}
                    />

                    فحص الاتصال الآن
                  </button>
                </div>
              </div>

              <div className="server-info-grid">
                <div className="info-card">
                  <span>
                    API Status
                  </span>

                  <strong>
                    {serverOnline
                      ? "HTTP 200 / Online"
                      : "Offline"}
                  </strong>
                </div>

                <div className="info-card">
                  <span>
                    Database
                  </span>

                  <strong>
                    {serverOnline
                      ? "Connected"
                      : "Unknown"}
                  </strong>
                </div>

                <div className="info-card">
                  <span>
                    آخر فحص
                  </span>

                  <strong>
                    {serverTime
                      ? formatDateTime(
                          serverTime
                        )
                      : "â€”"}
                  </strong>
                </div>

                <div className="info-card">
                  <span>
                    المستخدمون
                  </span>

                  <strong>
                    {users.length}
                  </strong>
                </div>
              </div>
            </section>
          )}

          {page === "settings" && (
            <section className="settings-page">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>
                      المظهر
                    </h3>

                    <p>
                      تخصيص شكل لوحة الإدارة
                    </p>
                  </div>
                </div>

                <div className="setting-row">
                  <div className="setting-icon">
                    <Icon
                      name={
                        darkMode
                          ? "moon"
                          : "sun"
                      }
                      size={20}
                    />
                  </div>

                  <div className="setting-text">
                    <strong>
                      الوضع الداكن
                    </strong>

                    <span>
                      تغيير مظهر لوحة NATAN
                    </span>
                  </div>

                  <button
                    className={`toggle ${
                      darkMode
                        ? "on"
                        : ""
                    }`}
                    onClick={() =>
                      setDarkMode(
                        !darkMode
                      )
                    }
                  >
                    <span />
                  </button>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>
                      النظام
                    </h3>

                    <p>
                      معلومات الاتصال الحالية
                    </p>
                  </div>
                </div>

                <div className="system-list">
                  <div>
                    <span>
                      Application
                    </span>

                    <strong>
                      NATAN ADMIN
                    </strong>
                  </div>

                  <div>
                    <span>
                      API
                    </span>

                    <strong>
                      Supabase Edge Function
                    </strong>
                  </div>

                  <div>
                    <span>
                      Authentication
                    </span>

                    <strong>
                      JWT
                    </strong>
                  </div>

                  <div>
                    <span>
                      Database
                    </span>

                    <strong>
                      Supabase
                    </strong>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div
          className="modal-overlay"
          onMouseDown={() =>
            setShowCreateModal(
              false
            )
          }
        >
          <div
            className="modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div className="modal-title-icon">
                <Icon
                  name="key"
                  size={22}
                />
              </div>

              <div>
                <h3>
                  إنشاء أكواد تفعيل
                </h3>

                <p>
                  إنشاء أكواد جديدة
                  للمستخدمين
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowCreateModal(
                    false
                  )
                }
              >
                <Icon
                  name="close"
                  size={18}
                />
              </button>
            </div>

            <div className="modal-body">
              <label className="modal-field">
                مدة التفعيل

                <select
                  value={
                    durationDays
                  }
                  onChange={(e) =>
                    setDurationDays(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >
                  <option value={7}>
                    7 أيام
                  </option>

                  <option value={30}>
                    30 يوم
                  </option>

                  <option value={60}>
                    60 يوم
                  </option>

                  <option value={90}>
                    90 يوم
                  </option>

                  <option value={180}>
                    180 يوم
                  </option>

                  <option value={365}>
                    365 يوم
                  </option>
                </select>
              </label>

              <label className="modal-field">
                عدد الأكواد

                <input
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) =>
                    setCount(
                      Math.min(
                        100,
                        Math.max(
                          1,
                          Number(
                            e.target.value
                          ) || 1
                        )
                      )
                    )
                  }
                />
              </label>

              <div className="creation-preview">
                <div>
                  <span>
                    عدد الأكواد
                  </span>

                  <strong>
                    {count}
                  </strong>
                </div>

                <div>
                  <span>
                    مدة كل كود
                  </span>

                  <strong>
                    {durationDays}{" "}
                    يوم
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() =>
                  setShowCreateModal(
                    false
                  )
                }
              >
                إلغاء
              </button>

              <button
                className="primary-button"
                onClick={() => {
                  setShowCreateModal(
                    false
                  );

                  setShowConfirmModal(
                    true
                  );
                }}
              >
                متابعة

                <Icon
                  name="chevron"
                  size={17}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="modal-overlay"
          onMouseDown={() =>
            setShowConfirmModal(
              false
            )
          }
        >
          <div
            className="modal confirmation-modal"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <div className="confirmation-icon">
              <Icon
                name="shield"
                size={30}
              />
            </div>

            <h3>
              تأكيد إنشاء الأكواد
            </h3>

            <p>
              سيتم إنشاء{" "}
              <strong>
                {count} كود
              </strong>{" "}
              تفعيل، مدة كل منها{" "}
              <strong>
                {durationDays} يوم
              </strong>
              .
            </p>

            <div className="confirmation-box">
              <span>
                عدد الأكواد
              </span>

              <strong>
                {count}
              </strong>

              <span>
                مدة التفعيل
              </span>

              <strong>
                {durationDays} يوم
              </strong>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowConfirmModal(
                    false
                  );

                  setShowCreateModal(
                    true
                  );
                }}
              >
                رجوع
              </button>

              <button
                className="primary-button"
                onClick={
                  handleCreateCodes
                }
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Icon
                      name="check"
                      size={17}
                    />

                    تأكيد الإنشاء
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserModal &&
        selectedUser && (
          <div
            className="modal-overlay"
            onMouseDown={
              closeUserModal
            }
          >
            <div
              className="modal"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >
              <div className="modal-header">
                <div className="modal-title-icon">
                  <Icon
                    name="users"
                    size={22}
                  />
                </div>

                <div>
                  <h3>
                    تعديل المستخدم
                  </h3>

                  <p>
                    تعديل بيانات حساب{" "}
                    {selectedUser.username ||
                      ""}
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={
                    closeUserModal
                  }
                  disabled={
                    userSaving
                  }
                >
                  <Icon
                    name="close"
                    size={18}
                  />
                </button>
              </div>

              <div className="modal-body">
                <label className="modal-field">
                  اسم المستخدم

                  <input
                    value={
                      userForm.username
                    }
                    onChange={(e) =>
                      setUserForm(
                        (current) => ({
                          ...current,
                          username:
                            e.target.value,
                        })
                      )
                    }
                    autoComplete="off"
                  />
                </label>

                <label className="modal-field">
                  الاسم الكامل

                  <input
                    value={
                      userForm.fullName
                    }
                    onChange={(e) =>
                      setUserForm(
                        (current) => ({
                          ...current,
                          fullName:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="الاسم الكامل"
                  />
                </label>

                <label className="modal-field">
                  البريد الإلكتروني

                  <input
                    type="email"
                    value={
                      userForm.email
                    }
                    onChange={(e) =>
                      setUserForm(
                        (current) => ({
                          ...current,
                          email:
                            e.target.value,
                        })
                      )
                    }
                    placeholder="example@email.com"
                  />
                </label>

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <label className="modal-field">
                    الحد الأقصى للأجهزة

                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={
                        userForm.maxDevices
                      }
                      onChange={(e) =>
                        setUserForm(
                          (current) => ({
                            ...current,
                            maxDevices:
                              Math.min(
                                20,
                                Math.max(
                                  1,
                                  Number(
                                    e.target
                                      .value
                                  ) || 1
                                )
                              ),
                          })
                        )
                      }
                    />
                  </label>

                  <label className="modal-field">
                    تمديد التفعيل

                    <input
                      type="number"
                      min={0}
                      max={3650}
                      value={
                        userForm.extendDays
                      }
                      onChange={(e) =>
                        setUserForm(
                          (current) => ({
                            ...current,
                            extendDays:
                              Math.min(
                                3650,
                                Math.max(
                                  0,
                                  Number(
                                    e.target
                                      .value
                                  ) || 0
                                )
                              ),
                          })
                        )
                      }
                    />

                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "5px",
                        opacity:
                          0.65,
                      }}
                    >
                      اتركه 0 بدون تمديد
                    </small>
                  </label>
                </div>

                <label
                  className="modal-field"
                  style={{
                    display:
                      "flex",
                    flexDirection:
                      "row",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap: "12px",
                  }}
                >
                  <span>
                    حالة الحساب
                  </span>

                  <button
                    type="button"
                    className={`toggle ${
                      userForm.isActive
                        ? "on"
                        : ""
                    }`}
                    onClick={() =>
                      setUserForm(
                        (current) => ({
                          ...current,
                          isActive:
                            !current.isActive,
                        })
                      )
                    }
                  >
                    <span />
                  </button>
                </label>

                <label className="modal-field">
                  كلمة مرور جديدة

                  <input
                    type="password"
                    value={
                      userForm.password
                    }
                    onChange={(e) =>
                      setUserForm(
                        (current) => ({
                          ...current,
                          password:
                            e.target.value,
                        })
                      )
                    }
                    autoComplete="new-password"
                    placeholder="اتركها فارغة بدون تغيير"
                  />
                </label>

                <div
                  className="confirmation-box"
                  style={{
                    marginTop:
                      "8px",
                  }}
                >
                  <span>
                    انتهاء التفعيل الحالي
                  </span>

                  <strong>
                    {formatDate(
                      selectedUser.activation_expires_at
                    )}
                  </strong>

                  <span>
                    الأجهزة المسموحة
                  </span>

                  <strong>
                    {
                      userForm.maxDevices
                    }
                  </strong>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="secondary-button"
                  onClick={
                    closeUserModal
                  }
                  disabled={
                    userSaving
                  }
                >
                  إلغاء
                </button>

                <button
                  className="primary-button"
                  onClick={
                    handleSaveUser
                  }
                  disabled={
                    userSaving
                  }
                >
                  {userSaving ? (
                    <>
                      <span className="spinner" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Icon
                        name="check"
                        size={17}
                      />

                      حفظ التغييرات
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      {showDeleteUserModal &&
        selectedUser && (
          <div
            className="modal-overlay"
            onMouseDown={() => {
              if (!userDeleting) {
                setShowDeleteUserModal(
                  false
                );

                setSelectedUser(
                  null
                );
              }
            }}
          >
            <div
              className="modal confirmation-modal"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >
              <div
                className="confirmation-icon"
                style={{
                  color:
                    "var(--danger, #ef4444)",
                }}
              >
                <Icon
                  name="trash"
                  size={30}
                />
              </div>

              <h3>
                حذف المستخدم
              </h3>

              <p>
                هل تريد حذف المستخدم{" "}
                <strong>
                  {
                    selectedUser.username
                  }
                </strong>
                ؟
              </p>

              <div className="confirmation-box">
                <span>
                  المستخدم
                </span>

                <strong>
                  {
                    selectedUser.username ||
                    "â€”"
                  }
                </strong>

                <span>
                  البريد
                </span>

                <strong>
                  {
                    selectedUser.email ||
                    "â€”"
                  }
                </strong>
              </div>

              <p
                style={{
                  fontSize:
                    "13px",
                  opacity:
                    0.75,
                  marginTop:
                    "12px",
                }}
              >
                سيتم حذف الحساب وبيانات
                الأجهزة المرتبطة به حسب
                إعدادات السيرفر. تأكد من
                رغبتك قبل المتابعة.
              </p>

              <div className="modal-footer">
                <button
                  className="secondary-button"
                  onClick={() => {
                    setShowDeleteUserModal(
                      false
                    );

                    setSelectedUser(
                      null
                    );
                  }}
                  disabled={
                    userDeleting
                  }
                >
                  إلغاء
                </button>

                <button
                  className="primary-button"
                  onClick={
                    handleDeleteUser
                  }
                  disabled={
                    userDeleting
                  }
                  style={{
                    background:
                      "var(--danger, #ef4444)",
                  }}
                >
                  {userDeleting ? (
                    <>
                      <span className="spinner" />
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <Icon
                        name="trash"
                        size={17}
                      />

                      تأكيد الحذف
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      {toast && (
        <div
          className={`toast ${
            toast.type ===
            "success"
              ? "toast-success"
              : "toast-error"
          }`}
        >
          <div>
            <Icon
              name={
                toast.type ===
                "success"
                  ? "check"
                  : "activity"
              }
              size={18}
            />
          </div>

          <span>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;

