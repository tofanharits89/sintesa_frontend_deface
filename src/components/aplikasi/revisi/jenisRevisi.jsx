import React, { useState } from "react";

const JenisRevisi = (props) => {
  const jenis = [
    { value: "1", label: " Penambahan/pengurangan Pagu" },
    { value: "2", label: " Perubahan/pergeseran hal Pagu Tetap" },
    { value: "3", label: " Revisi kesalahan Administrasi" },
  ];
  const [selectedValue, setSelectedValue] = useState(new Date().getFullYear());

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <select
      value={props.kdkp}
      onChange={(e) => props.onChange(e.target.value)}
      className="form-select form-select-sm text-select  "
      aria-label=".form-select-sm"
    >
      <option value="00">Semua Jenis Revisi</option>
      {jenis
        // .filter((item) => item.kdpp === props.kdPP)
        .map((pn, index) => (
          <option key={index} value={pn.value}>
            {pn.value} - {pn.label}
          </option>
        ))}
    </select>
  );
};

export default JenisRevisi;
