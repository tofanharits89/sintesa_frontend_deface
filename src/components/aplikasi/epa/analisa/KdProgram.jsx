import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";

const KdProgramEpa = ({ value, onChange, point, subpoint }) => {
  const { axiosJWT, token, dataEpa } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || ""); // Inisialisasi dari value

  useEffect(() => {
    if (point && subpoint) {
      getData();
    } else {
      setData([]);
      setSelectedValue(""); // Reset pilihan sebelumnya
    }
  }, [point, subpoint]);

  useEffect(() => {
    setSelectedValue(value || ""); // Update selectedValue jika value berubah dari luar
  }, [value]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT DISTINCT kdprogram, nmprogram FROM dbref.t_program_${dataEpa.year} 
       WHERE kddept=${dataEpa.kddept} ORDER BY kdprogram`
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
          <Form.Label className="fw-bold mb-0">Program</Form.Label>
        </Col>
        <Col xs={12} md={9}>
          <Form.Select
            size="md"
            className="text-select w-100"
            value={selectedValue} // Gunakan nilai dari state
            onChange={handleChange}
            disabled={!point || !subpoint || loading}
          >
            <option value="">
              {loading
                ? "Loading data program..."
                : !point || !subpoint
                  ? "Pilih Program"
                  : "Pilih Program"}
            </option>
            {!loading &&
              data.map((pn, index) => (
                <option key={index} value={pn.kdprogram}>
                  {pn.kdprogram} - {pn.nmprogram}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>
    </Form>
  );
};

export default KdProgramEpa;
