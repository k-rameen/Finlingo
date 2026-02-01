import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Level5() {
  const navigate = useNavigate();
  
  // Game state - simplified
  const [savings, setSavings] = useState(100);
  const [creditDebt, setCreditDebt] = useState(0);
  const [week, setWeek] = useState(1);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTooltip, setShowTooltip] = useState(null);
  const [weeklyIncome] = useState(20);
  const [showIncomeAnimation, setShowIncomeAnimation] = useState(false);
  
  // Simple scenarios with more emojis
  const scenarios = [
    {
      id: 1,
      title: "📱 Phone Emergency",
      description: "Oh no! Your phone screen broke! 😱 Need to fix it.",
      cost: 60,
      emoji: "📱💥",
      options: [
        { 
          id: "pay", 
          emoji: "🛡️💰", 
          label: "Use Savings", 
          desc: "Pay $60 from your emergency fund",
          feedback: "Smart choice! That's what emergency savings are for! 🎉"
        },
        { 
          id: "credit", 
          emoji: "💳😰", 
          label: "Use Credit", 
          desc: "Charge $60 to credit card (+ interest)",
          feedback: "Uh oh! Credit cards charge extra money called interest. 💸"
        },
        { 
          id: "skip", 
          emoji: "📞✨", 
          label: "Use Old Phone", 
          desc: "Dig up your old phone temporarily",
          feedback: "Creative thinking! You saved money by being resourceful! 🌟"
        }
      ]
    },
    {
      id: 2,
      title: "💼 No Paycheck This Week",
      description: "Your part-time job closed this week. 😔 No money coming in!",
      cost: 20,
      emoji: "💼❌",
      options: [
        { 
          id: "savings", 
          emoji: "💰🏦", 
          label: "Use Savings", 
          desc: "Take $20 from emergency fund",
          feedback: "Good job! Emergencies aren't just big things - this counts too! 👍"
        },
        { 
          id: "credit", 
          emoji: "💳📝", 
          label: "Use Credit Card", 
          desc: "Put $20 on credit card",
          feedback: "Credit cards seem easy but they cost more later! 📈"
        },
        { 
          id: "parents", 
          emoji: "👨‍👩‍👧❤️", 
          label: "Ask Family", 
          desc: "Ask family for help",
          feedback: "Great! Asking for help is smart when you need it! 🤗"
        }
      ]
    },
    {
      id: 3,
      title: "🎮 Friend's Birthday Party",
      description: "Your bestie's birthday is at the arcade! 🎉 It costs money to go.",
      cost: 15,
      emoji: "🎂🎮",
      options: [
        { 
          id: "pay", 
          emoji: "🎯💵", 
          label: "Use Savings", 
          desc: "Spend $15 from savings for fun",
          feedback: "It's okay to use savings for fun sometimes! Balance is key! ⚖️"
        },
        { 
          id: "credit", 
          emoji: "💸💳", 
          label: "Use Credit", 
          desc: "Charge $15 to credit card",
          feedback: "Be careful! Credit cards for fun can lead to big debt later! 😬"
        },
        { 
          id: "skip", 
          emoji: "🎁✂️", 
          label: "Make Gift", 
          desc: "Make a homemade gift instead",
          feedback: "Awesome! Homemade gifts are special AND you saved money! 💝"
        }
      ]
    }
  ];
  
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [choiceMade, setChoiceMade] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sparkles, setSparkles] = useState([]);

  // Tooltip content for each stat
  const tooltips = {
    savings: {
      title: "💰 Emergency Savings",
      content: "This is your SAFETY MONEY! 🛡️\n\nIt's like a superhero shield for surprise problems!\n\n✨ Use it for:\n• Broken things 🔧\n• Medical needs 🏥\n• Lost income 💼\n• Real emergencies 🚨\n\nTip: Try to keep saving more!",
      color: "#4caf50"
    },
    debt: {
      title: "💳 Credit Debt",
      content: "This is BORROWED MONEY! 😰\n\nWhen you use a credit card, you're borrowing money that you have to pay back... PLUS EXTRA! 📈\n\n⚠️ The extra is called 'INTEREST'\n\nExample: Borrow $50 → Pay back $55+\n\nTip: Try to keep this at $0!",
      color: "#f44336"
    },
    week: {
      title: "📅 Week Counter",
      content: "This shows how many weeks you've played! 🗓️\n\nEach week brings a NEW CHALLENGE!\n\nYou'll face 3 different scenarios to practice making smart money choices.\n\n🎯 Goal: Make it through all 3 weeks with money left!",
      color: "#2196f3"
    },
    score: {
      title: "⭐ Your Score",
      content: "POINTS for smart choices! 🏆\n\n🌟 Get points for:\n• Using savings wisely (+25)\n• Creative solutions (+20)\n• Avoiding credit cards\n\n😬 Lose points for:\n• Using credit cards (-10)\n\nTry to get the highest score!",
      color: "#ff9800"
    }
  };

  // Create sparkle animation
  const createSparkles = () => {
    const newSparkles = [];
    for (let i = 0; i < 12; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4
      });
    }
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1000);
  };

  // Handle choice
  const handleChoice = (choiceId) => {
    const scenario = scenarios[currentScenarioIndex];
    const option = scenario.options.find(opt => opt.id === choiceId);
    
    let newSavings = savings;
    let newCreditDebt = creditDebt;
    let newScore = score;
    
    if (choiceId === "pay" || choiceId === "savings") {
      if (savings >= scenario.cost) {
        newSavings = savings - scenario.cost;
        newScore += 25;
        if (newSavings > 0) createSparkles();
      }
    } else if (choiceId === "credit") {
      newCreditDebt = creditDebt + scenario.cost;
      newScore -= 10;
    } else {
      newScore += 20;
      createSparkles();
    }
    
    setSavings(newSavings);
    setCreditDebt(newCreditDebt);
    setScore(newScore);
    setFeedback(option.feedback);
    setChoiceMade(true);
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && choiceMade) {
      if (currentScenarioIndex < scenarios.length - 1) {
        // Show income animation before next week
        setShowIncomeAnimation(true);
        setTimeout(() => {
          setSavings(prev => prev + weeklyIncome);
          setShowIncomeAnimation(false);
          createSparkles();
        }, 500);
        
        setTimeout(() => {
          setCurrentScenarioIndex(prev => prev + 1);
          setWeek(prev => prev + 1);
          setChoiceMade(false);
          setFeedback("");
        }, 1500);
      } else {
        setCurrentStep(3);
        setGameCompleted(true);
        createSparkles();
      }
    }
  };

  // Reset game
  const resetGame = () => {
    setSavings(100);
    setCreditDebt(0);
    setWeek(1);
    setScore(0);
    setGameCompleted(false);
    setCurrentScenarioIndex(0);
    setCurrentStep(2);
    setChoiceMade(false);
    setFeedback("");
  };

  const currentScenario = scenarios[currentScenarioIndex];

  // Enhanced styles with more colors and fun elements
  const styles = {
    page: {
      fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      border: "4px solid #a78bfa",
      position: "relative",
      zIndex: 2
    },
    title: {
      background: "linear-gradient(45deg, rgb(173, 145, 245), rgb(136, 111, 250))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontSize: "2.5rem",
      marginBottom: "10px",
      fontWeight: "bold",
      textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "15px",
      marginBottom: "30px",
      position: "relative",
      zIndex: 2
    },
    statCard: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "20px",
      textAlign: "center",
      border: "4px solid",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      position: "relative",
      minHeight: "120px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    statEmoji: {
      fontSize: "3rem",
      marginBottom: "10px",
      animation: "bounce 2s infinite",
      filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.2))"
    },
    statLabel: {
      fontSize: "0.9rem",
      fontWeight: "bold",
      color: "#666",
      marginBottom: "5px"
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "bold",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
    },
    scenarioCard: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "25px",
      marginBottom: "20px",
      border: "5px solid #ff6b6b",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      position: "relative",
      zIndex: 2
    },
    scenarioEmoji: {
      fontSize: "4rem",
      textAlign: "center",
      marginBottom: "15px",
      animation: "pulse 2s infinite",
      filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))"
    },
    options: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
      marginTop: "25px"
    },
    option: {
      backgroundColor: "#f8f9fa",
      padding: "20px",
      borderRadius: "20px",
      border: "4px solid #dee2e6",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textAlign: "center",
      minHeight: "160px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    optionEmoji: {
      fontSize: "3rem",
      marginBottom: "10px",
      animation: "float 3s ease-in-out infinite"
    },
    optionLabel: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "8px",
      textShadow: "1px 1px 1px rgba(0,0,0,0.1)"
    },
    optionDesc: {
      fontSize: "0.85rem",
      color: "#666",
      lineHeight: "1.4"
    },
    button: {
      backgroundColor: "#ff6b6b",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px"
    },
    feedback: {
      backgroundColor: "#e8f5e9",
      padding: "20px",
      borderRadius: "15px",
      marginTop: "20px",
      border: "3px solid #4caf50",
      fontSize: "1.1rem",
      textAlign: "center",
      fontWeight: "bold",
      animation: "slideUp 0.5s ease",
      boxShadow: "0 4px 8px rgba(76, 175, 80, 0.2)"
    },
    tooltip: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      zIndex: 1000,
      maxWidth: "400px",
      border: "4px solid",
      animation: "slideIn 0.3s ease",
      maxHeight: "80vh",
      overflowY: "auto"
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 999,
      animation: "fadeIn 0.3s ease"
    },
    results: {
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "25px",
      textAlign: "center",
      border: "5px solid #feca57",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      position: "relative",
      zIndex: 2,
      animation: "scaleIn 0.5s ease"
    },
    incomeAlert: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#4caf50",
      color: "white",
      padding: "20px 40px",
      borderRadius: "20px",
      fontSize: "1.5rem",
      fontWeight: "bold",
      zIndex: 1001,
      animation: "popIn 0.5s ease, fadeOut 0.5s ease 1s forwards",
      boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
      display: "flex",
      alignItems: "center",
      gap: "15px"
    },
    sparkle: {
      position: "absolute",
      background: "radial-gradient(circle, #FFD700, transparent)",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: 1
    },
    progressContainer: {
      width: "100%",
      height: "10px",
      backgroundColor: "#e0e0e0",
      borderRadius: "5px",
      margin: "20px 0",
      overflow: "hidden"
    },
    progressBar: {
      height: "100%",
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      borderRadius: "5px",
      transition: "width 0.5s ease",
      width: `${((currentScenarioIndex + (choiceMade ? 1 : 0)) / scenarios.length) * 100}%`
    },
    character: {
      position: "absolute",
      fontSize: "3rem",
      animation: "float 6s ease-in-out infinite",
      zIndex: 1,
      filter: "drop-shadow(0 4px 4px rgba(0,0,0,0.3))"
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated background characters */}
      <div style={{...styles.character, top: "10%", left: "5%", animationDelay: "0s"}}>🦸‍♂️</div>
      <div style={{...styles.character, top: "15%", right: "10%", animationDelay: "1s"}}>💰</div>
      <div style={{...styles.character, bottom: "20%", left: "15%", animationDelay: "2s"}}>🛡️</div>
      <div style={{...styles.character, bottom: "10%", right: "5%", animationDelay: "3s"}}>🎯</div>

      {/* Sparkles animation */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          style={{
            ...styles.sparkle,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animation: `sparkle ${0.5 + Math.random()}s ease-out`
          }}
        />
      ))}

      {/* Income Alert Animation */}
      {showIncomeAnimation && (
        <div style={styles.incomeAlert}>
          <span style={{fontSize: "2rem"}}>💰</span>
          Weekly Income: +${weeklyIncome}
          <span style={{fontSize: "2rem"}}>🎉</span>
        </div>
      )}

      {/* Tooltip Overlay */}
      {showTooltip && (
        <>
          <div style={styles.overlay} onClick={() => setShowTooltip(null)} />
          <div style={{...styles.tooltip, borderColor: tooltips[showTooltip].color}}>
            <h2 style={{marginTop: 0, color: tooltips[showTooltip].color, fontSize: "1.5rem"}}>
              {tooltips[showTooltip].title}
            </h2>
            <p style={{whiteSpace: "pre-line", lineHeight: "1.6", fontSize: "1rem", color: "#333"}}>
              {tooltips[showTooltip].content}
            </p>
            <button 
              onClick={() => setShowTooltip(null)} 
              style={{...styles.button, marginTop: "15px", backgroundColor: tooltips[showTooltip].color}}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            >
              Got it! ✓
            </button>
          </div>
        </>
      )}

      {/* Back Button */}
      <button 
        onClick={() => navigate("/home")}
        style={{...styles.button, backgroundColor: "#6c5ce7", marginBottom: "20px"}}
        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
      >
        ← 🏠 Back Home
      </button>

      {/* Main Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>💰 Emergency Fund Adventure! 💰</h1>
        <p style={{fontSize: "1.2rem", color: "#666"}}>Learn to handle money surprises like a superhero! 🦸‍♀️🦸‍♂️</p>
        
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBar} />
        </div>
        <p style={{fontSize: "0.9rem", color: "#666", marginTop: "5px"}}>
          Progress: {currentScenarioIndex + (choiceMade ? 1 : 0)} of {scenarios.length} scenarios
        </p>
      </header>

      {/* Stats - Now Clickable! */}
      <div style={styles.stats}>
        <div 
          style={{...styles.statCard, borderColor: "#4caf50"}}
          onClick={() => setShowTooltip('savings')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(76, 175, 80, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
          }}
        >
          <div style={styles.statEmoji}>💰</div>
          <div style={styles.statLabel}>Emergency Savings</div>
          <div style={{...styles.statValue, color: "#4caf50"}}>${savings}</div>
          <div style={{fontSize: "0.8rem", color: "#999", marginTop: "5px"}}>👆 Click to learn!</div>
        </div>
        
        <div 
          style={{...styles.statCard, borderColor: "#f44336"}}
          onClick={() => setShowTooltip('debt')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(244, 67, 54, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
          }}
        >
          <div style={styles.statEmoji}>💳</div>
          <div style={styles.statLabel}>Credit Debt</div>
          <div style={{...styles.statValue, color: "#f44336"}}>${creditDebt}</div>
          <div style={{fontSize: "0.8rem", color: "#999", marginTop: "5px"}}>👆 Click to learn!</div>
        </div>
        
        <div 
          style={{...styles.statCard, borderColor: "#2196f3"}}
          onClick={() => setShowTooltip('week')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(33, 150, 243, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
          }}
        >
          <div style={styles.statEmoji}>📅</div>
          <div style={styles.statLabel}>Week</div>
          <div style={{...styles.statValue, color: "#2196f3"}}>{week}/3</div>
          <div style={{fontSize: "0.8rem", color: "#999", marginTop: "5px"}}>👆 Click to learn!</div>
        </div>
        
        <div 
          style={{...styles.statCard, borderColor: "#ff9800"}}
          onClick={() => setShowTooltip('score')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(255, 152, 0, 0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
          }}
        >
          <div style={styles.statEmoji}>⭐</div>
          <div style={styles.statLabel}>Score</div>
          <div style={{...styles.statValue, color: "#ff9800"}}>{score}</div>
          <div style={{fontSize: "0.8rem", color: "#999", marginTop: "5px"}}>👆 Click to learn!</div>
        </div>
      </div>

      {/* Intro Step */}
      {currentStep === 1 && (
        <div style={styles.scenarioCard}>
          <div style={{fontSize: "5rem", textAlign: "center", marginBottom: "20px", animation: "pulse 2s infinite"}}>
            🛡️✨🦸‍♂️
          </div>
          <h2 style={{fontSize: "2rem", textAlign: "center", color: "#667eea", marginBottom: "20px"}}>
            Welcome, Money Hero! 🦸
          </h2>
          <div style={{backgroundColor: "#f0f4ff", padding: "20px", borderRadius: "15px", marginBottom: "25px"}}>
            <p style={{fontSize: "1.2rem", lineHeight: "1.8", color: "#555", textAlign: "center"}}>
              <span style={{color: "#667eea", fontWeight: "bold"}}>Life is full of surprises! 🎉😱</span><br/>
              Some are good, some are tricky!<br/><br/>
              <span style={{color: "#4caf50", fontWeight: "bold"}}>Your mission:</span> Learn to handle money emergencies<br/>
              using your <span style={{color: "#ff6b6b", fontWeight: "bold"}}>EMERGENCY SAVINGS!</span> 💰🛡️<br/><br/>
              <span style={{color: "#ff9800", fontWeight: "bold"}}>Ready to become a savings superhero?</span>
            </p>
          </div>
          <div style={{textAlign: "center"}}>
            <button 
              onClick={handleNext} 
              style={{
                ...styles.button, 
                marginTop: "20px", 
                fontSize: "1.3rem",
                background: "linear-gradient(45deg, #ff6b6b, #ff8e53)",
                padding: "20px 40px"
              }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.1) rotate(2deg)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1) rotate(0deg)"}
            >
              🚀 Start Adventure! →
            </button>
          </div>
        </div>
      )}

      {/* Game Step */}
      {currentStep === 2 && !gameCompleted && (
        <div style={styles.scenarioCard}>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "1.1rem", flexWrap: "wrap", gap: "10px"}}>
            <span style={{backgroundColor: "#e3f2fd", padding: "12px 24px", borderRadius: "25px", fontWeight: "bold", border: "3px solid #2196f3"}}>
              📅 Week {week} of 3
            </span>
            <span style={{backgroundColor: "#fff3e0", padding: "12px 24px", borderRadius: "25px", fontWeight: "bold", border: "3px solid #ff9800"}}>
              💵 Cost: ${currentScenario.cost}
            </span>
            <span style={{backgroundColor: "#f3e5f5", padding: "12px 24px", borderRadius: "25px", fontWeight: "bold", border: "3px solid #9c27b0"}}>
              💰 Savings: ${savings}
            </span>
          </div>
          
          <div style={styles.scenarioEmoji}>{currentScenario.emoji}</div>
          <h2 style={{fontSize: "2rem", color: "#ff6b6b", textAlign: "center", marginBottom: "15px"}}>
            {currentScenario.title}
          </h2>
          <div style={{backgroundColor: "#fff8e1", padding: "20px", borderRadius: "15px", border: "3px dashed #ffb74d"}}>
            <p style={{fontSize: "1.2rem", textAlign: "center", color: "#555", margin: 0, lineHeight: "1.6"}}>
              {currentScenario.description}
            </p>
          </div>
          
          <h3 style={{fontSize: "1.5rem", color: "#667eea", textAlign: "center", margin: "30px 0 20px 0"}}>
            What will you do? 🤔
          </h3>
          
          <div style={styles.options}>
            {currentScenario.options.map((option) => (
              <button
                key={option.id}
                style={{
                  ...styles.option,
                  borderColor: choiceMade ? "#ccc" : "#6c5ce7",
                  opacity: choiceMade ? 0.6 : 1,
                  transform: choiceMade ? "scale(0.95)" : "scale(1)"
                }}
                onClick={() => !choiceMade && handleChoice(option.id)}
                disabled={choiceMade}
                onMouseOver={(e) => {
                  if (!choiceMade) {
                    e.currentTarget.style.transform = "scale(1.05) rotate(1deg)";
                    e.currentTarget.style.borderColor = "#ff6b6b";
                    e.currentTarget.style.backgroundColor = "#fff8e1";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!choiceMade) {
                    e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                    e.currentTarget.style.borderColor = "#6c5ce7";
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <div style={styles.optionEmoji}>{option.emoji}</div>
                <div style={styles.optionLabel}>{option.label}</div>
                <div style={styles.optionDesc}>{option.desc}</div>
              </button>
            ))}
          </div>
          
          {choiceMade && (
            <div style={styles.feedback}>
              <div style={{fontSize: "2.5rem", marginBottom: "15px", animation: "bounce 1s infinite"}}>
                {score >= 0 ? "🎉" : "😅"}
              </div>
              <p style={{margin: "0 0 20px 0", lineHeight: "1.6"}}>
                {feedback}
              </p>
              <button 
                onClick={handleNext} 
                style={{
                  ...styles.button, 
                  background: "linear-gradient(45deg, #4caf50, #8bc34a)",
                  fontSize: "1.2rem",
                  padding: "15px 35px"
                }}
                onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              >
                {currentScenarioIndex < scenarios.length - 1 ? "⏭️ Next Week →" : "🏆 See Results →"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Step */}
      {currentStep === 3 && gameCompleted && (
        <div style={styles.results}>
          <div style={{fontSize: "5rem", marginBottom: "20px", animation: "celebrate 1s ease-in-out infinite"}}>
            🎊🎉🏆
          </div>
          <h2 style={{fontSize: "2.5rem", color: "#feca57", marginBottom: "15px", textShadow: "2px 2px 4px rgba(0,0,0,0.2)"}}>
            Adventure Complete! ✨
          </h2>
          <p style={{fontSize: "1.3rem", color: "#666", marginBottom: "30px"}}>
            You made it through all 3 weeks! 🎯<br/>
            Here's how you did:
          </p>
          
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px", margin: "30px 0"}}>
            <div style={{backgroundColor: "#e8f5e9", padding: "25px", borderRadius: "20px", border: "4px solid #4caf50", boxShadow: "0 6px 12px rgba(76, 175, 80, 0.2)"}}>
              <div style={{fontSize: "3.5rem", marginBottom: "15px", animation: "float 3s ease-in-out infinite"}}>💰</div>
              <div style={{fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#333"}}>Final Savings</div>
              <div style={{fontSize: "2.5rem", fontWeight: "bold", color: "#4caf50", marginBottom: "10px"}}>${savings}</div>
              <div style={{fontSize: "1rem", color: "#666", padding: "8px", backgroundColor: "white", borderRadius: "10px"}}>
                {savings >= 80 ? "🌟 Excellent! You're a savings pro!" : savings >= 50 ? "👍 Good job! Keep it up!" : "💪 Great start! Practice makes perfect!"}
              </div>
            </div>
            
            <div style={{backgroundColor: "#ffebee", padding: "25px", borderRadius: "20px", border: "4px solid #f44336", boxShadow: "0 6px 12px rgba(244, 67, 54, 0.2)"}}>
              <div style={{fontSize: "3.5rem", marginBottom: "15px", animation: "float 3s ease-in-out infinite", animationDelay: "0.5s"}}>💳</div>
              <div style={{fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#333"}}>Final Debt</div>
              <div style={{fontSize: "2.5rem", fontWeight: "bold", color: "#f44336", marginBottom: "10px"}}>${creditDebt}</div>
              <div style={{fontSize: "1rem", color: "#666", padding: "8px", backgroundColor: "white", borderRadius: "10px"}}>
                {creditDebt === 0 ? "🎉 Perfect! Debt-free champion!" : creditDebt < 50 ? "😊 Not bad! Keep practicing!" : "⚠️ Try to avoid credit next time!"}
              </div>
            </div>
            
            <div style={{backgroundColor: "#fff3e0", padding: "25px", borderRadius: "20px", border: "4px solid #ff9800", boxShadow: "0 6px 12px rgba(255, 152, 0, 0.2)"}}>
              <div style={{fontSize: "3.5rem", marginBottom: "15px", animation: "float 3s ease-in-out infinite", animationDelay: "1s"}}>⭐</div>
              <div style={{fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#333"}}>Final Score</div>
              <div style={{fontSize: "2.5rem", fontWeight: "bold", color: "#ff9800", marginBottom: "10px"}}>{score}</div>
              <div style={{fontSize: "1rem", color: "#666", padding: "8px", backgroundColor: "white", borderRadius: "10px"}}>
                {score >= 60 ? "🏆 Amazing! You're a money master!" : score >= 30 ? "👏 Great! You're learning fast!" : "💪 Good start! You'll get better!"}
              </div>
            </div>
          </div>
          
          <div style={{marginBottom: "40px", padding: "25px", backgroundColor: "#e3f2fd", borderRadius: "20px", border: "4px solid #2196f3", boxShadow: "0 6px 12px rgba(33, 150, 243, 0.2)"}}>
            <p style={{fontSize: "1.4rem", fontWeight: "bold", marginBottom: "20px", color: "#1976d2", textAlign: "center"}}>
              💡 What You Learned:
            </p>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px"}}>
              <div style={{backgroundColor: "white", padding: "15px", borderRadius: "15px", border: "2px solid #4caf50"}}>
                <div style={{fontSize: "2rem", marginBottom: "10px"}}>🛡️</div>
                <div style={{fontWeight: "bold", marginBottom: "5px"}}>Emergency Savings</div>
                <div style={{fontSize: "0.9rem", color: "#666"}}>Your safety net for surprises!</div>
              </div>
              <div style={{backgroundColor: "white", padding: "15px", borderRadius: "15px", border: "2px solid #f44336"}}>
                <div style={{fontSize: "2rem", marginBottom: "10px"}}>💸</div>
                <div style={{fontWeight: "bold", marginBottom: "5px"}}>Credit Costs Extra</div>
                <div style={{fontSize: "0.9rem", color: "#666"}}>Credit cards charge interest!</div>
              </div>
              <div style={{backgroundColor: "white", padding: "15px", borderRadius: "15px", border: "2px solid #ff9800"}}>
                <div style={{fontSize: "2rem", marginBottom: "10px"}}>💭</div>
                <div style={{fontWeight: "bold", marginBottom: "5px"}}>Creative Solutions</div>
                <div style={{fontSize: "0.9rem", color: "#666"}}>Save money by thinking differently!</div>
              </div>
            </div>
          </div>
          
          <div style={{display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px"}}>
            <button 
              onClick={resetGame} 
              style={{
                ...styles.button, 
                backgroundColor: "#4caf50", 
                fontSize: "1.2rem",
                padding: "18px 40px",
                background: "linear-gradient(45deg, #4caf50, #8bc34a)"
              }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            >
              🔄 Play Again
            </button>
            <button 
              onClick={() => navigate("/home")} 
              style={{
                ...styles.button, 
                backgroundColor: "#6c5ce7", 
                fontSize: "1.2rem",
                padding: "18px 40px",
                background: "linear-gradient(45deg, #6c5ce7, #a78bfa)"
              }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
            >
              🏠 Back Home
            </button>
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes slideIn {
            from {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0;
            }
            to {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.9; }
          }
          
          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes scaleIn {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes popIn {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
            }
            70% {
              transform: translate(-50%, -50%) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            to {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.9);
            }
          }
          
          @keyframes sparkle {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0;
            }
          }
          
          @keyframes celebrate {
            0%, 100% {
              transform: scale(1) rotate(0deg);
            }
            25% {
              transform: scale(1.1) rotate(-10deg);
            }
            75% {
              transform: scale(1.1) rotate(10deg);
            }
          }
          
          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </div>
  );
}
