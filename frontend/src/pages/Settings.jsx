import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function prefsKey(username) {
  return `finlingo_prefs:${username || "guest"}`;
}

function readPrefs(username) {
  try {
    const raw = localStorage.getItem(prefsKey(username));
    if (!raw) return { 
      theme: "neo"
    };
    const obj = JSON.parse(raw);
    return {
      theme: obj.theme === "enchanted" ? "enchanted" : "neo"
    };
  } catch {
    return { 
      theme: "neo"
    };
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
  const [activeSection, setActiveSection] = useState("appearance");

  const themeStyles = useMemo(() => {
    return prefs.theme === "enchanted" ? enchanted : neo;
  }, [prefs.theme]);

  function update(next) {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    writePrefs(username, merged);
  }

  function resetToDefaults() {
    const defaults = {
      theme: "neo"
    };
    setPrefs(defaults);
    writePrefs(username, defaults);
  }

  return (
    <div style={{ ...base.page, ...themeStyles.page }}>
      <div style={{ ...base.card, ...themeStyles.card }}>
        {/* Header */}
        <div style={base.header}>
          <div>
            <div style={{ ...base.title, ...themeStyles.title }}>
              ⚙️ Settings
            </div>
            <div style={{ ...base.subtitle, ...themeStyles.subtitle }}>
              {username === "guest" ? "Guest mode" : `Settings for ${username}`}
            </div>
          </div>

          <div style={base.headerButtons}>
            <button 
              style={{ ...base.btn, ...themeStyles.btnSecondary }}
              onClick={resetToDefaults}
              title="Reset all settings to default"
            >
              Reset
            </button>
            <button 
              style={{ ...base.btn, ...themeStyles.btn }}
              onClick={() => nav("/home")}
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div style={base.content}>
          <div style={base.sidebar}>
            {["appearance", "advanced"].map((section) => (
              <button
                key={section}
                style={{
                  ...base.sidebarBtn,
                  ...(activeSection === section ? themeStyles.sidebarBtnActive : {}),
                  ...themeStyles.sidebarBtn
                }}
                onClick={() => setActiveSection(section)}
              >
                {section === "appearance" && "🎨 "}
                {section === "advanced" && "⚙️ "}
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div style={base.settingsContent}>
            {/* Appearance Section */}
            {activeSection === "appearance" && (
              <div style={base.section}>
                <div style={{ ...base.sectionTitle, ...themeStyles.sectionTitle }}>
                  🎨 Appearance
                </div>
                
                <div style={base.row}>
                  <div>
                    <div style={base.label}>Theme</div>
                    <div style={base.description}>
                      {prefs.theme === "enchanted" 
                        ? "Fantasy theme for younger learners" 
                        : "Modern theme for all ages"}
                    </div>
                  </div>
                  <div style={base.themeButtons}>
                    <button
                      onClick={() => update({ theme: "neo" })}
                      style={{
                        ...base.themeButton,
                        ...(prefs.theme === "neo" ? themeStyles.themeButtonActive : themeStyles.themeButtonInactive)
                      }}
                    >
                      Neo
                    </button>
                    <button
                      onClick={() => update({ theme: "enchanted" })}
                      style={{
                        ...base.themeButton,
                        ...(prefs.theme === "enchanted" ? themeStyles.themeButtonActive : themeStyles.themeButtonInactive)
                      }}
                    >
                      Enchanted
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Section */}
            {activeSection === "advanced" && (
              <div style={base.section}>
                <div style={{ ...base.sectionTitle, ...themeStyles.sectionTitle }}>
                  ⚙️ Advanced
                </div>
                
                <div style={base.infoBox}>
                  <div style={base.infoTitle}>Local Storage</div>
                  <div style={base.infoText}>
                    Your settings are saved locally in your browser. To reset everything, you can:
                  </div>
                  <div style={base.steps}>
                    <div style={base.step}>1. Open Developer Tools (F12)</div>
                    <div style={base.step}>2. Go to "Application" tab</div>
                    <div style={base.step}>3. Find "Local Storage"</div>
                    <div style={base.step}>4. Delete keys starting with "finlingo_"</div>
                  </div>
                </div>

                <div style={base.row}>
                  <div>
                    <div style={base.label}>Clear All Progress</div>
                    <div style={base.description}>Reset all your progress and start fresh</div>
                  </div>
                  <button
                    style={{ ...base.dangerBtn, ...themeStyles.dangerBtn }}
                    onClick={() => {
                      if (window.confirm("Are you sure? This will reset ALL your progress and settings!")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const base = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  card: {
    width: "min(600px, 95vw)",
    borderRadius: 24,
    padding: 24,
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 30,
    flexWrap: "wrap",
  },
  headerButtons: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  title: { 
    fontSize: 28, 
    fontWeight: 800, 
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  subtitle: { 
    fontSize: 14, 
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  btn: {
    padding: "12px 20px",
    borderRadius: 16,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  content: {
    display: "flex",
    gap: 24,
    flexDirection: "column",
    '@media (min-width: 768px)': {
      flexDirection: "row",
    },
  },
  sidebar: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    '@media (min-width: 768px)': {
      flexDirection: "column",
      width: 160,
      flexShrink: 0,
    },
  },
  sidebarBtn: {
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
    textAlign: "left",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    '@media (min-width: 768px)': {
      flex: "none",
    },
  },
  settingsContent: {
    flex: 1,
    minWidth: 0,
  },
  section: {
    marginTop: 0,
    padding: 24,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    marginBottom: 20,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 800, 
    marginBottom: 24,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    padding: "18px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    flexWrap: "wrap",
  },
  label: { 
    fontSize: 16, 
    fontWeight: 700, 
    opacity: 0.95,
    marginBottom: 4,
  },
  description: { 
    fontSize: 13, 
    opacity: 0.7, 
    lineHeight: 1.5,
    maxWidth: 400,
  },
  themeButtons: {
    display: "flex",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 4,
  },
  themeButton: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s",
  },
  infoBox: {
    padding: 20,
    borderRadius: 16,
    background: "rgba(255,255,255,0.05)",
    border: "1px dashed rgba(255,255,255,0.2)",
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    color: "rgba(255,255,255,0.9)",
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  steps: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  step: {
    fontSize: 13,
    opacity: 0.7,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  dangerBtn: {
    padding: "10px 20px",
    borderRadius: 12,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s ease",
  },
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
  title: {
    background: "linear-gradient(135deg, #60a5fa, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#a5b4fc",
  },
  btn: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.1)",
    color: "#e8eefc",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  sidebarBtn: {
    background: "rgba(255,255,255,0.07)",
    color: "#c7d2fe",
  },
  sidebarBtnActive: {
    background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(124,58,237,0.3))",
    color: "white",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
  },
  sectionTitle: {
    color: "#93c5fd",
  },
  themeButtonActive: {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
  },
  themeButtonInactive: {
    background: "transparent",
    color: "rgba(255,255,255,0.7)",
  },
  dangerBtn: {
    background: "rgba(239, 68, 68, 0.2)",
    color: "#fecaca",
    border: "1px solid rgba(239, 68, 68, 0.3)",
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
  title: {
    background: "linear-gradient(135deg, #a87cff, #ffbe6e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#d4c2ff",
  },
  btn: {
    background: "linear-gradient(135deg, #a87cff, #40e0d0)",
    color: "white",
    boxShadow: "0 4px 20px rgba(168, 124, 255, 0.4)",
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.1)",
    color: "#f4f1ff",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  sidebarBtn: {
    background: "rgba(255,255,255,0.08)",
    color: "#d4c2ff",
  },
  sidebarBtnActive: {
    background: "linear-gradient(135deg, rgba(168,124,255,0.3), rgba(64,224,208,0.3))",
    color: "white",
    boxShadow: "0 4px 20px rgba(168, 124, 255, 0.3)",
  },
  sectionTitle: {
    color: "#ffbe6e",
  },
  themeButtonActive: {
    background: "linear-gradient(135deg, #a87cff, #40e0d0)",
    color: "white",
    boxShadow: "0 4px 12px rgba(168, 124, 255, 0.2)",
  },
  themeButtonInactive: {
    background: "transparent",
    color: "rgba(255,255,255,0.7)",
  },
  dangerBtn: {
    background: "rgba(255, 107, 107, 0.2)",
    color: "#ffdada",
    border: "1px solid rgba(255, 107, 107, 0.3)",
  },
};
