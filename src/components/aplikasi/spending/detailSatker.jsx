import React, { useState, useContext, useEffect } from "react";
import numeral from "numeral";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
  Table,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Encrypt from "../../../auth/Random";
import { LoadingChart } from "../../layout/LoadingTable";

export default function DetailSatker({
  isModalOpen,
  handleModalClose,
  kddept,
  jenis,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdlokasi, role, kdkanwil } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    getData();
  }, [isModalOpen]);

  const getData = async () => {
    let limitakses = "";
    if (role === "1" || role === "0") {
      limitakses = " and c.kdkanwil='11' and a.kddekon='1'";
    } else if (role === "X") {
      limitakses = " ";
    } else if (role === "2" && kdkanwil !== "11") {
      limitakses = " and c.kdkanwil= '" + kdkanwil + "'  ";
    } else if (role === "2" && kdkanwil === "11") {
      limitakses = " and c.kdkanwil='11'  and a.kddekon<>'1' ";
    }

    try {
      setLoading(true);
      const encryptedQuery = Encrypt(
        `SELECT a.kdsatker,a.nmsatker,b.kddept,b.nmdept FROM spending_review.ref_satker_dipa_2025 a left join dbref.t_dept_2025 b on a.kddept=b.kddept inner join dbref.t_kppn_2025 c on a.kdkppn=c.kdkppn WHERE a.kddept='${kddept}' AND STATUS='${
          jenis === 2 ? "true" : "false"
        }' ${limitakses} group by a.kdsatker ORDER BY a.kddept,a.kdsatker DESC LIMIT 30 OFFSET ${offset}`
      );

      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prevData) => [...prevData, ...response.data.result]);
      setOffset((prevOffset) => prevOffset + 30);

      if (response.data.result.length < 30) {
        // Jika jumlah data kurang dari 30, maka loading tetap true
        setLoading(true);
        setHasMoreData(false); // Tidak ada lagi data yang bisa dimuat
      } else {
        setHasMoreData(true);
      }
    } catch (error) {
      console.log(error);
      handleHttpError(
        error.response?.status,
        (error.response?.data && error.response.data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={isModalOpen}
      onHide={handleModalClose}
      fullscreen={false}
      size="xl"
      animation={false}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h6>
            <i className="bi bi-briefcase-fill mx-2 text-success"></i>
            Satker {jenis === 2 ? "Sudah" : "Belum"} Dilakukan Review
          </h6>
        </Modal.Title>
      </Modal.Header>
      <ModalBody>
        <Card className="mt-3" bg="light">
          <div id="scrollableDiv" style={{ height: "50vh", overflow: "auto" }}>
            <InfiniteScroll
              dataLength={data.length}
              next={getData}
              hasMore={hasMoreData}
              loader={<p>Loading...</p>}
              //  endMessage={<p>No more data to load.</p>}
              scrollableTarget="scrollableDiv"
            >
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th className="text-header text-center">No.</th>
                    <th className="text-header text-center">
                      Kementerian/ Lembaga
                    </th>
                    <th className="text-header text-center">Satker</th>
                    <th className="text-header text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle text-center">
                        {row.nmdept} ({row.kddept})
                      </td>
                      <td className="align-middle text-center">
                        {row.nmsatker} ({row.kdsatker})
                      </td>
                      <td
                        className={`align-middle text-center ${
                          jenis === 2 ? "text-success" : "text-danger"
                        }`}
                      >
                        {jenis === 2 ? "Sudah Review" : "Belum Review"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </InfiniteScroll>
            {/* {loading && <Spinner animation="border" />} */}
          </div>
        </Card>
      </ModalBody>
    </Modal>
  );
}
