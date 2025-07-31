import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import numeral from "numeral";
import * as Yup from "yup";
import Swal from "sweetalert2";
import CekKdpemda from "../../referensi/referensi_dau/cek_Kdpemda";
import { Formik, Field, ErrorMessage } from "formik";
import RefKppn from "../../referensi/referensi_dau/ref_Kppn";
import { Loading2 } from "../../layout/LoadingTable";
import RekamDataTransaksi from "./RekamDataTransaksi";
import KertasKerja from "./KertasKerja";

const RekamTransaksi = ({ id, cek2 }) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [kppn, setCekKppn] = useState("");
  const [kdpemda, setKdpemda] = useState("");
  const [showModalRekam, setShowModalRekam] = useState(false);
  const [showModalKK, setShowModalKK] = useState(false);
  const [open, setOpen] = useState("");
  const [cek, setCek] = useState(false);
  const [idx, setIdx] = useState("");
  const [sql, setSql] = useState("");
  const [thang, setThang] = useState("2024");
  const currentMonth = new Date().getMonth() + 1; // Mendapatkan bulan saat ini (bernilai 0-11)
  const [bulan, setBulan] = useState(currentMonth.toString().padStart(2, "0")); // Jadikan default bulan saat ini
  const [idkdpemda, setidkdpemda] = useState("");
  const [idkppn, setidkppn] = useState("");

  useEffect(() => {
    cek2 === "1" && getData();
  }, [bulan, kppn, kdpemda, cek2]);

  const kondisithang =
    thang === "2024" ? "A.THANG='2024'" : `A.THANG='${thang}'`;
  const kondisi = kdpemda ? `AND A.KDPEMDA='${kdpemda}'` : "";
  const kondisikppn = kppn ? `AND A.KDKPPN='${kppn}'` : "";
  const kondisibulan = bulan !== "00" ? `AND A.BULAN='${bulan}'` : "";

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT
      A.ID,
      A.BULAN,
      A.THANG,
      A.NMBULAN,
      A.KDKPPN,
      D.NMKPPN,
      A.KDPEMDA,
      D.NMPEMDA,
      D.ALOKASI AS ALOKASI,
      SUM(B.NILAI) AS NILAI
  FROM
      tkd.M_TRANSAKSI A
  LEFT JOIN
      tkd.ALOKASI_BULANAN_LIST D ON A.KDKPPN = D.KDKPPN
      AND A.BULAN = D.BULAN
      AND A.KDPEMDA = D.KDPEMDA
  LEFT JOIN
      tkd.DETAIL_KMK_DAU B ON A.KDKPPN = B.KDKPPN
      AND A.BULAN = B.BULAN
      AND A.KDPEMDA = B.KDKABKOTA
      WHERE 
      ${kondisithang} ${kondisi} ${kondisikppn} ${kondisibulan}
  
  GROUP BY
      A.BULAN,
      A.KDKPPN,
      A.KDPEMDA
  ORDER BY
      A.BULAN,
      A.KDKPPN,
      A.KDPEMDA;
  `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
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

  const handleBulanChange = (e) => {
    setBulan(e.target.value);
    // Tambahkan logika atau perubahan state lain yang diperlukan
  };

  const handleThangChange = (e) => {
    setThang(e.target.value);
    // Tambahkan logika atau perubahan state lain yang diperlukan
  };

  const handleCekKppn = (kppn) => {
    setCekKppn(kppn);
    setKdpemda("");
  };
  const handleCekKdpemda = (kdpemda) => {
    setKdpemda(kdpemda);
  };

  const handleSubmitdata = async (values, { setSubmitting }) => {
    setLoading(true);

    try {
      //  console.log(values);
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANPENUNDAAN,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      Swal.fire({
        html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
        icon: "success", // Tambahkan ikon error
        position: "top",
        buttonsStyling: false,
        customClass: {
          popup: "swal2-animation",
          container: "swal2-animation",
          confirmButton: "swal2-confirm ", // Gunakan kelas CSS kustom untuk tombol
          icon: "swal2-icon", // Gunakan kelas CSS kustom untuk ikon
        },
        confirmButtonText: "Tutup",
      });
    } catch (error) {
      console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }

    setSubmitting(false); // Atur kembali nilai setSubmitting menjadi false
    setLoading(false);
  };
  const validationSchema = Yup.object().shape({
    kppn: Yup.string().required("KPPN harus dipilih"),
    kdpemda: Yup.string().required("Kabkota harus dipilih"),
  });

  const handleRekam = async (id) => {
    setIdx(id);
    setOpen("1");
    setShowModalRekam(true);
  };
  const handleCloseModal = () => {
    setShowModalRekam(false);
    getData();
  };

  const handleKertasKerja = (idkppn, idkdpemda) => {
    setShowModalKK(true);
    setidkdpemda(idkdpemda);
    setidkppn(idkppn);
    setOpen("2");
    setCek(true);
  };
  const handleCloseModalKK = () => {
    setShowModalKK(false);
    setCek(false);
  };

  return (
    <>
      <Card bg="light" className="text-dark mt-3">
        <Card.Body className="my-4">
          <Formik
            validationSchema={validationSchema}
            onSubmit={handleSubmitdata}
            enableReinitialize={true}
            initialValues={{
              kdpemda: kdpemda,
              kppn: kppn,
            }}
          >
            {({ handleSubmit, handleChange, values, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
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
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
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
                      <RefKppn
                        name="kppn"
                        kppn={kppn}
                        as="select" // Mengganti input text dengan elemen select
                        className="form-select form-select-md text-select"
                        onChange={(e) => {
                          handleChange(e);
                          handleCekKppn(e);
                        }}
                      />
                      <ErrorMessage
                        name="kppn"
                        component="div"
                        className="text-white"
                      />
                    </Form.Group>
                  </Col>

                  <Col sm={12} md={6} lg={6} xl={6} className={`mt-2`}>
                    <Form.Group controlId="kdpemda">
                      <Form.Label className="fw-bold">
                        Kabupaten/ Kota
                      </Form.Label>
                      <CekKdpemda
                        name="kdpemda"
                        kppn={kppn}
                        kdpemda={kdpemda}
                        as="select" // Mengganti input text dengan elemen select
                        className="form-select form-select-md text-select"
                        onChange={(e) => {
                          handleChange(e);
                          handleCekKdpemda(e);
                        }}
                      />
                      <ErrorMessage
                        name="kdpemda"
                        component="div"
                        className="text-white"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
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
                    Alokasi
                  </th>
                  <th className="text-header text-center align-middle">
                    Nilai Potongan
                  </th>
                  <th className="text-header text-center align-middle">
                    Option
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className=" text-center align-middle">{index + 1}</td>
                    <td className=" text-center align-middle">{row.THANG}</td>
                    <td className=" text-center align-middle">{row.NMBULAN}</td>

                    <td className=" text-center align-middle">
                      {row.NMKPPN} - {row.KDKPPN}
                    </td>
                    <td className=" text-center align-middle">
                      {row.NMPEMDA} - {row.KDPEMDA}
                    </td>
                    <td className=" text-end align-middle">
                      {numeral(row.ALOKASI).format("0,0")}
                    </td>
                    <td className=" text-end align-middle">
                      {numeral(row.NILAI).format("0,0")}
                    </td>
                    <td className=" text-center align-middle">
                      <i
                        className="bi bi-arrow-up-right-circle-fill text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRekam(row.ID)}
                      ></i>
                      &nbsp;&nbsp; &nbsp;&nbsp;
                      <i
                        className="bi bi-card-list text-success"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleKertasKerja(row.KDKPPN, row.KDPEMDA)
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
      {open === "1" && (
        <RekamDataTransaksi
          show={showModalRekam}
          onHide={handleCloseModal}
          id={idx}
          kppn={kppn}
          kdpemda={kdpemda}
          thang={thang}
          bulan={bulan}
        />
      )}
      {open === "2" && (
        <KertasKerja
          show={showModalKK}
          onHide={handleCloseModalKK}
          cek={cek}
          kppn={idkppn}
          kdpemda={idkdpemda}
          thang={thang}
          bulan={bulan}
        />
      )}
    </>
  );
};

export default RekamTransaksi;
