import React, { useState, useEffect, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { Table, Spinner, Button, Modal, Container } from "react-bootstrap";
import numeral from "numeral";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";

const KinerjaKontrak = ({ thang, periode, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [queryDebug, setQueryDebug] = useState("");

  const triwulan = Math.ceil(periode / 3);
  const triwulanRomawi = ["I", "II", "III", "IV"][triwulan - 1];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let sqlQuery = `
          SELECT 
            nmsatker, 
            SUM(jml_52_tw${triwulan}) AS jml_barang, SUM(nilai_52_tw${triwulan}) AS nilai_barang, SUM(real_52_tw${triwulan}) AS real_barang,
            SUM(jml_53_tw${triwulan}) AS jml_modal, SUM(nilai_53_tw${triwulan}) AS nilai_modal, SUM(real_53_tw${triwulan}) AS real_modal
          FROM digitalisasi_epa.outs_kontrak_epa
          WHERE thang = '${thang}' AND kddept = '${dept}'
          GROUP BY nmsatker limit 10
        `;

        sqlQuery = sqlQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        setQueryDebug(sqlQuery);

        const response = await axiosJWT.get(
          `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA}${Encrypt(sqlQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  return (
    <Container fluid>
      <div className="my-2 text-center fw-bold">
        Kinerja Kontrak Triwulan {triwulanRomawi} <br /> TA {thang}
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
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="text-center mt-4">
          <thead className="table-dark">
            <tr>
              <th rowSpan="2" style={{ verticalAlign: "middle" }}>
                Satker
              </th>
              <th colSpan="3">Belanja Barang</th>
              <th colSpan="3">Belanja Modal</th>
              <th colSpan="3">Total</th>
            </tr>
            <tr>
              <th>Jumlah</th>
              <th>Nilai </th>
              <th>Realisasi </th>
              <th>Jumlah</th>
              <th>Nilai </th>
              <th>Realisasi </th>
              <th>Jumlah</th>
              <th>Nilai </th>
              <th>Realisasi </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                const nilaiBarangMiliar = (item.nilai_barang || 0) / 1e9;
                const realBarangMiliar = (item.real_barang || 0) / 1e9;
                const nilaiModalMiliar = (item.nilai_modal || 0) / 1e9;
                const realModalMiliar = (item.real_modal || 0) / 1e9;

                const totalJumlah =
                  (item.jml_barang || 0) + (item.jml_modal || 0);
                const totalNilai = nilaiBarangMiliar + nilaiModalMiliar;
                const totalRealisasi = realBarangMiliar + realModalMiliar;

                return (
                  <tr key={index}>
                    <td>{item.nmsatker}</td>
                    <td className="text-end">
                      {numeral(item.jml_barang).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(nilaiBarangMiliar).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(realBarangMiliar).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(item.jml_modal).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(nilaiModalMiliar).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(realModalMiliar).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(totalJumlah).format("0,0")}
                    </td>
                    <td className="text-end">
                      {numeral(totalNilai).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(totalRealisasi).format("0,0.00")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  Tidak ada data tersedia
                </td>
              </tr>
            )}
          </tbody>
        </Table>
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

export default KinerjaKontrak;
