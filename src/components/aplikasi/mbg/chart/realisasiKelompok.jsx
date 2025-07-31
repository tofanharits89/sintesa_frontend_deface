import React, { useState, useEffect, useContext } from "react";
import Chart from "react-apexcharts";
import numeral from "numeral";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";

const RealisasiKelompok = () => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ───────────── Fetch Data ─────────────
  const getData = async () => {
    setLoading(true);

    const query = `
      SELECT 
        a.group_kelompok,
        SUM(b.realisasi) / 1000000000 AS realisasi  
      FROM data_bgn.by_kelompok a
      INNER JOIN data_bgn.data_summary_mbg b
        ON (a.kdgiat = b.kdgiat OR a.kdgiat2 = b.kdgiat)
        AND a.kode_RO = b.kdsoutput
      GROUP BY a.group_kelompok
    `.replace(/\s+/g, " ").trim();

    try {
      const { data: res } = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${Encrypt(
          query
        )}&user=${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(
        (res.result || []).map((d) => ({
          ...d,
          realisasi: Number(d.realisasi) || 0, // pastikan number
        }))
      );
    } catch (err) {
      const { status, data } = err.response || {};
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
  }, []);


  const formatMiliar = (val) => `${numeral(val).format("0,0")} `;

  const chartOptions = {
    chart: { type: "bar", toolbar: { show: true } },
    plotOptions: {
    
        bar: {
          horizontal: false,
          borderRadius: 2,
          columnWidth: "55%",
          distributed: true,
        },
    },
    dataLabels: {
      enabled: true,
      formatter: formatMiliar,  // label nilai di ujung batang
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["brown"],
        fontFamily: "'Figtree', sans-serif",
      },
      offsetX: 0,
      offsetY: 90,
    },
    // === inilah yang penting ===
    yaxis: {
      categories: data.map((d) => d.group_kelompok), // ← daftar kelompok
      labels: {
        style: { fontSize: "12px", fontFamily: "'Figtree', sans-serif" },
      },
    },
    // sumbu‑X menampilkan skala angka
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
    tooltip: {
      y: {
        formatter: formatMiliar,
      },
    },
    
    legend: { show: false },
    colors: ["#007bff", "#28a745", "#fd7e14", "#6f42c1"],
  };
  

  const chartSeries = [
    {
      name: "Realisasi",
      data: data.map((d) => d.realisasi),
    },
  ];

  if (loading) return <p>Memuat…</p>;

  return (
    data.length > 0 && (
      <Chart options={chartOptions} series={chartSeries} type="bar" height={250} />
    )
  );
};

export default RealisasiKelompok;
