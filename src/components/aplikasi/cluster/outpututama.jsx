import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Form,
  Offcanvas,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import Notifikasi from "../notifikasi/notif";
import moment from "moment";

const OutputUtama = ({ show, handleClose, data, isi, updateReload }) => {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState("");
  const [formData, setFormData] = useState({
    namaoutput: "",
    catatan: "",
    tahun1: "",
    pagu1: "",
    realisasi1: "",
    persen1: "",
    tahun2: "",
    pagu2: "",
    realisasi2: "",
    persen2: "",
    tahun3: "",
    pagu3: "",
    realisasi3: "",
    persen3: "",
    data: data,
    id_output: "",
    idedit1: "",
    idedit2: "",
    idedit3: "",
  });
  // console.log(formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      data,
      [name]: value,
    });
  };
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

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANOUTPUT_CLUSTER,
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
        namaoutput: "",
        catatan: "",
        tahun1: "",
        pagu1: "",
        realisasi1: "",
        persen1: "",
        tahun2: "",
        pagu2: "",
        realisasi2: "",
        persen2: "",
        tahun3: "",
        pagu3: "",
        realisasi3: "",
        persen3: "",
        id_output: "",
        idedit1: "",
        idedit2: "",
        idedit3: "",
      });
      setLoading(false);
      handleCloseOutput();
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

  const uniqueValues = isi.reduce((acc, curr) => {
    const found = acc.find((item) => item.id_output === curr.id_output);
    if (!found) {
      acc.push({
        namaoutput: curr.namaoutput,
        catatan: curr.catatan,
        id_output: curr.id_output,
        idedit: curr.idedit,
      });
    }
    return acc;
  }, []);

  const handleHapus = async (id_output) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";

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
              import.meta.env.VITE_REACT_APP_LOCAL_HAPUSOUTPUT_CLUSTER
            }/${id_output}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");
          updateReload(true);
          setFormData({
            namaoutput: "",
            catatan: "",
            tahun1: "",
            pagu1: "",
            realisasi1: "",
            persen1: "",
            tahun2: "",
            pagu2: "",
            realisasi2: "",
            persen2: "",
            tahun3: "",
            pagu3: "",
            realisasi3: "",
            persen3: "",
            id_output: "",
            idedit1: "",
            idedit2: "",
            idedit3: "",
          });
          handleCloseOutput();
        } catch (error) {
          // console.log(error);
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

  const handleEdit = async (id_output, idedit) => {
    function filterDataByIdOutput(isi, idOutput) {
      const filteredData = isi.filter((item) => item.id_output === idOutput);
      return filteredData;
    }

    const idOutputParameter = id_output;
    const hasilFilter = filterDataByIdOutput(isi, idOutputParameter);

    const defaultFormData = {
      namaoutput: "",
      catatan: "",
      tahun1: "",
      pagu1: "",
      realisasi1: "",
      persen1: "",
      tahun2: "",
      pagu2: "",
      realisasi2: "",
      persen2: "",
      tahun3: "",
      pagu3: "",
      realisasi3: "",
      persen3: "",
      data: data,
      id_output: id_output,
      idedit1: "",
      idedit2: "",
      idedit3: "",
    };

    const filterItem = (array, index, key) => {
      if (array[index] && array[index][key]) {
        return array[index][key];
      }
      return "";
    };

    const formData = {
      namaoutput: filterItem(hasilFilter, 0, "namaoutput"),
      catatan: filterItem(hasilFilter, 0, "catatan"),
      tahun1: filterItem(hasilFilter, 0, "tahun"),
      pagu1: filterItem(hasilFilter, 0, "pagu"),
      realisasi1: filterItem(hasilFilter, 0, "realisasi"),
      persen1: filterItem(hasilFilter, 0, "persen"),
      tahun2: filterItem(hasilFilter, 1, "tahun"),
      pagu2: filterItem(hasilFilter, 1, "pagu"),
      realisasi2: filterItem(hasilFilter, 1, "realisasi"),
      persen2: filterItem(hasilFilter, 1, "persen"),
      tahun3: filterItem(hasilFilter, 2, "tahun"),
      pagu3: filterItem(hasilFilter, 2, "pagu"),
      realisasi3: filterItem(hasilFilter, 2, "realisasi"),
      persen3: filterItem(hasilFilter, 2, "persen"),
      data: data,
      id_output: id_output,
      idedit1: filterItem(hasilFilter, 0, "idedit"),
      idedit2: filterItem(hasilFilter, 1, "idedit"),
      idedit3: filterItem(hasilFilter, 2, "idedit"),
    };

    const finalFormData = { ...defaultFormData, ...formData };
    setFormData(finalFormData);
  };
  const tutupCanvas = () => {
    setFormData({
      namaoutput: "",
      catatan: "",
      tahun1: "",
      pagu1: "",
      realisasi1: "",
      persen1: "",
      tahun2: "",
      pagu2: "",
      realisasi2: "",
      persen2: "",
      tahun3: "",
      pagu3: "",
      realisasi3: "",
      persen3: "",
      id_output: "",
      idedit: "",
    });
  };

  const handleCloseOutput = () => {
    handleClose();
    tutupCanvas();
  };
  // console.log(loading);
  return (
    <Offcanvas show={show} onHide={handleCloseOutput} placement="top">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Rekam Data</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ minHeight: "750px" }} className="bg-light">
        <Container fluid>
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <Form.Group
                  controlId="namaoutput"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Nama Output</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="namaoutput"
                    placeholder="Masukkan teks di sini..."
                    value={formData.namaoutput}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group
                  controlId="catatan"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Keterangan </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="catatan"
                    placeholder="Masukkan teks di sini..."
                    value={formData.catatan}
                    onChange={handleInputChange}
                    style={{ height: "100px" }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <Form.Group controlId="tahun1" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tahun</Form.Label>
                  <Form.Control
                    type="text"
                    name="tahun1"
                    placeholder="Masukkan teks di sini..."
                    value={formData.tahun1}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group controlId="pagu1" style={{ marginBottom: "20px" }}>
                  <Form.Label>Pagu</Form.Label>
                  <Form.Control
                    type="text"
                    name="pagu1"
                    maxLength="5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.pagu1}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group
                  controlId="realisasi1"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Realisasi</Form.Label>
                  <Form.Control
                    type="text"
                    name="realisasi1"
                    maxLength="5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.realisasi1}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group
                  controlId="persen1"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Persen</Form.Label>
                  <Form.Control
                    type="text"
                    name="persen1"
                    maxLength="6"
                    placeholder="Masukkan teks di sini..."
                    value={formData.persen1}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group controlId="tahun2" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tahun</Form.Label>
                  <Form.Control
                    type="text"
                    name="tahun2"
                    placeholder="Masukkan teks di sini..."
                    value={formData.tahun2}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group controlId="pagu2" style={{ marginBottom: "20px" }}>
                  <Form.Label>Pagu</Form.Label>
                  <Form.Control
                    type="text"
                    name="pagu2"
                    maxLength="5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.pagu2}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group
                  controlId="realisasi2"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Realisasi</Form.Label>
                  <Form.Control
                    type="text"
                    name="realisasi2"
                    maxLength="5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.realisasi2}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group
                  controlId="persen2"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Persen</Form.Label>
                  <Form.Control
                    type="text"
                    name="persen2"
                    maxLength="6"
                    placeholder="Masukkan teks di sini..."
                    value={formData.persen2}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group controlId="tahun3" style={{ marginBottom: "20px" }}>
                  <Form.Label>Tahun</Form.Label>
                  <Form.Control
                    type="text"
                    name="tahun3"
                    placeholder="Masukkan teks di sini..."
                    value={formData.tahun3}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group controlId="pagu3" style={{ marginBottom: "20px" }}>
                  <Form.Label>Pagu</Form.Label>
                  <Form.Control
                    type="text"
                    name="pagu3"
                    maxLength="5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.pagu3}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group
                  controlId="realisasi3"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Realisasi</Form.Label>
                  <Form.Control
                    type="text"
                    name="realisasi3"
                    maxLength="5"
                    placeholder="Masukkan teks di sini..."
                    value={formData.realisasi3}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group
                  controlId="persen3"
                  style={{ marginBottom: "20px" }}
                >
                  <Form.Label>Persen</Form.Label>
                  <Form.Control
                    type="text"
                    name="persen3"
                    maxLength="6"
                    placeholder="Masukkan teks di sini..."
                    value={formData.persen3}
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
                <th>Nama Output</th>
                <th>Keterangan </th>
                <th>Hapus</th>
              </tr>
            </thead>
            <tbody>
              {uniqueValues.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.namaoutput}</td>
                  <td>{item.catatan}</td>
                  <td>
                    <i
                      className="bi bi-pencil-square text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(item.id_output, item.idedit)}
                    ></i>{" "}
                    &nbsp;{" "}
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleHapus(item.id_output)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted my-4 fst-italic">{update}</p>
        </Container>
      </Offcanvas.Body>
      <Modal show={loading} animation={false} size="md">
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
          <p>menyimpan data...</p>
        </Modal.Body>
      </Modal>
    </Offcanvas>
  );
};

export default OutputUtama;
