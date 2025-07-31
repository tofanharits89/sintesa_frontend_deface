import React, { useState, useEffect, useRef, useContext } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "../periode.css";
import Kdkanwil from "./kdkanwil";

import Kdkppn from "./Kdkppn";
import MyContext from "../../../../auth/Context";
import Kddept from "./kddept";
import Encrypt from "../../../../auth/Random";



function PeriodeEpa({ tab, darkMode, onChange, role, kdkanwil, kdkppn }) {
  const { setDataEpa, username, dataEpa, axiosJWT, token } = useContext(MyContext);
  const bulanIndonesia = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const initialState =
    role === "X" || role === "0"
      ? { kodeKanwil: "00", namaKanwil: "DIREKTORAT PA", lokasiKanwil: "00" }
      : { kodeKanwil: "", namaKanwil: "", lokasiKanwil: "" };

  const [kanwilData, setKanwilData] = useState(initialState);
  const [kddept, setKddept] = useState(dataEpa && dataEpa.kddept ? dataEpa.kddept : "006");
  const [kdkppnState, setKdkppn] = useState(kdkppn || "00");
  const currentMonth = bulanIndonesia[new Date().getMonth()];
  // console.log(currentMonth);

  const [selectedPeriod, setSelectedPeriod] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState("2025");

  const previousKanwilData = useRef(kanwilData);

  // Fungsi untuk menangani perubahan Kanwil
  const handleKanwilChange = (kanwil) => {
    if (!kanwil) return;
    const newKanwilData = {
      kodeKanwil: kanwil.kdkanwil,
      namaKanwil: kanwil.nmkanwil,
      lokasiKanwil: kanwil.kdlokasi,
    };
    setKanwilData(newKanwilData);
    if (onChange) {
      onChange({
        ...newKanwilData,
        kddept,
        kdkppn: kdkppnState,
        period: selectedPeriod,
        year: selectedYear,
      });
    }
  };

  // Fungsi untuk menangani perubahan Kddept
  const handleKddeptChange = (kddeptData) => {
    if (!kddeptData || !kddeptData.kddept) {
      return; // Tidak melakukan perubahan jika kosong
    }
    setKddept(kddeptData.kddept);
    // Simpan juga nama satker jika ada
    const namaSatker = kddeptData.nmsatker || kddeptData.nmdept || "";
    if (onChange) {
      onChange({
        ...kanwilData,
        kddept: kddeptData.kddept,
        nmsatker: namaSatker,
        kdkppn: kdkppnState,
        period: selectedPeriod,
        year: selectedYear,
      });
    }
  };

  // Fungsi untuk menangani perubahan Kdkppn
  const handleKdkppnChange = (kdkppn) => {
    if (!kdkppn) return;
    setKdkppn(kdkppn);
    if (onChange) {
      onChange({
        ...kanwilData,
        kddept,
        kdkppn,
        period: selectedPeriod,
        year: selectedYear,
      });
    }
  };

  // Fungsi untuk menangani perubahan periode
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
    if (onChange) {
      onChange({
        ...kanwilData,
        kddept,
        kdkppn: kdkppnState,
        period: e.target.value,
        year: selectedYear,
      });
    }
  };

  // Fungsi untuk menangani perubahan tahun
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    if (onChange) {
      onChange({
        ...kanwilData,
        kddept,
        kdkppn: kdkppnState,
        period: selectedPeriod,
        year: e.target.value,
      });
    }
  };

  useEffect(() => {
    if (
      kanwilData.kodeKanwil !== previousKanwilData.current.kodeKanwil ||
      kanwilData.namaKanwil !== previousKanwilData.current.namaKanwil ||
      kanwilData.lokasiKanwil !== previousKanwilData.current.lokasiKanwil
    ) {
      previousKanwilData.current = kanwilData;
    }
  }, [kanwilData]);

  // Update dataEpa setiap ada perubahan
  useEffect(() => {
    const updatedDataEpa = {
      kodeKanwil: kanwilData.kodeKanwil,
      namaKanwil: kanwilData.namaKanwil,
      lokasiKanwil: kanwilData.lokasiKanwil,
      kdkanwil: kanwilData.kodeKanwil, // Tambahkan kdkanwil untuk chart
      kdkppn: kdkppnState, // Tambahkan kdkppn untuk chart
      kddept: kddept || "001",
      period: selectedPeriod,
      year: selectedYear,
      username: username,
      tab: tab,
    };
    
    setDataEpa(updatedDataEpa);
  }, [kanwilData, kddept, kdkppnState, selectedPeriod, selectedYear, setDataEpa, tab, username]);

  // Fetch data user dari database jika dataEpa kosong untuk role 2
  useEffect(() => {
    const fetchUserData = async () => {
      if (role === "2" && username && (!dataEpa || !dataEpa.kodeKanwil)) {
        try {
          // Query untuk mengambil data user Kanwil dari database
          const query = `SELECT kdkanwil, kdkppn, name FROM v3.users WHERE username = '${username}' AND role = '2'`;
          const encodedQuery = encodeURIComponent(query);
          const response = await axiosJWT.get(
            `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${Encrypt(query)}&user=${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.result && response.data.result.length > 0) {
            const userData = response.data.result[0];
            // Set kanwilData dengan data dari database
            const newKanwilData = {
              kodeKanwil: userData.kdkanwil,
              namaKanwil: userData.name || "",
              lokasiKanwil: userData.kdkanwil || ""
            };
            setKanwilData(newKanwilData);
            // Only update dataEpa if values are different
            setDataEpa(prevDataEpa => {
              if (
                prevDataEpa.kodeKanwil === userData.kdkanwil &&
                prevDataEpa.namaKanwil === (userData.name || "") &&
                prevDataEpa.lokasiKanwil === (userData.kdkanwil || "") &&
                prevDataEpa.kdkanwil === userData.kdkanwil &&
                prevDataEpa.kdkppn === (userData.kdkppn || kdkppnState)
              ) {
                return prevDataEpa;
              }
              return {
                ...prevDataEpa,
                kodeKanwil: userData.kdkanwil,
                namaKanwil: userData.name || "",
                lokasiKanwil: userData.kdkanwil || "",
                kdkanwil: userData.kdkanwil,
                kdkppn: userData.kdkppn || kdkppnState
              };
            });
          }
        } catch (error) {
          console.error('[PilihanAtas] Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [role, username]);

  // Inisialisasi otomatis kanwilData untuk user Kanwil
  useEffect(() => {
    if (role === "2" && dataEpa && dataEpa.kodeKanwil && !kanwilData.kodeKanwil) {
      setKanwilData({
        kodeKanwil: dataEpa.kodeKanwil,
        namaKanwil: dataEpa.namaKanwil || "",
        lokasiKanwil: dataEpa.lokasiKanwil || ""
      });
    }
  }, [role, dataEpa, kanwilData]);

  // Fallback: jika user Kanwil dan kanwilData kosong, ambil dari dataEpa/context user
  useEffect(() => {
    if (role === "2" && (!kanwilData.kodeKanwil || kanwilData.kodeKanwil === "")) {
      // Coba ambil dari dataEpa
      if (dataEpa && dataEpa.kodeKanwil) {
        setKanwilData({
          kodeKanwil: dataEpa.kodeKanwil,
          namaKanwil: dataEpa.namaKanwil || "",
          lokasiKanwil: dataEpa.lokasiKanwil || ""
        });
      } else if (kdkanwil) {
        // Coba ambil dari props kdkanwil jika ada
        setKanwilData({
          kodeKanwil: kdkanwil,
          namaKanwil: "",
          lokasiKanwil: ""
        });
      }
    }
  }, [role, dataEpa, kdkanwil]); // Removed kanwilData from dependencies

  // Tambahkan useEffect untuk sinkronisasi kdkppnState dengan dataEpa.kdkppn untuk role 3
  useEffect(() => {
    if (role === "3" && dataEpa && dataEpa.kdkppn && kdkppnState !== dataEpa.kdkppn) {
      setKdkppn(dataEpa.kdkppn);
    }
  }, [role, dataEpa, kdkppnState]);

  // Tambahkan log untuk debug value yang dikirim ke Kdkppn
  useEffect(() => {
    if (role === "3") {
      // console.log("[pilihanAtas] role:", role, "dataEpa.kdkppn:", dataEpa && dataEpa.kdkppn, "kdkppnState:", kdkppnState);
    }
  }, [role, dataEpa, kdkppnState]);

  // Jika role 3 dan dataEpa.kdkppn masih kosong, update dari kdkppnState jika sudah ada hasil query KPPN
  useEffect(() => {
    if (role === "3" && (!dataEpa?.kdkppn || dataEpa.kdkppn === "00") && kdkppnState && kdkppnState !== "00") {
      setDataEpa(prevDataEpa => ({ ...prevDataEpa, kdkppn: kdkppnState }));
    }
  }, [role, kdkppnState, setDataEpa]); // Removed dataEpa from dependencies

  const allYears = ["2025", "2024", "2023"];
  const yearOptions = tab === 2 ? allYears.slice(0, 1) : allYears; // Jika tab === 2, hanya tampilkan 2025

  // Debug log untuk identifikasi masalah dropdown
  // console.log('[PilihanAtas] Debug info:');
  // console.log('- role:', role);
  // console.log('- kanwilData:', kanwilData);
  // console.log('- dataEpa:', dataEpa);
  // console.log('- kdkppnState:', kdkppnState);
  // console.log('- kddept:', kddept);
  // console.log('- Props yang dikirim ke Kdkppn:', {
  //   kdkanwil: role === "3" ? null : kanwilData,
  //   kdkppn: role === "3" ? (dataEpa.kdkppn || kdkppnState) : kdkppnState,
  //   role: role
  // });

  return (
    <div
      className={`dropdown-wrapper ${darkMode ? "dark-mode" : ""} sticky_epa`}
    >
      <Container fluid className="periode-container">
        <Row className="g-3">
          <Col xs={12} sm={6} md={4} lg={2}>
            <div className="dropdown_epa">
              <label className="dropdown_epa-label text-dark">Tahun</label>
              <select
                className="dropdown_epa-select dropdown-animated"
                value={selectedYear}
                onChange={handleYearChange}
              >
                {yearOptions.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <div className="dropdown_epa">
              <label className="dropdown_epa-label text-dark">
                Periode EPA
              </label>
              <select
                className="dropdown_epa-select dropdown-animated"
                value={selectedPeriod}
                onChange={handlePeriodChange}
              >
                {bulanIndonesia.map((period, index) => (
                  <option key={index} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Kddept 
              onChange={handleKddeptChange} 
              kddept={kddept} 
              kdkanwil={kanwilData.kodeKanwil}
              kdkppn={kdkppnState}
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={2}>
            <Kdkanwil 
              onChange={handleKanwilChange} 
              kdkanwil={role === "3" ? dataEpa.kodeKanwil : kanwilData.kodeKanwil}
              role={role}
              disabled={role === "2" || role === "3"} // role 2 & 3: dropdown terkunci
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Kdkppn 
              onChange={handleKdkppnChange} 
              kdkanwil={role === "3" ? null : kanwilData} // Untuk role 3, tidak perlu kdkanwil
              kdkppn={role === "3" ? (dataEpa.kdkppn || kdkppnState) : kdkppnState}
              role={role}
              disabled={role === "3"} // role 3: dropdown terkunci
              value={role === "3" ? (dataEpa.kdkppn || kdkppnState) : kdkppnState}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PeriodeEpa;
