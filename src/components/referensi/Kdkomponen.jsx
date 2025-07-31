import React from "react";

const Kdkomponen = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdkomponen}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihkomponen"}
        >
          {/* <option value="XX">-- Pilih Komponen --</option> */}
          <option value="SEMUAKOMPONEN">Semua Komponen</option>
        </select>
      </div>
    </div>
  );
};

export default Kdkomponen;
