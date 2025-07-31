import React, { useContext } from "react";
import MyContext from "../../auth/Context";
import data from "../../data/Kdlokasi.json";

const Kdlokasi = (props) => {
  const { role, kdlokasi } = useContext(MyContext);
  // console.log(role);
  // console.log(props.status);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdlokasi}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihprov"}
        >
          {/* <option value="XX">-- Pilih Provinsi --</option> */}
          {role === "0" || role === "1" || role === "X" ? (
            <>
              <option value="00">Semua Provinsi</option>
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
    </div>
  );
};

export default Kdlokasi;
