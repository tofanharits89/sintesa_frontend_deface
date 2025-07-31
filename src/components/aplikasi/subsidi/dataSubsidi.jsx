import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../../auth/Context";
import { Container, Button, Spinner, Dropdown } from "react-bootstrap";
import DanaDesa from "./DanaDesa";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import moment from "moment";
import { Loading2 } from "../../layout/LoadingTable";
import { UpdateMbg } from "../mbg/overview/tgUpdate";
import UpdateModal from "../mbg/modal/updateData";
import { LandingMbgKanwil } from "../mbg/dataKanwil/landingMbgKanwil";
import DownloadData from "../mbg/modal/DownloadData";
import { ModalRekamBPS } from "../mbg/dataKanwil/ModalRekamBPS";
import { ModalRekamBapanas } from "../mbg/dataKanwil/ModalRekamBapanas";
import { ModalRekamBulanan } from "../mbg/dataKanwil/ModalRekamBulanan";

const Subsidi = () => {
  const { username, axiosJWT, token, role } = useContext(MyContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalkomo, setShowModalkomo] = useState(false);
  const [showModaldata, setShowModaldata] = useState(false);
  const [showModalBPS, setShowModalTayang] = useState(false);
  const [showModalBapanas, setShowModalBapanas] = useState(false);
  const [showModalBulanan, setShowModalBulanan] = useState(false);

  const handleConfirmUpdate = () => {
    setShowModal(false);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleConfirm = () => {
    setShowModalkomo(false);
  };
  const handleClose = () => setShowModalkomo(false);

  const handleCloseData = () => {
    setShowModaldata(false);
  };
  const handleData = () => {
    setShowModaldata(false);
  };

  const handleCloseModalBPS = () => {
    setShowModalTayang(false);
  };
  const handleCloseModalBapanas = () => {
    setShowModalBapanas(false);
  };
  const handleCloseModalBulanan = () => {
    setShowModalBulanan(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const formatDateToIndonesia = (dateString) => {
    if (!dateString) return "Tanggal tidak valid";

    const formattedDate = moment(dateString, "YYYY-MM-DD HH:mm:ss");

    if (!formattedDate.isValid()) return "Tanggal tidak valid";

    return formattedDate.locale("id").format("DD/MM/YYYY [pukul] HH:mm:ss");
  };

  const getData = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT tgupdate FROM repport_tkd.tkd_tgupdate limit 1`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_TKD
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        response.data &&
        response.data.result &&
        response.data.result[0]?.tgupdate
      ) {
        setData(response.data.result[0].tgupdate);
      } else {
        setData(null);
      }
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
  };

  const fileUrl = `${
    import.meta.env.VITE_REACT_APP_LOCAL_SUBSIDI
  }/subsidi/subsidi.xlsx`;

  const fileUrl1 = `${
    import.meta.env.VITE_REACT_APP_LOCAL_SUBSIDI
  }/subsidi/kur_alsintan.xlsx`;

  const fileUrl2 = `${
    import.meta.env.VITE_REACT_APP_LOCAL_SUBSIDI
  }/subsidi/subsidi_pupuk_wilayah.xlsx`;

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Rowset Data</h1>
        </div>
        <section className="section dashboard team">
          <div className="corner-icon top-left">
            <i className="bi bi-exclude"></i>
          </div>
          <div className="corner-icon top-right">
            <i className="bi bi-exclude"></i>
          </div>
          <Container fluid>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Data Subsidi TA 2023</h5>
                <ul className="list-group1">
                  <li className="list-group-item">
                    <i className="bi bi-star me-1 text-success"></i> Sumber Data
                    : ITJEN Kemenkeu
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-collection me-1 text-primary"></i>{" "}
                    Periode : Januari - Juni 2023
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle me-1 text-danger"></i>{" "}
                    Jenis Subsidi : Listrik - BBM - Pupuk
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-exclamation-octagon me-1 text-warning"></i>{" "}
                    Update: Juni 2023
                  </li>
                </ul>

                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    <i className="bi bi-download me-2"></i>Download Files
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => (window.location.href = fileUrl)}
                    >
                      <i className="bi bi-file-earmark-excel me-2"></i>Data
                      Subsidi
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => (window.location.href = fileUrl1)}
                    >
                      <i className="bi bi-file-earmark-excel me-2"></i>KUR
                      Alsintan
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => (window.location.href = fileUrl2)}
                    >
                      <i className="bi bi-file-earmark-excel me-2"></i>Subsidi
                      Pupuk Wilayah
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Container>

          {loading || !data ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <DanaDesa update={formatDateToIndonesia(data)} />
          )}

          <div style={{ marginBottom: "100px" }}></div>
        </section>
      </main>
    </>
  );
};

export default Subsidi;
