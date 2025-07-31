import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import MyContext from "../../../../auth/Context";
import ChartRekamBapanas from "./chartRekamBapanas";
import Encrypt from "../../../../auth/Random";
import Select from "react-select";

const countWords = (text) => {
  if (!text || text.trim() === "" || text.trim() === "Isi keterangan...")
    return 0;
  return text.trim().split(/\s+/).length;
};

const validationSchema = Yup.object({
  kdkanwil: Yup.string().required("Kanwil tidak boleh kosong"),
  indikator: Yup.string().required("Indikator tidak boleh kosong"),
  // satuan: Yup.string().required("Satuan tidak boleh kosong"), // Hapus validasi satuan karena hanya tampilan
  triwulan: Yup.string().required("Triwulan tidak boleh kosong"),
  tahun: Yup.string().required("Tahun tidak boleh kosong"),
  analisis: Yup.string()
    .required("Analisis tidak boleh kosong")
    .test(
      "word-count",
      "Analisis tidak boleh lebih dari 200 kata",
      function (value) {
        if (!value) return true;
        return countWords(value) <= 200;
      }
    ),
});

export const ModalRekamBapanas = ({ onSave, id, onClose }) => {
  const {
    username,
    axiosJWT,
    token,
    role,
    kdkanwil: userKdkanwil,
  } = useContext(MyContext);

  // Logic untuk menentukan default kanwil berdasarkan role
  const getDefaultKanwil = () => {
    if (role === "2" && userKdkanwil) {
      // Mapping kode kanwil ke nama kanwil untuk role 2
      const kanwilMapping = {
        "01": "01 - DAERAH ISTIMEWA ACEH",
        "02": "02 - SUMATERA UTARA",
        "03": "03 - SUMATERA BARAT",
        "04": "04 - RIAU",
        "05": "05 - JAMBI",
        "06": "06 - SUMATERA SELATAN",
        "07": "07 - LAMPUNG",
        "08": "08 - BENGKULU",
        "09": "09 - BANGKA BELITUNG",
        10: "10 - BANTEN",
        11: "11 - DKI JAKARTA",
        12: "12 - JAWA BARAT",
        13: "13 - JAWA TENGAH",
        14: "14 - DI JOGJAKARTA",
        15: "15 - JAWA TIMUR",
        16: "16 - KALIMANTAN BARAT",
        17: "17 - KALIMANTAN TENGAH",
        18: "18 - KALIMANTAN SELATAN",
        19: "19 - KALIMANTAN TIMUR",
        20: "20 - BALI",
        21: "21 - NUSA TENGGARA BARAT",
        22: "22 - NUSA TENGGARA TIMUR",
        23: "23 - SULAWESI SELATAN",
        24: "24 - SULAWESI TENGAH",
        25: "25 - SULAWESI TENGGARA",
        26: "26 - GORONTALO",
        27: "27 - SULAWESI UTARA",
        28: "28 - MALUKU UTARA",
        29: "29 - MALUKU",
        30: "30 - PAPUA",
        31: "31 - KEPULAUAN RIAU",
        32: "32 - SULAWESI BARAT",
        33: "33 - PAPUA BARAT",
        34: "34 - KALIMANTAN UTARA",
      };
      return kanwilMapping[userKdkanwil] || "33 - PAPUA BARAT";
    }
    return "33 - PAPUA BARAT";
  };

  const [kdkanwil, setkdkanwil] = useState(getDefaultKanwil());

  // Function untuk memfilter option kanwil berdasarkan role
  const getKanwilOptions = () => {
    const allOptions = [
      { value: "01 - DAERAH ISTIMEWA ACEH", kode: "01" },
      { value: "02 - SUMATERA UTARA", kode: "02" },
      { value: "03 - SUMATERA BARAT", kode: "03" },
      { value: "04 - RIAU", kode: "04" },
      { value: "05 - JAMBI", kode: "05" },
      { value: "06 - SUMATERA SELATAN", kode: "06" },
      { value: "07 - LAMPUNG", kode: "07" },
      { value: "08 - BENGKULU", kode: "08" },
      { value: "09 - BANGKA BELITUNG", kode: "09" },
      { value: "10 - BANTEN", kode: "10" },
      { value: "11 - DKI JAKARTA", kode: "11" },
      { value: "12 - JAWA BARAT", kode: "12" },
      { value: "13 - JAWA TENGAH", kode: "13" },
      { value: "14 - DI JOGJAKARTA", kode: "14" },
      { value: "15 - JAWA TIMUR", kode: "15" },
      { value: "16 - KALIMANTAN BARAT", kode: "16" },
      { value: "17 - KALIMANTAN TENGAH", kode: "17" },
      { value: "18 - KALIMANTAN SELATAN", kode: "18" },
      { value: "19 - KALIMANTAN TIMUR", kode: "19" },
      { value: "20 - BALI", kode: "20" },
      { value: "21 - NUSA TENGGARA BARAT", kode: "21" },
      { value: "22 - NUSA TENGGARA TIMUR", kode: "22" },
      { value: "23 - SULAWESI SELATAN", kode: "23" },
      { value: "24 - SULAWESI TENGAH", kode: "24" },
      { value: "25 - SULAWESI TENGGARA", kode: "25" },
      { value: "26 - GORONTALO", kode: "26" },
      { value: "27 - SULAWESI UTARA", kode: "27" },
      { value: "28 - MALUKU UTARA", kode: "28" },
      { value: "29 - MALUKU", kode: "29" },
      { value: "30 - PAPUA", kode: "30" },
      { value: "31 - KEPULAUAN RIAU", kode: "31" },
      { value: "32 - SULAWESI BARAT", kode: "32" },
      { value: "33 - PAPUA BARAT", kode: "33" },
      { value: "34 - KALIMANTAN UTARA", kode: "34" },
    ];

    // Jika role === "2", hanya tampilkan kanwil sesuai userKdkanwil
    if (role === "2" && userKdkanwil) {
      return allOptions.filter((option) => option.kode === userKdkanwil);
    }

    // Jika role lainnya, tampilkan semua kanwil
    return allOptions;
  };
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [chartTitle, setChartTitle] = useState("Data Chart Komoditas");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [currentIndikator, setCurrentIndikator] = useState("Karbohidrat");
  const [currentKodeKanwil, setCurrentKodeKanwil] = useState(
    role === "2" && userKdkanwil ? userKdkanwil : "33"
  );
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  useEffect(() => {
    if (currentIndikator && currentKodeKanwil) {
      fetchChartData(currentIndikator, currentKodeKanwil);
    }
  }, [currentIndikator, currentKodeKanwil]);

  // Fetch kategori berdasarkan cluster yang dipilih
  const fetchCategories = async (cluster) => {
    if (!cluster) {
      setCategories([]);
      setSelectedCategories([]);
      setShowCategoryDropdown(false);
      return;
    }

    try {
      setCategoriesLoading(true);
      // Query untuk mengambil kategori berdasarkan cluster
      let query = `SELECT DISTINCT Kategori FROM rekap_harga_komoditas WHERE Cluster = '${cluster}' ORDER BY Kategori ASC`;
      const encryptedQuery = Encrypt(query);
      const baseURL =
        import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace("/users", "") ;
      const fullURL = `${baseURL}/komoditas?queryParams=${encryptedQuery}`;

      const response = await fetch(fullURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.result && data.result.length > 0) {
        const categoryList = data.result.map((item) => item.Kategori);
        setCategories(categoryList);
        setSelectedCategories(categoryList); // Default semua kategori terpilih
        setShowCategoryDropdown(true);
      } else {
        setCategories([]);
        setSelectedCategories([]);
        setShowCategoryDropdown(false);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
      setSelectedCategories([]);
      setShowCategoryDropdown(false);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const indikatorConfig = {
    "Beras Medium": {
      key: "beras_medium",
      endpoint: "/komoditas",
      table: "rekap_harga_komoditas",
      title: "Harga Beras Medium (Rp/Kg)",
      available: true,
    },
    "Bawang Merah": {
      key: "bawang_merah",
      endpoint: "/komoditas",
      table: "rekap_harga_komoditas",
      title: "Harga Bawang Merah (Rp/Kg)",
      available: true,
    },
    // Tambahkan indikator lain sesuai kebutuhan
  };
  // Update fetchChartData agar query filter berdasarkan Cluster dan kategori yang dipilih
  const fetchChartData = async (cluster, kodeKanwil) => {
    if (!cluster || !kodeKanwil) {
      setChartData([]);
      setChartError(null);
      setChartTitle("Data Chart Komoditas");
      return;
    }
    try {
      setChartLoading(true);
      setChartError(null);
      setChartTitle(cluster);

      // Jika ada kategori yang dipilih, filter berdasarkan kategori tersebut
      let categoryFilter = "";
      if (selectedCategories.length > 0) {
        const categoryList = selectedCategories
          .map((cat) => `'${cat}'`)
          .join(",");
        categoryFilter = ` AND Kategori IN (${categoryList})`;
      }

      // Query filter cluster, kode_kanwil, dan kategori yang dipilih
      let query = `SELECT * FROM rekap_harga_komoditas WHERE kode_kanwil = '${kodeKanwil}' AND Cluster = '${cluster}'${categoryFilter} ORDER BY Kategori ASC`;
      const encryptedQuery = Encrypt(query);
      const baseURL =
        import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace("/users", "") ;
      const fullURL = `${baseURL}/komoditas?queryParams=${encryptedQuery}`;
      const response = await fetch(fullURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.result && data.result.length > 0) {
        const chartData = transformDataForChart(data.result);
        setChartData(chartData);
      } else {
        setChartData([]);
        setChartError("Tidak ada data tersedia untuk pilihan ini");
      }
    } catch (err) {
      setChartError(`Gagal mengambil data: ${err.message}`);
    } finally {
      setChartLoading(false);
    }
  };

  // Update transformDataForChart agar menampilkan Kategori di chart
  // Handler untuk mengubah pilihan kategori
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category];

      // Update chart data berdasarkan kategori yang baru dipilih
      setTimeout(() => {
        fetchChartData(currentIndikator, currentKodeKanwil);
      }, 100);

      return newSelection;
    });
  };
  // Handler untuk select/deselect all categories
  const handleSelectAllCategories = () => {
    const newSelection =
      selectedCategories.length === categories.length ? [] : [...categories];
    setSelectedCategories(newSelection);

    // Update chart data
    setTimeout(() => {
      fetchChartData(currentIndikator, currentKodeKanwil);
    }, 100);
  };

  // Update transformDataForChart agar menampilkan Kategori di chart
  const transformDataForChart = (rows) => {
    if (!rows || rows.length === 0) return [];
    // Filter hanya bulan yang ada datanya (Januari sampai Mei)
    const months = [
      { key: "Jan", name: "Jan" },
      { key: "Feb", name: "Feb" },
      { key: "Mar", name: "Mar" },
      { key: "Apr", name: "Apr" },
      { key: "Mei", name: "Mei" },
      { key: "Jun", name: "Jun" },
    ];
    // Untuk setiap baris (Kategori), buat satu line di chart
    // Output: [{ month: 'Jan', 'Beras Medium': 10000, 'Jagung': 9000, ... }, ...]
    const transformedData = months.map((month) => {
      const monthObj = { month: month.name };
      rows.forEach((row) => {
        monthObj[row.Kategori] = parseFloat(row[month.key]) || 0;
      });
      return monthObj;
    });
    return transformedData;
  };
  const saveData = async (mappedValues) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const triwulanMapping = { Q1: "I", Q2: "II", Q3: "III", Q4: "IV" };
      const triwulanConverted =
        triwulanMapping[mappedValues.triwulan] || mappedValues.triwulan;

      const dataToSend = {
        data: {
          kode_kanwil: mappedValues.kode_kanwil,
          indikator: mappedValues.indikator,
          customIndikator: mappedValues.customIndikator || "",
          triwulan: triwulanConverted,
          tahun: mappedValues.tahun,
          username: mappedValues.username,
          keterangan: mappedValues.keterangan,
          id: mappedValues.id,
        },
      };
      const baseURL = import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace(
        "/users",
        ""
      );
      const saveURL = `${baseURL}/simpan/data/kanwil`;
      const response = await fetch(saveURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (response.status === 201) {
        // Berhasil disimpan - tampilkan notifikasi dengan Swal (tanpa await, agar modal langsung tertutup)
        Swal.fire({
          title: "Berhasil!",
          text: "Data Bapanas berhasil disimpan.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

        // Call onSave callback jika ada (untuk parent component)
        if (onSave) {
          onSave(mappedValues);
        }
        return true;
      }
    } catch (error) {
      let errorMessage = "Gagal menyimpan data";
      if (error.message.includes("HTTP error")) {
        errorMessage = `Server error: ${error.message}`;
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = `Koneksi gagal: Pastikan backend berjalan di ${baseURL}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setSaveError(errorMessage);

      await Swal.fire({
        title: "Gagal Menyimpan!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  const handleClose = (resetForm) => {
    resetForm();
    setSaveError(null);
    // Tutup modal jika ada callback dari parent
    if (onClose) {
      onClose();
    }
  };

  const handleAnalysisChange = (e, handleChange, setFieldValue) => {
    const value = e.target.value;
    const wordCount = countWords(value);
    if (wordCount > 200) {
      const words = value.trim().split(/\s+/);
      const limitedText = words.slice(0, 200).join(" ");
      setFieldValue("analisis", limitedText);
    } else {
      handleChange(e);
    }
  };

  // Data untuk react-select dengan breakdown
  const kelompokKomoditasOptions = [
    {
      value: "Karbohidrat",
      label: "Karbohidrat",
      breakdown: [
        "Beras Premium",
        "Beras Medium",
        "Beras SPHP",
        "Jagung Tk Peternak",
        "Tepung Terigu (Curah)",
        "Tepung Terigu Kemasan",
      ],
    },
    {
      value: "Protein Hewani",
      label: "Protein Hewani",
      breakdown: [
        "Daging Sapi Murni",
        "Daging Ayam Ras",
        "Telur Ayam Ras",
        "Ikan Kembung",
        "Ikan Tongkol",
        "Ikan Bandeng",
        "Daging Kerbau Beku (Impor Luar Negeri)",
        "Daging Kerbau Segar (Lokal)",
      ],
    },
    {
      value: "Minyak & Lemak",
      label: "Minyak & Lemak",
      breakdown: [
        "Minyak Goreng Kemasan",
        "Minyak Goreng Curah",
        "Minyakita",
      ],
    },
    {
      value: "Sayur & Bumbu",
      label: "Sayur & Bumbu",
      breakdown: [
        "Bawang Merah",
        "Bawang Putih Bonggol",
        "Cabai Merah Keriting",
        "Cabai Merah Besar",
        "Cabai Rawit Merah",
      ],
    },
    {
      value: "Lain-lain",
      label: "Lain-lain",
      breakdown: [
        "Kedelai Biji Kering (Impor)",
        "Gula Konsumsi",
        "Garam Konsumsi",
      ],
    },
  ];

  // Komponen custom option untuk react-select
  const OptionWithTooltip = (props) => {
    const { innerProps, innerRef, data, isFocused } = props;
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 10,
        y: rect.top - 10
      });
      setShowTooltip(true);
    };

    const handleMouseLeave = () => {
      setShowTooltip(false);
    };

    return (
      <>
        <div
          ref={innerRef}
          {...innerProps}
          style={{
            background: isFocused ? "#bbf7d044" : "white",
            padding: "8px 12px",
            position: "relative",
            cursor: "pointer",
          }}
          className="option-with-tooltip"
        >
          {data.label}
          <span
            style={{
              marginLeft: 8,
              color: "#16a34a",
              fontSize: "0.95em",
              cursor: "help",
              position: "relative",
            }}
            className="option-tooltip-trigger"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16" style={{verticalAlign:'middle'}}>
              <circle cx="8" cy="8" r="8" fill="#bbf7d0"/>
              <text x="8" y="12" textAnchor="middle" fontSize="8" fill="#166534" fontWeight="bold">i</text>
            </svg>
          </span>
        </div>
        {showTooltip && (
          <div
            style={{
              position: 'fixed',
              left: tooltipPosition.x + 'px',
              top: tooltipPosition.y + 'px',
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              boxShadow: '0 4px 16px #22c55e22',
              padding: '10px 16px 8px 16px',
              minWidth: '200px',
              maxWidth: '280px',
              zIndex: 99999,
              fontSize: '0.95em',
              fontWeight: 400,
              whiteSpace: 'normal',
              pointerEvents: 'none',
            }}
          >
            <b style={{ color: '#16a34a' }}>{data.label}</b>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.85em' }}>
              {data.breakdown.map((komoditas) => (
                <li key={komoditas}>{komoditas}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <style>{`
        .bapanas-modal-container {
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1.2;
          background: linear-gradient(135deg, #bbf7d044 0%, #f0fdf488 100%);
          border-radius: 16px;
          border: 1px solid #22c55e22;
          box-shadow: 0 8px 32px #22c55e11;
        }
        .bapanas-form-label {
          font-weight: 500;
          color: #166534;
          font-size: 0.8rem;
          margin-bottom: 0.15rem;
          letter-spacing: 0.01em;
          line-height: 1.1;
        }
        .bapanas-form-control {
          border: 1px solid #22c55e22;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 400;
          padding: 0.3rem 0.5rem;
          line-height: 1.2;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.92);
        }
        .bapanas-form-control:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px #bbf7d066;
          background: white;
        }
        .bapanas-form-control:hover {
          border-color: #16a34a44;
        }
        .bapanas-textarea {
          border: 1px solid #22c55e22;
          border-radius: 10px;
          background: linear-gradient(135deg, #f0fdf488 0%, #bbf7d044 100%);
          font-size: 0.8rem;
          padding: 0.5rem;
          transition: all 0.2s ease;
          resize: vertical;
          min-height: 80px;
          line-height: 1.3;
        }
        .bapanas-textarea::placeholder {
          color: #22c55e55;
          font-style: italic;
          font-weight: 400;
          opacity: 0.7;
        }
        .bapanas-textarea:focus::placeholder {
          color: #16a34a33;
          opacity: 0.5;
        }
        .bapanas-word-counter {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 3px 6px;
          border-radius: 10px;
          background: #bbf7d088;
          color: #166534;
        }
        .bapanas-word-counter.warning {
          background: #bbf7d055;
          color: #22c55e;
        }
        .bapanas-word-counter.danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
        .bapanas-btn-cancel {
          background: rgba(107, 114, 128, 0.1);
          border: 1px solid rgba(107, 114, 128, 0.2);
          color: #6b7280;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          transition: all 0.2s ease;
        }
        .bapanas-btn-cancel:hover {
          background: rgba(107, 114, 128, 0.15);
          border-color: rgba(107, 114, 128, 0.3);
          color: #4b5563;
          transform: translateY(-1px);
        }
        .bapanas-btn-save {
          background: linear-gradient(135deg, #22c55e88 0%, #4ade8088 100%);
          border: none;
          color: #f0fdf4;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.6rem;
          padding: 0.4rem 0.8rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px #22c55e22;
        }
        .bapanas-btn-save:hover:not(:disabled) {
          background: linear-gradient(135deg, #4ade8088 0%, #22c55e88 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px #22c55e33;
        }
        .bapanas-btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .bapanas-chart-info {
          background: linear-gradient(135deg, #bbf7d044 0%, #f0fdf488 100%);
          border: 1px solid #22c55e22;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          color: #166534;
          font-size: 0.6rem;
          font-weight: 500;
        }
        .bapanas-error-alert {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #dc2626;
          border-radius: 8px;
          padding: 0.5rem;
          font-size: 0.6rem;
          font-weight: 500;
        }
        .bapanas-section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #22c55e33 50%, transparent 100%);
          margin: 1rem 0;
        }
        /* Pastikan react-select menu tidak memotong tooltip */
        .react-select__menu {
          overflow: visible !important;
        }
        .react-select__menu-list {
          overflow: visible !important;
        }
      `}</style>
      <div className="bapanas-modal-container p-4">
        <Formik
          initialValues={{
            kdkanwil: getDefaultKanwil(),
            indikator: "Karbohidrat",
            satuan: "Rp/Kg",
            triwulan: "I",
            analisis: "",
            tahun: "2025",
            username: username || "n/a",
            id: id,
            id: id,
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, { resetForm }) => {
            // Mapping field agar sesuai backend untuk DataBapanas
            const mappedValues = {
              kode_kanwil: values.kdkanwil.split(" - ")[0], // Extract kode saja
              indikator: values.indikator,
              customIndikator: values.customIndikator || "",
              triwulan: values.triwulan,
              tahun: parseInt(values.tahun),
              username: values.username,
              keterangan: values.analisis, // Map analisis -> keterangan
              id: "2", // ID untuk DataBapanas model
            };

            const success = await saveData(mappedValues);
            if (success) {
              handleClose(resetForm);
            }
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            resetForm,
          }) => (
            <Form onSubmit={handleSubmit} className="p-0">
              {/* Header Row */}
              <Row className="mb-3 g-3">
                <Col xs={6} md={2}>
                  <Form.Group className="mb-0">
                    <Form.Label className="bapanas-form-label">
                      Tahun
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="tahun"
                      value={values.tahun}
                      onChange={handleChange}
                      className="bapanas-form-control"
                      isInvalid={touched.tahun && !!errors.tahun}
                    >
                      <option value="">Pilih Tahun</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.tahun}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={6} md={2}>
                  <Form.Group className="mb-0">
                    <Form.Label className="bapanas-form-label">
                      Triwulan
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="triwulan"
                      value={values.triwulan}
                      onChange={handleChange}
                      className="bapanas-form-control"
                      isInvalid={touched.triwulan && !!errors.triwulan}
                    >
                      <option value="">Pilih Triwulan</option>
                      <option value="I">I</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.triwulan}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12} md={8}>
                  <Form.Group className="mb-0">
                    <Form.Label className="bapanas-form-label">
                      Kanwil
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="kdkanwil"
                      value={values.kdkanwil}
                      onChange={(e) => {
                        handleChange(e);
                        setkdkanwil(e.target.value);
                        const kodeKanwil = e.target.value
                          ? e.target.value.split(" - ")[0]
                          : null;
                        setCurrentKodeKanwil(kodeKanwil);
                        fetchChartData(values.indikator, kodeKanwil);
                      }}
                      className="bapanas-form-control"
                      isInvalid={touched.kdkanwil && !!errors.kdkanwil}
                      disabled={role === "2"} // Disable dropdown untuk role 2
                    >
                      <option value="">Pilih Kanwil</option>
                      {getKanwilOptions().map((option) => (
                        <option key={option.kode} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.kdkanwil}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <div className="bapanas-section-divider"></div>
              {/* Komoditas, Satuan, Chart */}
              <Row className="mb-4 g-3">
                <Col xs={12} md={4}>
                  <Form.Group className="mb-0">
                    <Form.Label className="bapanas-form-label">
                      Kelompok Komoditas
                    </Form.Label>
                    <div style={{ position: "relative" }}>
                      <Select
                        name="indikator"
                        value={kelompokKomoditasOptions.find(opt => opt.value === values.indikator) || null}
                        onChange={option => {
                          setFieldValue("indikator", option ? option.value : "");
                          setCurrentIndikator(option ? option.value : "");
                          fetchChartData(option ? option.value : "", currentKodeKanwil);
                        }}
                        options={kelompokKomoditasOptions}
                        placeholder="Pilih Komoditas"
                        isClearable
                        classNamePrefix="react-select"
                        components={{ Option: OptionWithTooltip }}
                        styles={{
                          control: (base) => ({ ...base, minHeight: 36, fontSize: '0.9em' }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      {touched.indikator && errors.indikator && (
                        <div className="invalid-feedback d-block">{errors.indikator}</div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
                <Col xs={12} md={2}>
                  <Form.Group className="mb-0">
                    <Form.Label className="bapanas-form-label">
                      Satuan
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="satuan"
                      value={values.satuan}
                      readOnly
                      className="bapanas-form-control"
                      style={{
                        backgroundColor: "#fffbea",
                        border: "1px solid #fde68a",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <div
                    style={{
                      height: "180px",
                      border: "1px solid #fde68a",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #fffbea 0%, #fefce8 100%)",
                      boxShadow: "0 2px 8px rgba(245, 158, 11, 0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <ChartRekamBapanas
                      data={chartData}
                      loading={chartLoading}
                      error={chartError}
                      title={chartTitle}
                      provinsi={
                        values.kdkanwil ? values.kdkanwil.split(" - ")[1] : null
                      }
                      height={140}
                    />
                  </div>
                  {/* Info di bawah chart */}
                  {chartData.length > 0 && !chartLoading && !chartError && (
                    <div className="mt-2">
                      <div className="bapanas-chart-info">
                        📊 Menampilkan data {chartData.length} bulan
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
              {/* Analysis Section */}
              <Row className="mb-4">
                <Col xs={12}>
                  <Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="bapanas-form-label mb-0">
                        Analisis
                      </Form.Label>
                      <span
                        className={`bapanas-word-counter ${
                          countWords(values.analisis) > 200
                            ? "danger"
                            : countWords(values.analisis) > 180
                            ? "warning"
                            : ""
                        }`}
                      >
                        {countWords(values.analisis)}/200 kata
                      </span>
                    </div>
                    <Form.Control
                      as="textarea"
                      name="analisis"
                      value={values.analisis}
                      onChange={(e) =>
                        handleAnalysisChange(e, handleChange, setFieldValue)
                      }
                      rows={4}
                      placeholder="isi analisis dan keterangan yang relevan..."
                      className="bapanas-textarea"
                      isInvalid={touched.analisis && !!errors.analisis}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.analisis}
                    </Form.Control.Feedback>
                    {countWords(values.analisis) > 180 &&
                      countWords(values.analisis) <= 200 && (
                        <Form.Text className="text-warning small mt-1">
                          ⚠️ Mendekati batas maksimal 200 kata
                        </Form.Text>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <div className="bapanas-section-divider"></div>
              {/* Buttons */}
              <div className="d-flex justify-content-end gap-3 mt-4">
                <Button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>Simpan Data</>
                  )}
                </Button>
              </div>
              {/* Error Display */}
              {saveError && (
                <div className="bapanas-error-alert mt-3">⚠️ {saveError}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
