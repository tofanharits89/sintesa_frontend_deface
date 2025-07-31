import React, { useState, useEffect, useContext} from 'react';
//import RekamPerkembangan from '../rekamperkembangan';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import MyContext from '../../../../auth/Context';
import Swal from 'sweetalert2';
import { OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';

const TRIWULANS = [
  { value: 'I', label: 'I' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
  { value: 'IV', label: 'IV' },
  { value: '', label: 'Semua Triwulan' },
];

const TAHUNS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
];

const KANWIL = [
  { value: '', label: 'Pilih Kanwil' },
  { value: 'ALL', label: 'Semua Kanwil' },
  { value: '01 - DAERAH ISTIMEWA ACEH', label: '01 - DAERAH ISTIMEWA ACEH' },
  { value: '02 - SUMATERA UTARA', label: '02 - SUMATERA UTARA' },
  { value: '03 - SUMATERA BARAT', label: '03 - SUMATERA BARAT' },
  { value: '04 - RIAU', label: '04 - RIAU' },
  { value: '05 - JAMBI', label: '05 - JAMBI' },
  { value: '06 - SUMATERA SELATAN', label: '06 - SUMATERA SELATAN' },
  { value: '08 - BENGKULU', label: '08 - BENGKULU' },
  { value: '07 - LAMPUNG', label: '07 - LAMPUNG' },
  { value: '09 - BANGKA BELITUNG', label: '09 - BANGKA BELITUNG' },
  { value: '31 - KEPULAUAN RIAU', label: '31 - KEPULAUAN RIAU' },
  { value: '11 - DKI JAKARTA', label: '11 - DKI JAKARTA' },
  { value: '12 - JAWA BARAT', label: '12 - JAWA BARAT' },
  { value: '13 - JAWA TENGAH', label: '13 - JAWA TENGAH' },
  { value: '14 - DI JOGJAKARTA', label: '14 - DI JOGJAKARTA' },
  { value: '15 - JAWA TIMUR', label: '15 - JAWA TIMUR' },
  { value: '10 - BANTEN', label: '10 - BANTEN' },
  { value: '20 - BALI', label: '20 - BALI' },
  { value: '21 - NUSA TENGGARA BARAT', label: '21 - NUSA TENGGARA BARAT' },
  { value: '22 - NUSA TENGGARA TIMUR', label: '22 - NUSA TENGGARA TIMUR' },
  { value: '16 - KALIMANTAN BARAT', label: '16 - KALIMANTAN BARAT' },
  { value: '17 - KALIMANTAN TENGAH', label: '17 - KALIMANTAN TENGAH' },
  { value: '18 - KALIMANTAN SELATAN', label: '18 - KALIMANTAN SELATAN' },
  { value: '19 - KALIMANTAN TIMUR', label: '19 - KALIMANTAN TIMUR' },
  { value: '34 - KALIMANTAN UTARA', label: '34 - KALIMANTAN UTARA' },
  { value: '27 - SULAWESI UTARA', label: '27 - SULAWESI UTARA' },
  { value: '24 - SULAWESI TENGAH', label: '24 - SULAWESI TENGAH' },
  { value: '23 - SULAWESI SELATAN', label: '23 - SULAWESI SELATAN' },
  { value: '25 - SULAWESI TENGGARA', label: '25 - SULAWESI TENGGARA' },
  { value: '26 - GORONTALO', label: '26 - GORONTALO' },
  { value: '32 - SULAWESI BARAT', label: '32 - SULAWESI BARAT' },
  { value: '29 - MALUKU', label: '29 - MALUKU' },
  { value: '28 - MALUKU UTARA', label: '28 - MALUKU UTARA' },
  { value: '33 - PAPUA BARAT', label: '33 - PAPUA BARAT' },
  { value: '30 - PAPUA', label: '30 - PAPUA' },
];

export default function Perkembangan() {
  const { axiosJWT, token, username, role, kdkanwil: userKanwil } = useContext(MyContext);
  
  // Helper functions untuk pembatasan role
  const getKanwilMapping = () => {
    return {
      "01": "01 - DAERAH ISTIMEWA ACEH",
      "02": "02 - SUMATERA UTARA", 
      "03": "03 - SUMATERA BARAT",
      "04": "04 - RIAU",
      "05": "05 - JAMBI",
      "06": "06 - SUMATERA SELATAN",
      "08": "08 - BENGKULU",
      "07": "07 - LAMPUNG",
      "09": "09 - BANGKA BELITUNG",
      "31": "31 - KEPULAUAN RIAU",
      "11": "11 - DKI JAKARTA",
      "12": "12 - JAWA BARAT",
      "13": "13 - JAWA TENGAH",
      "14": "14 - DI JOGJAKARTA",
      "15": "15 - JAWA TIMUR",
      "10": "10 - BANTEN",
      "20": "20 - BALI",
      "21": "21 - NUSA TENGGARA BARAT",
      "22": "22 - NUSA TENGGARA TIMUR",
      "16": "16 - KALIMANTAN BARAT",
      "17": "17 - KALIMANTAN TENGAH",
      "18": "18 - KALIMANTAN SELATAN",
      "19": "19 - KALIMANTAN TIMUR",
      "34": "34 - KALIMANTAN UTARA",
      "27": "27 - SULAWESI UTARA",
      "24": "24 - SULAWESI TENGAH",
      "23": "23 - SULAWESI SELATAN",
      "25": "25 - SULAWESI TENGGARA",
      "26": "26 - GORONTALO",
      "32": "32 - SULAWESI BARAT",
      "29": "29 - MALUKU",
      "28": "28 - MALUKU UTARA",
      "33": "33 - PAPUA BARAT",
      "30": "30 - PAPUA"
    };
  };

  const getDefaultKanwil = () => {
    if (role === "2" && userKanwil) {
      const mapping = getKanwilMapping();
      // Jika userKanwil sudah format lengkap, gunakan langsung
      if (userKanwil.includes(' - ')) {
        return userKanwil;
      }
      // Jika userKanwil hanya kode, convert ke format lengkap
      return mapping[userKanwil] || userKanwil;
    }
    return 'ALL';
  };

  const getKanwilOptions = () => {
    const allOptions = [
      { value: '', label: 'Pilih Kanwil' },
      { value: 'ALL', label: 'Semua Kanwil' },
      { value: '01 - DAERAH ISTIMEWA ACEH', label: '01 - DAERAH ISTIMEWA ACEH' },
      { value: '02 - SUMATERA UTARA', label: '02 - SUMATERA UTARA' },
      { value: '03 - SUMATERA BARAT', label: '03 - SUMATERA BARAT' },
      { value: '04 - RIAU', label: '04 - RIAU' },
      { value: '05 - JAMBI', label: '05 - JAMBI' },
      { value: '06 - SUMATERA SELATAN', label: '06 - SUMATERA SELATAN' },
      { value: '08 - BENGKULU', label: '08 - BENGKULU' },
      { value: '07 - LAMPUNG', label: '07 - LAMPUNG' },
      { value: '09 - BANGKA BELITUNG', label: '09 - BANGKA BELITUNG' },
      { value: '31 - KEPULAUAN RIAU', label: '31 - KEPULAUAN RIAU' },
      { value: '11 - DKI JAKARTA', label: '11 - DKI JAKARTA' },
      { value: '12 - JAWA BARAT', label: '12 - JAWA BARAT' },
      { value: '13 - JAWA TENGAH', label: '13 - JAWA TENGAH' },
      { value: '14 - DI JOGJAKARTA', label: '14 - DI JOGJAKARTA' },
      { value: '15 - JAWA TIMUR', label: '15 - JAWA TIMUR' },
      { value: '10 - BANTEN', label: '10 - BANTEN' },
      { value: '20 - BALI', label: '20 - BALI' },
      { value: '21 - NUSA TENGGARA BARAT', label: '21 - NUSA TENGGARA BARAT' },
      { value: '22 - NUSA TENGGARA TIMUR', label: '22 - NUSA TENGGARA TIMUR' },
      { value: '16 - KALIMANTAN BARAT', label: '16 - KALIMANTAN BARAT' },
      { value: '17 - KALIMANTAN TENGAH', label: '17 - KALIMANTAN TENGAH' },
      { value: '18 - KALIMANTAN SELATAN', label: '18 - KALIMANTAN SELATAN' },
      { value: '19 - KALIMANTAN TIMUR', label: '19 - KALIMANTAN TIMUR' },
      { value: '34 - KALIMANTAN UTARA', label: '34 - KALIMANTAN UTARA' },
      { value: '27 - SULAWESI UTARA', label: '27 - SULAWESI UTARA' },
      { value: '24 - SULAWESI TENGAH', label: '24 - SULAWESI TENGAH' },
      { value: '23 - SULAWESI SELATAN', label: '23 - SULAWESI SELATAN' },
      { value: '25 - SULAWESI TENGGARA', label: '25 - SULAWESI TENGGARA' },
      { value: '26 - GORONTALO', label: '26 - GORONTALO' },
      { value: '32 - SULAWESI BARAT', label: '32 - SULAWESI BARAT' },
      { value: '29 - MALUKU', label: '29 - MALUKU' },
      { value: '28 - MALUKU UTARA', label: '28 - MALUKU UTARA' },
      { value: '33 - PAPUA BARAT', label: '33 - PAPUA BARAT' },
      { value: '30 - PAPUA', label: '30 - PAPUA' },
    ];

    if (role === "2" && userKanwil) {
      const mapping = getKanwilMapping();
      // Jika userKanwil sudah format lengkap, gunakan langsung
      if (userKanwil.includes(' - ')) {
        return [{ value: userKanwil, label: userKanwil }];
      }
      // Jika userKanwil hanya kode, convert ke format lengkap
      const fullFormat = mapping[userKanwil];
      return fullFormat ? [{ value: fullFormat, label: fullFormat }] : [{ value: userKanwil, label: userKanwil }];
    }
    return allOptions;
  };

  const [data, setData] = useState([]);
  const [tahun, setTahun] = useState('2025');
  const [triwulan, setTriwulan] = useState(''); // default: semua triwulan
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [manualFetch, setManualFetch] = useState(false);
  const [kode_kanwil, setKanwil] = useState(getDefaultKanwil());
  const [downloadFormat, setDownloadFormat] = useState('pdf'); // State untuk format download
  const [detailModal, setDetailModal] = useState({ show: false, row: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch data on first load and every filter change (boleh salah satu saja)
  useEffect(() => {
    fetchData();
    setCurrentPage(1); // Reset ke halaman 1 ketika filter berubah
    // eslint-disable-next-line
  }, [kode_kanwil, triwulan, tahun]);

  // Membuat query string dari filter
  const getQueryString = () => {
    const params = new URLSearchParams({
      tahun,
      triwulan, // biarkan kosong jika ingin semua triwulan
      kode_kanwil: (kode_kanwil === 'ALL' || kode_kanwil === '') ? 'ALL' : kode_kanwil.split(' - ')[0],
    });
    return `?${params.toString()}`;
  };

  const fetchData = async () => {
    try {
      const queryString = getQueryString();
      const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_NARASI + queryString, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      
      // Parse response data yang sudah digabungkan dari backend
      const responseData = response.data?.data || [];
      
      if (Array.isArray(responseData) && responseData.length > 0) {
        // Map data sesuai struktur yang dikembalikan dari backend
        const mappedData = responseData.map((row, index) => {
          return {
            id: `${row.Kanwil || 'unknown'}_${row.triwulan}`,
            kanwil: row.Kanwil || 'Unknown',
            triwulan: row.triwulan || 'Unknown',
            tahun: row.tahun || 'Unknown',
            perkembangan_makrokesra: row.perkembangan_makrokesra || 'Belum ada data',
            perkembangan_harga_komoditas: row.perkembangan_harga_komoditas || 'Belum ada data',
            perkembangan_lainnya: row.perkembangan_lainnya || 'Belum ada data',
            permasalahan_isu: row.permasalahan_isu || 'Belum ada data',
            kesimpulan: row.kesimpulan || 'Belum ada data',
            rekomendasi: row.rekomendasi || 'Belum ada data'
          };
        });
        
        setData(mappedData);
      } else {
        setData([]);
      }
      
    } catch (err) {
      if (err.response) {
        console.error("Error status:", err.response.status);
      }
      Swal.fire({
        title: 'Gagal Fetch Data',
        text: err.response?.data?.error || err.message,
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
      setData([]);
    }
  };

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
        fetchData();
        Swal.fire('Berhasil!', 'Data berhasil dimuat ulang.', 'success');
      }
    });
  };

  const handleDownloadExcel = () => {
    try {
      // Siapkan data untuk Excel
      const excelData = data.map((row, index) => ({
        'No': index + 1,
        'Kanwil': row.kanwil || '-',
        'Triwulan': row.triwulan || '-',
        'Tahun': row.tahun || '-',
        'Perkembangan Makrokesra': row.perkembangan_makrokesra || '-',
        'Perkembangan Harga Komoditas': row.perkembangan_harga_komoditas || '-',
        'Perkembangan Lainnya': row.perkembangan_lainnya || '-',
        'Permasalahan/Isu': row.permasalahan_isu || '-',
        'Kesimpulan': row.kesimpulan || '-',
        'Rekomendasi': row.rekomendasi || '-'
      }));

      // Buat workbook dan worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set lebar kolom
      const colWidths = [
        { wch: 5 },   // No
        { wch: 15 },  // Kanwil
        { wch: 10 },  // Triwulan
        { wch: 8 },   // Tahun
        { wch: 30 },  // Perkembangan Makrokesra
        { wch: 30 },  // Perkembangan Harga Komoditas
        { wch: 30 },  // Perkembangan Lainnya
        { wch: 30 },  // Permasalahan/Isu
        { wch: 25 },  // Kesimpulan
        { wch: 25 }   // Rekomendasi
      ];
      ws['!cols'] = colWidths;

      // Tambahkan worksheet ke workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Narasi Perkembangan');

      // Download file
      const filterSuffix = `${kode_kanwil === 'ALL' ? 'All' : kode_kanwil.split(' - ')[0]}_${triwulan || 'All'}_${tahun}`;
      XLSX.writeFile(wb, `Narasi_Perkembangan_MBG_${filterSuffix}.xlsx`);
      
      Swal.fire('Sukses!', 'File Excel berhasil diunduh.', 'success');
    } catch (error) {
      console.error('Error generating Excel:', error);
      Swal.fire('Gagal', 'Gagal membuat file Excel. Silakan coba lagi.', 'error');
    }
  };

  const handleDownload = () => {
    const formatText = downloadFormat === 'pdf' ? 'PDF' : 'Excel';
    
    Swal.fire({
      title: `Download ${formatText}?`,
      text: `Apakah Anda ingin mengunduh data dalam format ${formatText}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Download',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        if (downloadFormat === 'pdf') {
          handleDownloadPDFDirect();
        } else {
          handleDownloadExcel();
        }
      }
    });
  };

  const handleDownloadPDFDirect = async () => {
    const element = document.getElementById('table-container');
    if (!element) return;
    
    try {
      // Temporarily remove scroll and set fixed height to capture all content
      const originalStyle = {
        overflowX: element.style.overflowX,
        overflowY: element.style.overflowY,
        height: element.style.height,
        maxHeight: element.style.maxHeight
      };
      
      // Set styles to show all content
      element.style.overflowX = 'visible';
      element.style.overflowY = 'visible';
      element.style.height = 'auto';
      element.style.maxHeight = 'none';
      
      // Wait a bit for style changes to take effect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        scale: 1.5, // Slightly reduce scale for better performance
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: false,
        height: element.scrollHeight, // Capture full height
        width: element.scrollWidth,   // Capture full width
        scrollX: 0,
        scrollY: 0
      });
      
      // Restore original styles
      element.style.overflowX = originalStyle.overflowX;
      element.style.overflowY = originalStyle.overflowY;
      element.style.height = originalStyle.height;
      element.style.maxHeight = originalStyle.maxHeight;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
      
      // Calculate dimensions to fit content
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add header
      pdf.setFontSize(14);
      pdf.text('Daftar Narasi Perkembangan/Isu Pelaksanaan Program MBG per Wilayah', 10, 15);
      pdf.setFontSize(10);
      const filterText = `Filter: Kanwil: ${kode_kanwil === 'ALL' ? 'Semua Kanwil' : (kode_kanwil || 'Semua Kanwil')}, Triwulan: ${triwulan || 'Semua Triwulan'}, Tahun: ${tahun}`;
      pdf.text(filterText, 10, 22);
      
      let yPosition = 30;
      
      // If image is too tall for one page, split it across multiple pages
      if (imgHeight > pdfHeight - yPosition) {
        const pageHeight = pdfHeight - yPosition;
        const totalPages = Math.ceil(imgHeight / pageHeight);
        
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage();
            yPosition = 10;
          }
          
          const sourceY = i * (canvas.height / totalPages);
          const sourceHeight = canvas.height / totalPages;
          
          // Create a temporary canvas for this page
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          const tempCtx = tempCanvas.getContext('2d');
          
          tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
          const tempImgData = tempCanvas.toDataURL('image/png');
          
          pdf.addImage(tempImgData, 'PNG', 10, yPosition, imgWidth, pageHeight);
        }
      } else {
        // Image fits on one page
        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      }
      
      pdf.save(`Narasi_Perkembangan_MBG_${tahun}_${triwulan || 'All'}.pdf`);
      Swal.fire('Sukses!', 'PDF berhasil diunduh.', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire('Gagal', 'Gagal membuat PDF. Silakan coba lagi.', 'error');
    }
  };

  // Fungsi untuk membatasi teks maksimal 6 kata
  function sliceWords(text, maxWords = 6) {
    if (!text) return '-';
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

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
          Halaman {currentPage} dari {totalPages} ({data.length} total data)
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
        Daftar Narasi Perkembangan/Isu Pelaksanaan Program MBG per Wilayah
      </h2>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600 }}>Kanwil:</label>
        <select 
          value={kode_kanwil} 
          onChange={e => {
            console.log('Kanwil changed to:', e.target.value);
            setKanwil(e.target.value);
          }} 
          disabled={role === "2"}
          style={{ 
            padding: '6px 12px', 
            borderRadius: 8, 
            border: '1px solid #cbd5e1', 
            fontSize: 12, 
            minWidth: 220,
            backgroundColor: role === "2" ? '#f1f5f9' : 'white',
            cursor: role === "2" ? 'not-allowed' : 'pointer'
          }}
        >
          {getKanwilOptions().map(k => (
            <option value={k.value} key={k.value}>{k.label}</option>
          ))}
        </select>
        <label style={{ fontWeight: 600 }}>Triwulan:</label>
        <select value={triwulan} onChange={e => {
          console.log('Triwulan changed to:', e.target.value);
          setTriwulan(e.target.value);
        }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}>
          {TRIWULANS.map(tw => (
            <option value={tw.value} key={tw.value}>{tw.label}</option>
          ))}
        </select>
        <label style={{ fontWeight: 600 }}>Tahun:</label>
        <select value={tahun} onChange={e => {
          console.log('Tahun changed to:', e.target.value);
          setTahun(e.target.value);
        }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}>
          {TAHUNS.map(t => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
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
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ background: '#dbeafe', position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Kanwil</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Triwulan</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Perkembangan Makrokesra</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Perkembangan Harga Komoditas</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Perkembangan Lainya</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Permasalahan/Isu</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Kesimpulan</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Rekomendasi</th>
              <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center' }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={9} align="center" style={{ padding: 32, color: '#64748b', fontStyle: 'italic', background: '#f1f5f9' }}>Belum ada data</td>
              </tr>
            ) : (
              currentData.map((row, idx) => (
                <tr key={row.id || idx} style={{ background: idx % 2 === 0 ? '#f8fafc' : '#fff' }}>
                  <td style={{ padding: 8 }}>{row.kanwil || row.Kanwil || '-'}</td>
                  <td style={{ padding: 8 }}>{row.triwulan || '-'}</td>
                  <td style={{ padding: 8, whiteSpace: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, cursor: 'pointer', textAlign: 'left' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-makrokesra-${idx}`} style={{ maxWidth: 1000, whiteSpace: 'pre-wrap', fontSize: 10, textAlign: 'left' }}>{row.perkembangan_makrokesra || '-'}</Tooltip>}
                    >
                      <span>{sliceWords(row.perkembangan_makrokesra)}</span>
                    </OverlayTrigger>
                  </td>
                  <td style={{ padding: 8, whiteSpace: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, cursor: 'pointer', textAlign: 'left' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-komoditas-${idx}`}style={{ maxWidth: 1000, whiteSpace: 'pre-wrap', fontSize: 10, textAlign: 'left' }}>{row.perkembangan_harga_komoditas || '-'}</Tooltip>}
                    >
                      <span>{sliceWords(row.perkembangan_harga_komoditas)}</span>
                    </OverlayTrigger>
                  </td>
                  <td style={{ padding: 8, whiteSpace: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, cursor: 'pointer', textAlign: 'left' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-lainnya-${idx}`}style={{ maxWidth: 1000, whiteSpace: 'pre-wrap', fontSize: 10, textAlign: 'left' }}>{row.perkembangan_lainnya || '-'}</Tooltip>}
                    >
                      <span>{sliceWords(row.perkembangan_lainnya)}</span>
                    </OverlayTrigger>
                  </td>
                  <td style={{ padding: 8, whiteSpace: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, cursor: 'pointer', textAlign: 'left' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-isu-${idx}`}style={{ maxWidth: 1000, whiteSpace: 'pre-wrap', fontSize: 10, textAlign: 'left' }}>{row.permasalahan_isu || '-'}</Tooltip>}
                    >
                      <span>{sliceWords(row.permasalahan_isu)}</span>
                    </OverlayTrigger>
                  </td>
                  <td style={{ padding: 8, whiteSpace: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, cursor: 'pointer', textAlign: 'left' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-kesimpulan-${idx}`}style={{ maxWidth: 1000, whiteSpace: 'pre-wrap', fontSize: 10, textAlign: 'left' }}>{row.kesimpulan || '-'}</Tooltip>}
                    >
                      <span>{sliceWords(row.kesimpulan)}</span>
                    </OverlayTrigger>
                  </td>
                  <td style={{ padding: 8, whiteSpace: 'wrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, cursor: 'pointer', textAlign: 'left' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-rekomendasi-${idx}`}style={{ maxWidth: 1000, whiteSpace: 'pre-wrap', fontSize: 10, textAlign: 'left' }}>{row.rekomendasi || '-'}</Tooltip>}
                    >
                      <span>{sliceWords(row.rekomendasi)}</span>
                    </OverlayTrigger>
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <button
                      onClick={() => setDetailModal({ show: true, row })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        margin: 0,
                        color: '#6366f1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28
                      }}
                      title="Lihat Detail"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="7" stroke="#6366f1" strokeWidth="2"/>
                        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Modal Detail */}
      <Modal show={detailModal.show} onHide={() => setDetailModal({ show: false, row: null })} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Detail Narasi Perkembangan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailModal.row && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                <thead style={{ background: '#dbeafe' }}>
                  <tr>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Kanwil</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Triwulan</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Tahun</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Perkembangan Makrokesra</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Perkembangan Harga Komoditas</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Perkembangan Lainnya</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Permasalahan/Isu</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Kesimpulan</th>
                    <th style={{ padding: 8, fontWeight: 700, color: '#334155', textAlign: 'center', wordBreak: 'break-word' }}>Rekomendasi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, textAlign: 'center', wordBreak: 'break-word' }}>{detailModal.row.kanwil || '-'}</td>
                    <td style={{ padding: 8, textAlign: 'center', wordBreak: 'break-word' }}>{detailModal.row.triwulan || '-'}</td>
                    <td style={{ padding: 8, textAlign: 'center', wordBreak: 'break-word' }}>{detailModal.row.tahun || '-'}</td>
                    <td style={{ padding: 8, wordBreak: 'break-word' }}>{detailModal.row.perkembangan_makrokesra || '-'}</td>
                    <td style={{ padding: 8, wordBreak: 'break-word' }}>{detailModal.row.perkembangan_harga_komoditas || '-'}</td>
                    <td style={{ padding: 8, wordBreak: 'break-word' }}>{detailModal.row.perkembangan_lainnya || '-'}</td>
                    <td style={{ padding: 8, wordBreak: 'break-word' }}>{detailModal.row.permasalahan_isu || '-'}</td>
                    <td style={{ padding: 8, wordBreak: 'break-word' }}>{detailModal.row.kesimpulan || '-'}</td>
                    <td style={{ padding: 8, wordBreak: 'break-word' }}>{detailModal.row.rekomendasi || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
