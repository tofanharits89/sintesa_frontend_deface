import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Badge,
} from "react-bootstrap";

// Konstanta untuk konfigurasi
const TABLE_CONFIG = {
  HEIGHT: "400px",
  ANIMATION_DELAY: 0.2,
  ANIMATION_DURATION: 0.6,
};

const ProgramNew = ({ data = [], periode, kdkanwil, kdkppn }) => {
  // console.log("ProgramNew received data:", data);

  // Hitung total sum dan persentase
  const totalPagu2024 = data.reduce(
    (sum, item) => sum + (Number(item.pagu2024) || 0),
    0
  );
  const totalReal2024 = data.reduce(
    (sum, item) => sum + (Number(item.real2024) || 0),
    0
  );
  const totalPagu2025 = data.reduce(
    (sum, item) => sum + (Number(item.pagu2025) || 0),
    0
  );
  const totalReal2025 = data.reduce(
    (sum, item) => sum + (Number(item.real2025) || 0),
    0
  );
  const totalBlokir = data.reduce(
    (sum, item) => sum + (Number(item.blokir) || 0),
    0
  );
  const totalGrowth = data.reduce(
    (sum, item) => sum + (Number(item.growth_yoy) || 0),
    0
  );
  // Persentase
  const persen2024 =
    totalPagu2024 > 0
      ? ((totalReal2024 / totalPagu2024) * 100).toFixed(2)
      : "0.00";
  const persen2025 =
    totalPagu2025 > 0
      ? ((totalReal2025 / totalPagu2025) * 100).toFixed(2)
      : "0.00";
  const avgGrowth =
    data.length > 0 ? (totalGrowth / data.length).toFixed(2) : "0.00";

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Kinerja Program</h4>
          {/* <p className="text-muted mb-0">Template Tabel Program</p> */}
        </div>
      </div>

      <Card className="shadow-sm">
        <CardBody
          style={{
            height: TABLE_CONFIG.HEIGHT,
            overflow: "auto",
            scrollBehavior: "smooth",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: TABLE_CONFIG.ANIMATION_DURATION,
              ease: "easeOut",
            }}
          >
            <Table striped bordered hover responsive size="sm" className="mb-0">
              <thead className="table-dark sticky-top">
                <tr>
                  <th
                    rowSpan="2"
                    style={{ width: "10%", verticalAlign: "middle" }}
                  >
                    KD_PROGRAM
                  </th>
                  <th
                    rowSpan="2"
                    style={{ width: "20%", verticalAlign: "middle" }}
                  >
                    NM_PROGRAM
                  </th>
                  <th
                    colSpan="3"
                    className="text-center"
                    style={{ width: "30%" }}
                  >
                    2024
                  </th>
                  <th
                    colSpan="3"
                    className="text-center"
                    style={{ width: "30%" }}
                  >
                    2025
                  </th>
                  <th
                    rowSpan="2"
                    style={{ width: "8%", verticalAlign: "middle" }}
                  >
                    Blokir
                  </th>
                  <th
                    rowSpan="2"
                    style={{ width: "10%", verticalAlign: "middle" }}
                  >
                    Growth (yoy)
                  </th>
                  <th
                    rowSpan="2"
                    style={{ width: "12%", verticalAlign: "middle" }}
                  >
                    Keterangan
                  </th>
                </tr>
                <tr>
                  <th className="text-center">Pagu</th>
                  <th className="text-center">Real</th>
                  <th className="text-center">%</th>
                  <th className="text-center">Pagu</th>
                  <th className="text-center">Real</th>
                  <th className="text-center">%</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.KDProgram || index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-start">
                        <div>
                          <div className="fw-bold">{item.NMProgram}</div>
                          <small className="text-muted">
                            Kode: {item.KDProgram}
                          </small>
                        </div>
                      </td>
                      <td className="text-end">{item.pagu2024}</td>
                      <td className="text-end">{item.real2024}</td>
                      <td className="text-center">{item.persen2024}%</td>
                      <td className="text-end">{item.pagu2025}</td>
                      <td className="text-end">{item.real2025}</td>
                      <td className="text-center">{item.persen2025}%</td>
                      <td className="text-end">{item.blokir}</td>
                      <td className="text-center">{item.growth_yoy}%</td>
                      <td className="text-center">
                        <Badge bg="secondary" className="rounded-pill">
                          {item.keterangan || "-"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      <div className="text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        <p className="mb-0">Tidak ada data atau data error</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="table-secondary">
                <tr className="fw-bold">
                  <td colSpan="2" className="text-center">
                    <strong>TOTAL</strong>
                  </td>
                  <td className="text-end">{totalPagu2024.toLocaleString()}</td>
                  <td className="text-end">{totalReal2024.toLocaleString()}</td>
                  <td className="text-center">
                    <Badge bg="secondary" className="fs-6">
                      {persen2024}%
                    </Badge>
                  </td>
                  <td className="text-end">{totalPagu2025.toLocaleString()}</td>
                  <td className="text-end">{totalReal2025.toLocaleString()}</td>
                  <td className="text-center">
                    <Badge bg="secondary" className="fs-6">
                      {persen2025}%
                    </Badge>
                  </td>
                  <td className="text-end">{totalBlokir.toLocaleString()}</td>
                  <td className="text-center">
                    <Badge
                      bg={Number(avgGrowth) >= 0 ? "success" : "danger"}
                      className="fs-6 text-white"
                    >
                      {avgGrowth}%
                    </Badge>
                  </td>
                  <td className="text-center">-</td>
                </tr>
              </tfoot>
            </Table>
          </motion.div>
        </CardBody>
      </Card>

      {/* Info tambahan */}
      {/* <Row className="mt-3">
        <Col md={3}>
          <Card className="text-center border-primary">
            <CardBody>
              <h6 className="text-muted">Pagu 2024</h6>
              <h4 className="text-primary mb-0">0</h4>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <CardBody>
              <h6 className="text-muted">Real 2024</h6>
              <h4 className="text-success mb-0">0</h4>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <CardBody>
              <h6 className="text-muted">Pagu 2025</h6>
              <h4 className="text-info mb-0">0</h4>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <CardBody>
              <h6 className="text-muted">Real 2025</h6>
              <h4 className="text-warning mb-0">0</h4>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
    </Container>
  );
};

export default ProgramNew;
