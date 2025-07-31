import React, { useState } from "react";
import Korelasi from "../korelasi";
import Regresi from "../regresi";

export default function AnalisisTematik() {
  const [selectedAnalysis, setSelectedAnalysis] = useState("korelasi");  const AnalysisSwitch = () => {
    return (
      <div style={{
        display: "flex",
        background: "#fff",
        borderRadius: 20,
        padding: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e0e6ed"
      }}>        {/* Button Korelasi */}
        <button
          onClick={() => setSelectedAnalysis("korelasi")}
          style={{
            padding: "8px 20px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            background: selectedAnalysis === "korelasi" 
              ? "linear-gradient(135deg, #10b981, #059669)" 
              : "transparent",
            color: selectedAnalysis === "korelasi" ? "#fff" : "#6b7280",
            minWidth: 120,
            transform: selectedAnalysis === "korelasi" ? "scale(1.02)" : "scale(1)",
            boxShadow: selectedAnalysis === "korelasi" 
              ? "0 3px 15px rgba(16, 185, 129, 0.3)" 
              : "none"
          }}
        >
          📊 Korelasi
        </button>
        
        {/* Button Regresi */}
        <button
          onClick={() => setSelectedAnalysis("regresi")}
          style={{
            padding: "8px 20px",
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            background: selectedAnalysis === "regresi" 
              ? "linear-gradient(135deg, #3b82f6, #2563eb)" 
              : "transparent",
            color: selectedAnalysis === "regresi" ? "#fff" : "#6b7280",
            minWidth: 120,
            transform: selectedAnalysis === "regresi" ? "scale(1.02)" : "scale(1)",
            boxShadow: selectedAnalysis === "regresi" 
              ? "0 3px 15px rgba(59, 130, 246, 0.3)" 
              : "none"
          }}
        >
          📈 Regresi
        </button>
      </div>
    );
  };return (
    <div style={{ background: "#f7f9fb", minHeight: "100vh", padding: "32px 0" }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 36,
        alignItems: "center",
        maxWidth: 1100,
        margin: "0 auto"
      }}>
        {/* Conditional Rendering based on selectedAnalysis */}
        {selectedAnalysis === "korelasi" && (
          <div style={{
            width: "95%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 16px #0001",
            padding: "28px 22px",
            minWidth: 340,
            minHeight: 500,
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: 16 
            }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#19bb60" }}>
                Analisis Korelasi
              </div>
              <AnalysisSwitch />
            </div>
            <Korelasi />
          </div>
        )}

        {selectedAnalysis === "regresi" && (
          <div style={{
            width: "95%",
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 16px #0001",
            padding: "28px 22px",
            minWidth: 340,
            minHeight: 500,
            display: "flex",
            flexDirection: "column"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: 16 
            }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#3874dc" }}>
                Analisis Regresi Linear
              </div>
              <AnalysisSwitch />
            </div>
            <Regresi />
          </div>
        )}
      </div>
    </div>
  );
}
