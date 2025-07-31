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
        <div className="tab-buttons">
          {tabTitles.map((tab, index) => {
            const IconComponent = tab.icon;
            const iconColor = activeTab === index ? "white" : tab.defaultColor;

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, backgroundColor: "#f1f1f1" }} // 🔥 Efek hover
                transition={{ duration: 0.2 }}
                className={`tab-button-wrapper ${activeTab === index ? "active" : ""}`}
              >
                <Button
                  className={`tab-button ${activeTab === index ? "active" : ""}`}
                  onClick={() => handleTabClick(index)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "5px",
                    backgroundColor:
                      activeTab === index ? tab.defaultColor : "transparent",
                    color: activeTab === index ? "white" : "black",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.3, rotate: 10 }} // 🔥 Efek hover ikon lebih besar dan sedikit miring
                    transition={{ duration: 0.2 }}
                    className="tab-icon"
                  >
                    <IconComponent size={24} color={iconColor} />
                  </motion.div>
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {tab.name}
                  </span>
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
