import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Encrypt from "../../../auth/Random";
import Select, { components } from "react-select";
import { FaLeaf, FaSeedling, FaDrumstickBite, FaEgg, FaFish, FaCarrot, FaPepperHot, FaCookie, FaTint, FaBox, FaCheese } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import Swal from 'sweetalert2';
import { useContext } from "react";
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

export default function KomoditasChartLine() {
  const [provinsiList, setProvinsiList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [provinsi, setProvinsi] = useState([]);
  const [kategori, setKategori] = useState({ value: "Beras Premium", label: "Beras Premium" });
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
  
  const kategoriLabelMap = {
  "Beras Premium": "Beras Premium",
  "Beras Medium": "Beras Medium",
  "Beras SPHP": "Beras SPHP",
  "Jagung Tk Peternak": "Jagung Peternak",
  "Kedelai Biji Kering (Impor)": "Kedelai Impor",
  "Bawang Merah": "Bawang Merah",
  "Bawang Putih Bonggol": "Bawang Putih",
  "Cabai Merah Keriting": "Cabai Merah Keriting",
  "Cabai Merah Besar": "Cabai Merah Besar",
  "Daging Sapi Murni": "Daging Sapi",
  "Cabai Rawit Merah": "Cabai Rawit",
  "Daging Ayam Ras": "Ayam Ras",
  "Telur Ayam Ras": "Telur Ayam",
  "Gula Konsumsi": "Gula",
  "Minyak Goreng Kemasan": "Minyak Kemasan",
  "Minyak Goreng Curah": "Minyak Curah",
  "Tepung Terigu (Curah)": "Tepung Curah",
  "Minyakita": "Minyakita",
  "Tepung Terigu Kemasan": "Tepung Kemasan",
  "Ikan Kembung": "Ikan Kembung",
  "Ikan Tongkol": "Ikan Tongkol",
  "Ikan Bandeng": "Ikan Bandeng",
  "Garam Konsumsi": "Garam",
  "Daging Kerbau Beku (Impor Luar Negeri)": "Kerbau Beku (Impor)",
  "Daging Kerbau Segar (Lokal)": "Kerbau Segar (Lokal)",
};

const kategoriIconMap = {
  "Beras Premium": <FaLeaf />,
  "Beras Medium": <FaLeaf />,
  "Beras SPHP": <FaLeaf />,
  "Jagung Tk Peternak": <FaSeedling />,
  "Kedelai Biji Kering (Impor)": <FaSeedling />,
  "Bawang Merah": <FaCarrot />,
  "Bawang Putih Bonggol": <FaCarrot />,
  "Cabai Merah Keriting": <FaPepperHot />,
  "Cabai Merah Besar": <FaPepperHot />,
  "Daging Sapi Murni": <GiCow />,
  "Cabai Rawit Merah": <FaPepperHot />,
  "Daging Ayam Ras": <FaDrumstickBite />,
  "Telur Ayam Ras": <FaEgg />,
  "Gula Konsumsi": <FaCookie />,
  "Minyak Goreng Kemasan": <FaTint />,
  "Minyak Goreng Curah": <FaTint />,
  "Tepung Terigu (Curah)": <FaBox />,
  "Minyakita": <FaTint />,
  "Tepung Terigu Kemasan": <FaBox />,
  "Ikan Kembung": <FaFish />,
  "Ikan Tongkol": <FaFish />,
  "Ikan Bandeng": <FaFish />,
  "Garam Konsumsi": <FaCheese />,
  "Daging Kerbau Beku (Impor Luar Negeri)": <GiCow />,
  "Daging Kerbau Segar (Lokal)": <GiCow />,
};
const OptionKategori = (props) => (
  <components.Option {...props}>
    <span style={{ marginRight: 8, fontSize: 16, verticalAlign: "middle" }}>
      {kategoriIconMap[props.data.value]}
    </span>
    {kategoriLabelMap[props.data.value] || props.data.label}
  </components.Option>
);

// Custom ValueContainer untuk multi-select provinsi
const CustomValueContainer = ({ children, ...props }) => {
  const { getValue, hasValue } = props;
  const selectedValues = hasValue ? getValue() : [];
  const nbValues = selectedValues.length;
  const maxDisplayedValues = 2; // Maksimal 2 provinsi yang ditampilkan secara eksplisit

  if (nbValues > maxDisplayedValues) {
    const displayedProvinces = selectedValues.slice(0, maxDisplayedValues).map(v => v.label).join(", ");
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
          {displayedProvinces}, +{remainingCount} lainnya
        </span>
        {children[1]} {/* Keep the dropdown indicator */}
      </components.ValueContainer>
    );
  }

  return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
};


  // Ambil daftar kategori (distinct)
  useEffect(() => {
    const query = "SELECT DISTINCT kategori FROM data_bgn.rekap_harga_komoditas";
    const encryptedQuery = Encrypt(query);
    axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS 
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS}${encodeURIComponent(encryptedQuery)}` 
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(res => {
          const result = res.data.result || [];
          setKategoriList(result.map(row => row.kategori));
        })
        .catch(() => {
          setKategoriList([]);
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Data',
            text: 'Terjadi kesalahan saat mengambil daftar kategori komoditas.',
          });
        });
  }, [token, axiosJWT]);

  // Ambil daftar provinsi berdasarkan role dan kdkanwil
  useEffect(() => {
    const fetchProvinsi = async () => {
      setLoadingProv(true);
      try {
        let query;
        
        // Jika role kanwil (role == 2), filter berdasarkan kdkanwil user
        if ((role === 2 || role === '2' || role === 'kanwil') && kodekanwil) {
          // Query untuk mengambil provinsi berdasarkan kode_kanwil dari tabel rekap_harga_komoditas
          query = `SELECT DISTINCT Provinsi FROM data_bgn.rekap_harga_komoditas WHERE kode_kanwil = '${kodekanwil}' ORDER BY Provinsi`;
        } else {
          // Jika role lain (pusat/admin), tampilkan semua
          query = `SELECT DISTINCT Provinsi FROM data_bgn.rekap_harga_komoditas ORDER BY Provinsi`;
        }
        
        const encryptedQuery = Encrypt(query);
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const provinces = response.data.result || [];
        const provOptions = provinces.map(p => p.Provinsi).filter(Boolean);
        
        setProvinsiList(provOptions);
        
        // Set default selection untuk role kanwil - auto select semua provinsi yang tersedia
        if ((role === 2 || role === '2' || role === 'kanwil') && provOptions.length > 0) {
          // Auto select semua provinsi yang sesuai dengan kdkanwil user
          const defaultSelection = provOptions.map(prov => ({ value: prov, label: prov }));
          setProvinsi(defaultSelection);
        } else if (!(role === 2 || role === '2' || role === 'kanwil') && provOptions.includes("DKI Jakarta")) {
          // Default selection untuk role non-kanwil
          setProvinsi([{ value: "DKI Jakarta", label: "DKI Jakarta" }]);
        }
        
      } catch (error) {
        // console.error("Error fetching provinces:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data Provinsi',
          text: 'Terjadi permasalahan saat mengambil daftar provinsi.'
        });
        setProvinsiList([]);
      } finally {
        setLoadingProv(false);
      }
    };

    if (token && axiosJWT) {
      fetchProvinsi();
    }
  }, [role, kodekanwil, token, axiosJWT]);

  // Ambil data filtered
  useEffect(() => {
    if (provinsi.length === 0 || !kategori) {
      setData([]);
      return;
    }
    setLoading(true);
    const provStr = provinsi.map(p => `'${p.value}'`).join(",");
    const katStr = `'${kategori.value}'`;
    
    let query;
    // Tambahkan filter kode_kanwil jika role kanwil
    if ((role === 2 || role === '2' || role === 'kanwil') && kodekanwil) {
      query = `SELECT * FROM data_bgn.rekap_harga_komoditas WHERE Provinsi IN (${provStr}) AND Kategori IN (${katStr}) AND kode_kanwil = '${kodekanwil}'`;
    } else {
      query = `SELECT * FROM data_bgn.rekap_harga_komoditas WHERE Provinsi IN (${provStr}) AND Kategori IN (${katStr})`;
    }
    
    const encryptedQuery = Encrypt(query);
    axiosJWT.get(
      import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS
        ? `${import.meta.env.VITE_REACT_APP_LOCAL_KOMODITAS}${encodeURIComponent(encryptedQuery)}`
        : "",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => setData(res.data.result || []))
      .catch(() => {
        setData([]);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: 'Terjadi kesalahan saat mengambil data komoditas.',
        });
      })
      .finally(() => setLoading(false));
  }, [provinsi, kategori, role, kodekanwil, token, axiosJWT]);

  // Format bulan
  const bulanList = [
    { bln: "Jan", label: "Jan" }, { bln: "Feb", label: "Feb" }, { bln: "Mar", label: "Mar" },
    { bln: "Apr", label: "Apr" }, { bln: "Mei", label: "Mei" }, { bln: "Jun", label: "Jun" },
    { bln: "Jul", label: "Jul" }, { bln: "Agt", label: "Agt" }, { bln: "Sep", label: "Sep" },
    { bln: "Okt", label: "Okt" }, { bln: "Nov", label: "Nov" }, { bln: "Des", label: "Des" }
  ];
  const provNames = provinsi.map(p => p.value);
  const filteredBulanList = bulanList.filter(({ bln }) =>
    provNames.some(pv => {
      const found = data.find(d => d.Provinsi === pv);
      return found && found[bln] != null && found[bln] !== '';
    })
  );
  const chartData = filteredBulanList.map(({ bln, label }) => {
    const row = { bln, label };
    provNames.forEach(pv => {
      const found = data.find(d => d.Provinsi === pv);
      if (found) row[pv] = found[bln];
    });
    return row;
  });

  // Opsi Select
  const provOptions = provinsiList.map(p => ({ value: p, label: p }));
  const kategoriOptions = kategoriList.map(k => ({
    value: k,
    label: k,
  }));
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
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ minWidth: 200, flex: 1 }}>
            <label style={{ 
              display: "block", 
              color: "#374151", 
              fontSize: "12px", 
              fontWeight: "500", 
              marginBottom: "4px"
            }}>
              Pilih Provinsi
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
            </label>
            <Select
              isMulti
              options={provOptions}
              value={provinsi}
              onChange={setProvinsi}
              placeholder={loadingProv ? "Memuat provinsi..." : "Pilih provinsi..."}
              styles={selectStyles}
              components={{ ValueContainer: CustomValueContainer }}
              noOptionsMessage={() => "Tidak ada data"}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isSearchable={true}
              isLoading={loadingProv}
              isDisabled={loadingProv || ((role === 2 || role === '2' || role === 'kanwil') && provinsiList.length <= 1)}
            />
          </div>
          <div style={{ minWidth: 200, flex: 1 }}>
            <label style={{ 
              display: "block", 
              color: "#374151", 
              fontSize: "12px", 
              fontWeight: "500", 
              marginBottom: "4px"
            }}>
              Pilih Komoditas
            </label>
            <Select
              options={kategoriOptions}
              value={kategori}
              onChange={setKategori}
              placeholder="Pilih komoditas..."
              styles={selectStyles}
              components={{ Option: OptionKategori }}
              getOptionLabel={(option) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ marginRight: 8, fontSize: 14, verticalAlign: "middle" }}>
                    {kategoriIconMap[option.value]}
                  </span>
                  {kategoriLabelMap[option.value] || option.label}
                </div>
              )}
              noOptionsMessage={() => "Tidak ada data"}
            />
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ padding: "16px" }}>
        <div style={{ height: 280 }}>
          {loading ? (
            <div style={{ 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              justifyContent: "center",
              height: "100%",
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
          ) : chartData.length === 0 || provinsi.length === 0 || !kategori ? (
            <div style={{
              display: "flex",
              flexDirection: "column", 
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
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
                {(role === 2 || role === '2' || role === 'kanwil') ? 'Data Wilayah Anda' : 'Pilih Provinsi dan Komoditas'}
              </h4>
              <p style={{ 
                color: "#6b7280", 
                fontSize: "12px", 
                margin: 0,
                textAlign: "center",
                maxWidth: "200px"
              }}>
                {(role === 2 || role === '2' || role === 'kanwil')
                  ? `Data akan ditampilkan sesuai wilayah kerja Anda (${kodekanwil})`
                  : 'Gunakan dropdown untuk memilih provinsi dan komoditas yang ingin dianalisis'
                }
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis 
                  dataKey="label" 
                  tick={{ 
                    fontSize: 11, 
                    fill: "#6b7280"
                  }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  tickMargin={8}
                />
                <YAxis
                  tick={{ 
                    fontSize: 11, 
                    fill: "#6b7280"
                  }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  tickMargin={4}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={24}
                  wrapperStyle={{ 
                    fontSize: "11px", 
                    fontWeight: "400",
                    paddingTop: "12px"
                  }}
                  iconType="line"
                />
                {provNames.map((pv, idx) => (
                  <Line
                    key={pv}
                    type="monotone"
                    dataKey={pv}
                    stroke={["#2563eb","#059669","#dc2626","#d97706","#7c3aed","#0891b2"][idx % 6]}
                    name={pv}
                    strokeWidth={2}
                    dot={{ 
                      fill: ["#2563eb","#059669","#dc2626","#d97706","#7c3aed","#0891b2"][idx % 6], 
                      strokeWidth: 2,
                      stroke: "#ffffff",
                      r: 3
                    }}
                    activeDot={{ 
                      r: 4, 
                      stroke: ["#2563eb","#059669","#dc2626","#d97706","#7c3aed","#0891b2"][idx % 6],
                      strokeWidth: 2,
                      fill: "#ffffff"
                    }}
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
