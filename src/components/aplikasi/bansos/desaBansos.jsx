import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const Desa = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
    // console.log(props.kecamatan);
  }, [props.kecamatan]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `select kdprov,kdkabkota,kdkec,kddesa,nmdesa from dbref.t_desa`
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
            item.kdprov === props.kdlokasi &&
            item.kdkabkota === props.kabkota &&
            item.kdkec === props.kecamatan
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
        value={props.desa}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm"
        aria-label=".form-select-sm tahun"
      >
        {/* <option value="XX">-- Pilih Desa --</option> */}
        <option value="00">Semua Desa</option>

        {data.map((item, index) => (
          <option value={item.kddesa} key={index}>
            {item.kdprov}
            {item.kdkabkota}
            {item.kdkec} {item.kddesa} - {item.nmdesa}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Desa;
