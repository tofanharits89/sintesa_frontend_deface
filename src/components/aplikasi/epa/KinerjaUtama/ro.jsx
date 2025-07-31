import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import { motion } from "framer-motion";
import {
  Container,
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import numeral from "numeral";

export const Ro = ({ periode, kdkanwil, kdkppn }) => {
  const { axiosJWT, token, username, dataEpa } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [dataRo, setdataRo] = useState([]);

  const getData = async () => {
    setLoading(true);
    const realColumns = Array.from(
      { length: periode },
      (_, i) => `a.real${i + 1}`
    ).join(" + ");
    // console.log(periode);

    const encodedQuery = encodeURIComponent(
      `SELECT a.kdsoutput_gab,a.ursoutput,sum(a.blokir) blokir,sum(a.pagu) pagu,SUM(${realColumns}) AS realisasi 
      FROM digitalisasi_epa.pagu_real_utama_soutput a 
      WHERE a.thang = '${dataEpa.year}' AND substr(a.kdsoutput_gab,1,3) = '${dataEpa.kddept}'
      GROUP BY a.kdsoutput_gab,a.ursoutput limit 10`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // console.log(cleanedQuery);

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
      setdataRo(response.data.result || []);
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
  // console.log(dataRo);

  const totalPagu = dataRo.reduce((sum, row) => sum + Number(row.pagu || 0), 0);
  const totalRealisasi = dataRo.reduce(
    (sum, row) => sum + Number(row.realisasi || 0),
    0
  );
  const totalBlokir = dataRo.reduce(
    (sum, row) => sum + Number(row.blokir || 0),
    0
  );
  const totalPersen = totalPagu > 0 ? (totalRealisasi / totalPagu) * 100 : 0;

  return (
    <Container fluid>
      <h5 className="my-3">
        Kinerja RO Utama Tahun {dataEpa.year} (dalam rupiah)
      </h5>
      <Card>
        <Card.Body
          style={{
            height: "300px",
            scrollBehavior: "smooth",
            overflow: "scroll",
          }}
        >
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
              transition={{ duration: 0.6, ease: "easeOut", delay: 1 * 0.2 }}
              viewport={{ amount: 0.2, once: true }}
            >
              <Table striped bordered hover responsive className="mt-3">
                <thead className="table-dark">
                  <tr>
                    <th>KODE OUTPUT</th>
                    <th>NAMA OUTPUT</th>
                    <th>PAGU</th>
                    <th>REALISASI</th>
                    <th>%</th>
                    <th>BLOKIR</th>
                  </tr>
                </thead>
                <tbody className="fade-in">
                  {dataRo.length > 0 ? (
                    dataRo.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>{row.kdsoutput_gab}</td>
                        <td>{row.ursoutput}</td>
                        <td className=" text-end">
                          {numeral(row.pagu).format("0,0")}
                        </td>
                        <td className=" text-end">
                          {numeral(row.realisasi).format("0,0")}
                        </td>{" "}
                        <td className=" text-end">
                          {numeral((row.realisasi / row.pagu) * 100).format(
                            "0.0"
                          )}
                        </td>
                        <td className=" text-end">
                          {numeral(row.blokir).format("0,0")}
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
                  <tr className="fw-bold">
                    <td colSpan="2" className="text-center">
                      Total
                    </td>
                    <td className="text-end">
                      {numeral(totalPagu).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(totalRealisasi).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(totalPersen).format("0.0")}
                    </td>
                    <td className="text-end">
                      {numeral(totalBlokir).format("0,0")}
                    </td>
                  </tr>
                </tfoot>
              </Table>{" "}
            </motion.div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
