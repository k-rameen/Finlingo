import React, { useMemo, useState } from "react";
import { login, signupChild } from "../api/auth";
import { useNavigate } from "react-router-dom";

/*
  - login/signup tabs
  - conditional fields
  - now connected to backend (flask)
*/

export default function AuthPage() {
  const navigate = useNavigate();

  const [view, setView] = useState("login"); // "login" | "signup"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const fields = useMemo(() => {
    // login: always username + password
    if (view === "login") {
      return ["username", "password"];
    }

    // signup: child only
    return ["name", "username", "password"];
  }, [view]);

  const canSubmit = useMemo(() => {
    for (const key of fields) {
      if (!String(form[key] ?? "").trim()) return false;
    }
    if (fields.includes("password") && String(form.password).length < 6) return false;
    return true;
  }, [fields, form]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError("");

    try {
      // login
      if (view === "login") {
        const res = await login(form.username.trim(), form.password);

        if (!res?.ok) {
          setError(res?.error || "Login failed");
          return;
        }

        // store auth
        if (res.token) localStorage.setItem("token", res.token);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

        // route by role
        navigate("/home");

        return;
      }

      // signup - child only
      const res = await signupChild({
        name: form.name.trim(),
        username: form.username.trim(),
        password: form.password,
      });

      if (!res?.ok) {
        setError(res?.error || "Signup failed");
        return;
      }

      // show child id so parent can use it
      const childId = res?.user?.childId;
      alert(
        `Child account created \n\nChild ID: ${childId}\n\nSave this ID.`
      );

      // switch to login, keep username/password for convenience
      setView("login");
      setForm((prev) => ({
        name: "",
        username: prev.username,
        password: prev.password,
      }));

    } catch (err) {
      setError("Network error. Is the backend running on http://127.0.0.1:5050?");
    } finally {
      setLoading(false);
    }
  }

  function switchView(nextView) {
    setView(nextView);
    setError("");

    // optional: keep username/password when switching views
    setForm((prev) => ({
      name: nextView === "login" ? "" : prev.name,
      username: prev.username,
      password: prev.password,
    }));
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo} />
            <div>
              <div style={styles.title}>Finlingo 🧸</div>
            </div>
          </div>
        </div>

        <div style={styles.tabs}>
          <TabButton active={view === "login"} onClick={() => switchView("login")}>
            Log in 🔐
          </TabButton>
          <TabButton active={view === "signup"} onClick={() => switchView("signup")}>
            Create account ✨
          </TabButton>
        </div>

        <div style={styles.modeLine}>
          <span style={styles.modePill}>Child account</span>
          <span style={styles.modeHint}>
            {view === "login"
              ? "Log in with your username + password."
              : "Create a child account."}
          </span>
        </div>

        {error ? <div style={styles.errorBox}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.includes("name") && (
            <Field
              label="Name"
              placeholder="e.g., Ava"
              value={form.name}
              onChange={(v) => updateField("name", v)}
            />
          )}

          {fields.includes("username") && (
            <Field
              label="👤 Username"
              placeholder="e.g., ava123"
              value={form.username}
              onChange={(v) => updateField("username", v)}
              autoComplete="username"
            />
          )}

          {fields.includes("password") && (
            <Field
              label="🗝️ Password"
              placeholder="min 6 characters"
              value={form.password}
              onChange={(v) => updateField("password", v)}
              type="password"
              autoComplete={view === "login" ? "current-password" : "new-password"}
            />
          )}

          <button
            type="submit"
            style={{
              ...styles.primaryBtn,
              opacity: canSubmit && !loading ? 1 : 0.55,
              cursor: canSubmit && !loading ? "pointer" : "not-allowed",
            }}
            disabled={!canSubmit || loading}
          >
            {loading ? "Please wait..." : view === "login" ? "Let's Go! 🎮" : "Create account"}
          </button>

          <div style={styles.footerRow}>
            <button
              type="button"
              onClick={() => {
                setError("");
                setForm({ name: "", username: "", password: "" });
              }}
              style={styles.ghostBtn}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.tabBtn,
        ...(active ? styles.tabActive : {}),
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, placeholder, value, onChange, type = "text", helper, autoComplete }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
      />
      {helper ? <div style={styles.helper}>{helper}</div> : null}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background:
      "linear-gradient(135deg, #FFD1DC 0%, #A8D8EA 50%, #C9E4CA 100%)",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  card: {
    width: "min(520px, 100%)",
    borderRadius: 20,
    padding: 22,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 14,
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #eaaebc 0%, #86bdd1 50%, #a2dda4)",
  },
  title: { fontSize: 18, fontWeight: 800, letterSpacing: 0.2 },

  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 10,
  },
  tabBtn: {
    borderRadius: 14,
    padding: "10px 12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#e8eefc",
    fontWeight: 700,
    cursor: "pointer",
  },
  tabActive: {
    background: "rgba(255, 184, 202, 0.22)",
    border: "1px solid rgba(255, 118, 164, 0.45)",
  },

  modeLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    marginBottom: 10,
  },
  modePill: {
    fontSize: 12,
    fontWeight: 800,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.14)",
    border: "1px solid rgba(34,197,94,0.35)",
  },
  modeHint: { fontSize: 12, opacity: 0.8 },

  errorBox: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    color: "#9c5353",
    fontSize: 12,
    fontWeight: 700,
  },

  form: { marginTop: 12 },
  field: { marginBottom: 12 },
  label: { display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 },
  input: {
    width: "95%",
    padding: "11px 12px",
    borderRadius: 14,
    border: "2px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#000000",
    outline: "none",
  },
  helper: { fontSize: 11, opacity: 0.72, marginTop: 6 },

  primaryBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(0, 0, 0, 0.18)",
    color: "#ffffff",
    fontWeight: 900,
    background: "#78bfd8",
    marginTop: 8,
  },
  footerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  ghostBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "transparent",
    color: "#e8eefc",
    fontWeight: 800,
    cursor: "pointer",
    minWidth: 90,
  },
};
