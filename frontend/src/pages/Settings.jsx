import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function prefsKey(username) {
  return `finlingo_prefs:${username || "guest"}`;
}

function readPrefs(username) {
  try {
    const raw = localStorage.getItem(prefsKey(username));
    if (!raw) return { theme: "neo", sparkles: true, reducedMotion: false };
    const obj = JSON.parse(raw);
    return {
      theme: obj.theme === "enchanted" ? "enchanted" : "neo",
      sparkles: obj.sparkles !== false,
      reducedMotion: !!obj.reducedMotion,
    };
  } catch {
    return { theme: "neo", sparkles: true, reducedMotion: false };
  }
}

function writePrefs(username, prefs) {
  localStorage.setItem(prefsKey(username), JSON.stringify(prefs));
}

export default function Settings() {
  const nav = useNavigate();

  const username =
    localStorage.getItem("username") ||
    localStorage.getItem("finlingo_username") ||
    "guest";

  const [prefs, setPrefs] = useState(() => readPrefs(username));

  const themeStyles = useMemo(() => {
    return prefs.theme === "enchanted" ? enchanted : neo;
  }, [prefs.theme]);

  function update(next) {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    writePrefs(username, merged);
  }

  return (
    <div style={{ ...base.page, ...themeStyles.page }}>
      <div style={{ ...base.card, ...themeStyles.card }}>
        <div style={base.header}>
          <div>
            <div style={base.title}>Settings</div>
            <div style={base.subtitle}>
              {username === "guest" ? "not logged in" : `for ${username}`}
            </div>
          </div>

          <button style={{ ...base.btn, ...themeStyles.btn }} onClick={() => nav("/home")}>
            Back
          </button>
        </div>

        <div style={base.section}>
          <div style={base.sectionTitle}>Theme</div>

          <div style={base.row}>
            <label style={base.label}>Enchanted fantasy look (ages 7–10)</label>
            <Toggle
              value={prefs.theme === "enchanted"}
              onChange={(v) => update({ theme: v ? "enchanted" : "neo" })}
              theme={prefs.theme}
            />
          </div>

          <div style={base.row}>
            <label style={base.label}>Sparkles</label>
            <Toggle
              value={prefs.sparkles}
              onChange={(v) => update({ sparkles: v })}
              theme={prefs.theme}
            />
          </div>

          <div style={base.row}>
            <label style={base.label}>Reduced motion</label>
            <Toggle
              value={prefs.reducedMotion}
              onChange={(v) => update({ reducedMotion: v })}
              theme={prefs.theme}
            />
          </div>
        </div>

        <div style={base.section}>
          <div style={base.sectionTitle}>Info</div>
          <div style={base.p}>
            These settings persist per user (localStorage). If you ever want to reset everything,
            delete keys that start with <b>finlingo_</b> in Application → Local Storage.
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange, theme }) {
  const on = !!value;
  const colors = theme === "enchanted" ? enchanted.toggle : neo.toggle;

  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 54,
        height: 30,
        borderRadius: 999,
        padding: 4,
        border: `1px solid ${colors.border}`,
        background: on ? colors.onBg : colors.offBg,
        display: "flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        cursor: "pointer",
      }}
      aria-label="toggle"
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: colors.knob,
        }}
      />
    </button>
  );
}

const base = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  card: {
    width: "min(720px, 100%)",
    borderRadius: 22,
    padding: 18,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: 1000, letterSpacing: 0.2 },
  subtitle: { fontSize: 12, opacity: 0.75, marginTop: 2 },
  btn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e8eefc",
    fontWeight: 900,
    cursor: "pointer",
  },
  section: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
  },
  sectionTitle: { fontSize: 14, fontWeight: 1000, marginBottom: 10 },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  label: { fontSize: 13, fontWeight: 800, opacity: 0.92 },
  p: { fontSize: 13, opacity: 0.82, lineHeight: 1.55 },
};

const neo = {
  page: {
    background:
      "radial-gradient(1200px 600px at 20% 0%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(34,197,94,0.14), transparent 55%), #0b1020",
    color: "#e8eefc",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  btn: {},
  toggle: {
    border: "rgba(255,255,255,0.18)",
    onBg: "rgba(99,102,241,0.35)",
    offBg: "rgba(255,255,255,0.08)",
    knob: "rgba(255,255,255,0.90)",
  },
};

const enchanted = {
  page: {
    background:
      "radial-gradient(1200px 700px at 15% 0%, rgba(168,124,255,0.26), transparent 55%), radial-gradient(1000px 700px at 95% 20%, rgba(64,224,208,0.18), transparent 55%), radial-gradient(900px 600px at 50% 100%, rgba(255,190,110,0.16), transparent 60%), #07081a",
    color: "#f4f1ff",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.50)",
  },
  btn: {},
  toggle: {
    border: "rgba(255,255,255,0.22)",
    onBg: "rgba(168,124,255,0.40)",
    offBg: "rgba(255,255,255,0.10)",
    knob: "rgba(255, 235, 205, 0.95)",
  },
};
