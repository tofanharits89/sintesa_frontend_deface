import React, { useState, useContext } from "react";
import MyContext from "../../../../auth/Context";
import "../epa.css";
import PeriodeEpa from "./pilihanAtas";
import { Button } from "react-bootstrap";
import TabIsuSpesifik from "../tabcontent/TabIsuSpesifik";
import TabTrenJenisBelanja from "../tabcontent/TabTrenJenisBelanja";
import TabKinerjaUtama from "../tabcontent/TabKinerjaUtama";
import TabPaguMinus from "../tabcontent/TabPaguMinus";
import TabUpTayl from "../tabcontent/TabUpTayl";

import { motion, AnimatePresence } from "framer-motion";
import {
  BsExclamationTriangle,
  BsBarChart,
  BsClipboardData,
  BsGraphUp,
  BsFlag,
  BsTrophy,
} from "react-icons/bs";
import TabTargetCapaian from "../tabcontent/TabTargetCapaian";

function EpaTabs({ toggleMode, darkMode, onChange }) {
  const { dataEpa, role, kdkanwil, kdkppn } = useContext(MyContext) || {};
  const [activeTab, setActiveTab] = useState(0);
  const {
    year = "",
    periode = "",
    kddept = "",
    kodeKanwil = "",
  } = dataEpa || {};

  const [kanwilData, setKanwilData] = useState({
    kodeKanwil: "",
    namaKanwil: "",
    lokasiKanwil: "",
  });

  const kanwilChange = (kanwil) => {
    setKanwilData(kanwil);
    if (onChange) {
      onChange(kanwil);
    }
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const tabTitles = [
    {
      name: "Isu Spesifik",
      defaultColor: "#e74c3c",
      icon: BsExclamationTriangle,
    },
    { name: "Tren Belanja", defaultColor: "#f39c12", icon: BsBarChart },
    { name: "Pagu Minus", defaultColor: "#3498db", icon: BsClipboardData },
    { name: "Outstanding UP TYL", defaultColor: "#2ecc71", icon: BsGraphUp },
    { name: "Kinerja Utama", defaultColor: "#9b59b6", icon: BsFlag },
    { name: "Target/ Capaian", defaultColor: "#e67e22", icon: BsTrophy },
  ];

  const tabComponents = [
    <TabIsuSpesifik lokasi={kanwilData} />,
    <TabTrenJenisBelanja />,
    <TabPaguMinus />,
    <TabUpTayl />,
    <TabKinerjaUtama />,
    <TabTargetCapaian />,
  ];

  return (
    <main id="main" className="main">
      <PeriodeEpa
        toggleMode={toggleMode}
        darkMode={darkMode}
        onChange={kanwilChange}
        tab={activeTab}
        role={role}
        kdkanwil={role === "3" || role === "2" ? dataEpa.kodeKanwil : kdkanwil}
        kdkppn={role === "3" ? dataEpa.kdkppn : kdkppn}
      />

      <div className="tab-container">
        {/* Tab Buttons */}
        <div
          className="tab-buttons"
          style={{
            display: "flex",
            gap: "2px",
            backgroundColor: "#f8f9fa",
            padding: "4px",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          {tabTitles.map((tab, index) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === index;

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                style={{ flex: 1 }}
              >
                <Button
                  onClick={() => handleTabClick(index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    backgroundColor: isActive ? "#ffffff" : "transparent",
                    color: isActive ? "#2c3e50" : "#6c757d",
                    border: isActive
                      ? "1px solid #dee2e6"
                      : "1px solid transparent",
                    borderRadius: "6px",
                    fontWeight: isActive ? "600" : "500",
                    fontSize: "16px",
                    transition: "all 0.2s ease",
                    boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <IconComponent
                    size={16}
                    color={isActive ? tab.defaultColor : "#6c757d"}
                  />
                  <span>{tab.name}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className={`tab-content ${darkMode ? "dark-mode" : ""}`}>
          <div className="tab-content-inner p-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="tab-panel p-0 active"
              >
                {tabComponents[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EpaTabs;
