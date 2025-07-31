import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Form,
  Offcanvas,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import Notifikasi from "../notifikasi/notif";
import moment from "moment";

const Temuan = ({ show, handleClose, data, isi, updateReload }) => {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);
  const [loadingtemuan, setLoadingtemuan] = useState(false);
  const [update, setUpdate] = useState("");
  const [formData, setFormData] = useState({
    temuan: "",
    nilai: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    data: data,
    idedit: "",
    idedit1: "",
    idedit2: "",
    idedit3: "",
    idedit4: "",
  });

  useEffect(() => {
    if (isi.length > 0) {
      const item = isi[0];
      const formattedDate = moment(item.createdAt).format(
        "DD/MM/YYYY hh:mm:ss"
      );
      setUpdate(
        `diupdate terakhir oleh user  ${item.username} tanggal ${formattedDate}`
      );
    }
  }, [isi]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setLoadingtemuan(true);
    e.preventDefault();

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANTEMUANBPK_CLUSTER,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      updateReload(true);

      setFormData({
        temuan: "",
        nilai: "",
        input3: "",
        input4: "",
        input5: "",
        input6: "",
        data: data,
        idedit: "",
        idedit1: "",
        idedit2: "",
        idedit3: "",
        idedit4: "",
      });
      setLoadingtemuan(false);
      handleCloseOutput();
      // Notifikasi("Data berhasil disimpan.");
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi permasalahan koneksi atau server backend"
      );

      setLoadingtemuan(false);
    }
  };

  const uniqueValues = isi.reduce((acc, curr) => {
    const found = acc.find((item) => item.id_temuan === curr.id_temuan);
    if (!found) {
      acc.push({
        temuan: curr.temuan,
        nilai: curr.nilai,
        id_temuan: curr.id_temuan,
        iddetailtemuan: curr.iddetailtemuan,
      });
    }
    return acc;
  }, []);

  const handleHapus = async (id) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";

    try {
      const result = await Swal.fire({
        title: "Konfirmasi Hapus",
        html: confirmText,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        position: "top",
      });

      if (result.isConfirmed) {
        await axiosJWT.delete(
          `${import.meta.env.VITE_REACT_APP_LOCAL_HAPUSTEMUAN_CLUSTER}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Notifikasi("Data telah dihapus.");
        updateReload(true);
        handleCloseOutput();
      }
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi permasalahan koneksi atau server backend"
      );
    }
  };

  const handleEdit = async (id_temuan) => {
    setLoadingtemuan(true);
    function filterDataByIdOutput(isi, id_temuan) {
      const filteredData = isi.filter((item) => item.id_temuan === id_temuan);
      return filteredData;
    }

    const idOutputParameter = id_temuan;
    const hasilFilter = filterDataByIdOutput(isi, idOutputParameter);

    const defaultFormData = {
      temuan: "",
      nilai: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
      idedit: "",
      data: data,
      idedit1: "",
      idedit2: "",
      idedit3: "",
      idedit4: "",
    };

    const filterItem = (array, index, key) => {
      if (array[index] && array[index][key]) {
        return array[index][key];
      }
      return "";
    };

    const formData = {
      temuan: filterItem(hasilFilter, 0, "temuan"),
      nilai: filterItem(hasilFilter, 0, "nilai"),
      input3: filterItem(hasilFilter, 0, "isu"),
      input4: filterItem(hasilFilter, 1, "isu"),
      input5: filterItem(hasilFilter, 2, "isu"),
      input6: filterItem(hasilFilter, 3, "isu"),
      idedit: id_temuan,
      data: data,
      idedit1: filterItem(hasilFilter, 0, "iddetailtemuan"),
      idedit2: filterItem(hasilFilter, 1, "iddetailtemuan"),
      idedit3: filterItem(hasilFilter, 2, "iddetailtemuan"),
      idedit4: filterItem(hasilFilter, 3, "iddetailtemuan"),
    };

    const finalFormData = { ...defaultFormData, ...formData };
    setFormData(finalFormData);
    setLoadingtemuan(false);
  };
  const tutupCanvas = () => {
    setFormData({
      temuan: "",
      nilai: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
      idedit: "",
      idedit1: "",
      idedit2: "",
      idedit3: "",
      idedit4: "",
    });
  };

  const handleCloseOutput = () => {
    handleClose();
    tutupCanvas();
  };
  return (
    <Offcanvas show={show} onHide={handleCloseOutput} placement="top">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Rekam Data</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ minHeight: "550px" }} className="bg-light">
        <Container fluid>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <Form.Group controlId="temuan" style={{ marginBottom: "20px" }}>
                  <Form.Label>Temuan BPK</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="temuan"
                    placeholder="Masukkan teks di sini..."
                    value={formData.temuan}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group controlId="nilai" style={{ marginBottom: "20px" }}>
                  <Form.Label>Nilai</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="nilai"
                    placeholder="Masukkan teks di sini..."
                    value={formData.nilai}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group controlId="input3" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tindak Lanjut</Form.Label>
                  <Form.Control
                    type="text"
                    name="input3"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input3}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="input4" style={{ marginBottom: "20px" }}>
                  <Form.Control
                    type="text"
                    name="input4"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input4}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="input5" style={{ marginBottom: "20px" }}>
                  <Form.Control
                    type="text"
                    name="input5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input5}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="input6" style={{ marginBottom: "20px" }}>
                  <Form.Control
                    type="text"
                    name="input6"
                    placeholder="Masukkan teks di sini..."
                    value={formData.input6}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Button variant="danger" size="sm" type="submit">
              Simpan
            </Button>
          </Form>
          <hr />

          <table className="table table-bordered table-kinerja">
            <thead className="head-kinerja-table">
              <tr>
                <th>No</th>
                <th>Temuan BPK</th>
                <th>Nilai </th>
                <th>Hapus</th>
              </tr>
            </thead>
            <tbody>
              {uniqueValues.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.temuan}</td>
                  <td>{item.nilai}</td>
                  <td>
                    <i
                      className="bi bi-pencil-square text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleEdit(item.id_temuan, item.iddetailtemuan)
                      }
                    ></i>{" "}
                    &nbsp;{" "}
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleHapus(item.id_temuan)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted my-4 fst-italic">{update}</p>
        </Container>
      </Offcanvas.Body>

      <Modal show={loadingtemuan} animation={false} size="md">
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>loading...</p>
          <p>menyimpan data...</p>
        </Modal.Body>
      </Modal>
    </Offcanvas>
  );
};

export default Temuan;
