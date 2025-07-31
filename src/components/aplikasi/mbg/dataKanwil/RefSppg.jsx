import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const Sppg = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(props);

  useEffect(() => {
    getData();
  }, []);
  //console.log(props.kdPN, props.kdPP, props.KegPP);
  const getData = async () => {
    setLoading(true);
    const encodedQuery = `select kdkomoditas,nmkomoditas from data_bgn.ref_komoditas`;
    const format = encodedQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    const encryptedQuery = Encrypt(format);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
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
    <>
      <select
        value={props.komoditas}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-md text-select"
        aria-label=".form-select-md"
      >
        {" "}
        <option value="">Pilih Komoditas</option>
        {data.length > 0 &&
          data.map((pn, index) => (
            <option key={index} value={pn.kdkomoditas}>
              {pn.kdkomoditas} - {pn.nmkomoditas}
            </option>
          ))}
      </select>
    </>
  );
};

export default Sppg;
