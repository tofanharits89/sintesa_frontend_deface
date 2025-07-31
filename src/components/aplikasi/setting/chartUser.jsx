import React, { useState, useContext, useEffect } from "react";
import numeral from "numeral";
import ApexCharts from "react-apexcharts";

const ChartUser = ({ data }) => {
  const [selectedYear, setSelectedYear] = useState(2024); // Default year

  const handleChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const filteredData = data.filter((entry) => entry.tahun === selectedYear);
  const labels = filteredData.map((entry) => entry.bulan);
  const totalUsers = filteredData.map((entry) => entry.total_user);

  //console.log(data);
  const options = {
    chart: {
      type: "bar",
      height: 250,
      width: "100%",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "55%",
        endingShape: "rounded",
        distributed: true,
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
      categories: labels,
    },
    yaxis: {
      title: {
        text: "Jumlah User Login",
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
  };

  return (
    <>
      <div>
        {" "}
        <select
          value={selectedYear}
          onChange={handleChange}
          className="form-control"
        >
          <option value={2023}>Tahun 2023</option>
          <option value={2024}>Tahun 2024</option>{" "}
          <option value={2025}>Tahun 2025</option>
        </select>
      </div>
      <div>
        {data.length > 0 ? (
          <ApexCharts
            options={options}
            series={[{ data: totalUsers, name: "bulan" }]}
            type="bar"
            height={250}
          />
        ) : (
          <span className="d-flex justify-content-center text-danger ">
            Data Tidak Ada <br />
            &nbsp;
            <i className="bi bi-emoji-frown mx-2"></i>
          </span>
        )}
      </div>
    </>
  );
};

export default ChartUser;
