import React, { useState, useEffect, useRef, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import EpaChartBelanja from "../chart/chartTrenbelanja";
import MyContext from "../../../../auth/Context";
import EpaSdana from "../chart/SumberDana";
import EpaChartDukmanReChart from "../chart/chartDukmanReChart";
import EpaChartTrenBulanan from "../chart/chartTrenBulanan";

const TabTrenJenisBelanja = () => {
  const { dataEpa, kdkanwil, kdkppn } = useContext(MyContext);
  const periodOptions = [
    "Januari",
    "Pebruari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const monthIndex = periodOptions.indexOf(dataEpa.period);
  const monthNumber =
    monthIndex !== -1 ? String(monthIndex + 1).padStart(2, "0") : "00";

  // 🔥 State untuk mengontrol visibilitas
  const [visible, setVisible] = useState({
    dukman: false,
    sdana: false,
    belanja: false,
    trenBulanan: false,
  });

  // 🔥 useRef untuk setiap elemen
  const refs = {
    dukman: useRef(null),
    sdana: useRef(null),
    belanja: useRef(null),
    trenBulanan: useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.dataset.type]: true,
            }));
          }
        });
      },
      { threshold: 0.3 } // Tampilkan saat 30% elemen terlihat
    );

    Object.values(refs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(refs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <div>
      <Row>
        {/* Efek slide-in dari kiri */}
        <Col xs={12} sm={6} md={6} lg={6} className="mb-0">
          <motion.div
            ref={refs.dukman}
            data-type="dukman"
            initial={{ opacity: 0, x: -100 }}
            animate={
              visible.dukman ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div>
              <EpaChartDukmanReChart
                thang={dataEpa.year}
                periode={monthNumber}
                dept={dataEpa.kddept}
                kdkanwil={kdkanwil}
                kdkppn={kdkppn}
              />
            </div>
          </motion.div>
        </Col>

        {/* Efek slide-in dari kanan */}
        <Col xs={12} sm={6} md={6} lg={6} className="mb-0">
          <motion.div
            ref={refs.sdana}
            data-type="sdana"
            initial={{ opacity: 0, x: 100 }}
            animate={
              visible.sdana ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div>
              <EpaSdana
                thang={dataEpa.year}
                periode={monthNumber}
                dept={dataEpa.kddept}
                kdkanwil={kdkanwil}
                kdkppn={kdkppn}
              />
            </div>
          </motion.div>
        </Col>
      </Row>

      <Row>
        {/* Efek fade-in */}
        <Col xs={12} sm={12} md={12} lg={12} className="mb-0">
          <motion.div
            ref={refs.belanja}
            data-type="belanja"
            initial={{ opacity: 0 }}
            animate={visible.belanja ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <EpaChartBelanja
              kdkanwil={kdkanwil}
              kdkppn={kdkppn}
            />
          </motion.div>
        </Col>
      </Row>

      <Row>
        {/* Efek muncul dari bawah */}
        <Col xs={12} sm={12} md={12} lg={12} className="mb-0">
          <motion.div
            ref={refs.trenBulanan}
            data-type="trenBulanan"
            initial={{ opacity: 0, y: 50 }}
            animate={
              visible.trenBulanan ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EpaChartTrenBulanan
              thang={dataEpa.year}
              periode={monthNumber}
              dept={dataEpa.kddept}
              kdkanwil={kdkanwil}
              kdkppn={kdkppn}
            />
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default TabTrenJenisBelanja;
