import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Level3() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [completedLessons, setCompletedLessons] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState({
    lesson1: false,
    lesson2: false,
    lesson3: false,
    lesson4: false,
    lesson5: false
  });
  
  const totalLessons = 5;

  // Check all lessons completion
  useEffect(() => {
    const completedCount = Object.values(lessonsCompleted).filter(Boolean).length;
    setCompletedLessons(completedCount);
    
    if (completedCount === totalLessons) {
      localStorage.setItem("finlingo_last_completed_level", "3");
    }
  }, [lessonsCompleted]);

  const handleBackToHome = () => {
    navigate("/home");
  };

  // Lesson 1: What is Interest?
  const checkLesson1 = () => {
    const userAnswer = answers["interest"]?.toString().toLowerCase().trim();
    const correct = "110";
    
    if (userAnswer === correct) {
      if (!lessonsCompleted.lesson1) {
        setFeedback({ ...feedback, interest: "🎉 Correct! You earned 20 coins!" });
        setCoins(prev => prev + 20);
        setLessonsCompleted(prev => ({ ...prev, lesson1: true }));
      } else {
        setFeedback({ ...feedback, interest: "✅ Already completed! Great job!" });
      }
      return true;
    } else {
      setFeedback({ ...feedback, interest: "🤔 Not quite! $100 + 10% = ?" });
      return false;
    }
  };

  // Lesson 2: Credit vs Debit Cards
  const checkLesson2 = (answer) => {
    if (answer === "credit") {
      if (!lessonsCompleted.lesson2) {
        setFeedback({ ...feedback, card: "🎉 Correct! Credit cards charge interest! You earned 20 coins!" });
        setCoins(prev => prev + 20);
        setLessonsCompleted(prev => ({ ...prev, lesson2: true }));
      } else {
        setFeedback({ ...feedback, card: "✅ Already completed! Great job!" });
      }
    } else {
      setFeedback({ ...feedback, card: "🤔 Try again! Which card lets you borrow money?" });
    }
  };

  // Lesson 3: Smart Borrowing
  const [loanChoice, setLoanChoice] = useState("");
  
  const checkLesson3 = () => {
    if (loanChoice === "small") {
      if (!lessonsCompleted.lesson3) {
        setFeedback({ ...feedback, loan: "🎉 Smart choice! Small loans are easier! You earned 25 coins!" });
        setCoins(prev => prev + 25);
        setLessonsCompleted(prev => ({ ...prev, lesson3: true }));
      } else {
        setFeedback({ ...feedback, loan: "✅ Already completed! Great job!" });
      }
    } else if (loanChoice === "big") {
      setFeedback({ ...feedback, loan: "⚠️ Big loans can be hard to pay back!" });
    } else {
      setFeedback({ ...feedback, loan: "🤔 Please choose a loan option!" });
    }
  };

  // Lesson 4: Save or Spend
  const [saveChoice, setSaveChoice] = useState("");
  
  const checkLesson4 = () => {
    if (saveChoice === "save") {
      if (!lessonsCompleted.lesson4) {
        setFeedback({ ...feedback, save: "🎉 Great decision! Saving avoids debt! You earned 25 coins!" });
        setCoins(prev => prev + 25);
        setLessonsCompleted(prev => ({ ...prev, lesson4: true }));
      } else {
        setFeedback({ ...feedback, save: "✅ Already completed! Great job!" });
      }
    } else if (saveChoice === "spend") {
      setFeedback({ ...feedback, save: "💸 Spending means you might need to borrow!" });
    } else {
      setFeedback({ ...feedback, save: "🤔 Please choose what to do!" });
    }
  };

  // Lesson 5: True or False Quiz
  const [quizAnswers, setQuizAnswers] = useState({
    q1: "",
    q2: "",
    q3: ""
  });

  const checkLesson5 = () => {
    const allAnswered = quizAnswers.q1 && quizAnswers.q2 && quizAnswers.q3;
    
    if (!allAnswered) {
      setFeedback({ ...feedback, quiz: "🤔 Please answer all 3 questions!" });
      return;
    }
    
    let correctCount = 0;
    let results = [];
    
    // Check each answer
    if (quizAnswers.q1 === "true") {
      correctCount++;
      results.push("✅ Q1: Correct! Interest is an extra fee for borrowing.");
    } else {
      results.push("❌ Q1: Actually, interest IS an extra fee for borrowing money.");
    }
    
    if (quizAnswers.q2 === "false") {
      correctCount++;
      results.push("✅ Q2: Correct! Debit cards use your own money - no borrowing.");
    } else {
      results.push("❌ Q2: Actually, debit cards use your own money from your account.");
    }
    
    if (quizAnswers.q3 === "true") {
      correctCount++;
      results.push("✅ Q3: Correct! Saving is usually smarter than borrowing.");
    } else {
      results.push("❌ Q3: Actually, saving is usually better than borrowing when you can.");
    }
    
    if (correctCount >= 2) {
      if (!lessonsCompleted.lesson5) {
        setFeedback({ 
          ...feedback, 
          quiz: `🎉 You got ${correctCount}/3 correct! ${results.join(" ")} You earned 30 coins!` 
        });
        setCoins(prev => prev + 30);
        setLessonsCompleted(prev => ({ ...prev, lesson5: true }));
      } else {
        setFeedback({ ...feedback, quiz: "✅ Already completed! Great job!" });
      }
    } else {
      setFeedback({ ...feedback, quiz: `📚 Let's review: ${results.join(" ")} Try again!` });
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
          background: #9370db;
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
                backgroundColor: ['#9370db', '#7b68ee', '#6a5acd', '#483d8b', '#4b0082'][Math.floor(Math.random() * 5)],
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
            transition: "all 0.3s ease",
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
          💳💰 Credit & Interest Adventure 💰🏦
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
            <span className="floating" style={{ 
              fontSize: "35px",
              display: "inline-block",
            }}>💎</span>
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#6a5acd", fontSize: "1.1rem" }}>Interest Coins</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#6a5acd", margin: 0 }}>
                {coins} <span style={{ fontSize: "1.3rem", color: "#9370db" }}>coins</span>
              </p>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                Earn coins by learning!
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
        {/* Lesson 1: What is Interest? */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(230, 230, 250, 0.95)",
          border: "3px solid #9370db",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
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
            }}>What is Interest?</h2>
          </div>
          
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}>
            <div style={{
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "2px solid #d8bfd8",
              textAlign: "center",
            }}>
              <h3 style={{ color: "#6a5acd", marginTop: 0 }}>💸 Extra Cost for Borrowing</h3>
              <p style={{ fontSize: "1rem", lineHeight: "1.5" }}>
                When you <strong style={{ color: "#9370db" }}>borrow money</strong>, you pay extra called 
                <strong style={{ color: "#9370db" }}> interest</strong>. It's like a small fee for using someone else's money!
              </p>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f0e6ff",
                borderRadius: "8px",
              }}>
                <span style={{ color: "#6a5acd" }}>💵 Borrow $100</span>
                <span style={{ color: "#9370db" }}>+</span>
                <span style={{ color: "#6a5acd" }}>10% Interest</span>
                <span style={{ color: "#9370db" }}>=</span>
                <span style={{ color: "#6a5acd", fontWeight: "bold" }}>Pay $???</span>
              </div>
            </div>
            
            <div style={{
              padding: "15px",
              backgroundColor: "#f0e6ff",
              borderRadius: "12px",
              textAlign: "center",
            }}>
              <p style={{ marginBottom: "10px" }}><strong>Quiz:</strong> If you borrow $100 at 10% interest, how much do you pay back?</p>
              <p style={{ marginBottom: "15px", fontSize: "0.9rem", color: "#666" }}>
                Hint: 10% of $100 is $10
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <input
                  value={answers["interest"] || ""}
                  onChange={(e) => setAnswers({ ...answers, interest: e.target.value })}
                  placeholder="$ amount"
                  style={{
                    padding: "10px",
                    width: "120px",
                    borderRadius: "8px",
                    border: "2px solid #9370db",
                    textAlign: "center",
                    fontSize: "1rem",
                  }}
                />
                <button
                  onClick={checkLesson1}
                  disabled={lessonsCompleted.lesson1}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: lessonsCompleted.lesson1 ? "#9e9e9e" : "#9370db",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: lessonsCompleted.lesson1 ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {lessonsCompleted.lesson1 ? "✅" : "Check"}
                </button>
              </div>
            </div>
          </div>
          
          {feedback.interest && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: feedback.interest.includes("🎉") ? "#e8f5e9" : "#ffebee",
              borderRadius: "8px",
              textAlign: "center",
            }}>
              {feedback.interest}
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

        {/* Lesson 2: Credit vs Debit Cards */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(248, 240, 255, 0.95)",
          border: "3px solid #ba55d3",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
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
            }}>Credit vs Debit Cards</h2>
          </div>
          
          <div style={{ flex: 1 }}>
            <h3 style={{ color: "#9932cc", textAlign: "center", marginBottom: "15px" }}>💳 Two Types of Cards</h3>
            
            <div style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
            }}>
              <div style={{
                flex: 1,
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "2px solid #d8bfd8",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "1.8rem", color: "#ba55d3" }}>💳</div>
                <p style={{ margin: "10px 0 0 0", fontWeight: "bold", color: "#9932cc" }}>
                  Credit Card
                </p>
                <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#666" }}>
                  Borrow now, pay later
                </p>
                <div style={{
                  padding: "5px 10px",
                  backgroundColor: "#ffebee",
                  borderRadius: "6px",
                  marginTop: "5px",
                }}>
                  <span style={{ fontSize: "0.8rem", color: "#f44336" }}>Charges interest!</span>
                </div>
              </div>
              
              <div style={{
                flex: 1,
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "12px",
                border: "2px solid #d8bfd8",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "1.8rem", color: "#ba55d3" }}>🏦</div>
                <p style={{ margin: "10px 0 0 0", fontWeight: "bold", color: "#9932cc" }}>
                  Debit Card
                </p>
                <p style={{ margin: "5px 0", fontSize: "0.9rem", color: "#666" }}>
                  Use your own money
                </p>
                <div style={{
                  padding: "5px 10px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "6px",
                  marginTop: "5px",
                }}>
                  <span style={{ fontSize: "0.8rem", color: "#4caf50" }}>No interest!</span>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: "15px",
              backgroundColor: "#f0e6ff",
              borderRadius: "12px",
              marginBottom: "15px",
              textAlign: "center",
            }}>
              <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                <strong>Question:</strong> Which card charges interest if you don't pay in full each month?
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  onClick={() => checkLesson2("credit")}
                  disabled={lessonsCompleted.lesson2}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: lessonsCompleted.lesson2 ? "#9e9e9e" : "#ba55d3",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: lessonsCompleted.lesson2 ? "not-allowed" : "pointer",
                  }}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => checkLesson2("debit")}
                  disabled={lessonsCompleted.lesson2}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: lessonsCompleted.lesson2 ? "#9e9e9e" : "#ba55d3",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: lessonsCompleted.lesson2 ? "not-allowed" : "pointer",
                  }}
                >
                  Debit Card
                </button>
              </div>
            </div>
          </div>
          
          {feedback.card && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: feedback.card.includes("🎉") ? "#e8f5e9" : "#ffebee",
              borderRadius: "8px",
              textAlign: "center",
            }}>
              {feedback.card}
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
              ✅ Lesson Completed!
            </div>
          )}
        </section>

        {/* Lesson 3: Smart Borrowing */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(240, 248, 255, 0.95)",
          border: "3px solid #4682b4",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
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
            }}>Smart Borrowing Game</h2>
          </div>
          
          <div style={{
            display: "flex",
            gap: "20px",
            flex: 1,
          }}>
            <div style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "15px",
              border: "2px solid #b0c4de",
            }}>
              <h3 style={{ color: "#4169e1", marginTop: 0 }}>🏦 Choose Wisely!</h3>
              <p style={{ marginBottom: "20px", fontSize: "1rem" }}>
                You want to buy a <strong style={{ color: "#4682b4" }}>video game for $50</strong>. 
                Which loan is smarter?
              </p>
              
              <div style={{ marginBottom: "20px" }}>
                <button
                  onClick={() => setLoanChoice("small")}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: loanChoice === "small" ? "#e8f5e9" : "white",
                    color: "#333",
                    border: loanChoice === "small" ? "3px solid #4caf50" : "2px solid #b0c4de",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.5rem" }}>👍</span>
                    <div>
                      <strong style={{ color: "#4682b4" }}>Small & Quick</strong>
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                        Borrow $50, pay back in 1 month
                      </p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setLoanChoice("big")}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: loanChoice === "big" ? "#ffebee" : "white",
                    color: "#333",
                    border: loanChoice === "big" ? "3px solid #f44336" : "2px solid #b0c4de",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.5rem" }}>👎</span>
                    <div>
                      <strong style={{ color: "#4682b4" }}>Big & Long</strong>
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                        Borrow $200, pay back in 1 year
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              
              <button
                onClick={checkLesson3}
                disabled={lessonsCompleted.lesson3}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: lessonsCompleted.lesson3 ? "#9e9e9e" : "#4682b4",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: lessonsCompleted.lesson3 ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {lessonsCompleted.lesson3 ? "✅ Completed" : "Submit My Choice"}
              </button>
            </div>
            
            <div style={{
              flex: 1,
              padding: "20px",
              backgroundColor: "#f0f8ff",
              borderRadius: "15px",
              border: "2px solid #87ceeb",
              display: "flex",
              flexDirection: "column",
            }}>
              <h3 style={{ color: "#4169e1", marginTop: 0 }}>💡 Tip of the Day</h3>
              <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "10px",
                border: "2px dashed #4682b4",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "15px" }}>💭</div>
                <p style={{ fontSize: "1.1rem", color: "#4682b4", fontWeight: "bold" }}>
                  Smart Borrowing Rule:
                </p>
                <p style={{ fontSize: "1rem", color: "#666", marginTop: "10px" }}>
                  Only borrow what you <strong>need</strong> and can pay back <strong>quickly</strong>!
                </p>
                <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "15px" }}>
                  Small loans = Easy to manage<br/>
                  Big loans = Can be stressful!
                </p>
              </div>
            </div>
          </div>
          
          {feedback.loan && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: feedback.loan.includes("🎉") ? "#e8f5e9" : "#ffebee",
              borderRadius: "8px",
              textAlign: "center",
            }}>
              {feedback.loan}
            </div>
          )}
          
          {lessonsCompleted.lesson3 && (
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

        {/* Lesson 4: Save or Spend */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 248, 225, 0.95)",
          border: "3px solid #ff9800",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
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
            }}>Save or Spend?</h2>
          </div>
          
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}>
            <div style={{
              maxWidth: "600px",
              textAlign: "center",
            }}>
              <h3 style={{ color: "#ef6c00", marginBottom: "20px" }}>🐷 Piggy Bank Decision</h3>
              
              <div style={{
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "15px",
                border: "2px solid #ffcc80",
                marginBottom: "25px",
              }}>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#333" }}>
                  You get <strong style={{ color: "#ff9800" }}>$20 allowance</strong> each week. 
                  A new toy costs <strong style={{ color: "#ff9800" }}>$50</strong>.
                </p>
                <p style={{ fontSize: "1rem", color: "#666", marginTop: "10px" }}>
                  What should you do?
                </p>
              </div>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "15px",
                marginBottom: "25px",
              }}>
                <button
                  onClick={() => setSaveChoice("save")}
                  style={{
                    padding: "15px",
                    backgroundColor: saveChoice === "save" ? "#e8f5e9" : "white",
                    borderRadius: "12px",
                    border: saveChoice === "save" ? "3px solid #4caf50" : "2px solid #4caf50",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>💰</div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#333" }}>Save $20 each week for 3 weeks</p>
                </button>
                
                <button
                  onClick={() => setSaveChoice("spend")}
                  style={{
                    padding: "15px",
                    backgroundColor: saveChoice === "spend" ? "#ffebee" : "white",
                    borderRadius: "12px",
                    border: saveChoice === "spend" ? "3px solid #f44336" : "2px solid #f44336",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>💳</div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#333" }}>Borrow $30 now, pay back with interest</p>
                </button>
              </div>
              
              <button
                onClick={checkLesson4}
                disabled={lessonsCompleted.lesson4}
                style={{
                  padding: "12px 30px",
                  backgroundColor: lessonsCompleted.lesson4 ? "#9e9e9e" : "#ff9800",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: lessonsCompleted.lesson4 ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                {lessonsCompleted.lesson4 ? "✅ Completed" : "Make My Choice"}
              </button>
            </div>
          </div>
          
          {feedback.save && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: feedback.save.includes("🎉") ? "#e8f5e9" : "#ffebee",
              borderRadius: "8px",
              textAlign: "center",
            }}>
              {feedback.save}
            </div>
          )}
          
          {lessonsCompleted.lesson4 && (
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

        {/* Lesson 5: True or False Quiz */}
        <section style={{ 
          padding: "25px",
          borderRadius: "20px",
          backgroundColor: "rgba(245, 245, 255, 0.95)",
          border: "3px solid #9c27b0",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
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
              backgroundColor: "#9c27b0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}>5</div>
            <h2 style={{ 
              color: "#9c27b0",
              fontSize: "1.5rem",
              margin: 0,
              background: "linear-gradient(45deg, #9c27b0, #7b1fa2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700",
            }}>True or False Quiz</h2>
          </div>
          
          <div style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "15px",
            border: "2px solid #e1bee7",
            marginBottom: "20px",
          }}>
            <div style={{ marginBottom: "25px" }}>
              <p style={{ margin: "0 0 12px 0", fontSize: "1.1rem", fontWeight: "bold", color: "#7b1fa2" }}>
                1. Interest is an extra fee you pay when you borrow money.
              </p>
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() => setQuizAnswers({...quizAnswers, q1: "true"})}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: quizAnswers.q1 === "true" ? "#4caf50" : "#e0e0e0",
                    color: quizAnswers.q1 === "true" ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  True
                </button>
                <button
                  onClick={() => setQuizAnswers({...quizAnswers, q1: "false"})}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: quizAnswers.q1 === "false" ? "#f44336" : "#e0e0e0",
                    color: quizAnswers.q1 === "false" ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  False
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: "25px" }}>
              <p style={{ margin: "0 0 12px 0", fontSize: "1.1rem", fontWeight: "bold", color: "#7b1fa2" }}>
                2. Debit cards let you borrow money from the bank.
              </p>
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() => setQuizAnswers({...quizAnswers, q2: "true"})}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: quizAnswers.q2 === "true" ? "#f44336" : "#e0e0e0",
                    color: quizAnswers.q2 === "true" ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  True
                </button>
                <button
                  onClick={() => setQuizAnswers({...quizAnswers, q2: "false"})}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: quizAnswers.q2 === "false" ? "#4caf50" : "#e0e0e0",
                    color: quizAnswers.q2 === "false" ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  False
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: "25px" }}>
              <p style={{ margin: "0 0 12px 0", fontSize: "1.1rem", fontWeight: "bold", color: "#7b1fa2" }}>
                3. It's usually smarter to save money than to borrow when you can.
              </p>
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() => setQuizAnswers({...quizAnswers, q3: "true"})}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: quizAnswers.q3 === "true" ? "#4caf50" : "#e0e0e0",
                    color: quizAnswers.q3 === "true" ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  True
                </button>
                <button
                  onClick={() => setQuizAnswers({...quizAnswers, q3: "false"})}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: quizAnswers.q3 === "false" ? "#f44336" : "#e0e0e0",
                    color: quizAnswers.q3 === "false" ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  False
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={checkLesson5}
            disabled={lessonsCompleted.lesson5}
            style={{
              padding: "12px",
              backgroundColor: lessonsCompleted.lesson5 ? "#9e9e9e" : "#9c27b0",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: lessonsCompleted.lesson5 ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {lessonsCompleted.lesson5 ? "✅ Quiz Completed" : "Submit Quiz"}
          </button>
          
          {feedback.quiz && (
            <div style={{
              marginTop: "15px",
              padding: "15px",
              backgroundColor: feedback.quiz.includes("🎉") ? "#e8f5e9" : "#fff3e0",
              borderRadius: "8px",
              textAlign: "center",
              fontSize: "0.95rem",
              lineHeight: "1.4",
            }}>
              {feedback.quiz}
            </div>
          )}
          
          {lessonsCompleted.lesson5 && (
            <div style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#4caf50",
              color: "white",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
            }}>
              ✅ Quiz Completed!
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
        <h3 style={{ color: "#7b68ee", marginBottom: "12px", fontSize: "1.3rem" }}>🎓 Credit Basics Certificate</h3>
        <div style={{
          padding: "15px",
          backgroundColor: "#e6e6fa",
          borderRadius: "15px",
          border: "2px dashed #9370db",
          marginBottom: "15px",
        }}>
          <p style={{ fontSize: "1.1rem", color: "#6a5acd", fontWeight: "bold", margin: "0 0 8px 0" }}>
            {coins >= 100 ? "🏆 Credit Master!" : 
             coins >= 75 ? "🥈 Interest Expert!" : 
             coins >= 50 ? "🥉 Money Learner!" : 
             "🌟 Keep Learning!"}
          </p>
          <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
            You've earned <span style={{ color: "#6a5acd", fontWeight: "bold" }}>{coins}</span> coins!
            {coins >= 100 && " You understand credit basics!"}
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
            <h3 style={{ color: "#6a5acd", marginTop: 0, fontSize: "1.5rem" }}>🎉 Level 3 Completed! 🎉</h3>
            <p style={{ fontSize: "1.1rem", color: "#483d8b", marginBottom: "15px" }}>
              Great job! You've learned about interest, credit cards, and smart money choices!
              Level 4 is now unlocked on the homepage.
            </p>
            <button
              onClick={handleBackToHome}
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
                setCoins(prev => prev + 30);
                alert("🎁 You earned 30 bonus coins for completing all lessons!");
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
