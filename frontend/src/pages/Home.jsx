import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// homepage: scrollable long map + sequential unlock + real navigation to /level/1..5
// - must go in order (can't open locked levels)
// - when you RETURN to homepage from a level page, it unlocks the next level + highlights the segment
// - progress persists in localStorage

export default function Home() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1); // max unlocked
  const [toast, setToast] = useState("Tap level 1 to start — complete them in order.");
  const [unlockPulseSeg, setUnlockPulseSeg] = useState(null); // 1..4

  const levels = useMemo(
    () => [
      { id: 1, x: 78, y: 10, icon: "🚀", label: "Level 1" },
      { id: 2, x: 52, y: 30, icon: "⭐", label: "Level 2" },
      { id: 3, x: 22, y: 52, icon: "🧠", label: "Level 3" },
      { id: 4, x: 62, y: 74, icon: "💰", label: "Level 4" },
      { id: 5, x: 28, y: 92, icon: "🏆", label: "Level 5" },
    ],
    []
  );

  // ---- persistence ----
  useEffect(() => {
    const savedUnlocked = Number(localStorage.getItem("finlingo_unlocked_level") || "1");
    const safeUnlocked = Number.isFinite(savedUnlocked)
      ? Math.min(Math.max(savedUnlocked, 1), 5)
      : 1;

    setUnlockedLevel(safeUnlocked);
    setSelected(Math.min(safeUnlocked, 5));

    // if we are coming back from a level, unlock the next one
    // (level pages should set localStorage.finlingo_last_completed_level = "<n>" before navigating back)
    const lastCompleted = Number(localStorage.getItem("finlingo_last_completed_level") || "0");
    if (Number.isFinite(lastCompleted) && lastCompleted >= 1 && lastCompleted <= 5) {
      const next = Math.min(lastCompleted + 1, 5);

      // only unlock if it advances progress
      if (next > safeUnlocked) {
        setUnlockedLevel(next);
        localStorage.setItem("finlingo_unlocked_level", String(next));

        // pulse segment between completed and next (segment index = completed level)
        if (lastCompleted <= 4) {
          setUnlockPulseSeg(lastCompleted);
          window.setTimeout(() => setUnlockPulseSeg(null), 900);
        }

        setToast(`Unlocked level ${next}!`);
      }

      // clear flag so it doesn't re-unlock on refresh
      localStorage.removeItem("finlingo_last_completed_level");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("finlingo_unlocked_level", String(unlockedLevel));
  }, [unlockedLevel]);

  function showToast(msg, ms = 2200) {
    setToast(msg);
    if (ms > 0) {
      window.clearTimeout(showToast._t);
      showToast._t = window.setTimeout(() => {
        setToast("Tap the next unlocked level to continue.");
      }, ms);
    }
  }

  // ---- click -> go to level page ----
  function tryOpenLevel(levelId) {
    if (levelId > unlockedLevel) {
      showToast(`Open level ${unlockedLevel} to unlock this level.`);
      return;
    }

    setSelected(levelId);
    showToast(`Loading level ${levelId}...`, 900);

    // navigate to the correct level page
    // make sure your routes exist: /level/1, /level/2, etc
    window.clearTimeout(tryOpenLevel._nav);
    tryOpenLevel._nav = window.setTimeout(() => {
      navigate(`/level/${levelId}`);
    }, 450);
  }

  // ---- logout ----
  function handleLogout() {
    // clear auth keys if you have them
    localStorage.removeItem("finlingo_session");
    // ALWAYS go back to login
    navigate("/");
  }

  // segments 1..4 correspond to 1->2, 2->3, 3->4, 4->5
  const segUnlocked = {
    1: unlockedLevel >= 2,
    2: unlockedLevel >= 3,
    3: unlockedLevel >= 4,
    4: unlockedLevel >= 5,
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        {/* left: HOMEPAGE only */}
        <div style={styles.centerTitle} aria-label="homepage title">
          HOMEPAGE
        </div>

        {/* right: settings + logout */}
        <div style={styles.rightBtns}>
          <button
            type="button"
            style={styles.settingsBtn}
            onClick={() => navigate("/settings")}
            aria-label="settings"
            title="Settings"
          >
            ⚙️
          </button>

          <button
            type="button"
            style={styles.logoutBtn}
            onClick={handleLogout}
            aria-label="log out"
            title="Log out"
          >
            Log out
          </button>
        </div>
      </div>

      <div style={styles.mapWrap}>
        <div style={styles.mapCard}>
          <div style={{ ...styles.blob, ...styles.blob1 }} />
          <div style={{ ...styles.blob, ...styles.blob2 }} />

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.pathSvg} aria-hidden="true">
            <path
              d="M78 10
                 C 66 18, 60 24, 52 30
                 S 34 44, 22 52
                 S 46 66, 62 74
                 S 44 86, 28 92"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="6.2"
              strokeLinecap="round"
            />

            <path
              d="M78 10
                 C 66 18, 60 24, 52 30
                 S 34 44, 22 52
                 S 46 66, 62 74
                 S 44 86, 28 92"
              fill="none"
              stroke="rgba(99,102,241,0.22)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* seg 1 */}
            <path
              d="M78 10 C 66 18, 60 24, 52 30"
              fill="none"
              stroke={segUnlocked[1] ? "rgba(99,102,241,0.82)" : "transparent"}
              strokeWidth={unlockPulseSeg === 1 ? 4.8 : 3.0}
              strokeLinecap="round"
              style={{
                filter: segUnlocked[1] ? "drop-shadow(0 10px 18px rgba(99,102,241,0.45))" : "none",
                transition: "stroke-width 220ms ease",
              }}
            />
            <path
              d="M78 10 C 66 18, 60 24, 52 30"
              fill="none"
              stroke={segUnlocked[1] ? "rgba(34,197,94,0.70)" : "transparent"}
              strokeWidth={unlockPulseSeg === 1 ? 2.4 : 1.3}
              strokeDasharray="2.4 3.6"
              strokeLinecap="round"
              style={{ transition: "stroke-width 220ms ease" }}
            />

            {/* seg 2 */}
            <path
              d="M52 30 S 34 44, 22 52"
              fill="none"
              stroke={segUnlocked[2] ? "rgba(99,102,241,0.82)" : "transparent"}
              strokeWidth={unlockPulseSeg === 2 ? 4.8 : 3.0}
              strokeLinecap="round"
              style={{
                filter: segUnlocked[2] ? "drop-shadow(0 10px 18px rgba(99,102,241,0.45))" : "none",
                transition: "stroke-width 220ms ease",
              }}
            />
            <path
              d="M52 30 S 34 44, 22 52"
              fill="none"
              stroke={segUnlocked[2] ? "rgba(34,197,94,0.70)" : "transparent"}
              strokeWidth={unlockPulseSeg === 2 ? 2.4 : 1.3}
              strokeDasharray="2.4 3.6"
              strokeLinecap="round"
              style={{ transition: "stroke-width 220ms ease" }}
            />

            {/* seg 3 */}
            <path
              d="M22 52 S 46 66, 62 74"
              fill="none"
              stroke={segUnlocked[3] ? "rgba(99,102,241,0.82)" : "transparent"}
              strokeWidth={unlockPulseSeg === 3 ? 4.8 : 3.0}
              strokeLinecap="round"
              style={{
                filter: segUnlocked[3] ? "drop-shadow(0 10px 18px rgba(99,102,241,0.45))" : "none",
                transition: "stroke-width 220ms ease",
              }}
            />
            <path
              d="M22 52 S 46 66, 62 74"
              fill="none"
              stroke={segUnlocked[3] ? "rgba(34,197,94,0.70)" : "transparent"}
              strokeWidth={unlockPulseSeg === 3 ? 2.4 : 1.3}
              strokeDasharray="2.4 3.6"
              strokeLinecap="round"
              style={{ transition: "stroke-width 220ms ease" }}
            />

            {/* seg 4 */}
            <path
              d="M62 74 S 44 86, 28 92"
              fill="none"
              stroke={segUnlocked[4] ? "rgba(99,102,241,0.82)" : "transparent"}
              strokeWidth={unlockPulseSeg === 4 ? 4.8 : 3.0}
              strokeLinecap="round"
              style={{
                filter: segUnlocked[4] ? "drop-shadow(0 10px 18px rgba(99,102,241,0.45))" : "none",
                transition: "stroke-width 220ms ease",
              }}
            />
            <path
              d="M62 74 S 44 86, 28 92"
              fill="none"
              stroke={segUnlocked[4] ? "rgba(34,197,94,0.70)" : "transparent"}
              strokeWidth={unlockPulseSeg === 4 ? 2.4 : 1.3}
              strokeDasharray="2.4 3.6"
              strokeLinecap="round"
              style={{ transition: "stroke-width 220ms ease" }}
            />
          </svg>

          {levels.map((lvl) => {
            const isSelected = selected === lvl.id;
            const isLocked = lvl.id > unlockedLevel;

            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => tryOpenLevel(lvl.id)}
                style={{
                  ...styles.levelBtn,
                  left: `${lvl.x}%`,
                  top: `${lvl.y}%`,
                  transform: "translate(-50%, -50%)",
                  ...(isSelected ? styles.levelBtnActive : {}),
                  ...(isLocked ? styles.levelBtnLocked : {}),
                }}
                aria-label={lvl.label}
                title={isLocked ? `Locked — open level ${unlockedLevel} first` : lvl.label}
              >
                <div style={{ ...styles.levelIcon, ...(isLocked ? styles.iconLocked : {}) }}>{lvl.icon}</div>
                <div style={{ ...styles.levelText, ...(isLocked ? styles.textLocked : {}) }}>{lvl.id}</div>
                <div style={{ ...styles.stars, ...(isLocked ? styles.starsLocked : {}) }}>
                  <span style={styles.star}>★</span>
                  <span style={styles.star}>★</span>
                  <span style={styles.star}>★</span>
                </div>
                {isLocked ? <div style={styles.lockBadge}>🔒</div> : null}
              </button>
            );
          })}

          <div style={styles.bottomHint}>
            <span style={styles.hintPill}>Tip</span>
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
    background:
      "radial-gradient(1200px 600px at 20% 0%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(34,197,94,0.14), transparent 55%), #0b1020",
    color: "#e8eefc",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
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
  },

  rightBtns: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  settingsBtn: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e8eefc",
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 900,
  },

  logoutBtn: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e8eefc",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 900,
  },

  mapWrap: {
    flex: 1,
    padding: 20,
    maxWidth: 980,
    width: "100%",
    margin: "0 auto",
  },

  mapCard: {
    position: "relative",
    width: "100%",
    height: 1250,
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },

  blob: {
    position: "absolute",
    borderRadius: 999,
    filter: "blur(16px)",
    opacity: 0.75,
  },
  blob1: {
    width: 300,
    height: 300,
    left: -80,
    top: -80,
    background: "rgba(99,102,241,0.28)",
  },
  blob2: {
    width: 360,
    height: 360,
    right: -110,
    bottom: -110,
    background: "rgba(34,197,94,0.22)",
  },

  pathSvg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  },

  levelBtn: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 26,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
    color: "#e8eefc",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 18px 36px rgba(0,0,0,0.30)",
    transition: "transform 140ms ease, box-shadow 140ms ease, border 140ms ease, opacity 140ms ease",
  },

  levelBtnActive: {
    transform: "translate(-50%, -50%) scale(1.06)",
    border: "1px solid rgba(99,102,241,0.55)",
    boxShadow: "0 22px 50px rgba(0,0,0,0.40)",
  },

  levelBtnLocked: {
    opacity: 0.52,
    cursor: "not-allowed",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
  },

  lockBadge: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 14,
    opacity: 0.95,
    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.35))",
  },

  levelIcon: {
    position: "absolute",
    top: 14,
    fontSize: 22,
    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.35))",
  },
  iconLocked: { filter: "grayscale(1) drop-shadow(0 10px 20px rgba(0,0,0,0.35))" },

  levelText: {
    fontSize: 26,
    fontWeight: 1000,
    letterSpacing: 0.2,
    paddingTop: 10,
  },
  textLocked: { opacity: 0.85 },

  stars: {
    position: "absolute",
    bottom: 10,
    display: "flex",
    gap: 4,
    opacity: 0.9,
  },
  starsLocked: { opacity: 0.45 },
  star: {
    fontSize: 12,
    color: "rgba(255, 215, 90, 0.95)",
    textShadow: "0 10px 22px rgba(0,0,0,0.35)",
  },

  bottomHint: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    padding: "10px 12px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.18)",
    fontSize: 12,
    opacity: 0.95,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  hintPill: {
    fontSize: 11,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(34,197,94,0.14)",
    border: "1px solid rgba(34,197,94,0.35)",
  },
};
