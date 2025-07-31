import React, { useContext, useState, useEffect } from "react";
import { Table, Container, Spinner, Card } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const EpaPaguMinusTB = ({ thang, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, username, token, dataEpa } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [previousYearTotal, setPreviousYearTotal] = useState(0);
  const [currentYearTotal, setCurrentYearTotal] = useState(0);

  // Function to calculate real growth percentage
  const calculateGrowthPercentage = (currentTotal, previousTotal) => {
    if (previousTotal === 0) return 0;
    const growth = ((currentTotal - previousTotal) / previousTotal) * 100;
    return parseFloat(growth.toFixed(1));
  };

  // Function to get previous year data
  const getPreviousYearData = async () => {
    let filterKanwil = kdkanwil && kdkanwil !== "00" ? ` AND a.kdkanwil='${kdkanwil}'` : "";
    let filterKppn = kdkppn && kdkppn !== "000" ? ` AND a.kdkppn='${kdkppn}'` : "";
    const query = `SELECT
        a.kdakun, b.nmakun as nmakun,
        SUM(ABS(a.sisa)) AS saldo
      FROM digitalisasi_epa.pagu_real_minus_epa a
      LEFT JOIN dbref2025.t_akun b ON a.kdakun = b.kdakun
      WHERE a.thang = ${thang - 1} AND a.kddept = ${dept}${filterKanwil}${filterKppn}
      GROUP BY
        a.kdakun, b.nmakun`;

    const cleanedQuery = decodeURIComponent(query)
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
      const previousData = response.data.result || [];
      const previousTotal = previousData.reduce((sum, item) => sum + parseInt(item.saldo), 0);
      setPreviousYearTotal(previousTotal);
      return previousTotal;
    } catch (error) {
      console.error("Error fetching previous year data:", error);
      return 0;
    }
  };

  const getData = async () => {
    setLoading(true);

    try {
      // Get previous year data first
      const previousTotal = await getPreviousYearData();

      // Get current year data
      let filterKanwil = kdkanwil && kdkanwil !== "00" ? ` AND a.kdkanwil='${kdkanwil}'` : "";
      let filterKppn = kdkppn && kdkppn !== "000" ? ` AND a.kdkppn='${kdkppn}'` : "";
      const query = `SELECT
          a.kdakun, b.nmakun as nmakun,
          SUM(ABS(a.sisa)) AS saldo
        FROM digitalisasi_epa.pagu_real_minus_epa a
        LEFT JOIN dbref2025.t_akun b ON a.kdakun = b.kdakun
        WHERE a.thang = ${thang} AND a.kddept = ${dept}${filterKanwil}${filterKppn}
        GROUP BY
          a.kdakun, b.nmakun`;

      const cleanedQuery = decodeURIComponent(query)
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const encryptedQuery = Encrypt(cleanedQuery);

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

      const resultData = response.data.result || [];
      setData(resultData);

      // Calculate current year total
      const currentTotal = resultData.reduce((sum, item) => sum + parseInt(item.saldo), 0);
      setCurrentYearTotal(currentTotal);

      // Calculate real growth percentage
      const growth = calculateGrowthPercentage(currentTotal, previousTotal);
      setGrowthPercentage(growth);

    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [dataEpa, kdkanwil, kdkppn]);

  // Menghitung total saldo
  const totalSaldo = data.reduce(
    (total, item) => total + parseInt(item.saldo),
    0
  );

  // Growth indicator component with detailed comparison
  const GrowthIndicator = ({ percentage, currentTotal, previousTotal }) => {
    const isPositive = percentage >= 0;
    const color = isPositive ? '#28a745' : '#dc3545'; // Green for positive, red for negative
    const icon = isPositive ? '↗' : '↘';

    return (
      <div style={{ textAlign: 'right' }}>
        {/* Growth percentage badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: isPositive ? '#d4edda' : '#f8d7da',
            color: color,
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: `1px solid ${isPositive ? '#c3e6cb' : '#f5c6cb'}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '8px'
          }}
        >
          <span style={{ marginRight: '4px', fontSize: '16px' }}>{icon}</span>
          {isPositive ? '+' : ''}{percentage}%
        </div>

        {/* Comparison details */}
        <div style={{ fontSize: '12px', color: '#6c757d', lineHeight: '1.3' }}>
          <div><strong>Total Pagu Minus:</strong> {currentTotal.toLocaleString('id-ID')}</div>
          <div><strong>Periode:</strong> Tahun {thang}</div>
        </div>
      </div>
    );
  };

  return (
    <Container fluid>
      {/* Header Section with Growth Indicator */}
      <div
        className="d-flex justify-content-between align-items-center my-3"
        style={{ minHeight: '80px' }}
      >
        <h5 className="mb-0">Pagu Minus Tahun {thang} (dalam rupiah)</h5>
        <GrowthIndicator
          percentage={growthPercentage}
          currentTotal={currentYearTotal}
          previousTotal={previousYearTotal}
        />
      </div>
      <Card>
        <Card.Body
          style={{
            height: "550px",
            scrollBehavior: "smooth",
            overflow: "auto",
            marginBottom: "30px",
          }}
        >
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive className="mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>No</th>
                    <th>Akun</th>
                    <th>Saldo (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {item.nmakun} ({item.kdakun})
                        </td>
                        <td className="text-end">
                          {parseInt(item.saldo).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        Tidak ada data tersedia
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Total Saldo Tetap di Bawah */}
              <div
                className="table-total fade-in"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 20,
                  width: "100%",
                  background: "#fff",
                  padding: "10px",
                  borderTop: "2px solid black",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                Total Pagu Minus: {totalSaldo.toLocaleString("id-ID")}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EpaPaguMinusTB;
