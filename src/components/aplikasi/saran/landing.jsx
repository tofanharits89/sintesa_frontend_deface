import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import "./FormKritik.css";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";

const saveImageToServer = async (
  values,
  token,
  loading,
  setLoading,
  axiosJWT,
  setTerkirim
) => {
  setLoading(true);
  setTerkirim(true);
  const apiUrl = import.meta.env.VITE_REACT_APP_LOCAL_BUG;

  let headers = {
    Authorization: `Bearer ${token}`,
  };

  if (values.kategori === "saran") {
    headers["Content-type"] = "application/json";
  } else {
    headers["Content-type"] = "multipart/form-data";
  }

  try {
    const response = await axiosJWT.post(apiUrl, values, {
      headers: headers,
    });
  } catch (error) {
    setLoading(false);
    setTerkirim(false);
    const { status, data } = error.response || {};
    handleHttpError(
      status,
      (data && data.error) || "Terjadi Permasalahan Koneksi atau Server Backend"
    );
  } finally {
    setLoading(false);
    setTerkirim(false);
  }
};

const FormKritik = ({ onSubmit }) => {
  const [pilihGambar, setPilihGambar] = useState("");
  const { axiosJWT, token, username, name } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [terkirim, setTerkirim] = useState(false);

  const validationSchema = Yup.object().shape({
    kategori: Yup.string().required("Harap pilih kategori."),
    kritik: Yup.string().required("Harap masukkan kritik atau saran."),
    jenisKritik: Yup.string().when("kategori", {
      is: (value) => value === "kritik",
      then: () => Yup.string().required("Jenis Permasalahan harus diisi"),
      otherwise: () => Yup.string(),
    }),

    file: Yup.string().when("kategori", {
      is: (value) => value !== "saran",
      then: () =>
        Yup.mixed()
          .required("file harus dipilih")
          .test(
            "fileSize",
            "Ukuran file terlalu besar (maks 10MB)",
            (value) => {
              if (!value) return true;
              return value.size <= 10000000;
            }
          )
          .test("fileType", "Tipe file tidak valid (hanya gambar)", (value) => {
            if (!value) return true;
            return value.type.startsWith("image/");
          }),
    }),
  });

  const formik = useFormik({
    initialValues: {
      kritik: "",
      kategori: "",
      jenisKritik: "",
      dari: username,
      destination: "XX",
      nama: name,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await saveImageToServer(
          values,
          token,
          loading,
          setLoading,
          axiosJWT,
          setTerkirim
        );
        formik.resetForm();
        onSubmit(values);
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const onDrop = (acceptedFiles) => {
    formik.setFieldValue("file", acceptedFiles[0]);
    setPilihGambar(acceptedFiles.length > 0 ? "gas" : ""); // Set to "gas" if a file is dropped, otherwise, set to an empty string
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  return (
    <div className="form-container">
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="kritikTextarea" className="my-4">
          <Form.Label>Masukkan Kritik dan Saran:</Form.Label>
          <Form.Control
            as="textarea"
            rows="4"
            name="kritik"
            value={formik.values.kritik}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.kritik && formik.errors.kritik && (
            <div className="error-message">{formik.errors.kritik}</div>
          )}
        </Form.Group>
        <Form.Group controlId="kategoriSelect" className="my-2">
          <Form.Label>Kategori:</Form.Label>
          <Form.Select
            name="kategori"
            value={formik.values.kategori}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" disabled>
              -- Pilih --
            </option>
            <option value="kritik">Bug Aplikasi</option>
            <option value="saran">Saran</option>
          </Form.Select>
          {formik.touched.kategori && formik.errors.kategori && (
            <div className="error-message">{formik.errors.kategori}</div>
          )}
        </Form.Group>
        {formik.values.kategori === "kritik" && (
          <Form.Group controlId="jenisKritikSelect" className="my-4">
            <Form.Label>
              <i className="bi bi-bug-fill text-danger mx-2"></i>Jenis
              Permasalahan : <br />
              <small className="text-danger mx-2">* wajib lampirkan file</small>
            </Form.Label>
            <Form.Select
              name="jenisKritik"
              value={formik.values.jenisKritik}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" disabled>
                -- Pilih --
              </option>
              <option value="JaringanLambat">Jaringan Lambat</option>
              <option value="AplikasiError">
                Aplikasi Error/ Tidak Dapat Diakses
              </option>
              <option value="DataKacau">Data tidak Valid</option>
              <option value="VerifikasiAkun">Kendala Verifikasi Akun</option>
              <option value="Lainnya">Lain-Lain</option>
            </Form.Select>
            {formik.touched.jenisKritik && formik.errors.jenisKritik && (
              <div className="error-message">{formik.errors.jenisKritik}</div>
            )}
          </Form.Group>
        )}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} accept="image/*" />
          <p>Drag atau drop gambar atau klik di sini untuk memilih file.</p>
        </div>
        {formik.touched.file && formik.errors.file && (
          <div className="error-message">{formik.errors.file}</div>
        )}

        {formik.values.file && formik.values.file.type && (
          <div>
            <p>Preview:</p>
            {formik.values.file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formik.values.file)}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            ) : (
              <p className="text-danger">File yang dipilih bukan gambar.</p>
            )}
          </div>
        )}

        <Button variant="primary" size="sm" type="submit" className="my-4">
          {loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              className="me-2"
              role="status"
              aria-hidden="true"
            />
          )}
          {loading ? "Loading..." : "Kirim"}
        </Button>
      </Form>
    </div>
  );
};

export default FormKritik;
