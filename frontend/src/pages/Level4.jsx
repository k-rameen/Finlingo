import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Level4() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [completedLessons, setCompletedLessons] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState({
    lesson1: false,
    lesson2: false,
    lesson3: false,
    lesson4: false
  });
  
  const totalLessons = 4;

  // Check all lessons completion
  useEffect(() => {
    const completedCount = Object.values(lessonsCompleted).filter(Boolean).length;
    setCompletedLessons(completedCount);
    
    if (completedCount === totalLessons) {
      localStorage.setItem("finlingo_last_completed_level", "4");
      localStorage.setItem("finlingo_unlocked_level", "5");
    }
  }, [lessonsCompleted, totalLessons]);

  const handleBackToHome = () => {
    navigate("/home");
  };

  // Lesson 1: Penny Doubling Game
  const [pennyDays, setPennyDays] = useState(10);
  const [pennyChoice, setPennyChoice] = useState("");
  
  const pennyValue = 0.01 * Math.pow(2, pennyDays);

  const checkLesson1 = (choice) => {
    setPennyChoice(choice);
    
    if (choice === "penny") {
      if (!lessonsCompleted.lesson1) {
        setFeedback({ ...feedback, penny: "🎉 Smart! Waiting makes money grow! A tiny penny can become thousands! You earned 25 coins!" });
        setCoins(prev => prev + 25);
        setLessonsCompleted(prev => ({ ...prev, lesson1: true }));
      } else {
        setFeedback({ ...feedback, penny: "✅ Already completed! Great choice!" });
      }
    } else {
      setFeedback({ ...feedback, penny: "🤔 The toy is fun now, but the penny could grow much more over time!" });
    }
  };

  // Lesson 2: Diversification Drag Game - INCREASED COINS
  const boardRef = useRef(null);
  const jarRefs = useRef({
    stocks: null,
    bonds: null,
    cash: null,
  });

  const initialCoins = [
    { id: "c1", label: "gold coin", x: 50, y: 100, placed: null },
    { id: "c2", label: "gold coin", x: 120, y: 100, placed: null },
    { id: "c3", label: "gold coin", x: 190, y: 100, placed: null },
  ];

  const [dragCoins, setDragCoins] = useState(initialCoins);
  const [dragging, setDragging] = useState(null);
  const [dragMessage, setDragMessage] = useState("");

  useEffect(() => {
    function onMove(e) {
      if (!dragging) return;
      const board = boardRef.current;
      if (!board) return;
      const rect = board.getBoundingClientRect();
      const x = e.clientX - rect.left - dragging.dx;
      const y = e.clientY - rect.top - dragging.dy;

      setDragCoins((prev) =>
        prev.map((c) => (c.id === dragging.id ? { ...c, x, y } : c))
      );
    }

    function onUp() {
      if (!dragging) return;

      const board = boardRef.current;
      if (!board) {
        setDragging(null);
        return;
      }

      const coin = dragCoins.find((c) => c.id === dragging.id);
      if (!coin) {
        setDragging(null);
        return;
      }

      const jarHit = getJarHit(dragging.id);
      if (jarHit) {
        const jarEl = jarRefs.current[jarHit];
        const boardRect = board.getBoundingClientRect();
        const jarRect = jarEl.getBoundingClientRect();

        const snapX = jarRect.left - boardRect.left + jarRect.width / 2 - 20;
        const snapY = jarRect.top - boardRect.top + jarRect.height / 2 - 20;

        setDragCoins((prev) =>
          prev.map((c) =>
            c.id === dragging.id
              ? { ...c, x: snapX, y: snapY, placed: jarHit }
              : c
          )
        );
      }

      setDragging(null);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, dragCoins]);

  function getJarHit(coinId) {
    const board = boardRef.current;
    if (!board) return null;

    const coinEl = document.getElementById(`coin-${coinId}`);
    if (!coinEl) return null;

    const coinRect = coinEl.getBoundingClientRect();
    const jars = ["stocks", "bonds", "cash"];
    
    for (const j of jars) {
      const jarEl = jarRefs.current[j];
      if (!jarEl) continue;
      const r = jarEl.getBoundingClientRect();

      const overlap =
        coinRect.right > r.left &&
        coinRect.left < r.right &&
        coinRect.bottom > r.top &&
        coinRect.top < r.bottom;

      if (overlap) return j;
    }
    return null;
  }

  function onCoinPointerDown(e, id) {
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();

    const coin = dragCoins.find((c) => c.id === id);
    if (!coin) return;

    const dx = e.clientX - rect.left - coin.x;
    const dy = e.clientY - rect.top - coin.y;

    setDragging({ id, dx, dy });
  }

  function checkDiversification() {
    const placed = dragCoins.map((c) => c.placed).filter(Boolean);
    if (placed.length < 3) {
      // Old: 30 coins
      setDragMessage("🎉 Perfect! Spreading your money is safer. You earned 30 coins!");
      setCoins(prev => prev + 30);

      // New: 40 coins
      setDragMessage("🎉 Perfect! Spreading your money is safer. You earned 40 coins!");
      setCoins(prev => prev + 40);
      return;
    }

    const counts = placed.reduce((acc, p) => {
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    const unique = Object.keys(counts).length;

    if (unique >= 2) {
      setDragMessage("🎉 Perfect! Spreading your money is safer. You earned 40 coins!"); // Increased from 30
      if (!lessonsCompleted.lesson2) {
        setCoins(prev => prev + 40); // Increased from 30
        setLessonsCompleted(prev => ({ ...prev, lesson2: true }));
      }
    } else {
      setDragMessage("⚠️ All coins in one jar is risky! Try spreading them out.");
    }
  }

  function resetDiversification() {
    setDragMessage("");
    setDragCoins(initialCoins);
  }

  // Lesson 3: Risk vs Reward
  const [riskChoice, setRiskChoice] = useState("");
  
  const checkLesson3 = (choice) => {
    setRiskChoice(choice);
    
    if (choice === "garden") {
      if (!lessonsCompleted.lesson3) {
        setFeedback({ ...feedback, risk: "🎉 Smart! Steady growth is safer for important goals! You earned 25 coins!" });
        setCoins(prev => prev + 25);
        setLessonsCompleted(prev => ({ ...prev, lesson3: true }));
      } else {
        setFeedback({ ...feedback, risk: "✅ Already completed! Wise choice!" });
      }
    } else {
      setFeedback({ ...feedback, risk: "🚀 Rockets can soar high or fall fast! Riskier choices need careful planning!" });
    }
  };

  // Lesson 4: Fixed - Better quiz with multiple choice
  const [goalAmount, setGoalAmount] = useState(100);
  const [weeklySave, setWeeklySave] = useState(5);
  const [weeksNeeded, setWeeksNeeded] = useState("");
  const [goalChoice, setGoalChoice] = useState("");

  const calculateGoal = () => {
    const weeks = Math.ceil(goalAmount / weeklySave);
    setWeeksNeeded(weeks.toString());
    
    if (weeklySave >= 5) {
      if (!lessonsCompleted.lesson4) {
        setFeedback({ ...feedback, goalCalc: `🎯 Great planning! Saving $${weeklySave} weekly gets your $${goalAmount} goal in ${weeks} weeks!` });
      }
    } else {
      setFeedback({ ...feedback, goalCalc: `💡 Try saving more each week to reach your goal faster!` });
    }
  };

  const checkLesson4 = (choice) => {
    setGoalChoice(choice);
    
    if (choice === "save") {
      if (!lessonsCompleted.lesson4) {
        setFeedback({ ...feedback, goalQuiz: "🎉 Correct! Starting early gives your money more time to grow! You earned 30 coins!" });
        setCoins(prev => prev + 30);
        setLessonsCompleted(prev => ({ ...prev, lesson4: true }));
      } else {
        setFeedback({ ...feedback, goalQuiz: "✅ Already completed! Great understanding!" });
      }
    } else if (choice === "wait") {
      setFeedback({ ...feedback, goalQuiz: "🤔 Waiting means less time for your money to grow. Starting early is usually better!" });
    } else if (choice === "spend") {
      setFeedback({ ...feedback, goalQuiz: "💸 Spending now means no money for future goals. Saving helps reach bigger dreams!" });
    }
  };

  // Confetti effect
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (completedLessons === totalLessons) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [completedLessons]);

  return (
    <div style={{ 
      fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif", 
      backgroundColor: "#f8f5ff", 
      color: "#1a0066", 
      padding: "20px",
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden",
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(147, 112, 219, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(123, 104, 238, 0.2) 0%, transparent 50%)
      `,
    }}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #9370db;
          top: 0;
          opacity: 0;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .floating { animation: float 4s ease-in-out infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {showConfetti && [...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}vw`,
            backgroundColor: ['#9370db', '#7b68ee', '#6a5acd', '#483d8b', '#4b0082'][Math.floor(Math.random() * 5)],
            animation: `confetti-fall ${1 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            width: `${8 + Math.random() * 12}px`,
            height: `${8 + Math.random() * 12}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}

      {/* Back Button */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "0 10px",
      }}>
        <button
          onClick={handleBackToHome}
          style={{
            padding: "10px 20px",
            backgroundColor: "#7b68ee",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ← Back to Home
        </button>
      </div>

      <header style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        padding: "25px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        boxShadow: "0 8px 25px rgba(123, 104, 238, 0.1)",
        border: "3px solid #7b68ee",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h1 style={{ 
          fontSize: "2.8rem",
          marginBottom: "15px",
          textShadow: "2px 2px 0 rgba(147, 112, 219, 0.2)",
          background: "linear-gradient(45deg, #9370db, #7b68ee, #6a5acd)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "900",
          letterSpacing: "0.5px",
        }}>
          🌱💰 Investing Adventure 💰🚀
        </h1>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "25px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "18px",
            backgroundColor: "#e6e6fa",
            borderRadius: "18px",
            border: "2px dashed #9370db",
            boxShadow: "0 4px 12px rgba(147, 112, 219, 0.2)",
            minWidth: "220px",
          }}>
            <span className="floating" style={{ fontSize: "35px" }}>💎</span>
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#6a5acd", fontSize: "1.1rem" }}>Investment Coins</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#6a5acd", margin: 0 }}>
                {coins} <span style={{ fontSize: "1.3rem", color: "#9370db" }}>coins</span>
              </p>
            </div>
          </div>
          
          <div style={{
            padding: "15px 20px",
            backgroundColor: "#e6e6fa",
            borderRadius: "18px",
            border: "2px solid #9370db",
            minWidth: "220px",
          }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#483d8b", fontSize: "1.1rem" }}>Progress</h3>
            <div style={{ 
              width: "100%", 
              height: "12px", 
              backgroundColor: "#d8bfd8", 
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "8px",
            }}>
              <div style={{ 
                width: `${(completedLessons / totalLessons) * 100}%`, 
                height: "100%", 
                background: "linear-gradient(90deg, #9370db, #7b68ee)",
                transition: "width 0.5s ease",
                borderRadius: "6px",
              }}></div>
            </div>
            <p style={{ margin: "5px 0 0 0", color: "#483d8b", fontSize: "0.9rem" }}>
              {completedLessons} of {totalLessons} investing lessons complete
            </p>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
        gap: "25px",
      }}>
        {/* Lesson 1: Penny Doubling */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(230, 230, 250, 0.95)",
          border: "3px solid #9370db",
          display: "flex",
          flexDirection: "column",
          minHeight: "500px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#9370db",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}>1</div>
            <h2 style={{ 
              color: "#9370db",
              fontSize: "1.5rem",
              margin: 0,
              background: "linear-gradient(45deg, #9370db, #7b68ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700",
            }}>The Magic Penny</h2>
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #d8bfd8",
              marginBottom: "20px",
            }}>
              <p style={{ margin: "0 0 15px 0", fontSize: "1rem", lineHeight: "1.5" }}>
                <strong>Imagine:</strong> A magic penny that <strong>doubles every day</strong>!
                Day 1: $0.01, Day 2: $0.02, Day 3: $0.04...
              </p>
              
              <div style={{
                padding: "15px",
                backgroundColor: "#f0e6ff",
                borderRadius: "10px",
                marginBottom: "15px",
                textAlign: "center",
              }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#6a5acd" }}>
                  Days of doubling: {pennyDays}
                </p>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={pennyDays}
                  onChange={(e) => setPennyDays(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div style={{
                  marginTop: "15px",
                  padding: "15px",
                  backgroundColor: "#e6e6fa",
                  borderRadius: "10px",
                }}>
                  <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>After {pennyDays} days:</p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "1.5rem", fontWeight: "bold", color: "#9370db" }}>
                    ${pennyValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              <div style={{
                padding: "15px",
                backgroundColor: "#f0e6ff",
                borderRadius: "10px",
                textAlign: "center",
              }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#6a5acd" }}>
                  Would you rather:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    onClick={() => checkLesson1("toy")}
                    style={{
                      padding: "12px",
                      backgroundColor: pennyChoice === "toy" ? "#ff9800" : "#e6e6fa",
                      color: pennyChoice === "toy" ? "white" : "#333",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Buy a $100 toy today 🧸
                  </button>
                  <button
                    onClick={() => checkLesson1("penny")}
                    style={{
                      padding: "12px",
                      backgroundColor: pennyChoice === "penny" ? "#4caf50" : "#e6e6fa",
                      color: pennyChoice === "penny" ? "white" : "#333",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Take the magic penny 🪙
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {feedback.penny && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: feedback.penny.includes("🎉") ? "#e8f5e9" : "#fff3e0",
              borderRadius: "8px",
              textAlign: "center",
            }}>
              {feedback.penny}
            </div>
          )}
          
          {lessonsCompleted.lesson1 && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#4caf50",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}>
              ✅ Lesson Completed!
            </div>
          )}
        </section>

        {/* Lesson 2: Diversification - INCREASED COINS */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(248, 240, 255, 0.95)",
          border: "3px solid #ba55d3",
          display: "flex",
          flexDirection: "column",
          minHeight: "500px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#ba55d3",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}>2</div>
            <h2 style={{ 
              color: "#ba55d3",
              fontSize: "1.5rem",
              margin: 0,
              background: "linear-gradient(45deg, #ba55d3, #9932cc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700",
            }}>Spread Your Money</h2>
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #e6e6fa",
              marginBottom: "20px",
            }}>
              <p style={{ margin: "0 0 15px 0", fontSize: "1rem", lineHeight: "1.5" }}>
                <strong>Don't put all eggs in one basket!</strong> Spread your money so if one investment has a bad day, others can help.
              </p>
              
              <div style={{
                padding: "15px",
                backgroundColor: "#f0e6ff",
                borderRadius: "10px",
                marginBottom: "15px",
                textAlign: "center",
              }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#ba55d3" }}>
                  Drag coins into different jars: (Earn 40 coins!)
                </p>
                
                <div ref={boardRef} style={{
                  position: "relative",
                  height: "300px",
                  backgroundColor: "#f8f5ff",
                  borderRadius: "10px",
                  border: "2px dashed #ba55d3",
                  marginBottom: "15px",
                  overflow: "hidden",
                }}>
                  {/* Coins */}
                  {dragCoins.map((c) => (
                    <div
                      key={c.id}
                      id={`coin-${c.id}`}
                      onPointerDown={(e) => onCoinPointerDown(e, c.id)}
                      style={{
                        position: "absolute",
                        left: c.x,
                        top: c.y,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#FFD700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        cursor: "grab",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        border: "2px solid #FFC107",
                        userSelect: "none",
                        zIndex: dragging?.id === c.id ? 10 : 2,
                        transform: dragging?.id === c.id ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      🪙
                    </div>
                  ))}
                  
                  {/* Jars */}
                  <div style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "0",
                    right: "0",
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "0 20px",
                  }}>
                    <div
                      ref={(el) => (jarRefs.current.stocks = el)}
                      style={{
                        width: "80px",
                        height: "100px",
                        backgroundColor: "#E8F5E9",
                        borderRadius: "10px",
                        border: "2px solid #4CAF50",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <div style={{ fontSize: "1.8rem" }}>📈</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: "bold", marginTop: "5px" }}>Stocks</div>
                      <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "2px" }}>Can grow fast</div>
                    </div>
                    
                    <div
                      ref={(el) => (jarRefs.current.bonds = el)}
                      style={{
                        width: "80px",
                        height: "100px",
                        backgroundColor: "#FFF3E0",
                        borderRadius: "10px",
                        border: "2px solid #FF9800",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <div style={{ fontSize: "1.8rem" }}>🧱</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: "bold", marginTop: "5px" }}>Bonds</div>
                      <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "2px" }}>Steady growth</div>
                    </div>
                    
                    <div
                      ref={(el) => (jarRefs.current.cash = el)}
                      style={{
                        width: "80px",
                        height: "100px",
                        backgroundColor: "#E3F2FD",
                        borderRadius: "10px",
                        border: "2px solid #2196F3",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "10px",
                      }}
                    >
                      <div style={{ fontSize: "1.8rem" }}>🏦</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: "bold", marginTop: "5px" }}>Cash</div>
                      <div style={{ fontSize: "0.7rem", color: "#666", marginTop: "2px" }}>Safe but slow</div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    onClick={checkDiversification}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#ba55d3",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Check My Spread
                  </button>
                  <button
                    onClick={resetDiversification}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#e6e6fa",
                      color: "#ba55d3",
                      border: "2px solid #ba55d3",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {dragMessage && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: dragMessage.includes("🎉") ? "#e8f5e9" : "#fff3e0",
              borderRadius: "8px",
              textAlign: "center",
            }}>
              {dragMessage}
            </div>
          )}
          
          {lessonsCompleted.lesson2 && (
            <div style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "#4caf50",
                color: "white",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: "bold",
            }}>
              ✅ Lesson Completed! (+40 coins!)
            </div>
          )}
        </section>

        {/* Lesson 3: Risk vs Reward */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(240, 248, 255, 0.95)",
          border: "3px solid #4682b4",
          display: "flex",
          flexDirection: "column",
          minHeight: "500px",
          gridColumn: "span 2",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#4682b4",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}>3</div>
            <h2 style={{ 
              color: "#4682b4",
              fontSize: "1.5rem",
              margin: 0,
              background: "linear-gradient(45deg, #4682b4, #4169e1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700",
            }}>Risk Choices</h2>
          </div>
          
          <div style={{ flex: 1, display: "flex", gap: "20px" }}>
            <div style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "15px",
              border: "2px solid #b0c4de",
            }}>
              <h3 style={{ color: "#4169e1", marginTop: 0 }}>Choose Your Path</h3>
              
              <p style={{ marginBottom: "20px", fontSize: "1rem" }}>
                You need money for a school trip in 3 months. Which path do you choose?
              </p>
              
              <div style={{ marginBottom: "20px" }}>
                <button
                  onClick={() => checkLesson3("garden")}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: riskChoice === "garden" ? "#4caf50" : "#f1f8e9",
                    color: riskChoice === "garden" ? "white" : "#333",
                    border: "2px solid #4caf50",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.5rem" }}>🌱</span>
                    <div>
                      <strong>Garden Path</strong>
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>
                        Slow & steady growth. Safe choice.
                      </p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => checkLesson3("rocket")}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: riskChoice === "rocket" ? "#ff9800" : "#fff3e0",
                    color: riskChoice === "rocket" ? "white" : "#333",
                    border: "2px solid #ff9800",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.5rem" }}>🚀</span>
                    <div>
                      <strong>Rocket Path</strong>
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>
                        Fast growth possible, but could drop.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              
              <div style={{
                padding: "15px",
                backgroundColor: "#f0f8ff",
                borderRadius: "10px",
                border: "2px dashed #4682b4",
              }}>
                <p style={{ margin: "0", fontSize: "0.9rem", color: "#4682b4", fontWeight: "bold" }}>
                  💡 Tip: For important short-term goals, safer choices are usually better!
                </p>
              </div>
            </div>
            
            <div style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "#f0f8ff",
              borderRadius: "15px",
              border: "2px solid #87ceeb",
            }}>
              <h3 style={{ color: "#4169e1", marginTop: 0 }}>Quick Quiz</h3>
              
              <div style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "15px",
              }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#4682b4" }}>
                  When you need money soon, which is smarter?
                </p>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <div style={{
                    padding: "10px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    flex: 1,
                    textAlign: "center",
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>✅</span>
                    <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>Safe & steady</p>
                  </div>
                  <div style={{
                    padding: "10px",
                    backgroundColor: "#ffebee",
                    borderRadius: "8px",
                    flex: 1,
                    textAlign: "center",
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>❌</span>
                    <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>Risky & wild</p>
                  </div>
                </div>
              </div>
              
              {feedback.risk && (
                <div style={{
                  padding: "15px",
                  backgroundColor: feedback.risk.includes("🎉") ? "#e8f5e9" : "#fff3e0",
                  borderRadius: "10px",
                  textAlign: "center",
                }}>
                  {feedback.risk}
                </div>
              )}
            </div>
          </div>
          
          {lessonsCompleted.lesson3 && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#4caf50",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
              alignSelf: "center",
              width: "50%",
            }}>
              ✅ Lesson Completed!
            </div>
          )}
        </section>

        {/* Lesson 4: Fixed Goal Planning with Better Quiz */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 248, 225, 0.95)",
          border: "3px solid #ff9800",
          display: "flex",
          flexDirection: "column",
          minHeight: "500px",
          gridColumn: "span 2",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#ff9800",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}>4</div>
            <h2 style={{ 
              color: "#ff9800",
              fontSize: "1.5rem",
              margin: 0,
              background: "linear-gradient(45deg, #ff9800, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700",
            }}>Goal Planning</h2>
          </div>
          
          <div style={{ flex: 1, display: "flex", gap: "20px" }}>
            <div style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "15px",
              border: "2px solid #ffcc80",
            }}>
              <h3 style={{ color: "#ef6c00", marginTop: 0 }}>Plan Your Goal</h3>
              
              <p style={{ marginBottom: "20px", fontSize: "1rem" }}>
                Want to save for something special? Let's plan how long it will take!
              </p>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#ff9800", fontWeight: "bold" }}>
                  Goal Amount: ${goalAmount}
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="50"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>$50</span>
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>$500</span>
                </div>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#ff9800", fontWeight: "bold" }}>
                  Weekly Save: ${weeklySave}
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={weeklySave}
                  onChange={(e) => setWeeklySave(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>$1</span>
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>$20</span>
                </div>
              </div>
              
              <button
                onClick={calculateGoal}
                style={{
                  width: "100%",
                  padding: "15px",
                  backgroundColor: "#ff9800",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Calculate My Goal
              </button>
              
              {weeksNeeded && (
                <div style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#fff3e0",
                  borderRadius: "10px",
                  textAlign: "center",
                }}>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#ff9800" }}>
                    Time to reach ${goalAmount} goal:
                  </p>
                  <p style={{ margin: "0", fontSize: "1.5rem", fontWeight: "bold", color: "#ef6c00" }}>
                    {weeksNeeded} weeks
                  </p>
                  <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                    Saving ${weeklySave} each week
                  </p>
                </div>
              )}
              
              {feedback.goalCalc && (
                <div style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "8px",
                  textAlign: "center",
                }}>
                  {feedback.goalCalc}
                </div>
              )}
            </div>
            
            <div style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "#fff3e0",
              borderRadius: "15px",
              border: "2px solid #ffb74d",
            }}>
              <h3 style={{ color: "#ef6c00", marginTop: 0 }}>Final Quiz</h3>
              
              <div style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "10px",
                marginBottom: "15px",
              }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#ff9800" }}>
                  You want to save $200 for a new bike. What's the best approach?
                </p>
                
                <div style={{ marginTop: "15px" }}>
                  <button
                    onClick={() => checkLesson4("save")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: goalChoice === "save" ? "#4caf50" : "#f1f8e9",
                      color: goalChoice === "save" ? "white" : "#333",
                      border: "2px solid #4caf50",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.2rem" }}>💰</span>
                      <div>
                        <strong>Start saving $10 each week now</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem" }}>
                          Reach goal in 20 weeks
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => checkLesson4("wait")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: goalChoice === "wait" ? "#ff9800" : "#fff3e0",
                      color: goalChoice === "wait" ? "white" : "#333",
                      border: "2px solid #ff9800",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.2rem" }}>⏰</span>
                      <div>
                        <strong>Wait 6 months, then save $20/week</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem" }}>
                          Start later, save faster
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => checkLesson4("spend")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: goalChoice === "spend" ? "#f44336" : "#ffebee",
                      color: goalChoice === "spend" ? "white" : "#333",
                      border: "2px solid #f44336",
                      borderRadius: "8px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.2rem" }}>💸</span>
                      <div>
                        <strong>Spend money on small things now</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem" }}>
                          Forget about the bike
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              {feedback.goalQuiz && (
                <div style={{
                  padding: "15px",
                  backgroundColor: feedback.goalQuiz.includes("🎉") ? "#e8f5e9" : "#fff3e0",
                  borderRadius: "10px",
                  textAlign: "center",
                }}>
                  {feedback.goalQuiz}
                </div>
              )}
              
              <div style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                textAlign: "center",
                border: "2px solid #2196F3",
              }}>
                <p style={{ margin: "0", fontSize: "0.9rem", color: "#1565C0" }}>
                  💡 <strong>Lesson:</strong> Starting early gives your money more time to work for you!
                </p>
              </div>
            </div>
          </div>
          
          {lessonsCompleted.lesson4 && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#4caf50",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
              alignSelf: "center",
              width: "50%",
            }}>
              ✅ Lesson Completed!
            </div>
          )}
        </section>
      </main>

      <footer style={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        textAlign: "center",
        border: "2px solid #7b68ee",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h3 style={{ color: "#7b68ee", marginBottom: "12px", fontSize: "1.3rem" }}>🎓 Investing Certificate</h3>
        <div style={{
          padding: "15px",
          backgroundColor: "#e6e6fa",
          borderRadius: "15px",
          border: "2px dashed #9370db",
          marginBottom: "15px",
        }}>
          <p style={{ fontSize: "1.1rem", color: "#6a5acd", fontWeight: "bold", margin: "0 0 8px 0" }}>
            {coins >= 120 ? "🏆 Investing Pro!" : 
             coins >= 80 ? "🥈 Smart Investor!" : 
             coins >= 40 ? "🥉 Learning Investor!" : 
             "🌟 Keep Learning Investing!"}
          </p>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
            You've earned <span style={{ color: "#6a5acd", fontWeight: "bold" }}>{coins}</span> coins!
            {coins >= 120 && " You understand investing basics!"}
          </p>
        </div>
        
        {/* Completion Message */}
        {completedLessons === totalLessons && (
          <div style={{
            padding: "20px",
            backgroundColor: "#e6e6fa",
            borderRadius: "15px",
            border: "3px solid #9370db",
            marginBottom: "20px",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            <h3 style={{ color: "#6a5acd", marginTop: 0, fontSize: "1.5rem" }}>🎉 Level 4 Completed! 🎉</h3>
            <p style={{ fontSize: "1.1rem", color: "#483d8b", marginBottom: "15px" }}>
              Amazing! You've learned about growing money, spreading risk, and planning goals!
              Level 5 is now unlocked on the homepage.
            </p>
            <button
              onClick={() => {
                localStorage.setItem("finlingo_last_completed_level", "4");
                localStorage.setItem("finlingo_unlocked_level", "5");
                navigate("/home");
              }}
              style={{
                padding: "15px 30px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                backgroundColor: "#9370db",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              🏠 Return to Homepage
            </button>
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              if (completedLessons === totalLessons) {
                setCoins(prev => prev + 40); // Increased bonus
                alert("🎁 You earned 40 bonus coins for completing all lessons!");
              } else {
                alert("Complete all lessons to unlock your completion bonus! 📚");
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: completedLessons === totalLessons ? "#9370db" : "#9e9e9e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "bold",
              cursor: completedLessons === totalLessons ? "pointer" : "not-allowed",
            }}
          >
            🎁 Claim Bonus
          </button>
          <button
            onClick={handleBackToHome}
            style={{
              padding: "10px 20px",
              backgroundColor: "#7b68ee",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </button>
        </div>
      </footer>
    </div>
  );
}
