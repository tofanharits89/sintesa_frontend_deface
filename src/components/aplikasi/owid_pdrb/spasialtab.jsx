import React, { useState } from "react";
import SpasialChartLine from "./spasiallinechart";
// import SpasialMap from "./spasialmap";   // Kalau ada map
// import SpasialTable from "./spasialtable"; // Kalau ada tabel view

export default function SpasialTab() {
  const [view, setView] = useState("chart"); // default: chart

  return (
    <div>
      {/* Mini-tab ala OWID */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {/* 
        <button
          onClick={() => setView("table")}
          className={view === "table" ? "active" : ""}
        >
          Table
        </button>
        <button
          onClick={() => setView("map")}
          className={view === "map" ? "active" : ""}
        >
          Map
        </button>
        */}
        {/* 
        <button
          onClick={() => setView("chart")}
          className={view === "chart" ? "active" : ""}
        >
          Chart
        </button>
        */}
      </div>

      {/* Konten sesuai tab */}
      <div>
        {view === "chart" && <SpasialChartLine />}
        {/* {view === "table" && <SpasialTable />} */}
        {/* {view === "map" && <SpasialMap />} */}
      </div>
    </div>
  );
}
