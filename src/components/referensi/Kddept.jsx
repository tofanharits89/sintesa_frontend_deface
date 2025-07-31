import React from "react";
import data from "../../data/Kddept.json";

const Kddept = (props) => {
  // console.log(props);
  return (
    <>
      <div className="mt-0">
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select mb-1"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihdept"}
        >
          {/* <option value="XXX">-- Pilih Kementerian --</option> */}
          <option value="000">Semua Kementerian</option>

          {data.map((kl, index) => (
            <option key={index} value={kl.kddept}>
              {kl.kddept} - {kl.nmdept}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Kddept;
