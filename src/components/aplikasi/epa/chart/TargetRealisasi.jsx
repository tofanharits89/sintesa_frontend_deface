import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import {
  Card,
  Container,
  Spinner,
  Table,
  Button,
  Modal,
} from "react-bootstrap";

const TargetRealisasi = ({ thang, periode, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Hitung triwulan (1-4) berdasarkan periode
  const triwulan = Math.ceil(periode / 3);

  // Konversi angka triwulan menjadi Romawi
  const triwulanRomawi = ["I", "II", "III", "IV"][triwulan - 1];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = `SELECT nmjenbel, kdjenbel, SUM(pagu) pagu, SUM(blokir) blokir, SUM(netpagu) netpagu,
        SUM(traject${triwulan}) traject, SUM(target${triwulan}) target, SUM(real_sd_tw${triwulan}) real_berjalan,
        SUM(gap${triwulan}) AS gap FROM digitalisasi_epa.tren_belanja_jenbel WHERE thang = '${thang}' AND kddept = '${dept}'
        GROUP BY nmjenbel, kdjenbel`;

        query = query.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        setSqlQuery(query);

        const response = await axiosJWT.get(
          `${import.meta.env.VITE_REACT_APP_LOCAL_TARGETREALISASI}${Encrypt(query)}`,
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

  // Fungsi untuk mengonversi nilai ke dalam miliar
  const toMiliar = (value) => Number(value) / 1_000_000_000;

  return (
    <Container fluid>
      <div className="my-2 text-center">
        Target Realisasi <br />
        s.d. Triwulan {triwulanRomawi} TA {thang}
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
              <th>Jenis Belanja</th>
              <th>Pagu</th>
              <th>Blokir</th>
              <th>Net Pagu</th>
              <th>Trajectory Serap Tw {triwulanRomawi}</th>
              <th>Nominal Target</th>
              <th>Real Berjalan</th>
              <th>Gap</th>
              <th>% Gap</th>
            </tr>
            <tr>
              <th>(1)</th>
              <th>(2)</th>
              <th>(3)</th>
              <th>(4) = (2) – (3)</th>
              <th>(5)</th>
              <th>(6) = (4) x (5)</th>
              <th>(7)</th>
              <th>(8) = (7) – (6)</th>
              <th>(9)</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                const pagu = toMiliar(item.pagu);
                const blokir = toMiliar(item.blokir);
                const netpagu = toMiliar(item.netpagu);
                const traject = Number(item.traject) || 0;
                const target = netpagu * traject;
                const realBerjalan = toMiliar(item.real_berjalan);
                const gap = realBerjalan - target;
                const persenGap = target !== 0 ? (gap / target) * 100 : 0;

                return (
                  <tr key={index}>
                    <td>
                      {item.nmjenbel} ({item.kdjenbel})
                    </td>
                    <td className="text-end">
                      {numeral(pagu).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(blokir).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(netpagu).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {new Intl.NumberFormat("id-ID", {
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(traject)}
                    </td>
                    <td className="text-end">
                      {numeral(target).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(realBerjalan).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {numeral(gap).format("0,0.00")}
                    </td>
                    <td className="text-end">
                      {new Intl.NumberFormat("id-ID", {
                        style: "percent",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(persenGap / 100)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
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
            {sqlQuery}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowModal(false)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TargetRealisasi;
