import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import data from "../../../data/Kdkabkotaapbd.json";

const Kdkabkotaapbd = (props) => {
  const { role, kdprov } = useContext(MyContext);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kabkota}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm tahun"
          disabled={props.status !== "pilihkdkabkota"}
        >
          {/* <option value="XX">-- Pilih Kab/ Kota --</option> */}
          <option value="ALL">Semua Kab/ Kota</option>

          {data
            .filter((item) => item.kdprov === props.kdprov)
            .map((item, index) => (
              <option value={item.kdkabkota}>
                {item.kdkabkota} - {item.nmkabkota}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default Kdkabkotaapbd;
