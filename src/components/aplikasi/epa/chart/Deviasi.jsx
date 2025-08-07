import React, { useState, useEffect, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { Table, Spinner, Button, Modal, Container } from "react-bootstrap";
import numeral from "numeral";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";

const Deviasi = ({ thang, periode, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [queryDebug, setQueryDebug] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let bulanMulai = Math.floor((periode - 1) / 3) * 3 + 1;
        let bulanAkhir = bulanMulai + 2;
        let sumRealTw = "";
        let proyeksiTw = `proy_real_sd_tw${Math.ceil(periode / 3)}`;

        let sumReal = [];
        let sumRenc = [];
        let sumDev = [];
        for (let i = bulanMulai; i <= bulanAkhir; i++) {
          sumReal.push(`SUM(real${i})`);
          sumRenc.push(`SUM(renc${i})`);
          sumDev.push(`SUM(renc${i}) - SUM(real${i})`);
        }
        sumRealTw = sumReal.join(" + ");

        let sqlQuery = `
          SELECT 
            nmjnsbelanja, jnsbelanja,
            ${sumRenc[0]} AS rencana_bulan1, ${sumReal[0]} AS realisasi_bulan1, ${sumDev[0]} AS deviasi_bulan1,
            ${sumRenc[1]} AS rencana_bulan2, ${sumReal[1]} AS realisasi_bulan2, ${sumDev[1]} AS deviasi_bulan2,
            ${sumRenc[2]} AS rencana_bulan3, ${sumReal[2]} AS realisasi_bulan3, ${sumDev[2]} AS deviasi_bulan3,
            ${sumRealTw} AS jumlah_sd_tw,
            SUM(${proyeksiTw}) AS proyeksi_tw
          FROM digitalisasi_epa.rencana_halaman3_dipa
          WHERE thang = '${thang}' AND kddept = '${dept}'`;

        // Tambahkan filter jika kdkanwil/kdkppn ada dan bukan nilai "semua"
        if (kdkanwil && kdkanwil !== "00")
          sqlQuery += ` AND kdkanwil = '${kdkanwil}'`;
        if (kdkppn && kdkppn !== "000") sqlQuery += ` AND kdkppn = '${kdkppn}'`;

        sqlQuery += ` GROUP BY nmjnsbelanja, jnsbelanja`;

        sqlQuery = sqlQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        setQueryDebug(sqlQuery);

        const response = await axiosJWT.get(
          `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA}${Encrypt(
            sqlQuery
          )}`,
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

  const bulanMapping = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember",
  };

  let bulanMulai = Math.floor((periode - 1) / 3) * 3 + 1;
  const triwulan = Math.ceil(periode / 3);
  const triwulanRomawi = ["I", "II", "III", "IV"][triwulan - 1];

  return (
    <Container fluid>
      <div className="my-2 text-center">
        Target Ketercapaian Rencana Belanja Berdasarkan Halaman III DIPA
        <br /> Triwulan {triwulanRomawi} TA {thang}
      </div>

      <div className="d-flex justify-content-end p-2 mt-2">
        {/* <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowModal(true)}
        >
          SQL
        </Button> */}
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
                Jenis Belanja
              </th>
              <th colSpan="3">{bulanMapping[bulanMulai]}</th>
              <th colSpan="3">{bulanMapping[bulanMulai + 1]}</th>
              <th colSpan="3">{bulanMapping[bulanMulai + 2]}</th>
              <th rowSpan="2">Jumlah s.d Tw {Math.ceil(periode / 3)}</th>
              <th rowSpan="2">
                Proyeksi Real s.d. Tw {Math.ceil(periode / 3) + 1}
              </th>
            </tr>
            <tr>
              <th>Rencana</th>
              <th>Realisasi</th>
              <th>Deviasi</th>
              <th>Rencana</th>
              <th>Realisasi</th>
              <th>Deviasi</th>
              <th>Rencana</th>
              <th>Realisasi</th>
              <th>Deviasi</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.nmjnsbelanja} ({item.jnsbelanja})
                  </td>
                  <td className="text-end">
                    {numeral(item.rencana_bulan1 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.realisasi_bulan1 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.deviasi_bulan1 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.rencana_bulan2 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.realisasi_bulan2 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.deviasi_bulan2 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.rencana_bulan3 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.realisasi_bulan3 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.deviasi_bulan3 / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.jumlah_sd_tw / 1e9).format("0,0.00")}
                  </td>
                  <td className="text-end">
                    {numeral(item.proyeksi_tw / 1e9).format("0,0.00")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">
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

export default Deviasi;
