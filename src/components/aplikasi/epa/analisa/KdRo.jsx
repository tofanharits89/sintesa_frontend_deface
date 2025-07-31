import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";

const KdRoEpa = ({ value, kdprogram, point, subpoint, onChange }) => {
  const { axiosJWT, token, dataEpa } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || ""); // Inisialisasi dari value

  useEffect(() => {
    if (kdprogram && point && subpoint) {
      getData();
    } else {
      setSelectedValue("");
      setData([]);
    }
  }, [kdprogram, point, subpoint]);

  useEffect(() => {
    setSelectedValue(value || ""); // Update selectedValue jika value berubah dari luar
  }, [value]);

  const getData = async () => {
    setLoading(true);
    const yearTwoDigits = dataEpa.year.toString().slice(-2);

    const encodedQuery = encodeURIComponent(
      `SELECT DISTINCT kdprogram, kdgiat, kdoutput, kdsoutput, ursoutput 
      FROM dbref.dipa_soutput_${yearTwoDigits} 
      WHERE kddept=${dataEpa.kddept} AND kdprogram='${kdprogram}' 
      ORDER BY kdsoutput`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA}${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
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

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Form>
      <Row className="align-items-center">
        <Col xs={12} md={3} className="text-md-start">
          <Form.Label className="fw-bold mb-0">Rincian Output</Form.Label>
        </Col>
        <Col xs={12} md={9}>
          <Form.Select
            size="md"
            className="text-select w-100"
            value={selectedValue} // Gunakan nilai dari state
            onChange={handleChange}
            disabled={!kdprogram || !point || !subpoint || loading}
          >
            <option value="">
              {loading
                ? "Loading data RO ..."
                : !kdprogram || !point || !subpoint
                  ? "Pilih Rincian Output"
                  : "Pilih Rincian Output"}
            </option>
            {!loading &&
              data.map((ro, index) => (
                <option
                  key={index}
                  value={`${ro.kdprogram}.${ro.kdgiat}.${ro.kdoutput}.${ro.kdsoutput}`}
                >
                  {`${ro.kdprogram}.${ro.kdgiat}.${ro.kdoutput}.${ro.kdsoutput}`}{" "}
                  - {ro.ursoutput}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>
    </Form>
  );
};

export default KdRoEpa;
