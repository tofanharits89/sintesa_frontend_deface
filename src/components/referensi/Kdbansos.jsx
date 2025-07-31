import React from "react";
import data from "../../data/Kdbansos.json";

const Kdbansos = (props) => {
  return (
    <div className="mt-1">
      <select
        value={props.kdbansos}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select mb-2"
        aria-label=".form-select-sm"
      >
        {/* <option value="XX">-- Pilih Jenis Bansos --</option> */}
        <option value="00">Semua Jenis</option>

        {data.map((kl, index) => (
          <option key={index} value={kl.kdbansos}>
            {" "}
            {kl.kdbansos} - {kl.nmbansos}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Kdbansos;
