import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Encrypt from "../../../auth/Random";
import Select from "react-select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, Cell } from "recharts";
import { Card, Spinner } from "react-bootstrap";
import { FaUserTie, FaUserNurse, FaUserShield, FaUserCog, FaTruck, FaSoap } from "react-icons/fa";
import { MdOutlineSoupKitchen, MdOutlineCleaningServices, MdSecurity } from "react-icons/md";
import { GiCook, GiSteeringWheel } from "react-icons/gi";
import { TbChefHat } from "react-icons/tb";
import { FaHandsWash } from "react-icons/fa";
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

const jenisIcon = {
  "Kepala SPPG": <FaUserTie size={18} color="#3b82f6" />,
  "Ahli Gizi": <FaUserNurse size={18} color="#38b6ff" />,
  "Staf Keuangan": <FaUserCog size={18} color="#64748b" />,
  "Kepala Lapangan": <FaUserTie size={18} color="#f59e42" />,
  "Kepala Juru Masak": <TbChefHat size={18} color="#f59e42" />,
  "Juru Masak": <GiCook size={18} color="#f59e42" />,
  "Persiapan (preparation)": <FaHandsWash size={18} color="#fbbf24" />,
  "Pemorsian": <MdOutlineSoupKitchen size={18} color="#fcd34d" />,
  "Pengemudi": <GiSteeringWheel size={18} color="#6A0572" />,
  "Cuci Ompreng": <FaSoap size={18} color="#0ea5e9" />,
  "Kebersihan": <MdOutlineCleaningServices size={18} color="#10b981" />,
  "Keamanan": <MdSecurity size={18} color="#dc2626" />,
};

const jenisWarna = {
  "Kepala SPPG": "#3b82f6",
  "Ahli Gizi": "#38b6ff",
  "Staf Keuangan": "#64748b",
  "Kepala Lapangan": "#f59e42",
  "Kepala Juru Masak": "#f59e42",
  "Juru Masak": "#f59e42",
  "Persiapan (preparation)": "#fbbf24",
  "Pemorsian": "#fcd34d",
  "Pengemudi": "#6A0572",
  "Cuci Ompreng": "#0ea5e9",
  "Kebersihan": "#10b981",
  "Keamanan": "#dc2626",
  "default": "#94a3b8"
};

export default function PetugasBarChart() {
  const [provList, setProvList] = useState([]);
  const [provinsi, setProvinsi] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProv, setLoadingProv] = useState(false);
  const {
    role, axiosJWT,token,
    telp,
    verified,
    loadingExcell,
    setloadingExcell,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
  } = useContext(MyContext);

  // Ambil daftar provinsi berdasarkan role dan kdkanwil
  useEffect(() => {
    const fetchProvinsi = async () => {
      setLoadingProv(true);
      try {
        let query;
        
        // Jika role kanwil (role == 2), filter berdasarkan kdkanwil user
        if ((role === 2 || role === '2' || role === 'kanwil') && kodekanwil) {
          query = `SELECT DISTINCT kodeWil FROM data_bgn.by_petugas_prov WHERE kdkanwil = '${kodekanwil}' ORDER BY kodeWil`;
        } else {
          // Jika role lain (pusat/admin), tampilkan semua
          query = `SELECT DISTINCT kodeWil FROM data_bgn.by_petugas_prov ORDER BY kodeWil`;
        }
        
        const encrypted = Encrypt(query);
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_PETUGAS_BARCHART
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_PETUGAS_BARCHART}${encodeURIComponent(encrypted)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const arr = response.data.result || [];
        const provOptions = arr.map(row => ({
          value: row.kodeWil,
          label: row.kodeWil
        }));
        
        setProvList(provOptions);
        
        // Set default selection untuk role kanwil - auto select provinsi pertama yang tersedia
        if ((role === 2 || role === '2' || role === 'kanwil') && provOptions.length > 0) {
          setProvinsi(provOptions[0]);
        } else if (!(role === 2 || role === '2' || role === 'kanwil')) {
          // Default selection untuk role non-kanwil
          const dkiOption = provOptions.find(p => p.value === "DKI Jakarta");
          setProvinsi(dkiOption || (provOptions.length > 0 ? provOptions[0] : null));
        }
        
      } catch (error) {
        // console.error("Error fetching provinces:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Daftar Provinsi',
          text: 'Terjadi permasalahan saat mengambil data provinsi. Silakan coba lagi nanti.'
        });
        setProvList([]);
      } finally {
        setLoadingProv(false);
      }
    };

    if (token && axiosJWT) {
      fetchProvinsi();
    }
  }, [role, kodekanwil, axiosJWT, token]);

  // Ambil data per provinsi dari backend
  useEffect(() => {
    if (!provinsi) {
      setData([]);
      return;
    }
      
    setLoading(true);
    // Query langsung ambil jenis dari SQL dengan filter kdkanwil jika role kanwil
    let query;
    if ((role === 2 || role === '2' || role === 'kanwil') && kodekanwil) {
      query = `SELECT jenis, COUNT(*) as jumlah FROM data_bgn.by_petugas_prov WHERE kodeWil = '${provinsi.value}' AND kdkanwil = '${kodekanwil}' GROUP BY jenis`;
    } else {
      query = `SELECT jenis, COUNT(*) as jumlah FROM data_bgn.by_petugas_prov WHERE kodeWil = '${provinsi.value}' GROUP BY jenis`;
    }
    
    const encryptedQuery = Encrypt(query);
    const response=axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_PETUGAS_BARCHART
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_PETUGAS_BARCHART}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
        const result = response.data.result || [];
        setData(result);
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data Petugas',
          text: 'Terjadi permasalahan saat mengambil data petugas. Silakan coba lagi nanti.'
        });
   
        // console.log("Error fetching data:", response.data);
        
        
      })
      .finally(() => setLoading(false));
  }, [provinsi, role, kodekanwil, axiosJWT, token]);
  // XAxis dengan icon dinamis sesuai jenis, label vertikal
  const xAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y + 10})`}>
        <foreignObject x={-30} y={0} width={80} height={60}>
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            height: 60 
          }}>
            {jenisIcon[payload.value] || <FaUserTie size={16} color="#9ca3af" />}
            <span
              style={{
                fontSize: 10,
                color: "#6b7280",
                marginTop: 4,
                maxWidth: 70,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                display: "inline-block",
                transform: "rotate(-90deg)",
                transformOrigin: "left bottom",
                height: 60,
                fontFamily: "Inter, Roboto, Arial, sans-serif",
                fontWeight: "400"
              }}
            >
              {payload.value}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };
  // console.log("Provinsi:", provinsi);
  // console.log("Data:", data);
  return (
    <Card 
      style={{ 
        borderRadius: 8, 
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        fontFamily: "Inter, Roboto, Arial, sans-serif"
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
          minWidth: '60px'
        }}>
          Provinsi:
          {(role === 2 || role === '2' || role === 'kanwil') && (
            <span style={{ 
              color: "#6b7280", 
              fontSize: "11px", 
              fontWeight: "400",
              marginLeft: "4px"
            }}>
              (Wilayah Anda - {kodekanwil})
            </span>
          )}
        </span>
        <div style={{ flex: 1, minWidth: '200px', maxWidth: '300px' }}>
          <Select
            options={provList}
            value={provinsi}
            onChange={setProvinsi}
            placeholder={loadingProv ? "Memuat provinsi..." : "Pilih Provinsi"}
            isClearable={!(role === 2 || role === '2' || role === 'kanwil')}
            isLoading={loadingProv}
            isDisabled={loadingProv || ((role === 2 || role === '2' || role === 'kanwil') && provList.length <= 1)}
            styles={selectStyles}
            noOptionsMessage={() => "Tidak ada data provinsi"}
          />
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
        <div style={{ width: "100%" }}>
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
          ) : !provinsi ? (
            <div style={{ 
              textAlign: "center", 
              paddingTop: 120,
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div>
                {(role === 2 || role === '2' || role === 'kanwil') 
                  ? `Data petugas untuk wilayah Anda (${kodekanwil})`
                  : 'Pilih provinsi untuk melihat data petugas'
                }
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                barCategoryGap={40}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="jenis"
                  tick={xAxisTick}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                  interval={0}
                  height={50}
                />
                <YAxis
                  type="number"
                  fontSize={11}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  allowDecimals={false}
                  tick={{ fill: "#6b7280", fontFamily: "Inter, Roboto, Arial, sans-serif" }}
                />
                <Tooltip
                  contentStyle={{ 
                    fontSize: 12, 
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    fontFamily: "Inter, Roboto, Arial, sans-serif"
                  }}
                  labelStyle={{ fontWeight: 500 }}
                  formatter={(value) => value?.toLocaleString("id-ID")}
                />
                <Bar
                  dataKey="jumlah"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                  name="Jumlah Petugas"
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="jumlah"
                    position="top"
                    style={{ 
                      fill: "#374151", 
                      fontWeight: 500, 
                      fontSize: 11,
                      fontFamily: "Inter, Roboto, Arial, sans-serif"
                    }}
                    formatter={value => value?.toLocaleString("id-ID")}
                  />
                  
                  {data.map((entry, idx) => (
                    <Cell key={entry.jenis} fill={jenisWarna[entry.jenis] || jenisWarna.default} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
}
