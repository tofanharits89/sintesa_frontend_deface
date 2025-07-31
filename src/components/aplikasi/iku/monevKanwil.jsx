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

export default function MonevKanwil() {
  const { role, nmrole, axiosJWT, token, iduser, setUrl, username } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState("");
  const [nmkanwil, setNmkanwil] = useState("");
  const [kdkanwil, setKdkanwil] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedPeriod, setSelectedPeriod] = useState("I");
  const [analisa, setAnalisa] = useState("");
  const [datakirim, setDataKirim] = useState([]);

  useEffect(() => {
    getData();
    // console.log(sql);
  }, [selectedYear, selectedPeriod]);

  const handleModal = async (
    kanwilybs,
    nmkanwil,
    analisa,
    ringkasanx,
    penyusunanx,
    metodex,
    kualitasddx,
    kualitasdfx,
    kualitasbosx,
    kesimpulanx,
    ketx,
    ringkasany,
    penyusunany,
    metodey,
    kualitasddy,
    kualitasdfy,
    kualitasbosy,
    kesimpulany,
    kety
  ) => {
    setShowModal(true);
    setOpen("1");
    setNmkanwil(nmkanwil);
    setAnalisa(analisa);
    setKdkanwil(kanwilybs);
    setDataKirim([
      {
        nmkanwil: nmkanwil,
        kdkanwil: kanwilybs,
        analisa: analisa,
        thang: selectedYear,
        periode: selectedPeriod,
      },
      {
        ringkasan: ringkasanx,
        penyusunan: penyusunanx,
        metode: metodex,
        kualitasdd: kualitasddx,
        kualitasdf: kualitasdfx,
        kualitasbos: kualitasbosx,
        kesimpulan: kesimpulanx,
        ket: ketx,
      },
      {
        ringkasan: ringkasany,
        penyusunan: penyusunany,
        metode: metodey,
        kualitasdd: kualitasddy,
        kualitasdf: kualitasdfy,
        kualitasbos: kualitasbosy,
        kesimpulan: kesimpulany,
        ket: kety,
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
      SELECT 
      a.kdkanwil,
      a.nmkanwil,
      a.kdlokasi,
      b.ringkasan AS ringkasan1,    
      b.penyusunan AS penyusunan1,        
      b.metode AS metode1,
      b.kualitasdd AS kualitasdd1,        
      b.kualitasdf AS kualitasdf1,        
      b.kualitasbos AS kualitasbos1,       
      b.kesimpulan AS kesimpulan1,       
      b.ket AS ket1,
      d.ringkasan AS ringkasan2,    
      d.penyusunan AS penyusunan2,        
      d.metode AS metode2,
      d.kualitasdd AS kualitasdd2,        
      d.kualitasdf AS kualitasdf2,        
      d.kualitasbos AS kualitasbos2,       
      d.kesimpulan AS kesimpulan2,       
      d.ket AS ket2,          
      ROUND((COALESCE(b.hasil, 0) + COALESCE(d.hasil, 0)) / 2, 2) AS total
  FROM 
      dbref.t_kanwil_2014 a
  LEFT JOIN 
      tkd.iku_monev_kanwil_i b ON a.kdkanwil = b.kdkanwil   AND b.thang='${selectedYear}' AND b.periode='${selectedPeriod}'
    
  LEFT JOIN 
      tkd.iku_monev_kanwil_ii d ON a.kdkanwil = d.kdkanwil AND d.thang='${selectedYear}' AND d.periode='${selectedPeriod}'
     
  WHERE 
      a.kdkanwil <> '00'   
  GROUP BY 
  a.kdkanwil,b.thang,d.thang,b.periode,d.periode
  ORDER BY 
      a.kdkanwil
  
    `);

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
            <Form.Label htmlFor="periodSelect">Periode:</Form.Label>
            <Form.Select
              id="periodSelect"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              {/* <option value="">Pilih Periode</option> */}
              <option value="I" selected={selectedPeriod === "I"}>
                Semester I
              </option>
              <option value="II" selected={selectedPeriod === "II"}>
                Semester II
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
                    Periode
                  </th>
                  <th rowSpan="4" style={{ verticalAlign: "middle" }}>
                    Kanwil
                  </th>
                  <th colSpan="4">LAPORAN MONEV</th>
                </tr>
                <tr>
                  {/* <th rowSpan="2" style={{ verticalAlign: "middle" }}>
                    KETEPATAN WAKTU
                  </th> */}
                  <th rowSpan="2" style={{ verticalAlign: "middle" }}>
                    ANALISA I
                  </th>
                  <th rowSpan="2" style={{ verticalAlign: "middle" }}>
                    ANALISA II
                  </th>
                  <th rowSpan="2" style={{ verticalAlign: "middle" }}>
                    RATA-RATA
                  </th>
                </tr>
              </thead>
              {/* Tabel body */}
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td> {selectedYear}</td>
                    <td>Semester {selectedPeriod}</td>
                    <td>
                      {row.kdkanwil} - {row.nmkanwil}
                    </td>
                    {/* <td>null</td> */}
                    <td>
                      {" "}
                      <i
                        className="bi bi-check-circle-fill
                text-primary mx-2"
                        onClick={() =>
                          handleModal(
                            row.kdkanwil,
                            row.nmkanwil,
                            "I",
                            row.ringkasan1,
                            row.penyusunan1,
                            row.metode1,
                            row.kualitasdd1,
                            row.kualitasdf1,
                            row.kualitasbos1,
                            row.kesimpulan1,
                            row.ket1,
                            row.ringkasan2,
                            row.penyusunan2,
                            row.metode2,
                            row.kualitasdd2,
                            row.kualitasdf2,
                            row.kualitasbos2,
                            row.kesimpulan2,
                            row.ket2
                          )
                        }
                        style={{ cursor: "pointer", fontSize: "17px" }}
                      ></i>
                    </td>
                    <td>
                      {" "}
                      <i
                        className="bi bi-check-circle-fill
                text-success mx-2"
                        onClick={() =>
                          handleModal(
                            row.kdkanwil,
                            row.nmkanwil,
                            "II",
                            row.ringkasan1,
                            row.penyusunan1,
                            row.metode1,
                            row.kualitasdd1,
                            row.kualitasdf1,
                            row.kualitasbos1,
                            row.kesimpulan1,
                            row.ket1,
                            row.ringkasan2,
                            row.penyusunan2,
                            row.metode2,
                            row.kualitasdd2,
                            row.kualitasdf2,
                            row.kualitasbos2,
                            row.kesimpulan2,
                            row.ket2
                          )
                        }
                        style={{ cursor: "pointer", fontSize: "17px" }}
                      ></i>
                    </td>
                    <td
                      className="text-info"
                      style={{ fontWeight: "bold", fontSize: "13px" }}
                    >
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Card.Body>
      {open === "1" && (
        <RekamModalKanwil
          show={showModal}
          nmkanwil={nmkanwil}
          kdkanwil={kdkanwil}
          analisa={analisa}
          onHide={handleClose}
          periode={selectedPeriod}
          thang={selectedYear}
          kirim={datakirim}
        />
      )}
    </Card>
  );
}
