import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Encrypt from "../../../auth/Random";
import Select from "react-select";
import { Card, Spinner } from "react-bootstrap";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
//import MapTest from "./MapTest";
import Swal from 'sweetalert2';
import MyContext from "../../../auth/Context";

// Import GeoJSON Indonesia dari file lokal
import indoGeoJson from "../mbg/dataPeta/indobaru.json"; // Path diperbarui

export default function PetaPenerima() {
  const { 
    axiosJWT, 
    token, 
    role, 
    kdkanwil: kodekanwil 
  } = useContext(MyContext);
  const [provList, setProvList] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Function to normalize province names for matching
  const normalizeProvinceName = (name) => {
    if (!name) return "";
    
    const normalized = name.toUpperCase().trim();
    
    // Common mappings between API and GeoJSON province names
    const nameMap = {
      // Direct mappings
      "ACEH": "ACEH",
      "SUMATERA UTARA": "SUMATERA UTARA", 
      "SUMATERA BARAT": "SUMATERA BARAT",
      "RIAU": "RIAU",
      "JAMBI": "JAMBI", 
      "SUMATERA SELATAN": "SUMATERA SELATAN",
      "BENGKULU": "BENGKULU",
      "LAMPUNG": "LAMPUNG",
      "KEPULAUAN BANGKA BELITUNG": "KEPULAUAN BANGKA BELITUNG",
      "BANGKA BELITUNG": "KEPULAUAN BANGKA BELITUNG",
      "KEP. BANGKA BELITUNG": "KEPULAUAN BANGKA BELITUNG",
      "KEPULAUAN RIAU": "KEPULAUAN RIAU",
      "KEP. RIAU": "KEPULAUAN RIAU",
      "DKI JAKARTA": "DKI JAKARTA",
      "JAKARTA": "DKI JAKARTA",
      "JAWA BARAT": "JAWA BARAT",
      "JAWA TENGAH": "JAWA TENGAH", 
      "DI YOGYAKARTA": "DI YOGYAKARTA",
      "YOGYAKARTA": "DI YOGYAKARTA",
      "JAWA TIMUR": "JAWA TIMUR",
      "BANTEN": "BANTEN",
      "BALI": "BALI",
      "NUSA TENGGARA BARAT": "NUSA TENGGARA BARAT",
      "NTB": "NUSA TENGGARA BARAT",
      "NUSA TENGGARA TIMUR": "NUSA TENGGARA TIMUR", 
      "NTT": "NUSA TENGGARA TIMUR",
      "KALIMANTAN BARAT": "KALIMANTAN BARAT",
      "KALIMANTAN TENGAH": "KALIMANTAN TENGAH",
      "KALIMANTAN SELATAN": "KALIMANTAN SELATAN",
      "KALIMANTAN TIMUR": "KALIMANTAN TIMUR",
      "KALIMANTAN UTARA": "KALIMANTAN UTARA",
      "SULAWESI UTARA": "SULAWESI UTARA",
      "SULAWESI TENGAH": "SULAWESI TENGAH", 
      "SULAWESI SELATAN": "SULAWESI SELATAN",
      "SULAWESI TENGGARA": "SULAWESI TENGGARA",
      "GORONTALO": "GORONTALO",
      "SULAWESI BARAT": "SULAWESI BARAT",
      "MALUKU": "MALUKU",
      "MALUKU UTARA": "MALUKU UTARA",
      "PAPUA BARAT": "PAPUA BARAT",
      "PAPUA": "PAPUA",
      "PAPUA SELATAN": "PAPUA SELATAN",
      "PAPUA TENGAH": "PAPUA TENGAH",
      "PAPUA PEGUNUNGAN": "PAPUA PEGUNUNGAN",
      "PAPUA BARAT DAYA": "PAPUA BARAT DAYA"
    };
    
    return nameMap[normalized] || normalized;
  };

  // Ambil daftar provinsi untuk dropdown
  useEffect(() => {
    let query = "SELECT DISTINCT provinsi, kdkanwil, nmkanwil FROM data_bgn.by_penerima_detail";
    
    // Filter berdasarkan role kanwil
    // role "2" adalah kanwil
    if (role === "2" && kodekanwil) {
      query += ` WHERE kdkanwil = '${kodekanwil}'`;
    }
    
    query += " ORDER BY provinsi ASC";
    
    const encrypted = Encrypt(query);
    axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP}${encodeURIComponent(encrypted)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      .then(res => {
        const arr = res.data.result || [];
        const mappedList = arr.map(row => ({
          value: row.provinsi,
          label: role === "2" && kodekanwil ? 
            `${row.provinsi} (Wilayah Anda - ${kodekanwil})` : 
            row.provinsi
        }));
        
        const options = role === "2" && kodekanwil ? 
          mappedList : 
          [{ value: "all", label: "Semua Provinsi" }, ...mappedList];
          
        setProvList(options);
      })
      .catch(error => {
        // console.error("Error fetching province list:", error);
        const fallback = role === "2" && kodekanwil ? [] : [{ value: "all", label: "Semua Provinsi" }];
        setProvList(fallback);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Provinsi',
          text: 'Terjadi kesalahan saat mengambil daftar provinsi.',
        });
      });
  }, [role, kodekanwil, axiosJWT, token]);

  // Auto-select provinsi berdasarkan role setelah data dimuat
  useEffect(() => {
    if (provList.length > 0) {
      if (role === "2") { // role "2" adalah kanwil
        // Untuk role kanwil, selalu pilih provinsi pertama yang tersedia
        setSelectedProvinsi(provList[0]);
      } else if (!selectedProvinsi) {
        // Untuk role non-kanwil, set default ke "Semua Provinsi"
        const defaultProv = provList.find(prov => prov.value === "all") || provList[0];
        setSelectedProvinsi(defaultProv);
      }
    }
  }, [provList, role]);
  // Ambil data agregat per provinsi berdasarkan filter dan metrik
  useEffect(() => {
    if (!selectedProvinsi) {
      setData([]);
      return;
    }
    
    setLoading(true);
    // Inisialisasi sqlQuery sebagai string satu baris untuk menghindari whitespace di awal
    let sqlQuery = `SELECT provinsi, SUM(pria) AS total_pria, SUM(wanita) AS total_wanita, SUM(jumlah) AS total_jumlah FROM data_bgn.by_penerima_detail`;

    const whereConditions = [];
    
    // Filter berdasarkan role kanwil
    // role "2" adalah kanwil
    if (role === "2" && kodekanwil) {
      whereConditions.push(`kdkanwil = '${kodekanwil}'`);
    }
    
    // Filter berdasarkan provinsi yang dipilih (hanya untuk non-kanwil)
    if (selectedProvinsi && selectedProvinsi.value !== "all") {
      whereConditions.push(`provinsi = '${selectedProvinsi.value.replace(/'/g, "''")}'`);
    }
    
    if (whereConditions.length > 0) {
      sqlQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    sqlQuery += ` GROUP BY provinsi`;

    // .trim() di sini untuk memastikan tidak ada spasi tambahan di akhir setelah penggabungan
    const finalQuery = sqlQuery.trim();
    const encrypted = Encrypt(finalQuery);

    // console.log("Fetching data with query:", finalQuery);

    axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP}${encodeURIComponent(encrypted)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      .then(res => {
        // console.log("Data response:", res.data);
        // Periksa apakah backend mengembalikan pesan error spesifik dalam respons sukses
        if (res.data && res.data.error) {
          // console.error("Backend returned an error message:", res.data.error);
          setData([]);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Data',
            text: res.data.error,
          });
        } else {
          const result = res.data.result || [];
          setData(result);
        }
      })
      .catch(error => {
        //console.error("Error fetching map data (AxiosError):", error.toJSON ? error.toJSON() : error);
        // Jika backend mengirim detail error dalam respons 500
        if (error.response && error.response.data && error.response.data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Data',
            text: error.response.data.error,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Data',
            text: 'Terjadi kesalahan saat mengambil data penerima.',
          });
        }
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [selectedProvinsi, role, kodekanwil, axiosJWT, token]); // Pastikan dependensi sesuai dengan variabel yang mempengaruhi query  // Buat mapping provinsi ke jumlah penerima berdasarkan metrik
  const dataMap = {};
  data.forEach(d => {
    const normalizedName = normalizeProvinceName(d.provinsi);
    dataMap[normalizedName] = {
      pria: +d.total_pria,
      wanita: +d.total_wanita,
      jumlah: +d.total_jumlah
    };
  }); 
  // console.log("API Data map:", dataMap);
  // console.log("API Province names:", Object.keys(dataMap));
  // console.log("Selected metric:", selectedMetric);
  // console.log("GeoJSON features count:", indoGeoJson?.features?.length || 0);
  
  // Test: Create a simple test geography to see if react-simple-maps works at all
  const testGeoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Test Rectangle" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [110, -8],
            [120, -8], 
            [120, -1],
            [110, -1],
            [110, -8]
          ]]
        }
      }
    ]
  };
  
  // console.log("Test GeoJSON:", testGeoJson);
    // Debug: Check province names in GeoJSON
  if (indoGeoJson?.features?.length > 0) {
    const geoProvinces = indoGeoJson.features.map(f => f.properties?.WADMKK).filter(Boolean);
    // console.log("GeoJSON Province names:", geoProvinces);
    // console.log("First few GeoJSON properties:", indoGeoJson.features.slice(0, 3).map(f => f.properties));

    // Calculate bounds of the GeoJSON
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    indoGeoJson.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        const processCoordinates = (coords) => {
          if (Array.isArray(coords[0])) {
            coords.forEach(processCoordinates);
          } else {
            const [lng, lat] = coords;
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
          }
        };
        processCoordinates(feature.geometry.coordinates);
      }
    });
    // console.log("GeoJSON Bounds:", { minLng, maxLng, minLat, maxLat });
    // console.log("Center:", [(minLng + maxLng) / 2, (minLat + maxLat) / 2]);
  }
  // Add sample test data if no real data available
  if (Object.keys(dataMap).length === 0) {
    // console.log("No API data available, adding sample test data");
    // Use actual GeoJSON province names for testing
    const sampleProvinces = [
      "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", 
      "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung",
      "Kepulauan Riau", "DKI Jakarta", "Jawa Barat", "Jawa Tengah",
      "DI Yogyakarta", "Jawa Timur", "Banten", "Bali", "Nusa Tenggara Barat",
      "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah"
    ];
    sampleProvinces.forEach((prov, index) => {
      const normalized = normalizeProvinceName(prov);
      dataMap[normalized] = {
        pria: (index + 1) * 500 + Math.floor(Math.random() * 1000),
        wanita: (index + 1) * 600 + Math.floor(Math.random() * 1000), 
        jumlah: (index + 1) * 1100 + Math.floor(Math.random() * 2000)
      };
    });
    //console.log("Sample data added:", dataMap);
  } else {
    // console.log("API data available, count:", Object.keys(dataMap).length);
    // Debug API data format
    Object.entries(dataMap).forEach(([province, data]) => {
      //console.log(`API Province: "${province}" =>`, data);
    });
  }// Skala warna berdasarkan total jumlah penerima
  const valuesForScale = Object.values(dataMap).map(d => d.jumlah || 0).filter(v => typeof v === 'number');

  const max = valuesForScale.length > 0 ? Math.max(...valuesForScale) : 0;
  //console.log("Max value for scale:", max, "Values:", valuesForScale);

  const colorScale = scaleLinear()
    .domain([0, Math.max(max, 1)]) // Pastikan domain tidak [0,0]
    .range(["#e0f7fa", "#0288d1"]);

  return (
    <Card style={{ padding: 8, borderRadius: 6, fontSize: 11, fontFamily: "inherit", maxHeight: "500px" }}>
      <h6 className="mb-1" style={{ fontSize: 13, fontWeight: 600 }}>
        Peta Sebaran Penerima
      </h6>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="provinsi-select" style={{ fontSize: 10, marginBottom: 2, display: 'block' }}>Filter Provinsi:</label>
          <Select
            inputId="provinsi-select"
            options={provList}
            value={selectedProvinsi}
            onChange={setSelectedProvinsi}
            placeholder="Pilih Provinsi..."
            styles={{ 
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              control: (base) => ({ ...base, minHeight: '28px', fontSize: '10px' }),
              option: (base) => ({ ...base, fontSize: '10px' }),
              singleValue: (base) => ({ ...base, fontSize: '10px' }),
              placeholder: (base) => ({ ...base, fontSize: '10px' })
            }}
            menuPortalTarget={document.body}
            // Disable dropdown untuk role kanwil jika hanya ada satu provinsi
            isDisabled={role === "2" && provList.length <= 1}
          />
        </div>
      </div>      <div style={{ width: "100%", minHeight: 250, border: "1px solid #ddd", borderRadius: 4 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
            <Spinner animation="border" role="status" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div>
            <div style={{ 
              backgroundColor: "#f8f9fa", 
              padding: 8, 
              borderRadius: 4, 
              textAlign: "center",
              marginBottom: 8 
            }}>
              <h6 style={{ color: "#6c757d", marginBottom: 4, fontSize: 11 }}>Map visualization is temporarily unavailable</h6>
              <p style={{ color: "#6c757d", fontSize: 9, margin: 0 }}>Displaying data in table format below</p>
            </div>
            
            <h6 style={{ marginBottom: 8, color: "#495057", fontSize: 11 }}>Data Penerima per Provinsi</h6>
            <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #dee2e6", borderRadius: 4 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, backgroundColor: "#495057", color: "white", zIndex: 10 }}>
                  <tr>
                    <th style={{ border: "1px solid #dee2e6", padding: "4px 4px", textAlign: "center", fontSize: 10 }}>
                      Provinsi
                    </th>
                    <th style={{ border: "1px solid #dee2e6", padding: "4px 4px", textAlign: "center", fontSize: 10 }}>
                      Pria
                    </th>
                    <th style={{ border: "1px solid #dee2e6", padding: "4px 4px", textAlign: "center", fontSize: 10 }}>
                      Wanita
                    </th>
                    <th style={{ border: "1px solid #dee2e6", padding: "4px 4px", textAlign: "center", fontSize: 10 }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dataMap).length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ 
                        padding: 12, 
                        textAlign: "center", 
                        color: "#6c757d",
                        fontStyle: "italic",
                        fontSize: 9
                      }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    Object.entries(dataMap)
                      .sort((a, b) => b[1].jumlah - a[1].jumlah) // Sort by total descending
                      .map(([province, data], index) => (
                        <tr 
                          key={province}
                          style={{ 
                            backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                            transition: "background-color 0.2s"
                          }}
                          onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = "#e3f2fd"}
                          onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "white"}
                        >
                          <td style={{ 
                            border: "1px solid #dee2e6", 
                            padding: "4px 4px",
                            fontWeight: index < 3 ? "bold" : "normal",
                            color: index < 3 ? "#495057" : "#6c757d",
                            fontSize: 9
                          }}>
                            {index < 3 ? `🥇🥈🥉`[index] + " " : ""}{province}
                          </td>
                          <td style={{ 
                            border: "1px solid #dee2e6", 
                            padding: "4px 4px", 
                            textAlign: "right",
                            fontSize: 9
                          }}>
                            {data.pria.toLocaleString()}
                          </td>
                          <td style={{ 
                            border: "1px solid #dee2e6", 
                            padding: "4px 4px", 
                            textAlign: "right",
                            fontSize: 9
                          }}>
                            {data.wanita.toLocaleString()}
                          </td>
                          <td style={{ 
                            border: "1px solid #dee2e6", 
                            padding: "4px 4px", 
                            textAlign: "right",
                            fontSize: 9
                          }}>
                            {data.jumlah.toLocaleString()}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Blok summary dan keterangan warna di bawah tabel dihapus sesuai permintaan */}
    </Card>
  );
}
