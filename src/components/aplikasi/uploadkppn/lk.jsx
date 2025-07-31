import React, { useState, useContext, useEffect } from "react";
import {
  Table,
  Card,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Modal,
  ModalBody,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import numeral from "numeral";

import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { get } from "lodash";

export default function LaporanKeuangan({ isModalOpen, handleModalClose }) {
  const LIMIT = 10;
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);

  const { axiosJWT, token, kdlokasi, role, kdkanwil, kdkppn } =
    useContext(MyContext);

  const fetchData = async (currentOffset = offset) => {
    let filterKppn = "";
    if (role === "3" && kdkppn) {
      filterKppn = `and a.kdkppn = '${kdkppn}'`;
    }

    const rawQuery = `
      SELECT
        a.id,
        a.kdkppn,
        b.nmkppn,
        c.nmjenis,
        d.kdperiode,
        a.subperiode,
        d.nmperiode,
        a.waktu,
        a.fileasli,
        a.nilai,
        e.nmsubperiode,
        a.catatan,
        a.file,
        a.tahun
      FROM
        tkd.upload_data_kppn a
        LEFT JOIN dbref.t_kppn_2023 b ON a.kdkppn = b.kdkppn
        LEFT JOIN tkd.ref_jenis_laporan c ON a.jenis = c.kdjenis
        LEFT JOIN tkd.ref_periode_kppn d ON a.periode = d.kdperiode
        LEFT JOIN tkd.ref_subperiode_kppn e ON a.periode = e.kdperiode AND a.subperiode = e.subkdperiode
      WHERE
        a.jenis = '01'
        ${filterKppn}
      ORDER BY
        a.waktu DESC
      LIMIT ${LIMIT} OFFSET ${currentOffset}
    `;

    try {
      setLoading(true);
      const cleanedQuery = rawQuery.replace(/\s+/g, " ").trim();
      const encryptedQuery = Encrypt(cleanedQuery);

      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
        }${encryptedQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prevData) => [...prevData, ...response.data.result]);
      setOffset((prevOffset) => prevOffset + 10);

      if (response.data.result.length < 10) {
        // Jika jumlah data kurang dari 30, maka loading tetap true
        setLoading(true);
        setHasMoreData(false); // Tidak ada lagi data yang bisa dimuat
      } else {
        setHasMoreData(true);
      }
    } catch (error) {
      console.error(error);
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Terjadi kesalahan saat memuat data."
      );
      setHasMoreData(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isModalOpen) {
      fetchData();
    }
  }, [isModalOpen]);
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
            Satker Dilakukan Review
          </h6>
        </Modal.Title>
      </Modal.Header>
      <ModalBody>
        <Card className="mt-3" bg="light">
          <div id="scrollableDiv" style={{ height: "40vh", overflow: "auto" }}>
            <InfiniteScroll
              dataLength={data.length}
              next={fetchData}
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
                      <td>{index + 1}</td>
                      <td>{row.tahun}</td>
                      <td>{row.nmkppn}</td>
                      <td>{row.nmjenis}</td>
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
