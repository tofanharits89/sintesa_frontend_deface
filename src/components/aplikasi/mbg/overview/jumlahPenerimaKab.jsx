import { useEffect, useState, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const useJumlahPenerimaKab = (prov) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [dataPenerimaKab, setDataPenerimaKab] = useState({});
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);

    const query = `SELECT 
  kabkota,
  provinsi,
  SUM(jumlah) AS penerimakab,
  ROUND(
    (SUM(jumlah) / 
      (SELECT SUM(jumlah) 
       FROM data_bgn.by_penerima_detail 
       WHERE provinsi = '${prov}')
    ) * 100, 
    2
  ) AS persen_penerimakab
FROM data_bgn.by_penerima_detail
WHERE provinsi = '${prov}'
GROUP BY kabkota
ORDER BY penerimakab DESC;


    `
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(query);
    // console.log(query);

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const dataArray = (response.data.result || []).map((item) => ({
        provinsi: item.provinsi,
        kabkota: item.kabkota,
        penerimakab: item.penerimakab,
        persenpenerimakab: item.persen_penerimakab,
      }));

      setDataPenerimaKab(dataArray);
    } catch (error) {
      console.log(error);

      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend Penerima Kab"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [prov]);

  return { dataPenerimaKab, loading };
};

export default useJumlahPenerimaKab;
