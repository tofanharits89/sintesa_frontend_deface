import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Card,
  Table,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

import numeral from "numeral";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import { ModalEditBPS } from "./ModalEditBPS";
import { EPANOTIF } from "../../notifikasi/Omspan";
import Swal from "sweetalert2";
import ColorfulSpinner from "./Spinner";
import ReactPaginate from "react-paginate";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

export const LandingBPS = ({ activeKey, reload, onDataChange }) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State untuk trigger refresh

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  const WhereKanwil = role === "2" ? `where a.kode_kanwil=${kdkanwil}` : "";
  
  // Function untuk refresh data tabel
  const refreshData = async () => {
    await getData();
    // Notify parent component jika ada callback
    if (onDataChange) {
      onDataChange();
    }
  };
  const getData = async () => {
    setLoading(true);

    const encodedQuery = encodeURIComponent(
      `
SELECT 
  a.id, a.tahun,
  a.kode_kanwil, 
  b.nmkanwil,a.indikator,a.customindikator,customsatuan,triwulan,a.keterangan,a.updatedAt
 FROM data_bgn.indikator_bps a
LEFT JOIN dbref2025.t_kanwil b ON a.kode_kanwil = b.kdkanwil ${WhereKanwil}
ORDER BY a.createdAt DESC`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDATAKANWIL
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_TAYANGDATAKANWIL}${encryptedQuery}&limit=${limit}&page=${page}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);
      // console.log('DATA RESULT:', response.data.result); // Debug: cek struktur data
      setPages(response.data.totalPages);
      setRows(response.data.totalRows);
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      await Swal.fire({
        title: "Gagal Memuat Data!",
        text: (data && data.error) || "Terjadi Permasalahan Koneksi atau Server Backend",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
    }
  };  // console.log(reload, activeKey);
  useEffect(() => {
    if (activeKey === "tab1") {
      getData();
    }
  }, [page, activeKey, reload, refreshTrigger]); // Tambahkan refreshTrigger sebagai dependency
  // Function untuk trigger refresh tanpa memanggil getData langsung
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Expose triggerRefresh function globally
  useEffect(() => {
    window.triggerBPSDataRefresh = triggerRefresh;
    return () => {
      delete window.triggerBPSDataRefresh;
    };
  }, []);

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const handleDelete = async (id, kode_kanwil, triwulan) => {
    const result = await Swal.fire({
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
      title: "Yakin hapus data ini?",
      // text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      toast: false, // Nonaktifkan mode toast
      showConfirmButton: true,
      showCloseButton: true,
      timer: null, // Menghindari timer otomatis
    });

    if (result.isConfirmed) {
      try {
        await axiosJWT.delete(
          `${import.meta.env.VITE_REACT_APP_LOCAL_HAPUS_DATAKANWIL}/${id}/${kode_kanwil}/${triwulan}/1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
          icon: "success",
          confirmButtonText: "OK"
        });
        triggerRefresh(); // Trigger refresh menggunakan useEffect
      } catch (error) {
        // console.error("Gagal menghapus data:", error);
        await Swal.fire({
          title: "Gagal Menghapus!",
          text: "Terjadi kesalahan saat menghapus data.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
  };

  const handleEdit = (row) => {
    setEditingData({
      id: row.id,
      kode_kanwil: row.kode_kanwil,
      indikator: row.customindikator && row.customindikator.trim() !== "" ? row.customindikator : row.indikator,
      customIndikator: row.customindikator,
      customSatuan: row.customsatuan,
      triwulan: row.triwulan,
      tahun: row.tahun,
      keterangan: row.keterangan,
      username: username,
      id_type: "1" // ID untuk DataBPS
    });
    setShowEditModal(true);
  };
  const handleUpdate = async (updatedData) => {
    try {
      // Debug: cek struktur data yang dikirim
      // console.log('Data yang akan diupdate:', updatedData);
        const response = await axiosJWT.put(
        `${import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace('/users', '') }/update/data/kanwil`,
        {
          id: "1", // ID tipe data (1 untuk BPS) - hardcoded untuk BPS
          data: {
            id: updatedData.id, // ID record yang akan diupdate
            kode_kanwil: updatedData.kode_kanwil,
            indikator: updatedData.indikator,
            customIndikator: updatedData.customIndikator,
            customSatuan: updatedData.customSatuan,
            triwulan: updatedData.triwulan,
            tahun: parseInt(updatedData.tahun),
            keterangan: updatedData.keterangan,
            username: updatedData.username
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil diupdate!",
        timer: 2000,
        showConfirmButton: false,
      });
        setShowEditModal(false);
      setEditingData(null);
      triggerRefresh(); // Trigger refresh menggunakan useEffect
    } catch (error) {
      // console.error("Gagal mengupdate data:", error);
      
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat mengupdate data.";
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingData(null);
  };
  return (
    <>
      <Container fluid style={{ padding: '0' }}>
        {/* Modern Header */}
        {/* <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '20px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(79, 70, 229, 0.25)'
        }}>
          <h5 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            📊 Data Perkembangan Makrokesra (BPS)
          </h5>
          <p style={{ 
            margin: '4px 0 0 0', 
            fontSize: '13px', 
            opacity: 0.85,
            fontWeight: '400'
          }}>
            Kelola dan pantau data indikator makroekonomi
          </p>
        </div> */}

        {/* Enhanced Card */}
        <div style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '20px',
          boxShadow: '0 4px 32px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            height: "600px", 
            overflow: "auto",
            padding: '24px'
          }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <ColorfulSpinner />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                viewport={{ amount: 0.2, once: true }}
              >
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)'
                }}>
                  <Table responsive className="mb-0" style={{ fontSize: '13px' }}>                    <thead>                      <tr style={{
                        background: '#7c3aed',
                        color: 'white'
                      }}>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>TAHUN</th>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>KANWIL</th>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>TRIWULAN</th>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>INDIKATOR</th>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>SATUAN</th>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>KETERANGAN</th>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>UPDATE</th>
                        <th className="text-center" style={{ 
                          padding: '16px 12px', 
                          fontWeight: '600',
                          fontSize: '12px',
                          letterSpacing: '0.5px',
                          border: 'none'
                        }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>                    {data.length > 0 ? (
                      data.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{
                          backgroundColor: rowIndex % 2 === 0 ? '#fafbfc' : 'white',
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease'
                        }}
                       >
                          <td style={{ 
                            padding: '14px 12px', 
                            fontWeight: '600', 
                            color: '#4f46e5',
                            border: 'none'
                          }}>{row.tahun}</td>
                          <td style={{ 
                            padding: '14px 12px', 
                            fontWeight: '500',
                            color: '#374151',
                            border: 'none'
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: '600', color: '#1f2937' }}>{row.nmkanwil}</span>
                              <span style={{ fontSize: '11px', color: '#6b7280' }}>({row.kode_kanwil})</span>
                            </div>
                          </td>                          <td style={{ 
                            padding: '14px 12px', 
                            fontWeight: '600',
                            color: '#4f46e5',
                            border: 'none',
                            textAlign: 'center',
                            fontSize: '14px'
                          }}>
                            {row.triwulan === 1 ? 'I' : 
                             row.triwulan === 2 ? 'II' : 
                             row.triwulan === 3 ? 'III' : 
                             row.triwulan === 4 ? 'IV' : row.triwulan}
                          </td>
                          <td style={{ 
                            padding: '14px 12px', 
                            fontWeight: '500',
                            color: '#374151',
                            border: 'none',
                            maxWidth: '200px'
                          }}>
                            <div style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }} title={row.customindikator && row.customindikator.trim() !== "" ? row.customindikator : row.indikator}>
                              {row.customindikator && row.customindikator.trim() !== "" ? row.customindikator : row.indikator}
                            </div>
                          </td>
                          <td style={{ 
                            padding: '14px 12px', 
                            fontWeight: '500',
                            color: '#6b7280',
                            border: 'none'
                          }}>{row.customsatuan}</td>
                          <td style={{ 
                            padding: '14px 12px', 
                            fontWeight: '500',
                            color: '#374151',
                            border: 'none',
                            maxWidth: '150px'
                          }}>
                            <div style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }} title={row.keterangan}>
                              {row.keterangan}
                            </div>
                          </td>
                          <td className="text-center" style={{ 
                            padding: '14px 12px', 
                            fontWeight: '500',
                            color: '#6b7280',
                            border: 'none'
                          }}>
                            <span style={{
                              background: '#f3f4f6',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '11px'
                            }}>
                              {formatDate(row.updatedAt)}
                            </span>
                          </td>
                          <td className="text-center" style={{ 
                            padding: '14px 12px',
                            border: 'none'
                          }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleEdit(row)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '3px',
                                  color: '#3b82f6',
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title="Edit Data"
                                aria-label="Edit"
                              >
                                <FaEdit style={{ fontSize: '14px' }} />
                              </button>
                              <button
                                onClick={() => handleDelete(row.id, row.kode_kanwil, row.triwulan)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '3px',
                                  color: '#ef4444',
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s',
                                  width: '24px',
                                  height: '24px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title="Hapus Data"
                                aria-label="Delete"
                              >
                                <FaTrash style={{ fontSize: '14px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center" style={{
                          padding: '40px',
                          color: '#6b7280',
                          
                          border: 'none'
                        }}>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div style={{
                              fontSize: '48px',
                              opacity: 0.3
                            }}>📊</div>
                            <span>Tidak ada data tersedia</span>
                          </div>
                        </td>
                      </tr>
                    )}                  </tbody>
                  </Table>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Enhanced Pagination */}
        {data.length > 0 && (
          <div style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginTop: '16px',
            boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '14px',
              color: '#6b7280'
            }}>              <span style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Total: {numeral(rows).format("0,0")} data
              </span>
              <span>
                Halaman: {rows ? page + 1 : 0} dari {pages}
              </span>
            </div>
            <nav>
              <ReactPaginate
                breakLabel="..."
                previousLabel={<span style={{ fontSize: '16px' }}>←</span>}
                nextLabel={<span style={{ fontSize: '16px' }}>→</span>}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pages}
                containerClassName="pagination"
                pageClassName="page-item2"
                pageLinkClassName="page-link2"
                previousClassName="page-item2"
                previousLinkClassName="page-link2"
                nextClassName="page-item2"
                nextLinkClassName="page-link2"
                activeClassName="active"
                disabledClassName="disabled"
                onPageChange={handlePageChange}
                initialPage={page}
              />
            </nav>
          </div>
        )}
      </Container>      <ModalEditBPS
        show={showEditModal}
        onHide={handleCloseEditModal}
        editingData={editingData}
        onSave={handleUpdate}
      />
    </>
  );
};
