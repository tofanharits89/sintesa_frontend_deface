// import React, { useState, useContext, useEffect, useMemo } from "react";
// import MyContext from "../../../../auth/Context";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
//   LabelList
// } from "recharts";
// import Encrypt from "../../../../auth/Random";
// import { LoadingTable } from "../../../layout/LoadingTable";
// import { handleHttpError } from "../../../aplikasi/notifikasi/toastError";
// import { Card, CardBody, CardHeader, Col, Container, Row, Spinner } from "react-bootstrap";

// const EpaChartBelanja = ({ datajenbel, thang, periode, dept }) => {
//   const { axiosJWT, token, dataEpa, role } = useContext(MyContext);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [chartData, setChartData] = useState([]);

//   // Ambil filter dari dataEpa atau props - gunakan useMemo untuk reaktivitas
//   const filterValues = useMemo(() => {
//     const tahun = parseInt(thang || dataEpa?.year) || 2025;
//     const periodeInput = periode || dataEpa?.period || "Januari";
//     const deptInput = dept || dataEpa?.kddept || "006";
//     const kppn = dataEpa?.kdkppn || "";
//     const kdkanwil = dataEpa?.kdkanwil || "";
//     const years = [tahun - 4, tahun - 3, tahun - 2, tahun - 1, tahun];

//     console.log('[chartTrenbelanja] Filter values updated:', {
//       'props received': { thang, periode, dept },
//       'dataEpa received': dataEpa,
//       'final values': {
//         tahun,
//         periodeInput,
//         deptInput,
//         kppn,
//         kdkanwil
//       }
//     });

//     return { tahun, periodeInput, deptInput, kppn, kdkanwil, years };
//   }, [thang, periode, dept, dataEpa]);

//   const { tahun, periodeInput, deptInput, kppn, kdkanwil, years } = filterValues;

//   // Convert periode nama bulan ke angka
//   const bulanIndonesia = [
//     "Januari", "Februari", "Maret", "April", "Mei", "Juni",
//     "Juli", "Agustus", "September", "Oktober", "November", "Desember"
//   ];
  
//   // Handle different periode formats
//   let periodeNumber;
//   if (typeof periodeInput === 'number') {
//     periodeNumber = periodeInput;
//   } else if (typeof periodeInput === 'string') {
//     const foundIndex = bulanIndonesia.indexOf(periodeInput);
//     periodeNumber = foundIndex >= 0 ? foundIndex + 1 : 7; // Default ke Juli jika tidak ditemukan
//   } else {
//     periodeNumber = 7; // Default ke Juli
//   }

//   console.log('[chartTrenbelanja] Periode processing:', {
//     periodeInput,
//     periodeNumber,
//     isValid: periodeNumber > 0 && periodeNumber <= 12
//   });

//   function generateSQLQuery(years, selectedMonth, kppn, kdkanwil, role, dept) {
//   function generateSQLQuery(years, selectedMonth, kppn, kdkanwil, role, dept) {
//     const monthsAbbr = [
//       "real1",
//       "real1 + real2 ",
//       "real1 + real2 + real3 ",
//       "real1 + real2 + real3 + real4 ",
//       "real1 + real2 + real3 + real4 + real5 ",
//       "real1 + real2 + real3 + real4 + real5 + real6 ",
//       "real1 + real2 + real3 + real4 + real5 + real6 + real7 ",
//       "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 ",
//       "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 ",
//       "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 ",
//       "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 ",
//       "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 + real12 ",
//     ];

//     // Validasi selectedMonth
//     if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
//       console.warn('[chartTrenbelanja] Invalid selectedMonth:', selectedMonth, 'defaulting to 7 (Juli)');
//       selectedMonth = 7; // Default ke Juli
//     }

//     const realisasiFormula = monthsAbbr[selectedMonth - 1];

//     let kppnFilter = "";
//     let kanwilFilter = "";
    
//     console.log('[generateSQLQuery] Filter building debug:', {
//       kdkanwil: kdkanwil,
//       kdkanwil_type: typeof kdkanwil,
//       kdkanwil_empty: !kdkanwil || kdkanwil === "" || kdkanwil === null || kdkanwil === undefined || kdkanwil === "00",
//       kppn: kppn,
//       kppn_type: typeof kppn,
//       kppn_empty: !kppn || kppn === "" || kppn === null || kppn === undefined || kppn === "00",
//       role: role,
//       isAdminRole: role === "X" || role === "0" || role === "1"
//     });
    
//     // Apply filter logic untuk semua role jika ada filter yang dipilih
//     console.log('[generateSQLQuery] Processing filters for all roles - applying selected filters');
    
//     if (kdkanwil && kdkanwil !== "" && kdkanwil !== null && kdkanwil !== undefined && kdkanwil !== "00") {
//       // Jika kanwil dipilih, tampilkan semua KPPN di bawah kanwil tersebut
//       kanwilFilter += ` AND a.kdkanwil='${kdkanwil}'`;
//       console.log('[generateSQLQuery] Applied kanwil filter:', kanwilFilter);
      
//       // Jika KPPN juga dipilih (selain "00"), filter lebih spesifik ke KPPN tersebut
//       if (kppn && kppn !== "" && kppn !== null && kppn !== undefined && kppn !== "00" && kppn !== "000") {
//         kppnFilter += ` AND a.kdkppn='${kppn}'`;
//         console.log('[generateSQLQuery] Applied kppn filter:', kppnFilter);
//       }
//     } else {
//       // Jika kanwil tidak dipilih ("00"), hanya filter berdasarkan KPPN jika ada
//       if (kppn && kppn !== "" && kppn !== null && kppn !== undefined && kppn !== "00" && kppn !== "000") {
//         kppnFilter += ` AND a.kdkppn='${kppn}'`;
//         console.log('[generateSQLQuery] Applied kppn-only filter:', kppnFilter);
//       }
//     }

//     console.log('[generateSQLQuery] Final filters:', {
//       kppnFilter,
//       kanwilFilter,
//       combinedFilter: kppnFilter + kanwilFilter
//     });

//     return `
//         SELECT
//           a.thang,
//           a.kddept,
//           a.kdjenbel,
//           SUM(a.pagu) AS pagu,
//           SUM(${realisasiFormula}) AS realisasi
//         FROM
//         digitalisasi_epa.tren_belanja_jenbel a 
//         WHERE
//           a.thang IN (${years.join(",")}) and a.kddept='${dept}'${kppnFilter}${kanwilFilter}
//         GROUP BY
//           a.thang,a.kdjenbel
//       `;
//   }

//   const getData = async () => {
//     setLoading(true);
    
//     console.log('[chartTrenbelanja] DETAILED Filter Debug:', {
//       'dataEpa context': dataEpa,
//       'kdkanwil value': kdkanwil,
//       'kppn value': kppn,
//       'dept value': deptInput,
//       'periode value': periodeInput,
//       'thang value': tahun,
//       'role value': role,
//       'periodeNumber': periodeNumber
//     });
    
//     const sqlQuery = generateSQLQuery(years, periodeNumber, kppn, kdkanwil, role, deptInput);
    
//     console.log('[chartTrenbelanja] Generated SQL:', sqlQuery);
    
//     const encodedQuery = encodeURIComponent(sqlQuery);
//     const cleanedQuery = decodeURIComponent(encodedQuery)
//       .replace(/\n/g, " ")
//       .replace(/\s+/g, " ")
//       .trim();
//     const encryptedQuery = Encrypt(cleanedQuery);
    
//     try {
//       const response = await axiosJWT.get(
//         import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
//           ? `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA}${encryptedQuery}`
//           : "",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
      
//       console.log('[chartTrenbelanja] Raw result:', response.data.result);
      
//       // Transform data untuk Recharts
//       const rawData = response.data.result || [];
      
//       // Grouping data berdasarkan jenis belanja - dengan mapping untuk ReCharts
//       const transformedData = {
//         pegawai: rawData.filter(item => item.kdjenbel === "51").map(item => ({
//           thang: item.thang,
//           real: item.realisasi || 0,
//           pagu: item.pagu || 0
//         })),
//         barang: rawData.filter(item => item.kdjenbel === "52").map(item => ({
//           thang: item.thang,
//           real: item.realisasi || 0,
//           pagu: item.pagu || 0
//         })), 
//         modal: rawData.filter(item => item.kdjenbel === "53").map(item => ({
//           thang: item.thang,
//           real: item.realisasi || 0,
//           pagu: item.pagu || 0
//         })),
//         bansos: rawData.filter(item => item.kdjenbel === "57").map(item => ({
//           thang: item.thang,
//           real: item.realisasi || 0,
//           pagu: item.pagu || 0
//         }))
//       };
      
//       console.log('[chartTrenbelanja] Transformed data:', transformedData);
      
//       setChartData(transformedData);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       const { status, data } = error.response || {};
//       handleHttpError(
//         status,
//         (data && data.error) || "Terjadi Permasalahan Koneksi atau Server Backend"
//       );
//     }
//   };

//   // useEffect untuk fetch data ketika filter berubah
//   useEffect(() => {
//     console.log('[chartTrenbelanja] useEffect triggered - Filter changed');
//     console.log('[chartTrenbelanja] Current dataEpa:', dataEpa);
//     console.log('[chartTrenbelanja] Dependencies check:', {
//       kdkanwil_current: kdkanwil,
//       kppn_current: kppn, 
//       deptInput_current: deptInput,
//       periodeInput_current: periodeInput,
//       tahun_current: tahun,
//       role_current: role
//     });
//     getData();
//   }, [filterValues, role]);

//   // Format nilai untuk display (dalam triliun)
//   const formatValue = (value) => {
//     return (value / 1000000000000).toFixed(1);
//   };

//   // Custom label untuk menampilkan nilai di atas bar
//   const CustomLabel = ({ x, y, width, height, value }) => {
//     const displayValue = formatValue(value);
//     return (
//       <text 
//         x={x + width / 2} 
//         y={y - 5} 
//         fill="#666" 
//         textAnchor="middle" 
//         fontSize="10"
//         fontWeight="bold"
//       >
//         {displayValue}T
//       </text>
//     );
//   };

//   // Custom tooltip
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border rounded shadow">
//           <p className="font-weight-bold">{`Tahun: ${label}`}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ color: entry.color }}>
//               {`${entry.name}: ${formatValue(entry.value)} T`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };
//   //console.log(data);
//   const pegawai =
//     data.length > 0 ? data.filter((item) => item.kdjenbel === "51") : [];
//   const barang =
//     data.length > 0 ? data.filter((item) => item.kdjenbel === "52") : [];
//   const modal =
//     data.length > 0 ? data.filter((item) => item.kdjenbel === "53") : [];
//   const bansos =
//     data.length > 0 ? data.filter((item) => item.kdjenbel === "57") : [];

//   const optionspegawai = {
//     chart: {
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false
//       }
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "60%",
//         borderRadius: 3,
//         dataLabels: {
//           enabled: true,
//           position: "top", // Pastikan nilai di atas batang
//           style: {
//             fontSize: "12px",
//             colors: ["#000"], // Warna hitam agar terlihat jelas
//             fontWeight: "bold",
//           },
//         },
//       },
//     },
//     xaxis: {
//       categories:
//         pegawai.length > 0 
//           ? pegawai.map((item) => item.thang ? item.thang.slice(2, 4) : "")
//           : [],
//       title: {
//         text: "PEGAWAI",
//         style: {
//           fontSize: "14px",
//           fontWeight: 600,
//         },
//       },
//     },
//     yaxis: {
//       show: true,
//       labels: {
//         formatter: function (val) {
//           return numeral(parseInt(val)).divide(1000000000000).format("0");
//         },
//       },
//     },
//     legend: {
//       show: true,
//       offsetX: 0,
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function (val) {
//         return numeral(val).divide(1000000000000).format("0");
//       },
//       offsetY: -20, // Angka lebih tinggi di atas batang
//       offsetX: 0,
//       style: {
//         colors: ["#000"],
//         fontSize: "12px",
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: function (val) {
//           return numeral(val).divide(1000000000000).format("0");
//         },
//       },
//     },
//   };

//   const optionsbarang = {
//     chart: {
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false
//       }
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "60%",
//         borderRadius: 3,
//         dataLabels: {
//           enabled: true,
//           position: "top", // Pastikan nilai di atas batang
//           orientation: "vertical", // Atur orientasi teks menjadi vertikal
//           textAnchor: "end", // Atur orientasi teks agar dimulai dari awal
//           style: {
//             fontSize: "12px",
//             colors: ["#000"], // Warna hitam agar terlihat jelas
//             fontWeight: "bold",
//           },
//         },
//       },
//     },
//     xaxis: {
//       categories:
//         barang.length > 0 
//           ? barang.map((item) => item.thang ? item.thang.slice(2, 4) : "")
//           : [],
//       title: {
//         text: "BARANG",
//         style: {
//           fontSize: "14px",
//           fontWeight: 600,
//         },
//       },
//     },
//     yaxis: {
//       show: true,
//       labels: {
//         formatter: function (val) {
//           return numeral(parseInt(val)).divide(1000000000000).format("0");
//         },
//       },
//     },
//     legend: {
//       show: true,
//       offsetX: 0,
//     },

//     dataLabels: {
//       enabled: true,
//       formatter: function (val) {
//         return numeral(val).divide(1000000000000).format("0");
//       },
//       offsetY: 10, // Angka lebih tinggi di atas batang
//       offsetX: 0,
//       style: {
//         colors: ["brown"],
//         fontSize: "12px",
//       },
//     },

//     tooltip: {
//       y: {
//         formatter: function (val) {
//           return numeral(val).divide(1000000000000).format("0");
//         },
//       },
//     },
//   };
//   const optionsmodal = {
//     chart: {
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false
//       }
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "60%",
//         borderRadius: 3,
//         dataLabels: {
//           enabled: true,
//           position: "top", // Pastikan nilai di atas batang
//           style: {
//             fontSize: "12px",
//             colors: ["#000"], // Warna hitam agar terlihat jelas
//             fontWeight: "bold",
//           },
//         },
//       },
//     },
//     xaxis: {
//       categories:
//         modal.length > 0 
//           ? modal.map((item) => item.thang ? item.thang.slice(2, 4) : "")
//           : [],
//       title: {
//         text: "MODAL",
//         style: {
//           fontSize: "14px",
//           fontWeight: 600,
//         },
//       },
//     },
//     yaxis: {
//       show: true,
//       labels: {
//         formatter: function (val) {
//           return numeral(parseInt(val)).divide(1000000000000).format("0");
//         },
//       },
//     },
//     legend: {
//       show: true,
//       offsetX: 0,
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function (val) {
//         return numeral(val).divide(1000000000000).format("0");
//       },
//       offsetY: -20, // Angka lebih tinggi di atas batang
//       style: {
//         colors: ["#000"],
//         fontSize: "12px",
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: function (val) {
//           return numeral(val).divide(1000000000000).format("0");
//         },
//       },
//     },
//   };

//   const optionsbansos = {
//     chart: { 
//       toolbar: { show: false },
//       zoom: {
//         enabled: false
//       }
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "60%",
//         borderRadius: 3,

//         dataLabels: {
//           enabled: true,
//           position: "top", // Pastikan nilai di atas batang
//           orientation: "vertical", // Atur orientasi teks menjadi vertikal
//           textAnchor: "end", // Atur orientasi teks agar dimulai dari awal

//           style: {
//             fontSize: "12px",
//             colors: ["#000"], // Warna hitam agar terlihat jelas
//             fontWeight: "bold",
//           },
//         },
//       },
//     },
//     xaxis: {
//       categories:
//         bansos.length > 0 ? bansos.map((item) => item.thang ? item.thang.slice(2, 4) : "") : [],
//       tickPlacement: "on", // Agar label sejajar dengan bar
//       title: {
//         text: "BANSOS",
//         style: { fontSize: "14px", fontWeight: 600 },
//       },
//     },
//     yaxis: {
//       show: true, // Menampilkan sumbu Y agar terlihat jelas
//       min: 0, // Memastikan nilai tidak tenggelam
//       forceNiceScale: true, // Menjaga proporsi skala
//       labels: {
//         formatter: (val) => numeral(val).divide(1e12).format("0"),
//       },
//     },
//     legend: {
//       show: true,
//       offsetX: 0,
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: function (val) {
//         return numeral(val).divide(1000000000000).format("0");
//       },
//       offsetY: 10, // Angka lebih tinggi di atas batang
//       offsetX: 0,
//       style: {
//         colors: ["brown"],
//         fontSize: "12px",
//       },
//     },
//     tooltip: {
//       y: { formatter: (val) => numeral(val).divide(1e12).format("0") },
//     },
//   };

//   const pagu51 =
//     pegawai.length > 0 ? pegawai.map((item) => parseInt(item.pagu) || 0) : [];

//   const real51 =
//     pegawai.length > 0 ? pegawai.map((item) => parseInt(item.realisasi) || 0) : [];

//   const persen51 =
//     pegawai.length > 0 
//       ? pegawai.map((item) => {
//           const pagu = parseFloat(item.pagu) || 0;
//           const realisasi = parseFloat(item.realisasi) || 0;
//           return pagu > 0 ? parseInt((realisasi / pagu) * 100) : 0;
//         })
//       : [];

//   const pagu52 = barang.length > 0 ? barang.map((item) => parseInt(item.pagu) || 0) : [];
//   const real52 =
//     barang.length > 0 ? barang.map((item) => parseInt(item.realisasi) || 0) : [];

//   const persen52 =
//     barang.length > 0 
//       ? barang.map((item) => {
//           const pagu = parseFloat(item.pagu) || 0;
//           const realisasi = parseFloat(item.realisasi) || 0;
//           return pagu > 0 ? parseInt((realisasi / pagu) * 100) : 0;
//         })
//       : [];

//   const pagu53 = modal.length > 0 ? modal.map((item) => parseInt(item.pagu) || 0) : [];
//   const real53 =
//     modal.length > 0 ? modal.map((item) => parseInt(item.realisasi) || 0) : [];

//   const persen53 =
//     modal.length > 0 
//       ? modal.map((item) => {
//           const pagu = parseFloat(item.pagu) || 0;
//           const realisasi = parseFloat(item.realisasi) || 0;
//           return pagu > 0 ? parseInt((realisasi / pagu) * 100) : 0;
//         })
//       : [];

//   const pagu57 = bansos.length > 0 ? bansos.map((item) => parseInt(item.pagu) || 0) : [];
//   const real57 =
//     bansos.length > 0 ? bansos.map((item) => parseInt(item.realisasi) || 0) : [];

//   const persen57 =
//     bansos.length > 0 
//       ? bansos.map((item) => {
//           const realisasi = parseFloat(item.realisasi) || 0;
//           const pagu = parseFloat(item.pagu) || 0;
//           return pagu > 0 ? parseInt((realisasi / pagu) * 100) : 0;
//         })
//       : [];

//   //console.log(persen57); // Cek nilai persen57

//   const line = {
//     chart: {
//       type: "line",
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false
//       },
//       offsetX: 0,
//     },

//     grid: {
//       show: false, // Menghilangkan grid lines
//     },
//     stroke: {
//       width: 3, // Atur lebar garis
//     },

//     dataLabels: {
//       enabled: true,
//       background: {
//         enabled: true,
//         foreColor: "#FFFFFF",
//         padding: 4,
//         borderRadius: 3,
//         borderWidth: 1,
//         borderColor: "blue",
//         opacity: 0.9,
//         dropShadow: {
//           enabled: true,
//           top: 1,
//           left: 1,
//           blur: 1,
//           color: "#000",
//           opacity: 0.25,
//         },
//       },
//     },
//     tooltip: {
//       enabled: false, // Menonaktifkan tooltip
//     },
//     legend: {
//       show: false, // Menyembunyikan legend
//     },

//     xaxis: {
//       labels: {
//         show: false, // Menyembunyikan label pada sumbu X
//       },
//       axisBorder: {
//         show: false, // Menyembunyikan border pada sumbu Y
//       },
//       axisTicks: {
//         show: false, // Menyembunyikan garis pada sumbu Y
//       },
//     },
//     yaxis: {
//       labels: {
//         show: false, // Menyembunyikan label pada sumbu Y
//       },
//     },
//   };

//   const linepegawai = [
//     {
//       data: persen51 || [],
//     },
//   ];

//   const linebarang = [
//     {
//       data: persen52 || [],
//     },
//   ];
//   const linemodal = [
//     {
//       data: persen53 || [],
//     },
//   ];
//   const linebansos = [
//     {
//       data: persen57 || [],
//     },
//   ];
//   const series51 = [
//     {
//       name: "pagu",
//       data: pagu51 || [],
//       color: "#062968",
//     },
//     {
//       name: "realisasi",
//       data: real51 || [],
//       color: "#FBC426",
//     },
//   ];
//   const series52 = [
//     {
//       name: "pagu",
//       data: pagu52 || [],
//       color: "#062968",
//     },
//     {
//       name: "realisasi",
//       data: real52 || [],
//       color: "#03921B",
//     },
//   ];
//   const series53 = [
//     {
//       name: "pagu",
//       data: pagu53 || [],
//       color: "#062968",
//     },
//     {
//       name: "realisasi",
//       data: real53 || [],
//       color: "#FE8D4C",
//     },
//   ];
//   const series57 = [
//     {
//       name: "pagu",
//       data: pagu57 || [],
//       color: "#062968", // Warna Merah
//     },
//     {
//       name: "realisasi",
//       data: real57 || [],
//       color: "#AC2EF9",
//     },
//   ];

//   return (
//     <>
//       <Container fluid>
//         {/* Header */}
//         <div className="header-kinerja-baris">
//           <div className="m-0 p-0">{datajenbel}</div>
//         </div>

//         {loading ? (
//           <div 
//             className="d-flex justify-content-center align-items-center"
//             style={{ height: "400px" }}
//           >
//             <div className="text-center">
//               <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
//               <p className="mt-2">Loading data...</p>
//             </div>
//           </div>
//         ) : (
//           <Row className="d-flex justify-content-center align-items-center">
//             {/* Chart Pegawai (Kode 51) */}
//             <Col md={6} className="mb-3">
//               <Card className="shadow-sm w-100 border border-secondary">
//                 <CardHeader className="bg-primary text-white text-center">
//                   <h6 className="mb-0">Belanja Pegawai</h6>
//                 </CardHeader>
//                 <CardBody className="d-flex flex-column align-items-center">
//                   {chartData.pegawai && chartData.pegawai.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart
//                         data={chartData.pegawai}
//                         margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="thang" />
//                         <YAxis 
//                           tickFormatter={(value) => `${formatValue(value)}T`}
//                         />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="real" fill="#8884d8" name="Realisasi">
//                           <LabelList content={<CustomLabel />} />
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div
//                       className="d-flex justify-content-center align-items-center text-danger text-center"
//                       style={{ height: "300px", width: "100%" }}
//                     >
//                       <div style={{ fontSize: "13px", fontWeight: "bold" }}>
//                         Data Tidak Ada <br />
//                         <i className="bi bi-emoji-frown mx-2"></i>
//                       </div>
//                     </div>
//                   )}
//                 </CardBody>
//               </Card>
//             </Col>

//             {/* Chart Barang (Kode 52) */}
//             <Col md={6} className="mb-3">
//               <Card className="shadow-sm w-100 border border-secondary">
//                 <CardHeader className="bg-success text-white text-center">
//                   <h6 className="mb-0">Belanja Barang</h6>
//                 </CardHeader>
//                 <CardBody className="d-flex flex-column align-items-center">
//                   {chartData.barang && chartData.barang.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart
//                         data={chartData.barang}
//                         margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="thang" />
//                         <YAxis 
//                           tickFormatter={(value) => `${formatValue(value)}T`}
//                         />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="real" fill="#82ca9d" name="Realisasi">
//                           <LabelList content={<CustomLabel />} />
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div
//                       className="d-flex justify-content-center align-items-center text-danger text-center"
//                       style={{ height: "300px", width: "100%" }}
//                     >
//                       <div style={{ fontSize: "13px", fontWeight: "bold" }}>
//                         Data Tidak Ada <br />
//                         <i className="bi bi-emoji-frown mx-2"></i>
//                       </div>
//                     </div>
//                   )}
//                 </CardBody>
//               </Card>
//             </Col>

//             {/* Chart Modal (Kode 53) */}
//             <Col md={6} className="mb-3">
//               <Card className="shadow-sm w-100 border border-secondary">
//                 <CardHeader className="bg-warning text-white text-center">
//                   <h6 className="mb-0">Belanja Modal</h6>
//                 </CardHeader>
//                 <CardBody className="d-flex flex-column align-items-center">
//                   {chartData.modal && chartData.modal.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart
//                         data={chartData.modal}
//                         margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="thang" />
//                         <YAxis 
//                           tickFormatter={(value) => `${formatValue(value)}T`}
//                         />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="real" fill="#ffc658" name="Realisasi">
//                           <LabelList content={<CustomLabel />} />
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div
//                       className="d-flex justify-content-center align-items-center text-danger text-center"
//                       style={{ height: "300px", width: "100%" }}
//                     >
//                       <div style={{ fontSize: "13px", fontWeight: "bold" }}>
//                         Data Tidak Ada <br />
//                         <i className="bi bi-emoji-frown mx-2"></i>
//                       </div>
//                     </div>
//                   )}
//                 </CardBody>
//               </Card>
//             </Col>

//             {/* Chart Bansos (Kode 57) */}
//             <Col md={6} className="mb-3">
//               <Card className="shadow-sm w-100 border border-secondary">
//                 <CardHeader className="bg-danger text-white text-center">
//                   <h6 className="mb-0">Bantuan Sosial</h6>
//                 </CardHeader>
//                 <CardBody className="d-flex flex-column align-items-center">
//                   {chartData.bansos && chartData.bansos.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart
//                         data={chartData.bansos}
//                         margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="thang" />
//                         <YAxis 
//                           tickFormatter={(value) => `${formatValue(value)}T`}
//                         />
//                         <Tooltip content={<CustomTooltip />} />
//                         <Bar dataKey="real" fill="#ff7c7c" name="Realisasi">
//                           <LabelList content={<CustomLabel />} />
//                         </Bar>
//                       </BarChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div
//                       className="d-flex justify-content-center align-items-center text-danger text-center"
//                       style={{ height: "300px", width: "100%" }}
//                     >
//                       <div style={{ fontSize: "13px", fontWeight: "bold" }}>
//                         Data Tidak Ada <br />
//                         <i className="bi bi-emoji-frown mx-2"></i>
//                       </div>
//                     </div>
//                   )}
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         )}

//         {/* Footer */}
//         <div className="header-kinerja-baris">
//           <div className="m-0 p-0">{datajenbel}</div>
//         </div>
//       </Container>
//     </>
//   );
// };

// export default EpaChartBelanja;
