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
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.4 1.4-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-2v-.6a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-1.4-1.4.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5v-2h.6a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06 1.4-1.4.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1.82-.33l.06-.06 1.4 1.4-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21v2h-.6a1.65 1.65 0 0 0-1 1Z" />
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
          : "ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، طھط­ظ…ظٹظ„ ط§ظ„ط¨ظٹط§ظ†ط§طھ";

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

      setBiometricAvailable(
        result?.isAvailable === true
      );
    } catch {
      setBiometricAvailable(false);
    }
  }

  async function handleBiometricLogin() {
    const token =
      localStorage.getItem("natan_admin_token");

    const savedUsername =
      localStorage.getItem(
        "natan_biometric_username"
      );

    if (!token || !savedUsername) {
      setError(
        "يجب تسجيل الدخول بكلمة المرور مرة واحدة أولاً."
      );
      return;
    }

    setBiometricLoading(true);
    setError("");

    try {
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
      });

      setUsername(savedUsername);

      setLoggedIn(true);

      showToast(
        "success",
        "تم تسجيل الدخول بالبصمة"
      );
    } catch (err) {
      console.log(
        "Biometric authentication:",
        err
      );

      setError(
        "لم يتم التحقق من البصمة."
      );
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
      await adminLogin(username, password);

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
        "طھظ… طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„ ط¨ظ†ط¬ط§ط­"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ط¨ظٹط§ظ†ط§طھ ط§ظ„ط¯ط®ظˆظ„ ط؛ظٹط± طµط­ظٹط­ط©"
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
    setToast({ type, message });

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
        "طھظ… ظ†ط³ط® ظƒظˆط¯ ط§ظ„طھظپط¹ظٹظ„"
      );

      window.setTimeout(() => {
        setCopied("");
      }, 1800);
    } catch {
      showToast(
        "error",
        "طھط¹ط°ط± ظ†ط³ط® ط§ظ„ظƒظˆط¯"
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
        `طھظ… ط¥ظ†ط´ط§ط، ${newCodes.length} ظƒظˆط¯ طھظپط¹ظٹظ„ ط¨ظ†ط¬ط§ط­`
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "طھط¹ط°ط± ط¥ظ†ط´ط§ط، ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„";

      setError(message);
      showToast("error", message);
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
          Number(user.max_devices || 1)
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
        "ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ… ظ…ط·ظ„ظˆط¨"
      );
      return;
    }

    if (
      userForm.maxDevices < 1 ||
      userForm.maxDevices > 20
    ) {
      showToast(
        "error",
        "ط¹ط¯ط¯ ط§ظ„ط£ط¬ظ‡ط²ط© ظٹط¬ط¨ ط£ظ† ظٹظƒظˆظ† ط¨ظٹظ† 1 ظˆ20"
      );
      return;
    }

    if (
      userForm.extendDays < 0 ||
      userForm.extendDays > 3650
    ) {
      showToast(
        "error",
        "ظ…ط¯ط© ط§ظ„طھظ…ط¯ظٹط¯ ظٹط¬ط¨ ط£ظ† طھظƒظˆظ† ط¨ظٹظ† 0 ظˆ3650 ظٹظˆظ…ظ‹ط§"
      );
      return;
    }

    if (
      userForm.password &&
      userForm.password.length < 6
    ) {
      showToast(
        "error",
        "ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط± ظٹط¬ط¨ ط£ظ† طھظƒظˆظ† 6 ط£ط­ط±ظپ ط¹ظ„ظ‰ ط§ظ„ط£ظ‚ظ„"
      );
      return;
    }

    setUserSaving(true);

    try {
      const body = {
        username: cleanUsername,
        email:
          userForm.email.trim() || null,
        fullName:
          userForm.fullName.trim() || null,
        isActive: userForm.isActive,
        maxDevices: userForm.maxDevices,
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

      const result = await updateUser(
        selectedUser.id,
        body
      );

      const updatedUser =
        result?.user ||
        result?.data;

      if (updatedUser?.id) {
        setUsers((current) =>
          current.map((item) =>
            item.id === updatedUser.id
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
        "طھظ… طھط­ط¯ظٹط« ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ… ط¨ظ†ط¬ط§ط­"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "طھط¹ط°ط± طھط­ط¯ظٹط« ط§ظ„ظ…ط³طھط®ط¯ظ…";

      showToast("error", message);
    } finally {
      setUserSaving(false);
    }
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;

    setUserDeleting(true);

    try {
      await deleteUser(selectedUser.id);

      setUsers((current) =>
        current.filter(
          (user) =>
            user.id !== selectedUser.id
        )
      );

      setShowDeleteUserModal(false);
      setSelectedUser(null);

      showToast(
        "success",
        "طھظ… ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ… ط¨ظ†ط¬ط§ط­"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "طھط¹ط°ط± ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…";

      showToast("error", message);
    } finally {
      setUserDeleting(false);
    }
  }

  const availableCodes = codes.filter(
    (code) =>
      !code.is_used &&
      !isExpired(code.expires_at)
  ).length;

  const usedCodes = codes.filter(
    (code) => code.is_used
  ).length;

  const expiredCodes = codes.filter(
    (code) =>
      !code.is_used &&
      isExpired(code.expires_at)
  ).length;

  const activeUsers = users.filter(
    (user) =>
      user.is_active !== false &&
      !isExpired(
        user.activation_expires_at
      )
  ).length;

  const filteredCodes = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) return codes;

    return codes.filter((code) =>
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

  const recentCodes = codes.slice(0, 5);

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
              <strong>NATAN</strong>
              <span>
                ADMIN CONTROL
              </span>
            </div>
          </div>

          <div className="login-heading">
            <h1>
              ظ…ط±ط­ط¨ظ‹ط§ ط¨ط¹ظˆط¯طھظƒ
            </h1>

            <p>
              ط³ط¬ظ‘ظ„ ط§ظ„ط¯ط®ظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© طھط­ظƒظ…
              NATAN ظ„ط¥ط¯ط§ط±ط© ط§ظ„ظ†ط¸ط§ظ….
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="login-form"
          >
            <label>
              ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…

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
              ظƒظ„ظ…ط© ط§ظ„ظ…ط±ظˆط±

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
                  ط¬ط§ط±ظٹ طھط³ط¬ظٹظ„ ط§ظ„ط¯ط®ظˆظ„...
                </>
              ) : (
                <>
                  ط¯ط®ظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…
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
                  onClick={handleBiometricLogin}
                  disabled={biometricLoading}
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
            ظ†ط¸ط§ظ… ط§ظ„ط¥ط¯ط§ط±ط© ط§ظ„ط¢ظ…ظ†
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      id: "dashboard",
      label: "ط§ظ„ط±ط¦ظٹط³ظٹط©",
      icon: "grid" as IconName,
    },
    {
      id: "users",
      label: "ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ†",
      icon: "users" as IconName,
      badge: users.length,
    },
    {
      id: "codes",
      label: "ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„",
      icon: "key" as IconName,
      badge: availableCodes,
    },
    {
      id: "server",
      label: "ط­ط§ظ„ط© ط§ظ„ط³ظٹط±ظپط±",
      icon: "server" as IconName,
    },
    {
      id: "settings",
      label: "ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ",
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
              <strong>NATAN</strong>
              <span>ADMIN</span>
            </div>
          )}
        </div>

        <div className="sidebar-section-title">
          {sidebarOpen
            ? "ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…"
            : ""}
        </div>

        <nav>
          {navigation.map((item) => (
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
          ))}
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
                    ? "ط§ظ„ط³ظٹط±ظپط± ظ…طھطµظ„"
                    : "ط§ظ„ط³ظٹط±ظپط± ط؛ظٹط± ظ…طھطµظ„"}
                </strong>

                <span>
                  {serverOnline
                    ? "Supabase"
                    : "طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„ط§طھطµط§ظ„"}
                </span>
              </div>
            )}
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title={
              !sidebarOpen
                ? "طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬"
                : undefined
            }
          >
            <Icon
              name="logout"
              size={19}
            />

            {sidebarOpen && (
              <span>
                طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬
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
              title="ط§ظ„ظ‚ط§ط¦ظ…ط©"
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
                  "ظ†ط¸ط±ط© ط¹ط§ظ…ط©"}

                {page === "users" &&
                  "ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†"}

                {page === "codes" &&
                  "ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„"}

                {page === "server" &&
                  "ط­ط§ظ„ط© ط§ظ„ظ†ط¸ط§ظ…"}

                {page === "settings" &&
                  "ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط¥ط¯ط§ط±ط©"}
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
                  ? "ظ…طھطµظ„ ط§ظ„ط¢ظ†"
                  : "ط؛ظٹط± ظ…طھطµظ„"}
              </span>
            </div>

            <button
              className="icon-button"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              title="طھط؛ظٹظٹط± ط§ظ„ظ…ط¸ظ‡ط±"
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
              onClick={loadData}
              title="طھط­ط¯ظٹط« ط§ظ„ط¨ظٹط§ظ†ط§طھ"
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
                  ظ…ط¯ظٹط± ط§ظ„ظ†ط¸ط§ظ…
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          {error && (
            <div className="global-error">
              <span>{error}</span>

              <button
                onClick={() =>
                  setError("")
                }
              >
                أ—
              </button>
            </div>
          )}

          {page === "dashboard" && (
            <>
              <section className="hero-section">
                <div>
                  <span className="eyebrow">
                    NATAN CONTROL CENTER
                  </span>

                  <h1>
                    ط¥ط¯ط§ط±ط© ط§ظ„ظ†ط¸ط§ظ…
                    <br />
                    <span>
                      ط¨ط´ظƒظ„ ط£ظƒط«ط± ط°ظƒط§ط،ظ‹.
                    </span>
                  </h1>

                  <p>
                    ظ…ط±ظƒط² طھط­ظƒظ… ظ…ظˆط­ط¯ ظ„ظ…طھط§ط¨ط¹ط©
                    ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†طŒ ط§ظ„طھظپط¹ظٹظ„طŒ
                    ظˆط­ط§ظ„ط© ط®ط¯ظ…ط© NATAN.
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
                      ط­ط§ظ„ط© ط§ظ„ط®ط§ط¯ظ…
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
                      ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†
                    </span>

                    <strong>
                      {users.length}
                    </strong>

                    <small>
                      <b>
                        {activeUsers}
                      </b>{" "}
                      ظ…ط³طھط®ط¯ظ… ظ†ط´ط·
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
                      ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„
                    </span>

                    <strong>
                      {codes.length}
                    </strong>

                    <small>
                      <b>
                        {availableCodes}
                      </b>{" "}
                      ظ…طھط§ط­ ظ„ظ„ط§ط³طھط®ط¯ط§ظ…
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
                      ط£ظƒظˆط§ط¯ ظ…ط³طھط®ط¯ظ…ط©
                    </span>

                    <strong>
                      {usedCodes}
                    </strong>

                    <small>
                      ظ…ظ† ط¥ط¬ظ…ط§ظ„ظٹ ط§ظ„ط£ظƒظˆط§ط¯
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
                      ط£ظƒظˆط§ط¯ ظ…ظ†طھظ‡ظٹط©
                    </span>

                    <strong>
                      {expiredCodes}
                    </strong>

                    <small>
                      طھط­طھط§ط¬ ط¥ظ„ظ‰ ط£ظƒظˆط§ط¯ ط¬ط¯ظٹط¯ط©
                    </small>
                  </div>
                </div>
              </section>

              <section className="dashboard-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>
                        طھظˆط²ظٹط¹ ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„
                      </h3>

                      <p>
                        ط§ظ„ط­ط§ظ„ط© ط§ظ„ط­ط§ظ„ظٹط© ظ„ط¬ظ…ظٹط¹
                        ط§ظ„ط£ظƒظˆط§ط¯
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
                          ظƒظˆط¯
                        </span>
                      </div>
                    </div>

                    <div className="chart-legend">
                      <div>
                        <span className="legend-dot green" />
                        <label>
                          ظ…طھط§ط­ط©
                        </label>
                        <strong>
                          {availableCodes}
                        </strong>
                      </div>

                      <div>
                        <span className="legend-dot blue" />
                        <label>
                          ظ…ط³طھط®ط¯ظ…ط©
                        </label>
                        <strong>
                          {usedCodes}
                        </strong>
                      </div>

                      <div>
                        <span className="legend-dot orange" />
                        <label>
                          ظ…ظ†طھظ‡ظٹط©
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
                        ط¢ط®ط± ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„
                      </h3>

                      <p>
                        ط£ط­ط¯ط« ط§ظ„ط£ظƒظˆط§ط¯ ط§ظ„طھظٹ طھظ…
                        ط¥ظ†ط´ط§ط¤ظ‡ط§
                      </p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() =>
                        setPage("codes")
                      }
                    >
                      ط¹ط±ط¶ ط§ظ„ظƒظ„
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
                        ظ„ط§ طھظˆط¬ط¯ ط£ظƒظˆط§ط¯ ط­طھظ‰ ط§ظ„ط¢ظ†
                      </div>
                    ) : (
                      recentCodes.map(
                        (code) => (
                          <div
                            className="recent-item"
                            key={code.id}
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
                                ظٹظˆظ…
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
                                ? "ظ…ط³طھط®ط¯ظ…"
                                : isExpired(
                                    code.expires_at
                                  )
                                ? "ظ…ظ†طھظ‡ظٹ"
                                : "ظ…طھط§ط­"}
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
                    setPage("codes");
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
                      ط¥ظ†ط´ط§ط، ظƒظˆط¯ طھظپط¹ظٹظ„
                    </strong>

                    <small>
                      ط¥طµط¯ط§ط± ظƒظˆط¯ ط¬ط¯ظٹط¯ ظ„ظ„ظ…ط³طھط®ط¯ظ…
                    </small>
                  </span>
                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    setPage("users")
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
                      ط¥ط¯ط§ط±ط© ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†
                    </strong>

                    <small>
                      ظ…طھط§ط¨ط¹ط© ط§ظ„ط­ط³ط§ط¨ط§طھ ظˆط­ط§ظ„طھظ‡ط§
                    </small>
                  </span>
                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    setPage("server")
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
                      ظپط­طµ ط§ظ„ط³ظٹط±ظپط±
                    </strong>

                    <small>
                      ط¢ط®ط± ط­ط§ظ„ط© ظ„ط§طھطµط§ظ„ ط§ظ„ظ†ط¸ط§ظ…
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
                    ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ†
                  </h3>

                  <p>
                    ط¬ظ…ظٹط¹ ط­ط³ط§ط¨ط§طھ ظ…ط³طھط®ط¯ظ…ظٹ NATAN
                    ط§ظ„ظ…ط³ط¬ظ„ط©
                  </p>
                </div>

                <button
                  className="icon-text-button"
                  onClick={loadData}
                  disabled={loading}
                >
                  <Icon
                    name="refresh"
                    size={17}
                  />

                  {loading
                    ? "ط¬ط§ط±ظٹ ط§ظ„طھط­ط¯ظٹط«..."
                    : "طھط­ط¯ظٹط«"}
                </button>
              </div>

              {users.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Icon
                      name="users"
                      size={28}
                    />
                  </div>

                  <h4>
                    ظ„ط§ ظٹظˆط¬ط¯ ظ…ط³طھط®ط¯ظ…ظˆظ† ط­طھظ‰ ط§ظ„ط¢ظ†
                  </h4>

                  <p>
                    ط¹ظ†ط¯ظ…ط§ ظٹظ‚ظˆظ… ط£ظˆظ„ ظ…ط³طھط®ط¯ظ…
                    ط¨ط§ظ„طھط³ط¬ظٹظ„ ط³ظٹط¸ظ‡ط± ط­ط³ط§ط¨ظ‡ ظ‡ظ†ط§.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          ط§ظ„ظ…ط³طھط®ط¯ظ…
                        </th>

                        <th>
                          ط§ظ„ط§ط³ظ… ط§ظ„ظƒط§ظ…ظ„
                        </th>

                        <th>
                          ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ
                        </th>

                        <th>
                          ط§ظ„ط­ط§ظ„ط©
                        </th>

                        <th>
                          ط§ظ„ط£ط¬ظ‡ط²ط©
                        </th>

                        <th>
                          ط§ظ†طھظ‡ط§ط، ط§ظ„طھظپط¹ظٹظ„
                        </th>

                        <th>
                          ط§ظ„طھط³ط¬ظٹظ„
                        </th>

                        <th>
                          ط§ظ„ط¥ط¯ط§ط±ط©
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
                                    ? "ط؛ظٹط± ظ†ط´ط·"
                                    : expired
                                    ? "ظ…ظ†طھظ‡ظٹ"
                                    : "ظ†ط´ط·"}
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
                                    title="طھط¹ط¯ظٹظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…"
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
                                        ? "طھظپط¹ظٹظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…"
                                        : "طھط¹ط·ظٹظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…"
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
                                    title="ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…"
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
                    ط£ظƒظˆط§ط¯ ط§ظ„طھظپط¹ظٹظ„
                  </h3>

                  <p>
                    ط¥ظ†ط´ط§ط، ظˆظ…طھط§ط¨ط¹ط© ط£ظƒظˆط§ط¯ طھظپط¹ظٹظ„
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

                  ط¥ظ†ط´ط§ط، ط£ظƒظˆط§ط¯
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
                    placeholder="ط§ط¨ط­ط« ط¹ظ† ظƒظˆط¯..."
                  />
                </div>

                <div className="toolbar-count">
                  ط¹ط±ط¶{" "}
                  {filteredCodes.length} ظ…ظ†{" "}
                  {codes.length}
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
                    {codes.length === 0
                      ? "ظ„ط§ طھظˆط¬ط¯ ط£ظƒظˆط§ط¯"
                      : "ظ„ط§ طھظˆط¬ط¯ ظ†طھط§ط¦ط¬"}
                  </h4>

                  <p>
                    {codes.length === 0
                      ? "ط£ظ†ط´ط¦ ط£ظˆظ„ ظƒظˆط¯ طھظپط¹ظٹظ„ ظ…ظ† ط§ظ„ط²ط± ط£ط¹ظ„ط§ظ‡."
                      : "ط¬ط±ظ‘ط¨ ط§ظ„ط¨ط­ط« ط¨ط§ط³طھط®ط¯ط§ظ… ظƒظˆط¯ ظ…ط®طھظ„ظپ."}
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          ظƒظˆط¯ ط§ظ„طھظپط¹ظٹظ„
                        </th>

                        <th>
                          ط§ظ„ظ…ط¯ط©
                        </th>

                        <th>
                          ط§ظ„ط­ط§ظ„ط©
                        </th>

                        <th>
                          ط§ظ„ظ…ط³طھط®ط¯ظ…
                        </th>

                        <th>
                          طھط§ط±ظٹط® ط§ظ„ط§ظ†طھظ‡ط§ط،
                        </th>

                        <th>
                          طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط´ط§ط،
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
                                    title="ظ†ط³ط®"
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
                                ظٹظˆظ…
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
                                    ? "ظ…ط³طھط®ط¯ظ…"
                                    : expired
                                    ? "ظ…ظ†طھظ‡ظٹ"
                                    : "ظ…طھط§ط­"}
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

                                      ظ†ط³ط®
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
                    ط­ط§ظ„ط© NATAN SERVER
                  </span>

                  <h1>
                    {serverOnline
                      ? "ط§ظ„ط³ظٹط±ظپط± ظٹط¹ظ…ظ„ ط¨ط´ظƒظ„ ط·ط¨ظٹط¹ظٹ"
                      : "ط§ظ„ط³ظٹط±ظپط± ط؛ظٹط± ظ…طھطµظ„"}
                  </h1>

                  <p>
                    {serverOnline
                      ? "ط§ظ„ط§طھطµط§ظ„ ط¨ظ‚ط§ط¹ط¯ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظˆظˆط§ط¬ظ‡ط© API ظٹط¹ظ…ظ„ط§ظ† ط­ط§ظ„ظٹظ‹ط§ ط¹ط¨ط± Supabase."
                      : "طھط¹ط°ط± ط§ظ„ظˆطµظˆظ„ ط¥ظ„ظ‰ ظˆط§ط¬ظ‡ط© API ط§ظ„ط®ط§طµط© ط¨ظ€ Supabase."}
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

                    ظپط­طµ ط§ظ„ط§طھطµط§ظ„ ط§ظ„ط¢ظ†
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
                    ط¢ط®ط± ظپط­طµ
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
                    ط§ظ„ظ…ط³طھط®ط¯ظ…ظˆظ†
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
                      ط§ظ„ظ…ط¸ظ‡ط±
                    </h3>

                    <p>
                      طھط®طµظٹطµ ط´ظƒظ„ ظ„ظˆط­ط© ط§ظ„ط¥ط¯ط§ط±ط©
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
                      ط§ظ„ظˆط¶ط¹ ط§ظ„ط¯ط§ظƒظ†
                    </strong>

                    <span>
                      طھط؛ظٹظٹط± ظ…ط¸ظ‡ط± ظ„ظˆط­ط© NATAN
                    </span>
                  </div>

                  <button
                    className={`toggle ${
                      darkMode ? "on" : ""
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
                      ط§ظ„ظ†ط¸ط§ظ…
                    </h3>

                    <p>
                      ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„ط§طھطµط§ظ„ ط§ظ„ط­ط§ظ„ظٹط©
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
            setShowCreateModal(false)
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
                  ط¥ظ†ط´ط§ط، ط£ظƒظˆط§ط¯ طھظپط¹ظٹظ„
                </h3>

                <p>
                  ط¥ظ†ط´ط§ط، ط£ظƒظˆط§ط¯ ط¬ط¯ظٹط¯ط©
                  ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†
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
                ظ…ط¯ط© ط§ظ„طھظپط¹ظٹظ„

                <select
                  value={durationDays}
                  onChange={(e) =>
                    setDurationDays(
                      Number(
                        e.target.value
                      )
                    )
                  }
                >
                  <option value={7}>
                    7 ط£ظٹط§ظ…
                  </option>

                  <option value={30}>
                    30 ظٹظˆظ…
                  </option>

                  <option value={60}>
                    60 ظٹظˆظ…
                  </option>

                  <option value={90}>
                    90 ظٹظˆظ…
                  </option>

                  <option value={180}>
                    180 ظٹظˆظ…
                  </option>

                  <option value={365}>
                    365 ظٹظˆظ…
                  </option>
                </select>
              </label>

              <label className="modal-field">
                ط¹ط¯ط¯ ط§ظ„ط£ظƒظˆط§ط¯

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
                    ط¹ط¯ط¯ ط§ظ„ط£ظƒظˆط§ط¯
                  </span>

                  <strong>
                    {count}
                  </strong>
                </div>

                <div>
                  <span>
                    ظ…ط¯ط© ظƒظ„ ظƒظˆط¯
                  </span>

                  <strong>
                    {durationDays} ظٹظˆظ…
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
                ط¥ظ„ط؛ط§ط،
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
                ظ…طھط§ط¨ط¹ط©

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
              طھط£ظƒظٹط¯ ط¥ظ†ط´ط§ط، ط§ظ„ط£ظƒظˆط§ط¯
            </h3>

            <p>
              ط³ظٹطھظ… ط¥ظ†ط´ط§ط،{" "}
              <strong>
                {count} ظƒظˆط¯
              </strong>{" "}
              طھظپط¹ظٹظ„طŒ ظ…ط¯ط© ظƒظ„ ظ…ظ†ظ‡ط§{" "}
              <strong>
                {durationDays} ظٹظˆظ…
              </strong>
              .
            </p>

            <div className="confirmation-box">
              <span>
                ط¹ط¯ط¯ ط§ظ„ط£ظƒظˆط§ط¯
              </span>

              <strong>
                {count}
              </strong>

              <span>
                ظ…ط¯ط© ط§ظ„طھظپط¹ظٹظ„
              </span>

              <strong>
                {durationDays} ظٹظˆظ…
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
                ط±ط¬ظˆط¹
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
                    ط¬ط§ط±ظٹ ط§ظ„ط¥ظ†ط´ط§ط،...
                  </>
                ) : (
                  <>
                    <Icon
                      name="check"
                      size={17}
                    />

                    طھط£ظƒظٹط¯ ط§ظ„ط¥ظ†ط´ط§ط،
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
                    طھط¹ط¯ظٹظ„ ط§ظ„ظ…ط³طھط®ط¯ظ…
                  </h3>

                  <p>
                    طھط¹ط¯ظٹظ„ ط¨ظٹط§ظ†ط§طھ ط­ط³ط§ط¨{" "}
                    {selectedUser.username ||
                      ""}
                  </p>
                </div>

                <button
                  className="modal-close"
                  onClick={
                    closeUserModal
                  }
                  disabled={userSaving}
                >
                  <Icon
                    name="close"
                    size={18}
                  />
                </button>
              </div>

              <div className="modal-body">
                <label className="modal-field">
                  ط§ط³ظ… ط§ظ„ظ…ط³طھط®ط¯ظ…

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
                  ط§ظ„ط§ط³ظ… ط§ظ„ظƒط§ظ…ظ„

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
                    placeholder="ط§ظ„ط§ط³ظ… ط§ظ„ظƒط§ظ…ظ„"
                  />
                </label>

                <label className="modal-field">
                  ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ

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
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <label className="modal-field">
                    ط§ظ„ط­ط¯ ط§ظ„ط£ظ‚طµظ‰ ظ„ظ„ط£ط¬ظ‡ط²ط©

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
                    طھظ…ط¯ظٹط¯ ط§ظ„طھظپط¹ظٹظ„

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
                      ط§طھط±ظƒظ‡ 0 ط¨ط¯ظˆظ† طھظ…ط¯ظٹط¯
                    </small>
                  </label>
                </div>

                <label
                  className="modal-field"
                  style={{
                    display: "flex",
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
                    ط­ط§ظ„ط© ط§ظ„ط­ط³ط§ط¨
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
                  ظƒظ„ظ…ط© ظ…ط±ظˆط± ط¬ط¯ظٹط¯ط©

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
                    placeholder="ط§طھط±ظƒظ‡ط§ ظپط§ط±ط؛ط© ط¨ط¯ظˆظ† طھط؛ظٹظٹط±"
                  />
                </label>

                <div
                  className="confirmation-box"
                  style={{
                    marginTop: "8px",
                  }}
                >
                  <span>
                    ط§ظ†طھظ‡ط§ط، ط§ظ„طھظپط¹ظٹظ„ ط§ظ„ط­ط§ظ„ظٹ
                  </span>

                  <strong>
                    {formatDate(
                      selectedUser.activation_expires_at
                    )}
                  </strong>

                  <span>
                    ط§ظ„ط£ط¬ظ‡ط²ط© ط§ظ„ظ…ط³ظ…ظˆط­ط©
                  </span>

                  <strong>
                    {userForm.maxDevices}
                  </strong>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="secondary-button"
                  onClick={
                    closeUserModal
                  }
                  disabled={userSaving}
                >
                  ط¥ظ„ط؛ط§ط،
                </button>

                <button
                  className="primary-button"
                  onClick={
                    handleSaveUser
                  }
                  disabled={userSaving}
                >
                  {userSaving ? (
                    <>
                      <span className="spinner" />
                      ط¬ط§ط±ظٹ ط§ظ„ط­ظپط¸...
                    </>
                  ) : (
                    <>
                      <Icon
                        name="check"
                        size={17}
                      />
                      ط­ظپط¸ ط§ظ„طھط؛ظٹظٹط±ط§طھ
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
                ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…
              </h3>

              <p>
                ظ‡ظ„ طھط±ظٹط¯ ط­ط°ظپ ط§ظ„ظ…ط³طھط®ط¯ظ…{" "}
                <strong>
                  {selectedUser.username}
                </strong>
                طں
              </p>

              <div className="confirmation-box">
                <span>
                  ط§ظ„ظ…ط³طھط®ط¯ظ…
                </span>

                <strong>
                  {selectedUser.username ||
                    "â€”"}
                </strong>

                <span>
                  ط§ظ„ط¨ط±ظٹط¯
                </span>

                <strong>
                  {selectedUser.email ||
                    "â€”"}
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
                ط³ظٹطھظ… ط­ط°ظپ ط§ظ„ط­ط³ط§ط¨ ظˆط¨ظٹط§ظ†ط§طھ
                ط§ظ„ط£ط¬ظ‡ط²ط© ط§ظ„ظ…ط±طھط¨ط·ط© ط¨ظ‡ ط­ط³ط¨
                ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط³ظٹط±ظپط±. طھط£ظƒط¯ ظ…ظ†
                ط±ط؛ط¨طھظƒ ظ‚ط¨ظ„ ط§ظ„ظ…طھط§ط¨ط¹ط©.
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
                  ط¥ظ„ط؛ط§ط،
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
                      ط¬ط§ط±ظٹ ط§ظ„ط­ط°ظپ...
                    </>
                  ) : (
                    <>
                      <Icon
                        name="trash"
                        size={17}
                      />
                      طھط£ظƒظٹط¯ ط§ظ„ط­ط°ظپ
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
            toast.type === "success"
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






