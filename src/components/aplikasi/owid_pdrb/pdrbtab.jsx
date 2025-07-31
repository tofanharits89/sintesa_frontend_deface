import React, { useState } from "react";
import PdrbLineChart from "./pdrblinechart";
//import PdrbMap from "./pdrbmap";
// import komponen Table kamu jika ada

export default function PdrbTab() {
  const [view, setView] = useState("chart"); // default tampilan awal

  return (
    <div>
      {/* Mini-tab ala OWID */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {/* <button
          onClick={() => setView("table")}
          className={view === "table" ? "active" : ""}
        >
          <FaTable /> Table
        </button>
        <button
          onClick={() => setView("map")}
          className={view === "map" ? "active" : ""}
        >
          <FaGlobe /> Map
        </button> */}
        {/* <button
          onClick={() => setView("chart")}
          className={view === "chart" ? "active" : ""}
        >
          <FaChartLine /> Chart
        </button> */}
      </div>

      {/* Konten sesuai tab */}
      <div>
        {view === "chart" && <PdrbLineChart />}
      </div>
    </div>
  );
}
