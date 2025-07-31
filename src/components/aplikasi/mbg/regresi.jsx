import React, { useState, useEffect, useContext } from "react";
import RegresiLinePendidikan from "../../chart/regresiline_pendidikan";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";

/**
 * Komponen Analisis Regresi MBG
 * Data diambil dari database dengan kolom:
 * - sd_sederajat (Y variable)
 * - total (X variable)
 */

// Function to calculate comprehensive linear regression statistics
const calculateRegressionStats = (data, xKey, yKey) => {
  const validData = data.filter(d => 
    d[xKey] != null && d[yKey] != null && 
    !isNaN(Number(d[xKey])) && !isNaN(Number(d[yKey]))
  );

  if (validData.length < 3) return null;

  const x = validData.map(d => Number(d[xKey]));
  const y = validData.map(d => Number(d[yKey]));
  const n = x.length;

  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate sums of squares
  const ssXX = x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0);
  const ssYY = y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);
  const ssXY = x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0);

  // Calculate coefficients
  const beta1 = ssXY / ssXX; // slope
  const beta0 = meanY - beta1 * meanX; // intercept

  // Calculate fitted values and residuals
  const yFitted = x.map(val => beta0 + beta1 * val);
  const residuals = y.map((val, i) => val - yFitted[i]);
  const ssRes = residuals.reduce((sum, val) => sum + Math.pow(val, 2), 0);
  const ssReg = yFitted.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0);

  // Calculate R-squared and Adjusted R-squared
  const rSquared = ssReg / ssYY;
  const adjRSquared = 1 - ((ssRes / (n - 2)) / (ssYY / (n - 1)));

  // Calculate standard errors
  const mse = ssRes / (n - 2);
  const seBeta1 = Math.sqrt(mse / ssXX);
  const seBeta0 = Math.sqrt(mse * (1/n + Math.pow(meanX, 2) / ssXX));

  // Calculate t-statistics
  const tBeta0 = beta0 / seBeta0;
  const tBeta1 = beta1 / seBeta1;

  // Calculate p-values (approximation using t-distribution)
  const df = n - 2;
  const pBeta0 = 2 * (1 - tCDF(Math.abs(tBeta0), df));
  const pBeta1 = 2 * (1 - tCDF(Math.abs(tBeta1), df));

  // Calculate F-statistic
  const fStat = (ssReg / 1) / (ssRes / (n - 2));
  const pF = 1 - fCDF(fStat, 1, n - 2);

  return {
    n,
    beta0,
    beta1,
    seBeta0,
    seBeta1,
    tBeta0,
    tBeta1,
    pBeta0,
    pBeta1,
    rSquared,
    adjRSquared,
    fStat,
    pF,
    mse
  };
};

// Simple t-distribution CDF approximation
const tCDF = (t, df) => {
  if (df > 30) {
    // Use normal approximation for large df
    return normalCDF(t);
  }
  // Simplified approximation for t-distribution
  const x = t / Math.sqrt(df);
  return 0.5 + 0.5 * Math.sign(t) * Math.sqrt(1 - Math.exp(-2 * Math.abs(x)));
};

// Simple F-distribution CDF approximation
const fCDF = (f, df1, df2) => {
  if (f <= 0) return 0;
  // Very simplified approximation
  const beta = df1 / (df1 + df2 * f);
  return 1 - incompleteBeta(df1/2, df2/2, beta);
};

// Normal CDF approximation
const normalCDF = (x) => {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

// Error function approximation
const erf = (x) => {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
};

// Incomplete beta function approximation
const incompleteBeta = (a, b, x) => {
  if (x === 0) return 0;
  if (x === 1) return 1;
  // Simplified approximation
  return Math.pow(x, a) * Math.pow(1 - x, b) / (a * beta(a, b));
};

// Beta function approximation
const beta = (a, b) => {
  return gamma(a) * gamma(b) / gamma(a + b);
};

// Gamma function approximation (Stirling's approximation)
const gamma = (x) => {
  if (x < 1) return gamma(x + 1) / x;
  return Math.sqrt(2 * Math.PI / x) * Math.pow(x / Math.E, x);
};

export default function Regresi() {
  const { axiosJWT, token, username } = useContext(MyContext);
  const [regressionData, setRegressionData] = useState([]);
  const [regressionStats, setRegressionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch data dari database
  useEffect(() => {
    const fetchRegressionData = async () => {
      try {
        setLoading(true);
          // Query untuk mengambil data regresi dari tabel konsumsi_mbg
        const encodedQuery = encodeURIComponent(`
          SELECT 
            provinsi,
            sd_sederajat,
            total
          FROM data_bgn.konsumsi_mbg 
          WHERE sd_sederajat IS NOT NULL 
            AND total IS NOT NULL
            AND sd_sederajat > 0 
            AND total > 0
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
          setRegressionData(resultData);
          
          // Calculate regression statistics
          const stats = calculateRegressionStats(resultData, 'total', 'sd_sederajat');
          setRegressionStats(stats);
        } else {
          setRegressionData([]);
          setRegressionStats(null);
        }
        setError(null);      } catch (err) {
        console.error('Error fetching regression data:', err);
        const { status, data } = err.response || {};
        const errorMessage = (data && data.error) || 
          "Terjadi Permasalahan Koneksi atau Server Backend untuk data regresi";
          handleHttpError(status, errorMessage);
        setError(errorMessage);
        setRegressionData([]);
        setRegressionStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRegressionData();
  }, [axiosJWT, token, username]);return (
    <div style={{ padding: 24, background: "#f9fafe", minHeight: "100vh" }}>
      {/* Penjelasan Analisis */}
      <div style={{
        background: "#498eea",
        borderRadius: 6,
        padding: 16,
        marginBottom: 18,
        color: "#fff",
        fontWeight: 500,
        fontSize: 16,
        textAlign: "left"
      }}>
        Analisis regresi linear adalah metode statistik yang digunakan untuk memodelkan hubungan antara satu variabel dependen (atau variabel terikat/hasil) dengan satu atau lebih variabel independen (atau variabel bebas/prediktor).
      </div>

      {/* Chart & Karakteristik */}
      <div style={{ display: "flex", gap: 18, marginBottom: 22 }}>
        <div style={{ flex: 1 }}>          {/* Komponen Chart Real dari Database */}
          <RegresiLinePendidikan
            data={regressionData}
            xKey="total"
            yKey="sd_sederajat"
            xLabel="Total Penyaluran MBG"
            yLabel="Biaya Pendidikan Dasar"
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
          background: "#498eea",
          color: "#fff",
          borderRadius: 8,
          padding: 22,
          fontWeight: 500,
          fontSize: 16,
          minHeight: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span>
            Program MBG (Makan Bergizi Gratis) di sekolah-sekolah SD dan sederajat bertujuan untuk membantu pemenuhan kebutuhan gizi siswa melalui penyediaan makanan bergizi secara rutin di lingkungan sekolah. Dengan adanya MBG, sejumlah biaya yang sebelumnya harus dikeluarkan rumah tangga untuk memenuhi kebutuhan makan anak selama di sekolah dapat berkurang secara signifikan. Program MBG tidak hanya meningkatkan asupan gizi anak-anak sekolah, tetapi juga secara nyata berkontribusi menurunkan biaya sekolah SD sederajat dan menekan pengeluaran rumah tangga di seluruh provinsi. Keberadaan MBG membantu rumah tangga, terutama yang kurang mampu, dalam memenuhi kebutuhan pendidikan dan gizi anak tanpa terbebani biaya konsumsi di sekolah. Dampak penghematan ini bervariasi antar provinsi sesuai dengan tingkat biaya SD sederajat masing-masing wilayah.
          </span>
        </div>
      </div>      {/* Tabel hasil analisis regresi */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, color: "#498eea" }}>
          Hasil Analisis Regresi Linear
        </div>
        
        {loading ? (
          <div style={{
            width: "100%",
            background: "#fff",
            borderRadius: 6,
            padding: 20,
            textAlign: "center",
            color: "#6b7280"
          }}>
            Memuat data analisis regresi dari database...
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
        ) : regressionStats ? (
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {/* Model Summary Table */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "#374151" }}>
                Model Summary
              </div>
              <table style={{
                width: "100%",
                background: "#fff",
                borderCollapse: "collapse",
                boxShadow: "0 1px 2px #0001",
                borderRadius: 6,
                overflow: "hidden"
              }}>
                <thead>
                  <tr style={{ background: "#e7f0fe" }}>
                    <th style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>Statistic</th>
                    <th style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>R-squared</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.rSquared.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>Adjusted R-squared</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.adjRSquared.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>F-statistic</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.fStat.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>Prob (F-statistic)</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.pF.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>No. Observations</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.n}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Coefficients Table */}
            <div style={{ flex: 2 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "#374151" }}>
                Coefficients
              </div>
              <table style={{
                width: "100%",
                background: "#fff",
                borderCollapse: "collapse",
                boxShadow: "0 1px 2px #0001",
                borderRadius: 6,
                overflow: "hidden"
              }}>
                <thead>                  <tr style={{ background: "#e7f0fe" }}>
                    <th style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>Variable</th>
                    <th style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>Coefficient</th>
                    <th style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>Std. Error</th>
                    <th style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>t-stat</th>
                    <th style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>P&gt;|t|</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12, fontWeight: 500 }}>Constant</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.beta0.toFixed(6)}</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.seBeta0.toFixed(6)}</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.tBeta0.toFixed(4)}</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.pBeta0.toFixed(4)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12, fontWeight: 500 }}>Total MBG</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.beta1.toFixed(6)}</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.seBeta1.toFixed(6)}</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.tBeta1.toFixed(4)}</td>
                    <td style={{ padding: 8, border: "1px solid #d1e1fd", fontSize: 12 }}>{regressionStats.pBeta1.toFixed(4)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{
            width: "100%",
            background: "#fff",
            borderRadius: 6,
            padding: 20,
            textAlign: "center",
            color: "#6b7280"
          }}>
            Tidak ada data untuk analisis regresi
          </div>
        )}
      </div>      {/* Penjelasan hasil analisis regresi */}
      <div style={{
        background: "#498eea",
        color: "#fff",
        borderRadius: 10,
        padding: 32,
        minHeight: 120,
        fontWeight: 500,
        fontSize: 17,
        marginBottom: 32,
        display: "flex",
        alignItems: "left",
        justifyContent: "left"
      }}>
        <span style={{ textAlign: "left", lineHeight: "1.5" }}>
          {loading 
            ? "Memuat analisis regresi dari database..." 
            : error 
            ? "Gagal memuat analisis regresi dari database"
            : regressionStats 
            ? (
              <div>
                <div style={{ textDecoration: "underline", marginBottom: "10px" }}>
                  Interpretasi Hasil Analisis Regresi Linear
                </div>
                <div style={{ fontSize: "15px", fontWeight: "400" }}>
                  Model regresi Y = {regressionStats.beta0.toFixed(4)} + {regressionStats.beta1.toFixed(6)}X menunjukkan 
                  hubungan antara Total Penyaluran MBG dan Biaya Pendidikan Dasar. 
                  Nilai R² = {regressionStats.rSquared.toFixed(4)} ({(regressionStats.rSquared * 100).toFixed(1)}%) 
                  menunjukkan proporsi variasi biaya pendidikan yang dapat dijelaskan oleh model. 
                  {regressionStats.pBeta1 < 0.05 
                    ? `Koefisien MBG sebesar ${regressionStats.beta1.toFixed(6)} signifikan (p < 0.05), menunjukkan hubungan yang bermakna.`
                    : `Koefisien MBG tidak signifikan (p = ${regressionStats.pBeta1.toFixed(4)}), menunjukkan hubungan yang tidak bermakna secara statistik.`
                  }
                </div>
              </div>
            )
            : "Tidak ada data untuk analisis regresi dari database"
          }
        </span>
      </div>
    </div>
  );
}
