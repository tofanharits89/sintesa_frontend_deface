import React, { useState } from "react";
import NtpChartLine from "./ntplinechart";
import Swal from "sweetalert2";
// import NtpMap from "./ntpmap";   // Kalau ada map
// import NtpTable from "./ntptable"; // Kalau ada tabel view

export default function NtpTab() {
  const [view, setView] = useState("chart"); // default: chart

  // Contoh swal untuk fitur tab yang belum tersedia
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
        {view === "chart" && <NtpChartLine />}
        {/* {view === "table" && <NtpTable />} */}
        {/* {view === "map" && <NtpMap />} */}
      </div>
    </div>
  );
}
