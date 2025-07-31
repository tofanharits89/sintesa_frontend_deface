import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../notifikasi/toastError";

const ChartTrenBulanan = ({
  thang,
  periode,
  dept,
  prov,
  databulanan,
  refCluster,
}) => {
  const years = [thang - 4, thang - 3, thang - 2, thang - 1, thang];
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");
  const [formattedSeries, setFormattedSeries] = useState([]);

  useEffect(() => {
    if (refCluster && refCluster.length > 0) {
      getData();
    }
  }, [thang, periode, refCluster]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.thang,
      ROUND(SUM(pagu) / 1000000000000,0) AS pagu, 
      ROUND(SUM(real1) / 1000000000000,0) AS jan, 
      ROUND(SUM(real1 + real2) / 1000000000000,0) AS feb, 
      ROUND(SUM(real1 + real2 + real3) / 1000000000000,0) AS mar,
      ROUND(SUM(real1 + real2 + real3 + real4) / 1000000000000,0) AS apr, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5) / 1000000000000,0) AS mei, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6) / 1000000000000,0) AS jun, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7) / 1000000000000,0) AS jul, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8) / 1000000000000,0) AS ags, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9) / 1000000000000,0) AS sep, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10) / 1000000000000,0) AS okt, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11) / 1000000000000,0) AS nov, 
      ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 + real12) / 1000000000000,0) AS des
  
      FROM dashboard_profil.tren_belanja_jenbel a
      WHERE
        a.thang IN (${years.join(
          ", "
        )}) AND a.kddept in ${refCluster} GROUP BY a.thang;`
    );
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
        ].map((value) => {
          const numericValue = Number(value.replace(/,/g, "")); // Remove commas and convert to number
          return numericValue;
        }),
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
  // console.log(formattedSeries);
  return (
    <>
      <div>
        <>
          <div className="header-kinerja-kanan-cluster">
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
