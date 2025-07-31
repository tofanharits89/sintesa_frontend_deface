import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";

const Jenbel = (props) => {
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
    // title: {
    //   text: "Realisasi Per Jenbel",
    //   style: {
    //     fontSize: "14px",
    //     fontWeight: "bolder",
    //     fontFamily: "Roboto Condensed",
    //   },
    // },
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
        fontSize: "14px",
        colors: ["white"],
      },
    },

    xaxis: {
      categories: ["51", "52", "53", "57"],
    },
    colors: ["#FF5733", "#FFC300", "#00BFFF", "#33FF57", "#A569BD"],
    tooltip: {
      y: {
        formatter: function (val) {
          const formattedValue = numeral(val).format("0,0.0");
          return formattedValue + "%";
        },
      },
    },
  };

  const series = [
    {
      data: data.map((item) => (item.persen > 1 ? item.persen : 0)),
      name: "Persen ",
    },
  ];

  return (
    <>
      <div className="pie">
        {/* <div className="chart-label">Dalam Triliun</div> */}
        <div className="chart-label-kiri">Realisasi Per Jenis Belanja</div>
        {data.length > 0 ? (
          <ApexCharts
            options={options}
            series={series}
            type="bar"
            height={250}
          />
        ) : (
          <p className="null">
            Data Tidak Ada <br />
            <i className="bi bi-emoji-frown "></i>
          </p>
        )}
      </div>
    </>
  );
};

export default Jenbel;
