import React, { useContext, useState, useEffect } from "react";
import { Table, Container, Card, Spinner } from "react-bootstrap";
import numeral from "numeral"; // Impor numeral
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const EpaUpTayl = ({ thang, dept, kdkanwil, kdkppn }) => {
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
    let filterKanwil = kdkanwil && kdkanwil !== "00" ? ` AND kdkanwil='${kdkanwil}'` : "";
    let filterKppn = kdkppn && kdkppn !== "000" ? ` AND kdkppn='${kdkppn}'` : "";

    const encodedQuery = encodeURIComponent(
      `SELECT
        KDDEPT,
        THANG,
        SUM(CASE WHEN JENIS = 'UP RM' THEN RUPIAH ELSE 0 END) AS UP_RM,
        SUM(CASE WHEN JENIS = 'GUP RM' THEN RUPIAH ELSE 0 END) AS GUP_RM
      FROM digitalisasi_epa.dash_uptup
      WHERE thang = ${thang - 1} AND kddept = ${dept}${filterKanwil}${filterKppn}
      GROUP BY KDDEPT, THANG

      UNION ALL

      SELECT
        KDDEPT,
        THANG,
        SUM(CASE WHEN JENIS = 'TUP RM' THEN RUPIAH ELSE 0 END) AS TUP_RM,
        SUM(CASE WHEN JENIS = 'GTUP RM' THEN RUPIAH ELSE 0 END) AS GTUP_RM
      FROM digitalisasi_epa.dash_uptup
      WHERE thang = ${thang - 1} AND kddept = ${dept}${filterKanwil}${filterKppn}
      GROUP BY KDDEPT, THANG

      UNION ALL

      SELECT
        KDDEPT,
        THANG,
        SUM(CASE WHEN JENIS = 'UP PNBP' THEN RUPIAH ELSE 0 END) AS UP_PNBP,
        SUM(CASE WHEN JENIS = 'GUP PNBP' THEN RUPIAH ELSE 0 END) AS GUP_PNBP
      FROM digitalisasi_epa.dash_uptup
      WHERE thang = ${thang - 1} AND kddept = ${dept}${filterKanwil}${filterKppn}
      GROUP BY KDDEPT, THANG

      UNION ALL

      SELECT
        KDDEPT,
        THANG,
        SUM(CASE WHEN JENIS = 'TUP PNBP' THEN RUPIAH ELSE 0 END) AS TUP_PNBP,
        SUM(CASE WHEN JENIS = 'GTUP PNBP' THEN RUPIAH ELSE 0 END) AS GTUP_PNBP
      FROM digitalisasi_epa.dash_uptup
      WHERE thang = ${thang - 1} AND kddept = ${dept}${filterKanwil}${filterKppn}
      GROUP BY KDDEPT, THANG

      UNION ALL

      SELECT
        KDDEPT,
        THANG,
        abs(SUM(CASE WHEN JENIS = 'GUP TAYL' THEN RUPIAH ELSE 0 END)) AS GUP_TAYL,
        abs(SUM(CASE WHEN JENIS = 'PTUP TAYL' THEN RUPIAH ELSE 0 END)) AS PTUP_TAYL
      FROM digitalisasi_epa.dash_uptup
      WHERE thang = ${thang - 1} AND kddept = ${dept}${filterKanwil}${filterKppn}
      GROUP BY KDDEPT, THANG`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
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
      const previousFormattedData = [
        {
          jenis: "UP RM",
          spmPembayaran: parseInt(previousData[0]?.UP_RM || 0),
          spmPenihilan: parseInt(previousData[0]?.GUP_RM || 0),
        },
        {
          jenis: "TUP RM",
          spmPembayaran: parseInt(previousData[1]?.UP_RM || 0),
          spmPenihilan: parseInt(previousData[1]?.GUP_RM || 0),
        },
        {
          jenis: "UP PNBP",
          spmPembayaran: parseInt(previousData[2]?.UP_RM || 0),
          spmPenihilan: parseInt(previousData[2]?.GUP_RM || 0),
        },
        {
          jenis: "TUP PNBP",
          spmPembayaran: parseInt(previousData[3]?.UP_RM || 0),
          spmPenihilan: parseInt(previousData[3]?.GUP_RM || 0),
        },
        {
          jenis: "TUP TAYL",
          spmPembayaran: parseInt(previousData[4]?.UP_RM || 0),
          spmPenihilan: parseInt(previousData[4]?.GUP_RM || 0),
        },
      ];

      const previousTotal = previousFormattedData
        .filter((item) => !item.jenis.includes("TAYL"))
        .reduce((total, item) => total + item.spmPembayaran + item.spmPenihilan, 0);

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
      let filterKanwil = kdkanwil && kdkanwil !== "00" ? ` AND kdkanwil='${kdkanwil}'` : "";
      let filterKppn = kdkppn && kdkppn !== "000" ? ` AND kdkppn='${kdkppn}'` : "";

      const encodedQuery = encodeURIComponent(
        `SELECT
          KDDEPT,
          THANG,
          SUM(CASE WHEN JENIS = 'UP RM' THEN RUPIAH ELSE 0 END) AS UP_RM,
          SUM(CASE WHEN JENIS = 'GUP RM' THEN RUPIAH ELSE 0 END) AS GUP_RM
        FROM digitalisasi_epa.dash_uptup
        WHERE thang = ${thang} AND kddept = ${dept}${filterKanwil}${filterKppn}
        GROUP BY KDDEPT, THANG

        UNION ALL

        SELECT
          KDDEPT,
          THANG,
          SUM(CASE WHEN JENIS = 'TUP RM' THEN RUPIAH ELSE 0 END) AS TUP_RM,
          SUM(CASE WHEN JENIS = 'GTUP RM' THEN RUPIAH ELSE 0 END) AS GTUP_RM
        FROM digitalisasi_epa.dash_uptup
        WHERE thang = ${thang} AND kddept = ${dept}${filterKanwil}${filterKppn}
        GROUP BY KDDEPT, THANG

        UNION ALL

        SELECT
          KDDEPT,
          THANG,
          SUM(CASE WHEN JENIS = 'UP PNBP' THEN RUPIAH ELSE 0 END) AS UP_PNBP,
          SUM(CASE WHEN JENIS = 'GUP PNBP' THEN RUPIAH ELSE 0 END) AS GUP_PNBP
        FROM digitalisasi_epa.dash_uptup
        WHERE thang = ${thang} AND kddept = ${dept}${filterKanwil}${filterKppn}
        GROUP BY KDDEPT, THANG

        UNION ALL

        SELECT
          KDDEPT,
          THANG,
          SUM(CASE WHEN JENIS = 'TUP PNBP' THEN RUPIAH ELSE 0 END) AS TUP_PNBP,
          SUM(CASE WHEN JENIS = 'GTUP PNBP' THEN RUPIAH ELSE 0 END) AS GTUP_PNBP
        FROM digitalisasi_epa.dash_uptup
        WHERE thang = ${thang} AND kddept = ${dept}${filterKanwil}${filterKppn}
        GROUP BY KDDEPT, THANG

        UNION ALL

        SELECT
          KDDEPT,
          THANG,
          abs(SUM(CASE WHEN JENIS = 'GUP TAYL' THEN RUPIAH ELSE 0 END)) AS GUP_TAYL,
          abs(SUM(CASE WHEN JENIS = 'PTUP TAYL' THEN RUPIAH ELSE 0 END)) AS PTUP_TAYL
        FROM digitalisasi_epa.dash_uptup
        WHERE thang = ${thang} AND kddept = ${dept}${filterKanwil}${filterKppn}
        GROUP BY KDDEPT, THANG`
      );

      const cleanedQuery = decodeURIComponent(encodedQuery)
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
      const currentFormattedData = [
        {
          jenis: "UP RM",
          spmPembayaran: parseInt(resultData[0]?.UP_RM || 0),
          spmPenihilan: parseInt(resultData[0]?.GUP_RM || 0),
        },
        {
          jenis: "TUP RM",
          spmPembayaran: parseInt(resultData[1]?.UP_RM || 0),
          spmPenihilan: parseInt(resultData[1]?.GUP_RM || 0),
        },
        {
          jenis: "UP PNBP",
          spmPembayaran: parseInt(resultData[2]?.UP_RM || 0),
          spmPenihilan: parseInt(resultData[2]?.GUP_RM || 0),
        },
        {
          jenis: "TUP PNBP",
          spmPembayaran: parseInt(resultData[3]?.UP_RM || 0),
          spmPenihilan: parseInt(resultData[3]?.GUP_RM || 0),
        },
        {
          jenis: "TUP TAYL",
          spmPembayaran: parseInt(resultData[4]?.UP_RM || 0),
          spmPenihilan: parseInt(resultData[4]?.GUP_RM || 0),
        },
      ];

      const currentTotal = currentFormattedData
        .filter((item) => !item.jenis.includes("TAYL"))
        .reduce((total, item) => total + item.spmPembayaran + item.spmPenihilan, 0);

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
    console.log("UpTayl - useEffect triggered with:", {
      thang,
      dept,
      kdkanwil,
      kdkppn,
      dataEpaTab: dataEpa?.tab
    });

    if (dataEpa?.tab === 3) { // Pastikan hanya fetch data ketika tab UP TAYL aktif
      getData();
    }
  }, [dataEpa, thang, dept, kdkanwil, kdkppn]);

  const formattedData = [
    {
      jenis: "UP RM",
      spmPembayaran: parseInt(data[0]?.UP_RM || 0),
      spmPenihilan: parseInt(data[0]?.GUP_RM || 0),
    },
    {
      jenis: "TUP RM",
      spmPembayaran: parseInt(data[1]?.UP_RM || 0),
      spmPenihilan: parseInt(data[1]?.GUP_RM || 0),
    },
    {
      jenis: "UP PNBP",
      spmPembayaran: parseInt(data[2]?.UP_RM || 0),
      spmPenihilan: parseInt(data[2]?.GUP_RM || 0),
    },
    {
      jenis: "TUP PNBP",
      spmPembayaran: parseInt(data[3]?.UP_RM || 0),
      spmPenihilan: parseInt(data[3]?.GUP_RM || 0),
    },
    {
      jenis: "TUP TAYL",
      spmPembayaran: parseInt(data[4]?.UP_RM || 0),
      spmPenihilan: parseInt(data[4]?.GUP_RM || 0),
    },
  ];

  const totalSaldo = formattedData
    .filter((item) => !item.jenis.includes("TAYL"))
    .reduce((total, item) => total + item.spmPembayaran + item.spmPenihilan, 0);

  // Growth indicator component with detailed comparison
  const GrowthIndicator = ({ percentage, currentTotal, previousTotal }) => {
    const isPositive = percentage >= 0;
    const color = isPositive ? '#28a745' : '#dc3545';
    const icon = isPositive ? '↗' : '↘';

    return (
      <div style={{ textAlign: 'right' }}>
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

        <div style={{ fontSize: '12px', color: '#6c757d', lineHeight: '1.3' }}>
          <div><strong>Total Outstanding:</strong> {currentTotal.toLocaleString('id-ID')}</div>
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
        <h5 className="mb-0">Outstanding UP TAYL {thang} (dalam rupiah)</h5>
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
                    <th>Jenis</th>
                    <th>SPM Pembayaran</th>
                    <th>SPM Penihilan</th>
                    <th>Sisa</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.length > 0 ? (
                    <>
                      {formattedData
                        .filter((item) => !item.jenis.includes("TAYL")) // Filter untuk menghilangkan jenis 'TAYL'
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.jenis}</td>
                            <td className="text-end">
                              {numeral(item.spmPembayaran).format("0,0")}{" "}
                              {/* Format dengan numeral */}
                            </td>
                            <td className="text-end">
                              {numeral(item.spmPenihilan).format("0,0")}{" "}
                              {/* Format dengan numeral */}
                            </td>
                            <td className="text-end">
                              {numeral(
                                item.spmPembayaran + item.spmPenihilan
                              ).format("0,0")}{" "}
                              {/* Format dengan numeral */}
                            </td>
                          </tr>
                        ))}

                      {/* Baris total saldo */}
                      <tr>
                        <td colSpan="4" className="text-end font-bold">
                          TOTAL
                        </td>
                        <td className="text-end font-bold">
                          {numeral(
                            formattedData
                              .filter((item) => !item.jenis.includes("TAYL")) // Filter untuk jenis 'TAYL'
                              .reduce(
                                (total, item) =>
                                  total +
                                  item.spmPembayaran +
                                  item.spmPenihilan,
                                0
                              )
                          ).format("0,0")}{" "}
                          {/* Format total saldo */}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Tidak ada data tersedia
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Tabel untuk menampilkan TAYL */}
              <Table striped bordered hover responsive className="mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>No</th>
                    <th>Jenis</th>
                    <th>GUP TAYL</th>
                    <th>PTUP TAYL</th>
                    <th>Total Setoran</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Setoran</td>
                    <td className="text-end">
                      {numeral(formattedData[4].spmPembayaran).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(formattedData[4].spmPenihilan).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(
                        formattedData[4].spmPembayaran +
                          formattedData[4].spmPenihilan
                      ).format("0,0")}
                    </td>
                  </tr>
                </tbody>
              </Table>

              {/* Total Saldo */}
              <div className="mt-4 fw-bold">
                Total Sisa:{" "}
                {numeral(
                  totalSaldo -
                    (formattedData[4].spmPembayaran +
                      formattedData[4].spmPenihilan)
                ).format("0,0")}{" "}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EpaUpTayl;
