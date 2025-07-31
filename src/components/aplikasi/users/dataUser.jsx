import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { useNavigate } from "react-router-dom";
import { Card, Image, Table } from "react-bootstrap";
import "../users/users.css";
import AddUser from "./registerUser";
import { Loading2 } from "../../layout/LoadingTable";
import Notifikasi from "../notifikasi/notif";
import EditUser from "./editUser";
import Swal from "sweetalert2";
import moment from "moment";
import NotifikasiSukses from "../notifikasi/notifsukses";
import { handleHttpError } from "../notifikasi/toastError";

export const DataUsers = () => {
  const { axiosJWT, token, setstatusLogin, statusLogin } =
    useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dataerror, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");

  const handleOpenEditModal = (username) => {
    setSelectedUsername(username);
    setShowEditModal(true);
  };
  //  1. ditpa
  //  2.kanwil
  //  3.kppn
  //  9.dit lain
  //  4.ditlain
  const refRole = [
    {
      kdrole: "X",
      nmrole: "Super Admin",
    },
    {
      kdrole: "0",
      nmrole: "Admin Pusat",
    },
    {
      kdrole: "1",
      nmrole: "Kantor Pusat",
    },
    {
      kdrole: "2",
      nmrole: "Kanwil DJPBN",
    },
    {
      kdrole: "3",
      nmrole: "KPPN",
    },
    {
      kdrole: "4",
      nmrole: "Lainnya",
    },
  ];

  useEffect(() => {
    getData();
  }, [statusLogin]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_USERS
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_USERS}`
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
      setstatusLogin(false);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };
  // console.log(data);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const dataJoin = data.map((endpointItem) => {
    const matchingRefItem = refRole.find(
      (refItem) => refItem.kdrole === endpointItem.role
    );

    if (matchingRefItem) {
      endpointItem.nmrole = matchingRefItem.nmrole;
    }

    return endpointItem; // Mengembalikan objek yang telah dimodifikasi
  });

  const filteredData = dataJoin.filter((row) => {
    const username = row.username ? row.username.toLowerCase() : "";
    const name = row.name ? row.name.toLowerCase() : "";
    const email = row.email ? row.email.toLowerCase() : "";
    const role = row.role ? row.role.toLowerCase() : "";

    return (
      username.includes(searchTerm.toLowerCase()) ||
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      role.includes(searchTerm.toLowerCase())
    );
  });

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
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
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC}user/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");
          getData();
        } catch (error) {
          setstatusLogin(false);
          if (error.response) {
            setError(error.response.data.error);
          } else if (error.request) {
            setError("Sintesa v3 Sedang Offline. Silakan coba kembali nanti.");
          } else {
            setError("Terjadi kesalahan saat memproses permintaan.");
          }
          if (error.request && error.request.status === 404) {
            navigate("/v3/auth/login");
          }
        }
      }
    });
  };
  const handlAktif = async (username, active) => {
    Swal.fire({
      title: "Konfirmasi Aktivasi User",
      text:
        "User ini sedang " +
        (active === "1"
          ? "Aktif, Anda akan set menjadi Non Aktif yang mengakibatkan User tidak bisa akses Sintesa"
          : "Tidak Aktif, setelah aktif User dapat akses Sintesa secara penuh sesuai dengan kewenangan nya"),
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Gassss...",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.patch(
            `${
              import.meta.env.VITE_REACT_APP_LOCAL_AKTIFASI
            }?status=${active}&username=${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          NotifikasiSukses(
            "User sudah di ubah menjadi " +
              (active === "1" ? "Tidak Aktif" : "Aktif")
          );
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
      <AddUser show={showModal} handleClose={handleModalClose} />
      {showEditModal && (
        <EditUser
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          username={selectedUsername}
        />
      )}

      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Manajemen User</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">User</a>
              </li>

              <li className="breadcrumb-item active">Data User</li>
            </ol>
          </nav>
        </div>
        <section className="section fade-in">
          <Card>
            <Card.Body className="data-max">
              <div className="d-flex justify-content-between align-items-center my-3">
                <div className="input-group col-auto">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pencarian Data ..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button
                    className="btn btn-danger btn-sm"
                    type="button"
                    onClick={handleModalShow}
                  >
                    Tambah User
                  </button>
                </div>
              </div>
              {loading ? (
                <>
                  <Loading2 />
                  <br /> <Loading2 />
                  <br /> <Loading2 />
                </>
              ) : (
                <>
                  <Table hover>
                    <thead className="is-sticky-datauser table-user">
                      <tr className="text-center">
                        <th>#</th>
                        <th>Username</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Last Login</th>
                        <th>Verified</th>
                        <th>Status</th>
                        <th>Option</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {filteredData.map((row, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">{row.username}</td>
                          <td>
                            {row.name}

                            {/* {row.url && (
                              <Image
                                src={row.url}
                                alt="no-img"
                                style={{ maxWidth: "20px", maxHeight: "20px" }}
                              ></Image>
                            )}  */}
                          </td>
                          <td>{row.email}</td>
                          <td>
                            {row.nmrole} ({row.role})
                          </td>
                          <td>
                            {moment(row.tgl_login).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )}
                          </td>
                          <td>{row.verified}</td>
                          <td>
                            {row.active === "1" ? (
                              <i
                                className="bi bi-record-fill text-success"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handlAktif(row.username, row.active)
                                }
                              ></i>
                            ) : (
                              <i
                                className="bi bi-record-fill text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handlAktif(row.username, row.active)
                                }
                              ></i>
                            )}
                          </td>
                          <td>
                            <i
                              className="bi bi-pencil-square fw-bold text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleOpenEditModal(row.username)}
                            ></i>{" "}
                            {row.role !== "X" && (
                              <i
                                className="bi bi-trash fw-bold text-danger mx-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleHapus(row.id)}
                              ></i>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Card.Body>
          </Card>
        </section>
      </main>
    </div>
  );
};
