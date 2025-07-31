import { Card, Container, ListGroup } from "react-bootstrap";
import React, { useState, useContext, useEffect } from "react";
import { handleHttpError } from "../notifikasi/toastError";
import MyContext from "../../../auth/Context";
import { Loading2 } from "../../layout/LoadingTable";
import numeral from "numeral";

function Log_menu(props) {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    props.cek && getData();
  }, [props.cek]);

  const getData = async () => {
    setLoading(true);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_LOGMENU
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_LOGMENU}?user=${username}`
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

  return (
    <Container fluid>
      <Card>
        <Card.Body
          style={{ overflow: "scroll", height: "750px" }}
          className="m-3 p-3"
        >
          <ListGroup>
            {loading ? (
              <Loading2 />
            ) : (
              data.map((item, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center bg-secondary text-white"
                >
                  {item.nm_menu}
                  <span className="badge bg-warning rounded-pill text-dark">
                    {numeral(item.hit).format("0,00")}
                  </span>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Log_menu;
