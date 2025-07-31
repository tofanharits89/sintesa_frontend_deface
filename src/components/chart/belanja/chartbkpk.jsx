import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../auth/Random";
import { LoadingTable } from "../../layout/LoadingTable";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";

const Bkpk = (props) => {
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
        barHeight: "70%",
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
      "#FFC300",
      "#00BFFF",
      "#33FF57",
      "#A569BD",
      "#3498DB",
      "#E74C3C",
      "#2ECC71",
      "#F39C12",
      "#9B59B6",
    ],
    xaxis: {
      categories: data.map((item) => item.kdbkpk),
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
      data: data.map((item) => numeral(item.realisasi).format("0,0.0")),
      name: "Realisasi",
    },
  ];

  return (
    <>
      <div className="pie">
        {loading ? (
          <>
            <LoadingTable />
            <LoadingTable />
          </>
        ) : (
          <>
            <div className="chart-label-kiri">Realisasi BKPK Tertinggi</div>
            {data.length > 0 ? (
              <ApexCharts
                options={options}
                series={series}
                type="bar"
                height={250}
              />
            ) : (
              <p className="null ">
                Data Tidak Ada <br />
                <i className="bi bi-emoji-frown "></i>
              </p>
            )}{" "}
          </>
        )}
      </div>
    </>
  );
};

export default Bkpk;
