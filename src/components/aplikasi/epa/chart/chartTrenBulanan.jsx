import React, { useState, useContext, useEffect, useMemo } from "react";
import MyContext from "../../../../auth/Context";
import numeral from "numeral";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import Encrypt from "../../../../auth/Random";
import { handleHttpError } from "../../../aplikasi/notifikasi/toastError";
import { Card, CardBody, Button, Container, Row, Col } from "react-bootstrap";
import { Loading2 } from "../../../layout/LoadingTable";

const EpaChartTrenBulanan = ({ thang, periode, dept, prov, kdkanwil, kdkppn }) => {
  const years = useMemo(
    () => [thang - 4, thang - 3, thang - 2, thang - 1, thang],
    [thang]
  );
  const { axiosJWT, token } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedYears, setSelectedYears] = useState(years.map(String));

  useEffect(() => {
    getData();
  }, [thang, periode, dept, prov, kdkanwil, kdkppn]);

  const getData = async () => {
    setLoading(true);
    try {
      let filterKanwil = kdkanwil && kdkanwil !== "00" ? ` AND a.kdkanwil='${kdkanwil}'` : "";
      let filterKppn = kdkppn && kdkppn !== "000" ? ` AND a.kdkppn='${kdkppn}'` : "";
      const query = `SELECT a.thang, SUM(pagu) AS pagu, 
        SUM(real1) AS jan, SUM(real1 + real2) AS feb, 
        SUM(real1 + real2 + real3) AS mar, SUM(real1 + real2 + real3 + real4) AS apr, 
        SUM(real1 + real2 + real3 + real4 + real5) AS mei, 
        SUM(real1 + real2 + real3 + real4 + real5 + real6) AS jun, 
        SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7) AS jul, 
        SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8) AS ags, 
        SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9) AS sep, 
        SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10) AS okt, 
        SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11) AS nov, 
        SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 + real12) AS des
        FROM digitalisasi_epa.tren_belanja_jenbel a
        WHERE a.thang IN (${years.join(", ")}) AND a.kddept='${dept}'${filterKanwil}${filterKppn}
        GROUP BY a.thang;`;
      const cleanedQuery = decodeURIComponent(query)
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const encryptedQuery = Encrypt(cleanedQuery);

      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA || ""}${encryptedQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.result) {
        const result = response.data.result;
        setData(result);
        // Transform ke format [{bulan: 'Jan', 2023: val, 2024: val, ...}, ...]
        const bulanKeys = [
          { key: "jan", label: "Jan" },
          { key: "feb", label: "Feb" },
          { key: "mar", label: "Mar" },
          { key: "apr", label: "Apr" },
          { key: "mei", label: "Mei" },
          { key: "jun", label: "Jun" },
          { key: "jul", label: "Jul" },
          { key: "ags", label: "Agt" },
          { key: "sep", label: "Sep" },
          { key: "okt", label: "Okt" },
          { key: "nov", label: "Nov" },
          { key: "des", label: "Des" },
        ];
        // Buat objek per bulan
        const dataPerBulan = bulanKeys.map(({ key, label }) => {
          const obj = { bulan: label };
          result.forEach((item) => {
            obj[item.thang] = Number(item[key]) / 1e12;
          });
          return obj;
        });
        setChartData(dataPerBulan);
      }
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(status, data?.error || "Terjadi masalah koneksi");
    } finally {
      setLoading(false);
    }
  };


  const handleRowClick = (year) => {
    setSelectedYears((prev) =>
      prev.length === 1 && prev[0] === year ? years.map(String) : [year]
    );
  };



  return (
    <Container fluid>
      <h5 className="my-3">
        Tren Belanja Bulanan TA {thang - 2} - {thang} (dalam triliun)
      </h5>
      <hr className="my-2 border-top border-secondary" />
      <Row>
        <Col lg={6}>
          <Card className="shadow-sm border-secondary">
            <CardBody style={{ height: "300px", overflow: "scroll" }}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis tickFormatter={(value) => numeral(value).format("0,0.00")} />
                  <Tooltip formatter={(value) => `${numeral(value).format("0,0.00")} T`} />
                  <Legend />
                  {years.map((year, idx) =>
                    selectedYears.includes(year.toString()) ? (
                      <Line
                        key={year}
                        type="monotone"
                        dataKey={year}
                        stroke={["#8884d8", "#82ca9d", "#ff7300", "#0088FE", "#FF0080"][idx % 5]}
                        strokeWidth={3}
                        dot={{ r: 2 }}
                        activeDot={{ r: 5 }}
                        name={year.toString()}
                        isAnimationActive={false}
                      />
                    ) : null
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm border-secondary">
            <CardBody style={{ height: "300px", overflow: "scroll" }}>
              {loading ? (
                <>
                  <Loading2 />
                  <br />
                  <Loading2 />
                </>
              ) : (
                <div className="table-responsive fade-in">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Tahun</th>
                        {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agt","Sep","Okt","Nov","Des"].map((month) => (
                          <th key={month}>{month}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item) => (
                        <tr
                          key={item.thang}
                          onClick={() => handleRowClick(item.thang.toString())}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{item.thang}</td>
                          {["jan","feb","mar","apr","mei","jun","jul","ags","sep","okt","nov","des"].map((key) => (
                            <td key={key}>
                              {numeral(item[key] / 1e12).format("0,0.00")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedYears.length === 1 && (
                <Button
                  className="fade-in"
                  variant="danger my-4"
                  size="sm"
                  onClick={() => setSelectedYears(years.map(String))}
                >
                  Reset
                </Button>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EpaChartTrenBulanan;
