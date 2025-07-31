import React, { useEffect, useState, useContext } from "react";
import MyContext from "../../../../auth/Context";
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

const colorMap = {
  green: "#7ed957",
  yellow: "#ffe066",
  red: "#ff4d4d",
};

const getRiskColor = (score) => {
  if (score == null) return "#eee";
  if (score === 1) return colorMap.green;
  if (score === 2) return colorMap.yellow;
  if (score === 3) return colorMap.red;
  return "#eee";
};

const EWS = () => {
  const { axiosJWT, token, role, kdkanwil } = useContext(MyContext);
  const [allEwsData, setAllEwsData] = useState([]); // simpan semua data
  const [tahun, setTahun] = useState(2025);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosJWT.get(
          `${import.meta.env.VITE_REACT_APP_LOCAL_EWS}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllEwsData(res.data);
      } catch (err) {
        setAllEwsData([]);
      }
    };
    fetchData();
    setCurrentPage(1); // Reset ke halaman 1 ketika filter berubah
  }, [axiosJWT, token, tahun]); // tambahkan tahun sebagai dependency

  // Filter data sesuai tahun yang dipilih
  const ewsData = allEwsData.filter(row => row.tahun === tahun);

  // Group data by kdkanwil, nmkanwil
  const grouped = {};
  ewsData.forEach(row => {
    if (!grouped[row.kdkanwil]) grouped[row.kdkanwil] = { nmkanwil: row.nmkanwil, scores: {} };
    grouped[row.kdkanwil].scores[row.triwulan] = row.total_score;
  });

  // Daftar master kanwil (jangan diubah urutan/nama)
  const masterKanwil = [
    { kdkanwil: "01", nmkanwil: "BANDA ACEH" },
    { kdkanwil: "02", nmkanwil: "MEDAN" },
    { kdkanwil: "03", nmkanwil: "PADANG" },
    { kdkanwil: "04", nmkanwil: "PEKANBARU" },
    { kdkanwil: "05", nmkanwil: "JAMBI" },
    { kdkanwil: "06", nmkanwil: "PALEMBANG" },
    { kdkanwil: "08", nmkanwil: "BENGKULU" },
    { kdkanwil: "07", nmkanwil: "BANDAR LAMPUNG" },
    { kdkanwil: "09", nmkanwil: "PANGKAL PINANG" },
    { kdkanwil: "31", nmkanwil: "KEPULAUAN RIAU" },
    { kdkanwil: "11", nmkanwil: "JAKARTA" },
    { kdkanwil: "12", nmkanwil: "BANDUNG" },
    { kdkanwil: "13", nmkanwil: "SEMARANG" },
    { kdkanwil: "14", nmkanwil: "YOGYAKARTA" },
    { kdkanwil: "15", nmkanwil: "SURABAYA" },
    { kdkanwil: "10", nmkanwil: "SERANG" },
    { kdkanwil: "20", nmkanwil: "DENPASAR" },
    { kdkanwil: "21", nmkanwil: "MATARAM" },
    { kdkanwil: "22", nmkanwil: "KUPANG" },
    { kdkanwil: "16", nmkanwil: "PONTIANAK" },
    { kdkanwil: "17", nmkanwil: "PALANGKARAYA" },
    { kdkanwil: "18", nmkanwil: "BANJARMASIN" },
    { kdkanwil: "19", nmkanwil: "SAMARINDA" },
    { kdkanwil: "34", nmkanwil: "KALIMANTAN UTARA" },
    { kdkanwil: "27", nmkanwil: "MANADO" },
    { kdkanwil: "24", nmkanwil: "PALU" },
    { kdkanwil: "23", nmkanwil: "MAKASSAR" },
    { kdkanwil: "25", nmkanwil: "KENDARI" },
    { kdkanwil: "26", nmkanwil: "GORONTALO" },
    { kdkanwil: "32", nmkanwil: "SULAWESI BARAT" },
    { kdkanwil: "29", nmkanwil: "AMBON" },
    { kdkanwil: "28", nmkanwil: "TERNATE" },
    { kdkanwil: "33", nmkanwil: "PAPUA BARAT" },
    { kdkanwil: "30", nmkanwil: "JAYAPURA" }
  ];

  // Filter kanwil jika role user adalah kanwil
  const filteredMasterKanwil = (role === 2 || role === '2' || role === 'kanwil') && kdkanwil
    ? masterKanwil.filter(k => k.kdkanwil === kdkanwil)
    : masterKanwil;

  // Generate kanwil rows dengan data yang sudah di-group
  const kanwilRows = filteredMasterKanwil
    .sort((a, b) => a.kdkanwil.localeCompare(b.kdkanwil, undefined, { numeric: true }))
    .map(({ kdkanwil, nmkanwil }) => ({
      kdkanwil,
      nmkanwil,
      scores: grouped[kdkanwil]?.scores || {}
    }));

    // State untuk modal popup
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    kanwil: '',
    tw: '',
    tahun: '',
    kategori: '',
    risiko: [],
    nodata: false
  });

  // Fungsi untuk isi detail risiko sesuai score
  function getRisikoDetail(score) {
    if (score === 1) {
      return {
        kategori: 'RENDAH',
        risiko: [
          { judul: 'Risiko aspek Output:', items: ['Risiko rendah pada output.'] },
          { judul: 'Risiko aspek Kondisi Eksternal:', items: ['Risiko eksternal terkendali.'] }
        ],
        nodata: false
      };
    } else if (score === 2) {
      return {
        kategori: 'MODERAT',
        risiko: [
          { judul: 'Risiko aspek Output:', items: ['terdapat penurunan Jumlah Petugas dalam satu triwulan'] },
          { judul: 'Risiko aspek Kondisi Eksternal:', items: [
            'terdapat penurunan nilai NTP dalam satu triwulan',
            'terdapat kenaikan harga komoditas Beras Medium lebih dari 5% dalam satu triwulan'
          ]}
        ],
        nodata: false
      };
    } else if (score === 3) {
      return {
        kategori: 'TINGGI',
        risiko: [
          { judul: 'Risiko aspek Output:', items: ['Risiko tinggi pada output!'] },
          { judul: 'Risiko aspek Kondisi Eksternal:', items: ['Risiko eksternal sangat tinggi!'] }
        ],
        nodata: false
      };
    } else {
      return {
        kategori: '',
        risiko: [],
        nodata: true
      };
    }
  }

  // Fungsi untuk reload data
  const handleReload = () => {
    Swal.fire({
      title: 'Reload Data?',
      text: 'Apakah Anda yakin ingin memuat ulang data?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, reload',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        const fetchData = async () => {
          try {
            const res = await axiosJWT.get(
              `${import.meta.env.VITE_REACT_APP_LOCAL_EWS}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllEwsData(res.data);
            Swal.fire('Berhasil!', 'Data berhasil dimuat ulang.', 'success');
          } catch (err) {
            setAllEwsData([]);
            Swal.fire('Gagal!', 'Gagal memuat ulang data.', 'error');
          }
        };
        fetchData();
      }
    });
  };

  // Fungsi untuk download Excel
  const handleDownloadExcel = () => {
    try {
      // Siapkan data untuk Excel
      const excelData = kanwilRows.map((row, index) => ({
        'No': index + 1,
        'Kanwil': `${row.kdkanwil}-${row.nmkanwil}`,
        'Tahun': tahun,
        'Tw 1': row.scores['I'] ? getRisikoDetail(row.scores['I']).kategori : 'Tidak Ada Data',
        'Tw 2': row.scores['II'] ? getRisikoDetail(row.scores['II']).kategori : 'Tidak Ada Data',
        'Tw 3': row.scores['III'] ? getRisikoDetail(row.scores['III']).kategori : 'Tidak Ada Data',
        'Tw 4': row.scores['IV'] ? getRisikoDetail(row.scores['IV']).kategori : 'Tidak Ada Data'
      }));

      // Buat workbook dan worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set lebar kolom
      const colWidths = [
        { wch: 5 },   // No
        { wch: 25 },  // Kanwil (lebih lebar untuk menampung gabungan)
        { wch: 8 },   // Tahun
        { wch: 12 },  // Tw 1
        { wch: 12 },  // Tw 2
        { wch: 12 },  // Tw 3
        { wch: 12 }   // Tw 4
      ];
      ws['!cols'] = colWidths;

      // Tambahkan worksheet ke workbook
      XLSX.utils.book_append_sheet(wb, ws, 'EWS Data');

      // Download file
      const filterSuffix = `${tahun}`;
      XLSX.writeFile(wb, `EWS_Data_MBG_${filterSuffix}.xlsx`);
      
      Swal.fire('Sukses!', 'File Excel berhasil diunduh.', 'success');
    } catch (error) {
      console.error('Error generating Excel:', error);
      Swal.fire('Gagal', 'Gagal membuat file Excel. Silakan coba lagi.', 'error');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(kanwilRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = kanwilRows.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            padding: '6px 12px',
            margin: '0 2px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          &lt;
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: '6px 12px',
            margin: '0 2px',
            border: '1px solid #cbd5e1',
            background: i === currentPage ? '#3b82f6' : '#fff',
            color: i === currentPage ? 'white' : '#374151',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: i === currentPage ? 'bold' : 'normal'
          }}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            padding: '6px 12px',
            margin: '0 2px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          &gt;
        </button>
      );
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 8 }}>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          Halaman {currentPage} dari {totalPages} ({kanwilRows.length} total data)
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {pages}
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 22 }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18, color: '#1e293b' }}>
        Early Warning System (EWS) - Status Risiko MBG per Kanwil
      </h2>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600 }}>Tahun:</label>
        <select
          value={tahun}
          onChange={e => setTahun(Number(e.target.value))}
          style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, minWidth: 100 }}
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
        
        {/* Compact icon buttons aligned with dropdowns */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <button 
            onClick={handleDownloadExcel} 
            style={{ 
              padding: '6px', 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32
            }}
            title="Download Excel"
          >
            {/* Download icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="4" y="19" width="16" height="2" rx="1" fill="white"/>
            </svg>
          </button>
          <button 
            onClick={handleReload} 
            style={{ 
              padding: '6px', 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: 4, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32
            }}
            title="Reload Data"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div id="table-container" style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: '0 1px 4px #0001' }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: '#dbeafe', position: 'sticky', top: 0, zIndex: 1 }}>
            <tr style={{ height: 50 }}>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', verticalAlign: 'middle', fontSize: 17 }}>No.</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', verticalAlign: 'middle', fontSize: 17 }}>Kanwil</th>
              <th colSpan={4} style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', fontSize: 17 }}>Status Risiko</th>
            </tr>
            <tr style={{ background: '#dbeafe' }}>
              <th colSpan={2}></th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', fontSize: 16 }}>Tw I</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', fontSize: 16 }}>Tw II</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', fontSize: 16 }}>Tw III</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', fontSize: 16 }}>Tw IV</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={6} align="center" style={{ padding: 32, color: '#64748b', fontStyle: 'italic', background: '#f1f5f9' }}>Belum ada data</td>
              </tr>
            ) : (
              currentData.map((row, idx) => {
                const actualIndex = startIndex + idx; // Calculate actual index for numbering
                return (
                  <tr key={row.kdkanwil} style={{ background: actualIndex % 2 === 0 ? "#f8fafc" : "#fff" }}>
                    <td style={{ padding: 8, textAlign: "center", color: '#64748b' }}>{actualIndex + 1}</td>
                    <td style={{ padding: 8, color: "#1d4e7a", fontWeight: 600, textAlign: "left" }}>{row.kdkanwil}-{row.nmkanwil}</td>
                    {["I", "II", "III", "IV"].map(tw => {
                      const score = row.scores[tw] !== undefined ? row.scores[tw] : null;
                      const riskDetail = getRisikoDetail(score);
                      const handleClick = () => {
                        setModalData({
                          kanwil: row.nmkanwil,
                          tw,
                          tahun,
                          kategori: riskDetail.kategori,
                          risiko: riskDetail.risiko,
                          nodata: riskDetail.nodata
                        });
                        setShowModal(true);
                      };
                      return (
                        <td
                          key={tw}
                          style={{ 
                            padding: 8, 
                            textAlign: "center", 
                            background: getRiskColor(score), 
                            minWidth: 50, 
                            height: 40, 
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                          onClick={handleClick}
                        >
                          {/* Tooltip untuk kategori risiko */}
                          {score !== null ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-${row.kdkanwil}-${tw}`} style={{ fontSize: 11 }}>
                                  Kategori: {riskDetail.kategori}<br/>
                                  Klik untuk detail risiko
                                </Tooltip>
                              }
                            >
                              <span style={{ 
                                display: 'inline-block', 
                                width: '100%', 
                                height: '100%',
                                lineHeight: '24px'
                              }}>
                                {score === 1 && "Low"}
                                {score === 2 && "Moderat"}
                                {score === 3 && "High"}
                              </span>
                            </OverlayTrigger>
                          ) : (
                            <span style={{ 
                              display: 'inline-block', 
                              width: '100%', 
                              height: '100%',
                              lineHeight: '24px'
                            }}>
                              n/a
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Keterangan Warna Risiko */}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: '#f8fafc', 
        borderRadius: 8, 
        border: '1px solid #e2e8f0' 
      }}>
        <h4 style={{ 
          fontSize: 14, 
          fontWeight: 600, 
          marginBottom: 8, 
          color: '#334155' 
        }}>
          Keterangan Warna Status Risiko:
        </h4>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              background: colorMap.green, 
              borderRadius: 4,
              border: '1px solid #ccc'
            }}></div>
            <span style={{ fontSize: 12, color: '#64748b' }}>Rendah</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              background: colorMap.yellow, 
              borderRadius: 4,
              border: '1px solid #ccc'
            }}></div>
            <span style={{ fontSize: 12, color: '#64748b' }}>Moderat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              background: colorMap.red, 
              borderRadius: 4,
              border: '1px solid #ccc'
            }}></div>
            <span style={{ fontSize: 12, color: '#64748b' }}>Tinggi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ 
              width: 20, 
              height: 20, 
              background: '#eee', 
              borderRadius: 4,
              border: '1px solid #ccc'
            }}></div>
            <span style={{ fontSize: 12, color: '#64748b' }}>Tidak Ada Data</span>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered 
        animation={false} 
        backdrop={false}
        size="lg"
      >
        <Modal.Header 
          style={{ 
            background: '#dbeafe', 
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Modal.Title style={{ 
            fontWeight: 700, 
            fontSize: 20, 
            color: '#334155' 
          }}>
            Uraian Risiko Kanwil DJPb {modalData.kanwil}, periode Triwulan {modalData.tw} Tahun {modalData.tahun}
          </Modal.Title>
          <button
            onClick={() => setShowModal(false)}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px'
            }}
          >
            ✕
          </button>
        </Modal.Header>
        <Modal.Body style={{ padding: '24px' }}>
          {modalData.nodata ? (
            <div style={{ fontWeight: 600, color: '#d90429', textAlign: 'center', fontSize: 18, margin: 24 }}>
              Tidak ada data risiko untuk Kanwil ini pada triwulan tersebut.
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 16 }}>
                Kanwil DJPb {modalData.kanwil}: Kategori Risiko: <span style={{ fontWeight: 700, color: '#d90429' }}>{modalData.kategori}</span>
              </div>
              <ol style={{ paddingLeft: 18 }}>
                {modalData.risiko.map((r, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <span style={{ fontWeight: 600, textDecoration: 'underline', fontSize: 15 }}>{r.judul}</span>
                    <ul style={{ marginTop: 6 }}>
                      {r.items.map((item, j) => (
                        <li key={j} style={{ color: '#d90429', fontWeight: 500, marginBottom: 4 }}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EWS;
