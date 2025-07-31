import React, { useEffect, useContext, useState } from "react";
import MyContext from "../../auth/Context";
import Encrypt from "../../auth/Random";
import { io } from "socket.io-client";

import { NotifPesan } from "../aplikasi/notifikasi/Omspan";
import { handleHttpError } from "../aplikasi/notifikasi/toastError";

const CekNotifikasi = () => {
  const { axiosJWT, token, username, settotNotif, totNotif } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET);
    socket.on("new-notification", (newNotification) => {
      setUpdate(true);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    getData();
  }, [update, totNotif]);

  useEffect(() => {
    if (data.length > 0) {
      settotNotif(data[0].total);
    }
  }, [data]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT COUNT(tujuan) total,createdAt FROM v3.notifikasi WHERE tujuan='${username}' AND STATUS='false' GROUP BY tujuan 
      `
    );
    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data.result);
      data.length > 0 && update && NotifPesan("Notifikasi Baru Diterima");
      setUpdate(false);
    } catch (error) {
      console.log(error);
      setUpdate(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  return <>{data.length > 0 && data[0].total}</>;
};

export default CekNotifikasi;
