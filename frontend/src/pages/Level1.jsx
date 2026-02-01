import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export default function Level1() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [shakeCoin, setShakeCoin] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [matches, setMatches] = useState({});
  const [sectionCompletion, setSectionCompletion] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState({});
  const [needsBudget, setNeedsBudget] = useState(70);
  const [wantsBudget, setWantsBudget] = useState(30);
  
  // Track which challenges have already rewarded coins
  const [challengeRewarded, setChallengeRewarded] = useState({
    barter: false,
    compare: false,
    dragMatch: false,
    budget: false,
    earning: false,
    allComplete: false
  });

  const moneyItems = [
    { id: 'penny', name: 'Penny', value: 1, color: '#cd7f32', emoji: '🪙' },
    { id: 'nickel', name: 'Nickel', value: 5, color: '#c0c0c0', emoji: '🪙' },
    { id: 'dime', name: 'Dime', value: 10, color: '#b5b5b5', emoji: '🪙' },
    { id: 'quarter', name: 'Quarter', value: 25, color: '#e0e0e0', emoji: '🪙' },
    { id: 'dollar', name: 'Dollar Bill', value: 100, color: '#90ee90', emoji: '💵' },
    { id: 'five', name: 'Five Dollar', value: 500, color: '#87ceeb', emoji: '💵' },
  ];

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Check all lessons completion
  useEffect(() => {
    const completedCount = Object.keys(sectionCompletion).length;
    if (completedCount === 5 && !challengeRewarded.allComplete) {
      setShowConfetti(true);
      setCoins(prev => prev + 50);
      setChallengeRewarded(prev => ({ ...prev, allComplete: true }));
      
      // Mark level as completed in localStorage for Homepage
      localStorage.setItem("finlingo_last_completed_level", "1");
    }
  }, [sectionCompletion, challengeRewarded]);

  const checkAnswer = (questionId, correctAnswer, challengeName) => {
    const userAnswer = answers[questionId]?.toString().toLowerCase().trim();
    const correct = correctAnswer.toString().toLowerCase().trim();
    
    if (userAnswer === correct) {
      // Check if already rewarded for this challenge
      const alreadyRewarded = challengeRewarded[challengeName];
      
      if (!alreadyRewarded) {
        setFeedback({ ...feedback, [questionId]: "🎉 Correct! You earned 10 coins!" });
        setCoins(prev => prev + 10);
        setShakeCoin(true);
        setChallengeRewarded(prev => ({ ...prev, [challengeName]: true }));
      } else {
        setFeedback({ ...feedback, [questionId]: "✅ Already completed! Great job!" });
      }
      
      // Mark section as completed (even if already rewarded)
      if (!sectionCompletion[questionId]) {
        setSectionCompletion(prev => ({ ...prev, [questionId]: true }));
      }
      
      return true;
    } else {
      setFeedback({ ...feedback, [questionId]: "🤔 Not quite! Try again!" });
      return false;
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetValue) => {
    if (draggedItem && draggedItem.value === targetValue) {
      // Check if already rewarded for drag match
      const alreadyRewarded = challengeRewarded.dragMatch;
      
      setMatches({ ...matches, [draggedItem.id]: true });
      
      if (!alreadyRewarded) {
        setFeedback({ ...feedback, dragMatch: "✅ Perfect match! This coin is worth " + targetValue + " cents! You earned 15 coins!" });
        setCoins(prev => prev + 15);
        setChallengeRewarded(prev => ({ ...prev, dragMatch: true }));
      } else {
        setFeedback({ ...feedback, dragMatch: "✅ Already matched! Great job!" });
      }
      
      // Mark section as completed
      if (!sectionCompletion['dragMatch']) {
        setSectionCompletion(prev => ({ ...prev, 'dragMatch': true }));
      }
    } else if (draggedItem) {
      setFeedback({ ...feedback, dragMatch: "🔄 Try again! That doesn't match the value." });
    }
    setDraggedItem(null);
  };

  // Check budget challenge
  const checkBudgetChallenge = () => {
    const total = needsBudget + wantsBudget;
    const alreadyRewarded = challengeRewarded.budget;
    
    if (total > 100) {
      setFeedback({ ...feedback, budget: "⚠️ Your budget exceeds $100! Reduce spending." });
      return false;
    } else if (needsBudget >= 50 && wantsBudget <= 50) {
      if (!alreadyRewarded) {
        setFeedback({ ...feedback, budget: "🎉 Excellent budget! You prioritized needs and kept wants reasonable! You earned 15 coins!" });
        setCoins(prev => prev + 15);
        setChallengeRewarded(prev => ({ ...prev, budget: true }));
      } else {
        setFeedback({ ...feedback, budget: "✅ Already completed with excellent budget!" });
      }
      
      if (!sectionCompletion['budget']) {
        setSectionCompletion(prev => ({ ...prev, 'budget': true }));
      }
      return true;
    } else if (needsBudget >= 30) {
      if (!alreadyRewarded) {
        setFeedback({ ...feedback, budget: "👍 Good start! You earned 5 coins! Try to allocate more to needs for better budgeting." });
        setCoins(prev => prev + 5);
        setChallengeRewarded(prev => ({ ...prev, budget: true }));
      } else {
        setFeedback({ ...feedback, budget: "✅ Already completed! Good budget!" });
      }
      
      if (!sectionCompletion['budget']) {
        setSectionCompletion(prev => ({ ...prev, 'budget': true }));
      }
      return true;
    } else {
      setFeedback({ ...feedback, budget: "🤔 Needs should be at least 30% of your budget. Try again!" });
      return false;
    }
  };

  const completedLessons = Object.keys(sectionCompletion).length;
  const totalLessons = 5;

  // Function to go back to homepage
  const handleBackToHome = () => {
    // Save current progress if level is completed
    if (completedLessons === totalLessons) {
      localStorage.setItem("finlingo_last_completed_level", "1");
    }
    navigate("/home");
  };

  // Common styles for consistency
  const sectionStyles = {
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    minHeight: "450px",
    display: "flex",
    flexDirection: "column",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 25px rgba(0, 0, 0, 0.15)",
    }
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

  return (
    <div style={{ 
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
    }}>
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
          50% { transform: scale(1.05); opacity: 0.8; }
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
          background: #ff4081;
          top: 0;
          opacity: 0;
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {showConfetti && (
        <>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}vw`,
                backgroundColor: ['#8b5cf6', '#6d28d9', '#4f46e5', '#3730a3', '#1e40af'][Math.floor(Math.random() * 5)],
                animation: `confetti-fall ${1 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                width: `${8 + Math.random() * 12}px`,
                height: `${8 + Math.random() * 12}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </>
      )}

      {/* Add Back Button at the top */}
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
            ":hover": {
              backgroundColor: "#5a00e0",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(106, 0, 255, 0.3)",
            },
          }}
        >
          ← Back to Home
        </button>
        
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}>
        </div>
      </div>

      <header style={{ 
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
      }}>
        <h1 style={{ 
          fontSize: "2.8rem",
          marginBottom: "15px",
          textShadow: "2px 2px 0 rgba(139, 92, 246, 0.2)",
          background: "linear-gradient(45deg, #4f46e5, #8b5cf6, #6d28d9)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "900",
          letterSpacing: "0.5px",
        }}>
          🐰💰 Money Adventure Academy 💰🐻
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
            backgroundColor: "#fff8e1",
            borderRadius: "18px",
            border: "2px dashed #ffc107",
            boxShadow: "0 4px 12px rgba(255, 193, 7, 0.2)",
            minWidth: "220px",
          }}>
            <span className="floating" style={{ 
              fontSize: "35px",
              animation: shakeCoin ? "shake 0.5s ease-in-out" : "none",
              display: "inline-block",
            }}>💰</span>
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#ff6b00", fontSize: "1.1rem" }}>Your Money Bank</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff6b00", margin: 0 }}>
                {coins} <span style={{ fontSize: "1.3rem", color: "#ff9800" }}>coins</span>
              </p>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                ${(coins / 100).toFixed(2)}
              </p>
            </div>
          </div>
          
          <div style={{
            padding: "15px 20px",
            backgroundColor: "#e8f5e9",
            borderRadius: "18px",
            border: "2px solid #4caf50",
            minWidth: "220px",
          }}>
            <h3 style={{ margin: "0 0 8px 0", color: "#2e7d32", fontSize: "1.1rem" }}>Progress</h3>
            <div style={{ 
              width: "100%", 
              height: "12px", 
              backgroundColor: "#c8e6c9", 
              borderRadius: "6px",
              overflow: "hidden",
              marginBottom: "8px",
            }}>
              <div style={{ 
                width: `${(completedLessons / totalLessons) * 100}%`, 
                height: "100%", 
                background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                transition: "width 0.5s ease",
                borderRadius: "6px",
              }}></div>
            </div>
            <p style={{ margin: "5px 0 0 0", color: "#388e3c", fontSize: "0.9rem" }}>
              {completedLessons} of {totalLessons} lessons complete
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
        {/* Lesson 1: What Money Is */}
        <section style={{ 
          ...sectionStyles,
          backgroundColor: "rgba(255, 240, 247, 0.95)",
          border: "3px solid #ff4081",
          animation: "slideIn 0.6s ease-out",
        }}>
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#ff4081")}>1</div>
            <h2 style={titleStyles("#ff4081")}>What is Money?</h2>
          </div>
          
          <div style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flex: 1,
          }}>
            <div style={{
              flex: 1,
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #ffb6c1",
              display: "flex",
              flexDirection: "column",
            }}>
              <h3 style={{ color: "#e91e63", marginTop: 0, fontSize: "1.1rem" }}>💡 Fun Fact!</h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.5", margin: "10px 0 0 0", flex: 1 }}>
                Money is like a <b style={{ color: "#ff4081" }}>magic key</b> that can unlock anything you need! 
                From delicious pizza 🍕 to awesome video games 🎮!
              </p>
            </div>
            
            <div style={{
              flex: 1,
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #ffb6c1",
              display: "flex",
              flexDirection: "column",
            }}>
              <h3 style={{ color: "#e91e63", marginTop: 0, fontSize: "1.1rem" }}>🔄 Barter System</h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.5", margin: "10px 0 0 0", flex: 1 }}>
                Before money, people traded directly! Like trading your extra cookies 🍪 for your friend's cool stickers! 🎨
              </p>
            </div>
          </div>
          
          <div style={{
            padding: "20px",
            backgroundColor: "rgba(255, 64, 129, 0.1)",
            borderRadius: "12px",
            textAlign: "center",
            marginTop: "auto",
          }}>
            <h3 style={{ color: "#d81b60", marginTop: 0, marginBottom: "12px", fontSize: "1.1rem" }}>Quick Quiz: Barter Challenge</h3>
            <p style={{ fontSize: "1rem", marginBottom: "15px" }}>
              If you have 3 apples 🍎🍎🍎 and want 2 oranges 🍊🍊, but your friend wants 4 apples for 3 oranges...
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <input
                value={answers["barter"] || ""}
                onChange={(e) => setAnswers({ ...answers, barter: e.target.value })}
                placeholder="Type: 3 apples for 2 oranges"
                style={{
                  padding: "10px 15px",
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  border: "2px solid #ff4081",
                  width: "220px",
                  textAlign: "center",
                }}
              />
              <button
                onClick={() => checkAnswer("barter", "3 apples for 2 oranges", "barter")}
                style={{
                  padding: "10px 20px",
                  fontSize: "0.95rem",
                  fontWeight: "bold",
                  backgroundColor: challengeRewarded.barter ? "#9e9e9e" : "#ff4081",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: challengeRewarded.barter ? "default" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: challengeRewarded.barter ? 0.7 : 1,
                }}
              >
                {challengeRewarded.barter ? "✅ Completed" : "Check 🎯"}
              </button>
            </div>
          </div>
          
          {feedback.barter && (
            <div style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: feedback.barter.includes("🎉") ? "#e8f5e9" : 
                            feedback.barter.includes("✅") ? "#e3f2fd" : "#fff3e0",
              borderRadius: "8px",
              textAlign: "center",
              border: feedback.barter.includes("🎉") ? "1px solid #4caf50" : 
                     feedback.barter.includes("✅") ? "1px solid #2196f3" : "1px solid #ff9800",
            }}>
              <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: "bold" }}>
                {feedback.barter}
              </p>
            </div>
          )}
        </section>

        {/* Lesson 2: Coins & Bills - Interactive */}
        <section style={{ 
          ...sectionStyles,
          backgroundColor: "rgba(224, 242, 254, 0.95)",
          border: "3px solid #2196f3",
          animation: "slideIn 0.6s ease-out 0.2s backwards",
        }}>
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#2196f3")}>2</div>
            <h2 style={titleStyles("#2196f3")}>Coins & Bills</h2>
          </div>
          
          <div style={{ marginBottom: "15px", flex: 1 }}>
            <h3 style={{ color: "#1976d2", textAlign: "center", marginBottom: "15px", fontSize: "1.1rem" }}>
              💰 Drag coins to their values!
            </h3>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginBottom: "20px",
            }}>
              {moneyItems.map(item => (
                <div
                  key={item.id}
                  draggable={!matches[item.id]}
                  onDragStart={() => !matches[item.id] && handleDragStart(item)}
                  style={{
                    padding: "12px",
                    backgroundColor: item.color,
                    borderRadius: "12px",
                    cursor: matches[item.id] ? "default" : "grab",
                    textAlign: "center",
                    border: matches[item.id] ? "3px solid #4caf50" : "2px solid white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                >
                  {matches[item.id] && (
                    <div style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      backgroundColor: "#4caf50",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}>
                      ✓
                    </div>
                  )}
                  <div style={{ fontSize: "2rem" }}>{item.emoji}</div>
                  <p style={{ 
                    margin: "8px 0 0 0", 
                    fontWeight: "bold", 
                    color: "white",
                    fontSize: "0.9rem",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}>{item.name}</p>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <h3 style={{ color: "#1976d2", marginBottom: "12px", fontSize: "1.1rem" }}>Value Targets</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}>
                {[1, 5, 10, 25, 100, 500].map(value => {
                  const matchedItem = moneyItems.find(item => item.value === value && matches[item.id]);
                  return (
                    <div
                      key={value}
                      onDragOver={handleDragOver}
                      onDrop={() => !matchedItem && handleDrop(value)}
                      style={{
                        padding: "15px",
                        backgroundColor: matchedItem ? "#e8f5e9" : "white",
                        borderRadius: "12px",
                        border: matchedItem ? "2px solid #4caf50" : "2px dashed #2196f3",
                        textAlign: "center",
                        minHeight: "80px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                        position: "relative",
                      }}
                    >
                      {matchedItem && (
                        <div style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          fontSize: "1.2rem",
                        }}>
                          {matchedItem.emoji}
                        </div>
                      )}
                      <div style={{
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: matchedItem ? "#4caf50" : "#2196f3",
                        marginBottom: "5px",
                      }}>
                        {value}¢
                      </div>
                      <p style={{ margin: 0, color: "#666", fontSize: "0.8rem" }}>
                        {value === 1 ? "Penny" : 
                         value === 5 ? "Nickel" : 
                         value === 10 ? "Dime" : 
                         value === 25 ? "Quarter" : 
                         value === 100 ? "$1 Bill" : "$5 Bill"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {feedback.dragMatch && (
            <div style={{
              padding: "12px",
              backgroundColor: feedback.dragMatch.includes("✅") ? "#e8f5e9" : "#fff3e0",
              borderRadius: "8px",
              textAlign: "center",
              border: feedback.dragMatch.includes("✅") ? "1px solid #4caf50" : "1px solid #ff9800",
            }}>
              <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: "bold" }}>
                {feedback.dragMatch}
              </p>
            </div>
          )}
        </section>

        {/* Lesson 3: Value Comparison */}
        <section style={{ 
          ...sectionStyles,
          backgroundColor: "rgba(243, 229, 245, 0.95)",
          border: "3px solid #9c27b0",
          animation: "slideIn 0.6s ease-out 0.4s backwards",
          gridColumn: "span 2",
        }}>
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#9c27b0")}>3</div>
            <h2 style={titleStyles("#9c27b0")}>More or Less?</h2>
          </div>
          
          <div style={{ textAlign: "center", marginBottom: "15px", flex: 1 }}>
            <h3 style={{ color: "#7b1fa2", marginBottom: "15px", fontSize: "1.1rem" }}>
              Which pile is worth more money? 🧐
            </h3>
            
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "25px",
              marginBottom: "20px",
            }}>
              {[
                { value: "65¢", items: ["25¢", "25¢", "10¢", "5¢"], total: 65 },
                { value: "80¢", items: ["25¢", "25¢", "25¢", "5¢"], total: 80 }
              ].map((pile, index) => (
                <div key={index} style={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  border: "3px solid",
                  borderColor: index === 0 ? "#2196f3" : "#ff4081",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                  minWidth: "160px",
                }}>
                  <h4 style={{ 
                    color: index === 0 ? "#2196f3" : "#ff4081",
                    marginTop: 0,
                    fontSize: "1.1rem",
                  }}>
                    Pile {index === 0 ? "A" : "B"}
                  </h4>
                  <div style={{ fontSize: "1.8rem", margin: "12px 0", color: "#9c27b0" }}>
                    {pile.value}
                  </div>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: "8px",
                    marginTop: "12px",
                  }}>
                    {pile.items.map((item, i) => (
                      <div key={i} style={{
                        padding: "6px",
                        backgroundColor: index === 0 ? "#e3f2fd" : "#fce4ec",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        textAlign: "center",
                        color: index === 0 ? "#1976d2" : "#d81b60",
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <p style={{ 
                    marginTop: "12px", 
                    color: "#666",
                    fontSize: "0.8rem",
                  }}>
                    Total: {pile.total} cents
                  </p>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: "15px" }}>
              <p style={{ fontSize: "1rem", color: "#7b1fa2", marginBottom: "12px" }}>
                Which pile has more value? Type "A" or "B"
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <input
                  value={answers["compare"] || ""}
                  onChange={(e) => setAnswers({ ...answers, compare: e.target.value })}
                  style={{
                    padding: "12px 15px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "2px solid #9c27b0",
                    width: "150px",
                    textAlign: "center",
                    backgroundColor: challengeRewarded.compare ? "#f5f5f5" : "white",
                  }}
                  placeholder="Type A or B"
                  readOnly={challengeRewarded.compare}
                />
                <button
                  onClick={() => checkAnswer("compare", "B", "compare")}
                  style={{
                    padding: "12px 20px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: challengeRewarded.compare ? "#9e9e9e" : "#9c27b0",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: challengeRewarded.compare ? "default" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: challengeRewarded.compare ? 0.7 : 1,
                  }}
                >
                  {challengeRewarded.compare ? "✅ Completed" : "Check 🎯"}
                </button>
              </div>
            </div>
          </div>
          
          {feedback.compare && (
            <div style={{
              padding: "12px",
              backgroundColor: feedback.compare.includes("🎉") ? "#e8f5e9" : 
                            feedback.compare.includes("✅") ? "#e3f2fd" : "#fff3e0",
              borderRadius: "8px",
              textAlign: "center",
              border: feedback.compare.includes("🎉") ? "1px solid #4caf50" : 
                     feedback.compare.includes("✅") ? "1px solid #2196f3" : "1px solid #ff9800",
            }}>
              <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: "bold" }}>
                {feedback.compare}
                {feedback.compare.includes("🎉") && " Pile B has 80¢ which is more than 65¢!"}
              </p>
            </div>
          )}
        </section>

        {/* Lesson 4: Needs vs Wants */}
        <section style={{ 
          ...sectionStyles,
          backgroundColor: "rgba(255, 248, 225, 0.95)",
          border: "3px solid #ff9800",
          animation: "slideIn 0.6s ease-out 0.6s backwards",
          gridColumn: "span 2",
          minHeight: "550px",
        }}>
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#ff9800")}>4</div>
            <h2 style={titleStyles("#ff9800")}>Needs vs Wants</h2>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
            marginBottom: "25px",
            flex: 1,
          }}>
            <div style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "15px",
              border: "2px solid #4caf50",
              boxShadow: "0 6px 15px rgba(76, 175, 80, 0.1)",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#4caf50",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1rem",
                }}>✅</div>
                <h3 style={{ color: "#2e7d32", margin: 0, fontSize: "1.2rem" }}>Needs</h3>
              </div>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                flex: 1,
              }}>
                {[
                  { emoji: "🏠", item: "Shelter", cost: "$$$$" },
                  { emoji: "🍎", item: "Healthy Food", cost: "$$$" },
                  { emoji: "💧", item: "Clean Water", cost: "$" },
                  { emoji: "⚕️", item: "Medicine", cost: "$$" },
                  { emoji: "👕", item: "Clothing", cost: "$$" },
                  { emoji: "📚", item: "Education", cost: "$$$" },
                ].map((need, index) => (
                  <div key={index} style={{
                    padding: "12px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>{need.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#2e7d32", fontSize: "0.9rem" }}>
                        {need.item}
                      </p>
                      <p style={{ margin: 0, color: "#666", fontSize: "0.8rem" }}>
                        Cost: <span style={{ color: "#4caf50", fontWeight: "bold" }}>{need.cost}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "15px",
              border: "2px solid #ff4081",
              boxShadow: "0 6px 15px rgba(255, 64, 129, 0.1)",
              display: "flex",
              flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#ff4081",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1rem",
                }}>🎁</div>
                <h3 style={{ color: "#d81b60", margin: 0, fontSize: "1.2rem" }}>Wants</h3>
              </div>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                flex: 1,
              }}>
                {[
                  { emoji: "🎮", item: "Video Games", cost: "$$$" },
                  { emoji: "🍬", item: "Candy", cost: "$" },
                  { emoji: "✈️", item: "Vacation", cost: "$$$$" },
                  { emoji: "📱", item: "New Phone", cost: "$$$$" },
                  { emoji: "🧸", item: "Toy", cost: "$$" },
                  { emoji: "🎬", item: "Movie Ticket", cost: "$$" },
                ].map((want, index) => (
                  <div key={index} style={{
                    padding: "12px",
                    backgroundColor: "#fce4ec",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>{want.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#d81b60", fontSize: "0.9rem" }}>
                        {want.item}
                      </p>
                      <p style={{ margin: 0, color: "#666", fontSize: "0.8rem" }}>
                        Cost: <span style={{ color: "#ff4081", fontWeight: "bold" }}>{want.cost}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{
            padding: "20px",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <h3 style={{ color: "#ef6c00", marginTop: 0, marginBottom: "15px", fontSize: "1.1rem" }}>💰 Budget Challenge!</h3>
            <p style={{ fontSize: "1rem", marginBottom: "15px" }}>
              You have $100 to budget. Set your spending between needs and wants!
            </p>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "30px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}>
              <div style={{ textAlign: "center" }}>
                <h4 style={{ fontWeight: "bold", color: "#2e7d32", marginBottom: "8px", fontSize: "1rem" }}>Needs</h4>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={needsBudget}
                  onChange={(e) => {
                    setNeedsBudget(parseInt(e.target.value));
                    setWantsBudget(100 - parseInt(e.target.value));
                  }}
                  style={{ width: "180px", opacity: challengeRewarded.budget ? 0.6 : 1 }}
                  disabled={challengeRewarded.budget}
                />
                <p style={{ marginTop: "8px", fontSize: "1.1rem", fontWeight: "bold", color: "#2e7d32" }}>
                  ${needsBudget}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <h4 style={{ fontWeight: "bold", color: "#d81b60", marginBottom: "8px", fontSize: "1rem" }}>Wants</h4>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={wantsBudget}
                  onChange={(e) => {
                    setWantsBudget(parseInt(e.target.value));
                    setNeedsBudget(100 - parseInt(e.target.value));
                  }}
                  style={{ width: "180px", opacity: challengeRewarded.budget ? 0.6 : 1 }}
                  disabled={challengeRewarded.budget}
                />
                <p style={{ marginTop: "8px", fontSize: "1.1rem", fontWeight: "bold", color: "#d81b60" }}>
                  ${wantsBudget}
                </p>
              </div>
            </div>
            
            <div style={{
              marginBottom: "15px",
              padding: "12px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "2px solid #ff9800",
            }}>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "#ef6c00" }}>
                Total: ${needsBudget + wantsBudget} / $100
                {needsBudget + wantsBudget === 100 ? " ✅" : " ⚠️"}
              </p>
            </div>
            
            <button
              onClick={checkBudgetChallenge}
              style={{
                padding: "10px 25px",
                fontSize: "1rem",
                fontWeight: "bold",
                backgroundColor: challengeRewarded.budget ? "#9e9e9e" : "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: challengeRewarded.budget ? "default" : "pointer",
                transition: "all 0.3s ease",
                opacity: challengeRewarded.budget ? 0.7 : 1,
              }}
            >
              {challengeRewarded.budget ? "✅ Completed" : "Check Budget 🎯"}
            </button>
          </div>
          
          {feedback.budget && (
            <div style={{
              marginTop: "15px",
              padding: "12px",
              backgroundColor: feedback.budget.includes("🎉") ? "#e8f5e9" : 
                            feedback.budget.includes("👍") ? "#fff3e0" : 
                            feedback.budget.includes("✅") ? "#e3f2fd" : "#ffebee",
              borderRadius: "8px",
              textAlign: "center",
              border: feedback.budget.includes("🎉") ? "1px solid #4caf50" : 
                     feedback.budget.includes("👍") ? "1px solid #ff9800" :
                     feedback.budget.includes("✅") ? "1px solid #2196f3" : "1px solid #f44336",
            }}>
              <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: "bold" }}>
                {feedback.budget}
              </p>
            </div>
          )}
        </section>

        {/* Lesson 5: Earning Money */}
        <section style={{ 
          ...sectionStyles,
          backgroundColor: "rgba(232, 245, 233, 0.95)",
          border: "3px solid #4caf50",
          animation: "slideIn 0.6s ease-out 0.8s backwards",
          gridColumn: "span 2",
          minHeight: "550px",
        }}>
          <div style={headerStyles}>
            <div style={numberBadgeStyles("#4caf50")}>5</div>
            <h2 style={titleStyles("#4caf50")}>Earning Money</h2>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            marginBottom: "25px",
            flex: 1,
          }}>
            {[
              { emoji: "🧹", job: "House Chores", pay: "$5-10/week", skills: ["Responsibility", "Organization"] },
              { emoji: "🐕", job: "Pet Sitting", pay: "$10-20/job", skills: ["Care", "Responsibility"] },
              { emoji: "🍋", job: "Lemonade Stand", pay: "$15-30/day", skills: ["Business", "Math"] },
              { emoji: "📚", job: "Tutoring", pay: "$10-15/hour", skills: ["Knowledge", "Patience"] },
              { emoji: "🌱", job: "Gardening Help", pay: "$20-40/job", skills: ["Hard Work", "Nature"] },
              { emoji: "💻", job: "Tech Help", pay: "$15-25/hour", skills: ["Technology", "Problem-solving"] },
            ].map((job, index) => (
              <div key={index} style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "15px",
                border: "2px solid #c8e6c9",
                transition: "all 0.3s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
              }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "10px" }}>{job.emoji}</div>
                <h3 style={{ color: "#2e7d32", margin: "0 0 8px 0", fontSize: "1rem" }}>{job.job}</h3>
                <div style={{
                  padding: "6px 10px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "15px",
                  display: "inline-block",
                  marginBottom: "12px",
                }}>
                  <span style={{ fontWeight: "bold", color: "#4caf50", fontSize: "0.9rem" }}>{job.pay}</span>
                </div>
                <div style={{ marginTop: "auto" }}>
                  <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "6px" }}>Skills you learn:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", justifyContent: "center" }}>
                    {job.skills.map((skill, i) => (
                      <span key={i} style={{
                        padding: "3px 6px",
                        backgroundColor: "#f1f8e9",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        color: "#558b2f",
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            padding: "20px",
            backgroundColor: "#fff3e0",
            borderRadius: "15px",
            border: "2px solid #ffb74d",
          }}>
            <h3 style={{ color: "#ef6c00", textAlign: "center", marginTop: 0, marginBottom: "15px", fontSize: "1.1rem" }}>💰 Money Math Challenge</h3>
            <p style={{ textAlign: "center", fontSize: "1rem", marginBottom: "15px" }}>
              If you earn $5 each week from chores and save for 4 weeks, how much will you have?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
              {["$15", "$20", "$25", "$30"].map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const correct = option === "$20";
                    if (correct) {
                      const alreadyRewarded = challengeRewarded.earning;
                      if (!alreadyRewarded) {
                        setFeedback({ ...feedback, earning: "🎉 Correct! 4 weeks × $5 = $20! You earned 20 coins!" });
                        setCoins(prev => prev + 20);
                        setChallengeRewarded(prev => ({ ...prev, earning: true }));
                      } else {
                        setFeedback({ ...feedback, earning: "✅ Already completed! Great job!" });
                      }
                      
                      if (!sectionCompletion['earning']) {
                        setSectionCompletion(prev => ({ ...prev, 'earning': true }));
                      }
                    } else {
                      setFeedback({ ...feedback, earning: "🤔 Try again! Multiply: weeks × weekly earnings" });
                    }
                  }}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: challengeRewarded.earning ? "2px solid #9e9e9e" : "2px solid #ff9800",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: challengeRewarded.earning ? "default" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: challengeRewarded.earning ? 0.7 : 1,
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            {feedback.earning && (
              <div style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: feedback.earning.includes("🎉") ? "#e8f5e9" : 
                              feedback.earning.includes("✅") ? "#e3f2fd" : "#ffebee",
                borderRadius: "8px",
                textAlign: "center",
              }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.95rem" }}>
                  {feedback.earning}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer style={{
        marginTop: "30px",
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        textAlign: "center",
        border: "2px solid #6a00ff",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <h3 style={{ color: "#6a00ff", marginBottom: "12px", fontSize: "1.3rem" }}>🎓 Money Master Certificate</h3>
        <div style={{
          padding: "15px",
          backgroundColor: "#fff8e1",
          borderRadius: "15px",
          border: "2px dashed #ffc107",
          marginBottom: "15px",
        }}>
          <p style={{ fontSize: "1.1rem", color: "#ff6b00", fontWeight: "bold", margin: "0 0 8px 0" }}>
            {coins >= 100 ? "🏆 Gold Money Master!" : 
             coins >= 50 ? "🥈 Silver Money Learner!" : 
             coins >= 20 ? "🥉 Bronze Money Explorer!" : 
             "🌟 Keep Learning!"}
          </p>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
            You've earned <span style={{ color: "#ff6b00", fontWeight: "bold" }}>{coins}</span> coins so far!
            {coins >= 100 && " You're ready to teach others about money!"}
          </p>
        </div>
        
        {/* Completion Message and Home Button */}
        {completedLessons === totalLessons && (
          <div style={{
            padding: "20px",
            backgroundColor: "#e8f5e9",
            borderRadius: "15px",
            border: "3px solid #4caf50",
            marginBottom: "20px",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            <h3 style={{ color: "#2e7d32", marginTop: 0, fontSize: "1.5rem" }}>🎉 Level 1 Completed! 🎉</h3>
            <p style={{ fontSize: "1.1rem", color: "#388e3c", marginBottom: "15px" }}>
              Congratulations! You've mastered all the lessons in Level 1!
              Level 2 will be unlocked on the homepage.
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
                transition: "all 0.3s ease",
                ":hover": {
                  backgroundColor: "#388e3c",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(76, 175, 80, 0.3)",
                },
              }}
            >
              🏠 Return to Homepage
            </button>
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              if (completedLessons === totalLessons && !bonusClaimed.completionBonus) {
                setCoins(prev => prev + 25);
                setShakeCoin(true);
                setBonusClaimed(prev => ({ ...prev, completionBonus: true }));
              } else if (completedLessons === totalLessons) {
                alert("You've already claimed your completion bonus! 🎉");
              } else {
                alert("Complete all lessons to unlock your completion bonus! 📚");
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: completedLessons === totalLessons ? 
                (bonusClaimed.completionBonus ? "#9e9e9e" : "#4caf50") : "#9e9e9e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "bold",
              cursor: completedLessons === totalLessons && !bonusClaimed.completionBonus ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.3s ease",
              opacity: completedLessons === totalLessons && !bonusClaimed.completionBonus ? 1 : 0.7,
            }}
          >
            {completedLessons === totalLessons ? 
              (bonusClaimed.completionBonus ? "✅ Bonus Claimed" : "🎁 Claim Completion Bonus!") : 
              "🔒 Complete All Lessons"}
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
              transition: "all 0.3s ease",
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
              transition: "all 0.3s ease",
              ":hover": {
                backgroundColor: "#5a00e0",
                transform: "translateY(-2px)",
              },
            }}
          >
            🏠 Back to Home
          </button>
        </div>
      </footer>
    </div>
  );
}
