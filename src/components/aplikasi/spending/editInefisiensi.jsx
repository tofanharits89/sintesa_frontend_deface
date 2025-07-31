import React, { useState, useContext, useEffect } from "react";
import numeral from "numeral";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Modal,
  ModalFooter,
  Spinner,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import Swal from "sweetalert2";
import Encrypt from "../../../auth/Random";
import Notifikasi from "../notifikasi/notif";
import Sebab from "./sebab";
import { Toast } from "../notifikasi/Omspan";
import Kategori from "./kategori";
import { motion, AnimatePresence } from "framer-motion";

export default function EditInefisiensi({
  isModalVisible,
  TutupModal,
  selectedRowData,
  setHighlightedRowIndex,
  setStatus,
  setUlang,
  updateRow,
}) {
  const [loading, setLoading] = useState(false);
  const { axiosJWT, token, kdkanwil, role, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [jenis_efisiensi, setJenis] = useState("");
  const [kategori, setKategori] = useState("");

  const handleKategoriChange = (value) => setKategori(value);
  // console.log(selectedRowData.id);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);

      const encryptedQuery = Encrypt(
        `SELECT posisi,volkeg,hargasat,keterangan,sebab,kategori,jenis_efisiensi,persentase,hargasatuanPersen,nilaipersenakhir,jumlah FROM spending_review.dt_review_2025 where kdreview='1' and posisi='${selectedRowData.id}' limit 1`
      );

      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_SPENDING_ALOKASI
          }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      // console.log(data);
    } catch (error) {
      console.log(error);
      handleHttpError(
        error.response?.status,
        (error.response?.data && error.response.data.error) ||
        "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = (selectedRowData) => {
    Yup.object().shape({
      sebab: Yup.string().required("Alasan harus diisi"),
      kategori: Yup.string().when("belanja", {
        is: (belanja) => belanja === "53",
        then: () => Yup.string().required("Kategori harus diisi"),
        otherwise: () => Yup.string().notRequired(),
      }),
      jenis_efisiensi: Yup.string().required("Jenis harus dipilih"),

      persentase: Yup.number().when("jenis_efisiensi", {
        is: (jenis_efisiensi) => jenis_efisiensi === "1",
        then: () =>
          Yup.number()
            .typeError("Persentase harus berupa angka")
            .required("Persentase harus diisi")
            .min(1, "Persentase tidak boleh kurang dari 1%")
            .max(100, "Persentase tidak boleh lebih dari 100%"),
        otherwise: () => Yup.number().notRequired(),
      }),
      volume: Yup.number().when("jenis_efisiensi", {
        is: (jenis_efisiensi) => jenis_efisiensi === "0",
        then: () =>
          Yup.number()
            .typeError("Volume harus berupa angka")
            .required("Volume harus diisi")
            .moreThan(0, "Volume harus lebih dari 0")
            .test(
              "volkeg",
              `Volume tidak boleh melebihi volume kegiatan sebelumnya (${numeral(
                selectedRowData?.volkeg
              ).format("0,00")})`,
              function (value) {
                return value <= selectedRowData.volkeg;
              }
            ),
        otherwise: () => Yup.number().notRequired(),
      }),
      hargaSatuan: Yup.number().when("jenis_efisiensi", {
        is: (jenis_efisiensi) => jenis_efisiensi === "0",
        then: () =>
          Yup.number()
            .typeError("Harga Satuan harus berupa angka")
            .required("Harga Satuan harus diisi")
            .positive("Harga Satuan harus angka")
            .test(
              "pagu",
              `Harga Satuan tidak boleh melebihi harga satuan sebelumnya (Rp.${numeral(
                selectedRowData?.hargasat
              ).format("0,00")})`,
              function (value) {
                return value <= selectedRowData.hargasat;
              }
            ),
        otherwise: () => Yup.number().notRequired(),
      }),

      keterangan: Yup.string(),
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      setSelectedValue(data[0].sebab);
      setJenis(data[0].jenis_efisiensi);
    } else {
      setSelectedValue("");
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {
      belanja: selectedRowData?.id?.slice(29, 31) || "",
      volume: data.length > 0 ? data[0].volkeg : "",
      hargaSatuan: data.length > 0 ? data[0].hargasat : "",
      nilai: data.length > 0 ? data[0].jumlah : "",
      nilaipersenakhir: data.length > 0 ? data[0].nilaipersenakhir : "",
      keterangan: data.length > 0 ? data[0].keterangan : "",
      pagu: selectedRowData.pagu,
      uraian: selectedRowData.uraian,
      sebab: data.length > 0 ? data[0].sebab : "",
      kdkanwil: kdkanwil,
      jenis: 1,
      kategori: data.length > 0 ? data[0].kategori : "",
      jenis_efisiensi: data.length > 0 ? data[0].jenis_efisiensi : "",
      persentase: data.length > 0 ? data[0].persentase : "",
      // hargasatuanPersen: data.length > 0 ? data[0].hargasatuanPersen : "",
    },
    validationSchema: validationSchema(selectedRowData),
    enableReinitialize: true,

    onSubmit: async (values) => {
      // console.log(values);
      const calculatedNilai =
        values.volume && values.hargaSatuan
          ? values.volume * values.hargaSatuan
          : "";

      const updatedValues = {
        ...values,
        nilai: values.nilai,
        nilaipersenakhir: values.nilaipersenakhir,
        kdindex: selectedRowData.id,
        satkeg: selectedRowData.satkeg,
        jenis_efisiensi: values.jenis_efisiensi,
        user: username,
        thang: "2025",
        pagu: selectedRowData.pagu,
        uraian: selectedRowData.uraian,
        sebab: values.sebab,
        kategori: values.kategori,
        // hargasatuanPersen: values.hargasatuanPersen,
        jenis: 1,
      };
      // console.log(updatedValues);

      try {
        setLoading(true);
        const confirmText =
          "Apakah Anda yakin ingin melakukan perubahan data ini?";

        const result = await Swal.fire({
          title: "Konfirmasi Ubah",
          html: confirmText,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ubah",
          cancelButtonText: "Batal",
          position: "top",
          customClass: {
            confirmButton: "btn btn-sm btn-primary",
            cancelButton: "btn btn-md btn-danger",
          },
        });

        if (result.isConfirmed) {
          // Lakukan aksi penghapusan di sini
          await axiosJWT.post(
            import.meta.env.VITE_REACT_APP_LOCAL_SIMPANINEFISIENSI,
            updatedValues,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          Toast.fire({
            icon: "success",
            title: "Data Berhasil Diubah",
          });
          setTimeout(() => {
            TutupModal();
          }, 100);

          setHighlightedRowIndex(selectedRowData.id);
          setStatus(false);
          setUlang(true);
        }
      } catch (error) {
        const { status, data } = error.response || {};
        handleHttpError(
          status,
          (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // console.log(data[0].sebab);

  const handleHapus = async (posisi) => {
    const confirmText = "Anda yakin ingin menghapus data ini ?";

    Swal.fire({
      title: "Konfirmasi Hapus",
      html: confirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      position: "top",
      customClass: {
        confirmButton: "btn btn-sm btn-primary",
        cancelButton: "btn btn-md btn-danger",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let id = data.length > 0 && data[0].posisi;
        try {
          await axiosJWT.delete(
            `${import.meta.env.VITE_REACT_APP_LOCAL_BASIC
            }spending/inefisiensi/${id}/${1}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          updateRow({
            ...selectedRowData,
            status_simpan: "hapus_inefisiensi",
          });
          Toast.fire({
            icon: "success",
            title: "Data Berhasil Dihapus",
          });
          setTimeout(() => {
            TutupModal();
          }, 100);
          setStatus(false);
          setUlang(true);
        } catch (error) {
          console.log(error);
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

  const handleSebabChange = (value) => {
    setSelectedValue(value);
  };

  const formatToRibuan = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(
      Number(value.toString().replace(/\D/g, ""))
    );
  };

  const unformatRibuan = (value) => {
    return value
      ? value
        .toString()
        .replace(/\./g, "")
        .replace(/[^0-9]/g, "")
      : "";
  };

  const jenisAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.3 },
  };
  // console.log(data);
  return (
    <Modal
      show={isModalVisible}
      // onHide={TutupModal}
      fullscreen={false}
      size="xl"
      animation={false}
      backdrop="static"
      keyboard={false}
    // className="bg-light"
    // style={{ border: "1px solid red" }}
    >
      <Modal.Header>
        <Modal.Title>
          <h5>
            {" "}
            <i className="bi bi-cash-coin mx-2 "></i>Edit Data Inefisiensi
          </h5>
        </Modal.Title>
      </Modal.Header>
      {selectedRowData && (
        <>
          <Modal.Body
            className="rounded bg-light"
            style={{
              minHeight: "400px",
              marginBottom: "0px",
              overflow: "hidden",
            }}
          >
            <Container>
              <Card>
                <Card.Body
                  style={{ border: "2px solid #C4C5C6" }}
                  className="rounded bg-light "
                >
                  <table style={{ width: "100%" }} className="table-spending">
                    <tbody>
                      <tr>
                        <td>Kode</td>
                        <td>:</td>
                        <td>{selectedRowData.id}</td>
                      </tr>

                      <tr>
                        <td>Uraian</td>
                        <td>:</td>
                        <td>{selectedRowData.uraian}</td>
                      </tr>
                      <tr>
                        <td>Jenis Review</td>
                        <td>:</td>
                        <td>Inefisiensi</td>
                      </tr>
                      <tr>
                        <td>Pagu</td>
                        <td>:</td>
                        <td>{numeral(selectedRowData.pagu).format("0,00")}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
              {jenis_efisiensi === "1" ? (
                <AnimatePresence>
                  <motion.div {...jenisAnimation}>
                    <Alert variant="info">
                      *Yang direkam adalah nilai Inefisiensi (misal yang tidak
                      efisien 20 %).
                    </Alert>
                  </motion.div>
                </AnimatePresence>
              ) : jenis_efisiensi === "0" ? (
                <AnimatePresence>
                  <motion.div {...jenisAnimation}>
                    <Alert variant="info" className="text-muted">
                      *Yang direkam adalah nilai Inefisiensi (jumlah volume dan
                      nilai harga satuan yang tidak efisien).
                    </Alert>
                  </motion.div>
                </AnimatePresence>
              ) : null}
              <Card bg="light">
                <Card.Body
                  style={{ border: "2px solid #C4C5C6" }}
                  className="rounded bg-light"
                >
                  <table style={{ width: "100%" }} className="table-spending">
                    <tbody>
                      <tr>
                        <td>Volume</td>
                        <td>:</td>
                        <td>
                          {numeral(selectedRowData.volkeg).format("0,00")}
                        </td>
                        <td colSpan={2}>{selectedRowData.satkeg}</td>
                      </tr>
                      <tr>
                        <td>Harga Satuan</td>
                        <td>:</td>
                        <td colSpan="3">
                          {numeral(selectedRowData.hargasat).format("0,00")}
                        </td>
                      </tr>
                      <tr>
                        <td>Nilai</td>
                        <td>:</td>
                        <td colSpan="3">
                          {numeral(selectedRowData.pagu).format("0,00")}
                        </td>
                      </tr>
                      <tr>
                        <td>Alasan</td>
                        <td>:</td>
                        <td colSpan="3">
                          <Sebab
                            value={formik.values.sebab}
                            onBlur={formik.handleBlur}
                            onChange={(value) => {
                              formik.setFieldValue("sebab", value);
                              handleSebabChange(value);
                            }}
                          />
                        </td>
                      </tr>{" "}
                      {selectedRowData.id.slice(29, 31) === "53" && (
                        <tr>
                          <td>Kategori</td>
                          <td>:</td>
                          <td colSpan="3">
                            <Kategori
                              value={formik.values.kategori}
                              onChange={(value) => {
                                formik.setFieldValue("kategori", value);
                                handleKategoriChange(value);
                              }}
                              className={
                                formik.touched.kategori &&
                                  formik.errors.kategori
                                  ? "is-invalid"
                                  : ""
                              }
                            />
                            {formik.touched.kategori &&
                              formik.errors.kategori && (
                                <div className="invalid-feedback d-block">
                                  {formik.errors.kategori}
                                </div>
                              )}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>Jenis Inefisiensi</td>
                        <td>:</td>
                        <td colSpan="6">
                          <Form.Select
                            name="jenis_efisiensi"
                            value={formik.values.jenis_efisiensi}
                            onChange={(e) => {
                              const value = e.target.value;
                              formik.setFieldValue("jenis_efisiensi", value);
                              setJenis(value); // update state lokal juga jika diperlukan

                              // Reset fields persentase dan harga yang terkait
                              formik.setFieldValue("persentase", "");
                              formik.setFieldValue("volume", "");
                              formik.setFieldValue("hargaSatuan", "");
                              formik.setFieldValue("nilai", "");
                              // formik.setFieldValue("hargasatuanPersen", "");
                              formik.setFieldValue("nilaipersenakhir", "");
                            }}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.jenis_efisiensi &&
                              !!formik.errors.jenis_efisiensi
                            }
                          >
                            <option value="">Pilih Jenis Inefisiensi</option>
                            <option value="0">A. Volume/Harga Satuan</option>
                            <option value="1">B. Persentase</option>
                          </Form.Select>
                        </td>
                      </tr>
                      <tr>
                        <td>Keterangan</td>
                        <td>:</td>
                        <td colSpan="6">
                          <Form.Control
                            as="textarea"
                            placeholder="keterangan"
                            style={{ height: "100px" }}
                            name="keterangan"
                            value={formik.values.keterangan.toString()}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>{" "}
                  {jenis_efisiensi === "0" && (
                    <AnimatePresence>
                      <motion.div {...jenisAnimation}>
                        <Form className="row g-3 mt-3">
                          <Form.Group className="col-md-4" controlId="volume">
                            <Form.Label>Volume</Form.Label>
                            <Form.Control
                              type="text"
                              name="volume"
                              placeholder="Masukkan Volume"
                              value={formatToRibuan(formik.values.volume)}
                              onChange={(e) => {
                                const raw = unformatRibuan(e.target.value);
                                formik.setFieldValue("volume", raw);

                                const harga = Number(
                                  unformatRibuan(formik.values.hargaSatuan)
                                );
                                const nilai = Number(raw) * harga;
                                formik.setFieldValue("nilai", nilai);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.volume && !!formik.errors.volume
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.volume}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group
                            className="col-md-4"
                            controlId="hargaSatuan"
                          >
                            <Form.Label>Harga Satuan</Form.Label>
                            <Form.Control
                              type="text"
                              name="hargaSatuan"
                              placeholder="Masukkan Harga Satuan"
                              value={formatToRibuan(formik.values.hargaSatuan)}
                              onChange={(e) => {
                                const raw = unformatRibuan(e.target.value);
                                formik.setFieldValue("hargaSatuan", raw);

                                const volume = Number(
                                  unformatRibuan(formik.values.volume)
                                );
                                const nilai = volume * Number(raw);
                                formik.setFieldValue("nilai", nilai);
                                formik.setFieldValue("volume", volume);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.hargaSatuan &&
                                !!formik.errors.hargaSatuan
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.hargaSatuan}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="col-md-4" controlId="nilai">
                            <Form.Label>Nilai</Form.Label>
                            <Form.Control
                              type="text"
                              name="nilai"
                              value={formatToRibuan(formik.values.nilai)}
                              readOnly
                            />
                          </Form.Group>
                        </Form>
                      </motion.div>
                    </AnimatePresence>
                  )}
                  {jenis_efisiensi === "1" && (
                    <AnimatePresence>
                      <motion.div {...jenisAnimation}>
                        <Form className="row g-3 mt-3">
                          <Form.Group
                            className="col-md-4"
                            controlId="persentase"
                          >
                            <Form.Label>Persentase (%)</Form.Label>
                            <Form.Control
                              type="number"
                              name="persentase"
                              placeholder="Masukkan Persentase"
                              value={formik.values.persentase}
                              onChange={(e) => {
                                const value = e.target.value;
                                const pagu = Number(selectedRowData.pagu);
                                const hargasat = Number(
                                  selectedRowData.hargasat
                                );

                                formik.setFieldValue("persentase", value);

                                const hasil = Math.round((Number(value) / 100) * pagu);
                                // const nilaiPersenAwal = Math.round(
                                //   (Number(value) / 100) * hargasat
                                // );
                                // const hasil = Math.round(
                                //   selectedRowData.volkeg * nilaiPersenAwal
                                // );

                                // console.log(hasil);

                                // formik.setFieldValue(
                                //   "hargasatuanPersen",
                                //   nilaiPersenAwal
                                // );
                                formik.setFieldValue("nilaipersenakhir", hasil);
                              }}
                              onBlur={formik.handleBlur}
                              isInvalid={
                                formik.touched.persentase &&
                                !!formik.errors.persentase
                              }
                            />

                            <Form.Control.Feedback type="invalid">
                              {formik.errors.persentase}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group
                            className="col-md-4"
                            controlId="nilaipersenakhir"
                          >
                            <Form.Label>Nilai</Form.Label>
                            <Form.Control
                              type="text"
                              name="nilaipersenakhir"
                              value={formatToRibuan(
                                formik.values.nilaipersenakhir
                              )}
                              readOnly
                            />
                          </Form.Group>
                          {/* <Form.Group
                            className="col-md-4"
                            controlId="hargasatuanPersen"
                          >
                            <Form.Label>Harga Satuan</Form.Label>
                            <Form.Control
                              type="hidden"
                              name="hargasatuanPersen"
                              value={formatToRibuan(
                                formik.values.hargasatuanPersen
                              )}
                              readOnly
                            />
                          </Form.Group> */}
                        </Form>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </Card.Body>
              </Card>
            </Container>
          </Modal.Body>
          <ModalFooter className="bg-light rounded">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="mx-0 button"
              onClick={TutupModal}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="mx-4 button"
              disabled={loading}
              onClick={formik.handleSubmit}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  &nbsp; &nbsp;Loading...
                </>
              ) : (
                "Edit"
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="danger"
              className="mx-0 button"
              onClick={handleHapus}
            >
              Hapus
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
