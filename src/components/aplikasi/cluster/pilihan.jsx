import React, { useState, useContext, useEffect } from "react";
import { FloatingLabel, Form, Col, Row } from "react-bootstrap";
import MyContext from "../../../auth/Context";

import periode from "../../../data/Kdperiode.json";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const Pilihan = ({ onInputChange }) => {
  const { axiosJWT, username, token } = useContext(MyContext);
  const [selectedcluster, setSelectedcluster] = useState("05");
  const [selectedTA, setSelectedTA] = useState("2024");
  const [selectedperiode, setSelectedperiode] = useState("01");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataRef();
  }, [selectedperiode, selectedTA]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === "cluster") {
      setSelectedcluster(value);
      onInputChange("cluster", value);
    } else if (id === "thang") {
      setSelectedTA(value);
      onInputChange("thang", value);
    } else if (id === "periode") {
      setSelectedperiode(value);
      onInputChange("periode", value);
    } else if (id === "prov") {
      // setSelectedProv(value);
      onInputChange("prov", value);
    }
  };

  const getDataRef = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT kdcluster,nmcluster FROM laporan_2023.ref_cluster`
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

  return (
    <div>
      <Row>
        <Col sm={12} xl={3} md={12} lg={12} className="my-1">
          <FloatingLabel
            controlId="thang"
            label="Pilih TA"
            className="pilihanatas"
          >
            <Form.Select onChange={handleInputChange} value={selectedTA}>
              <option value="2020">TA 2020</option>
              <option value="2021">TA 2021</option>
              <option value="2022">TA 2022</option>
              <option value="2023">TA 2023</option>
              <option value="2024">TA 2024</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col sm={12} xl={4} md={6} lg={12} className="my-1">
          <FloatingLabel
            controlId="periode"
            label="Pilih Periode"
            className="pilihanatas"
          >
            <Form.Select
              className="pilih"
              onChange={handleInputChange}
              value={selectedperiode}
            >
              {/* <option value="0">Semua Periode</option> */}
              {periode.map((kl, index) => (
                <option key={index} value={kl.kdperiode}>
                  {kl.kdperiode} - {kl.nmperiode}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col sm={12} md={6} xl={5} lg={12} className="my-1">
          <FloatingLabel
            controlId="cluster"
            label="Pilih Cluster"
            className="pilihanatas"
          >
            <Form.Select onChange={handleInputChange} value={selectedcluster}>
              {data.map((item) => (
                <option value={item.kdcluster} key={item.kdcluster}>
                  {item.kdcluster} - {item.nmcluster}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Col>
      </Row>
    </div>
  );
};

export default Pilihan;
