import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import MyContext from "../../../../auth/Context";
import InputIsu from "../isu/inputIsu";
import { handleHttpError } from "../../notifikasi/toastError";
import { EPANOTIF, NotifPesan, Omspan } from "../../notifikasi/Omspan";

const IsuSpesifik = ({ show, onHide, text, onSave, data }) => {
  const { axiosJWT, token, dataEpa } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isuData, setIsuData] = useState([{ id: 1, issue: "", error: false }]);
  const [errorMessage, setErrorMessage] = useState("");
  // console.log(dataEpa);

  // Reset data saat modal dibuka/tutup
  useEffect(() => {
    if (show) {
      if (text && Array.isArray(text.isu)) {
        setIsuData(
          text.isu.map((isu, index) => ({
            id: index + 1,
            issue: isu,
            error: false,
          }))
        );
      } else {
        setIsuData([{ id: 1, issue: "", error: false }]);
      }
      setErrorMessage("");
    }
  }, [show, text]);

  const handleSaveData = (newData) => {
    setIsuData(newData);
  };

  const validateInputs = () => {
    const updatedInputs = isuData.map((input) => ({
      ...input,
      error: input.issue.trim() === "",
    }));
    setIsuData(updatedInputs);

    const hasError = updatedInputs.some((input) => input.error);
    setErrorMessage(hasError ? "Isu tidak boleh kosong!" : "");
    return !hasError;
  };

  const handleSave = async () => {
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        isu: isuData.map((item) => item.issue),
        data: dataEpa,
      };

      const response = await axiosJWT.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_SIMPANUBAH_EPA}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // console.log("Data berhasil disimpan");
        onSave(isuData);
        EPANOTIF("Data Berhasil Disimpan");
        setErrorMessage(""); // Reset error message
        onHide(); // Tutup modal setelah sukses
      } else {
        setErrorMessage("Terjadi kesalahan saat menyimpan data.");
      }
    } catch (error) {
      console.error("Terjadi kesalahan: ", error);
      setErrorMessage("Terjadi kesalahan jaringan atau server.");
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
      size="xl"
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h5>Rekam Isu Spesifik</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} */}
        <InputIsu initialData={isuData} onSaveData={handleSaveData} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="md" onClick={onHide}>
          Batal
        </Button>
        <Button
          variant="success"
          size="md"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IsuSpesifik;
