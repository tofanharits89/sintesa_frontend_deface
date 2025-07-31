import React, { useContext, useState, useEffect } from "react";
import { Table, Container, Card, Spinner } from "react-bootstrap";
import numeral from "numeral";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const EpaUpTaYlTL = ({ thang, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, username, token, dataEpa } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = kdkanwil && kdkanwil !== "00" ? ` AND kdkanwil='${kdkanwil}'` : "";
    let filterKppn = kdkppn && kdkppn !== "000" ? ` AND kdkppn='${kdkppn}'` : "";

    console.log("UpTaYlTL - getData with filters:", {
      kdkanwil,
      kdkppn,
      filterKanwil,
      filterKppn,
      thang,
      dept
    });
    
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
      setData(response.data.result || []);
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
    console.log("UpTaYlTL - useEffect triggered with:", {
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

  // Info badge component for previous year
  const InfoBadge = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#e9ecef',
            color: '#495057',
            padding: '8px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid #ced4da',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '8px'
          }}
        >
          <span style={{ marginRight: '4px', fontSize: '16px' }}>📊</span>
          Data Tahun Sebelumnya
        </div>
        
        <div style={{ fontSize: '12px', color: '#6c757d', lineHeight: '1.3' }}>
          <div><strong>Total Outstanding:</strong> {totalSaldo.toLocaleString('id-ID')}</div>
          <div><strong>Periode:</strong> Tahun {thang - 1}</div>
        </div>
      </div>
    );
  };

  return (
    <Container fluid>
      {/* Header Section with Info Badge */}
      <div 
        className="d-flex justify-content-between align-items-center my-3"
        style={{ minHeight: '80px' }}
      >
        <h5 className="mb-0">Outstanding UP TAYL {thang - 1} (dalam rupiah)</h5>
        <InfoBadge />
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
                        .filter((item) => !item.jenis.includes("TAYL"))
                        .map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.jenis}</td>
                            <td className="text-end">
                              {numeral(item.spmPembayaran).format("0,0")}
                            </td>
                            <td className="text-end">
                              {numeral(item.spmPenihilan).format("0,0")}
                            </td>
                            <td className="text-end">
                              {numeral(
                                item.spmPembayaran + item.spmPenihilan
                              ).format("0,0")}
                            </td>
                          </tr>
                        ))}

                      <tr>
                        <td colSpan="4" className="text-end font-bold">
                          TOTAL
                        </td>
                        <td className="text-end font-bold">
                          {numeral(
                            formattedData
                              .filter((item) => !item.jenis.includes("TAYL"))
                              .reduce(
                                (total, item) =>
                                  total +
                                  item.spmPembayaran +
                                  item.spmPenihilan,
                                0
                              )
                          ).format("0,0")}
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

              <div className="mt-4 fw-bold">
                Total Outstanding:{" "}
                {numeral(
                  totalSaldo -
                    (formattedData[4].spmPembayaran +
                      formattedData[4].spmPenihilan)
                ).format("0,0")}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EpaUpTaYlTL;
