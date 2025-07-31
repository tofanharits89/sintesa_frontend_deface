import React, { useState, useContext, useEffect, useMemo } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../../aplikasi/notifikasi/toastError";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";

const EpaChartDukman = ({ datadukman }) => {
  const { axiosJWT, token, dataEpa, role } = useContext(MyContext);
  const thang = parseInt(dataEpa?.year) || 2025;
  const periode = dataEpa?.period || "Januari";
  const dept = dataEpa?.kddept || "006";
  const kppn = dataEpa?.kdkppn || "";
  const years = [thang - 2, thang - 1, thang];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  function generateSQLQuery(years, selectedMonth, kppn, kdkanwil, role) {
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

    const selectColumns = monthsAbbr
      .map((month, index) => {
        if (index + 1 === selectedMonth) {
          return `SUM(${month}) AS realisasi${index + 1}`;
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");

    let kppnFilter = "";
    let kanwilFilter = "";
    
    /**
     * Logika Filter berdasarkan Role dan Filter:
     * 1. Role X, 0, 1: Akses penuh tanpa filter (semua kanwil dan KPPN)
     * 2. Role lain dengan kdkanwil = "00": Tampilkan semua kanwil
     *    - Jika kdkppn juga dipilih: Filter hanya KPPN tersebut dari semua kanwil
     * 3. Role lain dengan kdkanwil dipilih: Tampilkan semua KPPN di bawah kanwil tersebut
     *    - Jika kdkppn juga dipilih: Filter hanya KPPN tersebut di kanwil tersebut
     */
    
    // Untuk role X, 0, 1: tidak ada filter kanwil/KPPN
    const isAdminRole = role === "X" || role === "0" || role === "1";
    
    if (!isAdminRole) {
      // Logika filter normal untuk role selain admin
      if (kdkanwil && kdkanwil !== "" && kdkanwil !== null && kdkanwil !== undefined && kdkanwil !== "00") {
        // Jika kanwil dipilih, tampilkan semua KPPN di bawah kanwil tersebut
        kanwilFilter += ` AND a.kdkanwil='${kdkanwil}'`;
        
        // Jika KPPN juga dipilih (selain "00"), filter lebih spesifik ke KPPN tersebut
        if (kppn && kppn !== "" && kppn !== null && kppn !== undefined && kppn !== "00") {
          kppnFilter += ` AND a.kdkppn='${kppn}'`;
        }
      } else {
        // Jika kanwil tidak dipilih ("00"), hanya filter berdasarkan KPPN jika ada
        if (kppn && kppn !== "" && kppn !== null && kppn !== undefined && kppn !== "00") {
          kppnFilter += ` AND a.kdkppn='${kppn}'`;
        }
      }
    }
    return `
      SELECT
        a.thang,
        a.kddept,
        SUM(CASE WHEN a.kdprogram = 'WA' THEN a.pagu ELSE 0 END) AS pagu_wa,
        SUM(CASE WHEN a.kdprogram = 'WA' THEN ${monthsAbbr[selectedMonth - 1]} ELSE 0 END) AS realisasi_wa,
        SUM(CASE WHEN a.kdprogram <> 'WA' THEN a.pagu ELSE 0 END) AS pagu_non_wa,
        SUM(CASE WHEN a.kdprogram <> 'WA' THEN ${monthsAbbr[selectedMonth - 1]} ELSE 0 END) AS realisasi_non_wa
      FROM
        digitalisasi_epa.tren_belanja_dukman_teknis a
      WHERE
        a.thang IN (${years.join(", ")}) AND a.kddept='${dept}' AND a.kdprogram<>'ZZ'${kppnFilter}${kanwilFilter}
      GROUP BY
        a.thang  HAVING
        pagu_wa > 0 OR pagu_non_wa > 0 OR realisasi_wa > 0 OR realisasi_non_wa > 0
    `;
  }

  // Convert periode nama bulan ke angka
  const bulanIndonesia = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const periodeNumber = bulanIndonesia.indexOf(periode) + 1;

  useEffect(() => {
    const kdkanwil = dataEpa?.kdkanwil || "";
    const sqlQuery = generateSQLQuery(years, periodeNumber, kppn, kdkanwil, role);
    console.log('[chartDukman] useEffect triggered - dataEpa:', dataEpa);
    console.log('[chartDukman] role:', role, 'kdkanwil:', dataEpa?.kdkanwil, 'kdkppn:', dataEpa?.kdkppn);
    
    // Log filter logic berdasarkan role
    const isAdminRole = role === "X" || role === "0" || role === "1";
    
    if (isAdminRole) {
      console.log('[chartDukman] Filter: Role Admin - Menampilkan SEMUA kanwil dan KPPN (tanpa filter)');
    } else if (kdkanwil && kdkanwil !== "00") {
      console.log('[chartDukman] Filter: Menampilkan semua KPPN di kanwil', kdkanwil);
      if (kppn && kppn !== "00") {
        console.log('[chartDukman] Filter: Dipersempit ke KPPN', kppn, 'di kanwil', kdkanwil);
      }
    } else {
      console.log('[chartDukman] Filter: Menampilkan semua kanwil');
      if (kppn && kppn !== "00") {
        console.log('[chartDukman] Filter: Dipersempit ke KPPN', kppn, 'dari semua kanwil');
      }
    }
    
    console.log('[chartDukman] Generated SQL:', sqlQuery);
    getData(sqlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEpa?.kdkanwil, dataEpa?.kdkppn, dataEpa?.year, dataEpa?.period, dataEpa?.kddept, role]);

  const getData = async (sqlQuery) => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(sqlQuery);
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const encryptedQuery = Encrypt(cleanedQuery);
    console.log('[chartDukman] Final cleaned query:', cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('[chartDukman] Query result:', response.data.result);
      console.log('[chartDukman] Query result type:', typeof response.data.result);
      console.log('[chartDukman] Query result length:', response.data.result?.length);
      if (response.data.result?.length > 0) {
        console.log('[chartDukman] First item:', response.data.result[0]);
      }
      setData(response.data.result || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const options = {
    chart: { toolbar: { show: false } },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          position: "top", // Pastikan nilai di atas batang
          style: {
            fontSize: "12px",
            colors: ["#000"], // Warna hitam agar terlihat jelas
            fontWeight: "bold",
          },
        },
      },
    },

    xaxis: {
      categories: data.length > 0 ? (() => {
        const cats = data.map((item) => item.thang);
        console.log('[chartDukman] xaxis categories:', cats);
        return cats;
      })() : [],
      title: {
        text: "DUKMAN",
        style: {
          fontSize: "14px",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-title",
        },
      },
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (val) {
          return numeral(parseInt(val)).divide(1000000000000).format("0");
        },
      },
      axisTicks: {
        show: false, // Menyembunyikan garis pada sumbu Y
      },
      axisBorder: {
        show: false, // Menyembunyikan border pada sumbu Y
      },
    },
    legend: {
      show: true,
      offsetX: 0,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return numeral(val).divide(1000000000000).format("0");
      },
      offsetY: -20, // Angka lebih tinggi di atas batang
      style: {
        colors: ["#000"],
        fontSize: "12px",
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return numeral(val).divide(1000000000000).format("0");
        },
      },
    },
  };
  const options2 = {
    chart: {
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: "60%",
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          position: "top", // Pastikan nilai di atas batang
          style: {
            fontSize: "12px",
            colors: ["#000"], // Warna hitam agar terlihat jelas
            fontWeight: "bold",
          },
        },
      },
    },

    xaxis: {
      categories: data.length > 0 ? (() => {
        const cats = data.map((item) => item.thang);
        console.log('[chartDukman] xaxis categories options2:', cats);
        return cats;
      })() : [],
      title: {
        text: "TEKNIS",
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
    },

    yaxis: {
      show: false,
      labels: {
        formatter: function (val) {
          return numeral(val).divide(1000000000000).format("0"); // Format tanpa koma
        },
      },
    },

    legend: {
      show: true,
    },

    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return numeral(val).divide(1000000000000).format("0"); // Format tanpa koma
      },
      offsetY: -20, // Pastikan tidak bertabrakan
      style: {
        colors: ["#000"],
        fontSize: "12px",
        fontWeight: "bold",
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return numeral(val).divide(1000000000000).format("0"); // Format tanpa koma
        },
      },
    },
  };

  // Pastikan data series tidak ada NaN/undefined/null
  const pagu = useMemo(() => {
    const result = data.length > 0 ? data.map((item) => {
      const val = parseFloat(item.pagu_wa) || 0;
      return isNaN(val) ? 0 : val;
    }) : [];
    console.log('[chartDukman] pagu data:', result);
    return result;
  }, [data]);
  const real = useMemo(() => {
    const result = data.length > 0 ? data.map((item) => {
      const val = parseFloat(item.realisasi_wa) || 0;
      return isNaN(val) ? 0 : val;
    }) : [];
    console.log('[chartDukman] real data:', result);
    return result;
  }, [data]);
  const persenreal = useMemo(() => {
    const result = data.length > 0
      ? data.map((item) => {
          const paguVal = parseFloat(item.pagu_wa) || 0;
          const realVal = parseFloat(item.realisasi_wa) || 0;
          if (paguVal && paguVal !== 0) {
            const persen = Math.round((realVal / paguVal) * 100);
            return isNaN(persen) ? 0 : persen;
          }
          return 0;
        })
      : [];
    console.log('[chartDukman] persenreal data:', result);
    return result;
  }, [data]);
  const pagunondukman = useMemo(() => {
    const result = data.length > 0 ? data.map((item) => {
      const val = parseFloat(item.pagu_non_wa) || 0;
      return isNaN(val) ? 0 : val;
    }) : [];
    console.log('[chartDukman] pagunondukman data:', result);
    return result;
  }, [data]);
  const realnondukman = useMemo(() => {
    const result = data.length > 0 ? data.map((item) => {
      const val = parseFloat(item.realisasi_non_wa) || 0;
      return isNaN(val) ? 0 : val;
    }) : [];
    console.log('[chartDukman] realnondukman data:', result);
    return result;
  }, [data]);
  const persenreal2 = useMemo(() => {
    const result = data.length > 0
      ? data.map((item) => {
          const paguVal = parseFloat(item.pagu_non_wa) || 0;
          const realVal = parseFloat(item.realisasi_non_wa) || 0;
          if (paguVal && paguVal !== 0) {
            const persen = Math.round((realVal / paguVal) * 100);
            return isNaN(persen) ? 0 : persen;
          }
          return 0;
        })
      : [];
    console.log('[chartDukman] persenreal2 data:', result);
    return result;
  }, [data]);

  // Bungkus options dan series dengan useMemo agar referensi tidak berubah
  const optionsMemo = useMemo(() => options, [data]);
  const options2Memo = useMemo(() => options2, [data]);
  const lineOptions1 = useMemo(() => ({
    chart: {
      type: "line",

      toolbar: {
        show: false,
      },
      offsetX: 0,
    },

    grid: {
      show: false, // Menghilangkan grid lines
    },
    stroke: {
      width: 3, // Atur lebar garis
    },

    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        foreColor: "#FFFFFF",
        padding: 4,
        borderRadius: 5,
        borderWidth: 1,
        // borderColor: "#FA1B0D",
        opacity: 0.9,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.45,
        },
      },
    },
    tooltip: {
      enabled: false, // Menonaktifkan tooltip
    },
    legend: {
      show: false, // Menyembunyikan legend
    },
    xaxis: {
      labels: {
        show: false, // Menyembunyikan label pada sumbu X
      },
      axisBorder: {
        show: false, // Menyembunyikan border pada sumbu Y
      },
      axisTicks: {
        show: false, // Menyembunyikan garis pada sumbu Y
      },
    },
    yaxis: {
      labels: {
        show: false, // Menyembunyikan label pada sumbu Y
      },
    },
  }), []);
  const lineOptions2 = useMemo(() => ({
    chart: {
      type: "line",

      toolbar: {
        show: false,
      },
      offsetX: 0,
    },

    grid: {
      show: false, // Menghilangkan grid lines
    },
    stroke: {
      width: 3, // Atur lebar garis
    },

    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        foreColor: "#FFFFFF",
        padding: 4,
        borderRadius: 5,
        borderWidth: 1,
        // borderColor: "#FA1B0D",
        opacity: 0.9,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: "#000",
          opacity: 0.45,
        },
      },
    },
    tooltip: {
      enabled: false, // Menonaktifkan tooltip
    },
    legend: {
      show: false, // Menyembunyikan legend
    },
    xaxis: {
      labels: {
        show: false, // Menyembunyikan label pada sumbu X
      },
      axisBorder: {
        show: false, // Menyembunyikan border pada sumbu Y
      },
      axisTicks: {
        show: false, // Menyembunyikan garis pada sumbu Y
      },
    },
    yaxis: {
      labels: {
        show: false, // Menyembunyikan label pada sumbu Y
      },
    },
  }), []);

  const series = useMemo(() => {
    const result = [
      { name: "pagu", data: pagu, color: "#062968" },
      { name: "realisasi", data: real, color: "#5D5FF4" },
    ];
    console.log('[chartDukman] series data:', result);
    return result;
  }, [pagu, real]);
  const seriesnondukman = useMemo(() => {
    const result = [
      { name: "pagu", data: pagunondukman, color: "#440554" },
      { name: "realisasi", data: realnondukman, color: "#E17EF9" },
    ];
    console.log('[chartDukman] seriesnondukman data:', result);
    return result;
  }, [pagunondukman, realnondukman]);
  const lineSeries1 = useMemo(() => {
    const result = [{ name: "Line Series 1", data: persenreal }];
    console.log('[chartDukman] lineSeries1 data:', result);
    return result;
  }, [persenreal]);
  const lineSeries2 = useMemo(() => {
    const result = [{ name: "Line Series 1", data: persenreal2 }];
    console.log('[chartDukman] lineSeries2 data:', result);
    return result;
  }, [persenreal2]);

  // console.log(persenreal);
  return (
    <Container fluid>
      <div className="my-3">
        Tren Dukman-Teknis <br />
        TA {thang - 2} - {thang} (dalam triliun)
      </div>

      <Row className="justify-content-center">
        <Col
          xs={12}
          md={6}
          lg={6}
          className="d-flex justify-content-center mb-3"
        >
          <Card className="shadow-sm w-100 border border-secondary">
            <CardBody className="d-flex flex-column align-items-center">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
                  <LoadingTable />
                </div>
              ) : data.length > 0 ? (
                <>
                  <ApexCharts
                    options={lineOptions1}
                    series={lineSeries1}
                    type="line"
                    width={"50%"}
                    height={50}
                  />
                  <ApexCharts
                    options={optionsMemo}
                    series={series}
                    type="bar"
                    width={"100%"}
                    height={250}
                  />
                </>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-danger text-center"
                  style={{ height: 250 }}
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

        <Col
          xs={12}
          md={6}
          lg={6}
          className="d-flex justify-content-center mb-3"
        >
          <Card className="shadow-sm w-100 border border-secondary">
            <CardBody className="d-flex flex-column align-items-center">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
                  <LoadingTable />
                </div>
              ) : data.length > 0 ? (
                <>
                  <ApexCharts
                    options={lineOptions2}
                    series={lineSeries2}
                    type="line"
                    width={"50%"}
                    height={50}
                  />
                  <ApexCharts
                    options={options2Memo}
                    series={seriesnondukman}
                    type="bar"
                    width={"100%"}
                    height={250}
                  />
                </>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center text-danger text-center"
                  style={{ height: 250 }}
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

export default EpaChartDukman;
