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
              {username === "guest" ? "👤 Guest mode" : `👤 Settings for ${username}`}
            </div>
          </div>

          <div style={base.headerButtons}>
            <button 
              style={{ ...base.btn, ...themeStyles.btnSecondary }}
              onClick={resetToDefaults}
              title="Reset all settings to default"
            >
              🔄 Reset
            </button>
            <button 
              style={{ ...base.btn, ...themeStyles.btn }}
              onClick={() => nav("/home")}
            >
              🏠 Back to Home
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
                        ? "🌈 Fantasy theme for younger learners" 
                        : "🌟 Modern theme for all ages"}
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
                      🌟 Neo
                    </button>
                    <button
                      onClick={() => update({ theme: "enchanted" })}
                      style={{
                        ...base.themeButton,
                        ...(prefs.theme === "enchanted" ? themeStyles.themeButtonActive : themeStyles.themeButtonInactive)
                      }}
                    >
                      🧚 Enchanted
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
                  <div style={base.infoTitle}>💾 Local Storage</div>
                  <div style={base.infoText}>
                    Your settings are saved locally in your browser. To reset everything, you can:
                  </div>
                  <div style={base.steps}>
                    <div style={base.step}>1️⃣ Open Developer Tools (F12)</div>
                    <div style={base.step}>2️⃣ Go to "Application" tab</div>
                    <div style={base.step}>3️⃣ Find "Local Storage"</div>
                    <div style={base.step}>4️⃣ Delete keys starting with "finlingo_"</div>
                  </div>
                </div>

                <div style={base.row}>
                  <div>
                    <div style={base.label}>🗑️ Clear All Progress</div>
                    <div style={base.description}>Reset all your progress and start fresh</div>
                  </div>
                  <button
                    style={{ ...base.dangerBtn, ...themeStyles.dangerBtn }}
                    onClick={() => {
                      if (window.confirm("⚠️ Are you sure? This will reset ALL your progress and settings!")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    🗑️ Clear All Data
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
    background: "linear-gradient(135deg, #FFD1DC 0%, #A8D8EA 50%, #C9E4CA 100%)",
    color: "#2C3E50",
    fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", "Segoe UI", sans-serif',
  },
  card: {
    width: "min(600px, 95vw)",
    borderRadius: 24,
    padding: 24,
    background: "rgba(255, 255, 255, 0.95)",
    border: "3px solid #A8D8EA",
    boxSizing: "border-box",
    boxShadow: "0 20px 60px rgba(168, 216, 234, 0.3)",
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
    background: "rgba(255, 255, 255, 0.8)",
    border: "2px solid #C9E4CA",
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
    borderBottom: "2px solid rgba(168, 216, 234, 0.3)",
    flexWrap: "wrap",
  },
  label: { 
    fontSize: 16, 
    fontWeight: 700,
    marginBottom: 4,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  description: { 
    fontSize: 13, 
    color: "#5D6D7E",
    lineHeight: 1.5,
    maxWidth: 400,
  },
  themeButtons: {
    display: "flex",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    padding: 4,
    border: "2px solid #A8D8EA",
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
    background: "rgba(255, 255, 255, 0.9)",
    border: "2px dashed #A8D8EA",
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    color: "#2C3E50",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#5D6D7E",
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
    color: "#5D6D7E",
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
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
};

const neo = {
  page: {
    // Uses base.page background
  },
  card: {
    // Uses base.card styles
  },
  title: {
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#5D6D7E",
  },
  btn: {
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    color: "#2C3E50",
    boxShadow: "0 4px 14px rgba(255, 209, 220, 0.4)",
  },
  btnSecondary: {
    background: "rgba(255, 255, 255, 0.9)",
    color: "#5D6D7E",
    border: "2px solid #C9E4CA",
  },
  sidebarBtn: {
    background: "rgba(255, 255, 255, 0.8)",
    color: "#5D6D7E",
    border: "2px solid #A8D8EA",
  },
  sidebarBtnActive: {
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    color: "#2C3E50",
    boxShadow: "0 4px 12px rgba(255, 209, 220, 0.2)",
  },
  sectionTitle: {
    color: "#FFD1DC",
  },
  themeButtonActive: {
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    color: "#2C3E50",
    boxShadow: "0 4px 12px rgba(255, 209, 220, 0.2)",
  },
  themeButtonInactive: {
    background: "transparent",
    color: "#7F8C8D",
    border: "2px solid #C9E4CA",
  },
  dangerBtn: {
    background: "rgba(255, 107, 107, 0.2)",
    color: "#CC3366",
    border: "2px solid #FF6B6B",
  },
};

const enchanted = {
  page: {
    // Uses base.page background
  },
  card: {
    // Uses base.card styles
  },
  title: {
    background: "linear-gradient(135deg, #FF9FF3, #FFD1DC, #A8D8EA)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#FF9FF3",
  },
  btn: {
    background: "linear-gradient(135deg, #FF9FF3, #A8D8EA, #C9E4CA)",
    color: "#2C3E50",
    boxShadow: "0 4px 20px rgba(255, 159, 243, 0.4)",
  },
  btnSecondary: {
    background: "rgba(255, 255, 255, 0.9)",
    color: "#FF9FF3",
    border: "2px solid #FF9FF3",
  },
  sidebarBtn: {
    background: "rgba(255, 255, 255, 0.8)",
    color: "#FF9FF3",
    border: "2px solid #FF9FF3",
  },
  sidebarBtnActive: {
    background: "linear-gradient(135deg, #FF9FF3, #A8D8EA)",
    color: "#2C3E50",
    boxShadow: "0 4px 20px rgba(255, 159, 243, 0.3)",
  },
  sectionTitle: {
    color: "#FF9FF3",
  },
  themeButtonActive: {
    background: "linear-gradient(135deg, #FF9FF3, #A8D8EA)",
    color: "#2C3E50",
    boxShadow: "0 4px 12px rgba(255, 159, 243, 0.2)",
  },
  themeButtonInactive: {
    background: "transparent",
    color: "#7F8C8D",
    border: "2px solid #FFD1DC",
  },
  dangerBtn: {
    background: "rgba(255, 107, 107, 0.3)",
    color: "#CC3366",
    border: "2px solid #FF6B6B",
  },
};
