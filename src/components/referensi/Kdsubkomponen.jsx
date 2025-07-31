import React from "react";

const Kdsubkomponen = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdsubkomponen}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihsubkomponen"}
        >
          {/* <option value="XX">-- Pilih Sub Komponen --</option> */}
          <option value="SEMUASUBKOMPONEN">Semua Sub Komponen</option>
        </select>
      </div>
    </div>
  );
};

export default Kdsubkomponen;
