import {
  MapContainer,
  CircleMarker,
  GeoJSON,
  Marker,
  Popup,
  Tooltip,
  TileLayer,
} from "react-leaflet";
import { Card } from "react-bootstrap";
import { useState, useRef, useEffect, useMemo, useContext } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import indobaru from "../mbg/dataPeta/indobaru.json";
import provkabkota from "../mbg/dataPeta/provkabkota.json";
import useJumlahSppg from "./overview/jumlahSPPGProv";
import useJumlahPenerima from "./overview/jumlahPenerimaMap";
import useJumlahPenerimaKab from "./overview/jumlahPenerimaKab";
import "./peta.css";
import numeral from "numeral";
import LegendMap from "./dataPeta/legendMap";
import LayerSwitcher from "./dataPeta/layerSwitcher";
import { legendData } from "./dataPeta/legendData";
import MyContext from "../../../auth/Context";

// Function to calculate the center of a feature
const getFeatureCenter = (feature) => {
  const coords = feature?.geometry?.coordinates;
  if (!coords) return [-2.5, 118];
  let lon = 0,
    lat = 0,
    count = 0;

  const processPolygon = (polygon) => {
    if (!Array.isArray(polygon?.[0])) return;
    polygon[0].forEach(([lng, lt]) => {
      lon += lng;
      lat += lt;
      count++;
    });
  };

  feature.geometry.type === "Polygon"
    ? processPolygon(coords)
    : coords.forEach(processPolygon);

  return count === 0 ? [-2.5, 118] : [lat / count, lon / count];
};

const getColor = (value, viewMode) => {
  // console.log("GET COLOR:", { value, viewMode }); // Tambahkan ini
  const legendItems =
    viewMode === "sppg" ? legendData.sppg : legendData.penerima;

  // console.log(legendItems);

  const parseLabelValue = (label) => {
    if (!label) return 0;

    const lower = label.toLowerCase().replace(",", ".").trim();

    if (lower.includes("juta")) {
      return parseFloat(lower) * 1_000_000;
    } else if (lower.includes("ribu")) {
      return parseFloat(lower) * 1_000;
    }

    return parseFloat(lower);
  };

  for (const item of legendItems) {
    const label = item.label.toLowerCase().replace(",", ".").trim();

    try {
      if (label.startsWith(">")) {
        const match = label.match(/> ?([\d.,]+)( (ribu|juta))?/);
        if (!match) continue;
        const min = parseLabelValue(
          match[1] + (match[3] ? ` ${match[3]}` : "")
        );
        if (value > min) return item.color;
      } else if (label.includes("–") || label.includes("-")) {
        const parts = label.split(/–|-/).map((str) => str.trim());
        if (parts.length === 2) {
          const min = parseLabelValue(parts[0]);
          const max = parseLabelValue(parts[1]);
          if (value >= min && value <= max) return item.color;
        }
      } else {
        const exact = parseLabelValue(label);
        if (value === exact) return item.color;
      }
    } catch (err) {
      console.warn(`Label parsing failed for "${label}":`, err);
    }
  }

  return "#FFEDA0"; // default fallback
};

const MapIndonesia = ({
  selectedProvince,
  onSelectProvince,
  selectedLayer,
}) => {
  // const [loading, setLoading] = useState(true);

  const { viewMode, setViewMode } = useContext(MyContext);
  const mapRef = useRef();
  const [selectedProvinceData, setSelectedProvinceData] = useState(null);
  const [kabupatenKota, setKabupatenKota] = useState([]);
  const [kabKey, setKabKey] = useState(Date.now());
  const [selectedKabupatenKota, setSelectedKabupatenKota] = useState(null);
  const { dataMap, loading } = useJumlahSppg("");
  const { dataMapPenerima } = useJumlahPenerima("");
  const { dataPenerimaKab, loading: loading2 } =
    useJumlahPenerimaKab(selectedProvince);

  const getJumlahSPPG = (kodeProv) => dataMap[kodeProv]?.data?.jumlah || 0;
  const getJumlahPenerima = (kodeProv) =>
    dataMapPenerima[kodeProv]?.data?.jumlah || 0;

  // Reset map view when a new province is selected
  const resetMapView = () => {
    if (mapRef.current) mapRef.current.setView([-2.5, 118], 5);
    setKabupatenKota([]);
    setKabKey(Date.now());
    setSelectedProvinceData(null);
    setSelectedKabupatenKota(null);
  };

  useEffect(() => {
    if (selectedProvince === "NASIONAL") {
      resetMapView();
      setSelectedProvinceData("NASIONAL");
      return;
    }

    const matchedFeature = provkabkota.features.find(
      (f) =>
        f.properties?.WADMPR?.toLowerCase().trim() ===
        selectedProvince?.toLowerCase().trim()
    );

    if (matchedFeature && mapRef.current) {
      const [lat, lng] = getFeatureCenter(matchedFeature);
      mapRef.current.setView([lat, lng], 8);

      const filteredKab = provkabkota.features.filter(
        (f) =>
          f.properties?.WADMPR?.toLowerCase().trim() ===
          selectedProvince?.toLowerCase().trim()
      );

      setKabupatenKota(filteredKab);
      setKabKey(Date.now());
      setSelectedProvinceData(selectedProvince);
      setSelectedKabupatenKota(null);
    } else {
      setKabupatenKota([]);
      setSelectedProvinceData(null);
    }
  }, [selectedProvince]);

  const getJumlahByKab = (kabName) => {
    const normalize = (str) => str?.toLowerCase().replace(/\s+/g, " ").trim();
    const match = dataPenerimaKab.find(
      (item) => normalize(item.kabkota) === normalize(kabName)
    );
    const jumlah = parseInt(match?.penerimakab || 0);
    // console.log(`Kabupaten: ${kabName}, Jumlah: ${jumlah}`);
    return jumlah;
  };

  // Memoize kabupatenKota features to avoid unnecessary recalculations
  const memoizedKabupatenKota = useMemo(() => kabupatenKota, [kabupatenKota]);

  useEffect(() => {
    // Trigger GeoJSON reload if selectedProvince or kabupatenKota data changes
    setKabKey(Date.now());
  }, [selectedProvince, dataPenerimaKab]);

  const handleKabupatenClick = (feature, layer) => {
    const kabkotaName = feature.properties?.WADMKK || "Kab/Kota";

    const jumlah = getJumlahByKab(kabkotaName); // Ambil jumlah berdasarkan kabupaten/kota
    // console.log(jumlah);

    // Memperbarui style layer yang diklik

    layer.bindTooltip(`${kabkotaName}`, {
      direction: "center",
      sticky: true,
      className: "leaflet-tooltip-provinsi",
    });

    // Menampilkan informasi jumlah penerima atau jumlah SPPG
    layer.bindPopup(`
      <p>Kab/Kota: ${kabkotaName}</p>
      <p>Jumlah Penerima MBG: ${numeral(jumlah).format("0,0")} orang</p>
    `);
  };

  return (
    <div className="mt-4 mb-0 border border-secondary rounded p-1">
      <Card>
        <Card.Body className="d-flex justify-content-center align-items-center flex-wrap p-0">
          {loading2 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 999,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: "1rem 2rem",
                borderRadius: "8px",
                fontFamily: "'Figtree', sans-serif",
              }}
            >
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="mt-2 text-center">Memuat data peta...</div>
            </div>
          )}

          <MapContainer
            center={[-2.5, 117.0]}
            zoom={5}
            style={{ height: "50vh", width: "100%" }}
            ref={mapRef}
            attributionControl={false}
            scrollWheelZoom={!!selectedKabupatenKota}
            dragging={true}
            zoomControl={!selectedKabupatenKota}
          >
            <TileLayer
              url={selectedLayer.url}
              attribution={selectedLayer.attribution}
            />
            <GeoJSON
              data={indobaru}
              key={selectedProvince}
              style={(feature) => {
                const kodeProv = feature?.properties?.KODE_PROV;
                const jumlah =
                  viewMode === "sppg"
                    ? getJumlahSPPG(kodeProv)
                    : getJumlahPenerima(kodeProv);
                // console.log(jumlah);

                return {
                  fillColor: getColor(jumlah, viewMode),
                  weight: 1,
                  color: "#666",
                  fillOpacity: 0.7,
                  fontFamily: "'Figtree', sans-serif",
                };
              }}
              onEachFeature={(feature, layer) => {
                const namaProv =
                  feature?.properties?.WADMKK.toUpperCase().trim();

                layer.bindTooltip(`${namaProv}`, {
                  direction: "center",
                  sticky: true,
                  className: "leaflet-tooltip-provinsi",
                });

                layer.on("click", () => {
                  onSelectProvince(namaProv);
                });
              }}
            />

            {selectedProvince === "NASIONAL" &&
              indobaru.features.map((feature, idx) => {
                const kodeProv = feature?.properties?.KODE_PROV;
                const namaProv = feature?.properties?.WADMKK;
                const jumlah =
                  viewMode === "sppg"
                    ? getJumlahSPPG(kodeProv)
                    : getJumlahPenerima(kodeProv);

                if (!jumlah) return null;

                const [lat, lng] = getFeatureCenter(feature);

                if (viewMode === "sppg") {
                  // For SPPG, use a Marker
                  return (
                    <Marker
                      key={`jumlah-${namaProv}-${idx}`}
                      position={[lat, lng]}
                      icon={L.divIcon({
                        html: `<div class="jumlah-label">${numeral(jumlah).format("0,0")}</div>`,
                        iconSize: [0, 0], // Adjust icon size
                        iconAnchor: [0, 0], // Center the label
                      })}
                    >
                      <Popup>
                        <p>SPPG {namaProv}</p>
                        <p>
                          Jumlah SPPG: {numeral(jumlah).format("0,0")} orang
                        </p>
                      </Popup>
                    </Marker>
                  );
                } else {
                  // For Penerima, use CircleMarker
                  return (
                    <Marker
                      key={`jumlah-${namaProv}-${idx}`}
                      position={[lat, lng]}
                      icon={L.divIcon({
                        html: `<div class="jumlah-label-penerima">${numeral(jumlah).format("0,0")}</div>`,
                        iconSize: [0, 0], // Adjust icon size
                        iconAnchor: [0, 0], // Center the label
                      })}
                    >
                      <Popup>
                        <p>SPPG {namaProv}</p>
                        <p>
                          Jumlah SPPG: {numeral(jumlah).format("0,0")} orang
                        </p>
                      </Popup>
                    </Marker>
                  );
                }
              })}

            {memoizedKabupatenKota.length > 0 &&
              memoizedKabupatenKota.map((feature, idx) => {
                const kabName = feature.properties?.WADMKK;
                const jumlah = getJumlahByKab(kabName);

                if (jumlah > 0) {
                  const [lat, lng] = getFeatureCenter(feature);
                  return (
                    <Marker
                      key={`kab-label-${idx}`}
                      position={[lat, lng]}
                      icon={L.divIcon({
                        html: `<div class="jumlah-label-kab">${numeral(jumlah).format("0,0")}</div>`,
                        iconSize: [0, 0],
                        iconAnchor: [0, 0],
                      })}
                    >
                      <Popup>
                        <p>Kab/Kota: {kabName}</p>
                        <p>
                          Jumlah Penerima MBG: {numeral(jumlah).format("0,0")}{" "}
                          orang
                        </p>
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}

            {memoizedKabupatenKota.length > 0 && (
              <GeoJSON
                key={`${selectedProvince}-${kabKey}`}
                data={{
                  type: "FeatureCollection",
                  features: memoizedKabupatenKota,
                }}
                style={(feature) => {
                  const kabName = feature.properties?.WADMKK;
                  const jumlah = getJumlahByKab(kabName);
                  const isSelected = selectedKabupatenKota === kabName;

                  const warna = isSelected
                    ? "#ffd700"
                    : getColor(jumlah, "penerima");

                  return {
                    weight: 1,
                    color: "#999", // outline
                    opacity: 1,
                    fillColor: warna,
                    fillOpacity: 0.8,
                    fontFamily: "'Figtree', sans-serif",
                  };
                }}
                onEachFeature={handleKabupatenClick}
              />
            )}

            <div className="leaflet-bottom leaflet-right leaflet-source-box p-2">
              {/* {viewMode} */}
              <i
                className="bi bi-exclude text-danger mx-2"
                style={{
                  fontSize: "10px",
                  fontFamily: "'Figtree', sans-serif",
                }}
              />
              <span>
                sintesa v3 | <strong>PDPSIPA - KKPA</strong> |{" "}
                <a
                  href="https://dialur.bgn.go.id/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Sumber
                </a>
              </span>
            </div>

            <LegendMap
              kabupatenKota={memoizedKabupatenKota}
              selectedProvince={selectedProvince}
              viewMode={viewMode}
            />
            {selectedProvince === "NASIONAL" && (
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "13%",
                  transform: "translateX(-50%)",
                  zIndex: 1000,
                  fontFamily: "'Figtree', sans-serif",
                }}
              >
                <LayerSwitcher viewMode={viewMode} setViewMode={setViewMode} />
              </div>
            )}
          </MapContainer>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MapIndonesia;
