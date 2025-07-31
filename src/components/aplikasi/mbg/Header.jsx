import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import numeral from "numeral";
import "boxicons/css/boxicons.min.css";
import TargetMbgBgn from "../../aplikasi/mbg/chart/targetMbg";
import { UpdateMbg } from "./overview/tgUpdate";

const Header = ({ prov, darkMode }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState(null);
  const [dataTarget, setDataTarget] = useState([]);

  const handleDataTarget = (data) => {
    setDataTarget(data || []);
  };

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(`
      SELECT 
        (SELECT SUM(y) FROM data_bgn.by_jenis ) AS jumlahsppg,  
        (SELECT count(DISTINCT name) FROM data_bgn.by_jenis where y<>0) AS jumlahjenis,
        (SELECT SUM(y) FROM data_bgn.by_petugas ) AS jumlahpetugas,
        (SELECT SUM(y) FROM data_bgn.by_kelompok ) AS jumlahkelompok,
        (SELECT SUM(y) FROM data_bgn.by_penerima ) AS jumlahpenerima,
        (SELECT jum_terima FROM data_bgn.by_kemarin ORDER BY id DESC LIMIT 1) AS jumlahkemarin,
        (SELECT jum_terima FROM data_bgn.by_sekarang ORDER BY id DESC LIMIT 1) AS jumlahsekarang, 
        (SELECT sum(y) jumlah_supplier FROM data_bgn.by_supplier) AS jumlahsupplier;
    `);

    const encodedQueryWilayah = encodeURIComponent(`
    select jumlahsppg,jumlahpetugas,jumlahkelompok,jumlahpenerima,jumlahsupplier
from data_bgn.data_summary_prov where wilnama='${prov}';

    `);

    const queryMBG = prov === "NASIONAL" ? encodedQuery : encodedQueryWilayah;
    const cleanedQuery = decodeURIComponent(queryMBG)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // console.log(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataSummary(response.data.result?.[0] || null);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend Header"
      );
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  useEffect(() => {
    getData();
  }, [prov]);

  const formatAngka = (val) => (val != null ? numeral(val).format("0,0") : "0");

  // const target = dataTarget.length > 0 ? dataTarget[0] : null;
  const target = (dataTarget ?? []).length > 0 ? dataTarget[0] : null;

  // console.log(dataTarget);

  return (
    <>
      <Row xs={1} md={2} xl={5}>
        <Col>
          <Card
            className={`radius-10 border-start border-0 border-4 border-info mt-3 ${
              darkMode ? "dark-mode" : ""
            }`}
          >
            <Card.Body>
              <TargetMbgBgn prov={prov} onDataReceived={handleDataTarget} />
              <div
                className="d-flex align-items-center"
                style={{
                  height: "110px",
                  overflowY: "auto",
                }}
              >
                <div className="text-start mt-3">
                  <p className="mb-0 text-secondary">Total SPPG Aktif</p>
                  <h4
                    className="my-1 text-info fw-bold"
                    style={{ fontSize: "1.7em" }}
                  >
                    {loading ? "..." : formatAngka(dataSummary?.jumlahsppg)}
                  </h4>
                  <p className="text-success">
                    Target:{" "}
                    {target ? numeral(target.target).format("0,0") : "N/A"} (
                    {target
                      ? numeral(target.persen_penerima).format("0,0")
                      : "N/A"}
                    %)
                  </p>
                </div>
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center ms-auto"
                  style={{
                    width: 50,
                    height: 50,
                    background:
                      "linear-gradient(135deg,rgb(197, 227, 232), #138496)",
                  }}
                >
                  <i className="bx bxs-wallet bx-sm" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="radius-10 border-start border-0 border-4 border-danger mt-3">
            <Card.Body>
              <div
                className="d-flex align-items-center"
                style={{ height: "110px", overflowY: "auto" }}
              >
                <div className="text-start mt-3">
                  <p className="mb-0 text-secondary"> Petugas SPPG</p>
                  <h4
                    className="my-1 fw-bold"
                    style={{ color: "#b02a37", fontSize: "1.7em" }}
                  >
                    {loading
                      ? "..."
                      : prov !== "NASIONAL"
                      ? numeral(target.total_petugas_prov).format("0,0")
                      : formatAngka(dataSummary?.jumlahpetugas)}
                  </h4>
                  <p>&nbsp;</p>
                </div>
                <div
                  className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center ms-auto"
                  style={{
                    width: 50,
                    height: 50,
                    background:
                      "linear-gradient(135deg,rgb(226, 185, 189), #b02a37)",
                  }}
                >
                  <i className="bi bi-person-badge" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="radius-10 border-start border-0 border-4 border-primary mt-3">
            <Card.Body>
              <div
                className="d-flex align-items-center"
                style={{ height: "110px", overflowY: "auto" }}
              >
                <div className="text-start mt-3">
                  <p className="mb-0 text-secondary"> Supplier MBG</p>
                  <h4
                    className="my-1 fw-bold"
                    style={{ color: "#0d6efd", fontSize: "1.7em" }}
                  >
                    {loading ? "..." : formatAngka(dataSummary?.jumlahsupplier)}
                  </h4>
                  <p>&nbsp;</p>
                </div>
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center ms-auto"
                  style={{
                    width: 50,
                    height: 50,
                    background: "linear-gradient(135deg, #cfe2ff, #0d6efd)",
                  }}
                >
                  <i className="bi bi-truck" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="radius-10 border-start border-0 border-4 border-success mt-3">
            <Card.Body>
              <div
                className="d-flex align-items-center"
                style={{ height: "110px", overflowY: "auto" }}
              >
                <div className="text-start mt-3">
                  <p className="mb-0 text-secondary"> Kelompok Penerima </p>
                  <h4
                    className="my-1 fw-bold"
                    style={{ color: "#146c43", fontSize: "1.7em" }}
                  >
                    {loading ? "..." : formatAngka(dataSummary?.jumlahkelompok)}
                  </h4>
                  <p>&nbsp;</p>
                </div>
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center ms-auto"
                  style={{
                    width: 50,
                    height: 50,
                    background:
                      "linear-gradient(135deg,rgb(177, 226, 203), #146c43)",
                  }}
                >
                  <i className="bi bi-diagram-3" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="radius-10 border-start border-0 border-4 border-warning mt-3">
            <Card.Body>
              <div
                className="d-flex align-items-center"
                style={{ height: "110px", overflowY: "auto" }}
              >
                <div className="text-start mt-3">
                  <p className="mb-0 text-secondary">Total Penerima</p>
                  <h4
                    className="my-1 fw-bold"
                    style={{ color: "#e0a800", fontSize: "1.7em" }}
                  >
                    {loading ? "..." : formatAngka(dataSummary?.jumlahpenerima)}
                  </h4>
                  <p className="text-success">
                    Target:{" "}
                    {target
                      ? numeral(target.potensi_penerima).format("0,0")
                      : "N/A"}{" "}
                    (
                    {target
                      ? numeral(target.persen_potensi).format("0,0")
                      : "N/A"}
                    %)
                  </p>
                </div>
                <div
                  className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center ms-auto"
                  style={{
                    width: 50,
                    height: 50,
                    background:
                      "linear-gradient(135deg,rgb(236, 224, 188), #e0a800)",
                  }}
                >
                  <i className="bi bi-people-fill" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Header;
