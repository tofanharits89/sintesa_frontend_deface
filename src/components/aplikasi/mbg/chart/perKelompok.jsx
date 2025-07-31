import React, { useState, useEffect, useContext } from "react";
import { Card, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import "boxicons";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import Chart from "react-apexcharts";

const PerKelompok = ({ prov, onTotalChange }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const getData = async () => {
    setLoading(true);

    const queryNASIONAL = `
      SELECT group_kelompok, SUM(y) AS jumlah 
      FROM data_bgn.by_kelompok WHERE group_kelompok <> 'NULL'
      GROUP BY group_kelompok;
    `;

    const queryPerProvinsi = `
      SELECT 
  a.group_kelompok,  
  COALESCE(SUM(b.jumlah_kelompok), 0) AS jumlah
FROM data_bgn.by_kelompok a
INNER JOIN (
  SELECT 
    b.id_kelompok, 
    COUNT(*) AS jumlah_kelompok 
  FROM data_bgn.by_kelompok_detail b 
  WHERE b.provinsi = '${prov}' 
  GROUP BY b.id_kelompok
) b ON a.id_detail = b.id_kelompok 
WHERE a.group_kelompok <> 'NULL'
GROUP BY a.group_kelompok;


    `;

    const finalQuery = prov === "NASIONAL" ? queryNASIONAL : queryPerProvinsi;
    const encryptedQuery = Encrypt(
      finalQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
    );

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = response.data.result || [];

      setData(res);

      const total = res.reduce((sum, item) => sum + Number(item.jumlah), 0);
      onTotalChange?.(total);
    } catch (error) {
      const { status, data } = error.response || {};
      console.error("Error response:", error);
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [prov]);

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 2,
        columnWidth: "95%",
        distributed: true,
      },
    },
    colors: ["#00BCD4", "#4CAF50", "#FFC107", "#FF5722", "#9C27B0"],
    dataLabels: {
      enabled: true,
      formatter: (val, { dataPointIndex, w }) =>
        `${val.toLocaleString("id-ID")}`,
      style: {
        fontSize: "13px",
        colors: ["brown"],
        fontFamily: "'Figtree', sans-serif",
      },
      offsetY: 45,
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "'Figtree', sans-serif",
        },
      },
    },
    xaxis: {
      categories: data.map((item) => item.group_kelompok),
      labels: {
        show: true,
        rotate: 0,
        style: {
          fontSize: "12px",
          fontFamily: "'Figtree', sans-serif",
        },
      },

      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString("id-ID")} Orang`,
      },
    },
  };

  const chartSeries = [
    {
      name: "Jumlah",
      data: data.map((item) => item.jumlah),
    },
  ];

  return (
    <>
      {data.length > 0 && (
        <>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={250}
          />
        </>
      )}
    </>
  );
};

export default PerKelompok;
