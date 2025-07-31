import React, { useState, useEffect, useContext } from "react";
import * as XLSX from "xlsx";
import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";

const ConvertToExcel = ({ sql }) => {
  const { axiosJWT, username, token, telp, name, verified } =
    useContext(MyContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertContent, setAlertContent] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const isButtonDisabled =
    loading || isSent || !data || data.length === 0 || verified !== "TRUE";

  const handleButtonClick = () => {
    if (!isButtonDisabled) {
      generateExcel();
    }
  };

  const getData = async () => {
    setLoading(true);
    const cleanedQuery = decodeURIComponent(sql)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
        }${encryptedQuery}&user=${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dataResult = response.data.result;

      if (dataResult.length === 0) {
        setMessage("Data tidak ditemukan.");
      } else if (dataResult.length > 1000) {
        setMessage("Data terlalu besar. Maksimal 1000 baris.");
      } else {
        setData(dataResult);
      }
    } catch (error) {
      handleHttpError(
        error.response?.status,
        error.response?.data?.error || "Koneksi atau server bermasalah"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateExcel = async () => {
    setLoading(true);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Data Inquiry");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    function generateToken() {
      return Math.floor(Date.now() / 1000); // Get current time in seconds
    }
    try {
      const token = generateToken();
      const formData = new FormData();
      formData.append("file", excelBlob, "inquiry_data_excel_v3.xlsx");
      formData.append("message", `SEND_WA_INQUIRY`);
      formData.append("detailuser", `username : ${username} (${name})`);
      formData.append("to", `62${telp.slice(1)}@c.us`);
      formData.append("nama", name);

      await axios.post(
        `${import.meta.env.VITE_REACT_APP_LOCAL_AKTIVASI}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("File Excel berhasil dikirim ke WhatsApp nomor " + telp);
      setIsSent(true);
    } catch (error) {
      setMessage(
        `Gagal mengirim pesan WhatsApp ke nomor ${telp} \n [detail error] ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <Button
        variant="success"
        size="sm"
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={`btn-loading text-center  w-50 ${
          isButtonDisabled ? "disabled" : ""
        }`}
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Kirim"}
      </Button>

      {message && (
        <Alert
          className="my-3 p-2"
          variant={message.startsWith("Gagal") ? "danger" : "success"}
        >
          {message}
        </Alert>
      )}

      {alertContent && (
        <Alert className="my-3 p-2" variant="warning">
          {alertContent}
        </Alert>
      )}
    </div>
  );
};

export { ConvertToExcel };
