// Data pada tabel ini diambil dari query digitalisasi_epa.sql (lihat dokumentasi SQL)

import React, { useEffect, useState, useContext } from "react";
import { Table, Spinner, Container, Card } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import numeral from "numeral";

const Eselon1New = ({ thang, periode, kdkanwil, kdkppn }) => {
  const { axiosJWT, token, username, dataEpa } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Base query
      let query = `SELECT a.kdunit AS KDUNIT, a.nmunit AS NMUNIT, ROUND(SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2024, ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2024, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2024 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2024, ROUND(SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) / 10000000000, 2) AS pagu2025, ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / 10000000000, 2) AS real2025, CASE WHEN SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) > 0 THEN ROUND(SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) / SUM(CASE WHEN a.thang = 2025 THEN a.pagu ELSE 0 END) * 100, 1) ELSE 0 END AS persen2025, ROUND(SUM(a.blokir) / 10000000000, 2) AS blokir, CASE WHEN SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) > 0 THEN ROUND(((SUM(CASE WHEN a.thang = 2025 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END) - SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) / SUM(CASE WHEN a.thang = 2024 THEN (a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12) ELSE 0 END)) * 100, 2) ELSE 0 END AS growth_yoy, '' AS keterangan FROM pagu_real_utama a WHERE a.thang IN (2024, 2025)`;

      // Tambahkan filter berdasarkan props
      const whereConditions = [];

      if (kdkanwil && kdkanwil !== "") {
        whereConditions.push(`a.kdkanwil = '${kdkanwil}'`);
      }

      if (kdkppn && kdkppn !== "") {
        whereConditions.push(`a.kdkppn = '${kdkppn}'`);
      }

      // Tambahkan kondisi tambahan ke WHERE clause
      if (whereConditions.length > 0) {
        query += ` AND ${whereConditions.join(" AND ")}`;
      }

      query += ` GROUP BY a.kdunit, a.nmunit ORDER BY a.kdunit`;

      const cleanedQuery = query
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const encryptedQuery = Encrypt(cleanedQuery);

      try {
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
            ? `${
                import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
              }${encryptedQuery}&user=${username}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.result || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [thang, periode, kdkanwil, kdkppn, token, axiosJWT, username]); // useEffect akan trigger ketika kdkanwil atau kdkppn berubah

  const columns = [
    "KDUNIT",
    "NMUNIT",
    "Pagu 2024",
    "Real 2024",
    "% 2024",
    "Pagu 2025",
    "Real 2025",
    "% 2025",
    "Blokir",
    "GROWTH (yoy)",
    "Keterangan",
  ];

  return (
    <Container fluid>
      <h6 style={{ fontWeight: "bold", color: "#333" }}>
        Kinerja Eselon I Utama
        {kdkanwil && ` - Kanwil: ${kdkanwil}`}
        {kdkppn && ` - KPPN: ${kdkppn}`}
      </h6>
      <Card>
        <Card.Body style={{ height: "400px", overflow: "auto" }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table
              bordered
              responsive
              size="sm"
              style={{ marginBottom: "20px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#e9ecef" }}>
                  <th
                    rowSpan="2"
                    className="text-center align-middle"
                    style={{
                      fontSize: "12px",
                      padding: "8px 4px",
                      width: "10%",
                    }}
                  >
                    {columns[0]}
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center align-middle"
                    style={{
                      fontSize: "12px",
                      padding: "8px 4px",
                      width: "15%",
                    }}
                  >
                    {columns[1]}
                  </th>
                  <th
                    colSpan="3"
                    className="text-center"
                    style={{
                      fontSize: "12px",
                      padding: "8px 4px",
                      backgroundColor: "#d1ecf1",
                    }}
                  >
                    2024
                  </th>
                  <th
                    colSpan="3"
                    className="text-center"
                    style={{
                      fontSize: "12px",
                      padding: "8px 4px",
                      backgroundColor: "#d4edda",
                    }}
                  >
                    2025
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center align-middle"
                    style={{
                      fontSize: "12px",
                      padding: "8px 4px",
                      width: "8%",
                    }}
                  >
                    Blokir
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center align-middle"
                    style={{
                      fontSize: "12px",
                      padding: "8px 4px",
                      width: "10%",
                    }}
                  >
                    GROWTH (yoy)
                  </th>
                  <th
                    rowSpan="2"
                    className="text-center align-middle"
                    style={{
                      fontSize: "12px",
                      padding: "8px 4px",
                      width: "12%",
                    }}
                  >
                    Keterangan
                  </th>
                </tr>
                <tr style={{ backgroundColor: "#e9ecef" }}>
                  <th
                    className="text-center"
                    style={{ fontSize: "11px", padding: "6px 4px" }}
                  >
                    Pagu
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "11px", padding: "6px 4px" }}
                  >
                    Real
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "11px", padding: "6px 4px" }}
                  >
                    %
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "11px", padding: "6px 4px" }}
                  >
                    Pagu
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "11px", padding: "6px 4px" }}
                  >
                    Real
                  </th>
                  <th
                    className="text-center"
                    style={{ fontSize: "11px", padding: "6px 4px" }}
                  >
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontSize: "11px", padding: "4px" }}>
                        {item.KDUNIT || "-"}
                      </td>
                      <td style={{ fontSize: "11px", padding: "4px" }}>
                        {item.NMUNIT || "-"}
                      </td>
                      <td
                        className="text-right"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {numeral(item.pagu2024 || 0).format("0,0.00")}
                      </td>
                      <td
                        className="text-right"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {numeral(item.real2024 || 0).format("0,0.00")}
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {item.persen2024 || 0}%
                      </td>
                      <td
                        className="text-right"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {numeral(item.pagu2025 || 0).format("0,0.00")}
                      </td>
                      <td
                        className="text-right"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {numeral(item.real2025 || 0).format("0,0.00")}
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {item.persen2025 || 0}%
                      </td>
                      <td
                        className="text-right"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {numeral(item.blokir || 0).format("0,0.00")}
                      </td>
                      <td
                        className="text-center"
                        style={{
                          fontSize: "11px",
                          padding: "4px",
                          color: (item.growth_yoy || 0) >= 0 ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {item.growth_yoy || 0}%
                      </td>
                      <td
                        className="text-center"
                        style={{ fontSize: "11px", padding: "4px" }}
                      >
                        {item.keterangan || ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Eselon1New;
