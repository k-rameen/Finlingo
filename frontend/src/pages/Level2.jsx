import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Level2() {
  const navigate = useNavigate();

  // Core state
  const [coins, setCoins] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [shakeCoin, setShakeCoin] = useState(false);

  // Completion tracking
  const [sectionCompletion, setSectionCompletion] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  // Reward lock so kids can't farm coins
  const [challengeRewarded, setChallengeRewarded] = useState({
    rateCalc: false,
    payslipMatch: false,
    bonusRules: false,
    dealAnalysis: false,
    paycheckPlan: false,
    allComplete: false,
  });

  // Lesson 1: Pay rate simulator
  const [hoursWorked, setHoursWorked] = useState(3);
  const [rateTier, setRateTier] = useState("standard"); // starter | standard | pro
  const rateCoinsPerHour = useMemo(() => {
    if (rateTier === "starter") return 8;
    if (rateTier === "standard") return 12;
    return 16;
  }, [rateTier]);

  const earnedCoins = useMemo(() => hoursWorked * rateCoinsPerHour, [hoursWorked, rateCoinsPerHour]);

  // Lesson 2: Payslip matching (drag-drop style but simplified: click-to-place)
  const payslipSlots = ["Earned", "Bonus", "Town Share", "Take-home"];
  const payslipPieces = [
    { id: "earned", label: "Earned", hint: "Money before anything is taken out." },
    { id: "bonus", label: "Bonus", hint: "Extra for doing a great job." },
    { id: "town", label: "Town Share", hint: "A small part that helps the community." },
    { id: "takehome", label: "Take-home", hint: "What you actually keep." },
  ];
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [payslipPlaced, setPayslipPlaced] = useState({}); // slot -> pieceId

  // Lesson 3: Bonus rules mini-check (not too easy)
  const [bonusChoice, setBonusChoice] = useState(null);

  // Lesson 4: Deal analysis
  const dealA = { title: "Offer A", hours: 2, pay: 26 }; // 13/hr
  const dealB = { title: "Offer B", hours: 3, pay: 33 }; // 11/hr
  const dealC = { title: "Offer C", hours: 1, pay: 10 }; // 10/hr
  const [chosenDeals, setChosenDeals] = useState({ A: false, B: false, C: false });

  // Lesson 5: Paycheck plan sliders (rule-based; no emergency fund talk)
  const [savePct, setSavePct] = useState(30);
  const [spendPct, setSpendPct] = useState(50);
  const [sharePct, setSharePct] = useState(20);

  // Confetti timer
  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  // Completion bonus when all 5 lessons complete
  useEffect(() => {
    const completedCount = Object.keys(sectionCompletion).length;
    if (completedCount === 5 && !challengeRewarded.allComplete) {
      setShowConfetti(true);
      setCoins((p) => p + 60);
      setChallengeRewarded((p) => ({ ...p, allComplete: true }));
      localStorage.setItem("finlingo_last_completed_level", "2");
    }
  }, [sectionCompletion, challengeRewarded.allComplete]);

  // Helper: safe coin shake
  const rewardCoins = (amount) => {
    setCoins((p) => p + amount);
    setShakeCoin(true);
    setTimeout(() => setShakeCoin(false), 600);
  };

  // Mark section complete
  const markComplete = (key) => {
    if (!sectionCompletion[key]) {
      setSectionCompletion((p) => ({ ...p, [key]: true }));
    }
  };

  // Back
  const handleBackToHome = () => {
    if (Object.keys(sectionCompletion).length === 5) {
      localStorage.setItem("finlingo_last_completed_level", "2");
    }
    navigate("/home");
  };

  // Shared style constants (matching Level 1 vibe)
  const sectionStyles = {
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    minHeight: "450px",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  };

  const numberBadgeStyles = (color) => ({
    width: "40px",
    height: "40px",
    backgroundColor: color,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1.2rem",
    fontWeight: "bold",
    flexShrink: 0,
  });

  const titleStyles = (color) => ({
    color: color,
    fontSize: "1.5rem",
    margin: 0,
    background: `linear-gradient(45deg, ${color}, ${color}dd)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "700",
  });

  const totalLessons = 5;
  const completedLessons = Object.keys(sectionCompletion).length;

  // ------------------------------
  // Lesson 1: Rate * Hours (10+)
  // ------------------------------
  const checkRateQuestion = () => {
    // Question: "You worked X hours at Y coins/hr. Earned?"
    const user = (answers.rateCalc || "").toString().trim();
    const correct = earnedCoins.toString();
    const already = challengeRewarded.rateCalc;

    if (user === correct) {
      setFeedback((p) => ({
        ...p,
        rateCalc: already
          ? "✅ Already completed! Great job!"
          : `🎉 Correct! ${hoursWorked} × ${rateCoinsPerHour} = ${earnedCoins} coins. You earned 18 coins!`,
      }));
      if (!already) {
        rewardCoins(18);
        setChallengeRewarded((p) => ({ ...p, rateCalc: true }));
      }
      markComplete("rateCalc");
      return true;
    }
    setFeedback((p) => ({
      ...p,
      rateCalc: "🤔 Not quite — try multiplying hours × coins per hour.",
    }));
    return false;
  };

  // ------------------------------
  // Lesson 2: Payslip Match
  // ------------------------------
  const placePieceInSlot = (slot) => {
    if (!selectedPiece) return;
    setPayslipPlaced((p) => ({ ...p, [slot]: selectedPiece.id }));
    setSelectedPiece(null);
  };

  const checkPayslip = () => {
    const correctMap = {
      Earned: "earned",
      Bonus: "bonus",
      "Town Share": "town",
      "Take-home": "takehome",
    };

    const allFilled = payslipSlots.every((s) => payslipPlaced[s]);
    if (!allFilled) {
      setFeedback((p) => ({ ...p, payslipMatch: "⚠️ Fill all 4 slots first!" }));
      return false;
    }

    const correct = payslipSlots.every((s) => payslipPlaced[s] === correctMap[s]);
    const already = challengeRewarded.payslipMatch;

    if (correct) {
      setFeedback((p) => ({
        ...p,
        payslipMatch: already
          ? "✅ Already completed! Payslip mastered."
          : "🎉 Perfect payslip! You earned 22 coins!",
      }));
      if (!already) {
        rewardCoins(22);
        setChallengeRewarded((p) => ({ ...p, payslipMatch: true }));
      }
      markComplete("payslipMatch");
      return true;
    }

    setFeedback((p) => ({ ...p, payslipMatch: "🔄 Close! Some labels are swapped — try again." }));
    return false;
  };

  // ------------------------------
  // Lesson 3: Bonus Rules (10+)
  // ------------------------------
  const checkBonusRules = () => {
    // Scenario: choose rule that earns bonus
    // Correct: Consistency + accuracy (not speed-only)
    const already = challengeRewarded.bonusRules;
    if (bonusChoice === "consistency") {
      setFeedback((p) => ({
        ...p,
        bonusRules: already
          ? "✅ Already completed! Great thinking."
          : "🎉 Correct! Bonuses usually reward quality + consistency. You earned 20 coins!",
      }));
      if (!already) {
        rewardCoins(20);
        setChallengeRewarded((p) => ({ ...p, bonusRules: true }));
      }
      markComplete("bonusRules");
      return true;
    }
    setFeedback((p) => ({
      ...p,
      bonusRules: "🤔 Not quite — most bonuses reward reliable good work, not just rushing.",
    }));
    return false;
  };

  // ------------------------------
  // Lesson 4: Deal Analysis (hourly value)
  // ------------------------------
  const toggleDeal = (k) => setChosenDeals((p) => ({ ...p, [k]: !p[k] }));

  const computeRate = (offer) => Math.round((offer.pay / offer.hours) * 10) / 10;

  const checkDealAnalysis = () => {
    // Goal: choose best hourly rate among selected deals
    const selected = Object.entries(chosenDeals)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (selected.length !== 1) {
      setFeedback((p) => ({ ...p, dealAnalysis: "⚠️ Pick exactly ONE offer to lock in!" }));
      return false;
    }

    const rates = {
      A: computeRate(dealA),
      B: computeRate(dealB),
      C: computeRate(dealC),
    };

    // Best is A (13/hr)
    const already = challengeRewarded.dealAnalysis;

    if (selected[0] === "A") {
      setFeedback((p) => ({
        ...p,
        dealAnalysis: already
          ? "✅ Already completed! Offer A is still the best deal."
          : `🎉 Correct! Offer A gives the best rate (${rates.A} coins/hr). You earned 25 coins!`,
      }));
      if (!already) {
        rewardCoins(25);
        setChallengeRewarded((p) => ({ ...p, dealAnalysis: true }));
      }
      markComplete("dealAnalysis");
      return true;
    }

    setFeedback((p) => ({
      ...p,
      dealAnalysis: `🤔 Not quite — compare coins per hour. Offer A is strongest here.`,
    }));
    return false;
  };

  // ------------------------------
  // Lesson 5: Paycheck Plan (constraints)
  // ------------------------------
  const planTotal = savePct + spendPct + sharePct;

  const planStatus = useMemo(() => {
    // Standard difficulty constraints:
    // Save >= 20, Share >= 10, Spend <= 60, Total = 100
    const okTotal = planTotal === 100;
    const okSave = savePct >= 20;
    const okShare = sharePct >= 10;
    const okSpend = spendPct <= 60;

    return { okTotal, okSave, okShare, okSpend, all: okTotal && okSave && okShare && okSpend };
  }, [planTotal, savePct, spendPct, sharePct]);

  const checkPaycheckPlan = () => {
    const already = challengeRewarded.paycheckPlan;

    if (!planStatus.okTotal) {
      setFeedback((p) => ({ ...p, paycheckPlan: "⚠️ Your plan must total exactly 100%." }));
      return false;
    }

    if (!planStatus.okSave) {
      setFeedback((p) => ({ ...p, paycheckPlan: "⚠️ Save should be at least 20% for a strong plan." }));
      return false;
    }

    if (!planStatus.okShare) {
      setFeedback((p) => ({ ...p, paycheckPlan: "⚠️ Share should be at least 10% (helping others/community)." }));
      return false;
    }

    if (!planStatus.okSpend) {
      setFeedback((p) => ({ ...p, paycheckPlan: "⚠️ Spend should be 60% or less for balance." }));
      return false;
    }

    setFeedback((p) => ({
      ...p,
      paycheckPlan: already
        ? "✅ Already completed! Balanced plan secured."
        : "🎉 Perfect paycheck plan! You earned 30 coins!",
    }));

    if (!already) {
      rewardCoins(30);
      setChallengeRewarded((p) => ({ ...p, paycheckPlan: true }));
    }
    markComplete("paycheckPlan");
    return true;
  };

  // Utility: adjust sliders while keeping total 100
  const setPlan = (key, val) => {
    const clamp = (n) => Math.max(0, Math.min(100, n));
    val = clamp(val);

    // Keep things stable: adjust the other two in proportion-ish
    let s = savePct, sp = spendPct, sh = sharePct;

    if (key === "save") s = val;
    if (key === "spend") sp = val;
    if (key === "share") sh = val;

    const total = s + sp + sh;
    if (total === 100) {
      setSavePct(s); setSpendPct(sp); setSharePct(sh);
      return;
    }

    // Adjust spend first (most flexible), then share
    let diff = 100 - total; // positive means need add, negative means need subtract

    // Try to fix by changing spend
    let newSpend = clamp(sp + diff);
    diff = 100 - (s + newSpend + sh);

    // Then adjust share
    let newShare = clamp(sh + diff);
    diff = 100 - (s + newSpend + newShare);

    // If still off, adjust save slightly (rare)
    let newSave = clamp(s + diff);

    // Final normalize (in case clamp caused drift)
    const finalTotal = newSave + newSpend + newShare;
    if (finalTotal !== 100) {
      // tiny correction to spend
      newSpend = clamp(newSpend + (100 - finalTotal));
    }

    setSavePct(newSave);
    setSpendPct(newSpend);
    setSharePct(newShare);
  };

  return (
    <div
      style={{
        fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
        backgroundColor: "#f0f7ff",
        color: "#2a0066",
        padding: "20px",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255, 200, 239, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(200, 219, 255, 0.4) 0%, transparent 50%)
        `,
      }}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          75% { transform: translateX(5px) rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .floating { animation: float 4s ease-in-out infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .slide-in { animation: slideIn 0.5s ease-out forwards; }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: 0;
          opacity: 0;
          z-index: 9999;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {showConfetti && (
        <>
          {[...Array(55)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}vw`,
                backgroundColor: ["#8b5cf6", "#6d28d9", "#4f46e5", "#ff4081", "#2196f3"][
                  Math.floor(Math.random() * 5)
                ],
                animation: `confetti-fall ${1 + Math.random() * 2.2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                width: `${8 + Math.random() * 12}px`,
                height: `${8 + Math.random() * 12}px`,
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
              }}
            />
          ))}
        </>
      )}

      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "0 10px",
        }}
      >
        <button
          onClick={handleBackToHome}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6a00ff",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Header */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "30px",
          padding: "25px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(106, 0, 255, 0.1)",
          border: "3px solid #6a00ff",
          maxWidth: "1100px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            marginBottom: "10px",
            textShadow: "2px 2px 0 rgba(139, 92, 246, 0.2)",
            background: "linear-gradient(45deg, #4f46e5, #8b5cf6, #6d28d9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "900",
            letterSpacing: "0.5px",
          }}
        >
          💼✨ Paycheck Quest: Level 2 ✨💰
        </h1>
        <p style={{ margin: "0 auto 18px auto", maxWidth: "780px", color: "#4b2a85", fontSize: "1.05rem" }}>
          This level is for 10+ — you’ll learn how paychecks *really* work: pay rates, hours, bonuses,
          a real paycheck slip, and how to build a smart paycheck plan (no investing/credit/emergencies here).
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >
          {/* Coins */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "18px",
              backgroundColor: "#fff8e1",
              borderRadius: "18px",
              border: "2px dashed #ffc107",
              boxShadow: "0 4px 12px rgba(255, 193, 7, 0.2)",
              minWidth: "240px",
            }}
          >
            <span
              className="floating"
              style={{
                fontSize: "35px",
                animation: shakeCoin ? "shake 0.5s ease-in-out" : "none",
                display: "inline-block",
              }}
            >
              💰
            </span>
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#ff6b00", fontSize: "1.1rem" }}>
                Your Pay Jar
              </h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff6b00", margin: 0 }}>
                {coins} <span style={{ fontSize: "1.3rem", color: "#ff9800" }}>coins</span>
              </p>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                ${(coins / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div
            style={{
              padding: "15px 20px",
              backgroundColor: "#e8f5e9",
              borderRadius: "18px",
              border: "2px solid #4caf50",
              minWidth: "240px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#2e7d32", fontSize: "1.1rem" }}>
              Progress
            </h3>
            <div
              style={{
                width: "100%",
                height: "12px",
                backgroundColor: "#c8e6c9",
                borderRadius: "6px",
                overflow: "hidden",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: `${(completedLessons / totalLessons) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                  transition: "width 0.5s ease",
                  borderRadius: "6px",
                }}
              />
            </div>
            <p style={{ margin: "5px 0 0 0", color: "#388e3c", fontSize: "0.9rem" }}>
              {completedLessons} of {totalLessons} lessons complete
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "25px",
        }}
      >
        {/* Lesson 1 */}
        <section
          style={{
            ...sectionStyles,
            backgroundColor: "rgba(255, 240, 247, 0.95)",
            border: "3px solid #ff4081",
            animation: "slideIn 0.6s ease-out",
          }}
        >
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#ff4081")}>1</div>
            <h2 style={titleStyles("#ff4081")}>Pay Rate × Hours = Earned</h2>
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "18px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: 1,
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #ffb6c1",
                minWidth: "240px",
              }}
            >
              <h3 style={{ color: "#e91e63", marginTop: 0, fontSize: "1.1rem" }}>💡 Core Idea</h3>
              <p style={{ margin: 0, lineHeight: 1.55, fontSize: "1rem" }}>
                A paycheck depends on <b style={{ color: "#ff4081" }}>how long</b> you work and your{" "}
                <b style={{ color: "#ff4081" }}>pay rate</b>.
                <br />
                <span style={{ color: "#666" }}>Standard mode: you’ll calculate your earnings.</span>
              </p>
            </div>

            <div
              style={{
                flex: 1,
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #ffb6c1",
                minWidth: "240px",
              }}
            >
              <h3 style={{ color: "#e91e63", marginTop: 0, fontSize: "1.1rem" }}>🎮 Simulator</h3>

              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <p style={{ margin: "0 0 6px 0", fontWeight: "bold", color: "#d81b60" }}>
                    Pick a rate tier:
                  </p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[
                      { id: "starter", label: "Starter (8/hr)" },
                      { id: "standard", label: "Standard (12/hr)" },
                      { id: "pro", label: "Pro (16/hr)" },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setRateTier(r.id)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: `2px solid ${rateTier === r.id ? "#ff4081" : "#ffd1e1"}`,
                          backgroundColor: rateTier === r.id ? "#ff4081" : "white",
                          color: rateTier === r.id ? "white" : "#d81b60",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ margin: "0 0 6px 0", fontWeight: "bold", color: "#d81b60" }}>
                    Hours worked: <span style={{ color: "#ff4081" }}>{hoursWorked}</span>
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(parseInt(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                    Rate: <b>{rateCoinsPerHour} coins/hr</b> → Earned preview:{" "}
                    <b style={{ color: "#ff4081" }}>{earnedCoins} coins</b>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "18px",
              backgroundColor: "rgba(255, 64, 129, 0.1)",
              borderRadius: "12px",
              textAlign: "center",
              marginTop: "auto",
            }}
          >
            <h3 style={{ color: "#d81b60", marginTop: 0, marginBottom: "10px", fontSize: "1.1rem" }}>
              Quick Check (10+)
            </h3>
            <p style={{ margin: "0 0 12px 0" }}>
              You worked <b>{hoursWorked}</b> hours at <b>{rateCoinsPerHour}</b> coins/hr.
              <br />
              <b>How many coins did you earn?</b>
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <input
                value={answers.rateCalc || ""}
                onChange={(e) => setAnswers((p) => ({ ...p, rateCalc: e.target.value }))}
                placeholder="Type the number"
                style={{
                  padding: "10px 15px",
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  border: "2px solid #ff4081",
                  width: "220px",
                  textAlign: "center",
                }}
                readOnly={challengeRewarded.rateCalc}
              />
              <button
                onClick={checkRateQuestion}
                style={{
                  padding: "10px 20px",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  backgroundColor: challengeRewarded.rateCalc ? "#9e9e9e" : "#ff4081",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: challengeRewarded.rateCalc ? "default" : "pointer",
                  opacity: challengeRewarded.rateCalc ? 0.7 : 1,
                }}
              >
                {challengeRewarded.rateCalc ? "✅ Completed" : "Check 🎯"}
              </button>
            </div>

            {feedback.rateCalc && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px",
                  backgroundColor: feedback.rateCalc.includes("🎉")
                    ? "#e8f5e9"
                    : feedback.rateCalc.includes("✅")
                    ? "#e3f2fd"
                    : "#fff3e0",
                  borderRadius: "8px",
                  border: feedback.rateCalc.includes("🎉")
                    ? "1px solid #4caf50"
                    : feedback.rateCalc.includes("✅")
                    ? "1px solid #2196f3"
                    : "1px solid #ff9800",
                  fontWeight: "bold",
                }}
              >
                {feedback.rateCalc}
              </div>
            )}
          </div>
        </section>

        {/* Lesson 2 */}
        <section
          style={{
            ...sectionStyles,
            backgroundColor: "rgba(224, 242, 254, 0.95)",
            border: "3px solid #2196f3",
            animation: "slideIn 0.6s ease-out 0.2s backwards",
          }}
        >
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#2196f3")}>2</div>
            <h2 style={titleStyles("#2196f3")}>Read a Paycheck Slip</h2>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "1px solid #bbdefb",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ color: "#1976d2", marginTop: 0, fontSize: "1.05rem" }}>What you’ll learn</h3>
              <p style={{ margin: 0, color: "#444", lineHeight: 1.6 }}>
                A paycheck isn’t just “money.” It has parts:
                <br />• <b>Earned</b> (total)
                <br />• <b>Bonus</b> (extra for great work)
                <br />• <b>Town Share</b> (a small part to help the community)
                <br />• <b>Take-home</b> (what you keep)
              </p>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <div
                style={{
                  padding: "14px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "12px",
                  border: "2px dashed #2196f3",
                }}
              >
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#1565c0" }}>
                  Step 1: Tap a label piece
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {payslipPieces.map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => setSelectedPiece(piece)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: `2px solid ${selectedPiece?.id === piece.id ? "#6a00ff" : "#90caf9"}`,
                        backgroundColor: selectedPiece?.id === piece.id ? "#6a00ff" : "white",
                        color: selectedPiece?.id === piece.id ? "white" : "#0d47a1",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      disabled={challengeRewarded.payslipMatch}
                      title={piece.hint}
                    >
                      {piece.label}
                    </button>
                  ))}
                </div>
                <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#0d47a1" }}>
                  {selectedPiece ? `Selected: ${selectedPiece.label} → ${selectedPiece.hint}` : "Tip: hover/tap to see hints."}
                </p>
              </div>

              <div
                style={{
                  padding: "14px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "2px solid #bbdefb",
                }}
              >
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#1565c0" }}>
                  Step 2: Place the labels into the payslip
                </p>

                <div
                  style={{
                    borderRadius: "14px",
                    border: "2px solid #2196f3",
                    overflow: "hidden",
                    backgroundColor: "#f7fbff",
                  }}
                >
                  <div style={{ padding: "14px", backgroundColor: "#2196f3", color: "white", fontWeight: "900" }}>
                    PAYCHECK SLIP (Demo)
                  </div>

                  {payslipSlots.map((slot) => {
                    const placedId = payslipPlaced[slot];
                    const placedLabel = payslipPieces.find((x) => x.id === placedId)?.label;
                    return (
                      <div
                        key={slot}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 14px",
                          borderTop: "1px solid #e3f2fd",
                        }}
                      >
                        <div style={{ fontWeight: "bold", color: "#0d47a1" }}>{slot}</div>
                        <button
                          onClick={() => placePieceInSlot(slot)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "10px",
                            border: placedLabel ? "2px solid #4caf50" : "2px dashed #90caf9",
                            backgroundColor: placedLabel ? "#e8f5e9" : "white",
                            color: placedLabel ? "#2e7d32" : "#1565c0",
                            fontWeight: "bold",
                            cursor: challengeRewarded.payslipMatch ? "default" : "pointer",
                            minWidth: "170px",
                            textAlign: "center",
                          }}
                          disabled={challengeRewarded.payslipMatch}
                          title={challengeRewarded.payslipMatch ? "Completed" : "Tap to place selected piece"}
                        >
                          {placedLabel ? `✅ ${placedLabel}` : "Tap to place"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "14px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setPayslipPlaced({})}
                    style={{
                      padding: "10px 18px",
                      backgroundColor: "#e3f2fd",
                      color: "#1565c0",
                      border: "2px solid #90caf9",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: challengeRewarded.payslipMatch ? "not-allowed" : "pointer",
                      opacity: challengeRewarded.payslipMatch ? 0.6 : 1,
                    }}
                    disabled={challengeRewarded.payslipMatch}
                  >
                    🔄 Reset
                  </button>

                  <button
                    onClick={checkPayslip}
                    style={{
                      padding: "10px 18px",
                      backgroundColor: challengeRewarded.payslipMatch ? "#9e9e9e" : "#2196f3",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: challengeRewarded.payslipMatch ? "default" : "pointer",
                      opacity: challengeRewarded.payslipMatch ? 0.7 : 1,
                    }}
                  >
                    {challengeRewarded.payslipMatch ? "✅ Completed" : "Check Payslip 🎯"}
                  </button>
                </div>

                {feedback.payslipMatch && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "12px",
                      backgroundColor: feedback.payslipMatch.includes("🎉")
                        ? "#e8f5e9"
                        : feedback.payslipMatch.includes("✅")
                        ? "#e3f2fd"
                        : "#fff3e0",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      textAlign: "center",
                      border: feedback.payslipMatch.includes("🎉")
                        ? "1px solid #4caf50"
                        : feedback.payslipMatch.includes("✅")
                        ? "1px solid #2196f3"
                        : "1px solid #ff9800",
                    }}
                  >
                    {feedback.payslipMatch}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Lesson 3 */}
        <section
          style={{
            ...sectionStyles,
            backgroundColor: "rgba(243, 229, 245, 0.95)",
            border: "3px solid #9c27b0",
            animation: "slideIn 0.6s ease-out 0.4s backwards",
            gridColumn: "span 2",
            minHeight: "520px",
          }}
        >
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#9c27b0")}>3</div>
            <h2 style={titleStyles("#9c27b0")}>Bonus Logic (Standard)</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "18px", flex: 1 }}>
            <div
              style={{
                padding: "18px",
                borderRadius: "14px",
                backgroundColor: "white",
                border: "2px solid #e1bee7",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#7b1fa2" }}>Scenario</h3>
              <p style={{ margin: 0, lineHeight: 1.65, color: "#444" }}>
                You did 3 mini-tasks at work.
                <br />
                <b>Task scores:</b> 9/10, 10/10, 9/10
                <br />
                <b>Boss says:</b> “Bonuses go to people who are <b>reliable</b> and <b>careful</b>.”
                <br /><br />
                Which choice is most likely to earn a bonus?
              </p>

              <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
                <button
                  onClick={() => setBonusChoice("speed")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: `2px solid ${bonusChoice === "speed" ? "#6a00ff" : "#e1bee7"}`,
                    backgroundColor: bonusChoice === "speed" ? "#6a00ff" : "white",
                    color: bonusChoice === "speed" ? "white" : "#6a1b9a",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  disabled={challengeRewarded.bonusRules}
                >
                  ⚡ Work super fast even if you make mistakes
                </button>

                <button
                  onClick={() => setBonusChoice("consistency")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: `2px solid ${bonusChoice === "consistency" ? "#6a00ff" : "#e1bee7"}`,
                    backgroundColor: bonusChoice === "consistency" ? "#6a00ff" : "white",
                    color: bonusChoice === "consistency" ? "white" : "#6a1b9a",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  disabled={challengeRewarded.bonusRules}
                >
                  🎯 Be accurate + consistent (steady strong work)
                </button>

                <button
                  onClick={() => setBonusChoice("random")}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: `2px solid ${bonusChoice === "random" ? "#6a00ff" : "#e1bee7"}`,
                    backgroundColor: bonusChoice === "random" ? "#6a00ff" : "white",
                    color: bonusChoice === "random" ? "white" : "#6a1b9a",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  disabled={challengeRewarded.bonusRules}
                >
                  🎲 Pick random tasks and hope for luck
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginTop: "14px" }}>
                <button
                  onClick={checkBonusRules}
                  style={{
                    padding: "12px 22px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: challengeRewarded.bonusRules ? "#9e9e9e" : "#9c27b0",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: challengeRewarded.bonusRules ? "default" : "pointer",
                    opacity: challengeRewarded.bonusRules ? 0.7 : 1,
                  }}
                >
                  {challengeRewarded.bonusRules ? "✅ Completed" : "Check Bonus 🎯"}
                </button>
              </div>

              {feedback.bonusRules && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "12px",
                    backgroundColor: feedback.bonusRules.includes("🎉")
                      ? "#e8f5e9"
                      : feedback.bonusRules.includes("✅")
                      ? "#e3f2fd"
                      : "#fff3e0",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {feedback.bonusRules}
                </div>
              )}
            </div>

            <div
              style={{
                padding: "18px",
                borderRadius: "14px",
                backgroundColor: "rgba(156, 39, 176, 0.08)",
                border: "2px dashed #9c27b0",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#7b1fa2" }}>Teaching Moment</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#4a148c" }}>
                Bonuses are like a “thank you reward” from work.
                <br /><br />
                <b>Most bonuses are NOT</b> for rushing.
                <br />
                They reward things like:
                <br />✅ careful work
                <br />✅ consistency
                <br />✅ finishing tasks properly
              </p>

              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e1bee7",
                }}
              >
                <p style={{ margin: 0, color: "#6a1b9a", fontWeight: "bold" }}>
                  Pro tip: “Bonus” is extra pay on top of your earned pay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lesson 4 */}
        <section
          style={{
            ...sectionStyles,
            backgroundColor: "rgba(255, 248, 225, 0.95)",
            border: "3px solid #ff9800",
            animation: "slideIn 0.6s ease-out 0.6s backwards",
            gridColumn: "span 2",
            minHeight: "540px",
          }}
        >
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#ff9800")}>4</div>
            <h2 style={titleStyles("#ff9800")}>Deal Analyzer (Coins per Hour)</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", flex: 1 }}>
            {[
              { key: "A", offer: dealA, color: "#ff4081" },
              { key: "B", offer: dealB, color: "#2196f3" },
              { key: "C", offer: dealC, color: "#9c27b0" },
            ].map(({ key, offer, color }) => {
              const rate = computeRate(offer);
              const selected = chosenDeals[key];
              return (
                <div
                  key={key}
                  style={{
                    padding: "16px",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    border: `3px solid ${selected ? color : "#ffd180"}`,
                    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ margin: 0, color, fontSize: "1.15rem" }}>
                      {offer.title}
                    </h3>
                    <span style={{ fontSize: "1.3rem" }}>🧩</span>
                  </div>

                  <div style={{ marginTop: "10px", color: "#444" }}>
                    <p style={{ margin: "6px 0" }}>
                      ⏱️ Time: <b>{offer.hours} hours</b>
                    </p>
                    <p style={{ margin: "6px 0" }}>
                      💰 Pay: <b>{offer.pay} coins</b>
                    </p>
                    <p style={{ margin: "10px 0 0 0", padding: "10px", borderRadius: "12px", backgroundColor: "#fff3e0" }}>
                      ⚖️ Rate: <b>{rate} coins/hr</b>
                    </p>
                    <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                      Your goal: pick the <b>best coins per hour</b> offer.
                    </p>
                  </div>

                  <button
                    onClick={() => toggleDeal(key)}
                    style={{
                      marginTop: "auto",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: selected ? color : "#ff9800",
                      color: "white",
                      fontWeight: "bold",
                      cursor: challengeRewarded.dealAnalysis ? "default" : "pointer",
                      opacity: challengeRewarded.dealAnalysis ? 0.7 : 1,
                    }}
                    disabled={challengeRewarded.dealAnalysis}
                  >
                    {selected ? "✅ Selected" : "Select this offer"}
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "14px", textAlign: "center" }}>
            <button
              onClick={checkDealAnalysis}
              style={{
                padding: "12px 22px",
                fontSize: "1rem",
                fontWeight: "bold",
                backgroundColor: challengeRewarded.dealAnalysis ? "#9e9e9e" : "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: challengeRewarded.dealAnalysis ? "default" : "pointer",
                opacity: challengeRewarded.dealAnalysis ? 0.7 : 1,
              }}
            >
              {challengeRewarded.dealAnalysis ? "✅ Completed" : "Lock In Best Deal 🎯"}
            </button>

            {feedback.dealAnalysis && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: feedback.dealAnalysis.includes("🎉")
                    ? "#e8f5e9"
                    : feedback.dealAnalysis.includes("✅")
                    ? "#e3f2fd"
                    : "#fff3e0",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                {feedback.dealAnalysis}
              </div>
            )}
          </div>
        </section>

        {/* Lesson 5 */}
        <section
          style={{
            ...sectionStyles,
            backgroundColor: "rgba(232, 245, 233, 0.95)",
            border: "3px solid #4caf50",
            animation: "slideIn 0.6s ease-out 0.8s backwards",
            gridColumn: "span 2",
            minHeight: "560px",
          }}
        >
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#4caf50")}>5</div>
            <h2 style={titleStyles("#4caf50")}>Build a Smart Paycheck Plan</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", flex: 1 }}>
            <div
              style={{
                padding: "18px",
                backgroundColor: "white",
                borderRadius: "16px",
                border: "2px solid #c8e6c9",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#2e7d32" }}>Rules (Standard Mode)</h3>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#444" }}>
                Your paycheck plan must follow:
                <br />✅ <b>Save ≥ 20%</b>
                <br />✅ <b>Share ≥ 10%</b>
                <br />✅ <b>Spend ≤ 60%</b>
                <br />✅ Total must equal <b>100%</b>
                <br /><br />
                This is not “budgeting the whole life” — it’s simply what you do with today’s paycheck.
              </p>

              <div
                style={{
                  marginTop: "14px",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor: planStatus.all ? "#e8f5e9" : "#fff3e0",
                  border: `2px solid ${planStatus.all ? "#4caf50" : "#ff9800"}`,
                  fontWeight: "bold",
                  color: planStatus.all ? "#2e7d32" : "#ef6c00",
                }}
              >
                Total: {planTotal}% {planTotal === 100 ? "✅" : "⚠️"}
                <div style={{ fontSize: "0.9rem", fontWeight: 700, marginTop: "6px" }}>
                  Save {savePct}% {planStatus.okSave ? "✅" : "⚠️"} · Spend {spendPct}% {planStatus.okSpend ? "✅" : "⚠️"} · Share{" "}
                  {sharePct}% {planStatus.okShare ? "✅" : "⚠️"}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "18px",
                backgroundColor: "white",
                borderRadius: "16px",
                border: "2px solid #c8e6c9",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#2e7d32" }}>Adjust Your Plan</h3>

              <div style={{ display: "grid", gap: "14px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#2e7d32" }}>
                    <span>🫙 Save</span>
                    <span>{savePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={savePct}
                    onChange={(e) => setPlan("save", parseInt(e.target.value))}
                    style={{ width: "100%" }}
                    disabled={challengeRewarded.paycheckPlan}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#1565c0" }}>
                    <span>🛍️ Spend</span>
                    <span>{spendPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={spendPct}
                    onChange={(e) => setPlan("spend", parseInt(e.target.value))}
                    style={{ width: "100%" }}
                    disabled={challengeRewarded.paycheckPlan}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#d81b60" }}>
                    <span>❤️ Share</span>
                    <span>{sharePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sharePct}
                    onChange={(e) => setPlan("share", parseInt(e.target.value))}
                    style={{ width: "100%" }}
                    disabled={challengeRewarded.paycheckPlan}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => {
                    if (!challengeRewarded.paycheckPlan) {
                      setSavePct(30); setSpendPct(50); setSharePct(20);
                      setFeedback((p) => ({ ...p, paycheckPlan: "🔄 Reset to a balanced starter plan." }));
                    }
                  }}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#e3f2fd",
                    color: "#1565c0",
                    border: "2px solid #90caf9",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: challengeRewarded.paycheckPlan ? "not-allowed" : "pointer",
                    opacity: challengeRewarded.paycheckPlan ? 0.6 : 1,
                  }}
                  disabled={challengeRewarded.paycheckPlan}
                >
                  🔄 Reset
                </button>

                <button
                  onClick={checkPaycheckPlan}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: challengeRewarded.paycheckPlan ? "#9e9e9e" : "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: challengeRewarded.paycheckPlan ? "default" : "pointer",
                    opacity: challengeRewarded.paycheckPlan ? 0.7 : 1,
                  }}
                >
                  {challengeRewarded.paycheckPlan ? "✅ Completed" : "Check Plan 🎯"}
                </button>
              </div>

              {feedback.paycheckPlan && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "12px",
                    backgroundColor: feedback.paycheckPlan.includes("🎉")
                      ? "#e8f5e9"
                      : feedback.paycheckPlan.includes("✅")
                      ? "#e3f2fd"
                      : "#fff3e0",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {feedback.paycheckPlan}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          textAlign: "center",
          border: "2px solid #6a00ff",
          maxWidth: "1100px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h3 style={{ color: "#6a00ff", marginBottom: "12px", fontSize: "1.3rem" }}>
          🎓 Paycheck Master Badge
        </h3>

        <div
          style={{
            padding: "15px",
            backgroundColor: "#fff8e1",
            borderRadius: "15px",
            border: "2px dashed #ffc107",
            marginBottom: "15px",
          }}
        >
          <p style={{ fontSize: "1.1rem", color: "#ff6b00", fontWeight: "bold", margin: "0 0 8px 0" }}>
            {coins >= 130
              ? "🏆 Gold Paycheck Strategist!"
              : coins >= 80
              ? "🥈 Silver Pay Planner!"
              : coins >= 40
              ? "🥉 Bronze Pay Explorer!"
              : "🌟 Keep Going!"}
          </p>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
            You’ve earned <span style={{ color: "#ff6b00", fontWeight: "bold" }}>{coins}</span> coins in Level 2.
          </p>
        </div>

        {completedLessons === totalLessons && (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#e8f5e9",
              borderRadius: "15px",
              border: "3px solid #4caf50",
              marginBottom: "20px",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <h3 style={{ color: "#2e7d32", marginTop: 0, fontSize: "1.5rem" }}>
              🎉 Level 2 Completed! 🎉
            </h3>
            <p style={{ fontSize: "1.1rem", color: "#388e3c", marginBottom: "15px" }}>
              You finished the Paycheck Quest. Level 3 should unlock on the homepage!
            </p>
            <button
              onClick={handleBackToHome}
              style={{
                padding: "15px 30px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "0 auto",
              }}
            >
              🏠 Return to Homepage
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ⬆️ Back to Top
          </button>

          <button
            onClick={handleBackToHome}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6a00ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            🏠 Back to Home
          </button>
        </div>
      </footer>
    </div>
  );
}
