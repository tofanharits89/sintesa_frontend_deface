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

const SatkerNew = ({ periode, kdkanwil, kdkppn }) => {
  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Kinerja Satker Utama</h4>
          <p className="text-muted mb-0">Template Tabel Satker</p>
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
                    KD_SATKER
                  </th>
                  <th
                    rowSpan="2"
                    style={{ width: "20%", verticalAlign: "middle" }}
                  >
                    NM_SATKER
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
                    GROWTH (yoy)
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
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      <p className="mb-0">Tidak ada data atau data error</p>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot className="table-secondary">
                <tr className="fw-bold">
                  <td colSpan="2" className="text-center">
                    <strong>TOTAL</strong>
                  </td>
                  <td className="text-end">0</td>
                  <td className="text-end">0</td>
                  <td className="text-center">
                    <Badge bg="secondary" className="fs-6">
                      0.00%
                    </Badge>
                  </td>
                  <td className="text-end">0</td>
                  <td className="text-end">0</td>
                  <td className="text-center">
                    <Badge bg="secondary" className="fs-6">
                      0.00%
                    </Badge>
                  </td>
                  <td className="text-end">0</td>
                  <td className="text-center">
                    <Badge bg="secondary" className="fs-6">
                      0.00%
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
      <Row className="mt-3">
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
      </Row>
    </Container>
  );
};

export default SatkerNew;
