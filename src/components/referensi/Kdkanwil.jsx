import React, { useContext } from "react";
import MyContext from "../../auth/Context";
import data from "../../data/Kdkanwil.json";

const Kdkanwil = (props) => {
  const { role, kdkanwil } = useContext(MyContext);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.kdkanwil}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihkanwil"}
        >
          {/* <option value="XX">-- Pilih Kanwil --</option> */}
          {role === "0" || role === "1" || role === "X" ? (
            <>
              <option value="00">Semua Kanwil</option>

              {data.map((item) => (
                <option value={item.kdkanwil} key={item.kdkanwil}>
                  {item.kdkanwil} - {item.nmkanwil}
                </option>
              ))}
            </>
          ) : (
            data
              .filter((item) => item.kdkanwil === kdkanwil)
              .map((item) => (
                <option key={item.kdkanwil} value={item.kdkanwil}>
                  {item.kdkanwil} - {item.nmkanwil}
                </option>
              ))
          )}
        </select>
      </div>
    </div>
  );
};

export default Kdkanwil;
