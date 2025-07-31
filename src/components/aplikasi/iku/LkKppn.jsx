import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Table,
  Form,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import RekamModalKanwil from "./rekamModalKanwil";
import RekamModalKppn from "./rekamModalKppn";

export default function LkKppn() {
  const { role, nmrole, axiosJWT, token, iduser, setUrl, username, kdkppn } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedPeriod, setSelectedPeriod] = useState("I");
  const [datakirim, setDataKirim] = useState([]);

  useEffect(() => {
    getData();
    // console.log(sql);
  }, [selectedYear, selectedPeriod]);

  const handleModal = async (kdkppn, nmkppn, periode) => {
    setShowModal(true);
    setOpen("1");

    setDataKirim([
      {
        kdkppn: kdkppn,
        nmkppn: nmkppn,
        periode: periode,
        thang: selectedYear,
      },
    ]);
  };
  const handleClose = () => {
    setShowModal(false);
    setOpen("");
    getData();
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const getData = async () => {
    setLoading(true);
    let filterKppn = "";
    if (role === "3") {
      filterKppn = `where a.kdkppn = '${kdkppn}' and c.kddept='999'`;
    } else {
      filterKppn = `where  c.kddept='999'`;
    }

    const encodedQuery = encodeURIComponent(`
    SELECT a.kdkppn,a.nmkppn FROM dbref.t_kppn_2024 a LEFT JOIN tkd.iku_lk_kppn b ON a.kdkppn = b.kdkppn   AND b.thang='${selectedYear}' AND b.periode='${selectedPeriod}' GROUP BY a.kdkppn,b.thang,b.periode ORDER BY a.kdkppn`);

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    // console.log(cleanedQuery);
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
    } catch (error) {
      console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };
  // console.log(kdkanwil);
  return (
    <Card>
      <Row>
        <Col>
          <div className="mt-4 mx-4">
            <Form.Label htmlFor="yearSelect">Tahun:</Form.Label>
            <Form.Select
              id="yearSelect"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {/* <option value="">Pilih Tahun</option> */}
              <option value="2023" selected={selectedYear === "2023"}>
                2023
              </option>
              <option value="2024" selected={selectedYear === "2024"}>
                2024
              </option>
            </Form.Select>
          </div>
        </Col>

        <Col>
          <div className="mt-4 mx-4">
            <Form.Label htmlFor="periodSelect">Jenis Laporan:</Form.Label>
            <Form.Select
              id="periodSelect"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              {/* <option value="">Pilih Periode</option> */}
              <option value="I" selected={selectedPeriod === "1"}>
                LK Audited
              </option>
              <option value="II" selected={selectedPeriod === "2"}>
                LK Unaudited
              </option>
            </Form.Select>
          </div>
        </Col>
      </Row>

      <Card.Body className="p-4 mt-2">
        <div className="table-responsive">
          {loading ? (
            <div
              className="text-center"
              style={{ height: "500px", marginTop: "100px" }}
            >
              <Spinner animation="border" role="status">
                <span className="visually-hidden ">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover size="sm" className="text-xsmall">
              <thead className="thead-dark">
                <tr>
                  <th rowSpan="4" style={{ verticalAlign: "middle" }}>
                    No
                  </th>
                  <th rowSpan="4" style={{ verticalAlign: "middle" }}>
                    Tahun
                  </th>
                  <th rowSpan="4" style={{ verticalAlign: "middle" }}>
                    KPPN
                  </th>
                  <th rowSpan="4" style={{ verticalAlign: "middle" }}>
                    Jenis Laporan
                  </th>

                  <th style={{ verticalAlign: "middle" }}>ANALISA</th>
                </tr>
              </thead>
              {/* Tabel body */}
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td> {selectedYear}</td>
                    <td>
                      {row.kdkppn} - {row.nmkppn}
                    </td>
                    <td> {selectedPeriod}</td>

                    <td>
                      <i
                        className="bi bi-check-circle-fill
                text-danger mx-2"
                        onClick={() =>
                          handleModal(row.kdkppn, row.nmkppn, selectedPeriod)
                        }
                        style={{ cursor: "pointer", fontSize: "17px" }}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card.Body>
      {open === "1" && (
        <RekamModalKppn
          show={showModal}
          onHide={handleClose}
          kirim={datakirim}
        />
      )}
    </Card>
  );
}
