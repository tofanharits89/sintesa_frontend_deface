import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Col,
  Row,
  Card,
  Button,
  Image,
  CardBody,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import "../cluster/kinerja.css";
import Isu from "./isu";
import Tren from "./tren";
import Temuan from "./temuan";
import Pilihan from "./pilihan";
import { handleHttpError } from "../notifikasi/toastError";
import ChartDukman from "./chart/chartdukman";

import ChartTrenBulanan from "./chart/charttrenbulanan";
import { LoadingTable } from "../../layout/LoadingTable";
import OutputUtama from "./outpututama";
import ChartBelanja from "./chart/charttrenbelanja";
import Sdana from "./chart/sdana";
import Ikpa from "./chart/ikpa";
import IkpaForm from "./ikpaForm";
import ExportPDF from "./pdf/exportpdf";
import ChartUptup from "./chart/chartUptup";

const LandingKinerjaCluster = () => {
  const { axiosJWT, username, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataTren, setDataTren] = useState([]);
  const [dataTemuan, setDataTemuan] = useState([]);
  const [dataOutput, setDataOutput] = useState([]);
  const [dataIkpa, setDataIkpa] = useState([]);
  const [refCluster, setrefCluster] = useState([]);

  const [cek, setCek] = useState(false);
  const [cek2, setCek2] = useState(false);
  const [show, setShow] = useState(false);
  const [showTren, setShowTren] = useState(false);
  const [showTemuan, setShowTemuan] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showIkpa, setShowIkpa] = useState(false);

  const handleShowTemuan = () => setShowTemuan(true);
  const handleShowTren = () => setShowTren(true);
  const handleShowOutput = () => setShowOutput(true);
  const handleShowIkpa = () => setShowIkpa(true);

  const [inputValues, setInputValues] = useState({
    thang: "2024",
    periode: "01",
    cluster: "05",
    user: username,
  });

  const [trenJenbel, setTrenJenbel] = useState([]);
  const [trenDukman, setTrenDukman] = useState([]);
  const [trenBulanan, setTrenBulanan] = useState([]);
  const [trenSdana, setSdana] = useState([]);
  const [trenUptup, setUptup] = useState([]);

  useEffect(() => {
    const separateData = () => {
      const jenbel = dataTren.filter((item) => item.tabel === "tren_jenbel");
      const dukman = dataTren.filter((item) => item.tabel === "tren_dukman");
      const bulanan = dataTren.filter((item) => item.tabel === "tren_bulanan");
      const sdana = dataTren.filter((item) => item.tabel === "tren_sdana");
      const uptup = dataTren.filter((item) => item.tabel === "tren_uptup");
      setTrenJenbel(jenbel);
      setTrenDukman(dukman);
      setTrenBulanan(bulanan);
      setSdana(sdana);
      setUptup(uptup);
      getDataReferensiCluster();
    };

    separateData();
  }, [dataTren]);

  useEffect(() => {
    getDataIsu();
    getDataTren();
    getDataTemuan();
    getDataOutput();
    getDataIkpa();
  }, [inputValues]);

  const handleInputChange = (id, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  // console.log(inputValues);

  const getDataReferensiCluster = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT kddept FROM laporan_2023.ref_cluster_kl WHERE kdcluster='${inputValues.cluster}'`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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
      // setrefCluster(response.data.result);
      setrefCluster(
        "(" +
          response.data.result.map((obj) => `'${obj.kddept}'`).join(",") +
          ")"
      );
      //console.log(refCluster);
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

  const getDataIsu = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.thang,a.kdcluster,b.nmcluster,a.periode,a.username,a.isu,a.createdAt 
      FROM laporan_2023.isu_cluster a LEFT JOIN laporan_2023.ref_cluster b 
      ON a.kdcluster=b.kdcluster 
      WHERE a.thang='${inputValues.thang}' AND a.kdcluster='${inputValues.cluster}' AND a.periode='${inputValues.periode}'
`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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

  const getDataTren = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT 'tren_dukman' AS tabel, thang, kdcluster, periode, username, isu, createdAt, updatedAt
      FROM laporan_2023.tren_dukman_cluster WHERE thang='${inputValues.thang}' AND kdcluster='${inputValues.cluster}' AND periode='${inputValues.periode}'
      UNION ALL
      SELECT 'tren_jenbel' AS tabel, thang, kdcluster, periode, username, isu, createdAt, updatedAt
      FROM laporan_2023.tren_jenbel_cluster WHERE thang='${inputValues.thang}' AND kdcluster='${inputValues.cluster}' AND periode='${inputValues.periode}' 
      UNION ALL
      SELECT 'tren_bulanan' AS tabel, thang, kdcluster, periode, username, isu, createdAt, updatedAt
      FROM laporan_2023.tren_bulanan_cluster WHERE thang='${inputValues.thang}' AND kdcluster='${inputValues.cluster}' AND periode='${inputValues.periode}'  
      UNION ALL
      SELECT 'tren_sdana' AS tabel, thang, kdcluster, periode, username, isu, createdAt, updatedAt
      FROM laporan_2023.tren_sdana_cluster WHERE thang='${inputValues.thang}' AND kdcluster='${inputValues.cluster}' AND periode='${inputValues.periode}'  
      UNION ALL
      SELECT 'tren_uptup' AS tabel, thang, kdcluster, periode, username, isu, createdAt, updatedAt
      FROM laporan_2023.tren_uptup_cluster WHERE thang='${inputValues.thang}' AND kdcluster='${inputValues.cluster}' AND periode='${inputValues.periode}'      
     
      `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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
      setDataTren(response.data.result);

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

  const getDataOutput = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT b.id as idedit,a.username, a.createdAt,a.id_output,a.thang,a.kdcluster,a.periode,a.namaoutput,a.catatan,b.tahun,b.pagu,b.realisasi,b.persen FROM laporan_2023.output_cluster a
      LEFT JOIN laporan_2023.output_detail_cluster b ON a.id_output=b.id_output WHERE a.thang='${inputValues.thang}' AND a.kdcluster='${inputValues.cluster}' AND a.periode='${inputValues.periode}'
      `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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
      setDataOutput(response.data.result);
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

  const getDataTemuan = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `  SELECT a.id_temuan, a.id idtemuan, b.id iddetailtemuan, a.isu temuan,a.nilai,b.isu,a.id_temuan,a.username,a.createdAt FROM laporan_2023.temuan_bpk_cluster a
      LEFT JOIN laporan_2023.temuan_bpk_detail_cluster b ON a.id_temuan=b.id_temuan WHERE a.thang='${inputValues.thang}' AND a.kdcluster='${inputValues.cluster}' AND a.periode='${inputValues.periode}'
      `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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
      setDataTemuan(response.data.result);
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

  const getDataIkpa = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.thang,a.kdcluster,a.periode,a.username,a.nilaiikpa,a.createdAt from laporan_2023.tren_ikpa_cluster a
      WHERE  a.kdcluster='${inputValues.cluster}' AND a.periode='${inputValues.periode}' order by a.thang
      `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

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
      setDataIkpa(response.data.result);
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

  const handleClose = () => {
    setShow(false);
    getDataIsu();
  };
  const handleCloseTren = () => {
    setShowTren(false);
    getDataTren();
  };
  const handleCloseTemuan = () => {
    setShowTemuan(false);
    setDataTemuan([]);
    getDataTemuan();
  };

  const handleCloseOutput = () => {
    setShowOutput(false);
    setDataOutput([]);
    getDataOutput();
  };

  const handleCloseIkpa = () => {
    setShowIkpa(false);
    setDataIkpa([]);
    getDataIkpa();
  };
  const handleShow = () => setShow(true);

  const mergedData = dataTemuan.reduce((acc, curr) => {
    const existingItem = acc.find((item) => item.id_temuan === curr.id_temuan);
    if (existingItem) {
      existingItem.isu.push(curr.isu); // Push each isu value into an array
    } else {
      acc.push({ ...curr, isu: [curr.isu] }); // Create an array for isu values
    }
    return acc;
  }, []);

  mergedData.forEach((item) => {
    item.isu = item.isu.join(", ");
  });

  const updateReload = (load) => {
    getDataTemuan();
    getDataOutput();
    getDataIkpa();
  };
  const namaoutput = [...new Set(dataOutput.map((item) => item.namaoutput))];

  const generatePDF = () => {
    setCek(true);
  };
  const generatePPT = () => {
    setCek2(true);
  };
  //console.log(cek);
  return (
    <>
      <main
        id="main"
        className="main fade-in"
        style={{
          height: "100%",
          background: "linear-gradient(#F5FAFA,#Ffffff)",
          border: "0",
        }}
      >
        {cek ? (
          <Button variant="primary" size="sm" className="my-2" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            &nbsp; &nbsp; Loading...
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => generatePDF()}
            className="my-2"
          >
            Download PDF
          </Button>
        )}

        <div
          className="sticky-headerx is-stickyx"
          style={{ borderRadius: "10px" }}
        >
          <div>
            <Pilihan onInputChange={handleInputChange} />
          </div>
        </div>

        <section className={`section kinerja `}>
          <Row>
            <Col xs={12} md={9} lg={9} xl={9}>
              <div
                className="d-flex mt-2"
                style={{
                  //height: "100vh", // Menyesuaikan tinggi latar belakang
                  background: `
                  linear-gradient(#ffffff, #ffffff) 0% 0% / 100% 50% no-repeat,
                  linear-gradient(white, white) 0% 100% / 100% 50% no-repeat
                `,
                  border: "2px solid #A6E7FF",
                  borderRadius: "5px",
                }}
              >
                <Col xs={12} md={12} lg={12} xl={12}>
                  <div className="header-kinerja-tes" onClick={handleShow}>
                    {inputValues && (
                      <>
                        <div className="text-center fw-bold">
                          Isu Spesifik Pelaksanaan Anggaran{" "}
                          {inputValues.thang - 4} - {inputValues.thang}
                        </div>
                        {data.length > 0 ? (
                          <div>
                            <ol className="list-group-numbered mt-2">
                              {data.map((item, index) => (
                                <li key={item.id} className="d-flex 0">
                                  <div className="me-2">
                                    <span className="badge bg-danger rounded-pill">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div className="flex-fill text-dark">
                                    {item.isu}
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ) : (
                          <div className="text-dark">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nullam fermentum diam non mi sagittis, id
                            vestibulum tortor lobortis. Vivamus facilisis elit
                            in mi facilisis malesuada. Maecenas sollicitudin
                            convallis sapien, a pulvinar purus vulputate vel.
                            Pellentesque habitant morbi tristique senectus et
                            netus et malesuada fames ac turpis egestas. Nulla
                            non faucibus nulla. Aliquam vel nunc vel libero
                            pharetra fermentum eu a ipsum. Fusce a lectus vel
                            sapien lacinia convallis eu in turpis. Suspendisse
                            potenti. Nullam in semper ex. Nam suscipit risus id
                            enim tempor, at tristique lectus consectetur.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Col>
              </div>

              <Row>
                <Col xs={12} md={4} lg={4} xl={4}>
                  <Card
                    className="card-kinerja-cluster"
                    onClick={handleShowTren}
                  >
                    <Card.Body>
                      <ChartDukman
                        thang={inputValues.thang}
                        periode={inputValues.periode}
                        cluster={inputValues.cluster}
                        prov={inputValues.prov}
                        datadukman={
                          trenDukman.length > 0
                            ? trenDukman[0].isu
                            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis, 
                        id vestibulum tortor lobortis. Vivamus facilisis elit in mi facilisis malesuada.`
                        }
                        refCluster={refCluster}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={8} lg={8} xl={8}>
                  <Card
                    className="card-kinerja-cluster"
                    onClick={handleShowTren}
                  >
                    <Card.Body>
                      <ChartBelanja
                        thang={inputValues.thang}
                        periode={inputValues.periode}
                        cluster={inputValues.cluster}
                        prov={inputValues.prov}
                        datajenbel={
                          trenJenbel.length > 0
                            ? trenJenbel[0].isu
                            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis, 
                        id vestibulum tortor lobortis. Vivamus facilisis elit in mi facilisis malesuada.`
                        }
                        refCluster={refCluster}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4} lg={4} xl={4}>
                  <Card className="card-kinerja-ikpa-cluster">
                    <Card.Body>
                      <span onClick={handleShowIkpa}>
                        <Ikpa
                          thang={inputValues.thang}
                          periode={inputValues.periode}
                          cluster={inputValues.cluster}
                          prov={inputValues.prov}
                          dataikpa={
                            dataIkpa.length > 0
                              ? dataIkpa
                              : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis, 
                          id vestibulum tortor lobortis. Vivamus facilisis elit in mi facilisis malesuada.`
                          }
                          refCluster={refCluster}
                        />
                      </span>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={8} lg={8} xl={8}>
                  <Card className="card-kinerja-ikpa-cluster">
                    <Card.Body>
                      <span onClick={handleShowTren}>
                        <Sdana
                          thang={inputValues.thang}
                          periode={inputValues.periode}
                          cluster={inputValues.cluster}
                          prov={inputValues.prov}
                          datasdana={trenSdana.length > 0 && trenSdana[0].isu}
                          refCluster={refCluster}
                        />
                      </span>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Card>
                    <Card.Body
                      className="my-3 mt-2"
                      style={{
                        width: "100%",
                        height: "400px",
                        overflow: "scroll",
                      }}
                    >
                      {loading ? (
                        <>
                          <LoadingTable />
                        </>
                      ) : (
                        <>
                          {" "}
                          <div className="header-kinerja-cluster d-flex justify-content-center">
                            Temuan BPK{" "}
                            <i
                              className="bi bi-plus-square-fill mx-4"
                              style={{ cursor: "pointer" }}
                              onClick={handleShowTemuan}
                            ></i>
                          </div>
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Temuan BPK</th>
                                <th>Nilai </th>
                                <th>Tindak Lanjut</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mergedData.map((item, index) => (
                                <tr key={index} className=" m-0 p-0">
                                  <td> {index + 1}</td>
                                  <td>{item.temuan}</td>
                                  <td>{item.nilai}</td>
                                  <td className="isu-temuan">
                                    <ol>
                                      {item.isu
                                        .split(", ")
                                        .map((isuItem, isuIndex) => (
                                          <li
                                            key={isuIndex}
                                            className="" // Adjust padding and margin here
                                          >
                                            {" "}
                                            {isuItem}
                                          </li>
                                        ))}
                                    </ol>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={3} lg={3} xl={3}>
              <Card className="card-output1 mt-2">
                <Card.Body>
                  <div className="header-kinerja-kanan-cluster d-flex justify-content-between">
                    Output Utama Belanja K/L
                    <i
                      className="bi bi-plus-square-fill"
                      style={{ cursor: "pointer" }}
                      onClick={handleShowOutput}
                    ></i>
                  </div>
                  {loading ? (
                    <>
                      <LoadingTable />
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      {namaoutput.map((output, index) => {
                        const filteredData = dataOutput.filter(
                          (item) => item.namaoutput === output
                        );
                        const catatan =
                          filteredData.length > 0
                            ? filteredData[0].catatan
                            : "";

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginBottom: "10px",
                              width: "100%",
                            }}
                          >
                            <h6
                              className="mt-0 text-center"
                              style={{ fontWeight: "bold" }}
                            >
                              {output !== ""
                                ? output
                                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis"}
                            </h6>

                            <table className="custom-table">
                              <thead>
                                <tr>
                                  <th>Tahun</th>
                                  <th>Pagu</th>
                                  <th>Realisasi</th>
                                  <th>Persen</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredData.map((item, subIndex) => (
                                  <tr key={`${index}-${subIndex}`}>
                                    <td>{item.tahun}</td>
                                    <td>{item.pagu}</td>
                                    <td>{item.realisasi}</td>
                                    <td>{item.persen}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div
                              style={{
                                fontSize: "13px",
                                textAlign: "justify",
                                margin: "5px",
                              }}
                            >
                              {catatan
                                ? catatan
                                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Card className="card-tren-kanan1" onClick={handleShowTren}>
                    <Card.Body>
                      <ChartTrenBulanan
                        thang={inputValues.thang}
                        periode={inputValues.periode}
                        cluster={inputValues.cluster}
                        prov={inputValues.prov}
                        databulanan={
                          trenBulanan.length > 0
                            ? trenBulanan[0].isu
                            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis, 
                          id vestibulum tortor lobortis. Vivamus facilisis elit in mi facilisis malesuada.`
                        }
                        refCluster={refCluster}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Card onClick={handleShowTren}>
                    <Card.Body>
                      <ChartUptup
                        thang={inputValues.thang}
                        periode={inputValues.periode}
                        cluster={inputValues.cluster}
                        prov={inputValues.prov}
                        datauptup={
                          trenUptup.length > 0
                            ? trenUptup[0].isu
                            : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis, 
                          id vestibulum tortor lobortis. Vivamus facilisis elit in mi facilisis malesuada.`
                        }
                        refCluster={refCluster}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Isu
            show={show}
            data={inputValues}
            isi={data}
            handleClose={handleClose}
          />
          <Tren
            show={showTren}
            data={inputValues}
            isi={dataTren}
            handleClose={handleCloseTren}
          />
          <Temuan
            updateReload={updateReload}
            show={showTemuan}
            data={inputValues}
            isi={dataTemuan}
            handleClose={handleCloseTemuan}
          />
          <OutputUtama
            updateReload={updateReload}
            show={showOutput}
            data={inputValues}
            isi={dataOutput}
            handleClose={handleCloseOutput}
          />
          <IkpaForm
            updateReload={updateReload}
            show={showIkpa}
            data={inputValues}
            isi={dataIkpa}
            handleClose={handleCloseIkpa}
          />
        </section>
      </main>

      {cek && (
        <ExportPDF
          thang={inputValues.thang}
          cluster={inputValues.cluster}
          periode={inputValues.periode}
          cek={cek}
          setCek={setCek}
        />
      )}
      {cek2 && (
        <ExportPPT
          thang={inputValues.thang}
          cluster={inputValues.cluster}
          periode={inputValues.periode}
          cek2={cek2}
          setCek2={setCek2}
        />
      )}
    </>
  );
};

export default LandingKinerjaCluster;
