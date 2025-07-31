import React, { useState, useContext } from "react";
import { Button, Container, Tab } from "react-bootstrap";

import { ModalRekamBulanan } from "./ModalRekamBulanan";
import { motion } from "framer-motion";
import { ModalRekamTriwulan } from "./ModalRekamTriwulan";
import MyContext from "../../../../auth/Context";
import { EPANOTIF } from "../../notifikasi/Omspan";
import {
  FaChartBar,
  FaWarehouse,
  FaCalendarAlt,
  FaRegClock,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaShoppingCart,
  FaPlusCircle,
  FaRedoAlt,
  FaBars,
  FaFilter,
  FaDownload,
} from "react-icons/fa";
import { LandingBPS } from "./landingBPS";
import { LandingMbgKanwil } from "./landingMbgKanwil";
import { LandingBapanas } from "./landingBapanas";
import { LandingBulanan } from "./landingBulanan";
import { LandingTriwulanan } from "./landingTriwulanan";
import { LandingPermasalahan } from "./landingPermasalahan";
import { LandingKesimpulan } from "./landingKesimpulan";

export const TabKKMBG = () => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [activeKeyX, setactiveKeyX] = useState("tab1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModalkomo, setShowModalkomo] = useState(false);
  const [reload, setReload] = useState(false);
  const handleReload = () => setReload((prev) => !prev);
  
  const handleTabChange = (key) => {
    setactiveKeyX(key);
  };

  const handleConfirm = () => {
    setShowModalkomo(false);
  };
  const handleClose = () => setShowModalkomo(false);

  return (
    <main id="main" className="main" style={{ padding: '16px' }}>
      {/* Compact Header */}
      <div className="mb-3">
        <Container fluid style={{ padding: '0' }}>
          <div className="d-flex justify-content-between align-items-center" 
               style={{ 
                 background: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', 
                 borderRadius: '20px', 
                 padding: '12px 16px',
                 paddingLeft: '25px',
                 color: 'white',
                 boxShadow: '0 8px 32px rgba(79, 70, 229, 0.25)',
                 border: '1px solid rgba(255, 255, 255, 0.1)'
               }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '22px', 
                fontWeight: '700',
                letterSpacing: '-0.5px',
                color: '#FDE68A'
              }}>
                Kertas Kerja MBG
              </h1>
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '13px', 
                opacity: 0.85,
                fontWeight: '400'
              }}>
                </p>
            </div>
            
            <div className="d-flex gap-3 align-items-center">
              {/* Compact Rekam Data Button */}
              <Button
                onClick={() => setShowModalkomo(true)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                className="d-flex align-items-center gap-2"
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                }}
                tabdata={activeKeyX}
              >
                <FaPlusCircle size={14} style={{ color: "#f1f5f9" }} />
                <span style={{ color: "#f1f5f9" }}>Rekam Data</span>
              </Button>

              {/* Compact Reload Button */}
              <Button
                onClick={handleReload}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  width: '44px',
                  height: '44px',
                  padding: '0',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                className="d-flex align-items-center justify-content-center"
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-2px) rotate(180deg)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(0) rotate(0deg)';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                }}
                title="Refresh Data"
              >
                <FaRedoAlt size={14} style={{ color: "#f1f5f9" }} />
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <section className="section dashboard team">
        <Tab.Container activeKeyX={activeKeyX}>
          {/* Ultra Modern Tab Navigation */}
          <div style={{ 
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)', 
            borderRadius: '20px',
            padding: '6px',
            marginBottom: '24px',
            boxShadow: '0 4px 32px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <ul
              className="nav d-flex mb-0"
              style={{ 
                gap: '3px',
                padding: '0',
                margin: '0',
                listStyle: 'none'
              }}
              role="tablist"
            >
              {[
                { key: "tab1", icon: FaChartBar, label: "Makrokesra", color: "#4f46e5", shortLabel: "Makro" },
                { key: "tab2", icon: FaShoppingCart, label: "Harga Komoditas", color: "#059669", shortLabel: "Harga" },
                { key: "tab3", icon: FaRegClock, label: "Perkembangan Lainnya", color: "#d97706", shortLabel: "Lainnya" },
                { key: "tab4", icon: FaExclamationTriangle, label: "Permasalahan/Isu", color: "#dc2626", shortLabel: "Isu" },
                { key: "tab5", icon: FaClipboardCheck, label: "Kesimpulan & Rekomendasi", color: "#7c3aed", shortLabel: "Kesimpulan" }
              ].map(({ key, icon: Icon, label, color, shortLabel }) => (
                <li key={key} className="nav-item flex-fill" role="presentation">
                  <button
                    className="nav-link w-100 border-0"
                    onClick={() => handleTabChange(key)}
                    type="button"
                    role="tab"
                    aria-selected={activeKeyX === key}
                    style={{
                      background: activeKeyX === key 
                        ? `linear-gradient(135deg, ${color} 0%, ${color}e6 100%)`
                        : 'transparent',
                      color: activeKeyX === key ? 'white' : '#64748b',
                      borderRadius: '16px',
                      padding: '14px 12px',
                      fontSize: '12px',
                      fontWeight: activeKeyX === key ? '700' : '500',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: 'none',
                      boxShadow: activeKeyX === key 
                        ? `0 6px 20px ${color}30, 0 2px 8px ${color}20`
                        : 'none',
                      transform: activeKeyX === key ? 'translateY(-2px) scale(1.02)' : 'none',
                      position: 'relative',
                      overflow: 'hidden'
                    }}                    onMouseEnter={(e) => {
                      if (activeKeyX !== key) {
                        e.target.style.background = `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`;
                        e.target.style.color = color;
                        e.target.style.transform = 'translateY(-1px)';
                        // Update icon and text colors on hover for non-active tabs
                        const iconElement = e.target.querySelector('svg');
                        const textElements = e.target.querySelectorAll('span');
                        if (iconElement) iconElement.style.color = color;
                        textElements.forEach(span => span.style.color = color);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeKeyX !== key) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#64748b';
                        e.target.style.transform = 'translateY(0)';
                        // Reset icon and text colors on mouse leave for non-active tabs
                        const iconElement = e.target.querySelector('svg');
                        const textElements = e.target.querySelectorAll('span');
                        if (iconElement) iconElement.style.color = color;
                        textElements.forEach(span => span.style.color = '#64748b');
                      }
                    }}
                    title={label}
                  >                    <div className="d-flex align-items-center justify-content-center gap-2 flex-column flex-sm-row">
                      <Icon size={16} style={{ 
                        minWidth: '16px',
                        color: activeKeyX === key ? 'white' : color
                      }} />
                      <span className="d-none d-lg-inline" style={{ 
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '120px',
                        color: activeKeyX === key ? 'white' : '#64748b'
                      }}>
                        {label}
                      </span>
                      <span className="d-inline d-lg-none" style={{ 
                        fontSize: '11px',
                        fontWeight: activeKeyX === key ? '600' : '500',
                        color: activeKeyX === key ? 'white' : '#64748b'
                      }}>
                        {shortLabel}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Content Area with Animation */}
          <motion.div
            key={activeKeyX}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <Tab.Content 
              style={{ 
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 4px 32px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                minHeight: '500px'
              }}
            >
              <Tab.Pane eventKey="tab1" active={activeKeyX === "tab1"}>
                <LandingBPS activeKey={activeKeyX} reload={reload} />
              </Tab.Pane>
              <Tab.Pane eventKey="tab2" active={activeKeyX === "tab2"}>
                <LandingBapanas activeKey={activeKeyX} reload={reload} />
              </Tab.Pane>
              <Tab.Pane eventKey="tab3" active={activeKeyX === "tab3"}>
                <LandingTriwulanan activeKey={activeKeyX} reload={reload} />
              </Tab.Pane>
             <Tab.Pane eventKey="tab4" active={activeKeyX === "tab4"}>
                <LandingPermasalahan activeKey={activeKeyX} reload={reload} />
              </Tab.Pane>
              <Tab.Pane eventKey="tab5" active={activeKeyX === "tab5"}>
                <LandingKesimpulan activeKey={activeKeyX} reload={reload} />
              </Tab.Pane> 
            </Tab.Content>
          </motion.div>
        </Tab.Container>
        
        <LandingMbgKanwil
          show={showModalkomo}
          tabdata={activeKeyX}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      </section>
    </main>
  );
};
