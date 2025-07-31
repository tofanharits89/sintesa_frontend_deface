import React, { useState, useEffect, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from 'sweetalert2';

export default function PenerimaMBGBenchmark() {
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
        const query = `SELECT DISTINCT rp.regional FROM data_bgn.by_kelompok_detail bkd LEFT JOIN data_bgn.ref_provinsi rp ON bkd.provinsi = rp.wilnama WHERE rp.regional IS NOT NULL ORDER BY rp.regional`;
        const encryptedQuery = Encrypt(query);
          const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP}${encodeURIComponent(encryptedQuery)}`
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

  // Fetch chart data berdasarkan regional yang dipilih
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);        let query;
        if (selectedRegional === "all") {
          query = `SELECT provinsi, SUM(CASE WHEN name = 'Balita' THEN 1 ELSE 0 END) as balita, SUM(CASE WHEN name = 'PAUD' THEN 1 ELSE 0 END) as paud, SUM(CASE WHEN name = 'TK' THEN 1 ELSE 0 END) as tk, SUM(CASE WHEN name = 'SD 1-3' THEN 1 ELSE 0 END) as sd1_3, SUM(CASE WHEN name = 'SD 4-6' THEN 1 ELSE 0 END) as sd4_6, SUM(CASE WHEN name = 'SMP' THEN 1 ELSE 0 END) as smp, SUM(CASE WHEN name = 'SMA' THEN 1 ELSE 0 END) as sma, COUNT(*) as total_kelompok FROM data_bgn.by_kelompok_detail WHERE provinsi IS NOT NULL GROUP BY provinsi HAVING total_kelompok > 0 ORDER BY total_kelompok DESC`;
        } else {
          query = `SELECT provinsi, SUM(CASE WHEN name = 'Balita' THEN 1 ELSE 0 END) as balita, SUM(CASE WHEN name = 'PAUD' THEN 1 ELSE 0 END) as paud, SUM(CASE WHEN name = 'TK' THEN 1 ELSE 0 END) as tk, SUM(CASE WHEN name = 'SD 1-3' THEN 1 ELSE 0 END) as sd1_3, SUM(CASE WHEN name = 'SD 4-6' THEN 1 ELSE 0 END) as sd4_6, SUM(CASE WHEN name = 'SMP' THEN 1 ELSE 0 END) as smp, SUM(CASE WHEN name = 'SMA' THEN 1 ELSE 0 END) as sma, COUNT(*) as total_kelompok FROM data_bgn.by_kelompok_detail WHERE regional = '${selectedRegional}' AND provinsi IS NOT NULL GROUP BY provinsi HAVING total_kelompok > 0 ORDER BY total_kelompok DESC`;
        }
        
        const encryptedQuery = Encrypt(query);
          const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_PENERIMA_MAP}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        // console.log("API Response:", response.data);        
        if (response.data && response.data.result) {
          // console.log("Results length:", response.data.result.length);
          // console.log("Raw results:", response.data.result);
          const formattedData = response.data.result
            .map(item => {
              const data = {
                provinsi: shortenProvinceName(item.provinsi),
                provinsiLengkap: item.provinsi,
                balita: parseInt(item.balita) || 0,
                paud: parseInt(item.paud) || 0,
                tk: parseInt(item.tk) || 0,
                sd1_3: parseInt(item.sd1_3) || 0,
                sd4_6: parseInt(item.sd4_6) || 0,
                smp: parseInt(item.smp) || 0,
                sma: parseInt(item.sma) || 0,
                total: parseInt(item.total_kelompok) || 0
              };
              
              // Jika semua nilai 0, berikan minimal 1 untuk balita agar chart ter-render
              if (data.total === 0 && data.balita === 0 && data.paud === 0 && data.tk === 0 && 
                  data.sd1_3 === 0 && data.sd4_6 === 0 && data.smp === 0 && data.sma === 0) {
                data.balita = 1;
                data.total = 1;
              }
              
              return data;
            })
            .sort((a, b) => b.total - a.total) // Sort by total descending
            .slice(0, 4); // Limit to top 4 provinces on frontend
          // console.log("Final formatted data for chart:", formattedData);
          setChartData(formattedData);
        } else {
          // console.log("No results in response");
          setChartData([]);
        }
        setError(null);
      } catch (err) {
        // console.error('Error fetching chart data:', err);
        const { status, data } = err.response || {};
        const errorMessage = (data && data.error) || 
          "Terjadi Permasalahan Koneksi atau Server Backend untuk data penerima MBG";
        
        handleHttpError(status, errorMessage);
        setError(errorMessage);
        setChartData([]);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedRegional, axiosJWT, token, username]);

  // Function untuk mempersingkat nama provinsi
  const shortenProvinceName = (name) => {
    const mapping = {
      'SUMATERA SELATAN': 'Sumsel',
      'SUMATERA UTARA': 'Sumut',
      'SUMATERA BARAT': 'Sumbar',
      'JAWA TENGAH': 'Jateng',
      'JAWA TIMUR': 'Jatim',
      'JAWA BARAT': 'Jabar',
      'DKI JAKARTA': 'Jakarta',
      'KALIMANTAN TIMUR': 'Kaltim',
      'KALIMANTAN SELATAN': 'Kalsel',
      'KALIMANTAN BARAT': 'Kalbar',
      'KALIMANTAN TENGAH': 'Kalteng',
      'KALIMANTAN UTARA': 'Kalut',
      'SULAWESI SELATAN': 'Sulsel',
      'SULAWESI UTARA': 'Sulut',
      'SULAWESI TENGAH': 'Sulteng',
      'SULAWESI TENGGARA': 'Sultra',
      'SULAWESI BARAT': 'Sulbar',
      'NUSA TENGGARA TIMUR': 'NTT',
      'NUSA TENGGARA BARAT': 'NTB',
      'PAPUA BARAT': 'Papbar',
      'KEPULAUAN RIAU': 'Kepri',
      'BANGKA BELITUNG': 'Babel',
      'KEP. BANGKA BELITUNG': 'Babel',
      'DAERAH ISTIMEWA YOGYAKARTA': 'Yogya',
      'DI YOGYAKARTA': 'Yogya',
      'YOGYAKARTA': 'Yogya',
      'LAMPUNG': 'Lampung',
      'RIAU': 'Riau',
      'JAMBI': 'Jambi',
      'BANTEN': 'Banten',
      'BENGKULU': 'Bengkulu',
      'ACEH': 'Aceh',
      'MALUKU': 'Maluku',
      'MALUKU UTARA': 'Malut',
      'PAPUA': 'Papua',
      'GORONTALO': 'Gorontalo'
    };
    
    return mapping[name?.toUpperCase()] || name;
  };
  // Custom tooltip dengan format yang lebih clean dan icons
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      const iconMap = {
        balita: "🍼",
        paud: "🎈", 
        tk: "🎪",
        sd1_3: "📚",
        sd4_6: "📖",
        smp: "🎒",
        sma: "🎓"
      };
      
      return (
        <div style={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "8px 10px",
          fontSize: "11px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          <p style={{ 
            margin: "0 0 6px 0", 
            fontWeight: "600", 
            color: "#1f2937",
            fontSize: "12px",
            letterSpacing: "0.3px"
          }}>
            {data.provinsiLengkap}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: "3px 0", 
              color: entry.color,
              fontWeight: "500",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>{iconMap[entry.dataKey] || "📊"}</span>
              <span style={{ textTransform: "lowercase" }}>{entry.name}:</span>
              <span style={{ fontWeight: "600" }}>{entry.value}</span>
            </p>
          ))}
          <div style={{ 
            borderTop: "1px solid #f3f4f6", 
            paddingTop: "4px", 
            marginTop: "6px",
            fontWeight: "600",
            color: "#374151",
            fontSize: "11px",
            letterSpacing: "0.2px"
          }}>
            Total: {total}
          </div>
        </div>
      );
    }
    return null;
  };
  if (loading) {
    return (
      <div style={{ 
        width: "100%", 
        minHeight: "320px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            border: "3px solid #f3f4f6", 
            borderTop: "3px solid #3b82f6", 
            borderRadius: "50%", 
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px"
          }}></div>
          <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
            Memuat data penerima MBG...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: "100%", 
        minHeight: "320px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            fontSize: "16px", 
            fontWeight: "600", 
            marginBottom: "8px",
            color: "#ef4444"
          }}>
            Error
          </div>
          <div style={{ color: "#64748b", fontSize: "14px" }}>
            {error}
          </div>
        </div>
      </div>
    );
  }  return (
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
    }}>      {/* Header - Compact Design */}
      <div style={{
        background: "linear-gradient(135deg, #1e40af, #3b82f6)",
        color: "white",
        padding: "6px 12px",
        borderRadius: "4px",
        textAlign: "center",
        marginBottom: "12px",
        boxShadow: "0 1px 4px rgba(30, 64, 175, 0.2)"
      }}>        <h3 style={{ 
          margin: "0", 
          fontSize: "13px", 
          fontWeight: "600",
          letterSpacing: "0.2px"
        }}>
          📊 Jumlah Kelompok Penerima Manfaat MBG
        </h3>
      </div>      {/* Dropdown Regional - Compact */}
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
        >{regionalOptions.map(option => (
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
      </div>      {/* Legend */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "8px", 
        marginBottom: "12px",
        fontSize: "11px",
        justifyContent: "center",
        padding: "0",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        {[
          { key: "balita", color: "#1e40af", label: "balita", icon: "🍼" },
          { key: "paud", color: "#ea580c", label: "paud", icon: "🎈" },
          { key: "tk", color: "#ca8a04", label: "tk", icon: "🎪" },
          { key: "sd1_3", color: "#16a34a", label: "sd1-3", icon: "📚" },
          { key: "sd4_6", color: "#0891b2", label: "sd4-6", icon: "📖" },
          { key: "smp", color: "#7c3aed", label: "smp", icon: "🎒" },
          { key: "sma", color: "#1f2937", label: "sma", icon: "🎓" }
        ].map(item => (
          <div key={item.key} style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "4px",
            backgroundColor: "#f8fafc",
            padding: "3px 6px",
            borderRadius: "4px",
            border: "1px solid #e2e8f0"
          }}>
            <span style={{ fontSize: "10px" }}>{item.icon}</span>
            <div style={{ 
              width: "8px", 
              height: "8px", 
              backgroundColor: item.color, 
              borderRadius: "2px" 
            }}></div>
            <span style={{ 
              color: "#64748b", 
              fontWeight: "500",
              fontSize: "9px",
              letterSpacing: "0.2px"
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>{/* Chart */}
      {/* {console.log("Chart rendering with data:", chartData)}         */}
      <div style={{ padding: "0" }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              barCategoryGap="25%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f1f5f9"
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="provinsi"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b", fontWeight: "500" }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#64748b" }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="balita" stackId="a" fill="#1e40af" />
              <Bar dataKey="paud" stackId="a" fill="#ea580c" />
              <Bar dataKey="tk" stackId="a" fill="#ca8a04" />
              <Bar dataKey="sd1_3" stackId="a" fill="#16a34a" />
              <Bar dataKey="sd4_6" stackId="a" fill="#0891b2" />
              <Bar dataKey="smp" stackId="a" fill="#7c3aed" />
              <Bar dataKey="sma" stackId="a" fill="#1f2937" />
            </BarChart>
          </ResponsiveContainer>        ) : (
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
