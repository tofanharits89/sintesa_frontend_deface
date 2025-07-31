import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
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

const CustomValueContainer = (props) => {
  const { children, ...rest } = props;
  const values = props.getValue();
  const maxToShow = 2;
  if (values.length > maxToShow) {
    const display = values
      .slice(0, maxToShow)
      .map((v) => v.label)
      .join(", ");
    return (
      <components.ValueContainer {...props}>
        {`${display}, +${values.length - maxToShow} lainnya`}
      </components.ValueContainer>
    );
  }
  return (
    <components.ValueContainer {...props}>{children}</components.ValueContainer>
  );
};

const SpasialChartLine = () => {
  const [provList, setProvList] = useState([]);
  const [prov, setProv] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProv, setLoadingProv] = useState(false);
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

  // Fetch daftar provinsi berdasarkan role dan kdkanwil
  useEffect(() => {
    const fetchProvinsi = async () => {
      setLoadingProv(true);
      try {
        let query;

        // Jika role kanwil (role == 2), filter berdasarkan kdkanwil user
        if ((role === 2 || role === "2" || role === "kanwil") && kodekanwil) {
          query = `SELECT DISTINCT kanwil FROM data_bgn.data_spasial_mbg WHERE kdkanwil = '${kodekanwil}' ORDER BY kanwil`;
        } else {
          // Jika role lain (pusat/admin), tampilkan semua
          query = `SELECT DISTINCT kanwil FROM data_bgn.data_spasial_mbg ORDER BY kanwil`;
        }

        const encryptedQuery = Encrypt(query);
        const response = await axiosJWT.get(
          import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL
            ? `${
                import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL
              }${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const provinces = response.data.result || [];
        const provOptions = provinces.map((p) => p.kanwil).filter(Boolean);

        setProvList(provOptions);

        // Set default selection untuk role kanwil - auto select semua provinsi yang tersedia
        if (
          (role === 2 || role === "2" || role === "kanwil") &&
          provOptions.length > 0
        ) {
          // Auto select semua provinsi yang sesuai dengan kdkanwil user
          const defaultSelection = provOptions.map((prov) => ({
            value: prov,
            label: prov,
          }));
          setProv(defaultSelection);
        } else if (
          !(role === 2 || role === "2" || role === "kanwil") &&
          provOptions.includes("DKI JAKARTA")
        ) {
          // Default selection untuk role non-kanwil
          setProv([{ value: "DKI JAKARTA", label: "DKI JAKARTA" }]);
        }
      } catch (error) {
        // console.error("Error fetching provinces:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data Provinsi",
          text: "Terjadi permasalahan saat mengambil daftar provinsi.",
        });
        setProvList([]);
      } finally {
        setLoadingProv(false);
      }
    };

    if (token && axiosJWT) {
      fetchProvinsi();
    }
  }, [role, kodekanwil, token, axiosJWT]);

  // Ambil data dari backend
  useEffect(() => {
    if (prov.length === 0) {
      setData([]);
      return;
    }

    setLoading(true);

    try {
      // Compose query SQL dengan filter kdkanwil jika role kanwil
      const provStr = prov.map((p) => `'${p.value}'`).join(",");
      let query;

      if ((role === 2 || role === "2" || role === "kanwil") && kodekanwil) {
        query = `SELECT * FROM data_bgn.data_spasial_mbg WHERE kanwil IN (${provStr}) AND kdkanwil = '${kodekanwil}'`;
      } else {
        query = `SELECT * FROM data_bgn.data_spasial_mbg WHERE kanwil IN (${provStr})`;
      }

      const encryptedQuery = Encrypt(query);

      axiosJWT
        .get(
          import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL
            ? `${
                import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL
              }${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => setData(res.data.result || []))
        .catch((error) => {
          // console.error("Error fetching data:", error);
          Swal.fire({
            icon: "error",
            title: "Gagal Memuat Data",
            text: "Terjadi permasalahan saat mengambil data spasial. Silakan coba lagi nanti.",
          });
          setData([]);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      // console.error("Error in useEffect:", error);
      setLoading(false);
    }
  }, [prov, role, kodekanwil, token, axiosJWT]);

  // Format bulan
  const bulanList = [
    { bln: "jan", label: "Jan" },
    { bln: "feb", label: "Feb" },
    { bln: "mar", label: "Mar" },
    { bln: "apr", label: "Apr" },
    { bln: "mei", label: "Mei" },
    { bln: "jun", label: "Jun" },
    { bln: "jul", label: "Jul" },
    { bln: "agt", label: "Agt" },
    { bln: "sep", label: "Sep" },
    { bln: "okt", label: "Okt" },
    { bln: "nov", label: "Nov" },
    { bln: "des", label: "Des" },
  ];

  // Hanya ambil bulan Jan-Apr
  const bulanListJanApr = bulanList.slice(0, 7);

  const provNames = prov.map((p) => p.value);
  const chartData = bulanListJanApr.map(({ bln, label }) => {
    const row = { bln, label };
    provNames.forEach((pv) => {
      const found = data.find((d) => d.kanwil === pv);
      if (found) row[pv] = found[bln];
    });
    return row;
  }); // Simple color palette
  const colors = [
    "#2563eb", // Blue
    "#059669", // Green
    "#dc2626", // Red
    "#d97706", // Orange
    "#7c3aed", // Purple
    "#0891b2", // Teal
    "#be185d", // Pink
    "#374151", // Gray
  ];

  // Simple tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            padding: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            fontSize: "12px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px 0",
              fontWeight: "500",
              color: "#374151",
              fontSize: "13px",
            }}
          >
            {`Periode: ${label}`}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{
                margin: "2px 0",
                color: entry.color,
                fontWeight: "400",
                fontSize: "12px",
              }}
            >
              {`${entry.dataKey}: ${(entry.value / 1000000000).toFixed(1)}M`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Select option
  const provOptions = provList.map((p) => ({ value: p, label: p }));
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
        <div>
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
              ></span>
            )}
          </label>
          <Select
            isMulti
            options={provOptions}
            value={prov}
            onChange={setProv}
            placeholder={
              loadingProv ? "Memuat provinsi..." : "Pilih provinsi..."
            }
            styles={selectStyles}
            noOptionsMessage={() => "Tidak ada data"}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isSearchable={true}
            isLoading={loadingProv}
            isDisabled={
              loadingProv ||
              ((role === 2 || role === "2" || role === "kanwil") &&
                provList.length <= 1)
            }
            components={{ ValueContainer: CustomValueContainer }}
          />
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ padding: "16px" }}>
        <div style={{ height: 300 }}>
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
          ) : chartData.length === 0 || prov.length === 0 ? (
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
                  : "Pilih Provinsi untuk Memulai"}
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
                  : "Gunakan dropdown untuk memilih provinsi yang ingin dianalisis"}
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
                  tickFormatter={(v) => `${(v / 1000000000).toFixed(1)}M`}
                  tickMargin={4}
                />
                <Tooltip content={<CustomTooltip />} />
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
                {provNames.map((pv, idx) => (
                  <Line
                    key={pv}
                    type="monotone"
                    dataKey={pv}
                    stroke={colors[idx % colors.length]}
                    name={pv}
                    strokeWidth={2}
                    dot={{
                      fill: colors[idx % colors.length],
                      strokeWidth: 2,
                      stroke: "#ffffff",
                      r: 3,
                    }}
                    activeDot={{
                      r: 4,
                      stroke: colors[idx % colors.length],
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
};

export default SpasialChartLine;
