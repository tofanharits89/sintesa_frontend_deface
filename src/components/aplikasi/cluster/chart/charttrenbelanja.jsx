import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../../aplikasi/notifikasi/toastError";
import { Col, Container, Row } from "react-bootstrap";

const ChartBelanja = ({
  thang,
  periode,
  dept,
  prov,
  datajenbel,
  refCluster,
}) => {
  const years = [thang - 4, thang - 3, thang - 2, thang - 1, thang];
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
          return `SUM(${month}) AS realisasi`;
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");

    return `
      SELECT
        a.thang,
        a.kddept,
        a.kdjenbel,
               SUM(a.pagu) AS pagu,
        ${selectColumns}
      FROM
      dashboard_profil.tren_belanja_jenbel a 
      WHERE
        a.thang IN (${years.join(",")}) AND a.kddept in ${refCluster}
      GROUP BY
        a.thang,a.kdjenbel
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
  //console.log(data);
  const pegawai =
    data.length > 0 && data.filter((item) => item.kdjenbel === "51");
  const barang =
    data.length > 0 && data.filter((item) => item.kdjenbel === "52");
  const modal =
    data.length > 0 && data.filter((item) => item.kdjenbel === "53");
  const bansos =
    data.length > 0 && data.filter((item) => item.kdjenbel === "57");

  const optionspegawai = {
    chart: {
      toolbar: {
        show: false,
      },
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
        fontSize: "10px", // Sesuaikan jika perlu
      },
    },
    xaxis: {
      categories:
        pegawai.length > 0 &&
        pegawai.map((item) => item.thang && item.thang.slice(2, 4)),
      title: {
        text: "PEGAWAI",
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
    responsive: [
      {
        breakpoint: 1000,
        options: {
          bar: { horizontal: false },
        },
        legend: { position: "bottom" },
      },
    ],
  };

  const optionsbarang = {
    chart: {
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
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
        fontSize: "10px", // Sesuaikan jika perlu
      },
    },
    xaxis: {
      categories:
        barang.length > 0 &&
        barang.map((item) => item.thang && item.thang.slice(2, 4)),
      title: {
        text: "BARANG",
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
    responsive: [
      {
        breakpoint: 1000,
        options: {
          bar: { horizontal: false },
        },
        legend: { position: "bottom" },
      },
    ],
  };
  const optionsmodal = {
    chart: {
      toolbar: {
        show: false,
      },
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
        fontSize: "10px", // Sesuaikan jika perlu
      },
    },
    xaxis: {
      categories:
        modal.length > 0 &&
        modal.map((item) => item.thang && item.thang.slice(2, 4)),
      title: {
        text: "MODAL",
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
    responsive: [
      {
        breakpoint: 1000,
        options: {
          bar: { horizontal: false },
        },
        legend: { position: "bottom" },
      },
    ],
  };

  const optionsbansos = {
    chart: {
      toolbar: {
        show: false,
      },
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
        fontSize: "10px", // Sesuaikan jika perlu
      },
    },
    xaxis: {
      categories:
        bansos.length > 0 &&
        bansos.map((item) => item.thang && item.thang.slice(2, 4)),
      title: {
        text: "BANSOS",
        style: {
          fontSize: "14px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      show: false,
      min: 0,
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
    responsive: [
      {
        breakpoint: 1000,
        options: {
          bar: { horizontal: false },
        },
        legend: { position: "bottom" },
      },
    ],
  };

  const pagu51 =
    pegawai.length > 0 && pegawai.map((item) => parseInt(item.pagu));

  const real51 =
    pegawai.length > 0 && pegawai.map((item) => parseInt(item.realisasi));

  const persen51 =
    pegawai.length > 0 &&
    pegawai.map((item) => parseInt((item.realisasi / item.pagu) * 100));

  const pagu52 = barang.length > 0 && barang.map((item) => parseInt(item.pagu));
  const real52 =
    barang.length > 0 && barang.map((item) => parseInt(item.realisasi));

  const persen52 =
    barang.length > 0 &&
    barang.map((item) => parseInt((item.realisasi / item.pagu) * 100));

  const pagu53 = modal.length > 0 && modal.map((item) => parseInt(item.pagu));
  const real53 =
    modal.length > 0 && modal.map((item) => parseInt(item.realisasi));

  const persen53 =
    modal.length > 0 &&
    modal.map((item) => parseInt((item.realisasi / item.pagu) * 100));

  const pagu57 = bansos.length > 0 && bansos.map((item) => parseInt(item.pagu));
  const real57 =
    bansos.length > 0 && bansos.map((item) => parseInt(item.realisasi));

  const persen57 =
    bansos.length > 0 &&
    bansos.map((item) => {
      const realisasi = parseFloat(item.realisasi);
      const pagu = parseFloat(item.pagu);

      // Pastikan nilai realisasi dan pagu adalah angka yang valid
      if (!isNaN(realisasi) && !isNaN(pagu) && pagu !== 0) {
        const percentage = (realisasi / pagu) * 100;
        return parseInt(percentage);
      } else {
        return 0; // Atau nilai lain jika tidak valid atau pembagi adalah 0
      }
    });

  //console.log(persen57); // Cek nilai persen57

  const line = {
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

  const linepegawai = [
    {
      data: persen51,
    },
  ];

  const linebarang = [
    {
      data: persen52,
    },
  ];
  const linemodal = [
    {
      data: persen53,
    },
  ];
  const linebansos = [
    {
      data: !persen57 ? 0 : persen57,
    },
  ];
  const series51 = [
    {
      name: "pagu",
      data: pagu51,
      color: "#062968",
    },
    {
      name: "realisasi",
      data: real51,
      color: "#FBC426",
    },
  ];
  const series52 = [
    {
      name: "pagu",
      data: pagu52,
      color: "#062968",
    },
    {
      name: "realisasi",
      data: real52,
      color: "#03921B",
    },
  ];
  const series53 = [
    {
      name: "pagu",
      data: pagu53,
      color: "#062968",
    },
    {
      name: "realisasi",
      data: real53,
      color: "#FE8D4C",
    },
  ];
  const series57 = [
    {
      name: "pagu",
      data: pagu57,
      color: "#062968", // Warna Merah
    },
    {
      name: "realisasi",
      data: real57,
      color: "#AC2EF9",
    },
  ];

  return (
    <>
      <Container fluid>
        <>
          <div className="header-kinerja-cluster">
            Tren Per Jenis Belanja TA {thang - 4} - {thang} (triliun)
          </div>

          <Row>
            <Col sm={3} md={3} lg={3} xl={3} className="justify-content-center">
              {data.length > 0 ? (
                <>
                  <ApexCharts
                    options={line}
                    series={linepegawai}
                    type="line"
                    width={190}
                    height={50}
                  />
                  <ApexCharts
                    options={optionspegawai}
                    series={series51}
                    height={200}
                    width={200}
                    type="bar"
                  />
                </>
              ) : (
                <span className="d-flex justify-content-center text-danger ">
                  Data Tidak Ada <br />
                  &nbsp;
                  <i className="bi bi-emoji-frown mx-2"></i>
                </span>
              )}
            </Col>
            <Col sm={3} md={3} lg={3} xl={3} className="justify-content-center">
              {data.length > 0 ? (
                <>
                  <ApexCharts
                    options={line}
                    series={linebarang}
                    type="line"
                    width={190}
                    height={50}
                  />
                  <ApexCharts
                    options={optionsbarang}
                    series={series52}
                    height={200}
                    width={200}
                    type="bar"
                  />
                </>
              ) : (
                <span className="d-flex justify-content-center text-danger ">
                  Data Tidak Ada <br />
                  &nbsp;
                  <i className="bi bi-emoji-frown mx-2"></i>
                </span>
              )}
            </Col>
            <Col sm={3} md={3} lg={3} xl={3} className="justify-content-center">
              {data.length > 0 ? (
                <>
                  <ApexCharts
                    options={line}
                    series={linemodal}
                    type="line"
                    width={190}
                    height={50}
                  />
                  <ApexCharts
                    options={optionsmodal}
                    series={series53}
                    height={200}
                    width={200}
                    type="bar"
                  />
                </>
              ) : (
                <span className="d-flex justify-content-center text-danger ">
                  Data Tidak Ada <br />
                  &nbsp;
                  <i className="bi bi-emoji-frown mx-2"></i>
                </span>
              )}
            </Col>
            <Col sm={3} md={3} lg={3} xl={3} className="justify-content-center">
              {bansos.length > 0 && (
                <>
                  <ApexCharts
                    options={line}
                    series={linebansos}
                    type="line"
                    width={190}
                    height={50}
                  />
                  <ApexCharts
                    options={optionsbansos}
                    series={series57}
                    height={200}
                    width={200}
                    type="bar"
                  />
                </>
              )}
            </Col>
          </Row>
          <div className="header-kinerja-baris">
            <div className="m-0 p-0">{datajenbel}</div>
          </div>
        </>
      </Container>
    </>
  );
};

export default ChartBelanja;
