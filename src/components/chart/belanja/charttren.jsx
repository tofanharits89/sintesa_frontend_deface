import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../auth/Random";
import { LoadingTable } from "../../layout/LoadingTable";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";

const Tren = (props) => {
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  useEffect(() => {
    props.query && getData();
    //console.log(data);
  }, [props.query]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(props.query);
    const encryptedQuery = Encrypt(encodedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);

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
  const series = data.map((item) => ({
    name: item.thang,
    data: [
      item.jan,
      item.feb,
      item.mar,
      item.apr,
      item.mei,
      item.jun,
      item.jul,
      item.agt,
      item.sep,
      item.okt,
      item.nov,
      item.des,
    ],
  }));
  const formattedSeries = series.map((item) => ({
    name: item.name,
    data: item.data.map((value) => numeral(value).format("0.00")), // Format each data point
  }));
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
          delay: 1500,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 150,
        },
      },
    },
    colors: ["#FF5733", "#FFC300", "#00BFFF", "#33FF57", "#A569BD"],
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
      curve: "smooth",
      dashArray: [0, 0, 5],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
    },

    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
  };

  return (
    <div className="pie">
      {loading ? (
        <>
          <LoadingTable />
          <br></br>
          <LoadingTable />
        </>
      ) : (
        <>
          <div className="chart-label-kiri">Tren Realisasi Belanja</div>
          {data.length > 0 ? (
            <ApexCharts
              options={options}
              series={formattedSeries}
              height={250}
            />
          ) : (
            <span className="text-danger">
              Data Tidak Ada <br />
              <i className="bi bi-emoji-frown "></i>
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default Tren;
