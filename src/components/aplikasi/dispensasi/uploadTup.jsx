import React, { useState, useContext, useEffect } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import Notifikasi from "../notifikasi/notif";
import { handleHttpError } from "../notifikasi/toastError";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import NotifikasiSukses from "../notifikasi/notifsukses";

const UploadTup = (props) => {
  const { axiosJWT, token, url } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState(null);
  const [processSuccess, setProcessSuccess] = useState(null);
  const expectedColumns = ["tgtup", "notup", "niltup"]; // Header yang diharapkan
  const maxRows = 200;
  const [formData, setFormData] = useState([]);
  const [fileName, setFileName] = useState("Pilih File Excell");
  const [formatDispen, setFormatDispen] = useState("Template Excel");
  useEffect(() => {
    props.cekupload && getData();
  }, [props.cekupload, props.id]);

  const getData = async () => {
    const encodedQuery = encodeURIComponent(
      `SELECT id,thang,kddept,kdunit,kdkanwil,kdlokasi,kdsatker,tgpermohonan,nopermohonan FROM  laporan_2023.dispensasi_tup WHERE id='${props.id}' GROUP BY id`
    );
    const encryptedQuery = Encrypt(encodedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_INQUIRY_GETDATA
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData(response.data);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const fileUrl = `${
    import.meta.env.VITE_REACT_APP_LOCAL_FORMATDISPEN
  }/format_dispen/format_dispen_tup.xlsx`;
  // console.log(fileUrl);

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const handleFileUpload = (e) => {
    setLoading(true);
    setError(null);
    const file = e.target.files[0];
    setFileName(file.name); // Set nama file yang dipilih
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Validasi header
      const headers = Object.keys(jsonData[0]);
      if (!expectedColumns.every((col, idx) => col === headers[idx])) {
        setError(
          `Header tidak sesuai. Susunan kolom: ${expectedColumns.join(", ")}`
        );
        setLoading(false);
        setData([]);
        return;
      }

      // Validasi jumlah kolom
      if (jsonData.length > 0 && headers.length !== expectedColumns.length) {
        setError(`Jumlah kolom [${headers.length}] tidak sesuai format`);
        setLoading(false);
        setData([]);
        return;
      }

      // Validasi jumlah baris
      if (jsonData.length > maxRows) {
        setError(
          `Jumlah baris [${jsonData.length}] maksimal 200 baris yang diizinkan`
        );
        setLoading(false);
        setData([]);
        return;
      }

      // Validasi format tanggal pada kolom tgtup
      const invalidRows = jsonData.filter((row) => !isValidDate(row.tgtup));
      if (invalidRows.length > 0) {
        setError("Data pada kolom tgtup harus berformat tanggal (yyyy-mm-dd).");
        setLoading(false);
        setData([]);
        return;
      }

      setData(jsonData);
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleProcessData = () => {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin ingin upload data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Upload Data",
      cancelButtonText: "Batal",
      position: "top",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosJWT.post(
            `${
              import.meta.env.VITE_REACT_APP_LOCAL_BASIC
            }dispensasi/uploadtup/`,
            { ...formData, data },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          NotifikasiSukses("Data berhasil di Upload.");
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
    <Container fluid>
      <Row>
        <Col md="12" className="my-1 mb-3 text-danger fw-bold">
          *) Catatan :<br /> 1. Excel berisi 3 kolom (tgtup | notup | niltup)
          <br />
          2. Maksimal 200 baris data per upload
          <br /> 3. Baris header diabaikan <br /> 4. Gunakan format TEXT pada
          setiap kolom, apabila mengandung angka hilangkan koma atau titik
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="12">
          <Form>
            <Col md="3">
              <Form.Group
                controlId="formFile"
                className="mb-3 d-flex justify-content-between"
              >
                <Button
                  onClick={() => (window.location.href = fileUrl)}
                  className="btn btn-danger"
                >
                  {formatDispen}
                </Button>

                <label htmlFor="file-upload" className="btn btn-primary">
                  {fileName}
                </label>

                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  id="file-upload"
                  style={{ display: "none" }} // Sembunyikan input file asli
                />
              </Form.Group>
            </Col>
          </Form>
          {loading && (
            <div className="d-flex justify-content-center mt-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading data...</span>
              </Spinner>
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && data.length > 0 && (
            <div style={{ height: "200px", overflowY: "scroll" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((cell, i) => (
                        <td key={i}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Col>
      </Row>
      {data.length > 0 && (
        <div className="my-1 d-flex justify-content-between my-2 mt-4">
          Jumlah data : {data.length}
          <Button
            variant="danger"
            className="my-1 mx-1 fade-in"
            onClick={handleProcessData}
            disabled={processing}
          >
            {processing ? (
              <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Processing...</span>
              </Spinner>
            ) : (
              "Upload Data"
            )}
          </Button>
        </div>
      )}
      {processSuccess && <Alert variant="success">{processSuccess}</Alert>}
      {processError && <Alert variant="danger">{processError}</Alert>}
    </Container>
  );
};

export default UploadTup;
