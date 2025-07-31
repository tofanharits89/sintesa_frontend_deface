import React, { useContext, useState, useEffect } from "react";
import { Table, Container, Card, Spinner } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const EpaPaguMinusTL = ({ thang, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, username, token, dataEpa } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
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
    getData();
  }, [dataEpa, kdkanwil, kdkppn]);

  // Menghitung total saldo
  const totalSaldo = data.reduce(
    (total, item) => total + parseInt(item.saldo),
    0
  );

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
          <div><strong>Total Pagu Minus:</strong> {totalSaldo.toLocaleString('id-ID')}</div>
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
        <h5 className="mb-0">Pagu Minus Tahun {thang - 1} (dalam rupiah)</h5>
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

export default EpaPaguMinusTL;
