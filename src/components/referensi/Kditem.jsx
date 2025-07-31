import React from "react";

const Kditem = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kditem}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihitem"}
        >
          {/* <option value="XX">-- Pilih Item --</option> */}
          <option value="SEMUAITEM">Semua Item</option>
        </select>
      </div>
    </div>
  );
};

export default Kditem;
