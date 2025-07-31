import React, { useEffect, useContext, useState } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { Card, Container, ListGroup, Form, FormControl } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loading1 } from "../../layout/LoadingTable";
import { handleHttpError } from "../notifikasi/toastError";
import RekamAlokasi from "./rekamAlokasi";
import Swal from "sweetalert2";
import "../spending/spending.css";

export default function LandingSpending({ darkMode }) {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showAlokasi, setShowAlokasi] = useState(false);
  const [selectedSatker, setSelectedSatker] = useState({
    nmsatker: "",
    kdsatker: "",
    flag: "",
  });

  // Deadline berdasarkan role
  const isAfterDeadline =
    role === "2"
      ? new Date() > new Date("2025-07-07T23:59:59")
      : new Date() > new Date("2025-07-08T23:59:59");

  // Limit akses query berdasarkan role
  let limitakses = "";
  if ((role === "1" || role === "0") && kdkanwil !== "11") {
    limitakses = " and a.kddekon='1' and b.kdkanwil='11'";
  } else if (role === "X") {
    limitakses = " ";
  } else if (role === "2" && kdkanwil !== "11") {
    limitakses = ` and b.kdkanwil='${kdkanwil}'`;
  } else if (role === "2" && kdkanwil === "11") {
    limitakses = " and a.kddekon<>'1' and b.kdkanwil='11'";
  }

  useEffect(() => {
    getData().then(() => setInitialLoading(false));
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    setPage(1);
    setData([]);
    setOffset(0);
    if (input.length >= 3) {
      setInitialLoading(true);
      getData().then(() => setInitialLoading(false));
    } else {
      setHasMoreData(true);
    }
  };

  const getData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const currentOffset = searchTerm.length >= 1 ? 0 : offset;
      const query = `
        SELECT a.kdsatker, a.kddept, a.kdunit, a.kddekon as dekon, a.nmsatker, a.status as flag
        FROM spending_review.ref_satker_dipa_2025 a
        LEFT JOIN dbref.t_kppn_2025 b ON a.kdkppn = b.kdkppn
        LEFT JOIN dbref.t_dept_2025 d ON a.kddept = d.kddept
        WHERE (a.nmsatker LIKE '%${searchTerm}%' OR a.kdsatker LIKE '%${searchTerm}%' OR d.nmdept LIKE '%${searchTerm}%')
        ${limitakses}
        GROUP BY a.kdsatker
        ORDER BY a.kddept, a.kdsatker DESC
        LIMIT 30 OFFSET ${currentOffset}`;

      const cleanedQuery = query
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const encodedQuery = Encrypt(cleanedQuery);

      const res = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
        }${encodedQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newData = res.data.result || [];
      setData((prev) => [...prev, ...newData]);
      setOffset((prev) => prev + newData.length);
      setHasMoreData(newData.length > 0);
    } catch (error) {
      console.log(error);

      handleHttpError(
        error.response?.status,
        error.response?.data?.error ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShowAlokasi = (nmsatker, kdsatker, flag) => () => {
    if (isAfterDeadline) {
      Swal.fire({
        icon: "info",
        title: "Periode Rekaman Spending Review",
        text:
          role === "2"
            ? " Perekaman Spending Review untuk Kanwil telah ditutup pada 7 Juli 2025 Pukul 23.59."
            : " Perekaman Spending Review untuk Pusat telah ditutup pada 8 Juli 2025 Pukul 23.59.",
      });
      return;
    }
    setShowAlokasi(true);
    setSelectedSatker({ nmsatker, kdsatker, flag });
  };

  const handleCloseAlokasi = () => setShowAlokasi(false);

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Spending Review</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Form</a>
            </li>
            <li className="breadcrumb-item active">Review Alokasi</li>
          </ol>
        </nav>
      </div>

      {/* ALERT KHUSUS PER ROLE */}
      <Container fluid>
        {role === "2" ? (
          <div className="alert alert-warning text-center mt-2" role="alert">
            <strong>Informasi : </strong> Perekaman Spending Review untuk{" "}
            <b>Kanwil</b> ditutup pada <b>7 Juli 2025 pukul 23.59</b>.
          </div>
        ) : (
          <div className="alert alert-warning text-center mt-2" role="alert">
            <strong>Informasi : </strong> Perekaman Spending Review untuk{" "}
            <b>Pusat</b> ditutup pada <b>8 Juli 2025 pukul 23.59</b>.
          </div>
        )}
      </Container>

      <section className="section profile fade-in">
        <Container fluid>
          <Card>
            <Card.Body className="p-4">
              <Form className="mb-3">
                <FormControl
                  type="text"
                  placeholder="Cari kode satker, nama satker, atau nama kementerian..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  style={{ borderColor: "#32A6F9" }}
                />
              </Form>

              {initialLoading ? (
                <div className="text-center my-2">
                  <Loading1 />
                </div>
              ) : data.length > 0 ? (
                <InfiniteScroll
                  dataLength={data.length}
                  next={getData}
                  hasMore={hasMoreData}
                  loader={loading && <Loading1 />}
                >
                  <ListGroup variant="flush" className="custom-list-group">
                    {data.map((spending, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-start"
                      >
                        <div
                          className="ms-0 me-auto"
                          onClick={handleShowAlokasi(
                            spending.nmsatker,
                            spending.kdsatker,
                            spending.flag
                          )}
                        >
                          {spending.nmsatker} ({spending.kddept}.
                          {spending.kdunit}.{spending.kdsatker}-{spending.dekon}
                          ){" "}
                          {spending.flag === "true" && (
                            <i className="bi bi-check2-all text-bold text-success"></i>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </InfiniteScroll>
              ) : (
                <div className="text-center">Tidak Ada Data</div>
              )}
            </Card.Body>
          </Card>
        </Container>

        {showAlokasi && (
          <RekamAlokasi
            show={showAlokasi}
            darkMode={darkMode}
            kdsatker={selectedSatker.kdsatker}
            nmsatker={selectedSatker.nmsatker}
            handleClose={handleCloseAlokasi}
          />
        )}
      </section>
    </main>
  );
}
