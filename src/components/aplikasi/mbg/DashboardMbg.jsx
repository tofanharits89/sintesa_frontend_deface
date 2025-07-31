import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import SidebarProvinsi from "./Provinsi";
import MapIndonesia from "./Map";
import PerKelompok from "./chart/perKelompok";
import { UpdateMbg } from "./overview/tgUpdate";
import RealisasiKelompok from "./chart/realisasiKelompok";
import { JumlahSppg } from "./overview/dataSummary";
import Header from "./Header";
import DashboardComponent from "./Dua";
import TargetMbg from "./chart/targetMbg";
import MyContext from "../../../auth/Context";
import Sintesa from "../../layout/Sintesa";
import TabDashboard from "./TabDashboard";

// Custom Hook for Intersection Observer
const useInView = (options = {}) => {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect(); // observe once
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, options]);

  return [ref, inView];
};

const DashboardMbg = ({ darkMode }) => {
  const [selectedProvince, setSelectedProvince] = useState("NASIONAL");
  const [jumlahProvinsi, setJumlahProvinsi] = useState(0);
  const [totalPenerima, setTotalPenerima] = useState(0);

  const { tampilSidebar } = useContext(MyContext);
  // console.log(selectedProvince);

  const [chartRef1, inView1] = useInView({ threshold: 0.2 });
  const [chartRef2, inView2] = useInView({ threshold: 0.2 });

  return (
    <Container fluid className={`my-0 ${darkMode ? "dark-mode" : "bg-light"}`}>
      <Row>
        {/* Sidebar */}

        {/* <Col xs={12} md={2}>
          <SidebarProvinsi
            onSelectProvince={setSelectedProvince}
            onSetJumlahProvinsi={setJumlahProvinsi}
            prov={selectedProvince}
            darkMode={darkMode}
          />
        </Col> */}

        {/* Main Content */}
        <Col xs={12} md={12}>
          {/* <div className="pagetitle my-0 ">
                <h1>Dashboard Makan Bergizi Gratis</h1>
                <nav className="text-secondary">
                  <UpdateMbg />
                </nav>
              </div> */}
          <Header prov={selectedProvince} darkMode={darkMode} />
          <DashboardComponent
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
            jumlah={jumlahProvinsi}
            darkMode={darkMode}
          />

          {/* CHART CONTENT */}
          <Row>
            <Col xs={12} md={6}>
              <Card style={{ marginTop: "-15px" }}>
                <Card.Title className="text-center mt-1 mb-0">
                  <i className="bi bi-people-fill"></i> &nbsp; Penerima MBG Per
                  Kelompok ({totalPenerima.toLocaleString("id-ID")})
                  <br />
                  {selectedProvince === "NASIONAL"
                    ? "NASIONAL"
                    : `PROVINSI ${selectedProvince.toUpperCase()}`}{" "}
                </Card.Title>
                <Card.Body className="p-2">
                  <Card.Text>
                    <div ref={chartRef1}>
                      {inView1 && (
                        <PerKelompok
                          prov={selectedProvince}
                          onTotalChange={setTotalPenerima}
                        />
                      )}
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Card style={{ marginTop: "-15px" }}>
                <Card.Title className="text-center mt-1 mb-0">
                  <i className="bi bi-person-lines-fill"></i> &nbsp; Realisasi
                  MBG Per Kelompok (milyar) <br />
                  NASIONAL
                </Card.Title>
                <Card.Body className="p-2">
                  <Card.Text>
                    <div ref={chartRef2}>
                      {inView2 && <RealisasiKelompok prov={selectedProvince} />}
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardMbg;
