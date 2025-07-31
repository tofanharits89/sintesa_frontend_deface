import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../auth/Context";
import Encrypt from "../../auth/Random";
import { handleHttpError } from "../aplikasi/notifikasi/toastError";

const KodeKegPP = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [props.kdPP, props.kdPN]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `select * from dbref.t_prigiat_${props.thang}`
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
  //console.log(data);
  return loading ? (
    <>Loading ...</>
  ) : (
    <>
      <select
        value={props.kdkp}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select  "
        aria-label=".form-select-sm"
      >
        <option value="00">Semua Kegiatan Prioritas</option>
        {data
          .filter((item) => item.kdpp === props.kdPP)
          .map((pn, index) => (
            <option key={index} value={pn.kdkp}>
              {pn.kdkp} - {pn.nmkp}
            </option>
          ))}
      </select>
    </>
  );
};

export default KodeKegPP;
