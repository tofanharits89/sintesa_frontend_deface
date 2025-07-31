import React, { useState, useContext, useEffect, useMemo } from "react";
import MyContext from "../../../../auth/Context";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../../aplikasi/notifikasi/toastError";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";

const EpaChartDukmanReChart = ({ datadukman, thang, periode, dept }) => {
  const { axiosJWT, token, dataEpa, role } = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Ambil filter dari dataEpa atau props - gunakan useMemo untuk reaktivitas
  const filterValues = useMemo(() => {
    const tahun = parseInt(thang || dataEpa?.year) || 2025;
    const periodeInput = periode || dataEpa?.period || "Januari";
    const deptInput = dept || dataEpa?.kddept || "006";
    const kppn = dataEpa?.kdkppn || "";
    const kdkanwil = dataEpa?.kdkanwil || "";
    const years = [tahun - 2, tahun - 1, tahun];

    // console.log('[chartDukmanReChart] Filter values updated:', {
    //   'props received': { thang, periode, dept },
    //   'dataEpa received': dataEpa,
    //   'final values': {
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
  
  // Handle different periode formats
  let periodeNumber;
  if (typeof periodeInput === 'number') {
    periodeNumber = periodeInput;
  } else if (typeof periodeInput === 'string') {
    const foundIndex = bulanIndonesia.indexOf(periodeInput);
    periodeNumber = foundIndex >= 0 ? foundIndex + 1 : 7; // Default ke Juli jika tidak ditemukan
  } else {
    periodeNumber = 7; // Default ke Juli
  }

//   console.log('[chartDukmanReChart] Periode processing:', {
//     periodeInput,
//     periodeNumber,
//     isValid: periodeNumber > 0 && periodeNumber <= 12
//   });

  function generateSQLQuery(years, selectedMonth, kppn, kdkanwil, role, dept) {
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
      console.warn('[chartDukmanReChart] Invalid selectedMonth:', selectedMonth, 'defaulting to 7 (Juli)');
      selectedMonth = 7; // Default ke Juli
    }

    const realisasiFormula = monthsAbbr[selectedMonth - 1];
    
    // console.log('[chartDukmanReChart] Month calculation:', {
    //   selectedMonth,
    //   realisasiFormula,
    //   monthsAbbrLength: monthsAbbr.length
    // });

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
    
    // Super admin dan admin dapat menerapkan filter apapun jika dipilih
    // Role biasa mengikuti aturan filter sesuai level akses mereka
    
    // Apply filter logic untuk semua role jika ada filter yang dipilih
    // console.log('[generateSQLQuery] Processing filters for all roles - applying selected filters');
    
    if (kdkanwil && kdkanwil !== "" && kdkanwil !== null && kdkanwil !== undefined && kdkanwil !== "00") {
      // Jika kanwil dipilih, tampilkan semua KPPN di bawah kanwil tersebut
      kanwilFilter += ` AND a.kdkanwil='${kdkanwil}'`;
    //   console.log('[generateSQLQuery] Applied kanwil filter:', kanwilFilter);
      
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
        SUM(CASE WHEN a.kdprogram = 'WA' THEN a.pagu ELSE 0 END) AS pagu_wa,
        SUM(CASE WHEN a.kdprogram = 'WA' THEN ${realisasiFormula} ELSE 0 END) AS realisasi_wa,
        SUM(CASE WHEN a.kdprogram <> 'WA' THEN a.pagu ELSE 0 END) AS pagu_non_wa,
        SUM(CASE WHEN a.kdprogram <> 'WA' THEN ${realisasiFormula} ELSE 0 END) AS realisasi_non_wa
      FROM
        digitalisasi_epa.tren_belanja_dukman_teknis a
      WHERE
        a.thang IN (${years.join(", ")}) AND a.kddept='${dept}' AND a.kdprogram<>'ZZ'${kppnFilter}${kanwilFilter}
      GROUP BY
        a.thang  HAVING
        pagu_wa > 0 OR pagu_non_wa > 0 OR realisasi_wa > 0 OR realisasi_non_wa > 0
    `;
  }

  const getData = async () => {
    setLoading(true);
    
    // console.log('[chartDukmanReChart] DETAILED Filter Debug:', {
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
    
    // console.log('[chartDukmanReChart] Generated SQL:', sqlQuery);
    
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
      
    //   console.log('[chartDukmanReChart] Raw result:', response.data.result);
      
      // Transform data untuk Recharts
      const transformedData = (response.data.result || []).map(item => ({
        year: item.thang,
        pagu_wa: parseFloat(item.pagu_wa) || 0,
        realisasi_wa: parseFloat(item.realisasi_wa) || 0,
        pagu_non_wa: parseFloat(item.pagu_non_wa) || 0,
        realisasi_non_wa: parseFloat(item.realisasi_non_wa) || 0,
        persentase_wa: item.pagu_wa > 0 ? Math.round((item.realisasi_wa / item.pagu_wa) * 100) : 0,
        persentase_non_wa: item.pagu_non_wa > 0 ? Math.round((item.realisasi_non_wa / item.pagu_non_wa) * 100) : 0
      }));
      
    //   console.log('[chartDukmanReChart] Transformed data:', transformedData);
      
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
    // console.log('[chartDukmanReChart] useEffect triggered - Filter changed');
    // console.log('[chartDukmanReChart] Current dataEpa:', dataEpa);
    // console.log('[chartDukmanReChart] Dependencies check:', {
    //   kdkanwil_current: kdkanwil,
    //   kppn_current: kppn, 
    //   deptInput_current: deptInput,
    //   periodeInput_current: periodeInput,
    //   tahun_current: tahun,
    //   role_current: role
    // });
    getData();
  }, [filterValues, role]);

  // Custom label untuk menampilkan nilai di atas bar
  const CustomLabel = ({ x, y, width, height, value }) => {
    const displayValue = formatValue(value);
    return (
      <text 
        x={x + width / 2} 
        y={y - 5} 
        fill="#666" 
        textAnchor="middle" 
        fontSize="10"
        fontWeight="bold"
      >
        {displayValue}T
      </text>
    );
  };

  // Format nilai untuk display (dalam triliun)
  const formatValue = (value) => {
    return (value / 1000000000000).toFixed(1);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-weight-bold">{`Tahun: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatValue(entry.value)} T`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container fluid>
      <div className="my-3">
        Tren Dukman-Teknis <br />
        TA {tahun - 2} - {tahun} (dalam triliun)
      </div>

      <Row className="justify-content-center">
        {/* Chart DUKMAN */}
        <Col xs={12} md={6} lg={6} className="d-flex justify-content-center mb-3">
          <Card className="shadow-sm w-100">
            <CardBody className="d-flex flex-column align-items-center">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
                  <LoadingTable />
                </div>
              ) : chartData.length > 0 ? (
                <>
                  {/* Bar Chart */}
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="pagu_wa" 
                        fill="#062968" 
                        name="Pagu"
                        radius={[3, 3, 0, 0]}
                        label={<CustomLabel />}
                      />
                      <Bar 
                        dataKey="realisasi_wa" 
                        fill="#5D5FF4" 
                        name="Realisasi"
                        radius={[3, 3, 0, 0]}
                        label={<CustomLabel />}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="text-center mt-2">
                    <strong>DUKMAN</strong>
                  </div>
                </>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-danger text-center"
                  style={{ height: 300 }}
                >
                  <div style={{ fontSize: "15px" }}>
                    Data Tidak Ada <br />
                    <i className="bi bi-emoji-frown mx-2"></i>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Chart TEKNIS */}
        <Col xs={12} md={6} lg={6} className="d-flex justify-content-center mb-3">
          <Card className="shadow-sm w-100">
            <CardBody className="d-flex flex-column align-items-center">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
                  <LoadingTable />
                </div>
              ) : chartData.length > 0 ? (
                <>
                  {/* Bar Chart */}
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="pagu_non_wa" 
                        fill="#440554" 
                        name="Pagu"
                        radius={[3, 3, 0, 0]}
                        label={<CustomLabel />}
                      />
                      <Bar 
                        dataKey="realisasi_non_wa" 
                        fill="#E17EF9" 
                        name="Realisasi"
                        radius={[3, 3, 0, 0]}
                        label={<CustomLabel />}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="text-center mt-2">
                    <strong>TEKNIS</strong>
                  </div>
                </>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-danger text-center"
                  style={{ height: 300 }}
                >
                  <div style={{ fontSize: "15px" }}>
                    Data Tidak Ada <br />
                    <i className="bi bi-emoji-frown mx-2"></i>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <div className="text-center">
        <div className="m-0 p-0">{datadukman}</div>
      </div>
    </Container>
  );
};

export default EpaChartDukmanReChart;
