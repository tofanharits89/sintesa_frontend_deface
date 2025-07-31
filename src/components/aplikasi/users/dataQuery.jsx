import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";

import Encrypt from "../../../auth/Random";
import { Button } from "react-bootstrap";
import { Loading2 } from "../../layout/LoadingTable";
import Swal from "sweetalert2";
import Notifikasi from "../notifikasi/notif";
import HasilQueryBansos from "../bansos/hasilQueryBansos";
import HasilQueryDeviasi from "../deviasi/hasilQueryDeviasi";
import { handleHttpError } from "../notifikasi/toastError";
import HasilQueryApbn from "../inquiry/hasilQueryApbn";
import HasilQueryBulanan from "../inquiry/hasilQueryBulanan";
import HasilQueryBlokir from "../inquiry/hasilQueryBlokir";
import HasilQueryJnsblokir from "../inquiry/hasilQueryJnsblokir";
import HasilQueryAkumulasi from "../inquiry/hasilQueryAkumulasi";
import { HasilQuery as HasilQueryInquiry } from "../inquiry/hasilQuery";
import { HasilQuery as HasilQueryTematik } from "../tematik/hasilQueryTematik";
import HasilQueryKontrak from "../kontrak/hasilQueryKontrak";
import moment from "moment";
import HasilQueryRkakl from "../rkakl/hasilQueryRkakl";
import HasilQueryUptup from "../uptup/hasilQueryUptup";
import HasilQuerySp2d from "../rowset_sp2d/hasilQuerySp2d";
import HasilQuerySpending from "../spending_query/hasilQuerySpending";

export default function DataQuery(props) {
  const { axiosJWT, token, username } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalbansos, setShowModalbansos] = useState(false);
  const [showModaldeviasi, setShowModaldeviasi] = useState(false);
  const [showModalApbn, setShowModalApbn] = useState(false);
  const [showTematik, setTematik] = useState(false);
  const [showModalAkumulasi, setShowAkumulasi] = useState(false);
  const [showModalBulanan, setShowModalBulanan] = useState(false);
  const [showModalBlokir, setshowModalBlokir] = useState(false);
  const [showModalJnsblokir, setshowModalJnsblokir] = useState(false);
  const [showModalKontrak, setshowModalKontrak] = useState(false);
  const [showModalRkakl, setshowModalRkakl] = useState(false);
  const [showModalUp, setshowModalUp] = useState(false);
  const [showModalSPM, setshowModalSPM] = useState(false);
  const [showModalSpending, setshowModalSpending] = useState(false);
  const [id, setId] = useState("");
  const [querydata, setQuerydata] = useState("");

  useEffect(() => {
    props.cek && getData();
  }, [props.cek]);

  const getData = async () => {
    setLoading(true);
    const encodedQuery = encodeURIComponent(
      `SELECT * FROM v3.simpan_query WHERE username='${username}' ORDER BY id DESC`
    );
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
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
  const handleData = (set, jenis, query) => {
    setId(set);
    setQuerydata(query);

    jenis === "Tematik" && setTematik(true);
    jenis === "Bansos" && setShowModalbansos(true);
    jenis === "Deviasi" && setShowModaldeviasi(true);
    jenis === "Inquiry1" && setShowModalApbn(true);
    jenis === "Inquiry2" && setShowModal(true);
    jenis === "Inquiry3" && setShowAkumulasi(true);
    jenis === "Inquiry4" && setShowModalBulanan(true);
    jenis === "Inquiry5" && setshowModalBlokir(true);
    jenis === "Inquiry7" && setshowModalJnsblokir(true);
    jenis === "Kontrak" && setshowModalKontrak(true);
    jenis === "Rkakl" && setshowModalRkakl(true);
    jenis === "UP" && setshowModalUp(true);
    jenis === "ROWSET_SPM_SP2D" && setshowModalSPM(true);
    jenis === "Spending" && setshowModalSpending(true);
  };

  const closeModalTematik = () => {
    setTematik(false);
  };
  const closeModalbansos = () => {
    setShowModalbansos(false);
  };
  const closeModalpaguapbn = () => {
    setShowModalApbn(false);
  };
  const closeModalpagureal = () => {
    setShowModal(false);
  };
  const closeakumulasi = () => {
    setShowAkumulasi(false);
  };
  const closeModalpagu = () => {
    setShowModalBulanan(false);
  };
  const closeModalblokir = () => {
    setshowModalBlokir(false);
  };
  const closeModaljnsblokir = () => {
    setshowModalJnsblokir(false);
  };
  const closeModaldeviasi = () => {
    setShowModaldeviasi(false);
  };
  const closeModalkontrak = () => {
    setshowModalKontrak(false);
  };
  const closeModalrkakl = () => {
    setshowModalRkakl(false);
  };
  const closeModalUp = () => {
    setshowModalUp(false);
  };
  const closeModalSPM = () => {
    setshowModalSPM(false);
  };
  const closeModalSpending = () => {
    setshowModalSpending(false);
  };

  const handleHapus = async (id) => {
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
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC}query/delete/${id}`,
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
    <div>
      {loading ? (
        <>
          <Loading2 />
          <br /> <Loading2 />
          <br /> <Loading2 />
        </>
      ) : (
        <>
          {showModalApbn && (
            <HasilQueryApbn
              queryApbn={querydata}
              showModalApbn={showModalApbn}
              thang={data[0].thang}
              closeModalApbn={closeModalpaguapbn}
            />
          )}
          {showModal && (
            <HasilQueryInquiry
              query={querydata}
              showModal={showModal}
              thang={data[0].thang}
              closeModal={closeModalpagureal}
            />
          )}
          {showModalAkumulasi && (
            <HasilQueryAkumulasi
              queryAkumulasi={querydata}
              thang={data[0].thang}
              closeModalAkumulasi={closeakumulasi}
              showModalAkumulasi={showModalAkumulasi}
            />
          )}
          {showModalBulanan && (
            <HasilQueryBulanan
              queryBulanan={querydata}
              thang={data[0].thang}
              showModalBulanan={showModalBulanan}
              closeModalBulanan={closeModalpagu}
            />
          )}
          {showModalBlokir && (
            <HasilQueryBlokir
              queryBlokir={querydata}
              thang={data[0].thang}
              showModalBlokir={showModalBlokir}
              closeModalBlokir={closeModalblokir}
            />
          )}
          {showModalJnsblokir && (
            <HasilQueryJnsblokir
              queryJnsblokir={querydata}
              thang={data[0].thang}
              showModalJnsblokir={showModalJnsblokir}
              closeModalJnsblokir={closeModaljnsblokir}
            />
          )}
          {showTematik && (
            <HasilQueryTematik
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModalTematik}
              showModal={showTematik}
            />
          )}
          {showModalbansos && (
            <HasilQueryBansos
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModalbansos}
              showModal={showModalbansos}
            />
          )}
          {showModaldeviasi && (
            <HasilQueryDeviasi
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModaldeviasi}
              showModal={showModaldeviasi}
            />
          )}
          {showModalKontrak && (
            <HasilQueryKontrak
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModalkontrak}
              showModal={showModalKontrak}
            />
          )}
          {showModalRkakl && (
            <HasilQueryRkakl
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModalrkakl}
              showModal={showModalRkakl}
            />
          )}
          {showModalUp && (
            <HasilQueryUptup
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModalUp}
              showModal={showModalUp}
            />
          )}
          {showModalSPM && (
            <HasilQuerySp2d
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModalSPM}
              showModal={showModalSPM}
            />
          )}
          {showModalSpending && (
            <HasilQuerySpending
              query={querydata}
              thang={data[0].thang}
              closeModal={closeModalSpending}
              showModal={showModalSpending}
            />
          )}

          <table
            className="table table-bordered table-striped table-hover  table-responsive"
            style={{ overflow: "scroll" }}
          >
            <thead className="text-center is-sticky-userlist table-user">
              <tr>
                <th className="col ikpa">NO</th>
                <th className="col ikpa">JENIS</th>
                <th className="col ikpa">NAMA QUERY</th>
                <th className="col ikpa">UPDATED</th>
                <th className="col ikpa">HAPUS</th>
                <th className="col ikpa">GENERATE</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.jenis}</td>
                  <td>{row.nama}</td>
                  <td>{moment(row.createdAt).format("DD-MM-YYYY HH:mm:ss")}</td>
                  <td>
                    {" "}
                    <i
                      className="bi bi-trash fw-bold text-danger mx-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleHapus(row.id)}
                    ></i>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      className="mx-2"
                      onClick={() => handleData(row.id, row.jenis, row.query)}
                    >
                      <i className="bi bi-code-slash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
