import React, { useState, useEffect, useContext } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Encrypt from "../../../auth/Random";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ConvertToPDF = (props) => {
  const { axiosJWT, username, token, telp, name, verified } =
    useContext(MyContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertContent, setAlertContent] = useState(null); // For JSX content
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

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
      generatePDF();
    }
  };

  const getData = async () => {
    setLoading(true);
    const cleanedQuery = decodeURIComponent(props.sql)
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
        setLoading(false); // Hentikan loading
      } else if (dataResult.length > 300) {
        setMessage("Data terlalu besar. Maksimal 300 baris.");
        setLoading(false); // Hentikan loading
        return; // Hentikan proses lebih lanjut
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
        setLoading(false); // Hentikan loading
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

  const formatNumber = (value) => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return value;
  };
  const generatePDF = async () => {
    setLoading(true);
    const doc = new jsPDF({
      orientation: "landscape",
      format: "a3", // Perbesar ukuran kertas ke A3
    });

    doc.text("Data Inquiry Belanja", 10, 10);

    // Mendapatkan tanggal dan jam sekarang
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const currentDateTime = now.toLocaleDateString("id-ID", options);

    if (data) {
      const headers = Object.keys(data[0]).map((key) => key.toUpperCase());
      const formattedData = data.map((item) => {
        const formattedItem = { ...item };
        [
          "pagu",
          "blokir",
          "realisasi",
          "PAGU",
          "BLOKIR",
          "REALISASI",
          "PAGU_DIPA",
          "PAGU_APBN",
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MEI",
          "JUN",
          "JUL",
          "AGS",
          "SEP",
          "OKT",
          "NOV",
          "DES",
          "VOL",
          "RJAN",
          "PJAN",
          "RPJAN",
          "RFEB",
          "PFEB",
          "RPFEB",
          "RMAR",
          "PMAR",
          "RPMAR",
          "RAPR",
          "PAPR",
          "RPAPR",
          "RMEI",
          "PMEI",
          "RPMEI",
          "RJUN",
          "PJUN",
          "RPJUN",
          "RJUL",
          "PJUL",
          "RPJUL",
          "RAGS",
          "PAGS",
          "RPAGS",
          "RSEP",
          "PSEP",
          "RPSEP",
          "ROKT",
          "POKT",
          "RPOKT",
          "RNOV",
          "PNOV",
          "RPNOV",
          "RDES",
          "PDES",
          "RPDES",
          "PAGU_KONTRAK",
          "REALISASI_KONTRAK",
          "RUPIAH",
          "JML1",
          "REAL1",
          "JML2",
          "REAL2",
          "JML3",
          "REAL3",
          "JML4",
          "REAL4",
          "JML5",
          "REAL5",
          "JML6",
          "REAL6",
          "JML7",
          "REAL7",
          "JML8",
          "REAL8",
          "JML9",
          "REAL9",
          "JML10",
          "REAL10",
          "JML11",
          "REAL11",
          "JML12",
          "REAL12",
          "RENC",
          "RENC1",
          "REAL1",
          "RENC2",
          "REAL2",
          "RENC3",
          "REAL3",
          "RENC4",
          "REAL4",
          "RENC5",
          "REAL5",
          "RENC6",
          "REAL6",
          "RENC7",
          "REAL7",
          "RENC8",
          "REAL8",
          "RENC9",
          "REAL9",
          "RENC10",
          "REAL10",
          "RENC11",
          "REAL11",
          "RENC12",
          "REAL12",
          "VOLKEG",
          "HARGASAT",
          "JUMLAH",
          "INEFISIENSI",
        ].forEach((key) => {
          if (formattedItem[key]) {
            formattedItem[key] = formatNumber(parseFloat(formattedItem[key]));
          }
        });
        return formattedItem;
      });

      const rows = formattedData.map((item) => Object.values(item));

      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
        styles: {
          cellPadding: 3,
          fontSize: 10,
          valign: "middle",
          overflow: "linebreak", // Menjaga header agar tidak terpotong
        },
        headStyles: {
          fillColor: [22, 160, 133], // Warna header lebih rapi
          textColor: [255, 255, 255],
          fontSize: 12, // Ukuran font header lebih besar untuk keterbacaan
        },
        columnStyles: headers.reduce((acc, header, index) => {
          acc[index] = {
            halign: [
              "pagu",
              "blokir",
              "realisasi",
              "PAGU",
              "BLOKIR",
              "REALISASI",
              "PAGU_DIPA",
              "PAGU_APBN",
              "JAN",
              "FEB",
              "MAR",
              "APR",
              "MEI",
              "JUN",
              "JUL",
              "AGS",
              "SEP",
              "OKT",
              "NOV",
              "DES",
              "VOL",
              "RJAN",
              "PJAN",
              "RPJAN",
              "RFEB",
              "PFEB",
              "RPFEB",
              "RMAR",
              "PMAR",
              "RPMAR",
              "RAPR",
              "PAPR",
              "RPAPR",
              "RMEI",
              "PMEI",
              "RPMEI",
              "RJUN",
              "PJUN",
              "RPJUN",
              "RJUL",
              "PJUL",
              "RPJUL",
              "RAGS",
              "PAGS",
              "RPAGS",
              "RSEP",
              "PSEP",
              "RPSEP",
              "ROKT",
              "POKT",
              "RPOKT",
              "RNOV",
              "PNOV",
              "RPNOV",
              "RDES",
              "PDES",
              "RPDES",
              "PAGU_KONTRAK",
              "REALISASI_KONTRAK",
              "RUPIAH",
              "JML1",
              "REAL1",
              "JML2",
              "REAL2",
              "JML3",
              "REAL3",
              "JML4",
              "REAL4",
              "JML5",
              "REAL5",
              "JML6",
              "REAL6",
              "JML7",
              "REAL7",
              "JML8",
              "REAL8",
              "JML9",
              "REAL9",
              "JML10",
              "REAL10",
              "JML11",
              "REAL11",
              "JML12",
              "REAL12",
              "RENC",
              "RENC1",
              "REAL1",
              "RENC2",
              "REAL2",
              "RENC3",
              "REAL3",
              "RENC4",
              "REAL4",
              "RENC5",
              "REAL5",
              "RENC6",
              "REAL6",
              "RENC7",
              "REAL7",
              "RENC8",
              "REAL8",
              "RENC9",
              "REAL9",
              "RENC10",
              "REAL10",
              "RENC11",
              "REAL11",
              "RENC12",
              "REAL12",
              "VOLKEG",
              "HARGASAT",
              "JUMLAH",
              "INEFISIENSI",
            ].includes(header)
              ? "right"
              : "center",
            columnWidth: "auto", // Lebar kolom otomatis sesuai konten
          };
          return acc;
        }, {}),
        margin: { top: 15 }, // Beri margin lebih besar
      });
    }

    // Menambahkan catatan kaki
    const footerText = `Data ini dicetak secara otomatis oleh system pada ${currentDateTime}. Untuk informasi lebih lanjut hubungi helpdesk Sintesa v3 pada Direktorat Pelaksanaan Anggaran, Seksi PDPSIPA.`;

    // Perkecil ukuran font untuk catatan kaki
    doc.setFontSize(8);

    // Memecah teks jika terlalu panjang untuk halaman
    const pageWidth = doc.internal.pageSize.width;
    const textLines = doc.splitTextToSize(footerText, pageWidth - 20); // Memecah teks sesuai lebar halaman dengan margin

    // Menempatkan teks di bagian bawah halaman
    const footerYPosition = doc.internal.pageSize.height - 10;
    doc.text(textLines, 10, footerYPosition);

    const pdfBlob = doc.output("blob");
    function generateToken() {
      return Math.floor(Date.now() / 1000); // Get current time in seconds
    }
    try {
      const token = generateToken();
      const formData = new FormData();
      formData.append("file", pdfBlob, "inquiry_data_pdf_v3.pdf");
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
      setMessage("File PDF berhasil dikirim ke WhatsApp nomor " + telp);
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
        <Alert className="my-3 p-1" variant="warning">
          {alertContent}
        </Alert>
      )}
    </div>
  );
};

export default ConvertToPDF;
