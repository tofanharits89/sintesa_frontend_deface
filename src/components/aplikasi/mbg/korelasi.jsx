import React, { useState, useEffect, useContext } from "react";
import ScatterPlot from "../../chart/scatterplot_konsumsi";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

/**
 * Komponen Analisis Korelasi MBG
 * Data diambil dari database dengan kolom:
 * - total (X variable)
 * - ntp (Y variable)
 */

// Simple correlation calculation function
const calculateCorrelation = (data, xKey, yKey) => {
  const validData = data.filter(d => 
    d[xKey] != null && d[yKey] != null && 
    !isNaN(Number(d[xKey])) && !isNaN(Number(d[yKey]))
  );

  if (validData.length < 2) return null;

  const arrayX = validData.map(d => Number(d[xKey]));
  const arrayY = validData.map(d => Number(d[yKey]));

  const n = arrayX.length;
  const sumX = arrayX.reduce((sum, x) => sum + x, 0);
  const sumY = arrayY.reduce((sum, y) => sum + y, 0);
  const sumXY = arrayX.reduce((sum, x, i) => sum + x * arrayY[i], 0);
  const sumXX = arrayX.reduce((sum, x) => sum + x * x, 0);
  const sumYY = arrayY.reduce((sum, y) => sum + y * y, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export default function Korelasi() {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [data, setData] = useState([]);
  const [korelasi, setKorelasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari database
  useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        setLoading(true);
          // Query untuk mengambil data korelasi dari tabel konsumsi_mbg
        const encodedQuery = encodeURIComponent(`
          SELECT 
            provinsi,
            total,
            ntp
          FROM data_bgn.konsumsi_mbg 
          WHERE total IS NOT NULL 
            AND ntp IS NOT NULL
            AND total > 0 
            AND ntp > 0
          ORDER BY provinsi
        `);

        const cleanedQuery = decodeURIComponent(encodedQuery)
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        // Enkripsi query sesuai pattern yang digunakan di aplikasi
        const encryptedQuery = Encrypt(cleanedQuery);
        
        const response = await axiosJWT.get(
          `${import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA}${encryptedQuery}&user=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data && response.data.result) {
          const resultData = response.data.result;
          setData(resultData);
            // Hitung korelasi
          const correlationValue = calculateCorrelation(resultData, 'total', 'ntp');
          setKorelasi(correlationValue);
        } else {
          setData([]);
          setKorelasi(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        const { status, data } = err.response || {};
        const errorMessage = (data && data.error) || 
          "Terjadi Permasalahan Koneksi atau Server Backend untuk data korelasi";
        
        handleHttpError(status, errorMessage);
        setError(errorMessage);
        setData([]);
        setKorelasi(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelationData();
  }, [axiosJWT, token, username]);

    function interpretasiKorelasi(r) {
    if (r == null) return "-";
    const absR = Math.abs(r);
    if (absR >= 0.8) return "Sangat kuat";
    if (absR >= 0.6) return "Kuat";
    if (absR >= 0.4) return "Cukup kuat";
    if (absR >= 0.2) return "Lemah";
    return "Sangat lemah";
    }



  return (
    <div style={{ padding: 24, background: "#f9fafe", minHeight: "100vh" }}>
      
        <div style={{
        background: "#15803d", // hijau tua
        borderRadius: 6,
        padding: 16,
        marginBottom: 18,
        color: "#fff",
        fontWeight: 400,
        fontSize: 15,
        lineHeight: 1.7,
        textAlign: "left"
        }}>
        Analisis korelasi adalah suatu metode statistik yang digunakan untuk mengukur tingkat hubungan atau keterkaitan antara dua variabel atau lebih. Korelasi tidak hanya menunjukkan arah hubungan (positif atau negatif), tetapi juga kekuatan hubungan antara variabel-variabel tersebut. Nilai koefisien korelasi berkisar dari -1 hingga 1, di mana nilai mendekati 1 menunjukkan hubungan positif yang kuat, nilai mendekati -1 menunjukkan hubungan negatif yang kuat, dan nilai mendekati 0 berarti tidak ada hubungan yang signifikan.
        </div>      {/* Chart & Karakteristik */}
      <div style={{ display: "flex", gap: 18, marginBottom: 22 }}>
        <div style={{ flex: 1 }}>
          {/* Komponen Chart Real dari Database */}          <ScatterPlot
            data={data}
            xKey="total"
            yKey="ntp"
            xLabel="Total Penyaluran MBG"
            yLabel="NTP (Nilai Tukar Petani)"
            loading={loading}
          />
          {error && (
            <div style={{
              textAlign: "center",
              fontSize: 13,
              marginTop: 6,
              color: "#e53e3e",
              background: "#fed7d7",
              padding: 8,
              borderRadius: 4
            }}>
              Error: {error}
            </div>
          )}
        </div>
        <div style={{
          flex: 1,
          background: "#15803d", // hijau tua
          color: "#fff",
          borderRadius: 8,
          padding: 22,
          fontWeight: 400,
          fontSize: 15.5,
          minHeight: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1.8,
          letterSpacing: 0.01,
          boxShadow: "0 2px 8px #0002"
        }}>
          <div>            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: "#d1fae5", letterSpacing: 0.5 }}>Total Penyaluran MBG & Nilai Tukar Petani (NTP)</div>
            <div style={{ marginBottom: 8 }}>
              Nilai Tukar Petani (NTP) adalah indikator yang mengukur kemampuan daya beli petani. NTP dihitung dari perbandingan antara indeks harga yang diterima petani dengan indeks harga yang dibayar petani. Semakin tinggi NTP, semakin baik kemampuan daya beli petani.
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#bbf7d0", fontWeight: 600 }}>Relevansi dengan Total:</span> <br/>
              <span style={{ color: "#fff" }}>
                Analisis korelasi antara <b>Total Penyaluran MBG</b> dan <b>NTP</b> dapat memberikan wawasan tentang hubungan antara agregat tertentu dengan kesejahteraan petani. Hubungan ini penting untuk memahami dampak program terhadap sektor pertanian dan daya beli masyarakat petani.
              </span>
            </div>
            <div style={{ fontStyle: "italic", color: "#e0ffe6", fontSize: 14.5 }}>
              Data korelasi ini membantu dalam evaluasi efektivitas program terhadap peningkatan kesejahteraan petani di berbagai provinsi.
            </div>
          </div>
        </div>
      </div>      {/* Tabel hasil analisis korelasi */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: "#16a34a" }}>
          Analisis Korelasi
        </div>{loading ? (
          <div style={{
            width: "100%",
            background: "#fff",
            borderRadius: 6,
            padding: 20,
            textAlign: "center",
            color: "#6b7280"
          }}>
            Memuat data analisis korelasi dari database...
          </div>
        ) : error ? (
          <div style={{
            width: "100%",
            background: "#fed7d7",
            borderRadius: 6,
            padding: 20,
            textAlign: "center",
            color: "#e53e3e"
          }}>
            Gagal memuat data: {error}
          </div>
        ) : (
          <table style={{
            width: "100%",
            background: "#fff",
            borderCollapse: "collapse",
            marginBottom: 8,
            boxShadow: "0 1px 2px #0001",
            borderRadius: 6,
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ background: "#d1fae5" }}>
                <th style={{ padding: 8, border: "1px solid #bbf7d0" }}>Variable 1</th>
                <th style={{ padding: 8, border: "1px solid #bbf7d0" }}>Variable 2</th>
                <th style={{ padding: 8, border: "1px solid #bbf7d0" }}>Korelasi</th>
                <th style={{ padding: 8, border: "1px solid #bbf7d0" }}>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 8, border: "1px solid #bbf7d0" }}>Total Penyaluran MBG</td>
                <td style={{ padding: 8, border: "1px solid #bbf7d0" }}>Nilai Tukar Petani (NTP)</td>
                <td style={{ padding: 8, border: "1px solid #bbf7d0" }}>
                  {korelasi !== null ? korelasi.toFixed(3) : "Tidak ada data"}
                </td>
                <td style={{ padding: 8, border: "1px solid #bbf7d0" }}>
                  {data.length > 0 ? interpretasiKorelasi(korelasi) : "Data tidak tersedia"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>      {/* Penjelasan hasil analisis korelasi */}
      <div style={{
        background: "#15803d", // hijau tua
        color: "#fff",
        borderRadius: 10,
        padding: 32,
        minHeight: 120,
        fontWeight: 400,
        fontSize: 15,
        marginBottom: 32,
        display: "flex",
        alignItems: "left",
        justifyContent: "left",
        textAlign: "left",
        lineHeight: 1.7
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 12, textDecoration: "underline" }}>
            Penjelasan Hasil Analisis Korelasi
          </div>
          <div style={{ fontWeight: 400, fontSize: 15 }}>
            {loading 
              ? "Memuat analisis korelasi dari database..." 
              : error 
              ? "Gagal memuat analisis korelasi dari database"
              : data.length > 0 && korelasi !== null
              ? `Tabel ini menyajikan hasil analisis korelasi antara "Total Penyaluran MBG" dan "Nilai Tukar Petani (NTP)" berdasarkan ${data.length} data provinsi dari database. Ditemukan koefisien korelasi sebesar ${korelasi.toFixed(3)}, yang mengindikasikan adanya hubungan ${korelasi >= 0 ? 'positif' : 'negatif'} yang ${interpretasiKorelasi(korelasi).toLowerCase()} antara kedua variabel. Nilai ini menunjukkan seberapa kuat keterkaitan antara program MBG dengan pola konsumsi rumah tangga di berbagai provinsi.`
              : "Tidak ada data untuk analisis korelasi dari database"
            }
          </div>
        </div>
      </div>
    </div>
  );
}
