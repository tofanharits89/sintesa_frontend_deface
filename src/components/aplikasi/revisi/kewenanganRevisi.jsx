import React, { useState } from "react";

const KewenanganRevisi = ({ onChange, thang, jenlap, pilihtanggal }) => {
  const cutoff = [
    { value: "00", label: " Semua Kewenangan" },
    { value: "K", label: " Kantor Wilayah" },
    { value: "P", label: " Direktorat PA" },
    { value: "D", label: "DJA" },
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Add 1 because getMonth() returns zero-based index

  //  const [cutoff, setCutoff] = useState(currentMonth.toString());
  const [selectedValue, setSelectedValue] = useState("00");

  const handlecutoffChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <select
      value={selectedValue}
      className="form-select form-select-sm"
      aria-label=".form-select-sm"
      onChange={handlecutoffChange}
    >
      {cutoff.map((cutoff) => (
        <option key={cutoff.value} value={cutoff.value}>
          {cutoff.label}
        </option>
      ))}
    </select>
  );
};

export default KewenanganRevisi;
