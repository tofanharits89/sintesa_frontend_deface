import React, { useState, useContext } from "react";
import { Card, Nav } from "react-bootstrap";
import {
  FaDatabase,
  FaChartLine,
  FaChartBar,
  FaProjectDiagram,
  FaChartArea,
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import DashboardMbg from "./DashboardMbg";
import TrenDashboard from "./dashboard/Tren";
import BenchmarkDashboard from "./dashboard/Benchmark";
// import AnalisisTematik from "./dashboard/Analisistematik";
import Perkembangan from "./dashboard/Perkembangan";
import MyContext from "../../../auth/Context";
import EWS from "./dashboard/EWS";

const TabDashboard = () => {
  const { role } = useContext(MyContext);
  const [activeKey, setActiveKey] = useState("mbgData");

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const tabs = [
    {
      key: "mbgData",
      icon: <FaDatabase style={{ color: "#0d6efd" }} />,
      label: "Dashboard Utama",
    },
    {
      key: "Tren",
      icon: <FaChartLine style={{ color: "#28a745" }} />,
      label: "Tren",
    },
    {
      key: "Benchmark",
      icon: <FaChartBar style={{ color: "#fd7e14" }} />,
      label: "Benchmark",
    },
    {
      key: "EWS",
      icon: <FaProjectDiagram style={{ color: "#6610f2" }} />,
      label: "EWS",
    },
    {
      key: "Perkembangan",
      icon: <FaChartArea style={{ color: "#e83e8c" }} />,
      label: "Perkembangan",
    },
  ];

  // Filter tabs sesuai role
  const filteredTabs = tabs.filter((tab) => {
    if (
      ["Tren", "Benchmark", "Analisis Tematik", "Perkembangan", "EWS"].includes(
        tab.key
      )
    ) {
      return role !== "3" && role !== "4";
    }
    return true;
  });

  const renderContent = () => {
    // Jika user level 3/4 dan memilih tab yang tidak boleh, paksa ke Dashboard Utama
    if ((role === "3" || role === "4") && activeKey !== "mbgData") {
      setActiveKey("mbgData");
      return null;
    }
    switch (activeKey) {
      case "mbgData":
        return <DashboardMbg />;
      case "Tren":
        return <TrenDashboard />;
      case "Benchmark":
        return <BenchmarkDashboard />;
      case "EWS":
        return <EWS />;
      case "Perkembangan":
        return <Perkembangan />;
      default:
        return null;
    }
  };

  return (
    <main
      id="main"
      className="main"
      style={{
        paddingTop: 30,
        flex: "1 1 0%", // Membuat konten utama fleksibel dan bisa dimampatkan
        minWidth: 0, // Supaya konten bisa mengecil saat sidebar dibuka
        transition: "flex-basis 0.3s, width 0.3s", // Animasi efek mampat
        // width: "100%", // Hapus width agar mengikuti parent flex
      }}
    >
      <Card className="shadow-sm">
        <Card.Header
          style={{
            position: "sticky",
            top: 50,
            zIndex: 10,
            backgroundColor: "#f8f9fa",
            paddingBottom: 0,
            borderBottom: "1px solid #ddd",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Nav
            variant="tabs"
            activeKey={activeKey}
            onSelect={setActiveKey}
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 12,
              padding: "0 12px",
              marginBottom: "10px",
            }}
          >
            {filteredTabs.map(({ key, icon, label }) => {
              const isActive = activeKey === key;
              return (
                <Nav.Item
                  key={key}
                  style={{ flex: "1 1 160px", maxWidth: 220 }}
                >
                  <Nav.Link
                    eventKey={key}
                    style={{
                      backgroundColor: "transparent",
                      border: "none", // Hapus semua border default
                      borderBottom: isActive
                        ? `3px solid ${icon.props.style.color}`
                        : "3px solid transparent", // sesuai warna icon
                      color: isActive ? icon.props.style.color : "#333",
                      fontWeight: isActive ? "900" : "900",
                      fontSize: isActive ? "1.05rem" : "1rem",
                      borderRadius: "0", // Pastikan tidak ada radius
                      transition: "all 0.2s ease-in-out",
                      padding: "10px 16px",
                      minWidth: "160px",
                      textAlign: "center",
                      outline: "none", // Supaya tidak ada garis kotak
                      boxShadow: "none", // Hilangkan efek fokus dari Bootstrap
                    }}
                  >
                    {icon}
                    <span className="ms-2">{label}</span>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </Card.Header>

        <Card.Body style={{ backgroundColor: "#fff", minHeight: 320 }}>
          {renderContent()}
        </Card.Body>
      </Card>
    </main>
  );
};

export default TabDashboard;
