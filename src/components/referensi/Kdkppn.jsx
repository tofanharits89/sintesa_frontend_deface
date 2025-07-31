import React, { useContext } from "react";
import MyContext from "../../auth/Context";
import data from "../../data/Kdkppn.json";

const Kdkppn = (props) => {
  const { role, kdkppn } = useContext(MyContext);
  return (
    <div>
      <div className="mt-2">
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="form-select form-select-sm text-select mb-2"
          aria-label=".form-select-sm"
          disabled={props.status !== "pilihkppn"}
        >
          {/* <option value="XXX">-- Pilih KPPN --</option> */}
          {role === "0" || role === "1" || role === "1" ? (
            <>
              <option value="000">Semua KPPN</option>
              {data.map((item) => (
                <option key={item.kdkppn} value={item.kdkppn}>
                  {item.kdkppn} - {item.nmkppn}
                </option>
              ))}
            </>
          ) : role === "3" ? (
            data
              .filter((item) => item.kdkppn === kdkppn)
              .map((item) => (
                <option key={item.kdkppn} value={item.kdkppn}>
                  {item.kdkppn} - {item.nmkppn}
                </option>
              ))
          ) : (
            <option value="000">Semua KPPN</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default Kdkppn;
