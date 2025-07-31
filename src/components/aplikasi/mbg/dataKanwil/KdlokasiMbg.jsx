import React, { useContext } from "react";

import data from "../../../../data/Kdlokasi.json";
import MyContext from "../../../../auth/Context";

const KdlokasiMbg = (props) => {
  const { role, kdlokasi } = useContext(MyContext);
  // console.log(role);
  // console.log(props.kdkanwil);
  return (
    <div>
      <select
        value={props.kdlokasi}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-md"
        aria-label=".form-select-md"
      >
        <option value="">Pilih Provinsi</option>
        {role === "0" || role === "1" || role === "X" ? (
          <>
            {data.map((item) => (
              <option key={item.kdlokasi} value={item.kdlokasi}>
                {item.kdlokasi} - {item.nmlokasi}
              </option>
            ))}
          </>
        ) : (
          data
            .filter((item) => item.kdlokasi === kdlokasi)
            .map((item) => (
              <option key={item.kdlokasi} value={kdlokasi}>
                {item.kdlokasi} - {item.nmlokasi}
              </option>
            ))
        )}
      </select>
    </div>
  );
};

export default KdlokasiMbg;
