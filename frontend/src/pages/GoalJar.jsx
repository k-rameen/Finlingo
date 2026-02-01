import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoalJar() {
  const navigate = useNavigate();
  const [goalName, setGoalName] = useState("");
  const [goalPrice, setGoalPrice] = useState("");
  const [savedAmount, setSavedAmount] = useState(0);
  const [addAmount, setAddAmount] = useState("");
  const [goalCreated, setGoalCreated] = useState(false);
  
  useEffect(() => {
    const savedGoal = localStorage.getItem("finlingo_goal");
    if (savedGoal) {
      try {
        const goalData = JSON.parse(savedGoal);
        setGoalName(goalData.name);
        setGoalPrice(goalData.price);
        setSavedAmount(goalData.saved || 0);
        setGoalCreated(true);
      } catch (e) {}
    }
  }, []);
  
  const saveGoal = () => {
    if (!goalName.trim() || !goalPrice || parseFloat(goalPrice) <= 0) {
      alert("🎯 Enter goal name and price!");
      return;
    }
    
    const goalData = {
      name: goalName.trim(),
      price: parseFloat(goalPrice),
      saved: savedAmount,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem("finlingo_goal", JSON.stringify(goalData));
    setGoalCreated(true);
  };
  
  const addToJar = () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      alert("💰 Enter valid amount!");
      return;
    }
    
    const amountToAdd = parseFloat(addAmount);
    const newSaved = savedAmount + amountToAdd;
    const goalPriceNum = parseFloat(goalPrice);
    
    if (newSaved > goalPriceNum) {
      alert("🎉 Goal already reached!");
      return;
    }
    
    setSavedAmount(newSaved);
    setAddAmount("");
    
    const savedGoal = JSON.parse(localStorage.getItem("finlingo_goal") || "{}");
    savedGoal.saved = newSaved;
    localStorage.setItem("finlingo_goal", JSON.stringify(savedGoal));
    
    if (newSaved >= goalPriceNum) {
      setTimeout(() => {
        alert(`🎊 You saved $${goalPriceNum} for ${goalName}!`);
      }, 100);
    }
  };
  
  const resetGoal = () => {
    if (window.confirm("🔄 Reset goal?")) {
      localStorage.removeItem("finlingo_goal");
      setGoalName("");
      setGoalPrice("");
      setSavedAmount(0);
      setAddAmount("");
      setGoalCreated(false);
    }
  };
  
  const progressPercentage = goalPrice ? Math.min((savedAmount / parseFloat(goalPrice)) * 100, 100) : 0;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.centerTitle}>💰 GOAL JAR</div>
        <div style={styles.rightBtns}>
          <button style={styles.homeBtn} onClick={() => navigate("/home")}>🏠 Home</button>
          <button style={styles.settingsBtn} onClick={() => navigate("/settings")}>⚙️</button>
        </div>
      </div>
      
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.title}>🎯 Savings Goal</div>
            <div style={styles.subtitle}>Save money, fill the jar!</div>
          </div>
          
          {!goalCreated ? (
            <div style={styles.setupSection}>
              <div style={styles.sectionTitle}>✨ Create Goal</div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>🎁 Goal name</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="New bike, toy, game"
                  style={styles.input}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>💰 Price</label>
                <input
                  type="number"
                  value={goalPrice}
                  onChange={(e) => setGoalPrice(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  style={styles.input}
                />
              </div>
              
              <button onClick={saveGoal} style={styles.createButton}>🏁 Start Saving</button>
              
              <div style={styles.tipBox}>
                <div style={styles.tipTitle}>💡 Tip</div>
                <div style={styles.tipText}>Start small! $1/day adds up!</div>
              </div>
            </div>
          ) : (
            <div style={styles.jarSection}>
              <div style={styles.goalInfo}>
                <div style={styles.goalHeader}>
                  <div>
                    <div style={styles.goalName}>🎯 {goalName}</div>
                    <div style={styles.goalPrice}>Goal: {formatCurrency(parseFloat(goalPrice))}</div>
                  </div>
                  <button onClick={resetGoal} style={styles.resetButton}>🔄 New</button>
                </div>
                
                <div style={styles.progressStats}>
                  <div style={styles.stat}>
                    <div style={styles.statLabel}>Saved</div>
                    <div style={styles.statValue}>{formatCurrency(savedAmount)}</div>
                  </div>
                  <div style={styles.stat}>
                    <div style={styles.statLabel}>Left</div>
                    <div style={styles.statValue}>{formatCurrency(Math.max(parseFloat(goalPrice) - savedAmount, 0))}</div>
                  </div>
                  <div style={styles.stat}>
                    <div style={styles.statLabel}>%</div>
                    <div style={styles.statValue}>{progressPercentage.toFixed(0)}%</div>
                  </div>
                </div>
                
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${progressPercentage}%`,
                        background: `linear-gradient(135deg, #FFD1DC, #A8D8EA)`
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div style={styles.jarContainer}>
                <div style={styles.jar}>
                  <div 
                    style={{
                      ...styles.jarFill,
                      height: `${progressPercentage}%`,
                      background: `linear-gradient(to top, #FFD1DC, #A8D8EA)`
                    }}
                  />
                  <div style={styles.jarAmount}>{formatCurrency(savedAmount)}</div>
                  <div style={styles.jarLabel}>{progressPercentage >= 100 ? "🎉 FULL!" : "Save more!"}</div>
                </div>
              </div>
              
              <div style={styles.addMoneySection}>
                <div style={styles.sectionTitle}>💵 Add Money</div>
                
                <div style={styles.amountButtons}>
                  {[1, 5, 10, 20].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAddAmount(amount.toString())}
                      style={{
                        ...styles.amountButton,
                        ...(addAmount === amount.toString() ? styles.amountButtonSelected : {})
                      }}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div style={styles.customAmount}>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Custom $"
                    min="0.01"
                    step="0.01"
                    style={styles.customInput}
                  />
                  <button onClick={addToJar} style={styles.addButton} disabled={progressPercentage >= 100}>
                    💰 Add
                  </button>
                </div>
                
                {progressPercentage >= 100 && (
                  <div style={styles.completeMessage}>🎊 GOAL ACHIEVED!</div>
                )}
                
                <div style={styles.encouragement}>
                  {progressPercentage < 25 && "💪 Start small!"}
                  {progressPercentage >= 25 && progressPercentage < 50 && "👍 Good progress!"}
                  {progressPercentage >= 50 && progressPercentage < 75 && "🚀 Halfway!"}
                  {progressPercentage >= 75 && progressPercentage < 100 && "🎯 Almost there!"}
                  {progressPercentage >= 100 && "🥳 CONGRATS!"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFD1DC 0%, #A8D8EA 50%, #C9E4CA 100%)",
    color: "#2C3E50",
    fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", "Segoe UI", sans-serif',
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
  },
  centerTitle: {
    fontSize: 16,
    fontWeight: 900,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  rightBtns: {
    display: "flex",
    gap: 10,
  },
  homeBtn: {
    padding: "10px 16px",
    borderRadius: 14,
    border: "2px solid #FFD1DC",
    background: "#fff",
    color: "#2C3E50",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 14,
  },
  settingsBtn: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "2px solid #A8D8EA",
    background: "#fff",
    color: "#2C3E50",
    fontWeight: 900,
    cursor: "pointer",
  },
  container: {
    flex: 1,
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 600,
    borderRadius: 24,
    background: "#fff",
    border: "3px solid #A8D8EA",
    padding: 24,
    boxShadow: "0 10px 40px rgba(168, 216, 234, 0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 900,
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#5D6D7E",
    fontWeight: 600,
  },
  setupSection: {
    maxWidth: 400,
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "2px solid #A8D8EA",
    background: "#f8fafc",
    color: "#2C3E50",
    fontSize: 16,
    outline: "none",
  },
  createButton: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    color: "#2C3E50",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
    margin: "16px 0",
  },
  tipBox: {
    padding: 16,
    borderRadius: 12,
    border: "2px dashed #C9E4CA",
    background: "rgba(201, 228, 202, 0.2)",
    textAlign: "center",
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: "#5D6D7E",
  },
  jarSection: {
    maxWidth: 500,
    margin: "0 auto",
  },
  goalInfo: {
    marginBottom: 24,
  },
  goalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  goalName: {
    fontSize: 20,
    fontWeight: 900,
  },
  goalPrice: {
    fontSize: 16,
    color: "#5D6D7E",
    fontWeight: 700,
  },
  resetButton: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "2px solid #FFD1DC",
    background: "#fff",
    color: "#2C3E50",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  progressStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 16,
  },
  stat: {
    padding: 12,
    borderRadius: 10,
    background: "#f8fafc",
    border: "2px solid #A8D8EA",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#5D6D7E",
    fontWeight: 600,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 900,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 16,
    borderRadius: 8,
    background: "rgba(168, 216, 234, 0.3)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
    transition: "width 0.3s ease",
  },
  jarContainer: {
    textAlign: "center",
    marginBottom: 24,
  },
  jar: {
    position: "relative",
    width: 150,
    height: 200,
    margin: "0 auto",
    background: "#f8fafc",
    border: "3px solid #FFD1DC",
    borderRadius: "80px 80px 40px 40px",
    overflow: "hidden",
  },
  jarFill: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    transition: "height 0.5s ease",
  },
  jarAmount: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 18,
    fontWeight: 900,
    color: "#2C3E50",
  },
  jarLabel: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 12,
    fontWeight: 700,
  },
  addMoneySection: {
    maxWidth: 400,
    margin: "0 auto",
  },
  amountButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    marginBottom: 12,
  },
  amountButton: {
    padding: 12,
    borderRadius: 10,
    border: "2px solid #C9E4CA",
    background: "#fff",
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  amountButtonSelected: {
    background: "linear-gradient(135deg, #C9E4CA, #A8D8EA)",
  },
  customAmount: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  customInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 10,
    border: "2px solid #A8D8EA",
    background: "#f8fafc",
    color: "#2C3E50",
    fontSize: 14,
    outline: "none",
  },
  addButton: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #FFD1DC, #A8D8EA)",
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },
  completeMessage: {
    padding: 12,
    borderRadius: 10,
    background: "linear-gradient(135deg, #FFD1DC, #FFB7D5)",
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: 900,
    textAlign: "center",
    marginBottom: 12,
  },
  encouragement: {
    padding: 12,
    borderRadius: 10,
    background: "rgba(201, 228, 202, 0.3)",
    color: "#2C3E50",
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
  },
};
