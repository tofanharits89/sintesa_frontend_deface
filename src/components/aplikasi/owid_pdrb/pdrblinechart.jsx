import React, { useState, useEffect, useContext } from "react";
//import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Encrypt from "../../../auth/Random";
import Select from "react-select";
import {
  FaLeaf,
  FaIndustry,
  FaTools,
  FaMoneyBill,
  FaBuilding,
  FaUserTie,
  FaShieldAlt,
  FaBook,
  FaHeartbeat,
  FaEllipsisH,
} from "react-icons/fa";
import { components } from "react-select";
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
    ":hover": {
      backgroundColor: "#ef4444",
      color: "#ffffff",
    },
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

const kategoriLabelMap = {
  "A Pertanian, Kehutanan dan Perikanan": "Pertanian",
  "B Pertambangan dan Penggalian": "Pertambangan",
  "C Industri Pengolahan": "Industri",
  "D Pengadaan Listrik dan Gas": "Pengadaan Listrik & Gas",
  "E Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang":
    "Pengelolaan Air & Sampah",
  "F Konstruksi": "Konstruksi",
  "G Perdagangan Besar dan Eceran, Reparasi Mobil dan Sepeda Motor":
    "Perdagangan Besar & Ritel",
  "H Transportasi dan Pergudangan": "Transportasi",
  "I Penyediaan Akomodasi dan Makan Minum": "Akomodasi & Mamin",
  "J Informasi dan Komunikasi": "Informasi & Komunikasi",
  "K Jasa Keuangan dan Asuransi": "Jasa Keuangan",
  "L Real Estate": "Real Estate",
  "M,N Jasa Perusahaan": "Jasa Perusahaan",
  "O Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib":
    "Administrasi Pemerintahan",
  "P Jasa Pendidikan": "Jasa Pendidikan",
  "Q Jasa Kesehatan dan Kegiatan Sosial": "Jasa Kesehatan",
  "R,S,T,U Jasa Lainnya": "Jasa Lainnya",
  "Produk Domestik Regional Bruto": "Total PDRB",
};

const kategoriIconMap = {
  "A Pertanian, Kehutanan dan Perikanan": <FaLeaf />,
  "B Pertambangan dan Penggalian": <FaTools />,
  "C Industri Pengolahan": <FaIndustry />,
  "D Pengadaan Listrik dan Gas": <FaTools />,
  "E Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang": <FaTools />,
  "F Konstruksi": <FaTools />,
  "G Perdagangan Besar dan Eceran, Reparasi Mobil dan Sepeda Motor": (
    <FaMoneyBill />
  ),
  "H Transportasi dan Pergudangan": <FaTools />,
  "I Penyediaan Akomodasi dan Makan Minum": <FaBuilding />,
  "J Informasi dan Komunikasi": <FaUserTie />,
  "K Jasa Keuangan dan Asuransi": <FaMoneyBill />,
  "L Real Estate": <FaBuilding />,
  "M,N Jasa Perusahaan": <FaUserTie />,
  "O Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib": (
    <FaShieldAlt />
  ),
  "P Jasa Pendidikan": <FaBook />,
  "Q Jasa Kesehatan dan Kegiatan Sosial": <FaHeartbeat />,
  "R,S,T,U Jasa Lainnya": <FaEllipsisH />,
  "Produk Domestik Regional Bruto": <FaMoneyBill />,
};

const OptionKategori = (props) => (
  <components.Option {...props}>
    <span style={{ marginRight: 8, fontSize: 16, verticalAlign: "middle" }}>
      {kategoriIconMap[props.data.value]}
    </span>
    {props.data.label}
  </components.Option>
);

// Custom ValueContainer untuk multi-select provinsi
const CustomValueContainer = ({ children, ...props }) => {
  const { getValue, hasValue } = props;
  const selectedValues = hasValue ? getValue() : [];
  const nbValues = selectedValues.length;
  const maxDisplayedValues = 2; // Maksimal 2 provinsi yang ditampilkan secara eksplisit

  if (nbValues > maxDisplayedValues) {
    const displayedProvinces = selectedValues
      .slice(0, maxDisplayedValues)
      .map((v) => v.label)
      .join(", ");
    const remainingCount = nbValues - maxDisplayedValues;

    return (
      <components.ValueContainer {...props}>
        <span
          style={{
            color: "#374151",
            fontSize: "13px",
            fontWeight: "400",
            padding: "0 8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {displayedProvinces}, +{remainingCount} lainnya
        </span>
        {children[1]} {/* Keep the dropdown indicator */}
      </components.ValueContainer>
    );
  }

  return (
    <components.ValueContainer {...props}>{children}</components.ValueContainer>
  );
};

export default function PdrbChart() {
  const {
    role,
    axiosJWT,
    token,
    telp,
    verified,
    loadingExcell,
    setloadingExcell,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
  } = useContext(MyContext);
  const [provinsiList, setProvinsiList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [provinsi, setProvinsi] = useState([]); // multi-select, akan diisi berdasarkan role
  const [kategori, setKategori] = useState({
    value: "A Pertanian, Kehutanan dan Perikanan",
    label: kategoriLabelMap["A Pertanian, Kehutanan dan Perikanan"],
  }); // default Pertanian
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProv, setLoadingProv] = useState(false);
  // 1. Ambil kategori lengkap dari DB (query khusus)
  useEffect(() => {
    const query = "SELECT DISTINCT kategori FROM data_bgn.pdrb_lu_tw_2024";
    const encryptedQuery = Encrypt(query);
    axiosJWT
      .get(
        import.meta.env.VITE_REACT_APP_LOCAL_PDRB
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_PDRB}${encodeURIComponent(
              encryptedQuery
            )}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const result = res.data.result || [];
        setKategoriList(result.map((row) => row.kategori));
      })
      .catch(() => {
        setKategoriList([]);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Kategori",
          text: "Terjadi kesalahan saat mengambil data kategori PDRB.",
        });
      });
  }, [axiosJWT, token]);

  // Ambil daftar provinsi berdasarkan role dan kode_kanwil
  useEffect(() => {
    const fetchProvinsi = async () => {
      setLoadingProv(true);
      try {
        let query;

        // Jika role kanwil (role == 2), filter berdasarkan kode_kanwil user
        if (role === "2" && kodekanwil) {
          query = `SELECT DISTINCT provinsi FROM data_bgn.pdrb_lu_tw_2024 WHERE kode_kanwil = '${kodekanwil}' ORDER BY provinsi`;
        } else {
          // Jika role lain (pusat/admin), tampilkan semua
          query = `SELECT DISTINCT provinsi FROM data_bgn.pdrb_lu_tw_2024 ORDER BY provinsi`;
        }

        const encryptedQuery = Encrypt(query);
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_PDRB
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_PDRB}${encodeURIComponent(
                encryptedQuery
              )}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const provinces = response.data.result || [];
        const provOptions = provinces.map((p) => p.provinsi).filter(Boolean);

        setProvinsiList(provOptions);

        // Set default selection untuk role kanwil - auto select semua provinsi yang tersedia
        if (role === "2" && provOptions.length > 0) {
          // Auto select semua provinsi yang sesuai dengan kode_kanwil user
          const defaultSelection = provOptions.map((prov) => ({
            value: prov,
            label: prov,
          }));
          setProvinsi(defaultSelection);
        } else if (!(role === "2") && provOptions.includes("DKI Jakarta")) {
          // Default selection untuk role non-kanwil
          setProvinsi([{ value: "DKI Jakarta", label: "DKI Jakarta" }]);
        }
      } catch (error) {
        // console.error("Error fetching provinces:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data Provinsi",
          text: "Terjadi permasalahan saat mengambil daftar provinsi .",
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

  // Fetch data setiap kali provinsi/kategori berubah
  useEffect(() => {
    if (provinsi.length === 0 || !kategori) {
      setData([]);
      return;
    }
    setLoading(true);
    // Buat query string multi-value
    const provinsiStr = provinsi.map((p) => `'${p.value}'`).join(",");
    const kategoriStr = `'${kategori.value}'`;

    let query;
    // Tambahkan filter kode_kanwil jika role kanwil
    if ((role === 2 || role === "2" || role === "kanwil") && kodekanwil) {
      query = `SELECT * FROM data_bgn.pdrb_lu_tw_2024 WHERE provinsi IN (${provinsiStr}) AND kategori IN (${kategoriStr}) AND kode_kanwil = '${kodekanwil}'`;
    } else {
      query = `SELECT * FROM data_bgn.pdrb_lu_tw_2024 WHERE provinsi IN (${provinsiStr}) AND kategori IN (${kategoriStr})`;
    }

    const encryptedQuery = Encrypt(query);
    axiosJWT
      .get(
        import.meta.env.VITE_REACT_APP_LOCAL_PDRB
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_PDRB}${encodeURIComponent(
              encryptedQuery
            )}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => setData(res.data.result || []))
      .catch(() => {
        setData([]);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Gagal ambil data PDRB!",
        });
      })
      .finally(() => setLoading(false));
  }, [provinsi, kategori, role, kodekanwil, axiosJWT, token]);

  // Transform data agar X axis = TW1, TW2, TW3, TW4 dan setiap provinsi jadi satu line
  const twList = [
    { tw: "TW1", label: "Q1" },
    { tw: "TW2", label: "Q2" },
    { tw: "TW3", label: "Q3" },
    { tw: "TW4", label: "Q4" },
  ];
  const provinsiNames = provinsi.map((p) => p.value);

  const chartData = twList.map(({ tw, label }) => {
    const row = { tw, label };
    provinsiNames.forEach((pv) => {
      const found = data.find((d) => d.provinsi === pv);
      if (found) row[pv] = found[tw.toLowerCase()];
    });
    return row;
  });

  // Opsi untuk react-select
  const provinsiOptions = provinsiList.map((p) => ({ value: p, label: p }));
  const kategoriOptions = kategoriList.map((k) => ({
    value: k,
    label: kategoriLabelMap[k] || k,
  }));
  //const kategoriOptions = kategoriList.map(k => ({ value: k, label: k }));
  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        padding: 0,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      {/* Simple Dropdown Header */}
      <div
        style={{
          background: "#f9fafb",
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ minWidth: 200, flex: 1 }}>
            <label
              style={{
                display: "block",
                color: "#374151",
                fontSize: "12px",
                fontWeight: "500",
                marginBottom: "4px",
              }}
            >
              Pilih Provinsi
              {(role === 2 || role === "2" || role === "kanwil") && (
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "11px",
                    fontWeight: "400",
                    marginLeft: "4px",
                  }}
                >
                  (Wilayah Anda - {kodekanwil})
                </span>
              )}
            </label>
            <Select
              isMulti
              options={provinsiOptions}
              value={provinsi}
              onChange={setProvinsi}
              placeholder={
                loadingProv
                  ? "Memuat provinsi..."
                  : provinsiOptions.length === 0
                  ? "Tidak ada data"
                  : "Pilih provinsi..."
              }
              styles={selectStyles}
              components={{ ValueContainer: CustomValueContainer }}
              isDisabled={
                loadingProv ||
                provinsiOptions.length === 0 ||
                ((role === 2 || role === "2" || role === "kanwil") &&
                  provinsiList.length <= 1)
              }
              isLoading={loadingProv}
              noOptionsMessage={() => "Tidak ada data"}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isSearchable={true}
            />
          </div>
          <div style={{ minWidth: 200, flex: 1 }}>
            <label
              style={{
                display: "block",
                color: "#374151",
                fontSize: "12px",
                fontWeight: "500",
                marginBottom: "4px",
              }}
            >
              Pilih Kategori
            </label>
            <Select
              options={kategoriOptions}
              value={kategori}
              onChange={setKategori}
              placeholder={
                kategoriOptions.length === 0
                  ? "Tidak ada data"
                  : "Pilih kategori..."
              }
              styles={selectStyles}
              isDisabled={kategoriOptions.length === 0}
              components={{ Option: OptionKategori }}
              getOptionLabel={(option) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: 8,
                      fontSize: 14,
                      verticalAlign: "middle",
                    }}
                  >
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "8px",
              }}
            >
              <Spinner style={{ color: "#2563eb" }} />
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                Memuat data...
              </p>
            </div>
          ) : chartData.length === 0 || provinsi.length === 0 || !kategori ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                background: "#f9fafb",
                borderRadius: "4px",
                padding: "24px",
                border: "1px dashed #d1d5db",
              }}
            >
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "32px",
                  marginBottom: "8px",
                }}
              >
                📊
              </div>
              <h4
                style={{
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "0 0 4px 0",
                }}
              >
                {role === 2 || role === "2" || role === "kanwil"
                  ? "Data Wilayah Anda"
                  : "Pilih Provinsi dan Kategori"}
              </h4>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                  margin: 0,
                  textAlign: "center",
                  maxWidth: "200px",
                }}
              >
                {role === 2 || role === "2" || role === "kanwil"
                  ? `Data akan ditampilkan sesuai wilayah kerja Anda (${kodekanwil})`
                  : "Gunakan dropdown untuk memilih provinsi dan kategori yang ingin dianalisis"}
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
                    fill: "#6b7280",
                  }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  tickMargin={8}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#6b7280",
                  }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  tickMargin={4}
                />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "4px",
                    fontSize: "12px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={24}
                  wrapperStyle={{
                    fontSize: "11px",
                    fontWeight: "400",
                    paddingTop: "12px",
                  }}
                  iconType="line"
                />
                {provinsiNames.map((pv, idx) => (
                  <Line
                    key={pv}
                    type="monotone"
                    dataKey={pv}
                    stroke={
                      [
                        "#2563eb",
                        "#059669",
                        "#dc2626",
                        "#d97706",
                        "#7c3aed",
                        "#0891b2",
                      ][idx % 6]
                    }
                    name={pv}
                    strokeWidth={2}
                    dot={{
                      fill: [
                        "#2563eb",
                        "#059669",
                        "#dc2626",
                        "#d97706",
                        "#7c3aed",
                        "#0891b2",
                      ][idx % 6],
                      strokeWidth: 2,
                      stroke: "#ffffff",
                      r: 3,
                    }}
                    activeDot={{
                      r: 4,
                      stroke: [
                        "#2563eb",
                        "#059669",
                        "#dc2626",
                        "#d97706",
                        "#7c3aed",
                        "#0891b2",
                      ][idx % 6],
                      strokeWidth: 2,
                      fill: "#ffffff",
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
