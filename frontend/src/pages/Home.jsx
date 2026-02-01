import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// homepage: grid "level select" (15 boxes), same dark theme
// - only levels 1..5 are real (navigate to /level/1..5)
// - levels unlock in order (1 -> 2 -> 3 -> 4 -> 5)
// - finishing a level sets localStorage.finlingo_last_completed_level = "<n>"
// - when you come back to /home, it unlocks the next level

function readUserPrefs() {
  const username = localStorage.getItem("finlingo_username") || "guest";
  const prefsKey = `finlingo_prefs:${username}`;
  
  try {
    const raw = localStorage.getItem(prefsKey);
    if (!raw) return { theme: "neo" };
    return JSON.parse(raw);
  } catch {
    return { theme: "neo" };
  }
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [toast, setToast] = useState("🎯 Tap level 1 to start — complete them in order.");

  const userPrefs = readUserPrefs();
  const isEnchantedTheme = userPrefs.theme === "enchanted";

  // create 15 slots, but only first 5 are playable
  const levels = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => {
      const id = i + 1;
      const playable = id <= 5;
      return { id, playable };
    });
  }, []);

  function showToast(msg, ms = 2200) {
    setToast(msg);
    if (ms > 0) {
      window.clearTimeout(showToast._t);
      showToast._t = window.setTimeout(() => {
        setToast("🎯 Tap the next unlocked level to continue.");
      }, ms);
    }
  }

  // ---- load progress + unlock when returning from a level ----
  useEffect(() => {
    const savedUnlocked = Number(localStorage.getItem("finlingo_unlocked_level") || "1");
    const safeUnlocked = Number.isFinite(savedUnlocked)
      ? Math.min(Math.max(savedUnlocked, 1), 5)
      : 1;

    let nextUnlocked = safeUnlocked;

    // if we are coming back from a level, unlock the next one
    const lastCompletedRaw = localStorage.getItem("finlingo_last_completed_level");
    const lastCompleted = Number(lastCompletedRaw || "0");

    if (Number.isFinite(lastCompleted) && lastCompleted >= 1 && lastCompleted <= 5) {
      const next = Math.min(lastCompleted + 1, 5);
      if (next > safeUnlocked) {
        nextUnlocked = next;
        localStorage.setItem("finlingo_unlocked_level", String(nextUnlocked));
        showToast(`🎉 Unlocked level ${nextUnlocked}!`);
      }
      // clear flag so refresh doesn't re-trigger
      localStorage.removeItem("finlingo_last_completed_level");
    }

    setUnlockedLevel(nextUnlocked);
    setSelected(Math.min(nextUnlocked, 5));
  }, [location.pathname]);

  // ---- click -> go to level page ----
  function tryOpenLevel(levelId) {
    const isPlayable = levelId <= 5;

    if (!isPlayable) {
      showToast("🚧 These levels are coming soon!");
      return;
    }

    if (levelId > unlockedLevel) {
      showToast(`🔒 Open level ${unlockedLevel} to unlock this level.`);
      return;
    }

    setSelected(levelId);
    showToast(`🚀 Loading level ${levelId}...`, 900);

    window.clearTimeout(tryOpenLevel._nav);
    tryOpenLevel._nav = window.setTimeout(() => {
      navigate(`/level/${levelId}`);
    }, 450);
  }

  // ---- logout ----
  function handleLogout() {
    localStorage.removeItem("finlingo_session");
    navigate("/"); // your login route
  }

  // quick "star" display like the example (based on progress)
  function starsForLevel(id) {
    // feel free to tweak this logic
    if (id < unlockedLevel) return 3; // completed
    if (id === unlockedLevel) return 2; // current
    return 0; // locked
  }

  return (
    <div style={{
        ...styles.page,
        // Apply theme based on settings
        background: isEnchantedTheme 
            ? "linear-gradient(135deg, #FF9FF3 0%, #A8D8EA 50%, #C9E4CA 100%)"
            : "linear-gradient(135deg, #FFD1DC 0%, #A8D8EA 50%, #C9E4CA 100%)",
        color: "#2C3E50",
    }}>
      <div style={styles.topBar}>
        <div style={styles.centerTitle}>🏠 HOMEPAGE</div>

        <div style={styles.rightBtns}>
          <button type="button" style={styles.goalJarBtn} onClick={() => navigate("/goal-jar")}>
            🎯 Goal Jar
          </button>
          <button type="button" style={styles.badgesBtn} onClick={() => navigate("/badges")}>
            🏆 Badges
          </button>
          <button type="button" style={styles.settingsBtn} onClick={() => navigate("/settings")}>
            ⚙️ Settings
          </button>
          <button type="button" style={styles.logoutBtn} onClick={handleLogout}>
            🚪 Log out
          </button>
        </div>
      </div>

      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={{ ...styles.blob, ...styles.blob1 }} />
          <div style={{ ...styles.blob, ...styles.blob2 }} />

          <div style={styles.header}>
            <div style={styles.bigTitle}>🎮 Select Level</div>
            <div style={styles.smallSub}>Complete levels in order to unlock the next one.</div>
          </div>

          <div style={styles.grid}>
            {levels.map((lvl) => {
              const isPlayable = lvl.playable;
              const isLocked = lvl.id > unlockedLevel && isPlayable;
              const isSelected = selected === lvl.id;

              const starCount = isPlayable ? starsForLevel(lvl.id) : 0;

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => tryOpenLevel(lvl.id)}
                  style={{
                    ...styles.tile,
                    ...(isSelected ? styles.tileSelected : {}),
                    ...(isPlayable ? {} : styles.tileSoon),
                    ...(isLocked ? styles.tileLocked : {}),
                  }}
                  title={
                    !isPlayable
                      ? "Coming soon"
                      : isLocked
                      ? `Locked — open level ${unlockedLevel} first`
                      : `Open level ${lvl.id}`
                  }
                >
                  {/* top stars row */}
                  <div style={styles.starRow}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          ...styles.star,
                          opacity: i < starCount ? 1 : 0.18,
                        }}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* center content */}
                  <div style={styles.tileCenter}>
                    <div style={styles.tileNumber}>{lvl.id}</div>

                    {/* lock overlay for locked playable levels */}
                    {isLocked ? <div style={styles.lockIcon}>🔒</div> : null}

                    {/* coming soon label for 6..15 */}
                    {!isPlayable ? <div style={styles.soonTag}>🚧 SOON</div> : null}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={styles.bottomHint}>
            <span style={styles.hintPill}>💡 Tip</span>
            {toast}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    color: "#2C3E50",
    fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", "Segoe UI", sans-serif',
    display: "flex",
    flexDirection: "column",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    maxWidth: 980,
    width: "100%",
    margin: "0 auto",
  },

  centerTitle: {
    fontSize: 14,
    fontWeight: 1000,
    letterSpacing: 2.2,
    opacity: 0.95,
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  badgesBtn: {
    borderRadius: 16,
    border: "2px solid #FFD1DC",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#2C3E50",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.2s",
  },

  goalJarBtn: {
  borderRadius: 16,
  border: "2px solid #FFB7D5",
  background: "rgba(255, 255, 255, 0.9)",
  color: "#2C3E50",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  transition: "all 0.2s",
},

  rightBtns: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  settingsBtn: {
    borderRadius: 16,
    border: "2px solid #A8D8EA",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#2C3E50",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.2s",
  },

  logoutBtn: {
    borderRadius: 16,
    border: "2px solid #C9E4CA",
    background: "rgba(255, 255, 255, 0.9)",
    color: "#2C3E50",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.2s",
  },

  wrap: {
    flex: 1,
    padding: 20,
    maxWidth: 980,
    width: "100%",
    margin: "0 auto",
    display: "grid",
    placeItems: "center",
  },

  card: {
    position: "relative",
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    border: "3px solid #A8D8EA",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 60px rgba(168, 216, 234, 0.3)",
    padding: 24,
  },

  blob: {
    position: "absolute",
    borderRadius: 999,
    filter: "blur(16px)",
    opacity: 0.3,
    pointerEvents: "none",
  },
  blob1: {
    width: 300,
    height: 300,
    left: -80,
    top: -80,
    background: "#FFD1DC",
  },
  blob2: {
    width: 360,
    height: 360,
    right: -110,
    bottom: -110,
    background: "#C9E4CA",
  },

  header: {
    position: "relative",
    padding: "8px 6px 14px",
    textAlign: "center",
  },
  bigTitle: {
    fontSize: 40,
    fontWeight: 1000,
    letterSpacing: 0.4,
    lineHeight: 1.05,
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  smallSub: {
    marginTop: 8,
    fontSize: 14,
    color: "#5D6D7E",
    fontWeight: 600,
  },

  grid: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 16,
    padding: "10px 6px 18px",
  },

  tile: {
    position: "relative",
    height: 120,
    borderRadius: 20,
    border: "3px solid #A8D8EA",
    background: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 10px 30px rgba(168, 216, 234, 0.2)",
    cursor: "pointer",
    color: "#2C3E50",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    transition: "transform 140ms ease, box-shadow 140ms ease, border 140ms ease, opacity 140ms ease",
  },

  tileSelected: {
    transform: "translateY(-4px) scale(1.03)",
    border: "3px solid #FFD1DC",
    boxShadow: "0 15px 40px rgba(255, 209, 220, 0.3)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 209, 220, 0.2))",
  },

  tileLocked: {
    opacity: 0.6,
    cursor: "not-allowed",
    background: "rgba(255, 255, 255, 0.7)",
  },

  tileSoon: {
    opacity: 0.7,
    background: "rgba(255, 255, 255, 0.8)",
    border: "3px dashed #C9E4CA",
  },

  starRow: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
  },
  star: {
    fontSize: 16,
    color: "#FFD166",
    textShadow: "0 4px 8px rgba(255, 209, 102, 0.3)",
  },

  tileCenter: {
    position: "relative",
    flex: 1,
    width: "100%",
    display: "grid",
    placeItems: "center",
    paddingBottom: 6,
  },

  tileNumber: {
    fontSize: 36,
    fontWeight: 1000,
    letterSpacing: 0.4,
    color: "#2C3E50",
  },

  lockIcon: {
    position: "absolute",
    right: 10,
    bottom: 8,
    fontSize: 20,
    opacity: 0.8,
  },

  soonTag: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 11,
    fontWeight: 1000,
    letterSpacing: 1.2,
    color: "#5D6D7E",
    borderRadius: 999,
    padding: "6px 12px",
    border: "2px solid #C9E4CA",
    background: "rgba(201, 228, 202, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },

  bottomHint: {
    position: "relative",
    marginTop: 6,
    padding: "14px 16px",
    borderRadius: 16,
    border: "2px solid #FFD1DC",
    background: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    color: "#2C3E50",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontWeight: 600,
  },
  hintPill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 12px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #FFD1DC, #FFB7D5)",
    border: "2px solid #FFD1DC",
    color: "#2C3E50",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
};
