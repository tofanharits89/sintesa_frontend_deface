import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../auth/Context";
import Encrypt from "../../auth/Random";
import { handleHttpError } from "../aplikasi/notifikasi/toastError";

const KodePRI = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [props.kdPN, props.kdPP, props.KegPP]);
  //console.log(props.kdPN, props.kdPP, props.KegPP);
  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `select * from dbref.t_priproy_${props.thang}`
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
      setData(response.data.filter((item) => item.kdpn === props.kdPN));
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
        value={props.kdproy}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select"
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Proyek Prioritas</option>
        {data
          .filter((item) => item.kdpp === props.kdPP)
          .filter((item) => item.kdkp === props.KegPP)
          .map((pn, index) => (
            <option key={index} value={pn.kdproy}>
              {pn.kdproy} - {pn.nmproy}
            </option>
          ))}
      </select>
    </>
  );
};

export default KodePRI;
