import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import GenerateCSV from "../CSV/generateCSV";
import moment from "moment";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import Modal_proyeksi from "./Modal_proyeksi";
import Edit_proyeksi from "./Edit_proyeksi";
import { Loading1, Loading2, LoadingChart } from "../../layout/LoadingTable";
import "./proyeksi.css";

const Proyeksi = () => {
  const { role, username, axiosJWT, token, kdkppn } = useContext(MyContext);
  const [cek, setCek] = useState(true);
  const [open, setOpen] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sql, setSql] = useState("");
  const [sqlunduh, setSqlunduh] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [export2, setExport2] = useState(false);
  const [showModaledit, setShowModaledit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState("");
  const [hasMoreData, setHasMoreData] = useState(true);
  const [offset, setOffset] = useState(0);
  // console.log(refresh);
  const handleRekam = async () => {
    setShowModal(true);
    setCek(false);
    setOpen("1");
  };

  const handleEditdata = async (id) => {
    setShowModaledit(true);
    setId(id);
    setCek(false);
    setOpen("2");
  };

  const handleClose = () => {
    setShowModal(false);
    setCek(true);
    setOpen("");
    setRefresh(refresh ? false : true);
    // setOffset(0);
  };

  const handleCloseedit = () => {
    setShowModaledit(false);
    setCek(true);
    setOpen("");
    setRefresh(refresh ? false : true);
  };

  useEffect(() => {
    getData();
    // console.log(sql);
  }, []);

  // useEffect(() => {
  //   refresh && getData();
  // }, [refresh]);

  const getData = async () => {
    setLoading(true);
    let filterKppn = "";
    if (role === "3") {
      filterKppn = `where a.kdkppn = '${kdkppn}' and c.kddept='999'`;
    } else {
      filterKppn = `where  c.kddept='999'`;
    }

    /* Buat Query Unduh */
    const encodedQueryunduh = encodeURIComponent(
      `SELECT a.id,a.keperluan,a.thang,a.periode,a.kdkppn,b.nmkppn,a.kdsatker,c.nmsatker,a.jenis_tkd,z.nmjenis,a.updatedAt,a.jan,a.real_jan,a.dev_jan,a.feb,a.real_feb,a.dev_feb,a.mar,a.real_mar,a.dev_mar,a.apr,a.real_apr,a.dev_apr,a.mei,a.real_mei,a.dev_mei,a.jun,a.real_jun,a.dev_jun,a.jul,a.real_jul,a.dev_jul,a.ags,a.real_ags,a.dev_ags,a.sep,a.real_sep,a.dev_sep,a.okt,a.real_okt,a.dev_okt,a.nov,a.real_nov,a.dev_nov,a.des,a.real_des,a.dev_des,a.keterangan FROM
      tkd.proyeksi a LEFT JOIN dbref.t_kppn_2024 b ON a.kdkppn=b.kdkppn left join dbref.t_satker_2024 c
       on a.kdsatker=c.kdsatker left join tkd.jenis_tkd z on a.jenis_tkd=z.jenis  ${filterKppn} ORDER BY a.updatedAt,a.kdkppn DESC
      `
    );

    const cleanedQueryunduh = decodeURIComponent(encodedQueryunduh)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSqlunduh(cleanedQueryunduh);
    const encryptedQueryunduh = Encrypt(cleanedQueryunduh);

    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.keperluan,a.thang,a.periode,a.kdkppn,b.nmkppn,a.kdsatker,c.nmsatker,a.jenis_tkd,z.nmjenis,a.updatedAt,a.jan,a.real_jan,a.dev_jan,a.feb,a.real_feb,a.dev_feb,a.mar,a.real_mar,a.dev_mar,a.apr,a.real_apr,a.dev_apr,a.mei,a.real_mei,a.dev_mei,a.jun,a.real_jun,a.dev_jun,a.jul,a.real_jul,a.dev_jul,a.ags,a.real_ags,a.dev_ags,a.sep,a.real_sep,a.dev_sep,a.okt,a.real_okt,a.dev_okt,a.nov,a.real_nov,a.dev_nov,a.des,a.real_des,a.dev_des,a.keterangan FROM
      tkd.proyeksi a LEFT JOIN dbref.t_kppn_2024 b ON a.kdkppn=b.kdkppn left join dbref.t_satker_2024 c
       on a.kdsatker=c.kdsatker left join tkd.jenis_tkd z on a.jenis_tkd=z.jenis  ${filterKppn} ORDER BY a.updatedAt,a.kdkppn DESC LIMIT 30 OFFSET ${offset}
      `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    // console.log(sql);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
            }${encryptedQuery}&${encryptedQueryunduh}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prevData) => [...prevData, ...response.data.result]);
      setOffset((prevOffset) => prevOffset + 30);

      if (response.data.result.length < 30) {
        setLoading(true); // Set loading true untuk menampilkan loader
        setHasMoreData(false); // Tidak ada lagi data yang bisa dimuat
      } else {
        setHasMoreData(true);
      }
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false); // Set loading false setelah pengambilan data selesai
    }
  };

  const handleHapusdata = async (id) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";
    Swal.fire({
      title: "Konfirmasi Hapus",
      html: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.delete(
            `${import.meta.env.VITE_REACT_APP_LOCAL_HAPUSPROYEKSI}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");

          getData();
          setRefresh(!refresh);
          // setOffset(0);
        } catch (error) {
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      }
    });
  };

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  // console.log(refresh);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Proyeksi TKD</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">TKD</a>
              </li>
              <li className="breadcrumb-item active">Data Proyeksi</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex justify-content-end">
          {role !== "2" && (
            <Button
              variant="primary"
              size="sm"
              className="my-3 btn-block me-2"
              style={{ padding: "5px 5px", marginTop: "10px" }}
              onClick={handleRekam}
            >
              Rekam
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            className="my-3 btn-block"
            style={{ padding: "5px 5px", marginTop: "10px" }}
            onClick={() => {
              setLoadingStatus(true);
              setExport2(true);
            }}
            disabled={loadingStatus}
          >
            {loadingStatus && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            {!loadingStatus && (
              <i className="bi bi-file-earmark-excel-fill mx-2"></i>
            )}
            {loadingStatus ? " Loading..." : "Download"}
          </Button>
        </div>
        <Card>
          <CardBody className="p-3 rounded" style={{ height: "800px" }}>
            <section className="section ">
              <div className="headertkd">
                <Row>
                  <Col xs={1}>No</Col>
                  <Col xs={1}>Tahun.Periode</Col>
                  <Col xs={2}>KPPN</Col>
                  <Col xs={3}>Satker</Col>
                  <Col xs={2}>Jenis TKD</Col>
                  <Col xs={1}>Keperluan</Col>
                  <Col xs={1}>Updated</Col>
                  <Col xs={1}>Opsi</Col>
                </Row>
              </div>
              <div
                id="scrollableDiv"
                style={{
                  height: "60vh",
                  overflow: "auto",
                  textAlign: "center",
                  padding: "5px 0",
                }}
              >
                <InfiniteScroll
                  dataLength={data.length}
                  next={getData}
                  hasMore={hasMoreData}
                  loader={
                    <div className="my-2">
                      <Loading2 />
                    </div>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  {data.map((row, index) => (
                    <Row
                      key={index}
                      className={index % 2 === 0 ? "even-row" : "odd-row"}
                      style={{ fontSize: "14px", padding: "7px" }}
                    >
                      <Col xs={1}>{index + 1}</Col>
                      <Col xs={1}>
                        {row.thang}.{row.periode}
                      </Col>
                      <Col xs={2}>
                        {row.nmkppn} ({row.kdkppn})
                      </Col>
                      <Col xs={3}>
                        {row.nmsatker} ({row.kdsatker})
                      </Col>

                      <Col xs={2}>{row.nmjenis}</Col>
                      <Col xs={1}>{row.keperluan}</Col>
                      <Col xs={1}>
                        {moment(row.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
                      </Col>
                      <Col xs={1}>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Edit Data </Tooltip>}
                        >
                          <i
                            className="bi bi-pencil-square text-primary mx-2"
                            onClick={() => handleEditdata(row.id)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>Hapus Data </Tooltip>}
                        >
                          <i
                            className="bi bi-trash-fill text-danger mx-2"
                            onClick={() => handleHapusdata(row.id)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        </OverlayTrigger>
                      </Col>
                    </Row>
                  ))}
                </InfiniteScroll>
              </div>
            </section>
          </CardBody>
        </Card>
      </main>
      {open === "1" && (
        <Modal_proyeksi
          show={showModal}
          cek={cek}
          onHide={handleClose}
          setRefresh={setRefresh}
        />
      )}
      {open === "2" && (
        <Edit_proyeksi
          show={showModaledit}
          cek={cek}
          onHide={handleCloseedit}
          setRefresh={setRefresh}
          id={id}
        />
      )}
      {export2 && (
        <GenerateCSV
          query3={sqlunduh}
          status={handleStatus}
          namafile={`v3_CSV_REKAP_PROYEKSI_TKD_${moment().format(
            "DDMMYY-HHmmss"
          )}`}
        />
      )}
    </>
  );
};

export default Proyeksi;
