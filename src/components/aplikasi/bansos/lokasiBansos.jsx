import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const Kdlokasi = (props) => {
  const { role, kdlokasi, axiosJWT, token, kdkanwil } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [props.kdlokasi]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      "select a.kdprov,b.nmprov,a.kdkabkota,a.nmkabkota,b.kdkanwil from dbref.t_kabkota_bansos a left join dbref.t_provinsi b on a.kdprov=b.kdprov  group by a.kdprov ORDER BY a.kdprov"
    );
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
  };
  return (
    <div>
      <select
        //  value={props.kdlokasi}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm"
        aria-label=".form-select-sm"
      >
        {/* <option value="XX">-- Pilih Provinsi --</option> */}
        {role === "0" || role === "1" || role === "X" ? (
          <>
            <option value="00">Semua Provinsi</option>
            {data.map((item) => (
              <option key={item.kdprov} value={item.kdprov}>
                {item.kdprov} - {item.nmprov}
              </option>
            ))}
          </>
        ) : (
          data
            .filter((item) => item.kdkanwil === kdkanwil)
            .map((item) => (
              <option key={item.kdlokasi} value={item.kdprov}>
                {item.kdlokasi} - {item.nmprov}
              </option>
            ))
        )}
      </select>
    </div>
  );
};

export default Kdlokasi;
