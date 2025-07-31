import React, { useState } from "react";

const CutOff = ({ onChange, thang, jenlap, pilihtanggal, value }) => {
  const cutoff = [
    { value: "1", label: "Akhir Januari " + thang },
    { value: "2", label: "Akhir Pebruari " + thang },
    { value: "3", label: "Akhir Maret " + thang },
    { value: "4", label: "Akhir April " + thang },
    { value: "5", label: "Akhir Mei " + thang },
    { value: "6", label: "Akhir Juni " + thang },
    { value: "7", label: "Akhir Juli " + thang },
    { value: "8", label: "Akhir Agustus " + thang },
    { value: "9", label: "Akhir September " + thang },
    { value: "10", label: "Akhir Oktober " + thang },
    { value: "11", label: "Akhir November " + thang },
    { value: "12", label: "Akhir Desember " + thang },
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Add 1 because getMonth() returns zero-based index

  // const [cutoff, setCutoff] = useState(value);
  const [selectedValue, setSelectedValue] = useState(value);

  const handlecutoffChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };
  //console.log(selectedValue);
  return (
    <select
      value={value}
      className={`form-select form-select-sm text-select mb-2 ${jenlap === "1" ||
        jenlap === "4" ||
        jenlap === "5" ||
        jenlap === "6" ||
        jenlap === "7" ||
        (jenlap === "2" && !pilihtanggal) ||
        (jenlap === "3" && !pilihtanggal)
        ? "disabled"
        : ""
        }`}
      aria-label=".form-select-sm"
      onChange={handlecutoffChange}
      disabled={
        jenlap === "1" ||
        jenlap === "4" ||
        jenlap === "5" ||
        jenlap === "6" ||
        jenlap === "7" ||
        (jenlap === "2" && !pilihtanggal) ||
        (jenlap === "3" && !pilihtanggal)
      }
    >
      {cutoff.map((cutoff) => (
        <option key={cutoff.value} value={cutoff.value}>
          {cutoff.label}
        </option>
      ))}
    </select>
  );
};

export default CutOff;
