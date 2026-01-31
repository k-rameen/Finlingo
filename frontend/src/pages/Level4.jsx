import { useNavigate } from "react-router-dom";

export default function Level4() {
  const navigate = useNavigate();

  function finishLevel() {
    localStorage.setItem("finlingo_last_completed_level", "4");
    navigate("/home");
  }

  return (
    <div style={styles.page}>
      <h1>Level 4</h1>
      <button onClick={finishLevel}>Finish Level</button>
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
