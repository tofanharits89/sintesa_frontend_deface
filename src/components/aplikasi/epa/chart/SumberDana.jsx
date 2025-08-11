import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import { useNavigate } from "react-router-dom";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../notifikasi/toastError";
import { Card, Container, Spinner, Table } from "react-bootstrap";

const EpaSdana = ({ thang, periode, dept, kdkanwil, kdkppn }) => {
  const years = [thang - 2, thang - 1, thang];
  const navigate = useNavigate();
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // console.log("[SumberDana] Props received:", {
      //   thang,
      //   periode,
      //   dept,
      //   kdkanwil,
      //   kdkppn,
      // });
      setLoading(true);
      try {
        let filterKanwil = "";
        let filterKppn = "";
        if (
          kdkanwil &&
          kdkanwil !== "" &&
          kdkanwil !== null &&
          kdkanwil !== undefined &&
          kdkanwil !== "00"
        ) {
          filterKanwil = ` AND a.kdkanwil='${kdkanwil}'`;
          if (
            kdkppn &&
            kdkppn !== "" &&
            kdkppn !== null &&
            kdkppn !== undefined &&
            kdkppn !== "00" &&
            kdkppn !== "000"
          ) {
            filterKppn = ` AND a.kdkppn='${kdkppn}'`;
          }
        } else {
          if (
            kdkppn &&
            kdkppn !== "" &&
            kdkppn !== null &&
            kdkppn !== undefined &&
            kdkppn !== "00" &&
            kdkppn !== "000"
          ) {
            filterKppn = ` AND a.kdkppn='${kdkppn}'`;
          }
        }

        let sqlQuery = `SELECT a.kddept, a.kdkanwil, a.kdkppn, a.katsdana, ${years
          .map(
            (
              year
            ) => `SUM(CASE WHEN a.thang = ${year} THEN a.pagu ELSE 0 END) AS pagu_${year}, 
                         SUM(CASE WHEN a.thang = ${year} THEN a.real1 + a.real2 + a.real3 + a.real4 + a.real5 + a.real6 + a.real7 + a.real8 + a.real9 + a.real10 + a.real11 + a.real12 ELSE 0 END) AS realisasi_${year}`
          )
          .join(", ")}
        FROM digitalisasi_epa.pagu_real_sdana a 
        WHERE a.thang IN (${years.join(
          ","
        )}) AND a.kddept='${dept}' AND a.katsdana IS NOT NULL${filterKanwil}${filterKppn}
        GROUP BY a.kddept, a.katsdana
        HAVING ${years
          .map((year) => `pagu_${year} > 0 OR realisasi_${year} > 0`)
          .join(" OR ")}`;

        // console.log('[SumberDana] SQL Query:', sqlQuery);
        // console.log("[SumberDana] Final SQL Query:", sqlQuery);

        sqlQuery = sqlQuery.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

        const response = await axiosJWT.get(
          `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA}${Encrypt(
            sqlQuery
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // console.log("[SumberDana] API Response:", response.data);
        setData(response.data.result || []); // Pastikan data tidak undefined
      } catch (error) {
        console.error("[SumberDana] Error fetching data:", error);
        handleHttpError(
          error.response?.status,
          error.response?.data?.error || "Terjadi kesalahan koneksi"
        );
      }
      setLoading(false);
    };

    fetchData();
  }, [thang, periode, dept, kdkanwil, kdkppn]);

  return (
    <Container fluid>
      <div className="my-3">
        Tren per Sumber Dana
        <br /> TA {thang - 4} - {thang} (dalam triliun)
      </div>
      <Card>
        <Card.Body
          style={{
            height: "350px",
            scrollBehavior: "smooth",
            overflow: "auto",
          }}
        >
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table
              striped
              bordered
              hover
              responsive
              className="text-center mt-4"
            >
              <thead className="table-dark">
                <tr>
                  <th rowSpan="2" style={{ verticalAlign: "middle" }}>
                    SUMBER DANA
                  </th>
                  {years.map((year) => (
                    <th key={year} colSpan="3">
                      {year}
                    </th>
                  ))}
                </tr>
                <tr>
                  {years.map((year) => (
                    <React.Fragment key={`header-${year}`}>
                      <th key={`pagu-${year}`}>Pagu</th>
                      <th key={`real-${year}`}>Real</th>
                      <th key={`persen-${year}`}>% Real</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.katsdana}</td>
                      {years.map((year) => {
                        const pagu = Number(item[`pagu_${year}`]) || 0;
                        const realisasi =
                          Number(item[`realisasi_${year}`]) || 0;
                        const persen = pagu > 0 ? (realisasi / pagu) * 100 : 0;

                        return (
                          <React.Fragment key={`row-${year}-${index}`}>
                            <td
                              key={`pagu-${year}-${index}`}
                              className="text-end"
                            >
                              {numeral(pagu / 1e12).format("0,0.00")}
                            </td>
                            <td
                              key={`real-${year}-${index}`}
                              className="text-end"
                            >
                              {numeral(realisasi / 1e12).format("0,0.00")}
                            </td>
                            <td
                              key={`persen-${year}-${index}`}
                              className="text-end"
                            >
                              {numeral(persen).format("0.00")}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={1 + years.length * 3} className="text-center">
                      Tidak ada data tersedia
                    </td>
                  </tr>
                )}

                <tr className="fw-bold">
                  <td className="text-center">TOTAL</td>
                  {years.map((year) => {
                    const totalPagu = data.reduce(
                      (sum, item) =>
                        sum + (Number(item?.[`pagu_${year}`]) || 0),
                      0
                    );
                    const totalReal = data.reduce(
                      (sum, item) =>
                        sum + (Number(item?.[`realisasi_${year}`]) || 0),
                      0
                    );
                    const totalPersen =
                      totalPagu > 0 ? (totalReal / totalPagu) * 100 : 0;

                    return (
                      <React.Fragment key={`total-${year}`}>
                        <td key={`total-pagu-${year}`} className="text-end">
                          {numeral(totalPagu / 1e12).format("0,0.00")}
                        </td>
                        <td key={`total-real-${year}`} className="text-end">
                          {numeral(totalReal / 1e12).format("0,0.00")}
                        </td>
                        <td key={`total-persen-${year}`} className="text-end">
                          {numeral(totalPersen).format("0.00")}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </tbody>
            </Table>
          )}
          {/* <div className="header-kinerja-baris mt-3">{datasdana}</div> */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EpaSdana;
