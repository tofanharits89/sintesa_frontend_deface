import React, { useState, useContext } from "react";
import { Tab } from "react-bootstrap";
import Swal from "sweetalert2";
import { ModalRekamBPS } from "./ModalRekamBPS";
import { ModalRekamBapanas } from "./ModalRekamBapanas";
//import { ModalRekamBulanan } from "./ModalRekamBulanan";
import { ModalPermasalahanIsu } from "./ModalPermasalahanIsu";
import { ModalKesimpulan } from "./ModalKesimpulan";
import { motion } from "framer-motion";
import { ModalRekamTriwulan } from "./ModalRekamTriwulan";
import MyContext from "../../../../auth/Context";
import { EPANOTIF } from "../../notifikasi/Omspan";
import { useEffect } from "react";
import {
  FaChartBar,
  FaShoppingCart,
  FaRegClock,
  FaExclamationTriangle,
  FaClipboardCheck,
} from "react-icons/fa";

export const TabKanwil = ({ tabdata, onClose }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [activeKey, setActiveKey] = useState("tab1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tabdata) {
      setActiveKey(tabdata); // sinkronkan dengan prop dari parent
    }
  }, [tabdata]);


  useEffect(() => {
    if (tabdata) {
      setActiveKey(tabdata); // sinkronkan dengan prop dari parent
    }
  }, [tabdata]);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };  const handleSimpan = async (values) => {
    // Data sudah disimpan di Modal dan notifikasi sudah ditampilkan
    console.log('Data berhasil disimpan:', values);
    
    // Trigger refresh untuk semua data tables
    if (window.triggerBPSDataRefresh) {
      window.triggerBPSDataRefresh();
    }
    // Tambahkan trigger refresh untuk data lain jika diperlukan
    if (window.triggerBapanasDataRefresh) {
      window.triggerBapanasDataRefresh();
    }
    if (window.triggerTriwulanDataRefresh) {
      window.triggerTriwulanDataRefresh();
    }
    if (window.triggerPermasalahanDataRefresh) {
      window.triggerPermasalahanDataRefresh();
    }
    if (window.triggerKesimpulanDataRefresh) {
      window.triggerKesimpulanDataRefresh();
    }
    
    // Tutup modal setelah berhasil simpan
    if (onClose) {
      onClose();
    }
    return Promise.resolve();
  };  return (
    <Tab.Container activeKey={activeKey}>
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
                aria-selected={activeKey === key}
                style={{
                  background: activeKey === key 
                    ? `linear-gradient(135deg, ${color} 0%, ${color}e6 100%)`
                    : 'transparent',
                  color: activeKey === key ? 'white' : '#64748b',
                  borderRadius: '16px',
                  padding: '14px 12px',
                  fontSize: '11px',
                  fontWeight: activeKey === key ? '700' : '500',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: 'none',
                  boxShadow: activeKey === key 
                    ? `0 6px 20px ${color}30, 0 2px 8px ${color}20`
                    : 'none',
                  transform: activeKey === key ? 'translateY(-2px) scale(1.02)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}                onMouseEnter={(e) => {
                  if (activeKey !== key) {
                    e.target.style.background = `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`;
                    e.target.style.color = color;
                    e.target.style.transform = 'translateY(-1px)';
                    // Update child elements color on hover
                    const icon = e.target.querySelector('svg');
                    const spans = e.target.querySelectorAll('span');
                    if (icon) icon.style.color = color;
                    spans.forEach(span => span.style.color = color);
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeKey !== key) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#64748b';
                    e.target.style.transform = 'translateY(0)';
                    // Reset child elements color on mouse leave
                    const icon = e.target.querySelector('svg');
                    const spans = e.target.querySelectorAll('span');
                    if (icon) icon.style.color = '#64748b';
                    spans.forEach(span => span.style.color = '#64748b');
                  }
                }}
                title={label}
              >                <div className="d-flex align-items-center justify-content-center gap-2 flex-column flex-sm-row">
                  <Icon size={16} style={{ 
                    minWidth: '16px',
                    color: activeKey === key ? 'white' : '#64748b'
                  }} />
                  <span className="d-none d-lg-inline" style={{ 
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px',
                    color: activeKey === key ? 'white' : '#64748b'
                  }}>
                    {label}
                  </span>
                  <span className="d-inline d-lg-none" style={{ 
                    fontSize: '11px',
                    fontWeight: activeKey === key ? '600' : '500',
                    color: activeKey === key ? 'white' : '#64748b'
                  }}>
                    {shortLabel}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>      {/* Enhanced Content Area with Animation */}
      <motion.div
        key={activeKey}
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
            minHeight: '500px',
            maxHeight: '500px',
            height: '500px', // tinggi fix untuk semua tab
            width: '100%',
            overflow: 'auto'
          }}
        >
          <Tab.Pane eventKey="tab1" active={activeKey === "tab1"}>
            <ModalRekamBPS onSave={handleSimpan} id="1" onClose={onClose} />
          </Tab.Pane>
          <Tab.Pane eventKey="tab2" active={activeKey === "tab2"}>
            <ModalRekamBapanas onSave={handleSimpan} id="2" onClose={onClose} />
          </Tab.Pane>         
           <Tab.Pane eventKey="tab3" active={activeKey === "tab3"}>
            <ModalRekamTriwulan onSave={handleSimpan} id="3" onClose={onClose} />
          </Tab.Pane>
          <Tab.Pane eventKey="tab4" active={activeKey === "tab4"}>
            <ModalPermasalahanIsu onSave={handleSimpan} id="4" onClose={onClose} />
          </Tab.Pane>
          <Tab.Pane eventKey="tab5" active={activeKey === "tab5"}>
            <ModalKesimpulan onSave={handleSimpan} id="5" onClose={onClose} />
          </Tab.Pane>
        </Tab.Content>
      </motion.div>
    </Tab.Container>
  );
};
