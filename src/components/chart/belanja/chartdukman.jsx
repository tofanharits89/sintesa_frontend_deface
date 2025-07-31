import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../auth/Random";
import { LoadingTable } from "../../layout/LoadingTable";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";

const Dukman = (props) => {
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

  var options = {
    chart: {
      type: "pie",
      width: "100%",
      toolbar: {
        show: false,
      },
      offsetX: 0,
    },
    labels: ["Dukman", "Teknis"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return numeral(val).format("0,0.0");
      },
      offsetX: 0,
      offsetY: 0,
    },
    legend: {
      position: "bottom", // Set the legend position to the right
      offsetY: 0,
      offsetX: 0,
    },
  };

  // const series = [seriesPaguTeknis, seriesPaguNonTeknis];
  //const series = [data1, data2];

  const series = data.map((item) =>
    parseFloat(numeral(item.nilai_pagu).format("0,0.0"))
  );

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
          {data.length > 0 ? (
            <ApexCharts
              options={options}
              series={series}
              type="pie"
              height={250}
            />
          ) : (
            <p className="null">
              Data Tidak Ada <br />
              <i className="bi bi-emoji-frown "></i>
            </p>
          )}{" "}
        </>
      )}
    </div>
  );
};

export default Dukman;
