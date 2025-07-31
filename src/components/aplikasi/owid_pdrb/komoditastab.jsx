import React, { useState } from "react";
import KomoditasChartLine from "./komoditaslinechart";
import Swal from "sweetalert2";
// import KomoditasMap from "./komoditasmap";   // Kalau nanti ada map
// import KomoditasTable from "./komoditastable"; // Kalau ada tabel view

export default function KomoditasTab() {
  const [view, setView] = useState("chart"); // default: chart

  // Contoh penggunaan swal pada tab switch (misal fitur table/map belum tersedia)
  const handleTabUnavailable = (tabName) => {
    Swal.fire({
      icon: "info",
      title: "Fitur Belum Tersedia",
      text: `Fitur ${tabName} akan segera hadir!`,
    });
  };

  return (
    <div>
      {/* Mini-tab ala OWID */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {/* 
        <button
          onClick={() => handleTabUnavailable("Table")}
          className={view === "table" ? "active" : ""}
        >
          Table
        </button>
        <button
          onClick={() => handleTabUnavailable("Map")}
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
        {view === "chart" && <KomoditasChartLine />}
        {/* {view === "table" && <KomoditasTable />} */}
        {/* {view === "map" && <KomoditasMap />} */}
      </div>
    </div>
  );
}
