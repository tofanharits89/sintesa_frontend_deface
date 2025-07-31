import React, { useContext, useState, useEffect } from "react";
import { Button, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BiPencil, BiTrash } from "react-icons/bi"; // Ikon Edit & Hapus
import MyContext from "../../../../auth/Context";
import CustomModal from "./modalRekam";
import datadept from "../../../../data/Kddept.json";
import "./tableEpa.css";
import ModalEditData from "./modalEdit";
import { BiRefresh } from "react-icons/bi";

const LandingAnalisa = () => {
  const { axiosJWT, token, dataEpa, setDataEpa } = useContext(MyContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  const [showModalRekam, setShowModalRekam] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (item) => {
    setEditData(item);
    setShowModalEdit(true);
  };

  const handleRekam = () => {
    setEditData(null);
    setShowModalRekam(true);
  };

  const getNmdept = (kddept) => {
    const found = datadept.find((dept) => dept.kddept === kddept);
    return found ? found.nmdept : "-";
  };

  useEffect(() => {
    if (dataEpa.kddept) {
      setDataEpa((prev) => ({
        ...prev,
        nmdept: getNmdept(dataEpa.kddept),
      }));
    }
  }, [dataEpa.kddept, setDataEpa]);

  useEffect(() => {
    if (!dataEpa.kddept) {
      const timer = setTimeout(() => {
        navigate("../v3/epa/landing");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dataEpa.kddept, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_ANALISAEPA}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const processedData = response.data.map((item) => ({
        ...item,
        kategori: item.kategori ? JSON.parse(item.kategori) : [],
      }));

      setData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setReloading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const handleDelete = async (id) => {
  //   if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
  //     try {
  //       await axiosJWT.delete(
  //         `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANG_ANALISAEPA}/${id}`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       fetchData();
  //       alert("Data berhasil dihapus");
  //     } catch (error) {
  //       console.error("Error deleting data:", error);
  //       alert("Gagal menghapus data");
  //     }
  //   }
  // };

  return (
    <Container fluid>
      <main id="main" className="main" style={{ marginBottom: "100px" }}>
        <div className="pagetitle d-flex justify-content-between align-items-center">
          <h1>Evaluasi Pelaksanaan Anggaran</h1>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setReloading(true);
              fetchData();
            }}
            disabled={reloading}
          >
            {reloading ? (
              <>
                <BiRefresh size={18} className="spin" />
                <span className="ms-1">Memuat...</span>
              </>
            ) : (
              <>
                <BiRefresh size={18} />
                <span className="ms-1">Reload</span>
              </>
            )}
          </Button>
        </div>
        <div className=" d-flex justify-content-between align-items-center">
          <Button
            variant="success"
            size="sm"
            className="mb-2 mt-3"
            onClick={handleRekam}
          >
            Rekam Analisa
          </Button>

          <span className="text-muted fst-italic">
            updated: 2021-09-30 oleh user abc
          </span>
        </div>
        <CustomModal
          show={showModalRekam}
          onHide={() => setShowModalRekam(false)}
          title="Rekam Analisa EPA"
          onDataUpdate={fetchData}
        />

        <ModalEditData
          show={showModalEdit}
          onHide={() => setShowModalEdit(false)}
          title="Edit Analisa EPA"
          onDataUpdate={fetchData}
          editData={editData}
        />

        {loading ? (
          <>
            {" "}
            <hr />
            <p className="text-center mt-3">Loading data...</p>
          </>
        ) : data.length === 0 ? (
          <>
            <hr />
            <p className="text-center mt-3">Data tidak tersedia</p>
          </>
        ) : (
          <div className="table-container">
            <Table bordered hover className="epa-table">
              <thead className="table-dark">
                <tr>
                  <th rowSpan={2}>Poin</th>
                  <th rowSpan={2}>Subpoin</th>
                  <th rowSpan={2}>K/L</th>
                  <th rowSpan={2}>Program</th>
                  <th rowSpan={2}>RO</th>
                  <th colSpan={6} className="text-center">
                    Klaster Tantangan/ Hambatan
                  </th>
                  <th colSpan={3} className="text-center">
                    Analisis
                  </th>
                  <th rowSpan={2}>Rencana Aksi</th>
                  <th rowSpan={2}>Deadline</th>
                  <th rowSpan={2}>Status</th>
                  <th rowSpan={2}>Approval</th>
                  <th rowSpan={2}>Edit</th>
                </tr>
                <tr>
                  <th>Penganggaran</th>
                  <th>PBJ</th>
                  <th>Eksekusi Kegiatan</th>
                  <th>Regulasi</th>
                  <th>SDM</th>
                  <th>Permasalahan Hukum</th>
                  <th>Urgency</th>
                  <th>Seriousness</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(
                  data.reduce((acc, item, index) => {
                    const pointKey = item.selectedPoint;
                    if (!acc[pointKey]) {
                      acc[pointKey] = {
                        header: (
                          <tr
                            key={`header-${pointKey}`}
                            className="table-primary"
                          >
                            <td
                              colSpan={19}
                              style={{ fontWeight: "bold", textAlign: "start" }}
                            >
                              {item.nmpoint} ({item.selectedPoint || "-"})
                            </td>
                          </tr>
                        ),
                        rows: [],
                      };
                    }

                    acc[pointKey].rows.push(
                      <tr key={index}>
                        <td>{item.selectedPoint || "-"}</td>
                        <td>
                          {item.nmsubpoint} ({item.selectedSubPoint || "-"})
                        </td>
                        <td>
                          {getNmdept(item.kddept)} ({item.kddept})
                        </td>
                        <td>{item.selectedProgram || "-"}</td>
                        <td>{item.selectedRo || "-"}</td>
                        <td>
                          {item.kategori.includes("Penganggaran") ? "✓" : "-"}
                        </td>
                        <td>{item.kategori.includes("PBJ") ? "✓" : "-"}</td>
                        <td>
                          {item.kategori.includes("Eksekusi Kegiatan")
                            ? "✓"
                            : "-"}
                        </td>
                        <td>
                          {item.kategori.includes("Regulasi") ? "✓" : "-"}
                        </td>
                        <td>{item.kategori.includes("SDM") ? "✓" : "-"}</td>
                        <td>
                          {item.kategori.includes("Permasalahan Hukum")
                            ? "✓"
                            : "-"}
                        </td>
                        <td>{item.urgency || "-"}</td>
                        <td>{item.seriousness || "-"}</td>
                        <td>{item.growth || "-"}</td>
                        <td>{item.rencanaAksi || "-"}</td>
                        <td>{item.deadline || "-"}</td>
                        <td>{item.status || "-"}</td>
                        <td>{item.approval || "-"}</td>
                        <td className="text-center">
                          <BiPencil
                            size={15}
                            style={{ cursor: "pointer" }}
                            color="blue"
                            onClick={() => handleEdit(item)}
                          />

                          {/* <BiTrash
                            size={15}
                            color="red"
                            onClick={() => handleDelete(item.id)}
                          /> */}
                        </td>
                      </tr>
                    );

                    return acc;
                  }, {})
                ).flatMap((group) => [group.header, ...group.rows])}
              </tbody>
            </Table>
          </div>
        )}
      </main>
    </Container>
  );
};

export default LandingAnalisa;
