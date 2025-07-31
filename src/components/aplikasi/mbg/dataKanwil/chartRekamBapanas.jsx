import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, Spinner, Alert, Tooltip as BootstrapTooltip, OverlayTrigger } from 'react-bootstrap';

const ChartRekamBapanas = ({ 
  data = [],
  loading = false,
  error = null,
  title = "Data Chart Bapanas",
  provinsi = null,
  height = 300
}) => {  // Custom tooltip - compact version
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-2 py-1 border rounded shadow-sm small">
          <div className="fw-bold text-primary">{label}</div>
          {payload.map((entry, idx) => (
            <div key={idx} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString('id-ID')}<span className="ms-1">Rp</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  // Custom Legend with icon and tooltip
  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, padding: 4 }}>
        {payload.map((entry, idx) => (
          <OverlayTrigger
            key={entry.value}
            placement="top"
            overlay={
              <BootstrapTooltip id={`legend-tooltip-${entry.value}`}>{entry.value}</BootstrapTooltip>
            }
          >
            <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <span style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: entry.color,
                marginRight: 4,
                border: '2px solid #fff',
                boxShadow: '0 0 2px #888',
              }}></span>
            </span>
          </OverlayTrigger>
        ))}
      </div>
    );
  };
  if (loading) {
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
  // Ambil semua kategori dari data (selain 'month')
  const lineKeys = data && data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'month') : [];
  return (
    <div className="h-100 bg-white rounded border" >
      {/* Minimal Header */}
      <div className="px-2 py-1 bg-light bg-opacity-50">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-dark fw-medium">{title}</span>
          {provinsi && (
            <span className="badge bg-primary text-white px-2 py-1" >{provinsi}</span>
          )}
        </div>
      </div>
      {/* Compact Chart Area */}
      <div className="p-2">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 15, left: -5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 8, fontWeight: 400 }}
              stroke="#888"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 0 }}
              stroke="#888"
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 0.3', 'dataMax + 0.3']}            />
            <Tooltip content={<CustomTooltip />} />
            {lineKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={['#0d6efd', '#e83e8c', '#28a745', '#ffc107', '#fd7e14', '#20c997', '#6610f2'][idx % 7]}
                strokeWidth={2}
                dot={{ fill: ['#0d6efd', '#e83e8c', '#28a745', '#ffc107', '#fd7e14', '#20c997', '#6610f2'][idx % 7], strokeWidth: 1, r: 3 }}
                activeDot={{ r: 4, stroke: ['#0d6efd', '#e83e8c', '#28a745', '#ffc107', '#fd7e14', '#20c997', '#6610f2'][idx % 7], strokeWidth: 1 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartRekamBapanas;
