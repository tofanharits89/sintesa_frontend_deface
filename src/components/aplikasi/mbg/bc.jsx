import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import indobaru from "../mbg/dataPeta/indobaru.json"; // GeoJSON semua provinsi
import provkabkota from "../mbg/dataPeta/provkabkota.json"; // GeoJSON kabupaten/kota
import { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";

// Ikon lokasi
const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

// Hitung centroid dari fitur GeoJSON (Polygon atau MultiPolygon)
const getFeatureCenter = (feature) => {
  const coords = feature.geometry.coordinates;
  let lon = 0,
    lat = 0,
    count = 0;

  const processPolygon = (polygon) => {
    polygon[0].forEach(([lng, lt]) => {
      lon += lng;
      lat += lt;
      count++;
    });
  };

  if (feature.geometry.type === "Polygon") processPolygon(coords);
  else if (feature.geometry.type === "MultiPolygon")
    coords.forEach(processPolygon);

  return [lat / count, lon / count];
};

// Fungsi untuk menentukan warna berdasarkan provinsi yang dipilih
const getColorByProvince = (provinceName, selectedProvince) => {
  return provinceName === selectedProvince ? "#ff7f0e" : "#1e90ff"; // Warna orange jika dipilih, biru jika tidak
};

const MapIndonesia = ({ selectedProvince }) => {
  const mapRef = useRef(); // Ref untuk peta
  const [highlightedProvince, setHighlightedProvince] = useState(null); // Menyimpan provinsi yang sedang dipilih
  const [selectedProvinceData, setSelectedProvinceData] = useState(null); // Menyimpan data provinsi yang dipilih
  const [kabupatenKota, setKabupatenKota] = useState([]); // Menyimpan kabupaten/kota terkait dengan provinsi

  useEffect(() => {
    const provinceToUse = selectedProvince;
    if (!provinceToUse || !mapRef.current) return;

    const matchedFeature = provkabkota.features.find((f) => {
      const geoProvince = f.properties?.WADMPR?.toLowerCase().trim();
      return geoProvince === provinceToUse.toLowerCase().trim();
    });

    if (matchedFeature) {
      const [lat, lng] = getFeatureCenter(matchedFeature);
      mapRef.current.setView([lat, lng], 7);
      setHighlightedProvince(provinceToUse);
      const kabupatenForSelectedProvince = provkabkota.features.filter(
        (feature) =>
          feature.properties?.WADMPR?.toLowerCase().trim() ===
          provinceToUse.toLowerCase().trim()
      );
      setKabupatenKota(kabupatenForSelectedProvince);
      setSelectedProvinceData(`Dummy data for province: ${provinceToUse}`);
      //   getKabupatenKotaLayer(); // Memanggil fungsi untuk menampilkan kabupaten/kota
    } else {
      setSelectedProvinceData(null);
      setKabupatenKota([]);
    }
  }, [selectedProvince]);

  // Fungsi reset peta
  const resetMapView = () => {
    if (mapRef.current) {
      mapRef.current.setView([-2.5, 118], 5); // Mengatur peta kembali ke view awal
    }
    setHighlightedProvince(null); // Reset provinsi yang dipilih
    setSelectedProvinceData(null); // Reset data provinsi yang ditampilkan
    setKabupatenKota([]); // Reset kabupaten/kota
  };

  // Fungsi untuk menampilkan kabupaten/kota
  const getKabupatenKotaLayer = () => {
    if (!selectedProvince || kabupatenKota.length === 0) return null;

    return (
      <GeoJSON
        key={selectedProvince} // <== tambahkan ini agar GeoJSON dipaksa rerender
        data={{ type: "FeatureCollection", features: kabupatenKota }}
        style={{
          color: "green",
          weight: 2,
          opacity: 0.6,
          fillColor: "yellow",
          fillOpacity: 0.4,
        }}
        onEachFeature={(feature, layer) => {
          const kabkotaName =
            feature.properties?.WADMKK || "Nama Kabupaten/Kota Tidak Ditemukan";
          layer.bindTooltip(kabkotaName, {
            permanent: true,
            direction: "top",
          });
        }}
      />
    );
  };

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      style={{ height: "60vh", width: "100%" }}
      ref={mapRef} // Ref ke MapContainer
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Menampilkan GeoJSON untuk provinsi (seluruh Indonesia) */}
      <GeoJSON
        data={indobaru} // Menampilkan seluruh provinsi dari indobaru.json
        style={(feature) => {
          const provinceName = feature.properties?.WADMPR;
          return {
            fillColor: getColorByProvince(provinceName, highlightedProvince),
            weight: 1,
            opacity: 1,
            color: "#000", // Garis luar
            dashArray: "3",
            fillOpacity: 0.7,
          };
        }}
        onEachFeature={(feature, layer) => {
          const provinceName =
            feature.properties?.WADMKK || "Nama Provinsi Tidak Ditemukan";
          //   layer.on("click", (e) => handleProvinceClick(e, provinceName)); // Tambahkan event handler untuk klik
          layer.bindTooltip(provinceName, {
            permanent: true,
            direction: "top",
          });
        }}
      />

      {/* Tampilkan kabupaten/kota jika ada */}
      {getKabupatenKotaLayer()}

      <div
        className="button-container"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <span>{selectedProvince}</span>
        <span>{kabupatenKota.length} Kabupaten/Kota</span>
        <Button size="sm" className="fade-in">
          Update Data
        </Button>
        <Button size="sm" variant="danger" className="fade-in">
          Download
        </Button>
        <Button
          onClick={resetMapView}
          className="btn btn-danger"
          size="sm"
          style={{
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Reset Peta
        </Button>
      </div>

      {/* Display div with dummy text when a province is selected */}
      {selectedProvinceData && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1001,
          }}
        >
          <h5>{selectedProvinceData}</h5>
          <p>Dummy text for all provinces will be displayed here.</p>
        </div>
      )}
    </MapContainer>
  );
};

export default MapIndonesia;
