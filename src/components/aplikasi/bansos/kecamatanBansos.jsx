import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const Kecamatan = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [props.kabkota]);
  // console.log(props.kabkota);
  // console.log(props.kdlokasi);
  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      "select kdprov,kdkabkota,kdkec,nmkec from dbref.t_kecamatan "
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
      setData(
        response.data.filter(
          (item) =>
            item.kdprov === props.kdlokasi && item.kdkabkota === props.kabkota
        )
      );

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
        value={props.kecamatan}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm"
        aria-label=".form-select-sm tahun"
      >
        {/* <option value="XX">-- Pilih Kecamatan --</option> */}
        <option value="00">Semua Kecamatan</option>

        {data.map((item, index) => (
          <option value={item.kdkec} key={index}>
            {item.kdprov}
            {item.kdkabkota}
            {item.kdkec} - {item.nmkec}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Kecamatan;
