import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import { motion } from "framer-motion";
import { Container, Card, Table, Spinner } from "react-bootstrap";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import numeral from "numeral";

export const Eselon1 = ({ periode, kdkanwil, kdkppn }) => {
  const { axiosJWT, token, username, dataEpa } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [dataEselon, setDataEselon] = useState([]);

  const getData = async () => {
    setLoading(true);
    const realColumns = Array.from(
      { length: periode },
      (_, i) => `a.real${i + 1}`
    ).join(" + ");

    const encodedQuery = encodeURIComponent(
      `SELECT a.kdunit,a.nmunit,sum(a.blokir) blokir,sum(a.pagu) pagu,SUM(${realColumns}) AS realisasi 
      FROM digitalisasi_epa.pagu_real_utama a 
      WHERE a.thang = ${dataEpa.year} AND a.kddept = ${dataEpa.kddept} 
      GROUP BY a.kdunit,a.nmunit`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
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
      setDataEselon(response.data.result || []);
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

  const totalPagu = numeral(
    dataEselon.reduce((sum, row) => sum + Number(row.pagu) || 0, 0)
  ).format("0,0");

  const totalRealisasi = numeral(
    dataEselon.reduce((sum, row) => sum + Number(row.realisasi) || 0, 0)
  ).format("0,0");

  const totalBlokir = numeral(
    dataEselon.reduce((sum, row) => sum + Number(row.blokir) || 0, 0)
  ).format("0,0");

  return (
    <Container fluid>
      <h5 className="my-3">
        Kinerja Eselon I Utama Tahun {dataEpa.year} (dalam rupiah)
      </h5>
      <Card>
        <Card.Body style={{ height: "300px", overflow: "auto" }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              viewport={{ amount: 0.2, once: true }}
            >
              <Table striped bordered hover responsive className="mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>KDUNIT</th>
                    <th>NMUNIT</th>
                    <th>PAGU</th>
                    <th>REALISASI</th>
                    <th>%</th>
                    <th>BLOKIR</th>
                  </tr>
                </thead>
                <tbody>
                  {dataEselon.length > 0 ? (
                    dataEselon.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>{row.kdunit}</td>
                        <td>{row.nmunit}</td>
                        <td className="text-end">
                          {numeral(row.pagu || 0).format("0,0")}
                        </td>
                        <td className="text-end">
                          {numeral(row.realisasi || 0).format("0,0")}
                        </td>
                        <td className="text-end">
                          {numeral(
                            ((row.realisasi || 0) / (row.pagu || 1)) * 100
                          ).format("0.0")}
                        </td>
                        <td className="text-end">
                          {numeral(row.blokir || 0).format("0,0")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Tidak ada data tersedia
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#f8f9fa", fontWeight: "bold" }}>
                    <td colSpan="2">TOTAL</td>
                    <td className="text-end">{totalPagu}</td>
                    <td className="text-end">{totalRealisasi}</td>
                    <td className="text-end">
                      {numeral(
                        (Number(totalRealisasi.replace(/,/g, "")) /
                          Number(totalPagu.replace(/,/g, ""))) *
                          100
                      ).format("0")}{" "}
                      %
                    </td>

                    <td className="text-end">{totalBlokir}</td>
                  </tr>
                </tfoot>
              </Table>
            </motion.div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
