import React from "react";
import data from "../../data/Kddekon.json";

const Kddekon = (props) => {
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihdekon"}
        >
          {/* <option value="XX">-- Pilih Kewenangan --</option> */}
          <option value="00" selected>
            Semua Kewenangan
          </option>

          {data.map((kl, index) => (
            <option key={index} value={kl.kddekon}>
              {" "}
              {kl.kddekon} - {kl.nmdekon}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Kddekon;
