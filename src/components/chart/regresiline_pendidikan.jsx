import React from "react";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

/**
 * Komponen Scatter Plot dengan Garis Regresi Linear
 * 
 * Data diambil langsung dari database, tidak menggunakan data dummy.
 * Komponen ini menerima data melalui props dan melakukan perhitungan
 * regresi linear secara real-time.
 */

// Simple linear regression calculation function
const calculateLinearRegression = (data) => {
  const n = data.length;
  if (n === 0) return { slope: 0, intercept: 0, r2: 0 };

  const sumX = data.reduce((sum, point) => sum + point[0], 0);
  const sumY = data.reduce((sum, point) => sum + point[1], 0);
  const sumXY = data.reduce((sum, point) => sum + point[0] * point[1], 0);
  const sumXX = data.reduce((sum, point) => sum + point[0] * point[0], 0);
  const sumYY = data.reduce((sum, point) => sum + point[1] * point[1], 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const meanY = sumY / n;
  const totalSumSquares = data.reduce((sum, point) => sum + Math.pow(point[1] - meanY, 2), 0);
  const residualSumSquares = data.reduce((sum, point) => {
    const predicted = slope * point[0] + intercept;
    return sum + Math.pow(point[1] - predicted, 2);
  }, 0);
  const r2 = 1 - (residualSumSquares / totalSumSquares);

  return { slope, intercept, r2 };
};

// Minimal Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formatNumber = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value?.toLocaleString();
    };

    return (
      <div style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        padding: "8px 12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        fontSize: 12,
        
      }}>
        <div style={{ fontWeight: 500, color: "#374151", marginBottom: 4 }}>
          {payload[0]?.payload?.provinsi || "Data"}
        </div>
        <div style={{ color: "#6b7280", marginBottom: 2 }}>
          {payload[0]?.name}: <span style={{ color: "#374151", fontWeight: 500 }}>{formatNumber(payload[0]?.value)}</span>
        </div>
        <div style={{ color: "#6b7280" }}>
          {payload[1]?.name}: <span style={{ color: "#374151", fontWeight: 500 }}>{formatNumber(payload[1]?.value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function RegresiLinePendidikan({
  data = [], // Data dari database
  xKey,
  yKey,
  xLabel,
  yLabel,
  loading = false
}) {
  // Handle loading state
  if (loading) {
    return (
      <div style={{
        background: "#ffffff",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>Memuat data...</div>
          <div style={{ fontSize: 12 }}>Mengambil data dari database</div>
        </div>
      </div>
    );
  }

  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <div style={{
        background: "#ffffff",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>Tidak ada data</div>
          <div style={{ fontSize: 12 }}>Data tidak tersedia dari database</div>
        </div>
      </div>
    );
  }

  // Filter dan validasi data dari database
  const regressionInput = data
    .filter(d => d[xKey] != null && d[yKey] != null && 
                !isNaN(Number(d[xKey])) && !isNaN(Number(d[yKey])))
    .map(d => [Number(d[xKey]), Number(d[yKey])]);
  
  // Pastikan ada cukup data untuk regresi
  if (regressionInput.length < 2) {
    return (
      <div style={{
        background: "#ffffff",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>Data tidak mencukupi</div>
          <div style={{ fontSize: 12 }}>Minimal 2 data point diperlukan untuk analisis regresi</div>
        </div>
      </div>
    );
  }
  
  const result = calculateLinearRegression(regressionInput);

  // To plot regression line, get min/max x in the data
  const xs = regressionInput.map(d => d[0]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  // Generate multiple points for a smoother line (10 points)
  const lineData = [];
  const step = (maxX - minX) / 9;
  for (let i = 0; i < 10; i++) {
    const x = minX + (step * i);
    const y = result.slope * x + result.intercept;
    lineData.push({ 
      [xKey]: x, 
      [yKey]: y,
      isRegressionLine: true
    });
  }

  // Combine original data with regression line data
  const combinedData = [
    ...data.map(d => ({ ...d, isRegressionLine: false })),
    ...lineData
  ];

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 8,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    }}>      {/* Header */}
      <div style={{
        backgroundColor: "#e7f0fe",
        padding: "12px 16px",
        borderBottom: "1px solid #d1e1fd"
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 500,
          color: "#498eea"
        }}>
          Biaya Pendidikan Dasar vs Total Penyaluran MBG per Provinsi
        </h3>        <span style={{ fontSize: 12, color: "#3874dc" }}>
          y = {result.slope.toFixed(2)} x + {result.intercept.toFixed(2)} &nbsp; | &nbsp; R² = {result.r2.toFixed(3)}
        </span>
      </div>{/* Content */}
      <div style={{ padding: "16px" }}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={combinedData}
            margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xLabel}
              tick={{
                fontSize: 11,
                fill: "#6b7280",
              }}
              tickLine={{ stroke: "#d1d5db" }}
              axisLine={{ stroke: "#d1d5db" }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toFixed(0);
              }}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yLabel}
              tick={{
                fontSize: 11,
                fill: "#6b7280",
              }}
              tickLine={{ stroke: "#d1d5db" }}
              axisLine={{ stroke: "#d1d5db" }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toFixed(0);
              }}
            />            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#498eea",
                strokeWidth: 1,
                strokeDasharray: "3 3",
                opacity: 0.5
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: "8px",
                fontSize: "11px",
                color: "#6b7280"
              }}
            />            {/* Original Data Points */}
            <Scatter
              dataKey={yKey}
              data={data}
              fill="#498eea"
              name="Data Provinsi"
            />

            {/* Regression Line */}
            <Line
              type="linear"
              dataKey={yKey}
              data={lineData}
              stroke="#f59e42"
              strokeWidth={2}
              dot={false}
              name="Garis Regresi"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
