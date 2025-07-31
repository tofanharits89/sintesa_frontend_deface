import React, { useContext, useEffect, useState } from "react";
import MyContext from "../../../auth/Context";
import * as XLSX from "xlsx";
import { handleHttpError } from "../notifikasi/toastError";

const GenerateExcelMBG = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [exportedDataCount, setExportedDataCount] = useState(0);

  useEffect(() => {
    if (props.query3) {
      fetchData();
    }
  }, [props.query3]);

  useEffect(() => {
    if (data.length > 0) {
      exportToExcel();
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const encodedQuery = encodeURIComponent(props.query3.toUpperCase());

      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_CSV}${encodedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data;
      setData(responseData); // trigger export via useEffect
      setExportedDataCount(responseData.length); // for internal state tracking

      // Kirim jumlah data ke komponen induk (langsung dari responseData.length)
      if (responseData.length === 0) {
        props.onDataFetchComplete(0); // langsung di sini untuk kasus kosong
      }
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const exportToExcel = () => {
    const rawData = data.map((row) => {
      const newRow = {};
      for (const key in row) {
        if (typeof row[key] === "number") {
          newRow[key] = {
            t: "n",
            v: Number(row[key]),
            z: key === "PAGU" || key === "BLOKIR" ? "#,##0" : "General",
          };
        } else {
          newRow[key] = row[key];
        }
      }
      return newRow;
    });

    const ws = XLSX.utils.json_to_sheet(rawData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "v3_sintesa_pdpsipa");
    XLSX.writeFile(wb, props.namafile);

    // Kirim jumlah data setelah export selesai
    props.onDataFetchComplete(data.length);
  };
};

export default GenerateExcelMBG;
