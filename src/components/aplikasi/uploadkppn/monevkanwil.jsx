import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  OverlayTrigger,
  Table,
  Tooltip,
  Spinner,
} from "react-bootstrap";

import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";

import moment from "moment";
import Encrypt from "../../../auth/Random";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";

const MonevKanwil = ({ cekMonev }) => {
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sql, setSql] = useState("");

  useEffect(() => {
    cekMonev && getData();
  }, [cekMonev]);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil = `and a.kdkanwil = '${kdkanwil}' and a.kdkanwil<>'00'`;
    } else {
      filterKanwil = "and a.kdkanwil<>'00'";
    }
    const encodedQuery = encodeURIComponent(
      `SELECT
      a.id,
      a.kdkanwil,
      b.nmkanwil,
      c.nmjenis,
      d.kdperiode,
    
      d.nmperiode,
      a.waktu,
      a.fileasli,
      a.nilai,
    
      a.catatan,
      a.file,
      a.tahun
      FROM
      tkd.upload_data_kanwil a
      LEFT JOIN
      dbref.t_kanwil_2024 b ON a.kdkanwil = b.kdkanwil
      LEFT JOIN
      tkd.ref_jenis_laporan c ON a.jenis = c.kdjenis
     LEFT JOIN
      tkd.ref_periode_kanwil d ON a.periode = d.kdperiode
      
      WHERE a.jenis='02' ${filterKanwil}
      GROUP BY
      a.kdkanwil,
      
      a.waktu
      ORDER BY
      a.waktu DESC
      `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
            }${encryptedQuery}&user=${username}`
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
      console.log(error);
      setLoading(false);
    }
  };
  const handleHapusdata = async (id) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";
    //console.log(id);
    Swal.fire({
      title: "Konfirmasi Hapus",
      html: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.delete(
            `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_UPLOADKANWIL
            }/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");
          getData();
        } catch (error) {
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      }
    });
  };

  return (
    <Container fluid>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "100px" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table bordered striped className="mt-3">
          <thead className="is-sticky-datauser bg-secondary">
            <tr>
              <th rowSpan="2" className="text-center align-middle">
                No
              </th>
              <th rowSpan="2" className="text-center align-middle">
                Tahun
              </th>
              <th rowSpan="2" className="text-center align-middle">
                KANWIL
              </th>

              <th colSpan="1" className="text-center align-middle">
                Jenis Laporan
              </th>
              <th rowSpan="2" className="text-center align-middle">
                Periode
              </th>
              <th rowSpan="2" className="text-center align-middle">
                Uploaded
              </th>

              <th rowSpan="2" className="text-center align-middle">
                Opsi
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {data.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.tahun}</td>
                <td>{row.nmkanwil}</td>
                <td>{row.nmjenis}</td>
                <td>{row.nmperiode}</td>
                <td>{moment(row.waktu).format("DD-MM-YYYY HH:mm:ss")}</td>

                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Download File</Tooltip>}
                  >
                    <a href={row.file} download>
                      <i className="bi bi-cloud-download-fill"></i>
                    </a>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Hapus Data </Tooltip>}
                  >
                    <i
                      className="bi bi-trash-fill text-danger mx-2"
                      onClick={() => handleHapusdata(row.id)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MonevKanwil;
