import React from "react";
import data from "../../data/Kdsdana.json";

const Kdsdana = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select mb-2"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihsdana"}
        >
          {/* <option value="XX">-- Pilih Sumber Dana --</option> */}
          <option value="00">Semua Sumber Dana</option>

          {data.map((kl, index) => (
            <option key={index} value={kl.kdsdana}>
              {" "}
              {kl.kdsdana} - {kl.nmsdana2}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Kdsdana;
