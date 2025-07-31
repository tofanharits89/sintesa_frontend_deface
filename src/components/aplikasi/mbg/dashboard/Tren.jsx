import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Penyerapan from "./chart/Penyerapan";
import PdrbTab from "../../owid_pdrb/pdrbtab";
import NtpTab from "../../owid_pdrb/ntptab"; 
import KomoditasTab from "../../owid_pdrb/komoditastab";
import SummaryTab from "../../owid_pdrb/summarytab";
import SpasialTab from "../../owid_pdrb/spasialtab";
import PetugasTab from "../../owid_pdrb/petugastab";

const TrenDashboard = () => {
  const items = [
    { id: 1, title: "Penyerapan Anggaran MBG – Non Kumulatif TA 2025" },
    { id: 2, title: "Tren Harga Komoditas Tahun 2025" },
    { id: 3, title: "PDRB Atas Dasar Harga Berlaku Tahun 2024" },
    { id: 4, title: "Tren Nilai Tukar Petani dan Nilai Tukar Nelayan" },
    { id: 5, title: "Data Summary MBG TA 2025" },
    { id: 6, title: "Jumlah Supplier MBG" },
  ];

  const borderColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#556270",
    "#C7F464",
    "#FFA07A",
    "#6A0572",
  ];

  const chartSeries = [
    {
      name: "Nilai",
      data: [10, 20, 15, 25, 22, 30],
    },
  ];

  const categories = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
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
            >
              <Card.Body
                style={{
                  // height: "300px",
                  // overflow: "auto",
                  padding: "1.5rem",
                  color: "#333",
                }}
              >
                <Card.Title
                  className="text-center fw-bold mb-3"
                  style={{ fontSize: "1.2rem" }}
                >
                  {title}
                </Card.Title>
                
                {/* Switch isi Card: id 3 pakai PdrbTab, lainnya Penyerapan */}
                {id === 3 ? (
                  <PdrbTab />
                ) : id === 4 ? (
                  <NtpTab />
                ) : id === 2 ? (
                  <KomoditasTab />
                ) : id === 5 ?  (
                  <SummaryTab />
                ) : id === 1 ?(
                  <SpasialTab />
                ) : id === 6 ?(
                  <PetugasTab />
                ) : (
                  <Penyerapan series={chartSeries} categories={categories} />
                )}

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TrenDashboard;
