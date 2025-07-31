import React, { useState, useContext, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import ReactPaginate from "react-paginate";
import "./style.css"; // Pastikan Anda mengimpor CSS
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { io } from "socket.io-client";

const LandingBot = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0); // Ensure pages is never negative
  const [updatePesan, setupdatePesan] = useState("");

  const socketUrl = import.meta.env.VITE_REACT_APP_LOCAL_SOCKET_AKTIVASI;
  const socket = io(socketUrl, {
    transports: ["websocket"],
    secure: true,
  });

  useEffect(() => {
    getData();
  }, [page]);

  useEffect(() => {
    socket.on("updatepesan", (data) => {
      // getData();
    });
    return () => {
      socket.off("updatepesan");
    };
  }, []);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil =
        props.where +
        (props.where ? " AND " : "") +
        `a.kdkanwil = '${kdkanwil}'`;
    } else {
      filterKanwil = props.where;
    }

    const encodedQuery = encodeURIComponent(
      `SELECT id, sender_identity, from_number, to_number, user_message, bot_reply, TIMESTAMP, createdAt, updatedAt FROM bot.messages ORDER BY id DESC`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_BOTCENTER
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_BOTCENTER
            }${encryptedQuery}&limit=10&page=${page}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      setPages(response.data.totalPages || 0); // Ensure pages is at least 0
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  return (
    <>
      <span className="d-flex pagination2 justify-content-end">
        <nav>
          {pages > 0 && ( // Only render ReactPaginate if pages > 0
            <ReactPaginate
              breakLabel="..."
              previousLabel={<span>←</span>}
              nextLabel={<span>→</span>}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={pages} // Ensure pages is passed correctly
              containerClassName="pagination"
              pageClassName="page-item2"
              pageLinkClassName="page-link2"
              previousClassName="page-item2"
              previousLinkClassName="page-link2"
              nextClassName="page-item2"
              nextLinkClassName="page-link2"
              activeClassName="active"
              disabledClassName="disabled"
              onPageChange={handlePageChange}
              initialPage={page}
            />
          )}
        </nav>
      </span>
      <section
        className="section my-0 fade-in table-card"
        style={{ height: "550px", overflow: "scroll" }}
      >
        <Table borderless hover className="chat-table">
          <thead>
            <tr>
              <th>Dari</th>
              <th>Pesan</th>
              <th>Nomor</th>
              <th>Balasan</th>
              <th>Updated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <div className="spinner-container">
                    <Spinner animation="border" />
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((chat) => (
                <tr
                  key={chat.id}
                  className={`chat-bubble ${
                    chat.sender_identity === "User" ? "user" : "bot"
                  }`}
                >
                  <td>
                    <span className="message-text">{chat.sender_identity}</span>
                  </td>
                  <td>
                    <span className="message-text">{chat.user_message}</span>
                  </td>
                  <td>
                    <span className="message-text">{chat.from_number}</span>
                  </td>
                  <td>
                    <span className="message-text-long">
                      {chat.bot_reply.length > 80
                        ? chat.bot_reply.substring(0, 80) + "..."
                        : chat.bot_reply}
                    </span>
                  </td>
                  <td>
                    {format(new Date(chat.createdAt), "dd MMMM yyyy HH:mm", {
                      locale: id,
                    })}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center status-badge ms-2">
                      <FaCheckCircle className="text-success" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </section>
    </>
  );
};

export default LandingBot;
