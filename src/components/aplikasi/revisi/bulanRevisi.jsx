import React, { useState } from "react";

const BulanRevisi = ({ onChange, thang, jenlap, pilihtanggal }) => {
  const cutoff = [
    { value: "00", label: " Semua Bulan" },
    { value: "1", label: " Januari " + thang },
    { value: "2", label: " Pebruari " + thang },
    { value: "3", label: " Maret " + thang },
    { value: "4", label: " April " + thang },
    { value: "5", label: " Mei " + thang },
    { value: "6", label: " Juni " + thang },
    { value: "7", label: " Juli " + thang },
    { value: "8", label: " Agustus " + thang },
    { value: "9", label: " September " + thang },
    { value: "10", label: " Oktober " + thang },
    { value: "11", label: " November " + thang },
    { value: "12", label: " Desember " + thang },
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

export default BulanRevisi;
