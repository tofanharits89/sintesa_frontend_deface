import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { Tab, Nav, Col, Form, Row, Button } from "react-bootstrap";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import { LoadingTable } from "../../layout/LoadingTable";
import { handleHttpError } from "../notifikasi/toastError";

const InfoUmum = (props) => {
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  useEffect(() => {
    props.kdsatker && getData();
  }, [props.kdsatker]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      "SELECT a.thang,a.kdjendok,a.kdsatker,c.kdkppn,b.nmsatker,a.kddept,d.nmdept,g.kdkanwil,a.kdunit,e.nmunit,a.kddekon,a.kdlokasi,c.nmkppn,a.kpa,a.bendahara,a.ppspm,f.nmdekon,g.nmkanwil,a.npwp,a.statusblu,a.email FROM dbdipa25.d_kpa a LEFT JOIN dbref.t_satker_2023 b ON a.kdsatker=b.kdsatker AND a.kddept=b.kddept AND a.kdunit=b.kdunit LEFT JOIN dbref.t_kppn_2023 c ON b.kdkppn=c.kdkppn LEFT JOIN dbref.t_dept_2023 d ON b.kddept=d.kddept LEFT JOIN dbref.t_unit_2023 e ON a.kddept=e.kddept AND b.kdunit=e.kdunit LEFT JOIN dbref.t_dekon_2023 f ON a.kddekon=f.kddekon LEFT JOIN dbref.t_kanwil_2014 g ON c.kdkanwil=g.kdkanwil WHERE a.kdsatker='" +
        props.kdsatker +
        "' GROUP BY a.kdsatker;"
    );
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_CHART
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_CHART
            }${encodedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);

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

  return (
    <>
      {loading ? (
        <LoadingTable />
      ) : (
        <div
          className="tab-pane fade show active profile-overview mt-4 mb-4 fade-in"
          id="profile-overview"
        >
          <Row>
            <Col md={4} lg={3} className="label">
              Nama Satker
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kdsatker)} -{" "}
              {data.map((item) => item.nmsatker)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Email
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.email)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Kementerian
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kddept)} -{" "}
              {data.map((item) => item.nmdept)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Unit Eselon I
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kdunit)} -{" "}
              {data.map((item) => item.nmunit)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Kewenangan
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kddekon)} -{" "}
              {data.map((item) => item.nmdekon)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Kanwil DJPBN
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kdkanwil)} -{" "}
              {data.map((item) => item.nmkanwil)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              KPPN
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kdkppn)} -{" "}
              {data.map((item) => item.nmkppn)}
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col md={4} lg={3} className="label">
              Tahun Anggaran
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.thang)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Kuasa Pengguna Anggaran
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kpa)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Bendahara
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.bendahara)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              PPSPM
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.ppspm)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              NPWP
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.npwp)}
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col md={4} lg={3} className="label">
              Status BLU
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.statusblu)}
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={3} className="label">
              Jenis Dokumen
            </Col>
            <Col md={8} lg={9}>
              {data.map((item) => item.kdjendok)}
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default InfoUmum;
