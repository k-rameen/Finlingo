import React, { useMemo, useState } from "react";
import { login, signupChild, signupParent } from "../api/auth";
import { useNavigate } from "react-router-dom";

/*
  - parent/child toggle
  - login/signup tabs
  - conditional fields
  - now connected to backend (flask)
*/

export default function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("child"); // "child" | "parent"
  const [view, setView] = useState("login"); // "login" | "signup"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // shared
    name: "",
    username: "",
    password: "",
    // parent-only
    childId: "",
  });

  const fields = useMemo(() => {
    // login: always username + password
    if (view === "login") {
      return ["username", "password"];
    }

    // signup: depends on mode
    if (mode === "child") {
      return ["name", "username", "password"];
    }

    // parent signup
    return ["name", "username", "password", "childId"];
  }, [mode, view]);

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

      // signup
      if (mode === "child") {
        const res = await signupChild({
          name: form.name.trim(),
          username: form.username.trim(),
          password: form.password,
        });

        if (!res?.ok) {
          setError(res?.error || "Child signup failed");
          return;
        }

        // show child id so parent can use it
        const childId = res?.user?.childId;
        alert(
          `Child account created \n\nChild ID: ${childId}\n\nSave this ID and use it when creating the parent account.`
        );

        // switch to login, keep username/password for convenience
        setView("login");
        setForm((prev) => ({
          name: "",
          username: prev.username,
          password: prev.password,
          childId: "",
        }));

        return;
      }

      // parent signup
      const res = await signupParent({
        name: form.name.trim(),
        username: form.username.trim(),
        password: form.password,
        childId: form.childId.trim(),
      });

      if (!res?.ok) {
        setError(res?.error || "Parent signup failed");
        return;
      }

      alert("Parent account created! Now log in.");

      setView("login");
      setForm((prev) => ({
        name: "",
        username: prev.username,
        password: prev.password,
        childId: "",
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
      childId: nextView === "login" ? "" : prev.childId,
    }));
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo} />
            <div>
              <div style={styles.title}>Finlingo</div>
            </div>
          </div>

          <ModeToggle mode={mode} onChange={setMode} />
        </div>

        <div style={styles.tabs}>
          <TabButton active={view === "login"} onClick={() => switchView("login")}>
            Log in
          </TabButton>
          <TabButton active={view === "signup"} onClick={() => switchView("signup")}>
            Create account
          </TabButton>
        </div>

        <div style={styles.modeLine}>
          <span style={styles.modePill}>{mode === "child" ? "Child mode" : "Parent mode"}</span>
          <span style={styles.modeHint}>
            {view === "login"
              ? "Log in with your username + password."
              : mode === "child"
              ? "Create a child account."
              : "Create a parent account and link to your child."}
          </span>
        </div>

        {error ? <div style={styles.errorBox}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.includes("name") && (
            <Field
              label="Name"
              placeholder={mode === "child" ? "e.g., Ava" : "e.g., Sarah Ahmed"}
              value={form.name}
              onChange={(v) => updateField("name", v)}
            />
          )}

          {fields.includes("username") && (
            <Field
              label="Username"
              placeholder="e.g., ava123"
              value={form.username}
              onChange={(v) => updateField("username", v)}
              autoComplete="username"
            />
          )}

          {fields.includes("password") && (
            <Field
              label="Password"
              placeholder="min 6 characters"
              value={form.password}
              onChange={(v) => updateField("password", v)}
              type="password"
              autoComplete={view === "login" ? "current-password" : "new-password"}
            />
          )}

          {fields.includes("childId") && (
            <Field
              label="Child ID"
              placeholder="e.g., CH-48219"
              value={form.childId}
              onChange={(v) => updateField("childId", v)}
              helper="Paste the Child ID created when the child account was made."
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
            {loading ? "Please wait..." : view === "login" ? "Log in" : "Create account"}
          </button>

          <div style={styles.footerRow}>
            <button
              type="button"
              onClick={() => {
                setError("");
                setForm({ name: "", username: "", password: "", childId: "" });
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

function ModeToggle({ mode, onChange }) {
  const isChild = mode === "child";
  return (
    <div style={styles.toggleWrap}>
      <span style={{ ...styles.toggleLabel, opacity: isChild ? 1 : 0.55 }}>Parent</span>

      <button
        type="button"
        onClick={() => onChange(isChild ? "parent" : "child")}
        style={{
          ...styles.toggleBtn,
          justifyContent: isChild ? "flex-end" : "flex-start",
        }}
        aria-label="toggle parent/child mode"
      >
        <span style={styles.toggleKnob} />
      </button>

      <span style={{ ...styles.toggleLabel, opacity: isChild ? 0.55 : 1 }}>Child</span>
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
      "radial-gradient(1200px 600px at 20% 0%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(34,197,94,0.14), transparent 55%), #0b1020",
    color: "#e8eefc",
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
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 14,
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, rgba(99,102,241,1), rgba(34,197,94,1))",
  },
  title: { fontSize: 18, fontWeight: 800, letterSpacing: 0.2 },

  toggleWrap: { display: "flex", alignItems: "center", gap: 10 },
  toggleLabel: { fontSize: 12, fontWeight: 700, letterSpacing: 0.2 },
  toggleBtn: {
    width: 54,
    height: 30,
    borderRadius: 999,
    padding: 4,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: "rgba(255,255,255,0.90)",
  },

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
    background: "rgba(99,102,241,0.22)",
    border: "1px solid rgba(99,102,241,0.45)",
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
    color: "#ffd3d3",
    fontSize: 12,
    fontWeight: 700,
  },

  form: { marginTop: 12 },
  field: { marginBottom: 12 },
  label: { display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e8eefc",
    outline: "none",
  },
  helper: { fontSize: 11, opacity: 0.72, marginTop: 6 },

  primaryBtn: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "none",
    color: "#081027",
    fontWeight: 900,
    background: "linear-gradient(135deg, rgba(99,102,241,1), rgba(34,197,94,1))",
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
