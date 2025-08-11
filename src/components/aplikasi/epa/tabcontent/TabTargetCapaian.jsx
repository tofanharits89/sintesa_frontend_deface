import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import MyContext from "../../../../auth/Context";
import TargetRealisasi from "../chart/TargetRealisasi";
import Deviasi from "../chart/Deviasi";
import KinerjaBansosBanper from "../chart/KinejaBansosBanper";
import KinerjaKontrak from "../chart/KinerjaKontrak";
import Revisi from "../chart/Revisi";

const TabTargetCapaian = () => {
  const { dataEpa, kdkanwil, kdkppn } = useContext(MyContext);

  // Debug props filter
  // console.log("[TabTargetCapaian] filter props:", {
  //   kdkanwil,
  //   kdkppn,
  //   dataEpa,
  // });

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

  const [visible, setVisible] = useState({
    sdana: false,
    deviasi: false,
    bansos: false,
    kontrak: false,
  });

  const refs = {
    sdana: useRef(null),
    deviasi: useRef(null),
    bansos: useRef(null),
    kontrak: useRef(null),
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
            observer.unobserve(entry.target); // Stop observing after first trigger
          }
        });
      },
      { threshold: 0.3 }
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4 } },
  };

  const zoomIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.4 } },
  };

  return (
    <div style={{ marginBottom: "100px" }}>
      <div
        className="d-flex justify-content-end mx-3 "
        style={{ fontSize: "1rem", fontStyle: "italic" }}
      >
        (dalam milyar)
      </div>
      <motion.div
        ref={refs.sdana}
        data-type="sdana"
        initial={false}
        animate={visible.sdana ? "visible" : "hidden"}
        exit="exit"
        variants={fadeInUp}
      >
        <TargetRealisasi
          thang={dataEpa.year}
          periode={monthNumber}
          dept={dataEpa.kddept}
          kdkanwil={kdkanwil}
          kdkppn={kdkppn}
        />
      </motion.div>

      <motion.div
        ref={refs.deviasi}
        data-type="deviasi"
        initial={false}
        animate={visible.deviasi ? "visible" : "hidden"}
        exit="exit"
        variants={zoomIn}
      >
        <Deviasi
          thang={dataEpa.year}
          dept={dataEpa.kddept}
          periode={monthNumber}
          kdkanwil={kdkanwil}
          kdkppn={kdkppn}
        />
      </motion.div>

      <motion.div
        ref={refs.bansos}
        data-type="bansos"
        initial={false}
        animate={visible.bansos ? "visible" : "hidden"}
        exit="exit"
        variants={fadeInUp}
      >
        <KinerjaBansosBanper
          thang={dataEpa.year}
          dept={dataEpa.kddept}
          periode={monthNumber}
          kdkanwil={kdkanwil}
          kdkppn={kdkppn}
        />
      </motion.div>

      <motion.div
        ref={refs.kontrak}
        data-type="kontrak"
        initial={false}
        animate={visible.kontrak ? "visible" : "hidden"}
        exit="exit"
        variants={zoomIn}
      >
        <KinerjaKontrak
          thang={dataEpa.year}
          dept={dataEpa.kddept}
          periode={monthNumber}
          kdkanwil={kdkanwil}
          kdkppn={kdkppn}
        />
      </motion.div>
      <motion.div
        ref={refs.revisi}
        data-type="revisi"
        initial={false}
        animate={visible.kontrak ? "visible" : "hidden"}
        exit="exit"
        variants={fadeInUp}
      >
        <Revisi
          thang={dataEpa.year}
          dept={dataEpa.kddept}
          periode={monthNumber}
          kdkanwil={kdkanwil}
          kdkppn={kdkppn}
        />
      </motion.div>
    </div>
  );
};

export default TabTargetCapaian;
