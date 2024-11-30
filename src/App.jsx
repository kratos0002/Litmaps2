import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => setMessage("Welcome to LitMaps!"), 1000);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
