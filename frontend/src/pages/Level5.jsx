import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Level5() {
  const navigate = useNavigate();
  
  // Game state
  const [savings, setSavings] = useState(100);
  const [weeklyIncome, setWeeklyIncome] = useState(20);
  const [creditDebt, setCreditDebt] = useState(0);
  const [creditInterest, setCreditInterest] = useState(0);
  const [week, setWeek] = useState(1);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  // Animation states
  const [moneyAnimation, setMoneyAnimation] = useState(false);
  const [debtAnimation, setDebtAnimation] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Intro, 2: Scenario, 3: Results
  const [stepFeedback, setStepFeedback] = useState("");
  const [stepExplanation, setStepExplanation] = useState("");
  const [currentChoice, setCurrentChoice] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  
  // Scenarios with more detail
  const scenarios = [
    {
      id: 1,
      title: "📱 Phone Emergency",
      description: "Your phone slipped and the screen shattered! You need it for school and contacting family.",
      cost: 60,
      week: 1,
      options: [
        { 
          id: "pay", 
          label: "🛡️ Use Emergency Fund", 
          description: "Pay $60 from savings. This is what savings are for!" 
        },
        { 
          id: "credit", 
          label: "💳 Use Credit Card", 
          description: "Charge $60 to credit card. Pay later with interest." 
        },
        { 
          id: "skip", 
          label: "📞 Use Backup Phone", 
          description: "Use old phone temporarily. Save money but less convenient." 
        }
      ],
      consequences: {
        pay: "Phone fixed immediately. Savings used properly!",
        credit: "Phone fixed but debt added. Interest will grow if not paid.",
        skip: "Saved money but phone is slow. Good short-term solution."
      }
    },
    {
      id: 2,
      title: "💼 Income Interruption",
      description: "Your part-time job at the cafe closed for renovations this week. No paycheck!",
      cost: 20, // Lost income
      week: 2,
      options: [
        { 
          id: "savings", 
          label: "💰 Use Savings", 
          description: "Withdraw $20 from emergency fund for expenses" 
        },
        { 
          id: "credit", 
          label: "📝 Charge Expenses", 
          description: "Put $20 of expenses on credit card" 
        },
        { 
          id: "parents", 
          label: "👨‍👩‍👧 Ask for Help", 
          description: "Parents help cover this week's expenses" 
        }
      ],
      consequences: {
        savings: "Emergency fund working! Covered expenses without debt.",
        credit: "More debt added. Credit score might be affected.",
        parents: "Family helped out. No debt but relying on others."
      }
    },
    {
      id: 3,
      title: "🎉 Social Pressure",
      description: "Best friend's birthday party at arcade + pizza. Everyone is going!",
      cost: 15,
      week: 3,
      options: [
        { 
          id: "pay", 
          label: "🎯 Use Savings", 
          description: "Spend $15 from savings for fun with friends" 
        },
        { 
          id: "credit", 
          label: "💸 Put on Credit", 
          description: "Charge $15 to credit. Fun now, pay later." 
        },
        { 
          id: "skip", 
          label: "🎁 Homemade Gift", 
          description: "Make a card & gift. Celebrate differently." 
        }
      ],
      consequences: {
        pay: "Had fun with friends! Responsible spending.",
        credit: "More debt for entertainment. Could add up.",
        skip: "Creative solution! Saved money & still celebrated."
      }
    }
  ];
  
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarioHistory, setScenarioHistory] = useState([]);
  const [showIncome, setShowIncome] = useState(false);
  const [currentScenarioCompleted, setCurrentScenarioCompleted] = useState(false);
  
  const currentScenario = scenarios[currentScenarioIndex];
  
  // Create sparkles
  const createSparkles = () => {
    const newSparkles = [];
    for (let i = 0; i < 15; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        duration: Math.random() * 1 + 0.5
      });
    }
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1000);
  };
  
  // Handle Next button click
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && currentScenarioCompleted) {
      if (currentScenarioIndex < scenarios.length - 1) {
        // Move to next scenario
        setCurrentScenarioIndex(currentScenarioIndex + 1);
        setWeek(week + 1);
        setCurrentStep(2);
        setCurrentScenarioCompleted(false);
        setCurrentChoice("");
        setStepFeedback("");
        setStepExplanation("");
        setShowNextButton(false);
        setShowIncome(true);
      } else {
        // All scenarios completed
        setCurrentStep(3);
        endGame();
      }
    }
  };
  
  // Handle scenario choice
  const handleChoice = (choiceId) => {
    setCurrentChoice(choiceId);
    const scenario = currentScenario;
    let newSavings = savings;
    let newCreditDebt = creditDebt;
    let newCreditInterest = creditInterest;
    let newScore = score;
    let message = "";
    let explanationText = "";
    let isGoodChoice = false;
    
    switch(choiceId) {
      case "pay":
      case "savings":
        if (savings >= scenario.cost) {
          newSavings = savings - scenario.cost;
          message = `✅ Emergency fund worked! -$${scenario.cost}`;
          explanationText = scenario.consequences[choiceId];
          newScore += 25;
          isGoodChoice = true;
          setMoneyAnimation(true);
          setTimeout(() => setMoneyAnimation(false), 1000);
        } else {
          message = `❌ Not enough savings! Need $${scenario.cost}, have $${savings}`;
          explanationText = "Without enough savings, you might need to use credit or skip.";
          newScore -= 15;
        }
        break;
        
      case "credit":
        newCreditDebt = creditDebt + scenario.cost;
        // If debt goes over $40, add interest (more realistic)
        if (newCreditDebt > 40) {
          const interest = scenario.cost * 0.15; // 15% interest
          newCreditInterest = creditInterest + interest;
          message = `⚠️ Added debt: $${scenario.cost} + $${interest.toFixed(2)} interest`;
          explanationText = scenario.consequences[choiceId] + ` Interest grows debt faster!`;
          newScore -= 20;
          setDebtAnimation(true);
          setTimeout(() => setDebtAnimation(false), 1000);
        } else {
          message = `📝 Charged $${scenario.cost} to credit`;
          explanationText = scenario.consequences[choiceId];
          newScore -= 10;
        }
        break;
        
      case "skip":
      case "parents":
        message = `👍 Smart choice! Saved $${scenario.cost}`;
        explanationText = scenario.consequences[choiceId];
        newScore += 20;
        isGoodChoice = true;
        if (isGoodChoice) createSparkles();
        break;
    }
    
    // Add to history
    setScenarioHistory([...scenarioHistory, {
      scenario: scenario.title,
      choice: scenario.options.find(o => o.id === choiceId)?.label,
      cost: scenario.cost,
      result: message,
      explanation: explanationText
    }]);
    
    // Update state
    setSavings(newSavings);
    setCreditDebt(newCreditDebt);
    setCreditInterest(newCreditInterest);
    setScore(newScore);
    setStepFeedback(message);
    setStepExplanation(explanationText);
    setCurrentScenarioCompleted(true);
    setShowNextButton(true);
  };
  
  // End game and calculate results
  // End game and calculate results
const endGame = () => {
  let finalScore = score;
  let finalCoins = 0;
  let finalMessage = "";
  
  // Calculate coins (30-60 range)
  finalCoins = Math.max(30, Math.min(60, Math.floor(finalScore / 3)));
  
  // Bonus for having savings left - INCREASED BONUS
    if (savings >= 70) {
        finalScore += 40; // Increased from 30
        finalMessage = "🎉 PERFECT SCORE! You're an emergency fund master!";
    } else if (savings > 50) {
        finalScore += 30;
        finalMessage = "🎉 Excellent! You handled emergencies like a pro!";
    } else if (savings > 0) {
        finalScore += 20; // Increased from 10
        finalMessage = "👍 Well done! You made smart choices and avoided debt.";
    } else {
        finalMessage = "💡 Good effort! Remember: build savings before emergencies happen.";
    }
  
  setScore(finalScore);
  setCoins(finalCoins);
  setGameCompleted(true);
  setShowConfetti(true);
  
  // Mark lesson as completed - IMPORTANT: Save with star rating
  if (!lessonCompleted) {
    setLessonCompleted(true);
    
    // Save that level 5 is completed
    localStorage.setItem("finlingo_last_completed_level", "5");
    localStorage.setItem("finlingo_unlocked_level", "6");
    
    // Save star rating for level 5
    let stars = 1; // Default 1 star
    if (savings >= 70) {
      stars = 3; // 3 stars for excellent savings
    } else if (savings >= 40) {
      stars = 2; // 2 stars for good savings
    }
    
    // Save level 5 stars
    const levelStars = JSON.parse(localStorage.getItem("finlingo_level_stars") || "{}");
    levelStars["5"] = stars;
    localStorage.setItem("finlingo_level_stars", JSON.stringify(levelStars));
    
    // Save total coins
    const currentTotalCoins = parseInt(localStorage.getItem("finlingo_total_coins") || "0");
    localStorage.setItem("finlingo_total_coins", (currentTotalCoins + finalCoins).toString());
    
    setTimeout(() => setShowConfetti(false), 5000);
  }
};
  
  // Add weekly income
  useEffect(() => {
    if (showIncome && week > 1) {
      const timer = setTimeout(() => {
        setSavings(prev => prev + weeklyIncome);
        setShowIncome(false);
        createSparkles();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showIncome, week, weeklyIncome]);
  
  // Reset game
  // Reset game - but keep saved progress
const resetGame = () => {
  setSavings(100);
  setWeeklyIncome(20);
  setCreditDebt(0);
  setCreditInterest(0);
  setWeek(1);
  setScore(0);
  setCoins(0);
  setGameCompleted(false);
  setCurrentScenarioIndex(0);
  setScenarioHistory([]);
  setCurrentStep(2); // Start at scenario step, not intro
  setCurrentChoice("");
  setStepFeedback("");
  setStepExplanation("");
  setCurrentScenarioCompleted(false);
  setShowNextButton(false);
  setShowIncome(false);
  setShowConfetti(false);
    };
  
  const handleBackToHome = () => {
    navigate("/home");
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes sparkle {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes moneyFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(0.5); opacity: 0; }
        }
        @keyframes debtShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .money-animation {
          animation: moneyFloat 1s ease-out;
          position: absolute;
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
          pointer-events: none;
        }
        .debt-animation {
          animation: debtShake 0.5s ease;
        }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .floating { animation: float 3s ease-in-out infinite; }
        .step-indicator {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 25px;
        }
        .step-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.3);
          border: 2px solid rgba(255,255,255,0.5);
          transition: all 0.3s ease;
        }
        .step-dot.active {
          background-color: #9370db;
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
        }
        .step-dot.completed {
          background-color: #4CAF50;
        }
        .instructions-list li {
          margin-bottom: 10px;
          line-height: 1.5;
        }
      `}</style>

      {/* Confetti */}
      {showConfetti && [...Array(80)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}vw`,
            backgroundColor: ['#FFD700', '#9370db', '#7b68ee', '#6a5acd', '#4b0082'][Math.floor(Math.random() * 5)],
            animation: `confetti-fall ${1 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
            width: `${8 + Math.random() * 12}px`,
            height: `${8 + Math.random() * 12}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            position: 'fixed',
            top: '-20px',
            zIndex: 9999,
          }}
        />
      ))}
      
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          style={{
            position: 'absolute',
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: 'radial-gradient(circle, #FFD700, transparent)',
            borderRadius: '50%',
            animation: `sparkle ${sparkle.duration}s ease-out`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Back Button */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleBackToHome}>
          ← Back to Home
        </button>
      </div>

      {/* Main Header */}
      <header style={styles.mainHeader}>
        <h1 style={styles.mainTitle}>🆘 Level 5: Emergency Fund Challenge</h1>
        <p style={styles.mainSubtitle}>Learn to handle unexpected expenses without going broke!</p>
      </header>

      {/* Stats Bar */}
      <div style={styles.statsContainer}>
        <div style={styles.statCards}>
          <div style={styles.statCard}>
            <span className="floating" style={styles.statIcon}>💰</span>
            <div style={styles.statContent}>
              <h3 style={styles.statLabel}>Emergency Savings</h3>
              <p style={styles.statValue}>${savings}</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <span className="floating" style={styles.statIcon}>💳</span>
            <div style={styles.statContent}>
              <h3 style={styles.statLabel}>Credit Debt</h3>
              <p style={styles.statValue}>${creditDebt}</p>
              {creditInterest > 0 && (
                <p style={styles.interestText}>+${creditInterest.toFixed(2)} interest</p>
              )}
            </div>
          </div>
          
          <div style={styles.statCard}>
            <span className="floating" style={styles.statIcon}>📅</span>
            <div style={styles.statContent}>
              <h3 style={styles.statLabel}>Week</h3>
              <p style={styles.statValue}>{week}/3</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <span className="floating" style={styles.statIcon}>⭐</span>
            <div style={styles.statContent}>
              <h3 style={styles.statLabel}>Score</h3>
              <p style={styles.statValue}>{score}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator">
        {[1, 2, 3].map((step) => (
          <div 
            key={step} 
            className={`step-dot ${currentStep > step ? 'completed' : ''} ${currentStep === step ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {currentStep === 1 && (
          <section style={styles.introSection}>
            <div style={styles.introCard}>
              <div style={styles.introHeader}>
                <span style={styles.introIcon}>🛡️</span>
                <h2 style={styles.introTitle}>Welcome to Emergency Fund Training!</h2>
              </div>
              
              <div style={styles.introContent}>
                <p style={styles.introText}>
                  Life is full of surprises! Learn how to handle unexpected expenses without stress.
                </p>
                
                <div style={styles.instructionsBox}>
                  <h3 style={styles.instructionsTitle}>📚 How to Play:</h3>
                  <ul className="instructions-list">
                    <li>You start with <strong>${savings} emergency savings</strong></li>
                    <li>Earn <strong>${weeklyIncome}/week</strong> income</li>
                    <li>Each week brings an unexpected expense</li>
                    <li>Choose the best way to handle it</li>
                    <li>Try to keep savings healthy!</li>
                  </ul>
                </div>
                
                <div style={styles.tipsBox}>
                  <h3 style={styles.tipsTitle}>💡 Key Tips:</h3>
                  <div style={styles.tipsGrid}>
                    <div style={styles.tipCard}>
                      <span style={styles.tipIcon}>🛡️</span>
                      <p>Use savings for <strong>real emergencies</strong></p>
                    </div>
                    <div style={styles.tipCard}>
                      <span style={styles.tipIcon}>⚠️</span>
                      <p>Credit cards add <strong>debt + interest</strong></p>
                    </div>
                    <div style={styles.tipCard}>
                      <span style={styles.tipIcon}>🎯</span>
                      <p>Sometimes <strong>creative solutions</strong> save money</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  style={styles.nextButton}
                  onClick={handleNextStep}
                >
                  Start Challenge ➡️
                </button>
              </div>
            </div>
          </section>
        )}

        {currentStep === 2 && !gameCompleted && (
          <section style={styles.scenarioSection}>
            {/* Income Alert */}
            {showIncome && (
              <div style={styles.incomeAlert} className="pulse">
                <span style={styles.incomeIcon}>💰</span>
                Weekly Income Received: <strong>+${weeklyIncome}</strong>
                <span style={styles.incomeIcon}>💰</span>
              </div>
            )}

            {/* Scenario Card */}
            <div style={styles.scenarioCard}>
              <div style={styles.scenarioHeader}>
                <div style={styles.scenarioWeek}>Week {currentScenario.week}</div>
                <div style={styles.scenarioCost}>${currentScenario.cost}</div>
              </div>
              
              <div style={styles.scenarioContent}>
                <div style={styles.scenarioIcon}>{currentScenario.title.split(' ')[0]}</div>
                <h2 style={styles.scenarioTitle}>{currentScenario.title}</h2>
                <p style={styles.scenarioDescription}>{currentScenario.description}</p>
                
                <div style={styles.emergencyBadge}>
                  ⚠️ Emergency Expense: ${currentScenario.cost}
                </div>
              </div>
              
              {/* Options */}
              <div style={styles.optionsGrid}>
                {currentScenario.options.map((option) => (
                  <button
                    key={option.id}
                    style={{
                      ...styles.optionCard,
                      ...(currentChoice === option.id ? {
                        borderColor: option.id.includes('pay') || option.id.includes('savings') ? '#4CAF50' :
                                    option.id.includes('credit') ? '#F44336' : '#FF9800',
                        transform: 'scale(1.02)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                      } : {}),
                      ...(currentScenarioCompleted ? styles.optionDisabled : {})
                    }}
                    onClick={() => !currentScenarioCompleted && handleChoice(option.id)}
                    disabled={currentScenarioCompleted}
                  >
                    <div style={styles.optionHeader}>
                      <div style={styles.optionIcon}>{option.label.split(' ')[0]}</div>
                      <div style={styles.optionLabel}>{option.label.split(' ').slice(1).join(' ')}</div>
                    </div>
                    <div style={styles.optionDescription}>{option.description}</div>
                    {option.id.includes('credit') && creditDebt > 40 && (
                      <div style={styles.warningText}>⚠️ Will add 15% interest!</div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Feedback */}
              {stepFeedback && (
                <div style={styles.feedbackBox}>
                  <h3 style={styles.feedbackTitle}>Your Choice Result:</h3>
                  <div style={styles.feedbackMessage}>{stepFeedback}</div>
                  {stepExplanation && (
                    <div style={styles.explanationBox}>
                      <strong>Why this matters:</strong> {stepExplanation}
                    </div>
                  )}
                  
                  {showNextButton && (
                    <button 
                      style={styles.nextButton}
                      onClick={handleNextStep}
                    >
                      {currentScenarioIndex < scenarios.length - 1 ? 'Next Week ➡️' : 'See Results ➡️'}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Decision History */}
            {scenarioHistory.length > 0 && (
              <div style={styles.historyCard}>
                <h3 style={styles.historyTitle}>📊 Your Decision History:</h3>
                {scenarioHistory.map((item, index) => (
                  <div key={index} style={styles.historyItem}>
                    <div style={styles.historyHeader}>
                      <strong style={styles.historyScenario}>{item.scenario}</strong>
                      <span style={styles.historyCost}>${item.cost}</span>
                    </div>
                    <div style={styles.historyChoice}>→ {item.choice}</div>
                    <div style={styles.historyResult}>{item.result}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {currentStep === 3 && gameCompleted && (
          <section style={styles.resultsSection}>
            <div style={styles.resultsCard} className="pulse">
              <div style={styles.resultsHeader}>
                <h2 style={styles.resultsTitle}>🎓 Emergency Fund Mastered!</h2>
                <div style={styles.coinsBadge}>
                  <span style={styles.coinsIcon}>🪙</span>
                  {coins} Coins Earned!
                </div>
              </div>
              
              <div style={styles.resultsGrid}>
                <div style={styles.resultCard}>
                  <div style={styles.resultIcon}>💰</div>
                  <div style={styles.resultLabel}>Final Savings</div>
                  <div style={styles.resultValue}>${savings}</div>
                  <div style={styles.resultSubtext}>
                    {savings >= 70 ? "Excellent! 🏆" : savings >= 40 ? "Good! 👍" : "Keep building! 💪"}
                  </div>
                </div>
                
                <div style={styles.resultCard}>
                  <div style={styles.resultIcon}>💳</div>
                  <div style={styles.resultLabel}>Credit Debt</div>
                  <div style={styles.resultValue}>${creditDebt}</div>
                  <div style={styles.resultSubtext}>
                    {creditDebt === 0 ? "Debt-free! 🎉" : creditDebt <= 30 ? "Manageable" : "High debt ⚠️"}
                  </div>
                </div>
                
                <div style={styles.resultCard}>
                  <div style={styles.resultIcon}>⭐</div>
                  <div style={styles.resultLabel}>Final Score</div>
                  <div style={styles.resultValue}>{score}</div>
                  <div style={styles.resultSubtext}>
                    {score >= 80 ? "A+ Performance!" : score >= 60 ? "Good Job!" : "Learning!"}
                  </div>
                </div>
              </div>
              
              <div style={styles.lessonBox}>
                <h3 style={styles.lessonTitle}>📚 Key Lessons Learned:</h3>
                <div style={styles.lessonGrid}>
                  <div style={styles.lessonItem}>
                    <div style={styles.lessonIcon}>🛡️</div>
                    <div>
                      <strong>Emergency Fund Purpose:</strong><br />
                      Save 3-6 months of expenses for real emergencies
                    </div>
                  </div>
                  <div style={styles.lessonItem}>
                    <div style={styles.lessonIcon}>⚠️</div>
                    <div>
                      <strong>Credit Risks:</strong><br />
                      Interest grows debt fast - use carefully
                    </div>
                  </div>
                  <div style={styles.lessonItem}>
                    <div style={styles.lessonIcon}>🎯</div>
                    <div>
                      <strong>Smart Choices:</strong><br />
                      Sometimes creative solutions save money
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.finalMessage}>
                💡 <strong>Real World Tip:</strong> Start building your emergency fund today! 
                Even $5/week adds up to $260/year.
              </div>
              
              <div style={styles.actionButtons}>
                <button style={styles.playAgainButton} onClick={resetGame}>
                  🔄 Play Again
                </button>
                <button style={styles.homeButton} onClick={handleBackToHome}>
                  🏠 Back to Home
                </button>
              </div>
            </div>
            
            {lessonCompleted && (
              <div style={styles.completionBadge} className="pulse">
                ✅ Level 5 Completed! Unlocked Level 6
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            Remember: An emergency fund is your financial safety net! Build it slowly and use it wisely.
          </p>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${(currentScenarioIndex + (currentScenarioCompleted ? 1 : 0)) / scenarios.length * 100}%`
              }}
            />
          </div>
          <p style={styles.progressText}>
            Progress: {currentScenarioIndex + (currentScenarioCompleted ? 1 : 0)} of {scenarios.length} scenarios
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Nunito', 'Comic Sans MS', cursive, sans-serif",
    backgroundColor: "#f8f5ff",
    color: "#1a0066",
    padding: "20px",
    minHeight: "100vh",
    backgroundImage: `
      radial-gradient(circle at 20% 80%, rgba(147, 112, 219, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(123, 104, 238, 0.15) 0%, transparent 50%)
    `,
  },
  
  header: {
    marginBottom: "25px",
  },
  
  backButton: {
    padding: "12px 24px",
    backgroundColor: "#7b68ee",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s",
  },
  
  mainHeader: {
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
  },
  
  mainTitle: {
    fontSize: "2.8rem",
    marginBottom: "15px",
    textShadow: "2px 2px 0 rgba(147, 112, 219, 0.2)",
    background: "linear-gradient(45deg, #9370db, #7b68ee, #6a5acd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "900",
    letterSpacing: "0.5px",
  },
  
  mainSubtitle: {
    fontSize: "1.2rem",
    color: "#666",
    maxWidth: "800px",
    margin: "0 auto",
  },
  
  statsContainer: {
    maxWidth: "1100px",
    margin: "0 auto 30px",
  },
  
  statCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "20px",
    backgroundColor: "#e6e6fa",
    borderRadius: "18px",
    border: "2px solid #9370db",
    boxShadow: "0 4px 12px rgba(147, 112, 219, 0.2)",
  },
  
  statIcon: {
    fontSize: "35px",
  },
  
  statContent: {
    flex: 1,
  },
  
  statLabel: {
    margin: "0 0 5px 0",
    color: "#6a5acd",
    fontSize: "1rem",
  },
  
  statValue: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#6a5acd",
    margin: 0,
  },
  
  interestText: {
    fontSize: "0.85rem",
    color: "#F44336",
    margin: "5px 0 0 0",
    fontWeight: "bold",
  },
  
  mainContent: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  
  // Intro Section
  introSection: {
    marginBottom: "30px",
  },
  
  introCard: {
    padding: "30px",
    borderRadius: "20px",
    backgroundColor: "rgba(230, 230, 250, 0.95)",
    border: "3px solid #9370db",
  },
  
  introHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },
  
  introIcon: {
    fontSize: "40px",
  },
  
  introTitle: {
    color: "#9370db",
    fontSize: "2rem",
    margin: 0,
    background: "linear-gradient(45deg, #9370db, #7b68ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "700",
  },
  
  introContent: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  
  introText: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    color: "#1a0066",
  },
  
  instructionsBox: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "15px",
    border: "2px solid #d8bfd8",
  },
  
  instructionsTitle: {
    color: "#9370db",
    marginTop: 0,
    marginBottom: "15px",
  },
  
  instructionsList: {
    margin: 0,
    paddingLeft: "20px",
  },
  
  tipsBox: {
    padding: "20px",
    backgroundColor: "#f0e6ff",
    borderRadius: "15px",
  },
  
  tipsTitle: {
    color: "#9370db",
    marginTop: 0,
    marginBottom: "20px",
  },
  
  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  
  tipCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "10px",
    border: "2px solid #e6e6fa",
  },
  
  tipIcon: {
    fontSize: "24px",
  },
  
  // Scenario Section
  scenarioSection: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  
  incomeAlert: {
    backgroundColor: "#e8f5e9",
    border: "2px solid #4CAF50",
    borderRadius: "50px",
    padding: "15px 30px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2E7D32",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
  },
  
  incomeIcon: {
    fontSize: "24px",
  },
  
  scenarioCard: {
    padding: "30px",
    borderRadius: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "3px solid #ba55d3",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  
  scenarioHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  
  scenarioWeek: {
    padding: "10px 25px",
    backgroundColor: "#ba55d3",
    color: "white",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "16px",
  },
  
  scenarioCost: {
    padding: "10px 25px",
    backgroundColor: "#FF9800",
    color: "white",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "16px",
  },
  
  scenarioContent: {
    textAlign: "center",
    marginBottom: "30px",
  },
  
  scenarioIcon: {
    fontSize: "50px",
    marginBottom: "20px",
  },
  
  scenarioTitle: {
    color: "#ba55d3",
    fontSize: "2rem",
    margin: "0 0 20px 0",
    fontWeight: "800",
  },
  
  scenarioDescription: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    color: "#1a0066",
    maxWidth: "800px",
    margin: "0 auto 25px",
  },
  
  emergencyBadge: {
    display: "inline-block",
    backgroundColor: "#FFEBEE",
    border: "3px solid #F44336",
    borderRadius: "50px",
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#D32F2F",
  },
  
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  
  optionCard: {
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "15px",
    border: "3px solid #e6e6fa",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.3s",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  
  optionDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  
  optionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  
  optionIcon: {
    fontSize: "32px",
  },
  
  optionLabel: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#1a0066",
  },
  
  optionDescription: {
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "#666",
    flex: 1,
  },
  
  warningText: {
    color: "#F44336",
    fontSize: "14px",
    fontWeight: "bold",
  },
  
  feedbackBox: {
    padding: "25px",
    backgroundColor: "#f0e6ff",
    borderRadius: "15px",
    textAlign: "center",
  },
  
  feedbackTitle: {
    color: "#ba55d3",
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "1.3rem",
  },
  
  feedbackMessage: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  
  explanationBox: {
    fontSize: "1rem",
    lineHeight: "1.5",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  
  nextButton: {
    padding: "15px 30px",
    backgroundColor: "#9370db",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  
  historyCard: {
    padding: "25px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    border: "3px solid #4682b4",
  },
  
  historyTitle: {
    color: "#4682b4",
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "1.5rem",
  },
  
  historyItem: {
    padding: "15px",
    borderBottom: "2px dashed #e6e6fa",
  },
  
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  
  historyScenario: {
    fontSize: "16px",
  },
  
  historyCost: {
    backgroundColor: "#FF9800",
    color: "white",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  
  historyChoice: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "5px",
  },
  
  historyResult: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#4CAF50",
  },
  
  // Results Section
  resultsSection: {
    marginBottom: "30px",
  },
  
  resultsCard: {
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "25px",
    border: "3px solid #ff9800",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
  },
  
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px",
  },
  
  resultsTitle: {
    color: "#ff9800",
    fontSize: "2.5rem",
    margin: 0,
    background: "linear-gradient(45deg, #ff9800, #ff5722)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "900",
  },
  
  coinsBadge: {
    backgroundColor: "#FFD700",
    color: "#333",
    padding: "15px 30px",
    borderRadius: "50px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 5px 15px rgba(255, 215, 0, 0.4)",
  },
  
  coinsIcon: {
    fontSize: "24px",
  },
  
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "40px",
  },
  
  resultCard: {
    padding: "25px",
    backgroundColor: "#f5f5f5",
    borderRadius: "15px",
    textAlign: "center",
    border: "2px solid #e0e0e0",
  },
  
  resultIcon: {
    fontSize: "40px",
    marginBottom: "15px",
  },
  
  resultLabel: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
  },
  
  resultValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  
  resultSubtext: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#666",
  },
  
  lessonBox: {
    padding: "25px",
    backgroundColor: "#fff3e0",
    borderRadius: "15px",
    marginBottom: "30px",
  },
  
  lessonTitle: {
    color: "#ef6c00",
    marginTop: 0,
    marginBottom: "25px",
    fontSize: "1.5rem",
  },
  
  lessonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  
  lessonItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
  },
  
  lessonIcon: {
    fontSize: "28px",
    flexShrink: 0,
  },
  
  finalMessage: {
    padding: "20px",
    backgroundColor: "#e3f2fd",
    borderRadius: "15px",
    marginBottom: "30px",
    fontSize: "1.1rem",
    color: "#1565C0",
    border: "2px solid #2196F3",
  },
  
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
  },
  
  playAgainButton: {
    padding: "18px 45px",
    backgroundColor: "#7b68ee",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  
  homeButton: {
    padding: "18px 45px",
    backgroundColor: "#e6e6fa",
    color: "#7b68ee",
    border: "3px solid #7b68ee",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  
  completionBadge: {
    display: "inline-block",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 40px",
    borderRadius: "50px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "3px solid white",
    boxShadow: "0 5px 20px rgba(76, 175, 80, 0.4)",
    marginTop: "30px",
    textAlign: "center",
  },
  
  footer: {
    marginTop: "40px",
    paddingTop: "25px",
    borderTop: "3px solid #e6e6fa",
  },
  
  footerContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  
  footerText: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  
  progressBar: {
    width: "100%",
    height: "12px",
    backgroundColor: "#d8bfd8",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  
  progressFill: {
    height: "100%",
    backgroundColor: "#9370db",
    borderRadius: "6px",
    transition: "width 0.5s ease",
  },
  
  progressText: {
    fontSize: "0.9rem",
    color: "#483d8b",
    fontWeight: "bold",
  },
};

// Add hover effects
if (typeof window !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    styleSheet.insertRule(`
      button:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
    `, styleSheet.cssRules.length);
  }
}
