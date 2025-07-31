import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Tab, Nav } from "react-bootstrap";
import NotifikasiSukses from "../notifikasi/notifsukses";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./modalRekam.css";

export default function Rekam({
  show, onHide, id, jenis,
  revisi_anggaran_isi, blokir_anggaran_isi, automatic_adjustment_isi, halaman_3_dipa_isi, sdana_sbsn_isi, lainnya_anggaran_isi,
  proses_lelang_isi, lelang_dini_isi, gagal_lelang_isi, keterbatasan_penyedia_isi, tkdn_isi, ecatalog_isi, lainnya_pbj_isi,
  kekurangan_prasyarat_isi, prasyarat_lahan_isi, faktor_cuaca_isi, kesiapan_pedum_isi, penerimaan_bantuan_isi, pembagian_bantuan_isi,
  kenaikan_harga_isi, lainnya_eksekusi_isi,
  regulasi_kemenkeu_isi, regulasi_kl_isi, regulasi_pemda_isi, lainnya_regulasi_isi,
  pergantian_pejabat_isi, kekurangan_sdm_isi, pemahaman_aplikasi_isi, lainnya_sdm_isi,
  onSaveSuccess
}) {
  const { axiosJWT, token } = useContext(MyContext);

  const isiProps = {
    revisi_anggaran: revisi_anggaran_isi, blokir_anggaran: blokir_anggaran_isi, automatic_adjustment: automatic_adjustment_isi,
    halaman_3_dipa: halaman_3_dipa_isi, sdana_sbsn: sdana_sbsn_isi, lainnya_anggaran: lainnya_anggaran_isi,
    proses_lelang: proses_lelang_isi, lelang_dini: lelang_dini_isi, gagal_lelang: gagal_lelang_isi,
    keterbatasan_penyedia: keterbatasan_penyedia_isi, tkdn: tkdn_isi, ecatalog: ecatalog_isi, lainnya_pbj: lainnya_pbj_isi,
    kekurangan_prasyarat: kekurangan_prasyarat_isi, prasyarat_lahan: prasyarat_lahan_isi, faktor_cuaca: faktor_cuaca_isi,
    kesiapan_pedum: kesiapan_pedum_isi, penerimaan_bantuan: penerimaan_bantuan_isi, pembagian_bantuan: pembagian_bantuan_isi,
    kenaikan_harga: kenaikan_harga_isi, lainnya_eksekusi: lainnya_eksekusi_isi,
    regulasi_kemenkeu: regulasi_kemenkeu_isi, regulasi_kl: regulasi_kl_isi, regulasi_pemda: regulasi_pemda_isi, lainnya_regulasi: lainnya_regulasi_isi,
    pergantian_pejabat: pergantian_pejabat_isi, kekurangan_sdm: kekurangan_sdm_isi, pemahaman_aplikasi: pemahaman_aplikasi_isi, lainnya_sdm: lainnya_sdm_isi,
  };

  const clusterMapping = {
    1: [
      { key: "revisi_anggaran", label: "Revisi Anggaran", contoh: "Contoh: Sedang dilakukan proses pengajuan Revisi Anggaran pemindahan pagu" },
      { key: "blokir_anggaran", label: "Blokir Anggaran", contoh: "Contoh: Dokumen pendukung blokir non AA yang dikoordinir oleh UE1 belum menemukan kejelasan waktu" },
      { key: "automatic_adjustment", label: "Automatic Adjustment", contoh: "Contoh: Ketidakpastian waktu pembukaan blokir Automatic Adjusment" },
      { key: "halaman_3_dipa", label: "Halaman III DIPA", contoh: "Contoh: Deviasi terjadi karena perencanaan di awal triwulan tidak mengakomodir adanya tambahan kontrak di triwulan berjalan" },
      { key: "sdana_sbsn", label: "Sumber Dana SBSN", contoh: "Contoh: Banyak administrasi yang perlu diperhatikan dalam mengelola dana SBSN" },
      { key: "lainnya_anggaran", label: "Lainnya", contoh: "Contoh: Permasalahan anggaran lainnya di luar yang disebutkan" },
    ],
    2: [
      { key: "proses_lelang", label: "Proses Lelang", contoh: "Contoh: Proses lelang terhambat karena adanya permasalahan pembebasan lahan" },
      { key: "lelang_dini", label: "Lelang Dini", contoh: "Contoh: Pelaksanaan lelang dini berjalan lambat karena dokumen perencanaan kegiatan belum sepenuhnya siap, sehingga kontrak tidak dapat langsung diteken di awal tahun." },
      { key: "gagal_lelang", label: "Kegagalan Lelang", contoh: "Contoh: Wanprestasi pemenang lelang hingga waktu yang telah ditentukan dikarenakan kehabisan bahan baku" },
      { key: "keterbatasan_penyedia", label: "Keterbatasan Penyedia", contoh: "Contoh: Beberapa item tidak tersedia di wilayah kerja sehingga perlu dipesan dari luar pulau" },
      { key: "tkdn", label: "TKDN", contoh: "Contoh: Ketersediaan barang yang perlu ijin dalam pemenuhan unsur TKDN" },
      { key: "ecatalog", label: "Ecatalog", contoh: "Contoh: Produk yang ditampilkan pasca adanya update aplikasi tidak dimutakhirkan oleh penyedia" },
      { key: "lainnya_pbj", label: "Lainnya", contoh: "Contoh: Kendala PBJ lainnya yang tidak masuk kategori sebelumnya" },
    ],
    3: [
      { key: "kekurangan_prasyarat", label: "Kekurangan Prasyarat", contoh: "Contoh: Izin lokasi dan izin lingkungan belum lengkap sehingga kegiatan konstruksi terhambat dan harus dihentikan sementara" },
      { key: "prasyarat_lahan", label: "Prasyarat Lahan", contoh: "Contoh: Tanah yang sebelumnya dijanjikan oleh pihak pengembang belum sepenuhnya diserahkan oleh pihak pemilik lahan dan masih dalam proses negosiasi" },
      { key: "faktor_cuaca", label: "Faktor Cuaca", contoh: "Contoh: Faktor cuaca yang tidak menentu di beberapa lokasi proyek pekerjaan" },
      { key: "kesiapan_pedum", label: "Kesiapan Pedum", contoh: "Contoh: Juknis kegiatan untuk beberapa kegiatan belum ada diawal tahun" },
      { key: "penerimaan_bantuan", label: "Penetapan Penerima Bantuan", contoh: "Contoh: Adanya pergantian kelompok penerima bantuan sehingga menyebabkan kegiatan mundur dan harus dilakukan verifikasi ulang" },
      { key: "pembagian_bantuan", label: "Pembagian Bantuan", contoh: "Contoh: Proses distribusi bantuan terkendala karena keterlambatan pengiriman logistik ke daerah terpencil, sehingga jadwal pembagian bantuan tidak sesuai rencana." },
      { key: "kenaikan_harga", label: "Kenaikan Harga", contoh: "Contoh: Kenaikan harga material konstruksi akibat inflasi regional menyebabkan revisi Rencana Anggaran Biaya (RAB) dan memperlambat pelaksanaan pekerjaan" },
      { key: "lainnya_eksekusi", label: "Lainnya", contoh: "Contoh: Hambatan pelaksanaan kegiatan lainnya" },
    ],
    4: [
      { key: "regulasi_kemenkeu", label: "Regulasi Kemenkeu", contoh: "Contoh: Belum terbitnya regulasi dari Kementerian Keuangan" },
      { key: "regulasi_kl", label: "Regulasi K/L", contoh: "Contoh: Pelaksanaan kegiatan menunggu Peraturan K/L dan Juknis Eselon I" },
      { key: "regulasi_pemda", label: "Regulasi Pemda", contoh: "Contoh: Regulasi yang terlalu kompleks sehingga menghambat pelaksanaan program, terutama dalam hal perizinan dan kepatuhan terhadap standar teknis." },
      { key: "lainnya_regulasi", label: "Lainnya", contoh: "Contoh: Hambatan regulasi lainnya" },
    ],
    5: [
      { key: "pergantian_pejabat", label: "Pergantian Pejabat", contoh: "Contoh: Kegiatan terkendala dikarenakan adanya penetapan Pejabat Perbendaharaan yang baru dan belum memahami juknis pelaksanaan kegiatan serta mekanisme dalam pencairan APBN" },
      { key: "kekurangan_sdm", label: "Kekurangan SDM", contoh: "Contoh: Mutasi staf keuangan dan tidak dilakukan pengisian kembali pada posisi tersebut" },
      { key: "pemahaman_aplikasi", label: "Pemahaman Aplikasi", contoh: "Contoh: Staf yang diproyeksi menjalankan aplikasi dipindahkan ke bagian lain diantikan dengan staf baru yang belum memahami aplikasi" },
      { key: "lainnya_sdm", label: "Lainnya", contoh: "Contoh: Kendala SDM lainnya di luar yang disebutkan" },
    ]
  };

  const [formState, setFormState] = useState({});
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    if (show && jenis && clusterMapping[jenis]) {
      const mapping = clusterMapping[jenis];
      const newState = {};
      mapping.forEach(({ key }) => {
        newState[key] = isiProps[key] || "";
      });
      setFormState(newState);
      setActiveKey(mapping[0].key);
    }
  }, [show, jenis]);

  const handleInputChange = (key, value) => {
    setFormState(prev => ({ ...prev, [key]: value }));
  };

  const isiSemuaDenganTidakAda = () => {
    const updated = {};
    clusterMapping[jenis].forEach(({ key }) => {
      if (!formState[key]) updated[key] = "Tidak ada";
    });
    setFormState(prev => ({ ...prev, ...updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_HARMONISASI,
        { id, ...formState },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      NotifikasiSukses("Data berhasil disimpan");
      onSaveSuccess(id, ...Object.values(formState));
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(status, data?.error || "Gagal menyimpan data");
    }
  };

  const clusterTitle = {
    1: "Penganggaran", 2: "PBJ", 3: "Eksekusi Kegiatan", 4: "Regulasi", 5: "SDM"
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-chat-text-fill text-success me-2"></i>
          Clustering Tantangan {clusterTitle[jenis]}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "550px" }}>
        <Tab.Container activeKey={activeKey}>
          <Row>
            <Col sm={3} className="border-end pe-0">
              <Nav variant="pills" className="flex-column custom-tabs-x">
                {clusterMapping[jenis]?.map(({ key, label }) => (
                  <Nav.Item key={key}>
                    <Nav.Link
                      eventKey={key}
                      onClick={() => setActiveKey(key)}
                      className="rounded-pill text-start custom-tab-link"
                    >
                      {label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              {/* Tombol Tidak Ada */}
              <div className="text-center mt-4 px-3">
                <Button
                  variant={Object.values(formState).some((val) => val === "") ? "primary" : "secondary"}
                  onClick={isiSemuaDenganTidakAda}
                  className="w-100 rounded-pill"
                >
                  Tidak Ada
                </Button>
              </div>
            </Col>

            <Col sm={9} className="ps-4">
              <Form onSubmit={handleSubmit}>
                <Tab.Content>
                  {clusterMapping[jenis]?.map(({ key, label }) => (
                    <Tab.Pane eventKey={key} key={key}>
                      <div className="p-3 mb-3 border rounded bg-light shadow-sm">
                        <h5 className="bg-success text-white p-2 rounded-top d-flex align-items-center justify-content-between">
                          <span>
                            {label}
                            <OverlayTrigger
                              placement="right"
                              overlay={
                                <Tooltip style={{ fontSize: "0.75rem", fontStyle: "italic" }}>
                                  {clusterMapping[jenis].find((item) => item.key === key)?.contoh || "Contoh tidak tersedia"}
                                </Tooltip>
                              }
                            >
                              <i
                                className="bi bi-info-circle-fill ms-2"
                                style={{
                                  fontSize: "1rem",
                                  cursor: "pointer",
                                  verticalAlign: "middle",
                                }}
                              ></i>
                            </OverlayTrigger>
                          </span>
                        </h5>

                        <Form.Control
                          as="textarea"
                          rows={10}
                          style={{ resize: "vertical", minHeight: "350px" }}
                          value={formState[key] || ""}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          placeholder={`Uraian Tantangan ${label}`}
                        />
                      </div>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
                <div className="d-flex justify-content-end w-100 mt-4 pt-3 border-top">
                  <Button variant="success" type="submit" className="px-4">Simpan</Button>
                  <Button variant="secondary" className="ms-2 px-4" onClick={onHide}>Tutup</Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}
