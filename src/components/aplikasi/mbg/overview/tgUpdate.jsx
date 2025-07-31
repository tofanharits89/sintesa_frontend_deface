import React, { useEffect, useState, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import moment from "moment-timezone"; // install: npm install moment-timezone
import Encrypt from "../../../../auth/Random";

export const UpdateMbg = () => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getData = async () => {
    setLoading(true);

    const encodedQueryUpdate = encodeURIComponent(`
      SELECT username, waktu AS tgupdate FROM data_bgn.update
    `);

    const cleanedQuery = decodeURIComponent(encodedQueryUpdate)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result?.[0] || null);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderWaktu = () => {
    if (!data?.tgupdate) return null;

    const waktuWIB = moment(data.tgupdate)
      .tz("Asia/Jakarta")
      .format("DD-MM-YYYY HH:mm:ss");
    return `(data update ${waktuWIB} WIB)`;
  };

  return (
    <>
      {loading ? (
        "Loading ..."
      ) : data ? (
        <span
          className="p-0"
          style={{
            fontSize: "14px",
            fontStyle: "italic",
          }}
        >
          {renderWaktu()}
        </span>
      ) : (
        <span style={{ fontSize: "14px", fontStyle: "italic" }}>
          Belum ada data update
        </span>
      )}
    </>
  );
};
