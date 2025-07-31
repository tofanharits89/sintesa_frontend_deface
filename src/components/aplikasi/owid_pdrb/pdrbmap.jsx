import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import html2canvas from "html2canvas";


// GeoJSON provinsi Indonesia (ganti ke path lokal jika sudah download!)
const geoUrl = "https://raw.githubusercontent.com/digitalheir/indonesia-geojson/master/indonesia-provinces.geojson";

// Dummy data, id provinsi harus sama dengan geojson (contoh: ID-JK = Jakarta)
const data = [
  { id: "ID-AC", value: 10, kategori: "Pertanian", tahun: 2023 },
  { id: "ID-JK", value: 30, kategori: "Pertanian", tahun: 2023 },
  { id: "ID-JT", value: 20, kategori: "Industri", tahun: 2023 },
  { id: "ID-AC", value: 13, kategori: "Pertanian", tahun: 2022 },
  { id: "ID-JK", value: 22, kategori: "Pertanian", tahun: 2022 },
  { id: "ID-JT", value: 18, kategori: "Industri", tahun: 2022 },
  // ... tambahkan sesuai kebutuhan
];

const tahunList = [2023, 2022];
const kategoriList = ["Pertanian", "Industri"];

export default function PdrbMap() {
  const [tahun, setTahun] = useState(2023);
  const [kategori, setKategori] = useState("Pertanian");

  // Filter data sesuai tahun & kategori
  const filteredData = data.filter(
    d => d.tahun === tahun && d.kategori === kategori
  );

  const colorScale = scaleLinear().domain([0, 40]).range(["#a7f3d0", "#065f46"]);

  // Download Map as PNG
  const handleDownload = () => {
    const node = document.getElementById("map-to-download");
    if (!node) return;
    html2canvas(node).then(canvas => {
      const link = document.createElement("a");
      link.download = "map.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div>
      {/* Toolbar di atas map */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        {/* Dropdown Tahun */}
        <select value={tahun} onChange={e => setTahun(Number(e.target.value))}>
          {tahunList.map(t => <option key={t}>{t}</option>)}
        </select>
        {/* Dropdown Kategori */}
        <select value={kategori} onChange={e => setKategori(e.target.value)}>
          {kategoriList.map(k => <option key={k}>{k}</option>)}
        </select>
        {/* Tombol Download */}
        <button onClick={handleDownload}>Download Map</button>
      </div>

      {/* MAP */}
      <div id="map-to-download" style={{ width: "100%", height: 400, background: "#fff", borderRadius: 8, boxShadow: "0 1px 5px #eee", padding: 24 }}>
        <h3 style={{ textAlign: "center", marginBottom: 24 }}>Peta PDRB (Dummy)</h3>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1000, center: [120, -2] }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const found = filteredData.find(d => d.id === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={found ? colorScale(found.value) : "#eee"}
                    stroke="#555"
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#f59e42" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {/* Legend sederhana */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 16, background: "#a7f3d0", border: "1px solid #ccc" }} />
          <span style={{ fontSize: 12 }}>Low</span>
          <div style={{ width: 32, height: 16, background: "#065f46", border: "1px solid #ccc" }} />
          <span style={{ fontSize: 12 }}>High</span>
        </div>
      </div>
    </div>
  );
}
