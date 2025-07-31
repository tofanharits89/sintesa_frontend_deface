import React, { useState, useEffect, useContext } from "react";

import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ConvertToJSON = ({ sql }) => {
  const { axiosJWT, username, token, telp, name, verified } =
    useContext(MyContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertContent, setAlertContent] = useState(null); // For JSX content
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const isButtonDisabled =
    loading ||
    isSent ||
    !data ||
    data.length === 0 ||
    verified === "FALSE" ||
    verified === "";

  const handleButtonClick = () => {
    if (!isButtonDisabled) {
      generateJSON();
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
        import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataResult = response.data.result;

      if (dataResult.length === 0 && verified === "TRUE") {
        setMessage("Data tidak ditemukan.");
        setLoading(false);
      } else if (dataResult.length > 300000) {
        setMessage("Data terlalu besar. Maksimal 300.000 baris.");
        setLoading(false);
        return;
      }

      if (verified === "FALSE" || verified === "") {
        setAlertContent(
          <>
            Sintesa v3 tidak bisa mengirimkan data saat akun anda belum
            dilakukan aktifasi, tambahkan nomor telepon yang terhubung dengan
            WhatsApp di <Link to="/v3/profile/user">sini</Link>.<br /> Apabila
            terjadi kendala saat verifikasi akun silahkan mengunjungi pusat
            bantuan kami di <Link to="/v3/about/feedback">sini.</Link>
          </>
        );
        setLoading(false);
      }

      setData(dataResult);
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

  const generateJSON = async () => {
    setLoading(true);
    function generateToken() {
      return Math.floor(Date.now() / 1000); // Get current time in seconds
    }
    const token = generateToken();
    // Mengonversi data ke format JSON
    const jsonData = JSON.stringify(data, null, 2);

    // Membuat Blob dari string JSON
    const jsonBlob = new Blob([jsonData], {
      type: "application/json",
    });

    try {
      const formData = new FormData();
      formData.append("file", jsonBlob, "inquiry_data_json_v3.json");
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
      setMessage("File JSON berhasil dikirim ke WhatsApp nomor " + telp);
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
        variant="primary"
        size="sm"
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={`btn-loading text-center  w-50 ${
          isButtonDisabled ? "disabled" : ""
        }`}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mr-2 mx-2"
            />
            Loading...
          </>
        ) : (
          "Kirim"
        )}
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

export default ConvertToJSON;
