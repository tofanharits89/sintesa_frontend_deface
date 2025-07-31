import React, { useState, useContext, useEffect } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { Loading2 } from "../../layout/LoadingTable";
import moment from "moment";
import numeral from "numeral";
import ChartUser from "./chartUser";
import ChartBulan from "./chartBulan";

export const LogUser = (props) => {
  const { axiosJWT, token } = useContext(MyContext);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [bulan, setBulan] = useState([]);

  useEffect(() => {
    props.cek && getData();
  }, [props.cek]);

  useEffect(() => {
    props.cek && getDataUser();
    props.cek && getDataBulanan();
  }, [props.cek]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.username,a.name,a.date_login,COUNT(*) total FROM v3.log_user a GROUP BY a.username,DATE(a.date_login) ORDER BY a.date_login DESC`
    );
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
  };

  const getDataUser = async () => {
    setLoadingUser(true);
    const encodedQuery = encodeURIComponent(
      `SELECT YEAR(date_login) AS tahun, CASE WHEN MONTH(date_login) = 1 THEN 'Jan' WHEN MONTH(date_login) = 2 THEN 'Feb' WHEN MONTH(date_login) = 3 THEN 'Mar' WHEN MONTH(date_login) = 4 THEN 'Apr' WHEN MONTH(date_login) = 5 THEN 'May' WHEN MONTH(date_login) = 6 THEN 'Jun' WHEN MONTH(date_login) = 7 THEN 'Jul' WHEN MONTH(date_login) = 8 THEN 'Aug' WHEN MONTH(date_login) = 9 THEN 'Sep' WHEN MONTH(date_login) = 10 THEN 'Oct' WHEN MONTH(date_login) = 11 THEN 'Nov' WHEN MONTH(date_login) = 12 THEN 'Dec' END AS bulan, COUNT(DISTINCT username) AS total_user FROM log_user WHERE YEAR(date_login) in (2023,2024) GROUP BY YEAR(date_login), MONTH(date_login) ORDER BY YEAR(date_login), MONTH(date_login)`
    );

    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);

      setLoadingUser(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoadingUser(false);
    }
  };

  const getDataBulanan = async () => {
    setLoadingUser(true);
    const encodedQuery = encodeURIComponent(
      `select DATE(date_login) AS login_date, COUNT(DISTINCT username) AS total_logins FROM v3.log_user WHERE date_login IS NOT NULL AND YEAR(date_login) = YEAR(CURDATE()) AND MONTH(date_login) = MONTH(CURDATE()) GROUP BY login_date ORDER BY login_date`
    );

    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBulan(response.data);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  // console.log(user);
  return (
    <>
      {loading ? (
        <>
          <Loading2 />
          <br />
          <Loading2 />
          <br />
          <Loading2 />
        </>
      ) : (
        <>
          <Container fluid>
            <Row>
              <Col xs={12} md={6} lg={6} xl={6}>
                <Card>
                  <Card.Body
                    style={{ overflow: "scroll", height: "750px" }}
                    className="m-3 p-3 "
                  >
                    <ListGroup>
                      {loading ? (
                        <Loading2 />
                      ) : (
                        data.map((item, index) => (
                          <ListGroup.Item
                            key={index}
                            className="d-flex justify-content-between align-items-center bg-secondary text-white "
                          >
                            {item.username} | {item.name} |{" "}
                            {moment(item.date_login).format(
                              "DD-MM-YYYY HH:mm:ss"
                            )}
                            <span className="badge bg-light rounded-pill text-dark">
                              {numeral(item.total).format("0,00")}
                            </span>
                          </ListGroup.Item>
                        ))
                      )}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={6} xl={6}>
                <Card>
                  <Card.Body
                    style={{ overflow: "scroll", height: "750px" }}
                    className="m-3 p-3 "
                  >
                    {user && <ChartUser data={user} />}
                    {bulan && <ChartBulan chartData={bulan} />}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};
