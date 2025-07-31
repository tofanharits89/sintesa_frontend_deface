import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../../../auth/Context";

const API_URL = import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA_DB?.replace(
  "/getData/referensi/db",
  "/referensi/kddept"
);

const Kddept = ({ onChange, kddept, kdkanwil, kdkppn }) => {
  const { role } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Valid roles (numeric/string code)
    const validRoles = ["X", "0", "1", "2", "3", "4"];
    if (!validRoles.includes(role) || !kdkanwil || !kdkppn) {
      setData([]);
      setLoading(false);
      return;
    }
    // Mapping kode role ke string backend
    const roleMap = {
      "X": "superadmin",
      "0": "pusat",
      "1": "kantor_pusat",
      "2": "kanwil",
      "3": "kppn",
      "4": "lainnya"
    };
    const backendRole = roleMap[role];
    if (!backendRole) {
      setData([]);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const paramsObj = { role: backendRole, kdkanwil, kdkppn };
        const params = new URLSearchParams(paramsObj);
        const res = await fetch(`${API_URL}?${params.toString()}`);
        const result = await res.json();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          setData([]);
        }
      } catch (err) {
        setData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [role, kdkanwil, kdkppn]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedKddept = data.find((item) => item.kddept === selectedValue);
    if (onChange && selectedKddept) {
      onChange(selectedKddept);
    }
  };

  useEffect(() => {
    if (kddept && data.length > 0) {
      const selectedKddept = data.find((item) => item.kddept === kddept);
      if (selectedKddept && onChange) {
        onChange(selectedKddept);
      }
    }
  }, [kddept, data]); // Removed onChange from dependencies

  return (
    <div className="dropdown_epa">
      <label className="dropdown_epa-label text-dark" htmlFor="Kddept">
        Kementerian
      </label>
      <select
        id="Kddept"
        value={kddept || ""}
        onChange={handleSelectChange}
        className="dropdown_epa-select dropdown-animated"
        disabled={loading}
      >
        <option value="">
          {loading ? "Memuat..." : "Pilih Kementerian"}
        </option>
        {Array.isArray(data) &&
          data.map((item) => (
            <option key={item.kddept} value={item.kddept}>
              {`${item.kddept} - ${(item.nmdept || "-").toUpperCase()}`}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Kddept;
