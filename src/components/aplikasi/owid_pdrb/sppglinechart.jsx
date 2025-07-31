import React, { useState, useEffect, useContext} from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Encrypt from "../../../auth/Random";
import Select, { components } from "react-select";
import Swal from "sweetalert2";
import MyContext from "../../../auth/Context";

// Minimal Select Styling
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: 32,
    height: 32,
    fontSize: 13,
    borderRadius: 4,
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
    boxShadow: "none",
    background: "#ffffff",
    outline: "none",
    fontWeight: "400",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
    color: "#374151",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: 13,
    padding: "6px 12px",
    background: state.isFocused 
      ? "#f3f4f6" 
      : state.isSelected 
        ? "#2563eb"
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#374151",
    cursor: "pointer",
    fontWeight: "400",
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "400",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: 13,
    color: "#374151",
    fontWeight: "400",
  }),
  multiValue: (provided) => ({
    ...provided,
    background: "#e5e7eb",
    borderRadius: 4,
    border: "none",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#374151",
    fontSize: "12px",
    fontWeight: "400",
    padding: "2px 6px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#6b7280",
    ':hover': {
      backgroundColor: "#ef4444",
      color: "#ffffff",
    }
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 4,
    color: "#9ca3af",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: 4,
    color: "#9ca3af",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 4,
    fontSize: 13,
    zIndex: 30,
    marginTop: 4,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "4px",
    maxHeight: "150px",
  }),
};

const bulanList = [
  { bln: "jan", label: "Jan" }, { bln: "feb", label: "Feb" }, { bln: "mar", label: "Mar" },
  { bln: "apr", label: "Apr" }, { bln: "mei", label: "Mei" }, { bln: "jun", label: "Jun" },
  { bln: "jul", label: "Jul" }, { bln: "agt", label: "Agt" }, { bln: "sep", label: "Sep" },
  { bln: "okt", label: "Okt" }, { bln: "nov", label: "Nov" }, { bln: "des", label: "Des" }
];

// Custom ValueContainer untuk multi-select kanwil
const CustomValueContainer = ({ children, ...props }) => {
  const { getValue, hasValue } = props;
  const selectedValues = hasValue ? getValue() : [];
  const nbValues = selectedValues.length;
  const maxDisplayedValues = 2; // Maksimal 2 kanwil yang ditampilkan secara eksplisit

  if (nbValues > maxDisplayedValues) {
    const displayedKanwil = selectedValues.slice(0, maxDisplayedValues).map(v => v.label).join(", ");
    const remainingCount = nbValues - maxDisplayedValues;
    
    return (
      <components.ValueContainer {...props}>
        <span style={{
          color: "#374151",
          fontSize: "13px",
          fontWeight: "400",
          padding: "0 8px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {displayedKanwil}, +{remainingCount} lainnya
        </span>
        {children[1]} {/* Keep the dropdown indicator */}
      </components.ValueContainer>
    );
  }

  return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
};

export default function SPPGChartLine() {
  const { 
    axiosJWT, 
    token, 
    role, 
    kdkanwil: kodekanwil 
  } = useContext(MyContext);
  const [kanwilList, setKanwilList] = useState([]);
  const [kanwil, setKanwil] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingKanwil, setLoadingKanwil] = useState(true);
  // Ambil daftar kanwil berdasarkan role
  useEffect(() => {
    // Early return jika context belum ready
    if (!role || !axiosJWT || !token) return;

    setLoadingKanwil(true);
    
    let query = "SELECT DISTINCT kanwil, kdkanwil, nmkanwil FROM data_bgn.sppg_historis";
    
    // Filter berdasarkan role kanwil
    if (role === "2" && kodekanwil) {
      query += ` WHERE kdkanwil = '${kodekanwil}'`;
    }
    
    query += " ORDER BY kanwil";
    
    const encryptedQuery = Encrypt(query);
    axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_LINECHART
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_LINECHART}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      .then(res => {
        const result = res.data.result || [];
        const kanwilData = result.map(row => ({
          value: row.kanwil,
          label: role === "2" && kodekanwil ? 
            `${row.kanwil}` : 
            row.kanwil
        }));
        
        setKanwilList(kanwilData);
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Daftar Kanwil',
          text: 'Terjadi permasalahan saat mengambil data kanwil. Silakan coba lagi nanti.'
        });
        setKanwilList([]);
      })
      .finally(() => {
        setLoadingKanwil(false);
      });
  }, [role, kodekanwil, axiosJWT, token]);

  // Auto-select kanwil berdasarkan role setelah data dimuat
  useEffect(() => {
    if (kanwilList.length > 0) {
      if (role === "2") {
        // Untuk role kanwil, auto-select semua kanwil yang tersedia (biasanya hanya satu)
        setKanwil(kanwilList);
      } else if (kanwil.length === 0) {
        // Untuk role non-kanwil, default ke kanwil pertama jika belum ada yang terpilih
        setKanwil([kanwilList[0]]);
      }
    }
  }, [kanwilList, role]);

  // Ambil data filtered
  useEffect(() => {
    if (kanwil.length === 0) {
      setData([]);
      return;
    }
    
    setLoading(true);
    const kanwilStr = kanwil.map(k => `'${k.value}'`).join(",");
    
    let query = `SELECT * FROM data_bgn.sppg_historis WHERE kanwil IN (${kanwilStr})`;
    
    // Tambahkan filter berdasarkan role kanwil
    if (role === "2" && kodekanwil) {
      query += ` AND kdkanwil = '${kodekanwil}'`;
    }
    
    const encryptedQuery = Encrypt(query);
    axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_LINECHART
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_LINECHART}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      .then(res => setData(res.data.result || []))
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data Grafik',
          text: 'Terjadi permasalahan saat mengambil data grafik SPPG. Silakan coba lagi nanti.'
        });
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [kanwil, role, kodekanwil, axiosJWT, token]);

  // Siapkan data untuk LineChart
  const kanwilNames = kanwil.map(k => k.value);
  const chartDataRaw = bulanList.map(({ bln, label }) => {
    const row = { bln, label };
    kanwilNames.forEach(kw => {
      const found = data.find(d => d.kanwil === kw);
      if (found) row[kw] = found[bln];
    });
    return row;
  });

  // Filter hanya bulan yang punya data minimal di satu kanwil
  const chartData = chartDataRaw.filter(row =>
    kanwilNames.some(kw => row[kw] !== undefined && row[kw] !== null && row[kw] !== "")
  );

  const kanwilOptions = kanwilList;

  // Render loading jika context belum ready
  if (!role || !axiosJWT || !token) {
    return (
      <Card style={{ 
        borderRadius: 8, 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}>
        <div style={{ 
          textAlign: "center", 
          padding: '60px 16px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <Spinner animation="border" size="sm" style={{ marginBottom: '8px' }} />
          <div>Loading...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      style={{ 
        borderRadius: 8, 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        
      }}
    >
      {/* Header with dropdown */}
      <div 
        style={{ 
          backgroundColor: '#f9fafb',
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span style={{ 
          color: '#374151', 
          fontSize: '14px', 
          fontWeight: '500',
          minWidth: '50px'
        }}>
          Kanwil:
        </span>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Select
            isMulti
            options={kanwilOptions}
            value={kanwil}
            onChange={setKanwil}
            placeholder={loadingKanwil ? "Loading..." : "Pilih Kanwil"}
            styles={selectStyles}
            components={{ ValueContainer: CustomValueContainer }}
            noOptionsMessage={() => "Tidak ada data kanwil"}
            isLoading={loadingKanwil}
            // Disable untuk role kanwil jika hanya ada satu atau kurang kanwil
            isDisabled={role === "2" && kanwilList.length <= 1}
            // Hilangkan clear option untuk role kanwil
            isClearable={role !== "2"}
          />
        </div>
      </div>

      {/* Role kanwil notification */}
      {role === "2" && kodekanwil && (
        <div style={{ 
          backgroundColor: "#e3f2fd", 
          padding: "8px 16px", 
          borderBottom: "1px solid #e5e7eb",
          fontSize: "12px",
          color: "#1565c0"
        }}>
          <strong>📍 Informasi:</strong> Data dibatasi sesuai wilayah kanwil Anda ({kodekanwil})
        </div>
      )}

      {/* Content area */}
      <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
        <div style={{ height: 280 }}>
          {loading ? (
            <div style={{ 
              textAlign: "center", 
              paddingTop: 120,
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <Spinner 
                animation="border" 
                size="sm" 
                style={{ 
                  color: '#3b82f6',
                  marginBottom: '8px'
                }}
              />
              <div>Memuat data...</div>
            </div>
          ) : kanwil.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              paddingTop: 120,
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div>
                {role === "2" ? 
                  "Tidak ada data kanwil untuk wilayah Anda" : 
                  "Pilih kanwil untuk melihat grafik"
                }
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart 
                data={chartData} 
                margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="label" 
                  tick={{ 
                    fontSize: 11, 
                     
                    fill: "#6b7280" 
                  }}
                  tickLine={{ stroke: "#d1d5db" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis 
                  tick={{ 
                    fontSize: 11, 
                    
                    fill: "#6b7280" 
                  }}
                  tickLine={{ stroke: "#d1d5db" }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <Tooltip 
                  wrapperStyle={{ 
                    fontSize: 12, 
                    
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ 
                    fontSize: 11, 
                    paddingTop: '8px'
                  }} 
                />
                {kanwilNames.map((kw, idx) => (
                  <Line
                    key={kw}
                    type="monotone"
                    dataKey={kw}
                    stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"][idx % 6]}
                    name={kw}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
}
