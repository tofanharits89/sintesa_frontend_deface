import React, { useState } from "react";

const BulanPenerimaan = ({ onChange, thang, jenlap, pilihtanggal }) => {
  const cutoff = [
    { value: "1", label: " s.d Januari " + thang },
    { value: "2", label: " s.d Pebruari " + thang },
    { value: "3", label: " s.d Maret " + thang },
    { value: "4", label: " s.d April " + thang },
    { value: "5", label: " s.d Mei " + thang },
    { value: "6", label: " s.d Juni " + thang },
    { value: "7", label: " s.d Juli " + thang },
    { value: "8", label: " s.d Agustus " + thang },
    { value: "9", label: " s.d September " + thang },
    { value: "10", label: " s.d Oktober " + thang },
    { value: "11", label: " s.d November " + thang },
    { value: "12", label: " s.d Desember " + thang },
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Add 1 because getMonth() returns zero-based index

  //  const [cutoff, setCutoff] = useState(currentMonth.toString());
  const [selectedValue, setSelectedValue] = useState(currentMonth.toString());

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

export default BulanPenerimaan;
