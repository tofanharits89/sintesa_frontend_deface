import React from "react";

const Kdsoutput = (props) => {
  return (
    <div className="mt-2">
      <select
        value={props.kdoutput}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm"
        aria-label=".form-select-sm"
        disabled={props.status !== "pilihsuboutput"}
      >
        {/* <option value="XX">-- Pilih Sub Output --</option> */}
        <option value="SEMUASUBOUTPUT">Semua Sub Output</option>
      </select>
    </div>
  );
};

export default Kdsoutput;
