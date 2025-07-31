import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../notifikasi/toastError";

const Ikpa = ({ thang, periode, cluster }) => {
  const years = [thang - 2, thang - 1, thang]; // Tahun yang diinginkan

  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  useEffect(() => {
    getData();
  }, [thang, periode, cluster]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.thang,a.kdcluster,a.periode,a.username,a.nilaiikpa from laporan_2023.tren_ikpa_cluster a
      WHERE  a.kdcluster='${cluster}' AND a.periode='${periode}' order by a.thang
      `
    );
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    //  console.log(cleanedQuery);
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

  const tahun = data.map((item) => item.thang);
  const nilaiIKPA = data.map((item) => {
    const parsedValue = parseFloat(item.nilaiikpa);
    return !isNaN(parsedValue) ? parsedValue : 0; // Jika bukan angka, kembalikan nilai default (misalnya 0)
  });

  const options = {
    chart: {
      stacked: false,
      type: "line",
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
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return numeral(val).format("0.0");
      },
      style: {
        colors: ["brown"],
        fontSize: "14px",
      },
    },
    xaxis: {
      categories: tahun,
    },
  };

  return (
    <>
      <div className="pie ">
        {loading ? (
          <div className="my-4">
            <LoadingTable />
            <LoadingTable />
          </div>
        ) : (
          <>
            <div className="header-kinerja-cluster">
              Perkembangan Nilai IKPA TA {thang - 4} - {thang}
            </div>

            {data.length > 0 ? (
              <ApexCharts
                options={options}
                series={[{ name: "Nilai IKPA", data: nilaiIKPA }]}
                height={175}
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
          </>
        )}
      </div>
    </>
  );
};

export default Ikpa;
