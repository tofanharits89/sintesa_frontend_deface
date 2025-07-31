import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Table,
  Spinner,
  Button,
} from "react-bootstrap";
import numeral from "numeral";
import MyContext from "../../../../auth/Context";
import Encrypt from "../../../../auth/Random";
import Swal from "sweetalert2";
import ColorfulSpinner from "./Spinner";
import ReactPaginate from "react-paginate";
import { ModalEditKesimpulan } from "./ModalEditKesimpulan";
import { FaEdit, FaTrash } from "react-icons/fa";

// Tambahkan fungsi formatDate
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

export const LandingKesimpulan = ({ activeKey, reload }) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(15);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const WhereKanwil = role === "2" ? `where a.kode_kanwil=${kdkanwil}` : "";
  
  // Function untuk refresh data tabel
  const refreshData = async () => {
    await getData();
  };

  // Function untuk trigger refresh dari luar component
  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Global refresh trigger untuk kesimpulan
  useEffect(() => {
    window.triggerKesimpulanDataRefresh = triggerRefresh;
    return () => {
      delete window.triggerKesimpulanDataRefresh;
    };
  }, []);

  // Refresh data ketika refreshTrigger berubah
  useEffect(() => {
    if (activeKey === "tab5" && refreshTrigger > 0) {
      getData();
    }
  }, [refreshTrigger]);
  
  const getData = async () => {
    setLoading(true);
    
    // Update query untuk include updatedAt
    const encodedQuery = encodeURIComponent(
      `SELECT 
        a.id, a.tahun,
        a.kode_kanwil, 
        COALESCE(b.nmkanwil, 
          CASE 
            WHEN a.kode_kanwil LIKE '%-%' THEN TRIM(SUBSTRING_INDEX(a.kode_kanwil, '-', -1))
            ELSE a.kode_kanwil 
          END
        ) as nmkanwil, 
        a.triwulan, a.kesimpulan, a.saran, a.updatedAt,
        CASE 
          WHEN a.kode_kanwil LIKE '%-%' THEN TRIM(SUBSTRING_INDEX(a.kode_kanwil, '-', 1))
          ELSE a.kode_kanwil 
        END as clean_kode
      FROM data_bgn.kesimpulan_saran a
      LEFT JOIN dbref2025.t_kanwil b ON (
        CASE 
          WHEN a.kode_kanwil LIKE '%-%' THEN TRIM(SUBSTRING_INDEX(a.kode_kanwil, '-', 1))
          ELSE a.kode_kanwil 
        END
      ) = b.kdkanwil ${WhereKanwil}
      ORDER BY a.id DESC`
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
      setPages(response.data.totalPages);
      setRows(response.data.totalRows);
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      let errorMessage = (data && data.error) || "Terjadi Permasalahan Koneksi atau Server Backend";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeKey === "tab5") {
      getData();
    }
  }, [page, activeKey, reload]);

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const handleEdit = (row) => {
    setEditingData({
      id: row.id,
      kode_kanwil: row.kode_kanwil,
      triwulan: row.triwulan,
      tahun: row.tahun,
      kesimpulan: row.kesimpulan,
      saran: row.saran,
      username: username,
      id_type: "5" // ID untuk Kesimpulan
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      // console.log('Data yang akan diupdate:', updatedData);
      
      const response = await axiosJWT.put(
        `${import.meta.env.VITE_REACT_APP_LOCAL_USERS?.replace('/users', '') }/update/data/kanwil`,
        {
          id: "5", // ID tipe data (5 untuk Kesimpulan)
          data: {
            id: updatedData.id,
            kode_kanwil: updatedData.kode_kanwil,
            triwulan: updatedData.triwulan,
            tahun: parseInt(updatedData.tahun),
            kesimpulan: updatedData.kesimpulan,
            saran: updatedData.saran,
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
        text: "Kesimpulan berhasil diupdate!",
        timer: 2000,
        showConfirmButton: false,
      });
      
      setShowEditModal(false);
      setEditingData(null);
      triggerRefresh(); // Trigger refresh menggunakan useEffect
      
      // Trigger global refresh jika ada
      if (window.triggerKesimpulanDataRefresh) {
        window.triggerKesimpulanDataRefresh();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat mengupdate data.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
      });
      throw error;
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingData(null);
  };

  const handleDelete = async (id, kode_kanwil, triwulan) => {
    const result = await Swal.fire({
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      position: "top",
      title: "Yakin hapus data ini?",
      icon: "warning",
      toast: false,
      showConfirmButton: true,
      showCloseButton: true,
      timer: null,
    });
    if (result.isConfirmed) {
      try {
        await axiosJWT.delete(
          `${import.meta.env.VITE_REACT_APP_LOCAL_HAPUS_DATAKANWIL}/${id}/${kode_kanwil}/${triwulan}/5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Data Berhasil Dihapus",
          timer: 2000,
          showConfirmButton: false,
        });
        getData();
      } catch (error) {
        let errorMessage = "Terjadi kesalahan saat menghapus data.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
  };
  return (
    <>
      <style>
        {`
          .kesimpulan-modern-table {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.1);
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 197, 253, 0.03) 100%);
          }
          
          .kesimpulan-table-header {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
            color: white;
            position: sticky;
            top: 0;
            z-index: 10;
          }
          
          .kesimpulan-table-header th {
            border: none;
            padding: 14px 12px;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
            position: relative;
          }
          
          .kesimpulan-table-header th:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 20%;
            height: 60%;
            width: 1px;
            background: rgba(255, 255, 255, 0.2);
          }
          
          .kesimpulan-table-row {
            transition: all 0.3s ease;
            border: none;
            background: rgba(255, 255, 255, 0.8);
          }
          
          .kesimpulan-table-row:hover {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 197, 253, 0.08) 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
          }
            .kesimpulan-table-row td {
            padding: 12px;
            border: none;
            border-bottom: 1px solid rgba(59, 130, 246, 0.08);
            font-size: 13px;
            vertical-align: middle;
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
          }
          
          .kesimpulan-text-cell {
            max-width: 200px;
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            line-height: 1.4;
          }
          
          .kesimpulan-table-header th {
            border: none;
            padding: 14px 12px;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            white-space: nowrap;
            position: relative;
          }
          
          .kesimpulan-table-header th.kesimpulan-text-header {
            width: 25%;
            min-width: 200px;
            max-width: 250px;
          }
          
          .kesimpulan-table-header th.kesimpulan-compact-header {
            width: 8%;
            min-width: 80px;
          }.kesimpulan-action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            margin: 0 2px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 12px;
            font-weight: bold;
          }
          
          .kesimpulan-edit-btn {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
          }
          
          .kesimpulan-edit-btn:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
          
          .kesimpulan-delete-btn {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
          }
          
          .kesimpulan-delete-btn:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
          
          .kesimpulan-modern-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 16px 20px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%);
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.1);
          }
          
          .kesimpulan-pagination-info {
            color: #374151;
            font-size: 13px;
            font-weight: 500;
          }
          
          .kesimpulan-pagination-nav .pagination {
            margin: 0;
            gap: 4px;
          }
          
          .kesimpulan-pagination-nav .page-item2 .page-link2 {
            border: 1px solid rgba(59, 130, 246, 0.2);
            color: #3b82f6;
            background: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            min-width: 40px;
            text-align: center;
          }
          
          .kesimpulan-pagination-nav .page-item2:hover .page-link2 {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
          }
          
          .kesimpulan-pagination-nav .page-item2.active .page-link2 {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border-color: #3b82f6;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
          
          .kesimpulan-pagination-nav .page-item2.disabled .page-link2 {
            color: #9ca3af;
            background: #f9fafb;
            border-color: #e5e7eb;
            cursor: not-allowed;
          }
          
          .kesimpulan-empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #6b7280;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 197, 253, 0.03) 100%);
          }
          
          .kesimpulan-loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 400px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 197, 253, 0.03) 100%);
            border-radius: 16px;
          }
        `}
      </style>
      
      <Container fluid>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="kesimpulan-modern-table"
          style={{ height: "600px", overflow: "auto" }}
        >
          {loading ? (
            <div className="kesimpulan-loading-container">
              <ColorfulSpinner />
            </div>
          ) : (
            <Table responsive className="mb-0">              <thead className="kesimpulan-table-header">
                <tr>
                  <th className="text-center kesimpulan-compact-header">Tahun</th>
                  <th className="text-center">Kanwil</th>
                  <th className="text-center kesimpulan-compact-header">Triwulan</th>
                  <th className="text-center kesimpulan-text-header">Kesimpulan</th>
                  <th className="text-center kesimpulan-text-header">Rekomendasi</th>
                  <th className="text-center kesimpulan-compact-header">Update</th>
                  <th className="text-center kesimpulan-compact-header">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className="kesimpulan-table-row"
                      
                    >                      <td style={{ 
                        padding: '14px 12px', 
                        fontWeight: '600', 
                        color: '#3b82f6',
                        border: 'none',
                        textAlign: 'center'
                      }}>{row.tahun}</td>
                      <td style={{ 
                        padding: '14px 12px', 
                        fontWeight: '500',
                        color: '#374151',
                        border: 'none'
                      }}>
                        {row.nmkanwil && row.clean_kode
                          ? `${row.nmkanwil} (${row.clean_kode})`
                          : row.kode_kanwil}
                      </td>
                      <td style={{ 
                        padding: '14px 12px', 
                        fontWeight: '600',
                        color: '#3b82f6',
                        border: 'none',
                        textAlign: 'center',
                        fontSize: '14px'
                      }}>
                        {row.triwulan === 'QI' ? 'I' : 
                         row.triwulan === 'QII' ? 'II' :
                         row.triwulan === 'QIII' ? 'III' :
                         row.triwulan === 'QIV' ? 'IV' : row.triwulan}
                      </td>                      <td style={{ 
                        padding: '14px 12px', 
                        fontWeight: '500',
                        color: '#374151',
                        border: 'none'
                      }} className="kesimpulan-text-cell">{row.kesimpulan}</td>
                      <td style={{ 
                        padding: '14px 12px', 
                        fontWeight: '500',
                        color: '#374151',
                        border: 'none'
                      }} className="kesimpulan-text-cell">{row.saran}</td>
                      <td style={{ 
                        padding: '14px 12px', 
                        fontWeight: '500',
                        color: '#6b7280',
                        border: 'none',
                        textAlign: 'center',
                        fontSize: '12px'
                      }}>{formatDate(row.updatedAt)}</td>                      <td style={{ 
                        padding: '14px 12px',
                        border: 'none',
                        textAlign: 'center'
                      }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            marginRight: '6px',
                            transition: 'all 0.2s ease',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            border: 'none',
                            padding: '3px'
                          }}
                          onClick={() => handleEdit(row)}
                          title="Edit"
                          aria-label="Edit"
                        >
                          <FaEdit style={{ fontSize: '14px' }} />
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            border: 'none',
                            padding: '3px'
                          }}
                          onClick={() => handleDelete(row.id, row.kode_kanwil, row.triwulan)}
                          title="Hapus"
                          aria-label="Delete"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <FaTrash style={{ fontSize: '14px' }} />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="kesimpulan-empty-state">
                      <div>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Tidak ada data tersedia</div>
                        <div style={{ fontSize: '14px', color: '#9ca3af' }}>Data kesimpulan akan muncul di sini</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </motion.div>
        
        {data.length > 0 && (
          <motion.div 
            className="kesimpulan-modern-pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="kesimpulan-pagination-info">
              <strong>{numeral(rows).format("0,0")}</strong> total data • 
              Halaman <strong>{rows ? page + 1 : 0}</strong> dari <strong>{pages}</strong>
            </div>
            <nav className="kesimpulan-pagination-nav">
              <ReactPaginate
                breakLabel="..."
                previousLabel={<span>←</span>}
                nextLabel={<span>→</span>}
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
          </motion.div>
        )}
      </Container>
      
      {/* Modal Edit Kesimpulan */}
      <ModalEditKesimpulan
        show={showEditModal}
        onHide={handleCloseEditModal}
        editingData={editingData}
        onSave={handleUpdate}
      />
    </>
  );
};
