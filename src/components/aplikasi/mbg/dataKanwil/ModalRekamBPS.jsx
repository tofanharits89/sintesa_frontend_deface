import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../../auth/Context";
import ChartRekamBPS from "./chartRekamBPS";
import Encrypt from "../../../../auth/Random";
import Swal from "sweetalert2";

// Helper function untuk menghitung kata
const countWords = (text) => {
  if (!text || text.trim() === "" || text.trim() === "Isi keterangan...")
    return 0;
  return text.trim().split(/\s+/).length;
};

// Validasi schema
const validationSchema = Yup.object({
  kdkanwil: Yup.string().required("Kanwil tidak boleh kosong"),
  indikator: Yup.string().required("Indikator tidak boleh kosong"),
  triwulan: Yup.string().required("Triwulan tidak boleh kosong"),
  tahun: Yup.string().required("Tahun tidak boleh kosong"),
  analisis: Yup.string()
    .required("Analisis tidak boleh kosong")
    .test("not-placeholder", "Analisis tidak boleh kosong", function (value) {
      if (!value || value.trim() === "" || value.trim() === "Isi keterangan...")
        return false;
      return true;
    })
    .test(
      "word-count",
      "Analisis tidak boleh lebih dari 200 kata",
      function (value) {
        if (
          !value ||
          value.trim() === "" ||
          value.trim() === "Isi keterangan..."
        )
          return true;
        return countWords(value) <= 200;
      }
    ),
});

export const ModalRekamBPS = ({ onSave, id, onClose }) => {
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

  const [selectedKdkanwil, setSelectedKdkanwil] = useState(getDefaultKanwil());

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
  // State untuk chart data
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [chartTitle, setChartTitle] = useState("Data Chart BPS");

  // State untuk save data
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // State untuk tracking current selections
  const [currentIndikator, setCurrentIndikator] = useState(
    "Tingkat Inflasi Month to Month (%)"
  );
  const [currentKodeKanwil, setCurrentKodeKanwil] = useState(
    role === "2" && userKdkanwil ? userKdkanwil : "33"
  );

  // Effect untuk load data awal dan saat ada perubahan
  useEffect(() => {
    if (currentIndikator && currentKodeKanwil) {
      fetchChartData(currentIndikator, currentKodeKanwil);
    }
  }, [currentIndikator, currentKodeKanwil]);

  // Effect untuk load data awal saat component mount
  useEffect(() => {
    // Load data awal dengan indikator default
    if (!currentIndikator) {
      setCurrentIndikator("Tingkat Inflasi Month to Month (%)");
    }
  }, []);

  // Mapping dropdown indikator ke endpoint dan konfigurasi
  const indikatorConfig = {
    "Tingkat Inflasi Month to Month (%)": {
      key: "tingkat_inflasi_mtm",
      endpoint: "/inflasi-mtm",
      table: "inflasi_mtm",
      title: "Data Inflasi (mtm,%)",
      available: true,
    },
    "Inflasi Kelompok Makanan, Minuman, Tembakau (%)": {
      key: "inflasi_tembakau",
      endpoint: "/inflasi-tembakau",
      table: "inflasi_makanan_minuman_tembakau",
      title: "Data Inflasi Makanan Minuman Tembakau (%)",
      available: true,
    },
    "Inflasi Kelompok Penyedia Makanan&Minuman/Restoran (%)": {
      key: "inflasi_kelompok_penyedia",
      endpoint: "/inflasi-penyedia",
      table: "inflasi_penyedia_makan_minum",
      title: "Data Inflasi Kelompok Penyedia (%)",
      available: true,
    },
    "Nilai Tukar Petani (NTP) Indeks": {
      key: "ntp_indeks",
      endpoint: "/ntp",
      table: "ntp_ntn",
      title: "Data Nilai Tukar Petani (NTP)",
      available: true,
    },
    "Nilai Tukar Nelayan (NTN) Indeks": {
      key: "ntn_indeks",
      endpoint: "/ntp",
      table: "ntp_ntn",
      title: "Data Nilai Tukar Nelayan (NTN)",
      available: true,
    },
  };
  // Function untuk fetch data berdasarkan indikator dan kode kanwil
  const fetchChartData = async (indikator, kodeKanwil) => {
    if (!indikator) {
      setChartData([]);
      setChartError(null);
      setChartTitle("Data Chart BPS");
      return;
    }

    try {
      setChartLoading(true);
      setChartError(null);

      const config = indikatorConfig[indikator];

      if (!config) {
        setChartError("Indikator tidak dikenali");
        setChartLoading(false);
        return;
      }

      // Update title
      setChartTitle(config.title);

      // Cek apakah endpoint tersedia
      if (!config.available) {
        setChartError(`Endpoint untuk ${indikator} belum tersedia`);
        setChartLoading(false);
        return;
      }
      // Build query berdasarkan indikator
      const query = buildQuery(config.key, kodeKanwil);

      // Encrypt query
      const encryptedQuery = Encrypt(query);

      // Get base URL from environment variable (using the same base as other API calls)
      const baseURL = import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace(
        "/users",
        ""
      );
      const fullURL = `${baseURL}${config.endpoint}?queryParams=${encryptedQuery}`;

      // Fetch data using axiosJWT
      const response = await axiosJWT.get(fullURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.result && data.result.length > 0) {
        // Transform data untuk chart
        const chartData = transformDataForChart(data.result, config.key);
        setChartData(chartData);
      } else {
        setChartData([]);
        setChartError("Tidak ada data tersedia untuk pilihan ini");
      }
    } catch (err) {
      if (err.response) {
        setChartError(`Server error: HTTP status ${err.response.status}`);
      } else if (err.message && err.message.includes("Network Error")) {
        setChartError(`Koneksi gagal: Pastikan backend berjalan`);
      } else {
        console.error("❌ General error:", err.message);
        setChartError(`Gagal mengambil data ${indikator}: ${err.message}`);
      }
    } finally {
      setChartLoading(false);
    }
  };
  // Build query berdasarkan jenis indikator
  const buildQuery = (indikatorKey, kodeKanwilFilter) => {
    switch (indikatorKey) {
      case "tingkat_inflasi_mtm":
        let query =
          "SELECT kode_kanwil, nama_kanwil, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nov, des FROM inflasi_mtm";
        if (kodeKanwilFilter) {
          query += ` WHERE kode_kanwil = '${kodeKanwilFilter}'`;
        }
        query += " ORDER BY kode_kanwil ASC";
        return query; // Template untuk indikator lain
      case "inflasi_tembakau":
        let queryTembakau =
          "SELECT kode_kanwil, nama_kanwil, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nov, des FROM inflasi_makanan_minuman_tembakau";
        if (kodeKanwilFilter) {
          queryTembakau += ` WHERE kode_kanwil = '${kodeKanwilFilter}'`;
        }
        queryTembakau += " ORDER BY kode_kanwil ASC";
        return queryTembakau;
      case "inflasi_kelompok_penyedia":
        let queryPenyedia =
          "SELECT kode_kanwil, nama_kanwil, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nov, des FROM inflasi_penyediaan_makan_minum";
        let whereConditions = [
          "kategori = 'Penyediaan Makanan dan Minuman / Restoran'",
        ];

        if (kodeKanwilFilter) {
          whereConditions.push(`kode_kanwil = '${kodeKanwilFilter}'`);
        }

        queryPenyedia += ` WHERE ${whereConditions.join(" AND ")}`;
        queryPenyedia += " ORDER BY kode_kanwil ASC";
        return queryPenyedia;
      case "ntp_indeks":
        let queryNTP =
          "SELECT kode_kanwil, nama_kanwil, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nov, des FROM ntp_ntn";
        let whereConditionsNTP = ["kategori = 'Petani'"];

        if (kodeKanwilFilter) {
          whereConditionsNTP.push(`kode_kanwil = '${kodeKanwilFilter}'`);
        }

        queryNTP += ` WHERE ${whereConditionsNTP.join(" AND ")}`;
        queryNTP += " ORDER BY kode_kanwil ASC";
        return queryNTP;
      case "ntn_indeks":
        let queryNTN =
          "SELECT kode_kanwil, nama_kanwil, jan, feb, mar, apr, mei, jun, jul, aug, sep, okt, nov, des FROM ntp_ntn";
        let whereConditionsNTN = ["kategori = 'Nelayan'"];

        if (kodeKanwilFilter) {
          whereConditionsNTN.push(`kode_kanwil = '${kodeKanwilFilter}'`);
        }

        queryNTN += ` WHERE ${whereConditionsNTN.join(" AND ")}`;
        queryNTN += " ORDER BY kode_kanwil ASC";
        return queryNTN;

      default:
        console.warn("⚠️ Unknown indikator key:", indikatorKey);
        const defaultQuery =
          "SELECT kode_kanwil, nama_kanwil, jan, feb, mar, apr FROM inflasi_mtm LIMIT 1";
        return defaultQuery;
    }
  };
  // Transform data dari database ke format chart
  const transformDataForChart = (rawData, indikatorKey) => {
    if (!Array.isArray(rawData) || rawData.length === 0) {
      console.warn("⚠️ Raw data kosong atau bukan array");
      return [];
    }
    // Untuk sekarang, handle inflasi_mtm, inflasi_tembakau, inflasi_kelompok_penyedia, ntp_indeks, dan ntn_indeks
    if (
      indikatorKey === "tingkat_inflasi_mtm" ||
      indikatorKey === "inflasi_tembakau" ||
      indikatorKey === "inflasi_kelompok_penyedia" ||
      indikatorKey === "ntp_indeks" ||
      indikatorKey === "ntn_indeks"
    ) {
      // Hanya tampilkan bulan Januari sampai April (data yang tersedia)
      const months = [
        { key: "jan", name: "Jan" },
        { key: "feb", name: "Feb" },
        { key: "mar", name: "Mar" },
        { key: "apr", name: "Apr" },
        { key: "mei", name: "Mei" },
        { key: "jun", name: "Jun" },
      ];

      // Ambil data pertama (jika ada filter kode kanwil) atau data pertama
      const dataToUse = rawData[0] || {};

      // Transform dan filter data yang memiliki nilai
      const chartData = months
        .map((month) => ({
          month: month.name,
          value:
            typeof dataToUse[month.key] === "number" ||
            typeof dataToUse[month.key] === "string"
              ? parseFloat(dataToUse[month.key]) || 0
              : 0,
        }))
        .filter((item) => typeof item.value === "number" && !isNaN(item.value)); // Filter out data yang tidak valid

      return Array.isArray(chartData) ? chartData : [];
    }

    // Template untuk indikator lain
    console.warn("⚠️ Indikator tidak dikenali untuk transform:", indikatorKey);
    return [];
  };
  // Function untuk menyimpan data ke database
  const saveData = async (values) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Extract kode kanwil dari kdkanwil (format: "33 - PAPUA BARAT")
      const kodeKanwil = values.kdkanwil.split(" - ")[0];

      // Convert triwulan format dari Q1,Q2,Q3,Q4 ke I,II,III,IV
      const triwulanMapping = {
        Q1: "I",
        Q2: "II",
        Q3: "III",
        Q4: "IV",
      };
      const triwulanConverted =
        triwulanMapping[values.triwulan] || values.triwulan;
      // Prepare data untuk dikirim ke backend
      const dataToSend = {
        data: {
          kode_kanwil: kodeKanwil, // Extract dari kdkanwil dan gunakan nama field yang benar
          indikator: values.indikator,
          customIndikator: null, // optional field
          customSatuan: "%", // satuan default untuk BPS
          triwulan: triwulanConverted,
          tahun: parseInt(values.tahun), // convert ke integer
          username: username,
          keterangan: values.analisis, // map analisis ke keterangan
          id: "1", // id "1" untuk DataBPS berdasarkan controller
        },
      };

      // Get base URL dari environment variable (sama seperti chart data)
      const baseURL =
        import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace("/users", "") ;
      const saveURL = `${baseURL}/simpan/data/kanwil`;

      // Kirim data ke backend menggunakan axiosJWT
      const response = await axiosJWT.post(saveURL, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = response.data;
      if (response.status === 201) {
        // Berhasil disimpan - tampilkan notifikasi dengan Swal (tanpa await, agar modal langsung tertutup)
        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil disimpan",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

        // Call onSave callback jika ada (untuk parent component)
        if (onSave) {
          // Kirim data yang sudah dimapping, bukan values asli
          const mappedValues = {
            ...values,
            kode_kanwil: kodeKanwil,
            keterangan: values.analisis,
            triwulan: triwulanConverted,
          };
          onSave(mappedValues);
        }
        return true;
      }
    } catch (error) {
      let errorMessage = "Gagal menyimpan data";

      if (error.response) {
        errorMessage = `Server error: HTTP status ${error.response.status}`;
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage = `Koneksi gagal: Pastikan backend berjalan di ${
          import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace("/users", "") 
        }`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setSaveError(errorMessage);
      await Swal.fire({
        title: "Error!",
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

    // Jika word count melebihi 200, potong teks
    if (wordCount > 200) {
      const words = value.trim().split(/\s+/);
      const limitedText = words.slice(0, 200).join(" ");
      setFieldValue("analisis", limitedText);
    } else {
      handleChange(e);
    }
  };
  return (
    <>
      <style>
        {`          .bps-modal-container {
            font-size: 0.65rem;
            font-weight: 400;
            line-height: 1.2;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
            border-radius: 16px;
            border: 1px solid rgba(79, 70, 229, 0.1);
            box-shadow: 0 8px 32px rgba(79, 70, 229, 0.1);
          }
          
          .bps-form-label {
            font-weight: 500;
            color: #374151;
            font-size: 0.8rem;
            margin-bottom: 0.15rem;
            letter-spacing: 0.01em;
            line-height: 1.1;
          }
          
          .bps-form-control {
            border: 1px solid rgba(79, 70, 229, 0.2);
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 400;
            padding: 0.3rem 0.5rem;
            line-height: 1.2;
            transition: all 0.2s ease;
            background: rgba(255, 255, 255, 0.9);
          }
          
          .bps-form-control:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            background: white;
          }
          
          .bps-form-control:hover {
            border-color: rgba(79, 70, 229, 0.3);
          }
          
          .bps-chart-container {
            height: 180px;
            border: 1px solid rgba(79, 70, 229, 0.15);
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.08);
            overflow: hidden;
          } .bps-textarea {
            border: 1px solid rgba(79, 70, 229, 0.2);
            border-radius: 10px;
            background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%);
            font-size: 0.8rem;
            padding: 0.5rem;
            transition: all 0.2s ease;
            resize: vertical;
            min-height: 80px;
            line-height: 1.3;
          }
          
          .bps-textarea::placeholder {
            color: rgba(79, 70, 229, 0.4);
            font-style: italic;
            font-weight: 400;
            opacity: 0.7;
          }
          
          .bps-textarea:focus::placeholder {
            color: rgba(79, 70, 229, 0.3);
            opacity: 0.5;
          }
          
          .bps-textarea:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            background: white;
          }
          
          .bps-word-counter {
            font-size: 0.55rem;
            font-weight: 500;
            padding: 3px 6px;
            border-radius: 10px;
            background: rgba(79, 70, 229, 0.1);
            color: #4f46e5;
          }
          
          .bps-word-counter.warning {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
          }
          
          .bps-word-counter.danger {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }
            .bps-btn-cancel {
            background: rgba(107, 114, 128, 0.1);
            border: 1px solid rgba(107, 114, 128, 0.2);
            color: #6b7280;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.6rem;
            padding: 0.4rem 0.8rem;
            transition: all 0.2s ease;
          }
          
          .bps-btn-cancel:hover {
            background: rgba(107, 114, 128, 0.15);
            border-color: rgba(107, 114, 128, 0.3);
            color: #4b5563;
            transform: translateY(-1px);
          }
          
          .bps-btn-save {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border: none;
            color: white;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.6rem;
            padding: 0.4rem 0.8rem;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
          }
          
          .bps-btn-save:hover:not(:disabled) {
            background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }
          
          .bps-btn-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
            .bps-chart-info {
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
            border: 1px solid rgba(79, 70, 229, 0.1);
            border-radius: 6px;
            padding: 0.4rem 0.6rem;
            color: #4f46e5;
            font-size: 0.6rem;
            font-weight: 500;
          }
          
          .bps-error-alert {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%);
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #dc2626;
            border-radius: 6px;
            padding: 0.5rem;
            font-size: 0.6rem;
            font-weight: 500;
          }
          
          .bps-section-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, rgba(79, 70, 229, 0.2) 50%, transparent 100%);
            margin: 1rem 0;
          }
        `}
      </style>{" "}
      <div className="bps-modal-container p-4">
        <Formik
          initialValues={{
            kdkanwil: getDefaultKanwil(),
            indikator: "Tingkat Inflasi Month to Month (%)",
            triwulan: "I",
            analisis: "",
            tahun: "2025",
            username: username || "n/a",
            id: id,
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values, { resetForm }) => {
            const success = await saveData(values);
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
                    <Form.Label className="bps-form-label">Tahun</Form.Label>
                    <Form.Control
                      as="select"
                      name="tahun"
                      value={values.tahun}
                      onChange={handleChange}
                      className="bps-form-control"
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
                    <Form.Label className="bps-form-label">Triwulan</Form.Label>
                    <Form.Control
                      as="select"
                      name="triwulan"
                      value={values.triwulan}
                      onChange={handleChange}
                      className="bps-form-control"
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
                    <Form.Label className="bps-form-label">Kanwil</Form.Label>
                    <Form.Control
                      as="select"
                      name="kdkanwil"
                      value={values.kdkanwil}
                      onChange={(e) => {
                        handleChange(e);
                        setSelectedKdkanwil(e.target.value);
                        // Update state untuk trigger useEffect - ekstrak kode kanwil
                        const kodeKanwil = e.target.value
                          ? e.target.value.split(" - ")[0]
                          : null;
                        setCurrentKodeKanwil(kodeKanwil);
                      }}
                      className="bps-form-control"
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
              <div className="bps-section-divider"></div>
              {/* Indicator and Chart Row */}
              <Row className="mb-4 g-3">
                <Col xs={12} md={6}>
                  <Form.Group className="mb-0">
                    <Form.Label className="bps-form-label">
                      Indikator
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="indikator"
                      value={values.indikator}
                      onChange={(e) => {
                        handleChange(e);
                        // Update state untuk trigger useEffect
                        setCurrentIndikator(e.target.value);
                      }}
                      className="bps-form-control"
                      isInvalid={touched.indikator && !!errors.indikator}
                    >
                      <option value="">Pilih Indikator</option>
                      <option value="Tingkat Inflasi Month to Month (%)">
                        Tingkat Inflasi Month to Month (%)
                      </option>
                      <option value="Inflasi Kelompok Makanan, Minuman, Tembakau (%)">
                        Inflasi Kelompok Makanan, Minuman, Tembakau (%)
                      </option>
                      <option value="Inflasi Kelompok Penyedia Makanan&Minuman/Restoran (%)">
                        Inflasi Kelompok Penyedia Makanan&Minuman/Restoran (%)
                      </option>
                      <option value="Nilai Tukar Petani (NTP) Indeks">
                        Nilai Tukar Petani (NTP) Indeks
                      </option>
                      <option value="Nilai Tukar Nelayan (NTN) Indeks">
                        Nilai Tukar Nelayan (NTN) Indeks
                      </option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.indikator}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <div
                    className="bps-chart-container"
                    style={{ position: "relative" }}
                  >
                    {/* Safe Chart Wrapper */}
                    {(() => {
                      try {
                        const safeData = Array.isArray(chartData)
                          ? chartData.filter(
                              (item) =>
                                item &&
                                typeof item === "object" &&
                                "month" in item &&
                                "value" in item &&
                                typeof item.month === "string" &&
                                typeof item.value === "number" &&
                                !isNaN(item.value)
                            )
                          : [];
                        return (
                          <ChartRekamBPS
                            data={safeData}
                            loading={chartLoading}
                            error={chartError}
                            title={chartTitle}
                            provinsi={
                              values.kdkanwil
                                ? values.kdkanwil.split(" - ")[1]
                                : null
                            }
                            height={140}
                          />
                        );
                      } catch (error) {
                        return (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              color: "#666",
                              fontSize: "12px",
                            }}
                          >
                            ⚠️ Error rendering chart
                          </div>
                        );
                      }
                    })()}
                    {/* Fallback jika chart kosong dan tidak ada error */}
                    {!chartLoading && !chartError && chartData.length === 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "#666",
                          fontSize: "12px",
                        }}
                      >
                        📊 Pilih indikator untuk menampilkan chart
                      </div>
                    )}
                  </div>
                  {/* Info di bawah chart */}
                  {chartData.length > 0 && !chartLoading && !chartError && (
                    <div className="mt-2">
                      <div className="bps-chart-info">
                        📊 Menampilkan data {chartData.length} bulan (Jan-Apr
                        2025)
                      </div>
                    </div>
                  )}
                </Col>
              </Row>{" "}
              {/* Analysis Section */}
              <Row className="mb-4">
                <Col xs={12}>
                  <Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Form.Label className="bps-form-label mb-0">
                        Analisis
                      </Form.Label>
                      <span
                        className={`bps-word-counter ${
                          countWords(values.analisis) > 200
                            ? "danger"
                            : countWords(values.analisis) > 180
                            ? "warning"
                            : ""
                        }`}
                      >
                        {countWords(values.analisis)}/200 kata
                      </span>
                    </div>{" "}
                    <Form.Control
                      as="textarea"
                      name="analisis"
                      value={values.analisis}
                      onChange={(e) =>
                        handleAnalysisChange(e, handleChange, setFieldValue)
                      }
                      rows={4}
                      placeholder="isi analisis dan keterangan yang relevan..."
                      className="bps-textarea"
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
              <div className="bps-section-divider"></div>
              {/* Buttons */}
              <div className="d-flex justify-content-end gap-3 mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClose(resetForm)}
                  className="bps-btn-cancel"
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  className="bps-btn-save"
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
                    <>💾 Simpan Data</>
                  )}
                </Button>
              </div>
              {/* Error Display */}
              {saveError && (
                <div className="bps-error-alert mt-3">⚠️ {saveError}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
