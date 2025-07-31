import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const Transaksi = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [props.kdtransaksi]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      "SELECT return_code,nmreturn FROM dbref.t_return_status"
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
  // console.log(data);
  return loading ? (
    <>Loading ...</>
  ) : (
    <div className="fade-in">
      <select
        value={props.transaksi}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm"
        aria-label=".form-select-sm tahun"
      >
        {/* <option value="XX">-- Pilih Status Transaksi --</option> */}
        <option value="00">Semua Status</option>

        {data.map((item, index) => (
          <option value={item.return_code} key={index}>
            {item.return_code} - {item.nmreturn}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Transaksi;
