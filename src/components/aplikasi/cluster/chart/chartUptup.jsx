import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";

import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../notifikasi/toastError";

const ChartUptup = ({ thang, periode, dept, prov, datauptup, refCluster }) => {
  const years = [thang - 4, thang - 3, thang - 2, thang - 1, thang];
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (refCluster && refCluster.length > 0) {
      getData();
    }
  }, [thang, periode, refCluster]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT thang,LEFT(a.kdbkpk,2) belanja,SUM(a.rupiah)/1000000000 AS rupiah FROM dashboard_profil.dash_tup a
      WHERE
        a.thang ='${thang}' AND a.kddept in ${refCluster} GROUP BY thang,a.kddept,a.kdbkpk`
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

  const dataBelanja82 = data.filter((item) => item.belanja === "82");
  const dataBelanja81 = data.filter((item) => item.belanja === "81");

  const totalRupiah82 = dataBelanja82.reduce(
    (total, item) => total + parseFloat(item.rupiah),
    0
  );
  const totalRupiah81 = dataBelanja81.reduce(
    (total, item) => total + Math.abs(parseFloat(item.rupiah)),
    0
  );

  const sisa = numeral(totalRupiah82 - totalRupiah81).format("0.00");

  var options = {
    chart: {
      type: "donut",
      width: "100%",
      toolbar: {
        show: true,
      },
      padding: {
        top: 0,
        bottom: 0,
        left: -10,
        right: -10,
      },
      animations: {
        enabled: true, // Aktifkan animasi
        easing: "easeinout", // Gaya animasi
        speed: 1000, // Kecepatan animasi (ms)
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
    labels: ["SISA", "PTUP"],

    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return numeral(val).format("0,0.0") + "%"; // Menambahkan '%' setelah pemformatan angka
      },
      offsetX: 0,
      offsetY: 0,
      dropShadow: {
        enabled: true,
      },
    },

    legend: {
      enabled: false,
      position: "bottom", // Set the legend position to the right
      horizontalAlign: "center",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              offsetY: 10,
            },
            total: {
              show: true,
              showAlways: true,
              fontSize: "15px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              label: `TUP: ${numeral(totalRupiah82).format("0.00")} M`,
              color: "#0065bd",
              formatter: function (w) {
                return "";
              },
            },
          },
        },
      },
    },

    fill: {
      type: ["solid", "gradient"],
      // colors: ["#1A73E8", "#B32824"],
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  const series = [parseFloat(sisa), totalRupiah81];

  // console.log(series);

  return (
    <div className="donut">
      <div className="header-kinerja-kanan-cluster">
        TUP DAN PTUP TA {thang} (miliar)
      </div>
      {loading ? (
        <div className="mt-3">
          <LoadingTable />

          <LoadingTable />
        </div>
      ) : (
        <>
          {data.length > 0 ? (
            <>
              <div
                style={{ fontSize: "14px", fontWeight: "bold" }}
                className="text-center"
              >
                PTUP : {numeral(totalRupiah81).format("0.0")} M | SISA :{" "}
                {numeral(sisa).format("0.0")} M
              </div>
              <ApexCharts
                options={options}
                series={series}
                type="donut"
                height={275}
                width="100%"
              />
            </>
          ) : (
            <span className="d-flex justify-content-center text-danger ">
              Data Tidak Ada <br />
              &nbsp;
              <i className="bi bi-emoji-frown mx-2"></i>
            </span>
          )}
          <div className="header-kinerja-baris">
            <div className="m-0 p-0">{datauptup}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartUptup;
