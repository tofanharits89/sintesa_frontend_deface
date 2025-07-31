import React, { useContext, useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Encrypt from "../../../../auth/Random";
import MyContext from "../../../../auth/Context";

const SubPoint = ({ value, onChange, point }) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || ""); // Inisialisasi dengan value dari props

  useEffect(() => {
    if (point) {
      getData();
    } else {
      setData([]); // Reset data jika point kosong
      setSelectedValue(""); // Reset pilihan yang sudah dipilih sebelumnya
    }
  }, [point]);

  useEffect(() => {
    setSelectedValue(value || ""); // Update selectedValue jika value dari props berubah
  }, [value]);

  const getData = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `SELECT kdsubpoint, nmsubpoint FROM epa25.ref_subpoint WHERE kdpoint=${point} ORDER BY kdsubpoint`
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
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          <Form.Label className="fw-bold mb-0">Sub Point</Form.Label>
        </Col>
        <Col xs={12} md={9}>
          <Form.Select
            size="md"
            className="text-select w-100"
            value={selectedValue} // Gunakan selectedValue dari state
            onChange={handleChange}
            disabled={!point || loading}
          >
            <option value="">
              {loading
                ? "Loading..."
                : !point
                  ? "Pilih Jenis Sub Point"
                  : "Pilih Jenis Sub Point"}
            </option>
            {!loading &&
              point &&
              data.map((item) => (
                <option key={item.kdsubpoint} value={item.kdsubpoint}>
                  {item.nmsubpoint}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>
    </Form>
  );
};

export default SubPoint;
