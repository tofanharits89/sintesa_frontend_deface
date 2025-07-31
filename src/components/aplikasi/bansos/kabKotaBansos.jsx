import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const Kdkabkota = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [props.kdlokasi]);
  //console.log(props.kdlokasi);
  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      "select kdprov,kdkabkota,nmkabkota from dbref.t_kabkota_bansos where kdprov='" +
        props.kdlokasi +
        "'"
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
      setData(response.data.filter((item) => item.kdprov === props.kdlokasi));

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
        value={props.kabkota}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm"
        aria-label=".form-select-sm tahun"
      >
        <option value="XX">-- Pilih Kab/ Kota --</option>
        <option value="ALL">Semua Kab/ Kota</option>

        {data.map((item, index) => (
          <option value={item.kdkabkota} key={index}>
            {item.kdprov}
            {item.kdkabkota} - {item.nmkabkota}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Kdkabkota;
