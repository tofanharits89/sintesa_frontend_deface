import { useEffect, useState, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const useJumlahPenerima = (selectedProvince) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [dataMapPenerima, setDataMapPenerima] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      try {
        const query = `
         SELECT wilkode,wilnama,jumlahpenerima FROM data_bgn.data_summary_prov 
        `
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const encryptedQuery = Encrypt(query);
        const url = `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`;

        const response = await axiosJWT.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = response.data?.result;

        if (!result || result.length === 0) {
          setDataMapPenerima({});
          handleHttpError(204, "Data jumlah SPPG tidak ditemukan atau kosong.");
          return;
        }

        const entries = result.map((item) => {
          const wilkode = item.wilkode?.toUpperCase().trim();
          return [
            wilkode,
            {
              data: {
                wilnama: item.wilnama,
                jumlah: item.jumlahpenerima,
                wilkode: wilkode,
              },
            },
          ];
        });

        setDataMapPenerima(Object.fromEntries(entries));
      } catch (error) {
        const { status, data } = error.response || {};
        handleHttpError(
          status,
          data?.error ||
            "Terjadi Permasalahan Koneksi atau Server Backend Jumlah SPPG"
        );
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [selectedProvince, axiosJWT, token, username]);
  // console.log(dataMapPenerima);

  return { dataMapPenerima, loading };
};

export default useJumlahPenerima;
