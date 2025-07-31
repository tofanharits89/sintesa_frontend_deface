import React, { useState, useEffect, useContext } from "react";
import { Modal, Card, Container } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";

const KertasKerja25 = ({ show, onHide, cek, kppn, kdpemda, thang, bulan }) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [dataHeader, setDataHeader] = useState([]);
  const [dataBaris, setDataBaris] = useState([]);
  const [dataRekap, setDataRekap] = useState([]);
  const [dataRekapBulan, setDataRekapBulan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingrekap, setLoadingRekap] = useState(false);
  const [loadingrekapbulan, setLoadingRekapbulan] = useState(false);

  const [sql, setSql] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await generateData();
      await getData();
      await getDataRekap();
      await getDataRekapBulan();
      await getDataPotongan();
    };

    cek && fetchData();
  }, [cek]);

  const generateData = async () => {
    setLoading(true);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_GENERATEDATA_25
          ? `${
              import.meta.env.VITE_REACT_APP_GENERATEDATA_25
            }${username}&kppn=${kppn}&kdpemda=${kdpemda}&thang=${thang}&bulan=${bulan}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setLoading(false);
    }
  };

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT thang,kdpemda,nmpemda,pagu,alokasi_bulan,upper(nmbulan) nmbulan,bulan,tunda,cabut,potongan,salur FROM tkd25.rekap 
			WHERE kdpemda='${kdpemda}' AND bulan='${bulan}'`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
          ? `${
              import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataHeader(response.data.result[0]);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setLoading(false);
    }
  };

  const getDataPotongan = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.jenis_kmk,a.kriteria,a.thang,a.kdakun,b.nmakun,a.nilai 
FROM tkd25.detail_kmk_dau a 
LEFT JOIN tkd25.ref_detail_potongan b ON a.jenis_kmk=b.jenis_pmk AND a.kriteria=b.kriteria AND a.kdakun=b.kdakun WHERE a.kdkabkota='${kdpemda}' AND a.bulan='${bulan}'`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
          ? `${
              import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDataBaris(response.data.result);
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setLoading(false);
    }
  };
  // console.log(dataBaris);
  const getDataRekap = async () => {
    setLoadingRekap(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.jenis,b.nmjenis,a.kriteria,c.nm_kriteria,a.no_kmk,d.kmk_cabut,a.kdkppn,a.kdpemda,a.jan,a.peb,
      a.mar,a.apr,a.mei,a.jun,a.jul,a.ags,a.sep,a.okt,a.nov,a.des,a.update_data,a.status_cabut
      FROM tkd25.ref_kmk_penundaan a 
      LEFT OUTER JOIN 
      (SELECT b.jenis,b.nmjenis FROM tkd25.ref_kmk b) b ON a.jenis=b.jenis
      LEFT OUTER JOIN 
      (SELECT c.id,c.id_kriteria,c.nm_kriteria FROM tkd25.ref_kmk_dau_kriteria c) c ON a.jenis=c.id AND a.kriteria=c.id_kriteria 
      LEFT OUTER JOIN
      (SELECT d.jenis,d.kriteria,d.kmk_cabut,d.kdkppn,d.kdpemda,d.kmk_tunda FROM tkd25.ref_kmk_pencabutan d GROUP BY d.jenis,d.kriteria,d.kdkppn,d.kdpemda,d.kmk_tunda) d 
      ON a.jenis=d.jenis AND a.kriteria=d.kriteria AND a.kdkppn=d.kdkppn AND a.kdpemda=d.kdpemda AND a.no_kmk=d.kmk_tunda
      WHERE a.kdpemda='${kdpemda}' ORDER BY a.no_kmk`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
          ? `${
              import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataRekap(response.data.result);

      setLoadingRekap(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setLoading(false);
    }
  };

  const getDataRekapBulan = async () => {
    setLoadingRekapbulan(true);
    const encodedQuery = encodeURIComponent(
      `SELECT thang,
      bulan,
      kdkppn,
      nmkppn,
      kdpemda,
      nmpemda,
      nmbulan,
      pagu,
      alokasi_bulan,
      tunda,
      cabut,
      potongan ,
      salur,
      kdkanwil from tkd25.rekap WHERE kdpemda='${kdpemda}'`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
          ? `${
              import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataRekapBulan(response.data.result);

      setLoadingRekapbulan(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setLoading(false);
    }
  };

  function getNmakun(kdakun) {
    // console.log(kdakun, dataBaris);
    switch (kdakun) {
      case "715211":
        return "Pokok";
      case "425713":
        return "Bunga";
      case "425762":
        return "Jasa Bank";
      case "425823":
        return "Denda";
      case "717121":
        return "Pokok PEN";
      case "425719":
        return "Bunga PEN";
      case "425999":
        return "Intercept 2%";
      case "425919":
        return "Potongan Dana Transfer";
      case "425916":
        return "Potongan Sisa Hibah";

      case "817714":
        return "Potongan ADD";
      default:
        return "";
    }
  }

  return (
    <>
      <Container fluid>
        <Modal
          show={show}
          onHide={onHide}
          backdrop="static"
          keyboard={false}
          size="xl"
          animation={false}
          fullscreen={true}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "20px" }}>
              <i className="bi bi-back text-success mx-3"></i>
              Kertas Kerja
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Card.Body>
                <h5 className="text-center mt-3 fw-bold">
                  Kertas Kerja Penyaluran Dana Alokasi Umum
                </h5>
                <h5 className="text-center mb-3">
                  BULAN {dataHeader && dataHeader.nmbulan}
                </h5>
                {loading ? (
                  <>
                    <Loading2 />
                    <br />
                  </>
                ) : (
                  <div className="data-kmk fade-in">
                    <table className="tabel-dau">
                      <thead>
                        <tr>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Thang
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Pemda
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Total Pagu
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Alokasi Bulan/Tahap (Rp)
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Salur Bulan/Tahap (Rp)
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Penundaan
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Cabut Penundaan
                          </th>
                          <th
                            colSpan="3"
                            className="text-center align-middle fw-bold"
                          >
                            Pemotongan
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Nilai Salur
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Nilai SP2D
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Selisih
                          </th>
                        </tr>
                        <tr>
                          <th className="text-center align-middle fw-bold">
                            Detil Item Potongan
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Akun Potongan
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Nilai Potongan
                          </th>
                        </tr>
                        <tr>
                          <th className="text-center align-middle fw-bold">
                            1
                          </th>
                          <th className="text-center align-middle fw-bold">
                            2
                          </th>
                          <th className="text-center align-middle fw-bold">
                            3
                          </th>
                          <th className="text-center align-middle fw-bold">
                            4
                          </th>
                          <th className="text-center align-middle fw-bold">
                            5
                          </th>
                          <th className="text-center align-middle fw-bold">
                            6
                          </th>
                          <th className="text-center align-middle fw-bold">
                            7
                          </th>
                          <th className="text-center align-middle fw-bold">
                            8
                          </th>
                          <th className="text-center align-middle fw-bold">
                            9
                          </th>
                          <th className="text-center align-middle fw-bold">
                            10
                          </th>
                          <th className="text-center align-middle fw-bold">
                            11 (5-(7-8)-10)
                          </th>
                          <th className="text-center align-middle fw-bold">
                            12
                          </th>
                          <th className="text-center align-middle fw-bold">
                            13 (11-12)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fw-bold">
                            {dataHeader && dataHeader.thang}
                          </td>
                          <td>
                            {dataHeader && dataHeader.nmpemda} (
                            {dataHeader && dataHeader.kdpemda})
                          </td>
                          <td className="text-end align-middle">
                            {dataHeader &&
                              numeral(dataHeader.pagu).format("0,0")}
                          </td>
                          <td className="text-end align-middle">
                            {dataHeader &&
                              numeral(dataHeader.alokasi_bulan).format("0,0")}
                          </td>
                          <td className="text-end align-middle">
                            {dataHeader &&
                              numeral(dataHeader.alokasi_bulan).format("0,0")}
                          </td>
                          <td className="text-end align-middle">
                            {dataHeader &&
                              numeral(dataHeader.tunda).format("0,0")}
                          </td>
                          <td className="text-end align-middle">
                            {dataHeader &&
                              numeral(dataHeader.cabut).format("0,0")}
                          </td>
                          <td>-</td>
                          <td>-</td>

                          <td className="text-end align-middle">
                            {dataHeader &&
                              numeral(dataHeader.potongan).format("0,0")}
                          </td>
                          <td className="text-end align-middle">
                            {dataHeader &&
                              numeral(dataHeader.salur).format("0,0")}
                          </td>
                        </tr>
                        {dataBaris.map((item, index) => (
                          <tr key={index}>
                            <td colSpan={7}></td>
                            <td className="text-center align-middle">
                              {dataBaris && item.kriteria !== "13"
                                ? getNmakun(item.kdakun)
                                : "Intercept Earmarked"}
                            </td>
                            <td className="text-center align-middle">
                              {dataBaris && item.kdakun}
                            </td>
                            <td className="text-end align-middle">
                              {dataBaris &&
                                item.nilai > 0 &&
                                numeral(item.nilai).format("0,0")}
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <hr />

                <h5 className="my-3 text-center">
                  Penundaan dan Pencabutan Dana Alokasi Umum
                </h5>
                {loadingrekap ? (
                  <>
                    <Loading2 />
                    <br />
                    <Loading2 />
                    <br />
                    <Loading2 />
                  </>
                ) : (
                  <div className="data-kmk fade-in">
                    <table className="tabel-dau">
                      <thead>
                        <tr>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold mx-2"
                          >
                            No
                          </th>
                          <th
                            colSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            NO KMK
                          </th>
                          <th
                            rowSpan="2"
                            className="text-center align-middle fw-bold"
                          >
                            Kriteria
                          </th>
                          <th
                            colSpan="13"
                            className="text-center align-middle fw-bold"
                          >
                            Penundaan/ Pencabutan
                          </th>
                        </tr>
                        <tr>
                          <th className="text-center align-middle fw-bold">
                            Penundaan
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Pencabutan
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Jan
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Peb
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Mar
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Apr
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Mei
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Jun
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Jul
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Ags
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Sep
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Okt
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Nov
                          </th>
                          <th className="text-center align-middle fw-bold">
                            Des
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataRekap.map((row, index) => (
                          <tr key={index}>
                            <td className="text-center align-middle">
                              {index + 1}
                            </td>
                            <td className="text-center align-middle">
                              {row.no_kmk}
                            </td>
                            <td className="text-center align-middle">
                              {row.kmk_cabut}
                            </td>
                            <td className="text-center align-middle">
                              {row.nm_kriteria}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.jan).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.peb).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.mar).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.apr).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.mei).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.jun).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.jul).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.ags).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.sep).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.okt).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.nov).format("0,0")}
                            </td>
                            <td
                              className="align-middle text-end"
                              style={{ minWidth: "100px" }}
                            >
                              {numeral(row.des).format("0,0")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <hr />
                <div className="fade-in" style={{ overflow: "scroll" }}>
                  <h5 className="my-3 text-center">
                    Rekapitulasi Penyaluran Dana Alokasi Umum
                  </h5>
                  <div className="fade-in">
                    {loadingrekapbulan ? (
                      <>
                        <Loading2 />
                        <br />
                        <Loading2 />
                        <br />
                        <Loading2 />
                      </>
                    ) : (
                      <>
                        <table className="tabel-dau">
                          <thead style={{ margin: "15px" }}>
                            <tr>
                              <th className="text-center align-middle fw-bold">
                                No
                              </th>
                              <th className="text-center align-middle fw-bold">
                                TA
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Bulan
                              </th>
                              <th className="text-center align-middle fw-bold">
                                KPPN
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Kab/ Kota
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Pagu
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Alokasi Bulanan
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Penundaan
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Pencabutan
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Potongan
                              </th>
                              <th className="text-center align-middle fw-bold">
                                Penyaluran
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataRekapBulan.map((row, index) => (
                              <tr key={index}>
                                <td className="align-middletext-center">
                                  {index + 1}
                                </td>
                                <td className="align-middletext-center">
                                  {row.thang}
                                </td>
                                <td className="align-middletext-center">
                                  {row.nmbulan}
                                </td>
                                <td className="align-middletext-center">
                                  {row.nmkppn}
                                </td>
                                <td className="align-middletext-center">
                                  {row.nmpemda}
                                </td>
                                <td
                                  className="align-middle text-end"
                                  style={{
                                    fontSize: "15px",
                                    minWidth: "100px",
                                  }}
                                >
                                  {numeral(row.pagu).format("0,0")}
                                </td>
                                <td
                                  className="align-middle text-end"
                                  style={{
                                    fontSize: "15px",
                                    minWidth: "100px",
                                  }}
                                >
                                  {numeral(row.alokasi_bulan).format("0,0")}
                                </td>
                                <td
                                  className="align-middle text-end"
                                  style={{
                                    fontSize: "15px",
                                    minWidth: "100px",
                                  }}
                                >
                                  {numeral(row.tunda).format("0,0")}
                                </td>
                                <td
                                  className="align-middle text-end"
                                  style={{
                                    fontSize: "15px",
                                    minWidth: "100px",
                                  }}
                                >
                                  {numeral(row.cabut).format("0,0")}
                                </td>
                                <td
                                  className="align-middle text-end"
                                  style={{
                                    fontSize: "15px",
                                    minWidth: "100px",
                                  }}
                                >
                                  {numeral(row.potongan).format("0,0")}
                                </td>
                                <td
                                  className="align-middle text-end"
                                  style={{
                                    fontSize: "15px",
                                    minWidth: "100px",
                                  }}
                                >
                                  {numeral(row.salur).format("0,0")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default KertasKerja25;
