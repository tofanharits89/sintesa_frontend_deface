import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, Spinner, Alert } from 'react-bootstrap';

const ChartRekamBPS = ({ 
  data = [],
  loading = false,
  error = null,
  title = "Data Chart BPS",
  provinsi = null,
  height = 300
}) => {  // Custom tooltip - compact version
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-2 py-1 border rounded shadow-sm small">
          <div className="fw-bold text-primary">{label}</div>
          <div className="text-dark">{payload[0].value.toFixed(2)}%</div>
        </div>
      );
    }
    return null;
  };if (loading) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="sm" />
          <div className="mt-1 text-muted small">Memuat...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded">
        <div className="text-center text-warning">
          <i className="bi bi-exclamation-triangle fs-5"></i>
          <div className="small mt-1">{error}</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded">
        <div className="text-center text-muted">
          <i className="bi bi-bar-chart fs-5"></i>
          <div className="small mt-1">Tidak ada data</div>
        </div>
      </div>
    );
  }  
  // Extra safety check and data validation
  try {
    const validData = data.filter(item => 
      item && 
      typeof item === 'object' && 
      typeof item.month === 'string' && 
      typeof item.value === 'number' && 
      !isNaN(item.value)
    );

    if (validData.length === 0) {
      return (
        <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded">
          <div className="text-center text-muted">
            <i className="bi bi-bar-chart fs-5"></i>
            <div className="small mt-1">Data tidak valid</div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-100 bg-white rounded border" style={{ fontSize: '11px' }}>
        {/* Minimal Header */}
        {/* Header dihilangkan agar tidak overlapping */}
        {/* <div className="px-2 py-1 bg-light bg-opacity-50">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-dark fw-medium" style={{ fontSize: '11px', letterSpacing: '0.01em' }}>{title}</span>
            {provinsi && (
              <span className="badge bg-primary text-white px-2 py-1" style={{ fontSize: '9.5px', fontWeight: 500 }}>{provinsi}</span>
            )}
          </div>
        </div> */}
        {/* Compact Chart Area */}
        <div className="p-2">
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={validData}
              margin={{ top: 5, right: 15, left: -5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fontWeight: 400 }}
                stroke="#888"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 0 }}
                stroke="#888"
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 0.3', 'dataMax + 0.3']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0d6efd"
                strokeWidth={2}
                dot={{ fill: '#0d6efd', strokeWidth: 1, r: 3 }}
                activeDot={{ r: 4, stroke: '#0d6efd', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Chart rendering error:', error);
    return (
      <div className="h-100 d-flex align-items-center justify-content-center bg-light rounded">
        <div className="text-center text-danger">
          <i className="bi bi-exclamation-triangle fs-5"></i>
          <div className="small mt-1">Error rendering chart</div>
        </div>
      </div>
    );
  }
};

export default ChartRekamBPS;
