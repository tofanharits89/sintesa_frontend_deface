import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../../aplikasi/notifikasi/toastError";
import { Col, Container, Row } from "react-bootstrap";

const ChartDukman = ({
  thang,
  periode,
  cluster,
  prov,
  datadukman,
  refCluster,
}) => {
  const years = [thang - 2, thang - 1, thang];
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  function generateSQLQuery(years, selectedMonth) {
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

    return `
      SELECT
        a.thang,
        a.kddept,
        a.kdprogram,
        SUM(CASE WHEN a.kdprogram = 'WA' THEN a.pagu ELSE 0 END) AS pagu_wa,
        SUM(CASE WHEN a.kdprogram = 'WA' THEN ${
          monthsAbbr[selectedMonth - 1]
        } ELSE 0 END) AS realisasi_wa,
        SUM(CASE WHEN a.kdprogram <> 'WA' THEN a.pagu ELSE 0 END) AS pagu_non_wa,
        SUM(CASE WHEN a.kdprogram <> 'WA' THEN ${
          monthsAbbr[selectedMonth - 1]
        } ELSE 0 END) AS realisasi_non_wa
       
      FROM
        dashboard_profil.tren_belanja_dukman_teknis a
      WHERE
        a.thang IN (${years.join(
          ", "
        )}) AND a.kddept in ${refCluster} AND a.kdprogram<>'ZZ'
      GROUP BY
        a.thang  HAVING
        pagu_wa > 0 OR pagu_non_wa > 0 OR realisasi_wa > 0 OR realisasi_non_wa > 0
    `;
  }

  useEffect(() => {
    const sqlQuery = generateSQLQuery(years, parseInt(periode));

    if (refCluster && refCluster.length > 0) {
      getData(sqlQuery);
    }
  }, [thang, periode, refCluster]);

  const getData = async (sqlQuery) => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(sqlQuery);
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const encryptedQuery = Encrypt(cleanedQuery);
    //  console.log(sqlQuery);
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
      // console.log(cleanedQuery);
      setData(response.data.result);
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
    chart: {
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 1500,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false, // Menghilangkan grid lines
      stroke: "transparent", // Mengatur garis grid menjadi transparan (jika diperlukan)
      padding: {
        top: -25, // Mengatur padding atas menjadi 0
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        dataLabels: {
          enabled: true,
          orientation: "vertical", // Atur orientasi teks menjadi vertikal
          textAnchor: "end", // Atur orientasi teks agar dimulai dari awal
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "12px", // Sesuaikan jika perlu
          },
        },
      },
    },
    dataLabels: {
      formatter: function (val) {
        return numeral(val).divide(1000000000000).format("0.0");
      },
      offsetY: 10,
    },

    xaxis: {
      categories: data.length > 0 && data.map((item) => item.thang),
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
          return numeral(parseInt(val)).divide(1000000000000).format("0.0");
        },
      },
      axisTicks: {
        show: false, // Menyembunyikan garis pada sumbu Y
      },
      axisBorder: {
        show: false, // Menyembunyikan border pada sumbu Y
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return numeral(val).divide(1000000000000).format("0.0");
        },
      },
    },
  };
  const options2 = {
    chart: {
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 1500,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false, // Menghilangkan grid lines
      stroke: "transparent", // Mengatur garis grid menjadi transparan (jika diperlukan)
      padding: {
        top: -25, // Mengatur padding atas menjadi 0
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 7,
        dataLabels: {
          enabled: true,
          orientation: "vertical", // Atur orientasi teks menjadi vertikal
          textAnchor: "end", // Atur orientasi teks agar dimulai dari awal
          offsetX: 0,
          offsetY: 0,
        },
      },
    },

    dataLabels: {
      formatter: function (val) {
        return numeral(val).divide(1000000000000).format("0.0");
      },
      offsetY: 10,
      style: {
        fontSize: "12px",
        colors: ["white"],
      },
    },

    xaxis: {
      categories: data.length > 0 && data.map((item) => item.thang),
      title: {
        text: "TEKNIS",
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
          return numeral(parseInt(val)).divide(1000000000000).format("0.0");
        },
      },
    },
    legend: {
      show: true,
      offsetX: 0,
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return numeral(val).divide(1000000000000).format("0.0");
        },
      },
    },
  };

  const pagu = data.length > 0 && data.map((item) => parseInt(item.pagu_wa));

  const real =
    data.length > 0 && data.map((item) => parseInt(item.realisasi_wa));

  const persenreal =
    data.length > 0 &&
    data.map((item) => parseInt((item.realisasi_wa / item.pagu_wa) * 100));

  const persenreal2 =
    data.length > 0 &&
    data.map((item) =>
      parseInt((item.realisasi_non_wa / item.pagu_non_wa) * 100)
    );

  const pagunondukman =
    data.length > 0 && data.map((item) => parseInt(item.pagu_non_wa));

  const realnondukman =
    data.length > 0 && data.map((item) => parseInt(item.realisasi_non_wa));

  const series = [
    {
      name: "pagu",
      data: pagu,
      color: "#062968",
    },
    {
      name: "realisasi",
      data: real,
      color: "#5D5FF4",
    },
  ];
  const seriesnondukman = [
    {
      name: "pagu",
      data: pagunondukman,
      color: "#440554",
    },
    {
      name: "realisasi",
      data: realnondukman,
      color: "#E17EF9",
    },
  ];

  const lineOptions1 = {
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
  };

  const lineSeries1 = [
    {
      name: "Line Series 1",
      data: persenreal,
    },
  ];

  const lineOptions2 = {
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
  };

  const lineSeries2 = [
    {
      data: persenreal2,
    },
  ];
  // console.log(series);
  return (
    <Container fluid>
      <div className="pie">
        <div className="header-kinerja-cluster">
          Tren Dukman-Teknis TA {thang - 2} - {thang} (triliun)
        </div>

        <Row>
          <Col sm={6} className="justify-content-center">
            {data.length > 0 ? (
              <>
                <ApexCharts
                  options={lineOptions1}
                  series={lineSeries1}
                  type="line"
                  width={160}
                  height={50}
                />
                <br />
                <ApexCharts
                  options={options}
                  series={series}
                  height={200}
                  width={200}
                  type="bar"
                />
              </>
            ) : (
              <span className="d-flex justify-content-center text-danger">
                Data Tidak Ada <br />
                &nbsp;
                <i className="bi bi-emoji-frown mx-2"></i>
              </span>
            )}
          </Col>
          <Col sm={6} className=" justify-content-center">
            {data.length > 0 ? (
              <>
                <ApexCharts
                  options={lineOptions2}
                  series={lineSeries2}
                  type="line"
                  width={160}
                  height={50}
                />
                <br />
                <ApexCharts
                  options={options2}
                  series={seriesnondukman}
                  height={200}
                  width={200}
                  type="bar"
                />
              </>
            ) : (
              <span className="d-flex justify-content-center text-danger">
                Data Tidak Ada <br />
                &nbsp;
                <i className="bi bi-emoji-frown mx-2"></i>
              </span>
            )}
          </Col>
        </Row>
        <div className="header-kinerja-baris">
          <div className="m-0 p-0">{datadukman}</div>
        </div>
      </div>
    </Container>
  );
};

export default ChartDukman;
