import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import numeral from "numeral";
import { motion } from "framer-motion";

export const JumlahSppg = ({ prov }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState(null);

  const cardStyle = {
    background: "linear-gradient(35deg, #d6f6ff, #46d2fc)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "20px",
    cursor: "pointer",
    color: "#fff",
  };

  const labelStyle = {
    fontSize: "1.1rem",
    color: "#007bff",
    fontWeight: "600",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
  };

  const valueStyle = {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
  };

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(`
      SELECT 
        (SELECT SUM(y) FROM data_bgn.by_jenis ) AS jumlahsppg,
        (SELECT SUM(y) FROM data_bgn.by_petugas ) AS jumlahpetugas,
        (SELECT SUM(y) FROM data_bgn.by_kelompok ) AS jumlahkelompok,
        (SELECT SUM(y) FROM data_bgn.by_penerima ) AS jumlahpenerima,
        (SELECT jum_terima FROM data_bgn.by_kemarin ORDER BY id DESC LIMIT 1) AS jumlahkemarin,
        (SELECT jum_terima FROM data_bgn.by_sekarang ORDER BY id DESC LIMIT 1) AS jumlahsekarang 
    `);

    const encodedQueryWilayah = encodeURIComponent(`
      SELECT 
        (SELECT COUNT(DISTINCT namasppg) FROM data_bgn.by_kelompok_detail WHERE provinsi = '${prov}') AS jumlahsppg,
        (SELECT SUM(y) FROM data_bgn.by_petugas) AS jumlahpetugas,
        (SELECT COUNT(DISTINCT id) FROM data_bgn.by_kelompok_detail WHERE provinsi = '${prov}') AS jumlahkelompok,
        (SELECT sum(jumlah) from data_bgn.by_penerima_detail WHERE provinsi = '${prov}') AS jumlahpenerima,
        (SELECT jum_terima FROM data_bgn.by_kemarin ORDER BY id DESC LIMIT 1) AS jumlahkemarin,
        (SELECT jum_terima FROM data_bgn.by_sekarang ORDER BY id DESC LIMIT 1) AS jumlahsekarang
    `);

    const queryMBG = prov === "NASIONAL" ? encodedQuery : encodedQueryWilayah;
    const cleanedQuery = decodeURIComponent(queryMBG)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataSummary(response.data.result?.[0] || null);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  const renderItem = (
    label,
    value,
    isNationalOnly = false,
    index = 0,
    colSize = {}
  ) => {
    const { xs = 12, sm = 2, md = 2, lg = 2, xl = 2 } = colSize; // Menyesuaikan dengan 1 baris
    return (
      <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} className="mb-4" key={label}>
        <motion.div
          style={cardStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.1 }}
          whileHover={{ scale: 1.15 }}
        >
          <div className="text-center">
            <div style={labelStyle}>{label}</div>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <div style={valueStyle}>
                {isNationalOnly && prov !== "NASIONAL"
                  ? "N/A"
                  : numeral(value).format("0,0")}
              </div>
            )}
          </div>
        </motion.div>
      </Col>
    );
  };

  useEffect(() => {
    getData();
  }, [prov]);

  return (
    <Container fluid>
      {/* <h5 className="fw-bold mt-2 text-center" style={{ color: "#075871" }}>
        Data Penyaluran MBG - {prov}
      </h5>
      <hr className="mb-2" /> */}
      {dataSummary ? (
        <Row className="g-3">
          {renderItem("SPPG", dataSummary.jumlahsppg, false, 0, {
            xs: 12,
            sm: 2, // Set menjadi 2 untuk menampilkan dalam satu baris
            md: 2,
            lg: 2,
            xl: 2,
          })}
          {renderItem("Petugas", dataSummary.jumlahpetugas, true, 1, {
            xs: 12,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          })}
          {renderItem("Kelompok", dataSummary.jumlahkelompok, false, 2, {
            xs: 12,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          })}
          {renderItem("Penerima", dataSummary.jumlahpenerima, false, 3, {
            xs: 12,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          })}
          {renderItem("Kemarin", dataSummary.jumlahkemarin, true, 4, {
            xs: 12,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          })}
          {renderItem("Sekarang", dataSummary.jumlahsekarang, true, 5, {
            xs: 12,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 2,
          })}
        </Row>
      ) : (
        <p className="text-muted text-center">Data tidak tersedia.</p>
      )}
    </Container>
  );
};
