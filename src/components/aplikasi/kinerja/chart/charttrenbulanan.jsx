import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";

import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";

import { handleHttpError } from "../../notifikasi/toastError";

const ChartTrenBulanan = ({ thang, periode, dept, prov, databulanan }) => {
  const years = [thang - 4, thang - 3, thang - 2, thang - 1, thang];
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [formattedSeries, setFormattedSeries] = useState([]);

  useEffect(() => {
    getData();
  }, [thang, periode, dept, prov]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.thang,SUM(pagu) AS pagu, 
      SUM(real1) AS jan, 
      SUM(real1 + real2) AS feb, 
      SUM(real1 + real2 + real3) AS mar,
      SUM(real1 + real2 + real3 + real4) AS apr, 
      SUM(real1 + real2 + real3 + real4 + real5) AS mei, 
      SUM(real1 + real2 + real3 + real4 + real5 + real6) AS jun, 
      SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7) AS jul, 
      SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8) AS ags, 
      SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9) AS sep, 
      SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10) AS okt, 
      SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11) AS nov, 
      SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 + real12) AS des
      FROM dashboard_profil.tren_belanja_jenbel a
      WHERE
        a.thang IN (${years.join(
          ", "
        )}) AND a.kddept='${dept}' GROUP BY a.thang;`
    );
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const encryptedQuery = Encrypt(cleanedQuery);
    // console.log(cleanedQuery);
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
      setData(response.data.result);
      const newFormattedSeries = response.data.result.map((item) => ({
        name: item.thang,
        data: [
          item.jan,
          item.feb,
          item.mar,
          item.apr,
          item.mei,
          item.jun,
          item.jul,
          item.ags,
          item.sep,
          item.okt,
          item.nov,
          item.des,
        ].map((value) => numeral(value / 1000000000000).format("0,0")),
      }));

      // Set formattedSeries to state for use in the chart
      setFormattedSeries(newFormattedSeries);
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

  // const series = data.map((item) => ({
  //   name: item.thang,
  //   data: [
  //     item.jan,
  //     item.feb,
  //     item.mar,
  //     item.apr,
  //     item.mei,
  //     item.jun,
  //     item.jul,
  //     item.ags,
  //     item.sep,
  //     item.okt,
  //     item.nov,
  //     item.des,
  //   ],
  // }));

  // Identifikasi index tahun terakhir dalam array series
  // const lastIndex = series.length - 1;

  // const formattedSeries = series.map((item, index) => ({
  //   name: item.name,
  //   data: item.data.map((value) => numeral(value / 1000000000).format("0,0")),
  //   stroke: {
  //     width: index === lastIndex ? 4 : 2, // Atur ketebalan garis tahun terakhir menjadi lebih tebal
  //   },
  // }));

  // const formattedSeries = series.map((item) => ({
  //   name: item.name,
  //   data: item.data.map((value) => numeral(value / 1000000000).format("0,0")), // Format each data point
  // }));
  const options = {
    chart: {
      stacked: false,
      width: "100%",
      toolbar: {
        show: false,
      },
      offsetY: 10,
      animations: {
        enabled: true, // Aktifkan animasi
        easing: "easeinout", // Gaya animasi
        speed: 100, // Kecepatan animasi (ms)
        animateGradually: {
          enabled: true,
          delay: 500,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 150,
        },
      },
    },
    grid: {
      show: false, // Menghilangkan grid lines
      stroke: "transparent", // Mengatur garis grid menjadi transparan (jika diperlukan)
      padding: {
        top: -20, // Mengatur padding atas menjadi 0
      },
    },
    // colors: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agt",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
    },
    stroke: {
      width: data.map((item, index) => {
        return item.thang === thang ? 5 : 2;
      }),

      dashArray: data.map((item, index) => {
        return index !== data.length - 1 ? [8, 4] : [3, 0]; // Berikan dashArray pada tahun kecuali tahun terakhir
      }),
    },

    dataLabels: {
      enabled: false,
      enabledOnSeries: [0],
    },
    fill: {
      type: "gradient",
    },
    // stroke: {
    //   width: 20,
    // },
    // stroke: {
    //   show: true,
    //   curve: "smooth",
    //   lineCap: "butt",
    //   colors: undefined,
    //   width: 2,
    //   dashArray: 0,
    // },
    // markers: {
    //   size: [1, 2],
    // },
    legend: {
      enabled: true,
      position: "top", // Atur posisi legend di bagian atas grafik
      horizontalAlign: "center", // Atur perataan horizontal ke tengah
      offsetY: 0, // Geser legend ke atas
    },
  };

  return (
    <>
      <div>
        <>
          <div className="header-kinerja-kanan">
            Tren Belanja Bulanan TA {thang - 4} - {thang} (triliun)
          </div>

          {data.length > 0 ? (
            <ApexCharts
              options={options}
              series={formattedSeries}
              height={165}
              width="100%"
              type="line"
            />
          ) : (
            <span className="d-flex justify-content-center text-danger ">
              Data Tidak Ada <br />
              &nbsp;
              <i className="bi bi-emoji-frown mx-2"></i>
            </span>
          )}
          <div className="header-kinerja-baris mt-3">
            <div className="ms-2 me-auto">{databulanan}</div>
          </div>
        </>
      </div>
    </>
  );
};

export default ChartTrenBulanan;
