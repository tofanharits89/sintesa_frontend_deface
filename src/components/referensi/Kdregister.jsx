import React from "react";

const Kdregister = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdregister}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihregister"}
        >
          {/* <option value="XX">-- Pilih Register --</option> */}
          <option value="SEMUAREGISTER">Semua Register</option>
        </select>
      </div>
    </div>
  );
};

export default Kdregister;
