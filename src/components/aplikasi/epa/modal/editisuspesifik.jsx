import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import { EPANOTIF } from "../../notifikasi/Omspan";
import EditIsu from "../isu/editisu";

const EditIsuSpesifik = ({ show, onHide, text, onSaveEdit }) => {
  const { axiosJWT, token, dataEpa } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isuDataEdit, setIsuDataEdit] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false); // State untuk fullscreen

  useEffect(() => {
    if (show) {
      if (Array.isArray(text)) {
        setIsuDataEdit(text.map((item) => item.isu || ""));
      } else {
        setIsuDataEdit([""]);
      }
    }
  }, [show, text]);

  const handleSaveEditData = (newData) => {
    setIsuDataEdit(newData);
  };

  const validateInputs = () => {
    return !isuDataEdit.some((isu) => isu.trim() === "");
  };

  const handleSaveEdit = async () => {
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        isu: isuDataEdit, // Hanya array string, bukan array objek
        data: dataEpa,
        keyId: text[0]?.keyId, // Menggunakan optional chaining untuk menghindari error
      };

      // console.log(payload);

      const response = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_SIMPANUBAH_EPA_EDIT}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        onSaveEdit(isuDataEdit);
        EPANOTIF("Data Berhasil Diubah");
        onHide();
      }
    } catch (error) {
      handleHttpError("Terjadi kesalahan: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      size={isFullscreen ? "fullscreen" : "xl"}
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>Edit Isu Spesifik</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditIsu
          initialData={isuDataEdit}
          onSaveDataEdit={handleSaveEditData}
          isFullscreen={isFullscreen} // Kirim status fullscreen ke textarea
        />
        <Form.Check
          type="checkbox"
          label="Layar Penuh"
          checked={isFullscreen}
          onChange={() => setIsFullscreen(!isFullscreen)}
          className="ms-3"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="md" onClick={onHide}>
          Batal
        </Button>
        <Button
          variant="success"
          size="md"
          onClick={handleSaveEdit}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Ubah"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditIsuSpesifik;
