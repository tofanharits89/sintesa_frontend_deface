import React, { useState, useEffect, useContext } from "react";
import { Card, Form, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";

const SidebarProvinsi = ({
  onSelectProvince,
  onSetJumlahProvinsi,
  darkMode,
  prov,
}) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const getData = async () => {
    setLoading(true);
    const query = `
      SELECT wilkode, wilnama, jumlahsppg
      FROM data_bgn.data_summary_prov 
      ORDER BY wilkode
    `
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(query);

    try {
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
        }${encryptedQuery}&user=${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const provinces = response.data.result || [];
      setData(provinces);
      onSetJumlahProvinsi(provinces);
    } catch (error) {
      const { status, data } = error.response || {};
      console.log("Error response:", error);
      // handleHttpError not defined in this snippet, assumed handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    onSelectProvince("NASIONAL");
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.location.hash = "";
    }
  }, [location.hash]);

  const allProvinces = [{ wilnama: "NASIONAL" }, ...data];

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    const jumlah =
      selected === "NASIONAL"
        ? null
        : data.find((d) => d.wilnama === selected)?.jumlahsppg || 0;

    onSelectProvince(selected);
    onSetJumlahProvinsi(jumlah);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Form.Group controlId="selectProvince">
        {/* <Form.Label className="fw-bold">Pilih Provinsi</Form.Label> */}
        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Memuat data...</span>
          </div>
        ) : (
          <Form.Select
            value={prov}
            onChange={handleSelectChange}
            className={darkMode ? "dark-mode" : ""}
          >
            {allProvinces.map((provinsi, idx) => (
              <option key={idx} value={provinsi.wilnama}>
                {provinsi.wilnama.length > 35
                  ? provinsi.wilnama.slice(0, 35) + "..."
                  : provinsi.wilnama}
              </option>
            ))}
          </Form.Select>
        )}
      </Form.Group>
    </motion.div>
  );
};

export default SidebarProvinsi;
