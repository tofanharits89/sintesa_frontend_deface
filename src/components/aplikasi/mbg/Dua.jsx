import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import MapIndonesia from "./Map";
import SepuluhBesar from "./overview/10besar";
import KabKota from "./overview/kabkota";
import useJumlahPenerima from "./overview/jumlahPenerimaProv";
import useJumlahPenerimaKab from "./overview/jumlahPenerimaKab";
import { Loading1 } from "../../layout/LoadingTable";
import { LoadingMbg } from "./chart/Loading";
import MyContext from "../../../auth/Context";
import SidebarProvinsi from "./Provinsi";

const DashboardComponent = ({
  selectedProvince,
  darkMode,
  onSelectProvince,
}) => {
  const { dataPenerima, loading } = useJumlahPenerima("");
  const [jumlahProvinsi, setJumlahProvinsi] = useState(0);
  const { dataPenerimaKab, loading: loadingKab } =
    useJumlahPenerimaKab(selectedProvince);
  const { viewMode, setViewMode } = useContext(MyContext);
  const [selectedLayer, setSelectedLayer] = useState("OpenStreetMap");

  const tileLayers = {
    OpenStreetMap: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    "Esri World Imagery": {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
    },
    "CartoDB Light": {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
    },
    "CartoDB Dark": {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
    },
  };

  return (
    <Row>
      {/* Peta */}
      <Col xs={12} lg={8} xl={9} className="d-flex">
        <Card className="radius-10 w-100">
          <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
            <div>
              {" "}
              <SidebarProvinsi
                onSelectProvince={onSelectProvince}
                onSetJumlahProvinsi={setJumlahProvinsi}
                prov={selectedProvince}
                darkMode={darkMode}
              />
            </div>
            <div>
              <h6
                className="mb-0"
                style={{
                  color: "#32393f",
                  fontSize: "1em",
                  fontFamily: "'Figtree', sans-serif",
                }}
              >
                <i className="bi bi-geo-alt-fill text-primary me-2" />
                SEBARAN{" "}
                {selectedProvince === "NASIONAL" && viewMode === "sppg"
                  ? "SPPG NASIONAL"
                  : `PENERIMA MBG ${selectedProvince.toUpperCase()}`}
              </h6>
            </div>
            <div className="d-flex flex-column align-items-end">
              <select
                className="form-select form-select-md"
                style={{ width: "auto", fontFamily: "'Figtree', sans-serif" }}
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
              >
                {Object.keys(tileLayers).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col lg={12} xl={12}>
                <MapIndonesia
                  selectedProvince={selectedProvince}
                  onSelectProvince={onSelectProvince}
                  selectedLayer={tileLayers[selectedLayer]}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>

      {/* Panel Daftar */}
      <Col xs={12} lg={4} xl={3} className="d-flex">
        <Card className="radius-10 w-100">
          <Card.Header
            className="bg-transparent d-flex align-items-center"
            style={{ height: "70px" }}
          >
            <div>
              <h6
                className="mb-0"
                style={{
                  color: "#32393f",
                  fontSize: "1em",
                  fontFamily: "'Figtree', sans-serif",
                }}
              >
                <i className="bi bi-geo-alt-fill text-primary me-2" />
                {selectedProvince === "NASIONAL"
                  ? "PENERIMA MBG PER PROVINSI"
                  : "PENERIMA MBG KAB/KOTA"}
              </h6>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={12} xl={12}>
                {selectedProvince === "NASIONAL" ? (
                  loading ? (
                    <LoadingMbg lines={13} />
                  ) : (
                    <SepuluhBesar data={dataPenerima} darkMode={darkMode} />
                  )
                ) : loadingKab ? (
                  <LoadingMbg lines={13} />
                ) : (
                  <KabKota data={dataPenerimaKab} />
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardComponent;
