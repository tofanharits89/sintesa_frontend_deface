import React from "react";
import data from "../../../data/Kdbidurusanapbd.json";

const Kdbidurusanapbd = (props) => {
  // console.log(props.kdfungsi);
  return (
    <div>
      <div className="mt-0">
        <select
          value={props.Kdbidurusan}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select mb-2 "
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihbidurusan"}
        >
          {/* <option value="XX">-- Pilih Bidang Urusan --</option> */}
          <option value="00">Semua Bidang Urusan</option>

          {data
            .filter((item) => item.kdurusan === props.kdurusan)
            .map((ur, index) => (
              <option key={index} value={ur.kdbidurusan}>
                {ur.kdbidurusan} - {ur.nmbidurusan}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Kdbidurusanapbd;
