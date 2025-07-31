import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Modal } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import numeral from "numeral";
import { Loading2 } from "../../layout/LoadingTable";

const RekonDetail = ({
  show,
  onHide,
  cek,
  kodekppn,
  kdpemda,
  thang,
  bulan,
}) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [loadingOmspan, setLoadingOmspan] = useState(false);
  const [data, setData] = useState([]);
  const [dataomspan, setDataomspan] = useState([]);
  const [datapemotongan, setDataPotongan] = useState([]);
  const [banding, setBanding] = useState([]);
  const [sql, setSql] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await getData();
      await getDataPotongan();
      await getDataOmspan();
    };
    cek && fetchData();
  }, [cek, bulan, kodekppn, kdpemda]);

  // useEffect(() => {
  //   getData();
  //   getDataPotongan();
  //   getDataOmspan();
  // }, [kodekppn, bulan, kdpemda, thang]);

  const kondisithang =
    thang === "2024" ? "a.thang='2024'" : `a.thang='${thang}'`;
  const kondisipemda = kdpemda ? `and a.kdpemda='${kdpemda}'` : "";
  const kondisikppn = kodekppn ? `and a.kdkppn='${kodekppn}'` : "";
  const kondisibulan = bulan !== "00" ? `and a.bulan='${bulan}'` : "";
  const kondisipemdapotong = kdpemda ? `and a.kdpemda='${kdpemda}'` : "";

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT A.THANG,A.NMBULAN,A.KDKPPN,A.NMKPPN,
      A.KDPEMDA,A.NMPEMDA,A.PAGU,A.ALOKASI_BULAN,SUM(A.TUNDA) TUNDASINTESA,IF(PENUNDAANOMSPAN IS NOT NULL,PENUNDAANOMSPAN,0) 
      PENUNDAANOMSPAN,A.CABUT,SUM(A.POTONGAN) AS POTONGANSINTESA,IF(POTONGANOMSPAN IS NOT NULL,POTONGANOMSPAN,0) POTONGANOMSPAN,SUM(A.SALUR) SALURSINTESA
      FROM TKD.REKAP A 
      LEFT OUTER JOIN
      (SELECT B.THANG,B.KODE_PEMDA,B.PERIODE,B.KODE_KPPN,SUM(NILAI_PEMOTONGAN) POTONGANOMSPAN FROM DATA_OMSPAN.DATA_PEMOTONGAN B
      GROUP BY B.THANG,B.KODE_PEMDA,B.PERIODE,B.KODE_KPPN) B
      ON A.KDPEMDA=B.KODE_PEMDA AND A.KDKPPN=B.KODE_KPPN AND A.BULAN=B.PERIODE
      LEFT OUTER JOIN
      (SELECT C.THANG,C.KODE_PEMDA,C.PERIODE,C.KODE_KPPN,SUM(NILAI_PENUNDAAN) PENUNDAANOMSPAN FROM DATA_OMSPAN.DATA_PENUNDAAN C
      GROUP BY C.THANG,C.KODE_PEMDA,C.PERIODE,C.KODE_KPPN) C
      ON A.KDPEMDA=C.KODE_PEMDA AND A.KDKPPN=C.KODE_KPPN AND A.BULAN=C.PERIODE
      WHERE  ${kondisithang} ${kondisipemda} ${kondisikppn} ${kondisibulan}  GROUP BY A.THANG,A.KDPEMDA,A.BULAN,A.KDKPPN ORDER BY
      A.BULAN,A.KDKPPN,A.KDPEMDA`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    //console.log(cleanedQuery);
    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_GENERATEDATA_REKON_OMSPAN
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_GENERATEDATA_REKON_OMSPAN
            }${encryptedQuery}&thang=${thang}&kdpemda=${kdpemda}&kdkppn=${kodekppn}&bulan=${bulan}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);

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
    const encodedQuery = encodeURIComponent(
      `SELECT a.thang,a.bulan,a.kdkppn,a.kdpemda,a.akun_pusat,a.akun_omspan,a.nilai_omspan,a.nilai_pusat FROM data_omspan.rekon_potongan a
              WHERE  ${kondisithang} ${kondisipemdapotong} ${kondisikppn} ${kondisibulan}  `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    //console.log(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
            }${encryptedQuery}&thang=${thang}&kdpemda=${kdpemda}&kdkppn=${kodekppn}&bulan=${bulan}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataPotongan(response.data.result);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const getDataOmspan = async () => {
    setLoadingOmspan(true);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_GENERATEDATA_REKON_OMSPAN_LIVE
          ? `${
              import.meta.env
                .VITE_REACT_APP_LOCAL_GENERATEDATA_REKON_OMSPAN_LIVE
            }?thang=${thang}&kdpemda=${kdpemda}&kdkppn=${kodekppn}&bulan=${bulan}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDataomspan(response.data.data);
      setLoadingOmspan(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setLoadingOmspan(false);
    }
  };

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
              Rekon Data DAU | Sintesa vs OMSPAN TKD
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ width: "100%" }}>
            <Card>
              <Card.Body className="data-user2 fade-in">
                {loading ? (
                  <div className="my-4">
                    <Loading2 />
                    <br />
                    <Loading2 />
                    <br />
                    <Loading2 />
                  </div>
                ) : (
                  <>
                    <table className="tabel-dau">
                      <thead className="header">
                        <tr>
                          <th rowSpan="3">kppn</th>
                          <th rowSpan="3">pemda</th>
                          <th rowSpan="3">bulan</th>
                          <th colSpan="3">sintesa</th>
                          <th colSpan="2">omspan</th>
                        </tr>
                        <tr>
                          <th rowSpan="2">alokasi</th>
                          <th rowSpan="2">penundaan</th>
                          <th colSpan="1">potongan</th>

                          <th rowSpan="1">penundaan</th>
                          <th colSpan="1">potongan</th>
                        </tr>
                      </thead>
                      <tbody className="fw-bold">
                        {data.map((row, index) => (
                          <>
                            <tr key={index}>
                              <td className="text-center align-middle">
                                {row.NMKPPN} - {row.KDKPPN}
                              </td>
                              <td className="text-center align-middle">
                                {row.NMPEMDA} - {row.KDPEMDA}
                              </td>
                              <td className="text-center align-middle">
                                {row.NMBULAN}
                              </td>
                              <td className="text-end align-middle">
                                {numeral(row.ALOKASI_BULAN).format("0,0")}
                              </td>
                              <td
                                className="text-end align-middle"
                                style={{
                                  color: "white",
                                  background:
                                    row.PENUNDAANOMSPAN !== row.TUNDASINTESA
                                      ? "red"
                                      : "",
                                }}
                              >
                                {row.PENUNDAANOMSPAN !== row.TUNDASINTESA ? (
                                  <span>
                                    {numeral(row.TUNDASINTESA).format("0,0")}
                                  </span>
                                ) : (
                                  <span>
                                    {numeral(row.TUNDASINTESA).format("0,0")}
                                  </span>
                                )}
                              </td>

                              <td
                                className="text-end align-middle"
                                style={{
                                  color: "white",
                                  background:
                                    row.POTONGANOMSPAN !== row.POTONGANSINTESA
                                      ? "red"
                                      : "",
                                }}
                              >
                                {row.POTONGANOMSPAN !== row.POTONGANSINTESA ? (
                                  <span>
                                    {numeral(row.POTONGANSINTESA).format("0,0")}
                                  </span>
                                ) : (
                                  <span>
                                    {numeral(row.POTONGANSINTESA).format("0,0")}
                                  </span>
                                )}
                              </td>

                              <td
                                className="text-end align-middle"
                                style={{
                                  color: "white",
                                  background:
                                    row.PENUNDAANOMSPAN !== row.TUNDASINTESA
                                      ? "red"
                                      : "",
                                }}
                              >
                                {row.PENUNDAANOMSPAN !== row.TUNDASINTESA ? (
                                  <span>
                                    {numeral(row.PENUNDAANOMSPAN).format("0,0")}
                                  </span>
                                ) : (
                                  <span>
                                    {numeral(row.PENUNDAANOMSPAN).format("0,0")}
                                  </span>
                                )}
                              </td>
                              <td
                                className="text-end align-middle"
                                style={{
                                  color: "white",
                                  background:
                                    row.POTONGANOMSPAN !== row.POTONGANSINTESA
                                      ? "red"
                                      : "",
                                }}
                              >
                                {row.POTONGANOMSPAN !== row.POTONGANSINTESA ? (
                                  <span>
                                    {numeral(row.POTONGANOMSPAN).format("0,0")}
                                  </span>
                                ) : (
                                  <span>
                                    {numeral(row.POTONGANOMSPAN).format("0,0")}
                                  </span>
                                )}
                              </td>
                            </tr>
                          </>
                        ))}

                        <tr>
                          <th
                            rowSpan="1"
                            colSpan={4}
                            style={{ background: "dark" }}
                          ></th>
                          <th className="text-center align-middle"> akun</th>
                          <th className="text-center align-middle"> nilai</th>
                          <th className="text-center align-middle"> akun</th>
                          <th className="text-center align-middle"> nilai</th>
                        </tr>

                        {datapemotongan.map((row, index) => (
                          <>
                            <tr key={index}>
                              <td colSpan={4}></td>

                              <td className="text-center align-middle">
                                {row.akun_pusat}
                              </td>
                              <td className="text-end align-middle">
                                {numeral(row.nilai_pusat).format("0,0")}
                              </td>
                              <td className="text-center align-middle">
                                {row.akun_omspan === "0"
                                  ? "-"
                                  : row.akun_omspan}
                              </td>

                              <td className="text-end align-middle">
                                {numeral(row.nilai_omspan).format("0,0")}
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default RekonDetail;
