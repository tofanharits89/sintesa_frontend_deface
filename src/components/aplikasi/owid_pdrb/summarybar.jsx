import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Encrypt from "../../../auth/Random";
import Select from "react-select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList, Cell } from "recharts";
import { Card, Spinner } from "react-bootstrap";
import { FaClipboardList, FaLayerGroup, FaUserTie, FaTruck } from "react-icons/fa";
import Swal from "sweetalert2";
import MyContext from "../../../auth/Context";

const kategoriIcon = {
  "SPPG": <FaClipboardList size={18} color="#38b6ff" />,
  "Kelompok": <FaLayerGroup size={18} color="#f59e42" />,
  "Petugas": <FaUserTie size={18} color="#10b981" />,
  "Supplier": <FaTruck size={18} color="#6A0572" />,
};

const kategoriWarna = {
  "SPPG": "#38b6ff",
  "Kelompok": "#f59e42",
  "Petugas": "#10b981",
  "Supplier": "#6A0572",
};

export default function SummaryBarChart() {
  const [provList, setProvList] = useState([]);
  const [provinsi, setProvinsi] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
      role, axiosJWT,token,
      telp,
      verified,
      loadingExcell,
      setloadingExcell,
      kdkppn: kodekppn,
      kdkanwil: kodekanwil,
    } = useContext(MyContext);
  

  // Ambil daftar provinsi untuk dropdown
  useEffect(() => {
    let query = "SELECT DISTINCT dsp.wilkode, dsp.wilnama, rp.kdkanwil, rp.nmkanwil FROM data_bgn.data_summary_prov dsp LEFT JOIN data_bgn.ref_provinsi rp ON dsp.wilkode = rp.wilkode";
     // Filter berdasarkan role kanwil
    // role "2" adalah kanwil
    if (role === "2" && kodekanwil) {
      // Menggunakan INNER JOIN dan filter untuk memastikan hanya data dengan kdkanwil yang sesuai
      query = "SELECT DISTINCT dsp.wilkode, dsp.wilnama, rp.kdkanwil, rp.nmkanwil FROM data_bgn.data_summary_prov dsp INNER JOIN data_bgn.ref_provinsi rp ON dsp.wilkode = rp.wilkode";
      query += ` WHERE rp.kdkanwil = '${kodekanwil}'`;
    }
    
    query += " ORDER BY dsp.wilnama";
    
    
    const encrypted = Encrypt(query);
    axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_BARCHART
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_BARCHART}${encodeURIComponent(encrypted)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      .then(res => {
        const arr = res.data.result || [];
        
        const mappedList = arr.map(row => ({
          value: row.wilkode,
          label: role === "2" && kodekanwil ? 
            `${row.wilnama}` : 
            row.wilnama
        }));
        
        setProvList(mappedList);
        
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Daftar Provinsi',
          text: 'Terjadi permasalahan saat mengambil data provinsi. Silakan coba lagi nanti.'
        });
      });
  }, [role, kodekanwil, axiosJWT, token]);

  // Auto-select provinsi berdasarkan role setelah data dimuat
  useEffect(() => {
    if (provList.length > 0) {
      if (role === "2") { // role "2" adalah kanwil
        // Untuk role kanwil, selalu pilih provinsi pertama yang tersedia
        setProvinsi(provList[0]);
      } else if (!provinsi) {
        // Untuk role non-kanwil, set default ke DKI Jakarta jika ada, atau provinsi pertama
        const defaultProv = provList.find(prov => prov.value === "31") || provList[0];
        setProvinsi(defaultProv);
      }
    }
  }, [provList, role]);

  // Fetch data summary untuk provinsi terpilih
  useEffect(() => {
    if (!provinsi) {
      setData([]);
      return;
    }
    setLoading(true);
    
    let query = `SELECT * FROM data_bgn.data_summary_prov WHERE wilkode = '${provinsi.value}'`;
    
    // Tambahkan filter berdasarkan role kanwil
    // role "2" adalah kanwil
    if (role === "2" && kodekanwil) {
      query += ` AND kdkanwil = '${kodekanwil}'`;
    }
    
    const encrypted = Encrypt(query);
    axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_BARCHART
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_SUMMARY_BARCHART}${encodeURIComponent(encrypted)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
      .then(res => {
        const row = res.data.result?.[0];
        if (row) {
          setData([
            { kategori: "SPPG", jumlah: row.jumlahsppg },
            { kategori: "Kelompok", jumlah: row.jumlahkelompok },
            { kategori: "Petugas", jumlah: row.jumlahpetugas },
            { kategori: "Supplier", jumlah: row.jumlahsupplier },
          ]);
        } else {
          setData([]);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data Grafik',
          text: 'Terjadi permasalahan saat mengambil data summary. Silakan coba lagi nanti.'
        });
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [provinsi, role, kodekanwil, axiosJWT, token]);

  // Custom XAxis: icon kecil di atas, label kecil di kanan icon
  const xAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y + 10})`}>
        <foreignObject x={-30} y={0} width={60} height={40}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            {kategoriIcon[payload.value]}
            <span style={{ fontSize: 11, color: "#555", marginLeft: 4 }}>{payload.value}</span>
          </div>
        </foreignObject>
      </g>
    );
  };
  return (
    <Card style={{ 
      borderRadius: 8, 
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
      padding: 0,
      border: "1px solid #e5e7eb",
      background: "#ffffff",
    }}>
      {/* Simple Dropdown Header */}
      <div style={{
        background: "#f9fafb",
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb"
      }}>
        <div style={{ maxWidth: 250 }}>
          <label style={{ 
            display: "block", 
            color: "#374151", 
            fontSize: "12px", 
            fontWeight: "500", 
            marginBottom: "4px"
          }}>
            Pilih Provinsi
          </label>
          <Select
            options={provList}
            value={provinsi}
            onChange={setProvinsi}
            placeholder="Pilih provinsi..."
            isClearable={!(role === "2" && provList.length === 1)}
            isDisabled={role === "2" && provList.length === 1}
            styles={{
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
            }}
          />
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ padding: "16px" }}>
        <div style={{ width: "100%" }}>
          {loading ? (
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              justifyContent: "center",
              height: "320px",
              gap: "8px"
            }}>
              <Spinner style={{ color: "#2563eb" }} />
              <p style={{ 
                color: "#6b7280", 
                fontSize: "12px", 
                margin: 0
              }}>
                Memuat data...
              </p>
            </div>
          ) : data.length === 0 || !provinsi ? (
            <div style={{
              display: "flex",
              flexDirection: "column", 
              alignItems: "center",
              justifyContent: "center",
              height: "320px",
              background: "#f9fafb",
              borderRadius: "4px",
              padding: "24px",
              border: "1px dashed #d1d5db"
            }}>
              <div style={{ color: "#9ca3af", fontSize: "32px", marginBottom: "8px" }}>📊</div>
              <h4 style={{ 
                color: "#374151", 
                fontSize: "14px", 
                fontWeight: "500", 
                margin: "0 0 4px 0"
              }}>
                Pilih Provinsi untuk Memulai
              </h4>
              <p style={{ 
                color: "#6b7280", 
                fontSize: "12px", 
                margin: 0,
                textAlign: "center",
                maxWidth: "200px"
              }}>
                Gunakan dropdown untuk memilih provinsi yang ingin dianalisis
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={data}
                margin={{ top: 30, right: 30, left: 30, bottom: 60 }}
                barCategoryGap={40}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="kategori"
                  tick={xAxisTick}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  height={50}
                />
                <YAxis
                  type="number"
                  tick={{ 
                    fontSize: 11, 
                    fill: "#6b7280"
                  }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ 
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                  }}
                  labelStyle={{ fontWeight: "500" }}
                />
                <Bar
                  dataKey="jumlah"
                  radius={[8, 8, 0, 0]}
                  barSize={38}
                  name="Jumlah"
                  fill="#38b6ff"
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="jumlah"
                    position="top"
                    style={{ fill: "#374151", fontWeight: "500", fontSize: "12px" }}
                    formatter={value => value?.toLocaleString("id-ID")}
                  />
                  {/* Custom warna bar per kategori */}
                  {data.map((entry, idx) => (
                    <Cell key={entry.kategori} fill={kategoriWarna[entry.kategori]} />
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
