import React, { useState, useEffect, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from 'sweetalert2';

export default function JenisSupplier() {
  const { axiosJWT, token } = useContext(MyContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegional, setSelectedRegional] = useState("all");
  const [regionalOptions, setRegionalOptions] = useState([]);
  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      const iconMap = {
        koperasi: "🏢",
        bumdes: "🏪", 
        bumdesma: "🏬",
        umkm: "🏠",
        supplier_lain: "📦"
      };
      
      return (
        <div style={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "8px 10px",
          fontSize: "11px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          
        }}>
          <p style={{ 
            margin: "0 0 6px 0", 
            fontWeight: "600", 
            color: "#1f2937",
            fontSize: "12px",
            letterSpacing: "0.3px"
          }}>
            {label}
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

  // Fetch regional options untuk dropdown
  useEffect(() => {
    const fetchRegionalOptions = async () => {
      try {
        const query = `SELECT DISTINCT regional FROM by_supplier_prov WHERE regional IS NOT NULL ORDER BY regional`;
        const encryptedQuery = Encrypt(query);
        
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_JENIS_SUPPLIER
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_JENIS_SUPPLIER}${encodeURIComponent(encryptedQuery)}`
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
          query = `SELECT provinsi, SUM(CASE WHEN jenis = 'Koperasi' THEN 1 ELSE 0 END) as koperasi, SUM(CASE WHEN jenis = 'BUMDES' THEN 1 ELSE 0 END) as bumdes, SUM(CASE WHEN jenis = 'BUMDESMA' THEN 1 ELSE 0 END) as bumdesma, SUM(CASE WHEN jenis = 'UMKM' THEN 1 ELSE 0 END) as umkm, SUM(CASE WHEN jenis = 'Supplier Lain' THEN 1 ELSE 0 END) as supplier_lain, COUNT(*) as total_supplier FROM data_bgn.by_supplier_prov WHERE provinsi IS NOT NULL GROUP BY provinsi HAVING total_supplier > 0 ORDER BY total_supplier DESC LIMIT 4`;
        } else {
          query = `SELECT provinsi, SUM(CASE WHEN jenis = 'Koperasi' THEN 1 ELSE 0 END) as koperasi, SUM(CASE WHEN jenis = 'BUMDES' THEN 1 ELSE 0 END) as bumdes, SUM(CASE WHEN jenis = 'BUMDESMA' THEN 1 ELSE 0 END) as bumdesma, SUM(CASE WHEN jenis = 'UMKM' THEN 1 ELSE 0 END) as umkm, SUM(CASE WHEN jenis = 'Supplier Lain' THEN 1 ELSE 0 END) as supplier_lain, COUNT(*) as total_supplier FROM data_bgn.by_supplier_prov WHERE regional = '${selectedRegional}' AND provinsi IS NOT NULL GROUP BY provinsi HAVING total_supplier > 0 ORDER BY total_supplier DESC LIMIT 4`;
        }
        
        const encryptedQuery = Encrypt(query);
        
        const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_JENIS_SUPPLIER
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_JENIS_SUPPLIER}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("API Response:", response.data);

        if (response.data && response.data.result) {
          const formattedData = response.data.result.map(item => {
            const data = {
              provinsi: shortenProvinceName(item.provinsi),
              provinsiLengkap: item.provinsi,
              koperasi: parseInt(item.koperasi) || 0,
              bumdes: parseInt(item.bumdes) || 0,
              bumdesma: parseInt(item.bumdesma) || 0,
              umkm: parseInt(item.umkm) || 0,
              supplier_lain: parseInt(item.supplier_lain) || 0,
              total: parseInt(item.total_supplier) || 0
            };
            
            return data;
          });

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
          "Terjadi Permasalahan Koneksi atau Server Backend untuk data supplier MBG";
        
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
  }, [selectedRegional, axiosJWT, token]);

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
      'ACEH': 'Aceh',
      'RIAU': 'Riau',
      'JAMBI': 'Jambi',
      'BENGKULU': 'Bengkulu',
      'LAMPUNG': 'Lampung',
      'BANTEN': 'Banten',
      'BALI': 'Bali',
      'PAPUA': 'Papua',
      'PAPUA SELATAN': 'Papsel',
      'PAPUA TENGAH': 'Papteng',
      'PAPUA PEGUNUNGAN': 'Papeg',
      'GORONTALO': 'Gorontalo',
      'MALUKU': 'Maluku',
      'MALUKU UTARA': 'Malut'
    };
    return mapping[name?.toUpperCase()] || name;
  };

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
          <span style={{ fontSize: "14px", fontWeight: "500" }}>Memuat data supplier...</span>
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
          📊 Jumlah Supplier MBG
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
      </div>      {/* Legend */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "8px", 
        marginBottom: "12px",
        fontSize: "9px",
        justifyContent: "center",
        padding: "0",
        
      }}>
        {[
          { key: "koperasi", color: "#1e40af", label: "koperasi", icon: "🏢" },
          { key: "bumdes", color: "#ea580c", label: "bumdes", icon: "🏪" },
          { key: "bumdesma", color: "#ca8a04", label: "bumdesma", icon: "🏬" },
          { key: "umkm", color: "#16a34a", label: "umkm", icon: "🏠" },
          { key: "supplier_lain", color: "#0891b2", label: "supplier lain", icon: "📦" }
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
      </div>

      {/* Chart */}
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
              <Bar dataKey="koperasi" stackId="a" fill="#1e40af" />
              <Bar dataKey="bumdes" stackId="a" fill="#ea580c" />
              <Bar dataKey="bumdesma" stackId="a" fill="#ca8a04" />
              <Bar dataKey="umkm" stackId="a" fill="#16a34a" />
              <Bar dataKey="supplier_lain" stackId="a" fill="#0891b2" />
            </BarChart>
          </ResponsiveContainer>
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
