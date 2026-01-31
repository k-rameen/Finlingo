import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// homepage: grid "level select" (15 boxes), same dark theme
// - only levels 1..5 are real (navigate to /level/1..5)
// - levels unlock in order (1 -> 2 -> 3 -> 4 -> 5)
// - finishing a level sets localStorage.finlingo_last_completed_level = "<n>"
// - when you come back to /home, it unlocks the next level

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [toast, setToast] = useState("Tap level 1 to start — complete them in order.");

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
        setToast("Tap the next unlocked level to continue.");
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
        showToast(`Unlocked level ${nextUnlocked}!`);
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
      showToast("These levels are coming soon 😼");
      return;
    }

    if (levelId > unlockedLevel) {
      showToast(`Open level ${unlockedLevel} to unlock this level.`);
      return;
    }

    setSelected(levelId);
    showToast(`Loading level ${levelId}...`, 900);

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
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.centerTitle}>HOMEPAGE</div>

        <div style={styles.rightBtns}>
          <button type="button" style={styles.settingsBtn} onClick={() => navigate("/settings")}>
            ⚙️
          </button>
          <button type="button" style={styles.logoutBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={{ ...styles.blob, ...styles.blob1 }} />
          <div style={{ ...styles.blob, ...styles.blob2 }} />

          <div style={styles.header}>
            <div style={styles.bigTitle}>Select Level</div>
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
                        ★
                      </span>
                    ))}
                  </div>

                  {/* center content */}
                  <div style={styles.tileCenter}>
                    <div style={styles.tileNumber}>{lvl.id}</div>

                    {/* lock overlay for locked playable levels */}
                    {isLocked ? <div style={styles.lockIcon}>🔒</div> : null}

                    {/* coming soon label for 6..15 */}
                    {!isPlayable ? <div style={styles.soonTag}>SOON</div> : null}
                  </div>
                </button>
              );
            })}
          </div>

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
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    padding: 18,
  },

  blob: {
    position: "absolute",
    borderRadius: 999,
    filter: "blur(16px)",
    opacity: 0.75,
    pointerEvents: "none",
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
    textShadow: "0 18px 40px rgba(0,0,0,0.35)",
  },
  smallSub: {
    marginTop: 8,
    fontSize: 13,
    opacity: 0.78,
  },

  grid: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 14,
    padding: "10px 6px 18px",
  },

  tile: {
    position: "relative",
    height: 110,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
    boxShadow: "0 18px 36px rgba(0,0,0,0.30)",
    cursor: "pointer",
    color: "#e8eefc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    transition: "transform 140ms ease, box-shadow 140ms ease, border 140ms ease, opacity 140ms ease",
  },

  tileSelected: {
    transform: "translateY(-2px) scale(1.02)",
    border: "1px solid rgba(99,102,241,0.55)",
    boxShadow: "0 22px 50px rgba(0,0,0,0.40)",
  },

  tileLocked: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  tileSoon: {
    opacity: 0.65,
  },

  starRow: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
  },
  star: {
    fontSize: 18,
    color: "rgba(255, 215, 90, 0.98)",
    textShadow: "0 10px 22px rgba(0,0,0,0.35)",
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
    fontSize: 38,
    fontWeight: 1000,
    letterSpacing: 0.4,
  },

  lockIcon: {
    position: "absolute",
    right: 10,
    bottom: 8,
    fontSize: 18,
    opacity: 0.95,
    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.35))",
  },

  soonTag: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 11,
    fontWeight: 1000,
    letterSpacing: 1.2,
    opacity: 0.85,
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.20)",
  },

  bottomHint: {
    position: "relative",
    marginTop: 6,
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
