import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Form, Modal, Spinner } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";

import CekKdpemda from "../../referensi/referensi_dau/cek_Kdpemda";

import RefKppn from "../../referensi/referensi_dau/ref_Kppn";
import { Loading2 } from "../../layout/LoadingTable";
import axios from "axios";

import RekonDetail from "./rekondetail25";
import RefKppn25 from "../../referensi/referensi_dau25/ref_Kppn";
import CekKdpemda25 from "../../referensi/referensi_dau25/cek_Kdpemda";

const Rekon25 = () => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [datapemotongan, setDatapemotongan] = useState([]);

  const [datapenundaan, setDatapenundaan] = useState([]);
  const [update, setUpdate] = useState(false);
  const [tokenomspan, setTokenomspan] = useState("");
  const [kppn, setCekKppn] = useState("");
  const [kdpemda, setKdpemda] = useState("");
  const [bedadata, setBedadata] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState("");
  const [cek, setCek] = useState(false);
  const [sql, setSql] = useState("");
  const [thang, setThang] = useState("2024");
  const [dataupdate, setdataupdate] = useState([]);
  const currentMonth = new Date().getMonth() + 1; // Mendapatkan bulan saat ini (bernilai 0-11)
  const [bulan, setBulan] = useState(currentMonth.toString().padStart(2, "0")); // Jadikan default bulan saat ini
  const [idkdpemda, setidkdpemda] = useState("");
  const [idkppn, setidkppn] = useState("");
  const [idbulan, setidbulan] = useState("");
  const [loadingsimpan, setloadingSimpan] = useState(false);

  useEffect(() => {
    if (update) {
      LoginOmspan();
      DeleteData();
    }
  }, [update]);

  useEffect(() => {
    getData();
  }, [kppn, bulan, kdpemda, bedadata]);

  useEffect(() => {
    getDataupdate();
  }, []);

  useEffect(() => {
    const fetchDataomspan = async () => {
      tokenomspan && (await getdataPemotongan());
      tokenomspan && (await getdataPenundaan());
    };
    fetchDataomspan();
  }, [tokenomspan]);

  const kondisithang =
    thang === "2025" ? "a.thang='2025'" : `a.thang='${thang}'`;
  const kondisi = kdpemda ? `AND a.kdpemda='${kdpemda}'` : "";
  const kondisikppn = kppn ? `AND a.kdkppn='${kppn}'` : "";
  const kondisibulan = bulan !== "00" ? `AND a.bulan='${bulan}'` : "";
  const kondisinull =
    bedadata === ""
      ? ""
      : bedadata === "00"
        ? "AND isnull(periode)"
        : "AND !isnull(periode)";

  const generateDataRekon = async () => {
    setloadingSimpan(true);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_GENERATEDATA_REKON_25
          ? `${import.meta.env.VITE_REACT_APP_GENERATEDATA_REKON_25}${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdate(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);

      setUpdate(false);
    }
  };

  //AMBIL DATA DAU DARI OMSPAN

  const LoginOmspan = async () => {
    setloadingSimpan(true);

    const loginCredentials = {
      username: "dpa_api",
      password: "AksesDpa23",
      thang: "2024",
    };
    const headers = {
      Accept: "application/json",
    };
    try {
      const response = await axios.post(
        "https://spanint.kemenkeu.go.id/apitkd/api/auth/login",
        loginCredentials,
        { headers, withCredentials: false }
      );

      setTokenomspan(response.data.token);

      setUpdate(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) || "Gagal Login ke OMSPAN (Rekon tidak berhasil)"
      );

      setloadingSimpan(false);
      setUpdate(false);
    }
  };

  const getdataPemotongan = async () => {
    setloadingSimpan(true);

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${tokenomspan}`,
    };

    try {
      const response = await axios.get(
        "https://spanint.kemenkeu.go.id/apitkd/api/dau/pemotongan",
        { headers, withCredentials: false }
      );

      setDatapemotongan(response.data.data);
      setloadingSimpan(false);
      setUpdate(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) || "Data Pemotongan OMSPAN gagal didapatkan"
      );

      setUpdate(false);
      setloadingSimpan(false);
    }
  };

  const getdataPenundaan = async () => {
    setloadingSimpan(true);
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${tokenomspan}`,
    };

    try {
      const response = await axios.get(
        "https://spanint.kemenkeu.go.id/apitkd/api/dau/penundaan",
        { headers, withCredentials: false }
      );

      setDatapenundaan(response.data.data);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) || "Data Penundaan OMSPAN gagal didapatkan"
      );
      setloadingSimpan(false);
    }
  };

  const DeleteData = async () => {
    setloadingSimpan(true);
    try {
      const response = await axiosJWT.delete(
        import.meta.env.VITE_REACT_APP_TRUNCATEDATAOMSPAN_25
          ? `${import.meta.env.VITE_REACT_APP_TRUNCATEDATAOMSPAN_25}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdate(false);
      setloadingSimpan(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      console.log(error);
      setUpdate(false);
      setloadingSimpan(false);
    }
  };

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.thang,a.bulan,a.nmbulan,a.kdkppn,a.kdpemda,a.nmpemda,a.kdkppn,a.nmkppn,a.pagu,alokasi_bulan,
      a.tunda,a.cabut,a.potongan,a.salur,b.periode as beda FROM tkd25.rekap a left join data_omspan25.data_beda b on a.kdpemda=b.kdpemda 
      and a.thang=b.thang and a.bulan=b.periode where
      ${kondisithang} ${kondisi} ${kondisikppn} ${kondisibulan} ${kondisinull} ORDER BY a.bulan, a.kdkppn,a.kdpemda`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    //console.log(cleanedQuery);
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

  const getDataupdate = async () => {
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_UPDATEREKON_25
          ? `${import.meta.env.VITE_REACT_APP_UPDATEREKON_25}?user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setdataupdate(response.data.tgupdate);
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

  const handleBulanChange = (e) => {
    setBulan(e.target.value);
  };

  const handleThangChange = (e) => {
    setThang(e.target.value);
  };

  const handleCekKppn = (kppn) => {
    setCekKppn(kppn);
    setKdpemda("");
  };
  const handleCekKdpemda = (kdpemda) => {
    setKdpemda(kdpemda);
  };

  const handleUpdate = (e) => {
    setUpdate(true);
  };
  // console.log(update);
  const handleBedaData = (event) => {
    const selectedValue = event.target.value;
    setBedadata(selectedValue);
  };

  const handleRekonDetail = (idkppn, idkdpemda, idbulan) => {
    setShowModal(true);
    setidkdpemda(idkdpemda);
    setidkppn(idkppn);
    setidbulan(idbulan);
    setOpen("2");
    setCek(true);
  };
  const handleCloseModalRekonDetail = () => {
    setShowModal(false);
    setCek(false);
  };
  const handleClose = () => {
    setloadingSimpan(false);
  };

  useEffect(() => {
    if (!loadingsimpan) {
      const timeout = setTimeout(() => {
        handleClose();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [loadingsimpan]);

  const simpanPemotongan = async () => {
    try {
      const batchSizepotong = 150;
      const totalRows = datapemotongan.length;
      let startIndex = 0;

      while (startIndex < totalRows) {
        const endIndex = Math.min(startIndex + batchSizepotong, totalRows);
        const batchDatapotong = datapemotongan.slice(startIndex, endIndex);

        // Proses simpan per batch untuk pemotongan
        const response = await axiosJWT.post(
          `${import.meta.env.VITE_REACT_APP_SIMPANPEMOTONGANOMSPAN_25}`,
          batchDatapotong,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        startIndex += batchSizepotong;
        setloadingSimpan(false);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const simpanPenundaan = async () => {
    try {
      const batchSize = 150;
      const totalRows = datapenundaan.length;
      let startIndex = 0;

      while (startIndex < totalRows) {
        const endIndex = Math.min(startIndex + batchSize, totalRows);
        const batchData = datapenundaan.slice(startIndex, endIndex);

        // Proses simpan per batch untuk penundaan
        const response = await axiosJWT.post(
          `${import.meta.env.VITE_REACT_APP_SIMPANPENUNDAANOMSPAN_25}`,
          batchData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        startIndex += batchSize;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    let executed = false;

    const runSimpanPemotonganAndPenundaan = async () => {
      try {
        if (datapemotongan.length > 0) {
          await simpanPemotongan();
        }
        if (datapenundaan.length > 0) {
          await simpanPenundaan();
        }

        // Setelah kedua fungsi selesai, jalankan generateDataRekon hanya sekali
        if (
          datapemotongan.length > 0 &&
          datapenundaan.length > 0 &&
          !executed
        ) {
          await generateDataRekon();
          await getData();
          await getDataupdate();
          setloadingSimpan(false);
          setUpdate(false);
          executed = true; // Setelah dijalankan, ubah flag menjadi true
        }
      } catch (error) {
        console.error(error);
        setloadingSimpan(false);
        setUpdate(false);
      }
    };

    runSimpanPemotonganAndPenundaan();
  }, [datapemotongan, datapenundaan]);

  return (
    <>
      <Card bg="light" className="text-dark mt-3">
        <Card.Body className="my-4">
          <Row>
            <Col sm={12} md={6} lg={6} xl={6} className={`mt-0`}>
              <Form.Group controlId="thang">
                <Form.Label className="fw-bold">Tahun</Form.Label>
                <Form.Select
                  name="thang"
                  value={thang}
                  onChange={handleThangChange}
                  className="form-select form-select-md text-select"
                >
                  {/* <option value="2023">2023</option> */}
                  <option value="2025">2025</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col sm={12} md={6} lg={6} xl={6} className={`mt-0`}>
              <Form.Group controlId="bulan">
                <Form.Label className="fw-bold">Bulan</Form.Label>
                <Form.Select
                  name="bulan"
                  value={bulan}
                  onChange={handleBulanChange}
                  className="form-select form-select-md text-select"
                >
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
              <Form.Group controlId="kppn">
                <Form.Label className="fw-bold">KPPN</Form.Label>
                <RefKppn25
                  name="kppn"
                  kppn={kppn}
                  as="select" // Mengganti input text dengan elemen select
                  className="form-select form-select-md text-select"
                  onChange={(e) => {
                    handleCekKppn(e);
                  }}
                />
              </Form.Group>
            </Col>

            <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
              <Form.Group controlId="kdpemda">
                <Form.Label className="fw-bold">Kabupaten/ Kota</Form.Label>
                <CekKdpemda25
                  name="kdpemda"
                  kppn={kppn}
                  kdpemda={kdpemda}
                  as="select" // Mengganti input text dengan elemen select
                  className="form-select form-select-md text-select"
                  onChange={(e) => {
                    handleCekKdpemda(e);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
              <Form.Group controlId="beda">
                <Form.Label className="fw-bold">Status</Form.Label>
                <Form.Select
                  name="beda"
                  value={bedadata}
                  onChange={handleBedaData}
                  className="form-select form-select-md text-select"
                >
                  <option value="">Semua Data</option>
                  <option value="00">Data Sama</option>
                  <option value="01">Data Berbeda</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
              <Form.Label className="fw-bold"></Form.Label>
              <div className="mt-2">
                <i
                  className="bi bi-arrow-repeat mt-1 text-danger"
                  onClick={(e) => {
                    handleUpdate(e);
                  }}
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    margin: "10px",
                    cursor: "pointer",
                  }}
                ></i>{" "}
                Ambil Data OMSPAN{" "}
                <pre className="mx-2 fw-italic fade-in">
                  {dataupdate && ` (update ${dataupdate})`}
                </pre>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="data-user fade-in">
        {loading ? (
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
              <thead className="header">
                <tr>
                  <th className="text-header text-center align-middle">No</th>
                  <th className="text-header text-center align-middle">TA</th>
                  <th className="text-header text-center align-middle">
                    Bulan
                  </th>
                  <th className="text-header text-center align-middle">KPPN</th>
                  <th className="text-header text-center align-middle">
                    Kab/ Kota
                  </th>

                  <th className="text-header text-center align-middle">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className=" text-center align-middle">{index + 1}</td>
                    <td className=" text-center align-middle">{row.thang}</td>
                    <td className=" text-center align-middle">{row.nmbulan}</td>

                    <td className=" text-center align-middle">
                      {row.nmkppn} - {row.kdkppn}
                    </td>
                    <td className=" text-center align-middle">
                      {row.nmpemda} - {row.kdpemda}
                    </td>

                    <td className=" text-center align-middle">
                      <i
                        className={`bi ${
                          row.beda
                            ? "bi bi-exclamation-circle-fill text-danger"
                            : "bi-check-lg text-success"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleRekonDetail(row.kdkppn, row.kdpemda, row.bulan)
                        }
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <Modal
        show={loadingsimpan}
        onHide={handleClose}
        animation={false}
        size="md"
      >
        <Modal.Body className="text-center">
          {/* Spinner untuk menampilkan loading */}
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
          <p>mengambil data omspan...</p>
        </Modal.Body>
      </Modal>
      {open === "2" && (
        <RekonDetail
          show={showModal}
          onHide={handleCloseModalRekonDetail}
          cek={cek}
          kodekppn={idkppn}
          kdpemda={idkdpemda}
          thang={thang}
          bulan={idbulan}
        />
      )}
    </>
  );
};

export default Rekon25;
