import React, { useState, useContext, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import numeral from "numeral";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import { Loading2 } from "../../layout/LoadingTable";

export default function DataSPM(props) {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    props.cek && getData();
  }, [props.cek, props.id]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT a.id,a.thang,a.kdsatker,a.tgpermohonan, a.nopermohonan,a.nospm,a.tgspm,a.nilspm,a.tgbast,a.nobast,a.status FROM  laporan_2023.dispensasi_spm_lampiran a WHERE a.id_dispensasi='${props.id}' GROUP BY a.id ORDER BY id DESC`
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
  const handleHapus = async (id, id_dispensasi) => {
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Anda yakin ingin menghapus data ini?",
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
              import.meta.env.VITE_REACT_APP_LOCAL_BASIC
            }spm/delete/${id}/${id_dispensasi}`,
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
    <Container className="my-2">
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
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="text-header text-center">No.</th>
                <th className="text-header text-center">Tgl SPM</th>
                <th className="text-header text-center">No SPM</th>
                <th className="text-header text-center">Nilai SPM</th>
                <th className="text-header text-center">No BAST</th>
                <th className="text-header text-center">Tgl BAST</th>
                <th className="text-header text-center">Status</th>
                <th className="text-header text-center">Hapus</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="align-middle text-center">{index + 1}</td>
                  <td className="align-middle text-center">{row.tgspm}</td>
                  <td className="align-middle text-center">{row.nospm}</td>
                  <td className="align-middle baris-total text-end">
                    {numeral(row.nilspm).format("0,0")}
                  </td>
                  <td className="align-middle text-center">{row.nobast}</td>
                  <td className="align-middle text-center">{row.tgbast}</td>
                  <td className="align-middle text-center">
                    {row.status === "Tolak" ? (
                      <span className="text-danger fw-bold">{row.status}</span>
                    ) : (
                      <span className="text-success fw-bold">{row.status}</span>
                    )}
                  </td>
                  <td className="align-middle text-center">
                    <i
                      className="bi bi-dash-circle text-danger text-center fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleHapus(row.id, props.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
