import React, { useContext, useState, useEffect } from "react";
import { Col, Row, Card, Image } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";

import { handleHttpError } from "../../notifikasi/toastError";
import ChartDukman from "./../chart/chartdukman";

import ChartTrenBulanan from "./../chart/charttrenbulanan";

import ChartBelanja from "./../chart/charttrenbelanja";
import Sdana from "./../chart/sdana";
import Ikpa from "./../chart/ikpa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ChartUptup from "../chart/chartUptup";

const ExportPDF = ({ thang, cluster, periode, cek, setCek }) => {
  const { axiosJWT, username, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataTren, setDataTren] = useState([]);
  const [dataTemuan, setDataTemuan] = useState([]);
  const [dataOutput, setDataOutput] = useState([]);
  const [dataIkpa, setDataIkpa] = useState([]);
  const [refCluster, setrefCluster] = useState([]);

  const [inputValues, setInputValues] = useState({
    thang: thang,
    periode: periode,
    cluster: cluster,
    user: username,
  });

  const [trenJenbel, setTrenJenbel] = useState([]);
  const [trenDukman, setTrenDukman] = useState([]);
  const [trenBulanan, setTrenBulanan] = useState([]);
  const [trenSdana, setSdana] = useState([]);
  const [trenUptup, setUptup] = useState([]);
  const [loadingpdf, setLoadingpdf] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getDataIsu();
      await getDataTren();
      await getDataTemuan();
      await getDataOutput();
      await getDataIkpa();
      getDataReferensiCluster();
      generatePDF();
    };

    fetchData();
  }, [cek, thang, periode, cluster]);

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

      setLoading(false);
    }
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

  // After merging, modify the isu property to join the array with ', '
  mergedData.forEach((item) => {
    item.isu = item.isu.join(", ");
  });

  const namaoutput = [...new Set(dataOutput.map((item) => item.namaoutput))];

  const generatePDF = () => {
    setLoadingpdf(true);
    const input = document.getElementById("content-to-export");

    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Atur margin kanan dan kiri (dalam milimeter)
      const marginTop = 5;
      const marginBottom = 5;
      const marginLeft = 5;
      const marginRight = 5;

      pdf.addImage(
        imgData,
        "JPEG",
        marginLeft,
        marginTop,
        pdfWidth - marginLeft - marginRight,
        pdfHeight - marginTop - marginBottom,

        (canvas.height * pdfWidth) / canvas.width
      );
      pdf.save(`CLUSTER_KL_${thang}_${cluster}_${periode}.pdf`);
    });
    setLoadingpdf(false);
    setCek(false);
  };

  return (
    <div>
      <div id="content-to-export" style={{ border: "0" }}>
        <Row>
          <Col xs={9} md={9} lg={9} xl={9}>
            <Row>
              <Col xs={10} md={10} lg={10} xl={10}>
                <div className="header-kinerja-tes" onClick={handleShow}>
                  {inputValues && (
                    <>
                      <div className="text-center fw-bold">
                        Isu Spesifik Pelaksanaan Anggaran{" "}
                        {inputValues.thang - 4} - {inputValues.thang}
                      </div>

                      {data.length > 0 ? (
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
                      ) : (
                        <div className="text-dark">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Nullam fermentum diam non mi sagittis, id
                          vestibulum tortor lobortis. Vivamus facilisis elit in
                          mi facilisis malesuada. Maecenas sollicitudin
                          convallis sapien, a pulvinar purus vulputate vel.
                          Pellentesque habitant morbi tristique senectus et
                          netus et malesuada fames ac turpis egestas. Nulla non
                          faucibus nulla. Aliquam vel nunc vel libero pharetra
                          fermentum eu a ipsum. Fusce a lectus vel sapien
                          lacinia convallis eu in turpis. Suspendisse potenti.
                          Nullam in semper ex. Nam suscipit risus id enim
                          tempor, at tristique lectus consectetur.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={4} md={4} lg={4} xl={4}>
                <Card className="card-kinerja" id="content-to-export">
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
              <Col xs={8} md={8} lg={8} xl={8}>
                <Card className="card-kinerja" id="content-to-export">
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
              <Col xs={4} md={4} lg={4} xl={4}>
                <Card className="card-kinerja-ikpa-cluster">
                  <Card.Body>
                    <span>
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
              <Col xs={8} md={8} lg={8} xl={8}>
                <Card className="card-kinerja-ikpa-cluster">
                  <Card.Body>
                    <span>
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
                  <Card.Body>
                    <div className="d-flex justify-content-center header-kinerja">
                      Temuan BPK{" "}
                    </div>
                    <div style={{ width: "100%" }}>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Temuan BPK</th>
                            <th className="text-center">Nilai </th>
                            <th className="text-center">Tindak Lanjut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mergedData.map((item, index) => (
                            <tr key={index} className=" m-0 p-0">
                              <td> {index + 1}</td>
                              <td
                                style={{
                                  whiteSpace: "wrap",
                                  textAlign: "left",
                                }}
                              >
                                {item.temuan}
                              </td>
                              <td style={{ whiteSpace: "wrap" }}>
                                {item.nilai}
                              </td>
                              <td
                                style={{
                                  whiteSpace: "wrap",
                                  textAlign: "left",
                                }}
                              >
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
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xs={3} md={3} lg={3} xl={3}>
            <Card className="card-output1">
              <Card.Body>
                <div
                  className=" d-flex justify-content-center my-3 header-kinerja-kanan text-center"
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  Output Utama Belanja K/L
                </div>

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
                      filteredData.length > 0 ? filteredData[0].catatan : "";

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
                            margin: "10px",
                          }}
                        >
                          {catatan !== ""
                            ? catatan
                            : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum diam non mi sagittis"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>

            <Row>
              <Col xs={12} md={12} lg={12} xl={12}>
                <Card>
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
                <Card className="card-tren-kanan1">
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
      </div>
    </div>
  );
};

export default ExportPDF;
