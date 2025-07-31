import React, { useState } from "react";
import SummaryBarChart from "./summarybar";
import PetaPenerima from "./penerimamap";
import SPPGChartLine from "./sppglinechart";
import KelompokMbgChartLine from "./kelompoklinechart";

export default function SummaryTab() {
  const [view, setView] = useState("summary"); // default: summary

  return (
    <div>
      {/* Minimal tab buttons */}
      <div style={{ 
        display: "flex", 
        gap: 8, 
        marginBottom: 16, 
        background: "#f9fafb",
        padding: "8px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        <button
          onClick={() => setView("summary")}
          style={{
            background: view === "summary" ? "#2563eb" : "transparent",
            color: view === "summary" ? "#ffffff" : "#6b7280",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
            outline: "none"
          }}
        >
          Summary
        </button>
        <button
          onClick={() => setView("penerima")}
          style={{
            background: view === "penerima" ? "#2563eb" : "transparent",
            color: view === "penerima" ? "#ffffff" : "#6b7280",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
            outline: "none"
          }}
        >
          Penerima
        </button>
        <button
          onClick={() => setView("sppg")}
          style={{
            background: view === "sppg" ? "#2563eb" : "transparent",
            color: view === "sppg" ? "#ffffff" : "#6b7280",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
            outline: "none"
          }}
        >
          SPPG
        </button>
        <button
          onClick={() => setView("Kelompok MBG")}
          style={{
            background: view === "Kelompok MBG" ? "#2563eb" : "transparent",
            color: view === "Kelompok MBG" ? "#ffffff" : "#6b7280",
            border: "none",
            borderRadius: "4px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
            outline: "none"
          }}
        >
          Kelompok MBG
        </button>
      </div>

      <div>
        {view === "summary" && <SummaryBarChart />}
        {view === "penerima" && <PetaPenerima />}
        {view === "sppg" && <SPPGChartLine />}
        {view === "Kelompok MBG" && <KelompokMbgChartLine />}
      </div>
    </div>
  );
}
