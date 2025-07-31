import React, { useState, useContext, useEffect, useMemo } from "react";
import MyContext from "../../../../auth/Context";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../../aplikasi/notifikasi/toastError";
import { Card, CardBody, CardHeader, Col, Container, Row, Spinner } from "react-bootstrap";

const EpaChartBelanja = ({ datajenbel, thang, periode, dept }) => {
  const { axiosJWT, token, dataEpa, role } = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    pegawai: [],
    barang: [],
    modal: [],
    bansos: []
  });

  // Ambil filter dari dataEpa atau props - gunakan useMemo untuk reaktivitas
  const filterValues = useMemo(() => {
    const tahun = parseInt(thang || dataEpa?.year) || 2025;
    const periodeInput = periode || dataEpa?.period || "Juli";
    const deptInput = dept || dataEpa?.kddept || "018";
    const kppn = dataEpa?.kdkppn || "00";
    const kdkanwil = dataEpa?.kdkanwil || "00";
    const years = [tahun - 4, tahun - 3, tahun - 2, tahun - 1, tahun];
    // const deptName = dept || dataEpa?.nmdept || "Kementerian Pertanian";


    // console.log('[chartTrenbelanja] Filter values updated:', {
    //   'props received': { thang, periode, dept },
    //   'dataEpa current': dataEpa,
    //   'calculated values': {
    //     tahun,
    //     periodeInput,
    //     deptInput,
    //     kppn,
    //     kdkanwil
    //   }
    // });

    return { tahun, periodeInput, deptInput, kppn, kdkanwil, years };
  }, [thang, periode, dept, dataEpa]);

  const { tahun, periodeInput, deptInput, kppn, kdkanwil, years } = filterValues;

  // Convert periode nama bulan ke angka
  const bulanIndonesia = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const periodeNumber = bulanIndonesia.indexOf(periodeInput) + 1;
  if (periodeNumber === 0) {
    console.warn('[chartTrenbelanja] Invalid periode:', periodeInput, 'defaulting to 7 (Juli)');
    periodeNumber = 7;
  }

  // console.log('[chartTrenbelanja] Periode conversion:', {
  //   periodeInput,
  //   periodeNumber,
  //   years,
  //   deptInput
  // });

  // Function to generate SQL query dengan filter yang benar
  const generateSQLQuery = (years, selectedMonth, kppn, kdkanwil, role, dept) => {
    // console.log('[generateSQLQuery] Input parameters:', {
    //   years, selectedMonth, kppn, kdkanwil, role, dept
    // });

    const monthsAbbr = [
      "real1",
      "real1 + real2 ",
      "real1 + real2 + real3 ",
      "real1 + real2 + real3 + real4 ",
      "real1 + real2 + real3 + real4 + real5 ",
      "real1 + real2 + real3 + real4 + real5 + real6 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 + real12 ",
    ];

    // Validasi selectedMonth
    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
      console.warn('[chartTrenbelanja] Invalid selectedMonth:', selectedMonth, 'defaulting to 7 (Juli)');
      selectedMonth = 7; // Default ke Juli
    }

    const realisasiFormula = monthsAbbr[selectedMonth - 1];

    let kppnFilter = "";
    let kanwilFilter = "";
    
    // console.log('[generateSQLQuery] Filter building debug:', {
    //   kdkanwil: kdkanwil,
    //   kdkanwil_type: typeof kdkanwil,
    //   kdkanwil_empty: !kdkanwil || kdkanwil === "" || kdkanwil === null || kdkanwil === undefined || kdkanwil === "00",
    //   kppn: kppn,
    //   kppn_type: typeof kppn,
    //   kppn_empty: !kppn || kppn === "" || kppn === null || kppn === undefined || kppn === "00",
    //   role: role,
    //   isAdminRole: role === "X" || role === "0" || role === "1"
    // });
    
    // Apply filter logic untuk semua role jika ada filter yang dipilih
    // console.log('[generateSQLQuery] Processing filters for all roles - applying selected filters');
    
    if (kdkanwil && kdkanwil !== "" && kdkanwil !== null && kdkanwil !== undefined && kdkanwil !== "00") {
      // Jika kanwil dipilih, tampilkan semua KPPN di bawah kanwil tersebut
      kanwilFilter += ` AND a.kdkanwil='${kdkanwil}'`;
      // console.log('[generateSQLQuery] Applied kanwil filter:', kanwilFilter);
      
      // Jika KPPN juga dipilih (selain "00"), filter lebih spesifik ke KPPN tersebut
      if (kppn && kppn !== "" && kppn !== null && kppn !== undefined && kppn !== "00" && kppn !== "000") {
        kppnFilter += ` AND a.kdkppn='${kppn}'`;
        // console.log('[generateSQLQuery] Applied kppn filter:', kppnFilter);
      }
    } else {
      // Jika kanwil tidak dipilih ("00"), hanya filter berdasarkan KPPN jika ada
      if (kppn && kppn !== "" && kppn !== null && kppn !== undefined && kppn !== "00" && kppn !== "000") {
        kppnFilter += ` AND a.kdkppn='${kppn}'`;
        // console.log('[generateSQLQuery] Applied kppn-only filter:', kppnFilter);
      }
    }

    // console.log('[generateSQLQuery] Final filters:', {
    //   kppnFilter,
    //   kanwilFilter,
    //   combinedFilter: kppnFilter + kanwilFilter
    // });

    return `
        SELECT
          a.thang,
          a.kddept,
          a.kdjenbel,
          SUM(a.pagu) AS pagu,
          SUM(${realisasiFormula}) AS realisasi
        FROM
        digitalisasi_epa.tren_belanja_jenbel a 
        WHERE
          a.thang IN (${years.join(",")}) and a.kddept='${dept}'${kppnFilter}${kanwilFilter}
        GROUP BY
          a.thang,a.kdjenbel
      `;
  };

  const getData = async () => {
    setLoading(true);
    
    // console.log('[chartTrenbelanja] DETAILED Filter Debug:', {
    //   'dataEpa context': dataEpa,
    //   'kdkanwil value': kdkanwil,
    //   'kppn value': kppn,
    //   'dept value': deptInput,
    //   'periode value': periodeInput,
    //   'thang value': tahun,
    //   'role value': role,
    //   'periodeNumber': periodeNumber
    // });
    
    const sqlQuery = generateSQLQuery(years, periodeNumber, kppn, kdkanwil, role, deptInput);
    
    // console.log('[chartTrenbelanja] Generated SQL:', sqlQuery);
    
    const encodedQuery = encodeURIComponent(sqlQuery);
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const encryptedQuery = Encrypt(cleanedQuery);
    
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA}${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // console.log('[chartTrenbelanja] Raw result:', response.data.result);
      
      // Transform data untuk Recharts
      const rawData = response.data.result || [];
      
      // Grouping data berdasarkan jenis belanja - dengan mapping untuk ReCharts
      const transformedData = {
        pegawai: rawData.filter(item => item.kdjenbel === "51").map(item => ({
          thang: item.thang,
          real: item.realisasi || 0,
          pagu: item.pagu || 0
        })),
        barang: rawData.filter(item => item.kdjenbel === "52").map(item => ({
          thang: item.thang,
          real: item.realisasi || 0,
          pagu: item.pagu || 0
        })), 
        modal: rawData.filter(item => item.kdjenbel === "53").map(item => ({
          thang: item.thang,
          real: item.realisasi || 0,
          pagu: item.pagu || 0
        })),
        bansos: rawData.filter(item => item.kdjenbel === "57").map(item => ({
          thang: item.thang,
          real: item.realisasi || 0,
          pagu: item.pagu || 0
        }))
      };
      
      // console.log('[chartTrenbelanja] Transformed data:', transformedData);
      
      setChartData(transformedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) || "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  // useEffect untuk fetch data ketika filter berubah
  useEffect(() => {
    // console.log('[chartTrenbelanja] useEffect triggered - Filter changed');
    // console.log('[chartTrenbelanja] Current dataEpa:', dataEpa);
    // console.log('[chartTrenbelanja] Dependencies check:', {
    //   kdkanwil_current: kdkanwil,
    //   kppn_current: kppn, 
    //   deptInput_current: deptInput,
    //   periodeInput_current: periodeInput,
    //   tahun_current: tahun,
    //   role_current: role
    // });
    getData();
  }, [filterValues, role]);

  // Format nilai untuk display (dalam triliun) - Enhanced dengan pembulatan yang lebih baik
  const formatValue = (value) => {
    if (!value || value === 0 || !isFinite(value)) return "0.0";
    
    // Konversi ke triliun
    const valueInTrillions = value / 1000000000000;
    
    // Jika nilai terlalu besar (scientific notation), kembalikan 0
    if (valueInTrillions > 999999 || !isFinite(valueInTrillions)) {
      console.warn('Value too large or invalid:', value);
      return "0.0";
    }
    
    // Format dengan 1 desimal untuk nilai >= 1T
    if (valueInTrillions >= 1) {
      return valueInTrillions.toFixed(1);
    }
    
    // Format dengan 2 desimal untuk nilai < 1T tapi > 0.01T
    if (valueInTrillions >= 0.01) {
      return valueInTrillions.toFixed(2);
    }
    
    // Format dengan 3 desimal untuk nilai sangat kecil
    if (valueInTrillions > 0) {
      return valueInTrillions.toFixed(3);
    }
    
    return "0.0";
  };

  // Format nilai untuk summary cards dengan pembulatan yang lebih agresif
  const formatSummaryValue = (value) => {
    if (!value || value === 0 || !isFinite(value)) return "0";
    
    const valueInTrillions = value / 1000000000000;
    
    if (valueInTrillions > 999999 || !isFinite(valueInTrillions)) {
      return "0";
    }
    
    // Untuk summary, bulatkan ke integer jika >= 1T
    if (valueInTrillions >= 1) {
      return Math.round(valueInTrillions).toString();
    }
    
    // Untuk nilai < 1T, tampilkan 1 desimal
    return valueInTrillions.toFixed(1);
  };

  // Custom label untuk menampilkan nilai di atas bar - Enhanced
  const CustomLabel = ({ x, y, width, height, value }) => {
    if (!value || value === 0) return null;
    const displayValue = formatValue(value);
    return (
      <text 
        x={x + width / 2} 
        y={y - 8} 
        fill="#495057" 
        textAnchor="middle" 
        fontSize="11"
        fontWeight="600"
        style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))' }}
      >
        {displayValue}T
      </text>
    );
  };

  // Custom tooltip - Enhanced dengan informasi lebih lengkap dan formatting yang diperbaiki
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const value = data.value;
      
      // Validasi nilai sebelum kalkulasi
      if (!value || !isFinite(value) || value === 0) {
        return (
          <div className="bg-white border rounded-3 shadow-lg p-3" style={{ minWidth: '200px' }}>
            <div className="text-center text-muted">
              <small>Data tidak tersedia untuk tahun {label}</small>
            </div>
          </div>
        );
      }
      
      // const percentage = totals.grandTotal > 0 ? ((value / totals.grandTotal) * 100).toFixed(1) : 0;
      const pagu = data.payload && data.payload.pagu ? data.payload.pagu : 0;
      const percentage = pagu > 0 ? ((value / pagu) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white border rounded-3 shadow-lg p-3" style={{ minWidth: '200px' }}>
          <div className="border-bottom pb-2 mb-2">
            <h6 className="mb-1 text-primary fw-bold">
              <i className="bi bi-calendar-event me-1"></i>
              Tahun {label}
            </h6>
          </div>
          
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center">
              <div 
                className="rounded-circle me-2" 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: data.color 
                }}
              ></div>
              <span className="fw-medium">{data.name}</span>
            </div>
          </div>
          
          <div className="row g-2 small">
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Realisasi:</span>
                <span className="fw-bold text-primary">{formatValue(value)} T</span>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <span className="text-muted">% dari Pagu:</span>
                <span className="fw-bold text-success">{percentage}%</span>
              </div>
            </div>
            {/* <div className="col-12">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Nilai Nominal:</span>
                <span className="fw-bold" style={{ fontSize: '10px' }}>
                  {value > 999999999999 ? 
                    `Rp ${formatSummaryValue(value)} T` : 
                    `Rp ${(value).toLocaleString('id-ID')}`
                  }
                </span>
              </div>
            </div> */}
          </div>
        </div>
      );
    }
    return null;
  };

  // Hitung total untuk summary dengan validasi yang lebih baik - hanya tahun yang dipilih
  const getTotalData = () => {
    // Filter data hanya untuk tahun yang dipilih (tahun terbaru)
    const currentYear = tahun; // Tahun yang dipilih user
    
    const totals = {
      pegawai: chartData.pegawai
        .filter(item => item.thang === currentYear)
        .reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0),
      barang: chartData.barang
        .filter(item => item.thang === currentYear)
        .reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0),
      modal: chartData.modal
        .filter(item => item.thang === currentYear)
        .reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0),
      bansos: chartData.bansos
        .filter(item => item.thang === currentYear)
        .reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0)
    };
    
    // Pastikan tidak ada nilai NaN atau Infinity
    Object.keys(totals).forEach(key => {
      if (!isFinite(totals[key]) || isNaN(totals[key])) {
        totals[key] = 0;
      }
    });
    
    totals.grandTotal = totals.pegawai + totals.barang + totals.modal + totals.bansos;
    
    // Validasi grand total
    if (!isFinite(totals.grandTotal) || isNaN(totals.grandTotal)) {
      totals.grandTotal = 0;
    }
    
    // Untuk fallback, jika tahun yang dipilih tidak ada data, hitung total semua tahun
    if (totals.grandTotal === 0) {
      const allYearTotals = {
        pegawai: chartData.pegawai.reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0),
        barang: chartData.barang.reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0),
        modal: chartData.modal.reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0),
        bansos: chartData.bansos.reduce((sum, item) => {
          const value = item.real || 0;
          return sum + (isFinite(value) ? value : 0);
        }, 0)
      };
      
      // Jika ada data di tahun lain, return total semua tahun
      const allYearGrandTotal = allYearTotals.pegawai + allYearTotals.barang + allYearTotals.modal + allYearTotals.bansos;
      if (allYearGrandTotal > 0) {
        return {
          ...allYearTotals,
          grandTotal: allYearGrandTotal,
          isAllYears: true // Flag untuk menandai ini adalah total semua tahun
        };
      }
    }
    
    return {
      ...totals,
      isAllYears: false // Flag untuk menandai ini adalah total tahun yang dipilih
    };
  };

  const totals = getTotalData();

  return (
    <>
      <Container fluid>
        {/* Enhanced Header dengan Info */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="text-primary mb-1">
                <i className="bi bi-bar-chart-fill me-2"></i>
                Growth Belanja per Jenis (yoy)
              </h4>
              <p className="text-muted mb-0">
                Periode: TA {tahun - 1} - {tahun} | Bulan: {periodeInput} | 
                {/* {kdkanwil !== "00" && ` Kanwil: ${kdkanwil} |`}
                {kppn !== "00" && ` KPPN: ${kppn} |`} */}
                Dept: {deptInput}
              </p>
            </div>
            {/* <div className="text-end">
              <div className="badge bg-info fs-6 px-3 py-2">
                {totals.isAllYears ? 
                  `Total Realisasi (Semua Tahun): ${formatSummaryValue(totals.grandTotal)} T` :
                  `Total Realisasi TA ${tahun}: ${formatSummaryValue(totals.grandTotal)} T`
                }
              </div>
            </div> */}
          </div>

          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="border-primary shadow-sm h-100">
                <CardBody className="text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-primary rounded-circle p-2 me-2">
                      <i className="bi bi-people-fill text-white"></i>
                    </div>
                    <h6 className="mb-0 text-primary">Belanja Pegawai</h6>
                  </div>
                  <h4 className="text-primary mb-0">
                    {/* {formatSummaryValue(totals.pegawai)} T */}
                    {/* Growth YoY Pegawai 2024-2025 */}
                    {(() => {
                      // Ambil total pegawai tahun 2024 dan 2025
                      const totalPegawai2024 = chartData.pegawai
                        .filter(item => Number(item.thang) === 2024)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      const totalPegawai2025 = chartData.pegawai
                        .filter(item => Number(item.thang) === 2025)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      let growthPegawai = null;
                      if (totalPegawai2024 === 0 && totalPegawai2025 === 0) {
                        return <span className="ms-2 text-muted">(Data tidak tersedia)</span>;
                      } else if (totalPegawai2024 === 0) {
                        return <span className="ms-2 text-warning">(Pertumbuhan tidak terdefinisi)</span>;
                      } else {
                        growthPegawai = ((totalPegawai2025 - totalPegawai2024) / totalPegawai2024) * 100;
                        return (
                          <span className={growthPegawai < 0 ? "ms-2 text-danger" : "ms-2 text-success"} style={{ fontSize: '1rem', fontWeight: 500 }}>
                            ({growthPegawai.toFixed(1)}% YoY)
                          </span>
                        );
                      }
                    })()}
                  </h4>
                  {/* <small className="text-muted">
                    {totals.grandTotal > 0 ? 
                      `${((totals.pegawai / totals.grandTotal) * 100).toFixed(1)}% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}` : 
                      `0% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}`
                    }
                  </small> */}
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-success shadow-sm h-100">
                <CardBody className="text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-success rounded-circle p-2 me-2">
                      <i className="bi bi-box-fill text-white"></i>
                    </div>
                    <h6 className="mb-0 text-success">Belanja Barang</h6>
                  </div>
                  <h4 className="text-success mb-0">
                    {/* {formatSummaryValue(totals.barang)} T */}
                    {/* Growth YoY Barang 2024-2025 */}
                    {(() => {
                      const totalBarang2024 = chartData.barang
                        .filter(item => Number(item.thang) === 2024)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      const totalBarang2025 = chartData.barang
                        .filter(item => Number(item.thang) === 2025)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      let growthBarang = null;
                      if (totalBarang2024 === 0 && totalBarang2025 === 0) {
                        return <span className="ms-2 text-muted">(Data tidak tersedia)</span>;
                      } else if (totalBarang2024 === 0) {
                        return <span className="ms-2 text-warning">(Pertumbuhan tidak terdefinisi)</span>;
                      } else {
                        growthBarang = ((totalBarang2025 - totalBarang2024) / totalBarang2024) * 100;
                        return (
                          <span className={growthBarang < 0 ? "ms-2 text-danger" : "ms-2 text-success"} style={{ fontSize: '1rem', fontWeight: 500 }}>
                            ({growthBarang.toFixed(1)}% YoY)
                          </span>
                        );
                      }
                    })()}
                  </h4>
                  {/* <small className="text-muted">
                    {totals.grandTotal > 0 ? 
                      `${((totals.barang / totals.grandTotal) * 100).toFixed(1)}% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}` : 
                      `0% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}`
                    }
                  </small> */}
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-warning shadow-sm h-100">
                <CardBody className="text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-warning rounded-circle p-2 me-2">
                      <i className="bi bi-building-fill text-white"></i>
                    </div>
                    <h6 className="mb-0 text-warning">Belanja Modal</h6>
                  </div>
                  <h4 className="text-warning mb-0">
                    {/* {formatSummaryValue(totals.modal)} T */}
                    {/* Growth YoY Modal 2024-2025 */}
                    {(() => {
                      const totalModal2024 = chartData.modal
                        .filter(item => Number(item.thang) === 2024)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      const totalModal2025 = chartData.modal
                        .filter(item => Number(item.thang) === 2025)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      let growthModal = null;
                      if (totalModal2024 === 0 && totalModal2025 === 0) {
                        return <span className="ms-2 text-muted">(Data tidak tersedia)</span>;
                      } else if (totalModal2024 === 0) {
                        return <span className="ms-2 text-warning">(Pertumbuhan tidak terdefinisi)</span>;
                      } else {
                        growthModal = ((totalModal2025 - totalModal2024) / totalModal2024) * 100;
                        return (
                          <span className={growthModal < 0 ? "ms-2 text-danger" : "ms-2 text-success"} style={{ fontSize: '1rem', fontWeight: 500 }}>
                            ({growthModal.toFixed(1)}% YoY)
                          </span>
                        );
                      }
                    })()}
                  </h4>
                  {/* <small className="text-muted">
                    {totals.grandTotal > 0 ? 
                      `${((totals.modal / totals.grandTotal) * 100).toFixed(1)}% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}` : 
                      `0% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}`
                    }
                  </small> */}
                </CardBody>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-danger shadow-sm h-100">
                <CardBody className="text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <div className="bg-danger rounded-circle p-2 me-2">
                      <i className="bi bi-heart-fill text-white"></i>
                    </div>
                    <h6 className="mb-0 text-danger">Bantuan Sosial</h6>
                  </div>
                  <h4 className="text-danger mb-0">
                  {/* Growth YoY Bansos 2024-2025 */}
                    {(() => {
                      const totalBansos2024 = chartData.bansos
                        .filter(item => Number(item.thang) === 2024)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      const totalBansos2025 = chartData.bansos
                        .filter(item => Number(item.thang) === 2025)
                        .reduce((sum, item) => sum + (isFinite(item.real) ? item.real : 0), 0);
                      let growthBansos = null;
                      if (totalBansos2024 === 0 && totalBansos2025 === 0) {
                        return <span className="ms-2 text-muted">-</span>;
                      } else if (totalBansos2024 === 0) {
                        return <span className="ms-2 text-warning">(Pertumbuhan tidak terdefinisi)</span>;
                      } else {
                        growthBansos = ((totalBansos2025 - totalBansos2024) / totalBansos2024) * 100;
                        return (
                          <span className={growthBansos < 0 ? "ms-2 text-danger" : "ms-2 text-success"} style={{ fontSize: '1rem', fontWeight: 500 }}>
                            ({growthBansos.toFixed(1)}% YoY)
                          </span>
                        );
                      }
                    })()}
                  </h4>
                  {/* <small className="text-muted">
                    {totals.grandTotal > 0 ? 
                      `${((totals.bansos / totals.grandTotal) * 100).toFixed(1)}% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}` : 
                      `0% dari total ${totals.isAllYears ? 'semua tahun' : `TA ${tahun}`}`
                    }
                  </small> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        {loading ? (
          <div 
            className="d-flex justify-content-center align-items-center"
            style={{ height: "400px" }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Memuat data chart...</p>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {/* Chart Pegawai (Kode 51) */}
            <Col lg={6}>
              <Card className="h-100 shadow border-0">
                <CardHeader className="bg-gradient bg-primary text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-people-fill me-2 fs-5"></i>
                      <h5 className="mb-0">Belanja Pegawai</h5>
                    </div>
                    {/* <div className="bg-white bg-opacity-25 rounded px-2 py-1">
                      <small className="fw-bold">
                        {totals.isAllYears ? 
                          `${formatSummaryValue(totals.pegawai)} T (Total)` :
                          `${formatSummaryValue(totals.pegawai)} T (TA ${tahun})`
                        }
                      </small>
                    </div> */}
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  {chartData.pegawai && chartData.pegawai.length > 0 ? (
                    <>
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Tren realisasi selama {chartData.pegawai.length} tahun terakhir
                        </small>
                      </div>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                          data={chartData.pegawai}
                          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                          <XAxis 
                            dataKey="thang" 
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `${formatValue(value)}T`}
                            tick={{ fontSize: 11 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="real" fill="#0d6efd" name="Realisasi" radius={[4, 4, 0, 0]}>
                            <LabelList content={<CustomLabel />} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div
                      className="d-flex flex-column justify-content-center align-items-center text-center"
                      style={{ height: "320px" }}
                    >
                      <div className="text-muted mb-3">
                        <i className="bi bi-bar-chart display-1 opacity-50"></i>
                      </div>
                      <h6 className="text-muted mb-2">Data Tidak Tersedia</h6>
                      <small className="text-muted">
                        Tidak ada data belanja pegawai untuk periode yang dipilih
                      </small>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Chart Barang (Kode 52) */}
            <Col lg={6}>
              <Card className="h-100 shadow border-0">
                <CardHeader className="bg-gradient bg-success text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-box-fill me-2 fs-5"></i>
                      <h5 className="mb-0">Belanja Barang</h5>
                    </div>
                    {/* <div className="bg-white bg-opacity-25 rounded px-2 py-1">
                      <small className="fw-bold">
                        {totals.isAllYears ? 
                          `${formatSummaryValue(totals.barang)} T (Total)` :
                          `${formatSummaryValue(totals.barang)} T (TA ${tahun})`
                        }
                      </small>
                    </div> */}
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  {chartData.barang && chartData.barang.length > 0 ? (
                    <>
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Tren realisasi selama {chartData.barang.length} tahun terakhir
                        </small>
                      </div>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                          data={chartData.barang}
                          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                          <XAxis 
                            dataKey="thang" 
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `${formatValue(value)}T`}
                            tick={{ fontSize: 11 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="real" fill="#198754" name="Realisasi" radius={[4, 4, 0, 0]}>
                            <LabelList content={<CustomLabel />} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div
                      className="d-flex flex-column justify-content-center align-items-center text-center"
                      style={{ height: "320px" }}
                    >
                      <div className="text-muted mb-3">
                        <i className="bi bi-bar-chart display-1 opacity-50"></i>
                      </div>
                      <h6 className="text-muted mb-2">Data Tidak Tersedia</h6>
                      <small className="text-muted">
                        Tidak ada data belanja barang untuk periode yang dipilih
                      </small>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Chart Modal (Kode 53) */}
            <Col lg={6}>
              <Card className="h-100 shadow border-0">
                <CardHeader className="bg-gradient bg-warning text-dark">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-building-fill me-2 fs-5"></i>
                      <h5 className="mb-0">Belanja Modal</h5>
                    </div>
                    {/* <div className="bg-white bg-opacity-25 rounded px-2 py-1">
                      <small className="fw-bold">
                        {totals.isAllYears ? 
                          `${formatSummaryValue(totals.modal)} T (Total)` :
                          `${formatSummaryValue(totals.modal)} T (TA ${tahun})`
                        }
                      </small>
                    </div> */}
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  {chartData.modal && chartData.modal.length > 0 ? (
                    <>
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Tren realisasi selama {chartData.modal.length} tahun terakhir
                        </small>
                      </div>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                          data={chartData.modal}
                          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                          <XAxis 
                            dataKey="thang" 
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `${formatValue(value)}T`}
                            tick={{ fontSize: 11 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="real" fill="#ffc107" name="Realisasi" radius={[4, 4, 0, 0]}>
                            <LabelList content={<CustomLabel />} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div
                      className="d-flex flex-column justify-content-center align-items-center text-center"
                      style={{ height: "320px" }}
                    >
                      <div className="text-muted mb-3">
                        <i className="bi bi-bar-chart display-1 opacity-50"></i>
                      </div>
                      <h6 className="text-muted mb-2">Data Tidak Tersedia</h6>
                      <small className="text-muted">
                        Tidak ada data belanja modal untuk periode yang dipilih
                      </small>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Chart Bansos (Kode 57) */}
            <Col lg={6}>
              <Card className="h-100 shadow border-0">
                <CardHeader className="bg-gradient bg-danger text-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-heart-fill me-2 fs-5"></i>
                      <h5 className="mb-0">Bantuan Sosial</h5>
                    </div>
                    {/* <div className="bg-white bg-opacity-25 rounded px-2 py-1">
                      <small className="fw-bold">
                        {totals.isAllYears ? 
                          `${formatSummaryValue(totals.bansos)} T (Total)` :
                          `${formatSummaryValue(totals.bansos)} T (TA ${tahun})`
                        }
                      </small>
                    </div> */}
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  {chartData.bansos && chartData.bansos.length > 0 ? (
                    <>
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Tren realisasi selama {chartData.bansos.length} tahun terakhir
                        </small>
                      </div>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                          data={chartData.bansos}
                          margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                          <XAxis 
                            dataKey="thang" 
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <YAxis 
                            tickFormatter={(value) => `${formatValue(value)}T`}
                            tick={{ fontSize: 11 }}
                            tickLine={{ stroke: '#6c757d' }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="real" fill="#dc3545" name="Realisasi" radius={[4, 4, 0, 0]}>
                            <LabelList content={<CustomLabel />} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div
                      className="d-flex flex-column justify-content-center align-items-center text-center"
                      style={{ height: "320px" }}
                    >
                      <div className="text-muted mb-3">
                        <i className="bi bi-heart display-1 opacity-50"></i>
                      </div>
                      <h6 className="text-muted mb-2">Data Tidak Tersedia</h6>
                      <small className="text-muted">
                        Tidak ada data bantuan sosial untuk periode yang dipilih
                      </small>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {/* Enhanced Footer dengan Data Insights
        <div className="mt-5">
          <Card className="border-0 bg-light">
            <CardBody className="py-4">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle p-2 me-3">
                      <i className="bi bi-lightbulb-fill text-white"></i>
                    </div>
                    <div>
                      <h6 className="mb-1 text-primary">Insights & Analisis</h6>
                      <small className="text-muted">
                        {totals.grandTotal > 0 ? (
                          <>
                            Jenis belanja terbesar: 
                            {totals.pegawai >= Math.max(totals.barang, totals.modal, totals.bansos) && " Belanja Pegawai"}
                            {totals.barang >= Math.max(totals.pegawai, totals.modal, totals.bansos) && " Belanja Barang"}
                            {totals.modal >= Math.max(totals.pegawai, totals.barang, totals.bansos) && " Belanja Modal"}
                            {totals.bansos >= Math.max(totals.pegawai, totals.barang, totals.modal) && " Bantuan Sosial"}
                            {" • "}Data mencakup periode {years[0]} - {years[years.length - 1]}
                          </>
                        ) : (
                          "Tidak ada data untuk periode yang dipilih. Silakan ubah filter untuk melihat data."
                        )}
                      </small>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">Data terakhir diupdate:</small>
                    <small className="fw-bold text-primary">
                      <i className="bi bi-clock me-1"></i>
                      {new Date().toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </small>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
 */}
        {/* Original Footer untuk kompatibilitas */}
        <div className="header-kinerja-baris mt-3">
          <div className="m-0 p-0">{datajenbel}</div>
        </div>
      </Container>
    </>
  );
};

export default EpaChartBelanja;
