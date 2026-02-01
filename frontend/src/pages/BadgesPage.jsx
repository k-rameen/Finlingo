import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BadgesPage() {
  const navigate = useNavigate();

  // Read user preferences for theme
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

  const userPrefs = readUserPrefs();
  const isEnchantedTheme = userPrefs.theme === "enchanted";

  // Badge data structure
  const [badges, setBadges] = useState([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(0);

  // All possible badges
  const allBadges = [
    {
      id: "level1",
      title: "💰 Piggy Bank Pro",
      emoji: "🐷",
      description: "Complete Level 1: Saving Basics",
      requirement: "Finish Level 1",
      color: "#FFD700",
      level: 1,
    },
    {
      id: "level2",
      title: "🛒 Smart Shopper",
      emoji: "🛍️",
      description: "Complete Level 2: Needs vs Wants",
      requirement: "Finish Level 2",
      color: "#4CAF50",
      level: 2,
    },
    {
      id: "level3",
      title: "🎯 Budget Boss",
      emoji: "📊",
      description: "Complete Level 3: Budget Planning",
      requirement: "Finish Level 3",
      color: "#2196F3",
      level: 3,
    },
    {
      id: "level4",
      title: "💳 Credit Card Captain",
      emoji: "💳",
      description: "Complete Level 4: Credit Card Basics",
      requirement: "Finish Level 4",
      color: "#9C27B0",
      level: 4,
    },
    {
      id: "level5",
      title: "🛡️ Emergency Expert",
      emoji: "🛡️",
      description: "Complete Level 5: Emergency Fund",
      requirement: "Finish Level 5",
      color: "#FF6B6B",
      level: 5,
    },
    {
      id: "perfect1",
      title: "⭐ Gold Star Saver",
      emoji: "⭐",
      description: "Get 3 stars in Level 1",
      requirement: "Perfect score in Level 1",
      color: "#FF9800",
      level: 1,
      special: true,
    },
    {
      id: "perfect5",
      title: "🏆 Emergency Master",
      emoji: "🏆",
      description: "Get 3 stars in Level 5",
      requirement: "Perfect score in Level 5",
      color: "#00BCD4",
      level: 5,
      special: true,
    },
    {
      id: "coins100",
      title: "💰 Coin Collector",
      emoji: "🪙",
      description: "Collect 100+ coins total",
      requirement: "100 coins earned",
      color: "#FFD700",
      special: true,
    },
    {
      id: "alllevels",
      title: "👑 Finlingo Master",
      emoji: "👑",
      description: "Complete all 5 levels",
      requirement: "Finish all levels",
      color: "#FF4081",
      special: true,
    },
  ];

  // Load user progress
  useEffect(() => {
    // Get completed levels from localStorage
    const lastUnlocked = parseInt(
      localStorage.getItem("finlingo_unlocked_level") || "1"
    );
    const completed = lastUnlocked - 1; // Assuming you start at level 1
    setCompletedLevels(Math.min(completed, 5));

    // Get level stars
    const levelStars = JSON.parse(
      localStorage.getItem("finlingo_level_stars") || "{}"
    );

    // Get total coins
    const coins = parseInt(localStorage.getItem("finlingo_total_coins") || "0");
    setTotalCoins(coins);

    // Determine which badges are earned
    const earnedBadges = allBadges.filter((badge) => {
      if (badge.id.startsWith("level")) {
        return completedLevels >= badge.level;
      }

      if (badge.id === "perfect1") {
        return levelStars["1"] === 3;
      }

      if (badge.id === "perfect5") {
        return levelStars["5"] === 3;
      }

      if (badge.id === "coins100") {
        return coins >= 100;
      }

      if (badge.id === "alllevels") {
        return completedLevels >= 5;
      }

      return false;
    });

    setBadges(earnedBadges);
  }, [completedLevels]);

  const earnedCount = badges.length;
  const totalBadges = allBadges.length;
  const progress = Math.round((earnedCount / totalBadges) * 100);

  // Styles matching HOME page theme (only colors/backgrounds/borders/shadows updated)
  const styles = {
    page: {
      minHeight: "100vh",
      background: isEnchantedTheme
        ? "linear-gradient(135deg, #FF9FF3 0%, #A8D8EA 50%, #C9E4CA 100%)"
        : "linear-gradient(135deg, #FFD1DC 0%, #A8D8EA 50%, #C9E4CA 100%)",
      color: "#2C3E50",
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
      color: "#2C3E50",
    },

    backButton: {
      borderRadius: 16,
      border: "2px solid #A8D8EA",
      background: "rgba(255, 255, 255, 0.9)",
      color: "#2C3E50",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    wrap: {
      flex: 1,
      padding: "20px",
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
      padding: "24px",
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
      padding: "8px 6px 20px",
      textAlign: "center",
    },

    bigTitle: {
      fontSize: 40,
      fontWeight: 1000,
      letterSpacing: 0.4,
      lineHeight: 1.05,
      marginBottom: "8px",
      background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    smallSub: {
      fontSize: 13,
      opacity: 0.85,
      marginBottom: "20px",
      color: "#5D6D7E",
      fontWeight: 600,
    },

    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "30px",
    },

    statCard: {
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "16px",
      border: "2px solid #A8D8EA",
      padding: "20px",
      textAlign: "center",
      backdropFilter: "blur(10px)",
      boxShadow: "0 10px 30px rgba(168, 216, 234, 0.2)",
    },

    statNumber: {
      fontSize: "36px",
      fontWeight: "900",
      marginBottom: "8px",
      background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    statLabel: {
      fontSize: "13px",
      opacity: 0.9,
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#5D6D7E",
      fontWeight: 700,
    },

    progressContainer: {
      marginBottom: "30px",
    },

    progressLabel: {
      fontSize: "14px",
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#2C3E50",
      fontWeight: 700,
    },

    progressBar: {
      height: "10px",
      backgroundColor: "rgba(168, 216, 234, 0.25)",
      borderRadius: "999px",
      overflow: "hidden",
      border: "2px solid #FFD1DC",
    },

    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg, #FFD1DC, #A8D8EA, #C9E4CA)",
      borderRadius: "999px",
      transition: "width 0.8s ease",
      width: `${progress}%`,
    },

    badgesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      gap: "16px",
    },

    badgeCard: {
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "16px",
      border: "2px solid #A8D8EA",
      padding: "20px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "140px",
      transition: "all 0.3s ease",
      position: "relative",
      boxShadow: "0 10px 30px rgba(168, 216, 234, 0.18)",
      color: "#2C3E50",
    },

    badgeLocked: {
      opacity: 0.6,
      filter: "grayscale(60%)",
      background: "rgba(255, 255, 255, 0.75)",
      border: "2px dashed #C9E4CA",
      boxShadow: "none",
    },

    badgeEmoji: {
      fontSize: "36px",
      marginBottom: "12px",
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
    },

    badgeTitle: {
      fontSize: "12px",
      fontWeight: "700",
      marginBottom: "4px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: "#2C3E50",
    },

    badgeDesc: {
      fontSize: "10px",
      opacity: 0.8,
      lineHeight: "1.3",
      color: "#5D6D7E",
      fontWeight: 600,
    },

    lockedIcon: {
      position: "absolute",
      top: "10px",
      right: "10px",
      fontSize: "14px",
      opacity: 0.75,
    },

    specialBadge: {
      border: "3px solid #FFD1DC",
      boxShadow: "0 0 20px rgba(255, 209, 220, 0.35)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255, 209, 220, 0.25))",
    },

    bottomHint: {
      marginTop: "30px",
      padding: "14px 16px",
      borderRadius: 16,
      border: "2px solid #FFD1DC",
      background: "rgba(255, 255, 255, 0.9)",
      fontSize: 14,
      color: "#2C3E50",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      textAlign: "center",
      fontWeight: 600,
    },

    hintPill: {
      fontSize: "12px",
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

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.centerTitle}>BADGES</div>
        <button style={styles.backButton} onClick={() => navigate("/home")}>
          ← Back
        </button>
      </div>

      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={{ ...styles.blob, ...styles.blob1 }} />
          <div style={{ ...styles.blob, ...styles.blob2 }} />

          <div style={styles.header}>
            <div style={styles.bigTitle}>Your Achievements</div>
            <div style={styles.smallSub}>
              Earn badges by completing levels and achieving goals
            </div>
          </div>

          {/* Stats Row */}
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{earnedCount}</div>
              <div style={styles.statLabel}>Badges Earned</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{completedLevels}/5</div>
              <div style={styles.statLabel}>Levels Completed</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{totalCoins}</div>
              <div style={styles.statLabel}>Total Coins</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={styles.progressLabel}>
              <span>Collection Progress</span>
              <span>{progress}%</span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill} />
            </div>
          </div>

          {/* Badges Grid */}
          <div style={styles.badgesGrid}>
            {allBadges.map((badge) => {
              const isEarned = badges.some((b) => b.id === badge.id);
              const isSpecial = badge.special || false;

              return (
                <div
                  key={badge.id}
                  style={{
                    ...styles.badgeCard,
                    ...(isSpecial && isEarned ? styles.specialBadge : {}),
                    ...(!isEarned ? styles.badgeLocked : {}),
                  }}
                  title={isEarned ? badge.description : `Locked: ${badge.requirement}`}
                >
                  {!isEarned && <div style={styles.lockedIcon}>🔒</div>}

                  <div style={styles.badgeEmoji}>{badge.emoji}</div>
                  <div style={styles.badgeTitle}>{badge.title}</div>
                  <div style={styles.badgeDesc}>
                    {isEarned ? badge.description : badge.requirement}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hint Section */}
          <div style={styles.bottomHint}>
            <span style={styles.hintPill}>Tip</span>
            Complete levels perfectly to earn special badges and more coins!
          </div>
        </div>
      </div>
    </div>
  );
}
