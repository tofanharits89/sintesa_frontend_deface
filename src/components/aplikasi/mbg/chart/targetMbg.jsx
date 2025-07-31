import React, { useState, useEffect, useContext } from "react";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";

const TargetMbgBgn = ({ prov, onDataReceived }) => {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [prov]);

  const getData = async () => {
    setLoading(true);

    const queryNASIONAL = `
    SELECT  
      '00' AS wilprov,
      'NASIONAL' AS wilprovnama,
      SUM(jum_total + jum_total_2 + jum_total_3 + jum_total_4 + jum_total_5) AS jum_sppg_aktif,
      SUM(jum_dapur) AS target,
      SUM(jum_penerima) AS penerima,
      SUM(jum_potensi) AS potensi_penerima,
      ROUND(
        (SUM(jum_total + jum_total_2 + jum_total_3 + jum_total_4 + jum_total_5) / NULLIF(SUM(jum_dapur), 0)) * 100,
        2
      ) AS persen_penerima,
      ROUND(
        (SUM(jum_penerima) / NULLIF(SUM(jum_potensi), 0)) * 100,
        2
      ) AS persen_potensi
    FROM 
      data_bgn.data_sppg;
  `;

    const queryProv = `
   SELECT 
  sppg.wilprov,
  sppg.wilkode,
  sppg.wilprovnama,
  sppg.jum_sppg_aktif,
  sppg.target,
  sppg.penerima,
  sppg.potensi_penerima,
  sppg.persen_penerima,
  sppg.persen_potensi,
  petugas.total_petugas_prov
FROM (
  SELECT  
    wilprov,
    wilkode,
    wilprovnama,
    SUM(jum_total + jum_total_2 + jum_total_3 + jum_total_4 + jum_total_5) AS jum_sppg_aktif,
    SUM(jum_dapur) AS target,
    SUM(jum_penerima) AS penerima,
    SUM(jum_potensi) AS potensi_penerima,
    ROUND(
      (SUM(jum_total + jum_total_2 + jum_total_3 + jum_total_4 + jum_total_5) / NULLIF(SUM(jum_dapur), 0)) * 100,
      2
    ) AS persen_penerima,
    ROUND(
      (SUM(jum_penerima) / NULLIF(SUM(jum_potensi), 0)) * 100,
      2
    ) AS persen_potensi
  FROM 
    data_bgn.data_sppg
  WHERE 
    wilprovnama = '${prov}'
  GROUP BY 
    wilprov, wilkode, wilprovnama
) AS sppg
LEFT JOIN (
  SELECT 
    SUM(y) AS total_petugas_prov,
    SUBSTRING_INDEX(wilayah, ' > ', 1) AS wilprovnama
  FROM 
    data_bgn.by_petugas_prov
  GROUP BY 
    SUBSTRING_INDEX(wilayah, ' > ', 1)
) AS petugas ON petugas.wilprovnama = sppg.wilprovnama;
 `;

    const query = prov === "NASIONAL" ? queryNASIONAL : queryProv;
    const encryptedQuery = Encrypt(
      query.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
    );
    // console.log(query);

    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = response.data.result || [];

      // Kirim ke parent
      if (onDataReceived) {
        onDataReceived(res);
      }
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
};

export default TargetMbgBgn;
