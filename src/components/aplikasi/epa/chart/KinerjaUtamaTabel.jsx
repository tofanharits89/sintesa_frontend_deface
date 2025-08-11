import React, { useContext, useState, useEffect } from "react";
import { Table, Card, Spinner, Container } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import { EPANOTIF } from "../../notifikasi/Omspan";
import EditModalKinerja from "../modal/editModalKinerjaUtama";
import Eselon1New from "../KinerjaUtama/eselon1_new";
import numeral from "numeral";

const EpaKinerjaUtama = ({ thang, periode, dept, kdkanwil, kdkppn }) => {
  const { axiosJWT, token, dataEpa } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);
  const [eselonData, setEselonData] = useState([]);
  const [satkerData, setSatkerData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [roData, setRoData] = useState([]);
  const [cardDataKinerja, setCardDataKinerja] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State untuk modal edit
  const [modalData, setModalData] = useState({
    show: false,
    title: "",
    jenis: "",
  });

  // Fetch data untuk satker utama dari endpoint pagu_real_utama
  const fetchKinerjaData = async () => {
    setLoading(true);
    try {
      // Fetch data untuk satker dari endpoint pagu_real_utama (digitalisasi_epa) dengan base URL dari env (port 88)
      const satkerApiUrl = import.meta.env.VITE_REACT_APP_LOCAL_PAGU_REAL_UTAMA;
      console.log(
        "Fetching from URL:",
        `${satkerApiUrl}?thang=${thang}&kdkanwil=${kdkanwil}&kdkppn=${kdkppn}`
      );

      const satkerRes = await axiosJWT.get(
        `${satkerApiUrl}?thang=${thang}&kdkanwil=${kdkanwil}&kdkppn=${kdkppn}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      console.log("Response received:", satkerRes);
      console.log("Response status:", satkerRes.status);
      console.log("Response headers:", satkerRes.headers);
      console.log("Response data:", satkerRes.data);
      console.log("Response data type:", typeof satkerRes.data);
      console.log("Is response data array?", Array.isArray(satkerRes.data));

      // Cek apakah data adalah array atau objek dengan property data
      let processedData = [];
      if (Array.isArray(satkerRes.data)) {
        processedData = satkerRes.data;
      } else if (satkerRes.data && Array.isArray(satkerRes.data.data)) {
        processedData = satkerRes.data.data;
      } else if (
        satkerRes.data &&
        satkerRes.data.results &&
        Array.isArray(satkerRes.data.results)
      ) {
        processedData = satkerRes.data.results;
      } else {
        console.warn("Unexpected data format:", satkerRes.data);
        processedData = [];
      }

      console.log("Processed data:", processedData);
      console.log("Processed data length:", processedData.length);

      // Set data satker
      setSatkerData(processedData);
    } catch (error) {
      console.error("Error fetching kinerja data:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });

      // Set dummy data untuk testing jika server error
      if (error.response?.status === 500) {
        console.error("Server error - using dummy data for testing");
        const dummyData = [
          {
            kdsatker: "001",
            nmsatker: "Satker Test 1",
            pagu: 1000000000,
            real1: 100000000,
            real2: 200000000,
            real3: 300000000,
            blokir: 50000000,
          },
          {
            kdsatker: "002",
            nmsatker: "Satker Test 2",
            pagu: 2000000000,
            real1: 200000000,
            real2: 400000000,
            real3: 600000000,
            blokir: 100000000,
          },
        ];
        setSatkerData(dummyData);
      } else {
        // Set empty data jika error lain
        setSatkerData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function untuk fetch data berdasarkan tipe
  const fetchDataByType = async (type) => {
    try {
      // Sesuaikan endpoint berdasarkan tipe data yang dibutuhkan
      const apiUrl = import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_KINERJAUTAMA;
      const response = await axiosJWT.get(
        `${apiUrl}?type=${type}&year=${thang}&periode=${periode}&kdkanwil=${kdkanwil}&kdkppn=${kdkppn}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return [];
    }
  };

  // Fetch data kinerja utama untuk modal edit
  const fetchCardDataKinerja = async () => {
    try {
      const apiUrl = import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_KINERJAUTAMA;
      const response = await axiosJWT.get(
        `${apiUrl}?year=${thang}&periode=${periode}&kdkanwil=${kdkanwil}&kdkppn=${kdkppn}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCardDataKinerja(response.data || []);
    } catch (error) {
      console.error("Error fetching card data kinerja:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with:", {
      dataEpa,
      thang,
      periode,
      kdkanwil,
      kdkppn,
    });

    if (dataEpa?.tab !== 4) {
      console.log("Tab is not 4, skipping fetch. Current tab:", dataEpa?.tab);
      return;
    }

    console.log("Calling fetchKinerjaData...");
    fetchKinerjaData();
    // fetchCardDataKinerja();
  }, [dataEpa, thang, periode, kdkanwil, kdkppn]);

  // Function untuk menghitung growth percentage
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // Handle modal functions
  const handleClose = () => {
    setModalData({ show: false, title: "", jenis: "" });
  };

  const handleShow = (title, jenis) => {
    setModalData({ show: true, title, jenis });
  };

  // Handle save data function
  const handleSaveData = async (formData) => {
    setLoadingSimpan(true);
    try {
      const payload = {
        data: dataEpa,
        jenis: formData.jenis,
        title: formData.title,
        description: formData.description,
      };

      const response = await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANUBAH_KINERJAUTAMA,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        EPANOTIF("Data Berhasil Disimpan");
        setErrorMessage(""); // Reset error message
        setRefresh((prev) => !prev);
      } else {
        setErrorMessage("Terjadi kesalahan saat menyimpan data.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Terjadi kesalahan jaringan atau server.");
      handleHttpError("Terjadi kesalahan: ", error);
    } finally {
      setLoadingSimpan(false);
    }
  };

  // Component untuk menampilkan tabel kinerja hanya untuk Satker Utama
  const renderKinerjaSatkerTable = (title, data, columns, jenis) => {
    console.log("Rendering table with data:", data);
    console.log("Data length:", data?.length);

    return (
      <div className="mb-4">
        <h6 style={{ marginBottom: "0", fontWeight: "bold", color: "#333" }}>
          {title}
        </h6>
        <Table bordered responsive size="sm" style={{ marginBottom: "20px" }}>
          <thead>
            <tr style={{ backgroundColor: "#e9ecef" }}>
              <th
                rowSpan="2"
                className="text-center align-middle"
                style={{ fontSize: "12px", padding: "8px 4px", width: "10%" }}
              >
                {columns[0]}
              </th>
              <th
                rowSpan="2"
                className="text-center align-middle"
                style={{ fontSize: "12px", padding: "8px 4px", width: "15%" }}
              >
                {columns[1]}
              </th>
              <th
                colSpan="3"
                className="text-center"
                style={{
                  fontSize: "12px",
                  padding: "8px 4px",
                  backgroundColor: "#d1ecf1",
                }}
              >
                2024
              </th>
              <th
                colSpan="3"
                className="text-center"
                style={{
                  fontSize: "12px",
                  padding: "8px 4px",
                  backgroundColor: "#d4edda",
                }}
              >
                2025
              </th>
              <th
                rowSpan="2"
                className="text-center align-middle"
                style={{ fontSize: "12px", padding: "8px 4px", width: "8%" }}
              >
                Blokir
              </th>
              <th
                rowSpan="2"
                className="text-center align-middle"
                style={{ fontSize: "12px", padding: "8px 4px", width: "10%" }}
              >
                GROWTH (yoy)
              </th>
              <th
                rowSpan="2"
                className="text-center align-middle"
                style={{ fontSize: "12px", padding: "8px 4px", width: "12%" }}
              >
                Keterangan
              </th>
            </tr>
            <tr style={{ backgroundColor: "#e9ecef" }}>
              <th
                className="text-center"
                style={{ fontSize: "11px", padding: "6px 4px" }}
              >
                Pagu
              </th>
              <th
                className="text-center"
                style={{ fontSize: "11px", padding: "6px 4px" }}
              >
                Real
              </th>
              <th
                className="text-center"
                style={{ fontSize: "11px", padding: "6px 4px" }}
              >
                %
              </th>
              <th
                className="text-center"
                style={{ fontSize: "11px", padding: "6px 4px" }}
              >
                Pagu
              </th>
              <th
                className="text-center"
                style={{ fontSize: "11px", padding: "6px 4px" }}
              >
                Real
              </th>
              <th
                className="text-center"
                style={{ fontSize: "11px", padding: "6px 4px" }}
              >
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center">
                  <Spinner animation="border" size="sm" /> Loading...
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center">
                  Tidak ada data atau data error
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: "11px", padding: "4px" }}>
                    {item.kdsatker || item.kode || "-"}
                  </td>
                  <td style={{ fontSize: "11px", padding: "4px" }}>
                    {item.nmsatker || item.nama || "-"}
                  </td>
                  <td
                    className="text-right"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    {numeral(item.pagu2024 || item.pagu || 0).format("0,0")}
                  </td>
                  <td
                    className="text-right"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    {numeral(item.real2024 || 0).format("0,0")}
                  </td>
                  <td
                    className="text-center"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    {item.pagu2024 || item.pagu
                      ? (
                          ((item.real2024 || 0) /
                            (item.pagu2024 || item.pagu)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </td>
                  <td
                    className="text-right"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    {numeral(item.pagu2025 || item.pagu || 0).format("0,0")}
                  </td>
                  <td
                    className="text-right"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    {numeral(item.real2025 || 0).format("0,0")}
                  </td>
                  <td
                    className="text-center"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    {item.pagu2025 || item.pagu
                      ? (
                          ((item.real2025 || 0) /
                            (item.pagu2025 || item.pagu)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </td>
                  <td
                    className="text-right"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    {numeral(item.blokir || 0).format("0,0")}
                  </td>
                  <td
                    className="text-center"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    <span
                      style={{
                        color:
                          calculateGrowth(item.real2025, item.real2024) >= 0
                            ? "green"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {calculateGrowth(item.real2025, item.real2024)}%
                    </span>
                  </td>
                  <td
                    className="text-center"
                    style={{ fontSize: "11px", padding: "4px" }}
                  >
                    <i className="bi bi-info-circle" title="Keterangan"></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    );
  };
  // Definisi kolom untuk setiap tabel
  const eselonColumns = [
    "KDUNIT",
    "NMUNIT",
    "Pagu",
    "Real",
    "%",
    "Pagu",
    "Real",
    "%",
    "Blokir",
    "GROWTH (yoy)",
    "Keterangan",
  ];
  const satkerColumns = [
    "KDSATKER",
    "NMSATKER",
    "Pagu",
    "Real",
    "%",
    "Pagu",
    "Real",
    "%",
    "Blokir",
    "GROWTH (yoy)",
    "Keterangan",
  ];
  const programColumns = [
    "KDProgram",
    "NMProgram",
    "Pagu",
    "Real",
    "%",
    "Pagu",
    "Real",
    "%",
    "Blokir",
    "GROWTH (yoy)",
    "Keterangan",
  ];
  const roColumns = [
    "KD_RO",
    "NM_RO",
    "Pagu",
    "Real",
    "%",
    "Pagu",
    "Real",
    "%",
    "Blokir",
    "GROWTH (yoy)",
    "Keterangan",
  ];

  return (
    <Container fluid>
      {/* Tabel Kinerja Satker Utama */}
      {renderKinerjaSatkerTable(
        "Kinerja Satker Utama",
        satkerData,
        satkerColumns,
        "satker"
      )}
      {renderKinerjaSatkerTable(
        "Kinerja Program Utama",
        programData,
        programColumns,
        "program"
      )}
      {renderKinerjaSatkerTable("Kinerja RO Utama", roData, roColumns, "ro")}
      <Eselon1New
        thang={thang}
        periode={periode}
        kdkanwil={kdkanwil}
        kdkppn={kdkppn}
      />
    </Container>
  );
};

export default EpaKinerjaUtama;
