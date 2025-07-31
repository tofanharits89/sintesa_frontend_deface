import { useEffect, useState, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const useJumlahPenerima = () => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [dataPenerima, setDataPenerima] = useState({});
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);

    const query = `SELECT 
    provinsi,
    SUM(jumlah) AS penerima,
    FORMAT((SUM(jumlah) / (SELECT SUM(jumlah) FROM data_bgn.by_penerima_detail)) * 100, 2) AS persen_penerima
FROM data_bgn.by_penerima_detail
GROUP BY provinsi
ORDER BY penerima DESC
;

    `
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(query);

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const dataArray = (response.data.result || []).map((item) => ({
        provinsi: item.provinsi,
        penerimasppg: item.penerima,
        persen_penerima: item.persen_penerima,
      }));

      setDataPenerima(dataArray);
    } catch (error) {
      console.log(error);

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

  return { dataPenerima, loading };
};

export default useJumlahPenerima;
