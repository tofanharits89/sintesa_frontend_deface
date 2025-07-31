import React, { useContext } from "react";
import data from "../../../../data//Kdkabkota.json";
import MyContext from "../../../../auth/Context";
const Kdkabkota = (props) => {
  const { role, kdlokasi } = useContext(MyContext);
  return (
    <div>
      <select
        value={props.kabkota}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-md"
        aria-label=".form-select-md "
      >
        <option value="">Pilih Kab/ Kota</option>

        {data
          .filter((item) => item.kdlokasi === props.kdlokasi)
          .map((item, index) => (
            <option key={index} value={item.kdkabkota}>
              {item.kdkabkota} - {item.nmkabkota}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Kdkabkota;
