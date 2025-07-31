import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Form,
  Offcanvas,
  Button,
  Col,
  Row,
  Modal,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Swal from "sweetalert2";
import { handleHttpError } from "../notifikasi/toastError";
import Notifikasi from "../notifikasi/notif";
import moment from "moment";

const IkpaForm = ({ show, handleClose, data, isi, updateReload }) => {
  const { axiosJWT, token, kdkanwil, role } = useContext(MyContext);
  const [loadingikpa, setLoadingikpa] = useState(false);
  const [update, setUpdate] = useState("");
  const [formData, setFormData] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    data: data,
    input6: "",
    input7: "",
    input8: "",
    input9: "",
    input10: "",
  });

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
    setLoadingikpa(true);
    e.preventDefault();

    try {
      await axiosJWT.post(
        import.meta.env.VITE_REACT_APP_LOCAL_SIMPANIKPA_CLUSTER,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoadingikpa(false);
      // Swal.fire({
      //   html: `<div className='text-success mt-4'>Data Berhasil Disimpan</div>`,
      //   icon: "success",
      //   position: "top",
      //   buttonsStyling: false,
      //   customClass: {
      //     popup: "swal2-animation",
      //     container: "swal2-animation",
      //     confirmButton: "swal2-confirm ",
      //     icon: "swal2-icon",
      //   },
      //   confirmButtonText: "Tutup",
      // });
      updateReload(true);
      setFormData({
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
        input6: "",
        input7: "",
        input8: "",
        input9: "",
        input10: "",
      });
      handleCloseIkpa();
    } catch (error) {
      console.log(error);
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoadingikpa(false);
    }
  };
  const handleHapus = async (id) => {
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
            `${import.meta.env.VITE_REACT_APP_LOCAL_HAPUSIKPA_CLUSTER}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Notifikasi("Data telah dihapus.");
          updateReload(true);
          setFormData({
            input1: "",
            input2: "",
            input3: "",
            input4: "",
            input5: "",
            input6: "",
            input7: "",
            input8: "",
            input9: "",
            input10: "",
          });
          handleCloseIkpa();
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

  const handleEdit = async (id) => {
    //  console.log(isi);
    function filterDataByIdOutput(isi, id) {
      const filteredData = isi.filter((item) => item.id === id);
      return filteredData;
    }

    const idOutputParameter = id;
    const hasilFilter = filterDataByIdOutput(isi, idOutputParameter);

    const defaultFormData = {
      input1: "",
      input2: "",
      input3: id,
      input4: "",
      input5: "",
      input6: "",
      input7: "",
      input8: "",
      input9: "",
      input10: "",
    };

    const filterItem = (array, index, key) => {
      if (array[index] && array[index][key]) {
        return array[index][key];
      }
      return "";
    };

    const formData = {
      input1: filterItem(hasilFilter, 0, "thang"),
      input2: filterItem(hasilFilter, 0, "nilaiikpa"),
      input3: id,
      input4: filterItem(hasilFilter, 1, "nilaiikpa"),
      input5: filterItem(hasilFilter, 2, "thang"),
      input6: filterItem(hasilFilter, 2, "nilaiikpa"),
      input7: filterItem(hasilFilter, 3, "thang"),
      input8: filterItem(hasilFilter, 3, "nilaiikpa"),
      input9: filterItem(hasilFilter, 4, "thang"),
      input10: filterItem(hasilFilter, 4, "nilaiikpa"),
      data: data,
    };

    const finalFormData = { ...defaultFormData, ...formData };
    setFormData(finalFormData);
  };
  const tutupCanvas = () => {
    setFormData({
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
      input7: "",
      input8: "",
      input9: "",
      input10: "",
    });
  };

  const handleCloseIkpa = () => {
    handleClose();
    tutupCanvas();
  };
  //console.log(loadingikpa);
  return (
    <Offcanvas show={show} onHide={handleCloseIkpa} placement="bottom">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Rekam Data </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ minHeight: "auto" }} className="bg-light">
        <Container fluid>
          <div className="row">
            <div className="col-md-6">
              <Form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group
                      controlId="input1"
                      style={{ marginBottom: "20px" }}
                    >
                      <Form.Label>Tahun </Form.Label>
                      <Form.Control
                        type="text"
                        name="input1"
                        placeholder="tahun ikpa"
                        value={formData.input1}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group
                      controlId="input2"
                      style={{ marginBottom: "20px" }}
                    >
                      <Form.Label>Nilai IKPA</Form.Label>
                      <Form.Control
                        type="number"
                        name="input2"
                        placeholder="nilai ikpa"
                        value={formData.input2}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Button variant="danger" size="sm" type="submit">
                  Simpan
                </Button>
              </Form>
            </div>
            <div className="col-md-6">
              <table className="table table-bordered table-kinerja">
                <thead className="head-kinerja-table">
                  <tr>
                    <th>No</th>
                    <th>Tahun</th>
                    <th>Periode </th>
                    <th>Nilai </th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {isi.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.thang}</td>
                      <td>{item.periode}</td>
                      <td>{item.nilaiikpa}</td>
                      <td>
                        <i
                          className="bi bi-pencil-square text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEdit(item.id)}
                        ></i>{" "}
                        &nbsp;{" "}
                        <i
                          className="bi bi-trash text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleHapus(item.id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-muted my-4 fst-italic">{update}</p>
        </Container>
      </Offcanvas.Body>
      <Modal show={loadingikpa} animation={false} size="md">
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
          <p>menyimpan data...</p>
        </Modal.Body>
      </Modal>
    </Offcanvas>
  );
};

export default IkpaForm;
