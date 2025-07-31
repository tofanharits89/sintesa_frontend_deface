import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const ChartBulan = ({ chartData }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      width: "100%",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
        distributed: true,
        dataLabels: {
          position: "top",
        },
        colors: {
          ranges: [
            {
              from: 0,
              to: 1,
              color: "#008FFB",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -18,
      style: {
        colors: ["brown"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: "Jumlah Login Per Tanggal",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " users";
        },
      },
    },
  });

  const [chartSeries, setChartSeries] = useState([
    { name: "Total Logins", data: [] },
  ]);

  useEffect(() => {
    // Ambil tanggal dan total_logins dari prop chartData
    const categories = chartData.map((data) => data.login_date);
    const data = chartData.map((data) => data.total_logins);

    // Setel state untuk digunakan oleh grafik ApexCharts
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories,
      },
    }));
    setChartSeries([{ name: "Total Logins", data }]);
  }, [chartData]);

  return (
    <div>
      <ApexCharts
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={chartOptions.chart.height}
      />
    </div>
  );
};

export default ChartBulan;
