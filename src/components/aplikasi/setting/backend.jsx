import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { Spinner, Container, ListGroup, Card, CardBody } from "react-bootstrap"; // Import the Spinner component
import { io } from "socket.io-client";

const Backend = () => {
  const { processquery, errorprocessquery, username } = useContext(MyContext);
  const [serverResponse, setServerResponse] = useState(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET);

    socket.on("connect", () => {
      setServerResponse(true);
    });
    return () => {
      socket.disconnect();
      setServerResponse(false);
    };
  }, []);

  return (
    <section className="section dashboard team">
      <Card className="custom-card" bg="light">
        <Card.Body
          style={{ overflow: "scroll", height: "750px" }}
          className="m-3 p-3"
        >
          <h5 className={serverResponse ? "text-success" : "text-danger"}>
            {serverResponse
              ? "Koneksi ke Server Berhasil"
              : "Koneksi ke Server Gagal"}
          </h5>
          <hr />
          <div className="my-2">
            {processquery.length > 0 ? (
              processquery.map((su, index) => (
                <p key={index}>
                  {processquery[processquery.length - 1 - index]}
                </p>
              ))
            ) : (
              <ListGroup.Item className="text-muted">
                data tidak tersedia ...
              </ListGroup.Item>
            )}

            {errorprocessquery.length > 0 &&
              errorprocessquery.map((er, index) => (
                <p key={index}>
                  <hr />
                  {errorprocessquery[errorprocessquery.length - 1 - index]}
                </p>
              ))}
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};

export default Backend;
