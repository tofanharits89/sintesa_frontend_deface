import React, { useState, useEffect, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { Table, Spinner, Button, Modal, Container } from "react-bootstrap";
import numeral from "numeral";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";

const Revisi = ({ thang, periode, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [queryDebug, setQueryDebug] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sqlQuery = `
          SELECT 
            nmdept, kddept, jnsrevisi, sub_jnsrevisi, kew_revisi, 
            SUM(jml_revisi) AS jumlah
          FROM digitalisasi_epa.revisi_epa
          WHERE thang = '${thang}' AND kddept = '${dept}'
          GROUP BY nmdept, kddept, jnsrevisi, sub_jnsrevisi, kew_revisi limit 10
        `;
        const sql = sqlQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        setQueryDebug(sql);

        const response = await axiosJWT.get(
          `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA}${Encrypt(sql)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData(response.data.result || []);
      } catch (error) {
        handleHttpError(
          error.response?.status,
          error.response?.data?.error || "Terjadi kesalahan koneksi"
        );
      }
      setLoading(false);
    };

    fetchData();
  }, [thang, periode, dept, kdkanwil, kdkppn]);

  const triwulan = Math.ceil(periode / 3);
  const triwulanRomawi = ["I", "II", "III", "IV"][triwulan - 1];

  return (
    <Container fluid>
      <div className="my-2 text-center fw-bold">
        Monitoring Revisi DIPA
        <br /> Triwulan {triwulanRomawi} TA {thang}
      </div>

      <div className="d-flex justify-content-end p-2 mt-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowModal(true)}
        >
          SQL
        </Button>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive className="text-center mt-4">
            <thead className="table-dark">
              <tr>
                <th>Nama Dept</th>
                <th>Jenis Revisi</th>
                <th>Sub Jenis</th>
                <th>Kewenangan</th>
                <th>Jumlah Revisi (Miliar)</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.nmdept} ({item.kddept})
                    </td>
                    <td>{item.jnsrevisi}</td>
                    <td>{item.sub_jnsrevisi}</td>
                    <td>{item.kew_revisi}</td>
                    <td className="text-end">
                      {numeral(Number(item.jumlah)).format("0,0")}
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
          </Table>
        </div>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Debugging</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {queryDebug}
          </pre>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Revisi;
