import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

const SubJenisRevisi = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [props.jenisRevisi]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `select * from dbref.t_jnsrevisi_${props.thang}`
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
        <option value="00">Semua Sub Jenis Revisi</option>
        {data
          .filter((item) => item.kdjnsrevisi[0] === props.jenisRevisi)
          .map((pn, index) => (
            <option key={index} value={pn.kdjnsrevisi}>
              {pn.kdjnsrevisi} - {pn.nmjnsrevisi}
            </option>
          ))}
      </select>
    </>
  );
};

export default SubJenisRevisi;
