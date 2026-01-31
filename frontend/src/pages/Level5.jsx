import { useNavigate } from "react-router-dom";

export default function Level5() {
  const navigate = useNavigate();

  function finishLevel() {
    localStorage.setItem("finlingo_last_completed_level", "5");
    navigate("/home");
  }

  return (
    <div style={styles.page}>
      <h1>Level 5 🎉</h1>
      <button onClick={finishLevel}>Back to Home</button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0b1020",
    color: "#fff",
    fontSize: 24,
  },
};
