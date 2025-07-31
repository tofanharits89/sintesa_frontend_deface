import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import PenyerapanMBGBenchmark from "../../owid_pdrb/penyerapan_mbg_benchmark";
import PenerimaMBGBenchmark from "../../owid_pdrb/penerima_mbg_benchmark";
import JenisSupplier from "../../owid_pdrb/jenis_supplier";
import KomoditasKategori from "../../owid_pdrb/komoditas_kategori";

const BenchmarkDashboard = () => {
  const items = [
    { id: 1, title: "Penyerapan MBG Kumulatif" },
    { id: 2, title: "Jumlah Penerima MBG" },
    { id: 3, title: "Jumlah Supplier MBG" },
    { id: 4, title: "Jenis Komoditas Pangan" },
  ];

  const borderColors = [
    "#FF6B6B",
    "#4ECDC4", 
    "#556270",    "#C7F464",  ];

  return (
    <Container fluid style={{ padding: "0 2rem" }}>
      <Row className="g-4 mt-2" style={{ margin: "0 1rem" }}>
        {items.map(({ id, title }, index) => (
          <Col key={id} xs={12} md={6} style={{ padding: "0 1rem" }}>
            <Card
              className="h-100 shadow-sm"
              style={{
                borderLeft: `8px solid ${borderColors[index % borderColors.length]}`,
                borderRadius: "8px",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                maxWidth: "100%",
                margin: "0 auto"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >              <Card.Body
                style={{
                  padding: "1.5rem",
                  color: "#333",
                }}
              >                {/* No titles shown for any cards */}
                {false && (
                  <Card.Title
                    className="text-center fw-bold mb-3"
                    style={{ fontSize: "1.2rem" }}
                  >
                    {title}
                  </Card.Title>
                )}
                
                {/* Switch isi Card berdasarkan id */}                {id === 1 ? (
                  <PenyerapanMBGBenchmark />
                ) : id === 2 ? (
                  <PenerimaMBGBenchmark />                ) : id === 3 ? (
                  <JenisSupplier />
                ) : id === 4 ? (
                  <KomoditasKategori />
                ) : null}

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>  );
};

export default BenchmarkDashboard;
