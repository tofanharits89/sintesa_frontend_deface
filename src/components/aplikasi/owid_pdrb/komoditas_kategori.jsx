import React, { useState, useEffect, useContext } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from 'sweetalert2';

export default function KomoditasKategori() {
  const { axiosJWT, token } = useContext(MyContext);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState("Kalimantan");
  const [regionalOptions, setRegionalOptions] = useState([
    { value: "Kalimantan", label: "Kalimantan" }
  ]);

  // Fetch regional options untuk dropdown
  useEffect(() => {
    const fetchRegionalOptions = async () => {
      try {
        const query = `SELECT DISTINCT rp.regional FROM data_bgn.komoditas_kategori kk LEFT JOIN data_bgn.ref_provinsi rp ON kk.provinsi = rp.wilnama WHERE rp.regional IS NOT NULL ORDER BY rp.regional`;
        const encryptedQuery = Encrypt(query);
        
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS_KATEGORI
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS_KATEGORI}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data && response.data.result) {
          const options = [
            { value: "all", label: "Semua Regional" },
            ...response.data.result.map(item => ({
              value: item.regional,
              label: item.regional
            }))
          ];
          setRegionalOptions(options);
        }
      } catch (err) {
        // console.error('Error fetching regional options:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Regional',
          text: 'Terjadi kesalahan saat mengambil data regional.',
        });
      }
    };

    fetchRegionalOptions();
  }, [axiosJWT, token]);

  // Fetch table data berdasarkan regional yang dipilih
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        let query;
        
        if (selectedRegional === "all") {
          query = `SELECT provinsi, GROUP_CONCAT(DISTINCT kategori ORDER BY kategori SEPARATOR ', ') as jenis_komoditas FROM data_bgn.komoditas_kategori WHERE provinsi IS NOT NULL AND kategori IS NOT NULL GROUP BY provinsi ORDER BY provinsi`;
        } else {
          query = `SELECT provinsi, GROUP_CONCAT(DISTINCT kategori ORDER BY kategori SEPARATOR ', ') as jenis_komoditas FROM data_bgn.komoditas_kategori WHERE regional = '${selectedRegional}' AND provinsi IS NOT NULL AND kategori IS NOT NULL GROUP BY provinsi ORDER BY provinsi`;
        }
        
        const encryptedQuery = Encrypt(query);
        
        const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS_KATEGORI
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS_KATEGORI}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("API Response:", response.data);

        if (response.data && response.data.result) {
          setTableData(response.data.result);
        } else {
          // console.log("No results in response");
          setTableData([]);
        }
        setError(null);
      } catch (err) {
        // console.error('Error fetching table data:', err);
        const { status, data } = err.response || {};
        const errorMessage = (data && data.error) || 
          "Terjadi Permasalahan Koneksi atau Server Backend untuk data komoditas kategori";
        
        handleHttpError(status, errorMessage);
        setError(errorMessage);
        setTableData([]);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [selectedRegional, axiosJWT, token]);

  if (loading) {
    return (
      <div style={{ 
        width: "100%", 
        height: "420px",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "12px",
          color: "#64748b"
        }}>
          <div style={{ 
            width: "24px", 
            height: "24px", 
            border: "2px solid #e5e7eb", 
            borderTop: "2px solid #3b82f6", 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite" 
          }}></div>
          <span style={{ fontSize: "14px", fontWeight: "500" }}>Memuat data komoditas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: "100%", 
        height: "420px",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "12px",
          color: "#ef4444",
          textAlign: "center",
          padding: "20px"
        }}>
          <span style={{ fontSize: "16px", fontWeight: "600" }}>Error</span>
          <span style={{ fontSize: "14px", maxWidth: "300px" }}>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: "100%", 
      height: "auto",
      minHeight: "420px",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      padding: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden"
    }}>
      {/* Header - Compact Design */}
      <div style={{
        background: "linear-gradient(135deg, #1e40af, #3b82f6)",
        color: "white",
        padding: "6px 12px",
        borderRadius: "4px",
        textAlign: "center",
        marginBottom: "12px",
        boxShadow: "0 1px 4px rgba(30, 64, 175, 0.2)"
      }}>
        <h3 style={{ 
          margin: "0", 
          fontSize: "13px", 
          fontWeight: "600",
          letterSpacing: "0.2px"
        }}>
          🍎 Jenis Komoditas Pangan
        </h3>
      </div>

      {/* Dropdown Regional - Compact */}
      <div style={{ marginBottom: "12px" }}>
        <select
          value={selectedRegional}
          onChange={(e) => setSelectedRegional(e.target.value)}
          style={{
            background: "#1e40af",
            color: "white",
            border: "1px solid #3b82f6",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "11px",
            fontWeight: "500",
            cursor: "pointer",
            outline: "none",
            minWidth: "140px"
          }}
        >
          {regionalOptions.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              style={{ 
                background: "#1e40af", 
                color: "white" 
              }}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ 
        maxHeight: "320px", 
        overflowY: "auto",
        borderRadius: "8px",
        border: "1px solid #e2e8f0"
      }}>
        {tableData.length > 0 ? (
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            backgroundColor: "white",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}>
            <thead style={{ 
              background: "linear-gradient(135deg, #4c6ef5, #667eea)",
              position: "sticky",
              top: "0",
              zIndex: "1"
            }}>
              <tr>
                <th style={{ 
                  padding: "12px", 
                  color: "white",
                  fontWeight: "600",
                  fontSize: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid rgba(255,255,255,0.2)",
                  width: "20%"
                }}>
                  Provinsi
                </th>
                <th style={{ 
                  padding: "12px", 
                  color: "white",
                  fontWeight: "600",
                  fontSize: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid rgba(255,255,255,0.2)",
                  width: "80%"
                }}>
                  Jenis Komoditas
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr 
                  key={idx} 
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#f8fafc" : "white",
                    transition: "background-color 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = "#e0f2fe"}
                  onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = idx % 2 === 0 ? "#f8fafc" : "white"}
                >
                  <td style={{ 
                    padding: "12px", 
                    fontWeight: "600",
                    color: "#1e40af",
                    borderBottom: "1px solid #e2e8f0",
                    verticalAlign: "top",
                    fontSize: "11px"
                  }}>
                    {row.provinsi}
                  </td>
                  <td style={{ 
                    padding: "12px", 
                    color: "#64748b",
                    lineHeight: "1.6",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: "11px"
                  }}>
                    {row.jenis_komoditas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ 
            height: "240px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "#64748b",
            fontSize: "13px",
            fontWeight: "500"
          }}>
            Tidak ada data untuk ditampilkan
          </div>
        )}
      </div>
    </div>
  );
}
