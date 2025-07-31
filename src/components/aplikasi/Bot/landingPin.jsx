import React, { useState, useContext, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import ReactPaginate from "react-paginate";
import "./style.css"; // Pastikan Anda mengimpor CSS
import { format } from "date-fns";
import { id } from "date-fns/locale";

const LandingPin = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    getData();
  }, [page]);

  const getData = async () => {
    setLoading(true);
    let filterKanwil =
      role === "2"
        ? `${props.where} ${
            props.where ? " AND " : ""
          } a.kdkanwil = '${kdkanwil}'`
        : props.where;

    const query = `SELECT id, username, nomor, nama, STATUS, createdAt, updatedAt FROM bot.pin_pendings ORDER BY id DESC`;

    const encryptedQuery = Encrypt(query.trim());

    try {
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_BOTCENTER
        }${encryptedQuery}&limit=10&page=${page}&user=${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      setPages(response.data.totalPages);
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
          <ReactPaginate
            breakLabel="..."
            previousLabel={<span>←</span>}
            nextLabel={<span>→</span>}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={pages}
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
        </nav>
      </span>
      <section
        className="section my-0 fade-in table-card"
        style={{ height: "450px" }}
      >
        <Table borderless hover className="chat-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Nomor</th>
              <th>Nama</th>
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
              data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="message-text">{item.username}</span>
                  </td>
                  <td>
                    <span className="message-text">{item.nomor}</span>
                  </td>
                  <td>
                    <span className="message-text">{item.nama}</span>
                  </td>
                  <td>
                    {format(new Date(item.createdAt), "dd MMMM yyyy HH:mm", {
                      locale: id,
                    })}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center status-badge ms-2">
                      <span
                        className={`message-text-long ${
                          item.STATUS === "OK"
                            ? "status-ok"
                            : item.STATUS === "Waiting"
                              ? "status-waiting"
                              : "status-expired"
                        }`}
                      >
                        {item.STATUS}
                      </span>
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

export default LandingPin;
