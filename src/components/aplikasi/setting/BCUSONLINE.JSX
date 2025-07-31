import { Card, Container, ListGroup } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { io } from "socket.io-client";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

function UserOnline(props) {
  const { loggedinUsers, statusLogin, visibilityStatuses, axiosJWT, token } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [serverTimestamp, setServerTimestamp] = useState(null);
  const [prevData, setPrevData] = useState([]);
  const [updatedData, setUpdatedData] = useState(null);

  const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET);
  useEffect(() => {
    socket.on("statusberubah", (data) => {
      console.log(data);

      // Membuat objek untuk menyimpan data terbaru berdasarkan username
      const latestData = {};

      // Iterasi data yang diterima dari server
      data.forEach((item) => {
        // Format ulang timestamp
        const formattedItem = {
          ...item,
          timestamp: moment(item.timestamp).format("DD/MM/YYYY HH:mm:ss"),
        };

        // Jika belum ada data untuk username ini atau timestamp lebih baru, simpan data tersebut
        if (
          !latestData[item.username] ||
          moment(item.timestamp).isAfter(
            moment(latestData[item.username].timestamp)
          )
        ) {
          latestData[item.username] = formattedItem;
        }
      });

      // Ubah objek ke dalam array untuk set state
      const latestDataArray = Object.values(latestData);

      // Set state dengan data terbaru
      setUpdatedData(latestDataArray);
    });

    return () => {
      socket.off("statusberubah");
    };
  }, []);

  // console.log(updatedData);
  return (
    <Container fluid>
      <Card>
        <Card.Body
          style={{ overflow: "scroll", height: "750px" }}
          className="m-3 p-3"
        >
          {statusLogin && (
            <ListGroup style={{ height: "500px" }}>
              {updatedData &&
                updatedData.length > 0 &&
                updatedData.map((username, index) => (
                  <ListGroup.Item
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {username.username}{" "}
                    <span
                      className={` ${
                        username.online === "true"
                          ? "text-success text-bold"
                          : "text-secondary text-bold"
                      }`}
                      style={{ width: "30px" }}
                    >
                      {username.online === "true" ? (
                        <i className="bi bi-emoji-smile  text-center"></i>
                      ) : (
                        <i
                          className="bi bi-emoji-frown-fill
               text-center"
                        ></i>
                      )}
                    </span>
                    <small>{username.name}</small>{" "}
                    {/* Baris 75 yang menyebabkan kesalahan */}
                    <small>{username.timestamp}</small>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserOnline;
