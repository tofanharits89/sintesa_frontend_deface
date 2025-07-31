import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../auth/Random";
import { LoadingTable } from "../../layout/LoadingTable";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";

const Perbandingan = (props) => {
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
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA}${encryptedQuery}`
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
  // const options = {
  //   chart: {
  //     id: "line-column",
  //     stacked: true,
  //     width: "100%",
  //     toolbar: {
  //       show: false,
  //     },

  //     offset: 0,
  //   },
  //   colors: ["#008FFB", "#FF4560"],
  //   xaxis: {
  //     categories: data.map((item) => item.thang),
  //   },
  //   stroke: {
  //     curve: "smooth",
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   markers: {
  //     size: 4,
  //   },
  //   yaxis: [
  //     {
  //       title: {
  //         text: "",
  //       },
  //     },
  //     {
  //       opposite: true,
  //       title: {
  //         text: "Persentase",
  //       },
  //     },
  //   ],
  // };

  // const series = [
  //   {
  //     name: "2021",
  //     type: "column",
  //     data: [44, 55, 41],
  //   },
  //   {
  //     name: "2022",
  //     type: "line",
  //     data: [11, 22, 32],
  //   },
  //   {
  //     name: "2023",
  //     type: "line",
  //     data: [11, 22, 32],
  //   },
  // ];

  // Ambil nilai thang terkecil
  // const minThang = Math.min(...data.map((item) => parseInt(item.thang)));

  // const series = data.map((item) => {
  //   const seriesItem = {
  //     name: item.thang,
  //     type: item.thang === minThang.toString() ? "column" : "line",
  //     data: data.map((dataItem) =>
  //       dataItem.thang === item.thang ? parseFloat(dataItem.persen) : 0
  //     ),
  //   };
  //   return seriesItem;
  // });

  // Format numerik menggunakan numeral
  const options = {
    chart: {
      type: "bar",
      width: "100%",
      toolbar: {
        show: false,
      },
      offsetX: 0,
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        horizontal: true,
        barHeight: "40%",
        distributed: true,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return numeral(val).format("0,0.0");
      },
      offsetY: 0,
      style: {
        fontSize: "12px",
        colors: ["white"],
      },
    },
    colors: [
      "#1ABC9C",
      "#E67E22",
      "#27AE60",
      "#D35400",
      "#C0392B",
      "#2ECC71",
      "#F39C12",
      "#9B59B6",
    ],
    xaxis: {
      categories: data.map((item) => item.thang),
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return numeral(val).format("0,0.0");
        },
      },
    },
  };
  const series = [
    {
      data: data.map((item) => numeral(item.persen).format("0,0.0")),
      name: "Realisasi",
    },
  ];
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
          <div className="chart-label-kiri">Perbandingan Pagu Realisasi</div>
          {data.length > 0 ? (
            <ApexCharts
              options={options}
              series={series}
              height={250}
              type="bar"
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

export default Perbandingan;
