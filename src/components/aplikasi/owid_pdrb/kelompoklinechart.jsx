import React, { useState, useEffect, useContext} from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Encrypt from "../../../auth/Random";
import Select, { components } from "react-select";
import Swal from 'sweetalert2';
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

// Contoh icon (gunakan emoji, atau bisa pakai react-icons/fontawesome sesuai kebutuhan)
const kelompokOptions = [
  { value: "PAUD", label: "PAUD", icon: "🎒" },
  { value: "RA", label: "RA", icon: "🕌" },
  { value: "TK", label: "TK", icon: "🏫" },
  { value: "SD 1-3", label: "SD 1-3", icon: "📚" },
  { value: "SD 4-6", label: "SD 4-6", icon: "📚" },
  { value: "MI 1-3", label: "MI 1-3", icon: "📖" },
  { value: "MI 4-6", label: "MI 4-6", icon: "📖" },
  { value: "SMP", label: "SMP", icon: "🏫" },
  { value: "MTs", label: "MTs", icon: "🏫" },
  { value: "SMA", label: "SMA", icon: "🎓" },
  { value: "SMK", label: "SMK", icon: "🎓" },
  { value: "MA", label: "MA", icon: "🎓" },
  { value: "MAK", label: "MAK", icon: "🎓" },
  { value: "SLB", label: "SLB", icon: "♿" },
  { value: "Ponpes", label: "Ponpes", icon: "🕌" },
  { value: "PKBM", label: "PKBM", icon: "🏠" },
  { value: "Ibu Menyusui", label: "Ibu Menyusui", icon: "🤱" },
  { value: "Ibu Hamil", label: "Ibu Hamil", icon: "🤰" },
  { value: "Balita", label: "Balita", icon: "👶" },
  { value: "Seminari", label: "Seminari", icon: "⛪" }
];

// Custom Option component
const Option = (props) => (
  <components.Option {...props}>
    <span style={{ marginRight: 8 }}>{props.data.icon}</span>
    {props.data.label}
  </components.Option>
);

export default function KelompokMbgChartLine() {
  const { axiosJWT, token } = useContext(MyContext);
  const [kelompok, setKelompok] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set default to PAUD on component mount
  useEffect(() => {
    const paudOption = kelompokOptions.find(option => option.value === "PAUD");
    if (paudOption) {
      setKelompok([paudOption]);
    }
  }, []);

  // Fetch data kelompokmbg dari backend
  useEffect(() => {
    if (kelompok.length === 0) {
      setData([]);
      return;
    }
    setLoading(true);
    const kelStr = kelompok.map(k => `'${k.value}'`).join(",");
    const query = `SELECT kelompok, tanggal, jumlah FROM data_bgn.kelompok_mbg WHERE kelompok IN (${kelStr}) ORDER BY tanggal ASC`;
    const encryptedQuery = Encrypt(query);
    axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_KELOMPOK_LINECHART
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_KELOMPOK_LINECHART}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      .then(res => setData(res.data.result || []))
      .catch(() => {
        setData([]);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: 'Terjadi kesalahan saat mengambil data kelompok MBG.',
        });
      })
      .finally(() => setLoading(false));
  }, [kelompok]);

  // Format data untuk LineChart (tanggal unique sebagai X, tiap kelompok sebagai Line)
  const tanggalList = Array.from(new Set(data.map(d => d.tanggal))).sort();
  const kelompokList = kelompok.length > 0 ? kelompok.map(k => k.value) : [];
  const chartData = tanggalList.map(tgl => {
    const row = { tanggal: tgl };
    kelompokList.forEach(kel => {
      const found = data.find(d => d.tanggal === tgl && d.kelompok === kel);
      row[kel] = found ? found.jumlah : null;
    });
    return row;
  });
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
          minWidth: '70px'
        }}>
          Kelompok:
        </span>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <Select
            isMulti
            options={kelompokOptions}
            value={kelompok}
            onChange={setKelompok}
            placeholder="Pilih Kelompok"
            styles={selectStyles}
            noOptionsMessage={() => "Tidak ada kelompok"}
            components={{ Option }}
          />
        </div>
      </div>

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
          ) : kelompok.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              paddingTop: 120,
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div>Pilih kelompok untuk melihat grafik</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart 
                data={chartData} 
                margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="tanggal" 
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
                {kelompokList.map((kel, idx) => (
                  <Line
                    key={kel}
                    type="monotone"
                    dataKey={kel}
                    stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#eab308", "#334155"][idx % 8]}
                    name={kel}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
}
