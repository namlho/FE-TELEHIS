// App.jsx
import React from "react";
import VerticalBarChart from "./VerticalBarChart";

function App() {
  const data = [
    { label: "DX Backend", value: 50, color: "rgba(0, 238, 8, 1)" },
    { label: "AIoMT Backend    (Version 0)", value: 85, color: "#2196F3" },
    { label: "Telemedicine BE (Version 0)", value: 85, color: "#FFC107" },
    { label: "Telemedicine FE (Version 0)", value: 50, color: "#FF5722" },
    { label: "Deploy Server", value: 90, color: "#c600e9ff" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <VerticalBarChart data={data} width={1200} height={700} />
    </div>
  );
}

export default App;
