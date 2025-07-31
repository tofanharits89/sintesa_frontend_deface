import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import Encrypt from "../../../../auth/Random";
import { LoadingTable } from "../../../layout/LoadingTable";
import { handleHttpError } from "../../notifikasi/toastError";

const Sdana = ({ thang, periode, dept, prov, datasdana, refCluster }) => {
  const years = [thang - 2, thang - 1, thang]; // Tahun yang diinginkan

  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");

  function generateSQLQuery(years, selectedMonth) {
    const monthsAbbr = [
      "real1",
      "real1 + real2 ",
      "real1 + real2 + real3 ",
      "real1 + real2 + real3 + real4 ",
      "real1 + real2 + real3 + real4 + real5 ",
      "real1 + real2 + real3 + real4 + real5 + real6 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 ",
      "real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 + real12 ",
    ];

    const selectColumns = years
      .map((year) => {
        const paguCase = `SUM(CASE WHEN a.thang = ${year} THEN a.pagu ELSE 0 END) AS pagu_${year}`;
        const realisasiCase = `SUM(CASE WHEN a.thang = ${year} THEN ${
          monthsAbbr[selectedMonth - 1]
        } ELSE 0 END) AS realisasi_${year}`;
        return `${paguCase}, ${realisasiCase}`;
      })
      .join(",\n");

    return `
      SELECT
        a.kddept,
        a.katsdana,
        ${selectColumns}
      FROM
        dashboard_profil.pagu_real_sdana a
      WHERE
        a.thang IN (${years.join(
          ", "
        )}) AND a.kddept in ${refCluster} and a.katsdana<>'NULL'
      GROUP BY
         a.katsdana
      HAVING
        ${years
          .map((year) => `pagu_${year} > 0 OR realisasi_${year} > 0`)
          .join(" OR ")}  
    `;
  }

  useEffect(() => {
    const sqlQuery = generateSQLQuery(years, parseInt(periode));
    if (refCluster && refCluster.length > 0) {
      getData(sqlQuery);
    }
  }, [thang, periode, refCluster]);

  const getData = async (sqlQuery) => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(sqlQuery);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  //console.log(data);
  let totalPagu = 0;
  let totalReal = 0;
  return (
    <>
      <div className="pie">
        <>
          <div className="header-kinerja-cluster">
            Tren Sumber Dana TA {thang - 2} - {thang} ( triliun)
          </div>
          <div style={{ width: "100%" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th rowSpan="2">SD</th>
                  {years.map((year) => (
                    <React.Fragment key={year}>
                      <th colSpan="3">{year}</th>
                    </React.Fragment>
                  ))}
                </tr>
                <tr>
                  {years.map((year) => (
                    <React.Fragment key={year}>
                      <th>pagu</th>
                      <th>real</th>
                      <th>%real</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.katsdana}</td>
                    {years.map((year) => (
                      <React.Fragment key={year}>
                        <td className="text-end">
                          {numeral(
                            parseFloat(item[`pagu_${year}`]) / 1000000000000
                          ).format("0,0.00")}
                        </td>
                        <td className="text-end">
                          {numeral(
                            parseFloat(item[`realisasi_${year}`]) /
                              1000000000000
                          ).format("0,0.00")}
                        </td>
                        <td className="text-end">
                          {(
                            (parseFloat(item[`realisasi_${year}`]) /
                              parseFloat(item[`pagu_${year}`])) *
                            100
                          ).toFixed(2)}
                        </td>
                      </React.Fragment>
                    ))}
                    {/* Tambahkan kode untuk total di setiap kolom */}
                  </tr>
                ))}

                <tr>
                  <td className="text-center fw-bold">TOTAL</td>
                  {years.map((year) => {
                    let totalPagu = 0;
                    let totalReal = 0;
                    data.forEach((item) => {
                      totalPagu += parseFloat(item[`pagu_${year}`]); // Menambahkan parseFloat di sini
                      totalReal += parseFloat(item[`realisasi_${year}`]); // Dan di sini
                    });
                    return (
                      <React.Fragment key={year}>
                        <td className="text-end fw-bold">
                          {numeral(totalPagu / 1000000000000).format("0,0.00")}
                        </td>
                        <td className="text-end fw-bold">
                          {numeral(totalReal / 1000000000000).format("0,0.00")}
                        </td>
                        <td className="text-end fw-bold">
                          {((totalReal / totalPagu) * 100).toFixed(2)}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="header-kinerja-baris mt-3">
            <div className="ms-2 me-auto">{datasdana}</div>
          </div>
        </>
      </div>
    </>
  );
};

export default Sdana;
