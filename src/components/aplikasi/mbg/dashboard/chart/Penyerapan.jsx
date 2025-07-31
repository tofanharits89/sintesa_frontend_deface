// components/Penyerapan.jsx
import React from "react";
import Chart from "react-apexcharts";

const Penyerapan = ({ series, categories }) => {
  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 4,
      colors: ["#ffffff"],
      strokeColors: "#000",
      strokeWidth: 2,
    },
    xaxis: {
      categories: categories || ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    },
    tooltip: {
      enabled: true,
    },
    grid: {
      show: false,
    },
  };

  return (
    <Chart options={chartOptions} series={series} type="line" height={100} />
  );
};

export default Penyerapan;
