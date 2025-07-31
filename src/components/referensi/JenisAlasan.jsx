import React from "react";
import data from "../../data/Sebab.json";

const JenisAlasan = (props) => {
  return (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select   form-select-sm text-select"
        // style={{ width: "330px" }}
        aria-label=".form-select"
        name="sebab"
      >
        <option value="0">Semua Penyebab Inefisiensi</option>
        {/* {data.map((pn, index) => (
          <option key={index} value={pn.kdsebab}>
            {pn.kdsebab} - {pn.nmsebab}
          </option>
        ))} */}
      </select>
    </>
  );
};

export default JenisAlasan;
