import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Tab, Nav } from "react-bootstrap";
import NotifikasiSukses from "../notifikasi/notifsukses";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./modalTantangan.css";

export default function RekamanTantangan({
    show, onHide, id, jenis, kesesuaian_pnbp_isi, ketepatan_waktu_isi, surat_dispensasi_isi,
    kesesuaian_tarif_isi, tambahan_kepatuhan_isi, kesesuaian_kas_isi, kesesuaian_nomor_isi, ketepatan_lpj_isi,
    kepatuhan_saldo_isi, kesesuaian_transaksi_isi, tambahan_pelaporan_isi, tren_belanja_isi, masalah_penganggaran_isi, masalah_kegiatan_isi, masalah_regulasi_isi,
    masalah_mp_isi, kesesuaian_real_rpd_isi, kendala_belanja_lainnya_isi, kendala_internal_isi, kendala_eksternal_isi, kendala_jaringan_app_isi, kendala_lokasi_isi,
    kesesuaian_pnbp_target_isi, kendala_penerimaan_lainnya_isi, rekomendasi_isi, onSaveSuccess
}) {
    const { axiosJWT, token } = useContext(MyContext);

    const isiProps = {
        kesesuaian_pnbp: kesesuaian_pnbp_isi, ketepatan_waktu: ketepatan_waktu_isi, surat_dispensasi: surat_dispensasi_isi,
        kesesuaian_tarif: kesesuaian_tarif_isi, tambahan_kepatuhan: tambahan_kepatuhan_isi, kesesuaian_kas: kesesuaian_kas_isi,
        kesesuaian_nomor: kesesuaian_nomor_isi, ketepatan_lpj: ketepatan_lpj_isi, kepatuhan_saldo: kepatuhan_saldo_isi,
        kesesuaian_transaksi: kesesuaian_transaksi_isi, tambahan_pelaporan: tambahan_pelaporan_isi, tren_belanja: tren_belanja_isi, masalah_penganggaran: masalah_penganggaran_isi,
        masalah_kegiatan: masalah_kegiatan_isi, masalah_regulasi: masalah_regulasi_isi, masalah_mp: masalah_mp_isi,
        kesesuaian_real_rpd: kesesuaian_real_rpd_isi, kendala_belanja_lainnya: kendala_belanja_lainnya_isi, kendala_internal: kendala_internal_isi,
        kendala_eksternal: kendala_eksternal_isi, kendala_jaringan_app: kendala_jaringan_app_isi,
        kendala_lokasi: kendala_lokasi_isi, kesesuaian_pnbp_target: kesesuaian_pnbp_target_isi, kendala_penerimaan_lainnya: kendala_penerimaan_lainnya_isi, rekomendasi: rekomendasi_isi
    };

    const clusterMapping = {
        1: [
            { key: "kesesuaian_pnbp", singkat: "Kesesuaian nilai PNBP yang dipungut/diterima", label: "Kesesuaian nilai PNBP yang dipungut/diterima dengan nilai PNBP yang disetor pada periode bersangkutan", contoh: "Kesesuaian nilai PNBP yang dipungut/diterima dengan nilai PNBP yang disetor pada periode bersangkutan" },
            { key: "ketepatan_waktu", singkat: "Ketepatan waktu antara pemungutan dan penyetoran PNBP", label: "Ketepatan waktu antara periode pemungutan dengan penyetoran PNBP", contoh: "Ketepatan waktu antara periode pemungutan dengan penyetoran PNBP" },
            { key: "surat_dispensasi", singkat: "Surat dispensasi penyetoran oleh Kanwil DJPb", label: "Surat izin dispensasi waktu penyetoran yang diterbitkan oleh Kanwil DJPb (jika memerlukan dispensasi)", contoh: "Surat izin dispensasi waktu penyetoran yang diterbitkan oleh Kanwil DJPb (jika memerlukan dispensasi)" },
            { key: "kesesuaian_tarif", singkat: "Kesesuaian tarif PNBP sesuai peraturan", label: "Kesesuaian tarif PNBP sebagaimana ditetapkan dengan peraturan yang mengatur mengenai PNBP tersebut", contoh: "Kesesuaian tarif PNBP sebagaimana ditetapkan dengan peraturan yang mengatur mengenai PNBP tersebut" },
            { key: "tambahan_kepatuhan", singkat: "Keterangan tambahan kepatuhan", label: "Keterangan Tambahan terkait Aspek Kepatuhan Pemungutan dan Penyetoran", contoh: "Keterangan Tambahan terkait Aspek Kepatuhan Pemungutan dan Penyetoran" },
        ],
        2: [
            { key: "kesesuaian_kas", singkat: "Kesesuaian kas Bendahara Penerimaan dengan LPJ Bendahara", label: "Kesesuaian kas di Bandahara Penerimaan dengan saldo akhir di LPJ Bendahara", contoh: "Kesesuaian kas di Bandahara Penerimaan dengan saldo akhir di LPJ Bendahara" },
            { key: "kesesuaian_nomor", singkat: "Kesesuaian nomor rekening Bendahara Penerimaan dengan yang tercatat di KPPN", label: "Kesesuaian nomor rekening Bendahara Penerimaan dengan nomor rekening yang terdaftar di KPPN dan tercatat pada Aplikasi SPRINT", contoh: "Kesesuaian nomor rekening Bendahara Penerimaan dengan nomor rekening yang terdaftar di KPPN dan tercatat pada Aplikasi SPRINT" },
            { key: "ketepatan_lpj", singkat: "Ketepatan waktu penyampaian LPJ Bendahara Penerimaan melalui Aplikasi SPRINT", label: "Ketepatan waktu penyampaian LPJ Bendahara Penerimaan melalui Aplikasi SPRINT", contoh: "Ketepatan waktu penyampaian LPJ Bendahara Penerimaan melalui Aplikasi SPRINT" },
            { key: "kepatuhan_saldo", singkat: "Kepatuhan atas saldo kas tunai di brankas Bendahara Penerimaan", label: "Kepatuhan atas saldo kas tunai di brankas Bendahara Penerimaan", contoh: "Kepatuhan atas saldo kas tunai di brankas Bendahara Penerimaan" },
            { key: "kesesuaian_transaksi", singkat: "Kesesuaian transaksi penerimaan PNBP di Bendahara Penerimaan dengan KPPN", label: "Kesesuaian antara transaksi penerimaan PNBP di Bendahara Penerimaan dengan data penerimaan di Seksi Bank KPPN", contoh: "Kesesuaian antara transaksi penerimaan PNBP di Bendahara Penerimaan dengan data penerimaan di Seksi Bank KPPN" },
            { key: "tambahan_pelaporan", singkat: "Keterangan tambahan aspek pelaporan", label: "Keterangan Tambahan terkait Aspek Pelaporan dan Penatausahaan", contoh: "Keterangan Tambahan terkait Aspek Pelaporan dan Penatausahaan" },
        ],
        3: [
            { key: "tren_belanja", singkat: "Tren Pelaksanaan Belanja PNBP pada Satker", label: "Tren Pelaksanaan Belanja PNBP pada Satker", contoh: "Tren Pelaksanaan Belanja PNBP pada Satker" },
            { key: "masalah_penganggaran", singkat: "Permasalahan terkait Penganggaran", label: "Permasalahan terkait Penganggaran", contoh: "Permasalahan terkait Penganggaran" },
            { key: "masalah_kegiatan", singkat: "Permasalahan terkait Eksekusi/Pelaksanaan Kegiatan PNBP", label: "Permasalahan terkait Eksekusi/Pelaksanaan Kegiatan PNBP", contoh: "Permasalahan terkait Eksekusi/Pelaksanaan Kegiatan PNBP" },
            { key: "masalah_regulasi", singkat: "Permasalahan terkait Regulasi/Juknis Kegiatan", label: "Permasalahan terkait Regulasi/Juknis Kegiatan", contoh: "Permasalahan terkait Regulasi/Juknis Kegiatan" },
            { key: "masalah_mp", singkat: "Permasalahan terkait MP PNBP", label: "Permasalahan terkait MP PNBP", contoh: "Permasalahan terkait MP PNBP" },
            { key: "kesesuaian_real_rpd", singkat: "Kesesuaian Realisasi Belanja PNBP dengan RPD", label: "Kesesuaian Realisasi Belanja PNBP dengan Rencana Penarikan Dana", contoh: "Kesesuaian Realisasi Belanja PNBP dengan Rencana Penarikan Dana" },
            { key: "kendala_belanja_lainnya", singkat: "Kendala Lainnya terkait Belanja PNBP", label: "Kendala Lainnya terkait Belanja PNBP", contoh: "Kendala Lainnya terkait Belanja PNBP" },
        ],
        4: [
            { key: "kendala_internal", singkat: "Kendala Internal Satker/K/L", label: "Kendala Internal Satker/K/L", contoh: "Kendala Internal Satker/K/L" },
            { key: "kendala_eksternal", singkat: "Kendala Eksternal Satker/K/L", label: "Kendala Eksternal Satker/K/L", contoh: "Kendala Eksternal Satker/K/L" },
            { key: "kendala_jaringan_app", singkat: "Kendala Jaringan/Aplikasi", label: "Kendala Jaringan/Aplikasi", contoh: "Kendala Jaringan/Aplikasi" },
            { key: "kendala_lokasi", singkat: "Kendala Lokasi/Geografis", label: "Kendala Lokasi/Geografis", contoh: "Kendala Lokasi/Geografis" },
            { key: "kesesuaian_pnbp_target", singkat: "Kesesuaian Penerimaan PNBP dengan Rencana/Target Penerimaan", label: "Kesesuaian Penerimaan PNBP dengan Rencana/Target Penerimaan", contoh: "Kesesuaian Penerimaan PNBP dengan Rencana/Target Penerimaan" },
            { key: "kendala_penerimaan_lainnya", singkat: "Kendala Lainnya terkait Permasalahan Penerimaan PNBP", label: "Kendala Lainnya terkait Permasalahan Penerimaan PNBP", contoh: "Kendala Lainnya terkait Permasalahan Penerimaan PNBP" },
        ],
        5: [
            { key: "rekomendasi", singkat: "Rekomendasi bagi Satker/K/L atas pelaksanaan Monev PNBP yang telah dilakukan", label: " Rekomendasi bagi Satker/K/L atas pelaksanaan Monev PNBP yang telah dilakukan", contoh: "Rekomendasi bagi Satker/K/L atas pelaksanaan Monev PNBP yang telah dilakukan" },
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
                import.meta.env.VITE_REACT_APP_LOCAL_SIMPANMONEVTANTANGAN,
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
        1: "Kepatuhan Pemungutan dan Penyetoran", 2: "Pelaporan dan Penatausahaan", 3: "Kendala Pelaksanaan Belanja PNBP", 4: "Permasalahan Penerimaan PNBP", 5: "Rekomendasi"
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-chat-text-fill text-success me-2"></i>
                    Aspek {clusterTitle[jenis]}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ minHeight: "550px" }}>
                <Tab.Container activeKey={activeKey}>
                    <Row>
                        <Col sm={3} className="border-end pe-0">
                            <Nav variant="pills" className="flex-column custom-tabs-x">
                                {clusterMapping[jenis]?.map(({ key, singkat }) => (
                                    <Nav.Item key={key}>
                                        <Nav.Link
                                            eventKey={key}
                                            onClick={() => setActiveKey(key)}
                                            className="rounded-pill text-start custom-tab-link text-justify"
                                        >
                                            {singkat}
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
                                    {clusterMapping[jenis]?.map(({ key, label, contoh }) => (
                                        <Tab.Pane eventKey={key} key={key}>
                                            <div className="p-3 mb-3 border rounded bg-light shadow-sm">
                                                <h5 className="bg-success text-white p-2 rounded-top d-flex align-items-center justify-content-between">
                                                    <span>
                                                        <right className="text-start d-block">{label}</right>
                                                    </span>
                                                </h5>

                                                <Form.Control
                                                    as="textarea"
                                                    rows={10}
                                                    style={{ resize: "vertical", minHeight: "350px" }}
                                                    value={formState[key] || ""}
                                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                                    placeholder={`Uraian ${contoh}`}
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
