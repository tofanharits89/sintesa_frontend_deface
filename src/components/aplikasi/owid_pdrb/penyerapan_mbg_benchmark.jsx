import React, { useState, useEffect, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from "sweetalert2";

export default function PenyerapanMBGBenchmark() {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState("all");
  const [regionalOptions, setRegionalOptions] = useState([]);

  // Fetch regional options untuk dropdown
  useEffect(() => {
    const fetchRegionalOptions = async () => {
      try {        
        const query = `SELECT DISTINCT REGIONAL FROM data_bgn.t_yayasan_spasial WHERE REGIONAL IS NOT NULL ORDER BY regional`;
        const encryptedQuery = Encrypt(query);
        
        const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // console.log("Regional options response:", response); // Debug log
        
        if (response.data && response.data.result) {
          const options = [
            { value: "all", label: "Semua Regional" },
            ...response.data.result.map(item => ({
              value: item.REGIONAL,
              label: item.REGIONAL
            }))
          ];
          setRegionalOptions(options);
        }
      } catch (err) {
        // console.error('Error fetching regional options:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Regional',
          text: 'Terjadi permasalahan saat mengambil data regional. Silakan coba lagi nanti.'
        });
      }
    };

    fetchRegionalOptions();
  }, [axiosJWT, token]);

  // Fetch chart data berdasarkan regional yang dipilih
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
          let query;
        if (selectedRegional === "all") {
          query = `SELECT SUM(a.JUMLAH) AS total, b.NMPROVINSI FROM data_bgn.data_penerima_sppg a LEFT JOIN data_bgn.t_yayasan_spasial b ON a.NOREKENING = b.NOREKENING GROUP BY b.REGIONAL, b.NMPROVINSI ORDER BY total DESC`
        } else {
          query = `SELECT SUM(a.JUMLAH) AS total, b.NMPROVINSI FROM data_bgn.data_penerima_sppg a LEFT JOIN data_bgn.t_yayasan_spasial b ON a.NOREKENING = b.NOREKENING  WHERE b.REGIONAL = '${selectedRegional}' GROUP BY b.REGIONAL, b.NMPROVINSI ORDER BY total DESC`;
        }const encryptedQuery = Encrypt(query);
        
        const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });        
          // console.log("Chart data response:", response); // Debug log
          if (response.data && response.data.result) {
          const formattedData = response.data.result
            .map(item => ({
              provinsi: shortenProvinceName(item.NMPROVINSI), // Label pendek untuk chart
              provinsiLengkap: item.NMPROVINSI, // Nama lengkap untuk tooltip
              penyerapan: parseInt(item.total) || 0
            }))
            .sort((a, b) => b.penyerapan - a.penyerapan) // Sort by penyerapan descending
            .slice(0, 10); // Limit to top 10 on frontend
          // console.log("Chart data:", formattedData); // Debug log
          setChartData(formattedData);
        } else {
          setChartData([]);
        }
        setError(null);
      } catch (err) {
        // console.error('Error fetching chart data:', err);
        const { status, data } = err.response || {};
        const errorMessage = (data && data.error) || 
          "Terjadi Permasalahan Koneksi atau Server Backend untuk data penyerapan MBG";
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: errorMessage
        });
        handleHttpError(status, errorMessage);
        setError(errorMessage);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };    fetchChartData();
  }, [selectedRegional, axiosJWT, token, username]);

  // Function untuk mempersingkat nama provinsi
  const shortenProvinceName = (name) => {
    const mapping = {
      'SUMATERA SELATAN': 'SUMSEL',
      'SUMATERA UTARA': 'SUMUT',
      'SUMATERA BARAT': 'SUMBAR',
      'JAWA TENGAH': 'JATENG',
      'JAWA TIMUR': 'JATIM',
      'JAWA BARAT': 'JABAR',
      'DKI JAKARTA': 'JAKARTA',
      'KALIMANTAN TIMUR': 'KALTIM',
      'KALIMANTAN SELATAN': 'KALSEL',
      'KALIMANTAN BARAT': 'KALBAR',
      'KALIMANTAN TENGAH': 'KALTENG',
      'KALIMANTAN UTARA': 'KALUT',
      'SULAWESI SELATAN': 'SULSEL',
      'SULAWESI UTARA': 'SULUT',
      'SULAWESI TENGAH': 'SULTENG',
      'SULAWESI TENGGARA': 'SULTRA',
      'SULAWESI BARAT': 'SULBAR',
      'NUSA TENGGARA TIMUR': 'NTT',
      'NUSA TENGGARA BARAT': 'NTB',
      'PAPUA BARAT': 'PAPBAR',
      'KEPULAUAN RIAU': 'KEPRI',
      'BANGKA BELITUNG': 'BABEL',
      'KEP. BANGKA BELITUNG': 'BABEL',
      'DAERAH ISTIMEWA YOGYAKARTA': 'YOGYA',
      'DI YOGYAKARTA': 'YOGYA',
      'YOGYAKARTA': 'YOGYA',
      'LAMPUNG': 'LAMPUNG',
      'RIAU': 'RIAU',
      'JAMBI': 'JAMBI',
      'BANTEN': 'BANTEN',
      'BENGKULU': 'BENGKULU',
      'ACEH': 'ACEH',
      'MALUKU': 'MALUKU',
      'MALUKU UTARA': 'MALUT',
      'PAPUA': 'PAPUA',
      'GORONTALO': 'GORONTALO'
    };
    
    return mapping[name?.toUpperCase()] || name;
  };
  // Custom tooltip dengan format yang lebih clean
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: "rgba(30, 41, 59, 0.95)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "6px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          padding: "8px 12px",
          fontSize: "12px"
        }}>
          <p style={{ margin: 0, fontWeight: "500", color: "white", fontSize: "11px" }}>
            {data.provinsiLengkap || label}
          </p>
          <p style={{ margin: "2px 0 0 0", color: "#38bdf8", fontSize: "11px" }}>
            {new Intl.NumberFormat('id-ID').format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div style={{
      background: "white",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      border: "1px solid #e2e8f0",
      minHeight: "380px"
    }}>
      {/* Header - Compact Design */}
      <div style={{
        background: "linear-gradient(135deg, #1e40af, #3b82f6)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "6px",
        textAlign: "center",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(30, 64, 175, 0.2)"
      }}>
        <h3 style={{ 
          margin: "0", 
          fontSize: "14px", 
          fontWeight: "600",
          letterSpacing: "0.3px"
        }}>
          💰 Penyerapan Anggaran Program MBG - Kumulatif
        </h3>
      </div>

      {/* Dropdown Regional - Compact */}
      <div style={{ marginBottom: "16px" }}>
        <select
          value={selectedRegional}
          onChange={(e) => setSelectedRegional(e.target.value)}
          style={{
            background: "#1e40af",
            color: "white",
            border: "1px solid #3b82f6",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
            outline: "none",
            minWidth: "160px"
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
      </div>      {/* Chart Content - Minimalist & Compact */}
      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "220px",
          color: "#64748b",
          fontSize: "12px"
        }}>
          Memuat data penyerapan anggaran MBG...
        </div>
      ) : error ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "220px",
          color: "#dc2626",
          fontSize: "12px",
          background: "#fef2f2",
          borderRadius: "6px",
          padding: "16px",
          border: "1px solid #fecaca"
        }}>
          Error: {error}
        </div>      ) : chartData.length > 0 ? (
        <div style={{ height: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 40, left: 10, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />              
              <XAxis 
                dataKey="provinsi" 
                tick={{ fontSize: 10, fill: "#334155" }}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                angle={-35}
                textAnchor="end"
                height={50}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                tickFormatter={(value) => new Intl.NumberFormat('id-ID', {
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="penyerapan" 
                fill="#1e40af"
                radius={[3, 3, 0, 0]}
              >
                <LabelList 
                  dataKey="penyerapan"
                  position="top"
                  style={{ fontSize: "9px", fill: "#334155", fontWeight: "500" }}
                  formatter={(value) => new Intl.NumberFormat('id-ID', {
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>) : (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "220px",
          color: "#64748b",
          fontSize: "12px"
        }}>
          Tidak ada data penyerapan anggaran untuk regional yang dipilih
        </div>
      )}

      {/* Footer Info - Minimalist */}
      {!loading && !error && chartData.length > 0 && (
        <div style={{
          marginTop: "12px",
          padding: "6px 12px",
          background: "#f8fafc",
          borderRadius: "4px",
          fontSize: "10px",
          color: "#64748b",
          textAlign: "center",
          border: "1px solid #e2e8f0"
        }}>
          Menampilkan {chartData.length} wilayah dengan penyerapan anggaran tertinggi
          {selectedRegional !== "all" && ` untuk regional ${selectedRegional}`}
        </div>
      )}
    </div>
  );
}
