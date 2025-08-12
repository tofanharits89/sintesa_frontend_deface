import React, { useState } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Table,
  InputGroup,
} from "react-bootstrap";

const DatePickerStyled = ({
  label,
  value,
  onChange,
  icon = "bi-calendar-event",
}) => (
  <Form.Group>
    <Form.Label className="fw-semibold text-muted mb-2">
      <i className={`bi ${icon} me-2 text-primary`}></i>
      {label}
    </Form.Label>
    <InputGroup className="date-input-group">
      <InputGroup.Text className="bg-light border-end-0">
        <i className="bi bi-calendar3 text-primary"></i>
      </InputGroup.Text>
      <Form.Control
        type="date"
        value={value}
        onChange={onChange}
        className="border-start-0 ps-0"
        style={{
          fontSize: "0.95rem",
          padding: "0.5rem",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border: "1px solid #dee2e6",
          borderRadius: "0 0.375rem 0.375rem 0",
        }}
      />
    </InputGroup>
    <style>{`
      .date-input-group .form-control:focus {
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        border-color: #86b7fe;
      }
      .date-input-group .input-group-text {
        border-radius: 0.375rem 0 0 0.375rem;
      }
    `}</style>
  </Form.Group>
);

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center py-4">
    <Spinner animation="border" variant="primary" />
    <span className="ms-2">Memuat data...</span>
  </div>
);

const TarikDataBGN = () => {
  const [tglAwal, setTglAwal] = useState("");
  const [tglAkhir, setTglAkhir] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleTarikData = async () => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const apiUrl =
        import.meta.env.VITE_REACT_APP_TARIK_BGN || "/realisasi-bgn";
      const params = new URLSearchParams({ tglAwal, tglAkhir });
      // Pakai endpoint default jika env tidak di-set
      const res = await fetch(
        apiUrl.includes("realisasi-bgn")
          ? `${apiUrl}?${params.toString()}`
          : `/realisasi-bgn?${params.toString()}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-calendar-data me-2"></i>
            Tarik Data Realisasi BGN
          </h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="g-4 align-items-end">
              <Col md={4}>
                <DatePickerStyled
                  label="Tanggal Awal SP2D"
                  value={tglAwal}
                  onChange={(e) => setTglAwal(e.target.value)}
                  icon="bi-calendar-check"
                />
              </Col>
              <Col md={4}>
                <DatePickerStyled
                  label="Tanggal Akhir SP2D"
                  value={tglAkhir}
                  onChange={(e) => setTglAkhir(e.target.value)}
                  icon="bi-calendar-x"
                />
              </Col>
              <Col md={4}>
                <Button
                  variant="success"
                  onClick={handleTarikData}
                  disabled={loading || !tglAwal || !tglAkhir}
                  className="w-100"
                  size="sm"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i>
                      Tarik Data
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>

          {loading && <LoadingSpinner />}

          {error && (
            <Alert variant="danger" className="mt-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {data && (
            <Card className="mt-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">
                  <i className="bi bi-table me-2"></i>
                  Hasil Data ({Array.isArray(data) ? data.length : 0} record)
                </h6>
              </Card.Header>
              <Card.Body className="p-0">
                <div
                  className="table-responsive"
                  style={{ maxHeight: "400px" }}
                >
                  <Table striped hover size="sm" className="mb-0">
                    <thead className="table-dark sticky-top">
                      <tr>
                        <th>No</th>
                        {data &&
                          data.length > 0 &&
                          Object.keys(data[0]).map((key, index) => (
                            <th key={index}>{key.toUpperCase()}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(data) &&
                        data.map((row, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            {Object.values(row).map((value, colIndex) => (
                              <td key={colIndex}>{value || "-"}</td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TarikDataBGN;
