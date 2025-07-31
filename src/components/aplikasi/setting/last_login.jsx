import { Card, Container, ListGroup } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { io } from "socket.io-client";
import format from "date-fns/format";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

function LastLogin(props) {
    const { loggedinUsers, statusLogin, visibilityStatuses, axiosJWT, token } =
        useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [serverTimestamp, setServerTimestamp] = useState(null);
    const [prevData, setPrevData] = useState([]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_REACT_APP_LOCAL_SOCKET);

        socket.on("statusberubah", (timestamp) => {
            setServerTimestamp(timestamp);
        });

        return () => {
            socket.off("statusberubah");
            socket.disconnect();
        };
    }, []);
    // console.log(serverTimestamp);
    useEffect(() => {
        getData();
    }, [serverTimestamp]);

    const getData = async () => {
        setLoading(true);

        const encodedQuery = encodeURIComponent(
            `SELECT u.username AS USER, u.NAME, MAX(u.tgl_login) AS last_login FROM v3.users u WHERE u.tgl_login IS NOT NULL GROUP BY u.username, u.NAME ORDER BY last_login DESC`
        );

        const cleanedQuery = decodeURIComponent(encodedQuery)
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const encryptedQuery = Encrypt(cleanedQuery);
        try {
            const response = await axiosJWT.get(
                import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
                    ? `${import.meta.env.VITE_REACT_APP_LOCAL_CHARTKINERJA
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
            const { status, data } = error.response || {};
            handleHttpError(
                status,
                (data && data.error) ||
                "Terjadi Permasalahan Koneksi atau Server Backend"
            );

            setLoading(false);
        }
    };
    //console.log(visibilityStatuses);
    return (
        <Container fluid>
            <Card>
                <Card.Body
                    style={{ overflow: "scroll", height: "750px" }}
                    className="m-3 p-3"
                >
                    {statusLogin && (
                        <ListGroup style={{ height: "500px" }}>
                            {data.map((username, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    {username.NAME} (
                                    {format(
                                        new Date(username.last_login),
                                        "dd-MM-yyyy hh:mm:ss"
                                    )})
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LastLogin;