import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Minimal Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formatNumber = (value) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toLocaleString();
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

export default function ScatterPlot({ data, xKey, yKey, xLabel, yLabel }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 8,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      
    }}>      {/* Header */}
      <div style={{
        backgroundColor: "#f0fdf4",
        padding: "12px 16px",
        borderBottom: "1px solid #bbf7d0"
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 500,
          color: "#059669"
        }}>
          {yLabel} vs {xLabel}
        </h3>
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart 
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
            />
              <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: "#10b981", 
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
            />
            
            <Scatter 
              name="Data Provinsi" 
              data={data} 
              fill="#10b981"
              fillOpacity={0.7}
              stroke="#059669"
              strokeWidth={1}
              r={4}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
