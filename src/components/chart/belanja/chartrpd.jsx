import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../auth/Random";
import { LoadingTable } from "../../layout/LoadingTable";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";

const Rpd = (props) => {
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  useEffect(() => {
    props.query && getData();
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
  const rencData = data.map((item) =>
    [
      item.renc1,
      item.renc2,
      item.renc3,
      item.renc4,
      item.renc5,
      item.renc6,
      item.renc7,
      item.renc8,
      item.renc9,
      item.renc10,
      item.renc11,
      item.renc12,
    ].map((value) => numeral(value).format("0,0.00"))
  );

  const realData = data.map((item) =>
    [
      item.real1,
      item.real2,
      item.real3,
      item.real4,
      item.real5,
      item.real6,
      item.real7,
      item.real8,
      item.real9,
      item.real10,
      item.real11,
      item.real12,
    ].map((value) => numeral(value).format("0,0.00"))
  );
  const persenData = data.map((item) =>
    [
      item.persen1,
      item.persen2,
      item.persen3,
      item.persen4,
      item.persen5,
      item.persen6,
      item.persen7,
      item.persen8,
      item.persen9,
      item.persen10,
      item.persen11,
      item.persen12,
    ].map((value) => numeral(value).format("0,0.00"))
  );
  const options = {
    chart: {
      stacked: false,
      toolbar: {
        show: false,
      },
      width: "100%",
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
    colors: ["#008FFB", "#FF4560"],
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
      enabledOnSeries: [2],
    },

    markers: {
      size: 0,
      hover: {
        sizeOffset: 6,
      },
    },
    yaxis: [
      {
        title: {
          text: "Rencana",
        },
      },

      {
        opposite: true,
        title: {
          text: "Realisasi",
        },
      },
    ],
  };

  const series = [
    {
      name: "Rencana",
      type: "bar",
      data: rencData[0],
    },
    {
      name: "Realisasi",
      type: "bar",
      data: realData[0],
    },
    {
      name: "Deviasi",
      data: persenData[0],
      type: "line",
      color: "blueviolet",
      dashed: {
        strokeDashArray: 15, // Mengatur panjang dan jarak putus-putus (dalam pixel)
      },
    },
  ];

  // const series = [
  //   {
  //     name: "Series A",
  //     type: "column",
  //     data: [44, 55, 41, 64, 22, 43, 21, 53, 76],
  //   },
  //   {
  //     name: "Series B",
  //     type: "line",
  //     data: [11, 22, 32, 41, 19, 37, 66, 44, 33],
  //   },
  // ];

  return (
    <div className="pie">
      <div className="chart-label-kiri">Perbandingan RPD DIPA - Realisasi</div>
      {loading ? (
        <>
          <LoadingTable />
          <br></br>
          <LoadingTable />
        </>
      ) : (
        <>
          {data.length > 0 ? (
            <ApexCharts options={options} series={series} height={250} />
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

export default Rpd;
