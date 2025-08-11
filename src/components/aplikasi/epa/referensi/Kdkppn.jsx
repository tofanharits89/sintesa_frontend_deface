import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../../../auth/Context";
import { handleHttpError } from "../../notifikasi/toastError";
import Encrypt from "../../../../auth/Random";

const Kdkppn = (props) => {
  const { role, kdkanwil, axiosJWT, username, token, dataEpa } =
    useContext(MyContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDataKppn = async () => {
    setLoading(true);
    let query = "";
    if (role === "3" && username) {
      // Untuk user KPPN, ambil nama KPPN via left join ke tabel users
      query = `SELECT k.kdkppn, k.nmkppn FROM dbref2025.t_kppn k LEFT JOIN v3.users u ON k.kdkppn = u.kdkppn WHERE u.username = '${username}'`;
    } else {
      // Untuk role lain, query berdasarkan kdkanwil
      let kodeKanwil = "";
      if (props.kdkanwil && props.kdkanwil.kodeKanwil) {
        const rawKode = String(props.kdkanwil.kodeKanwil).trim();
        // Pastikan 2 digit dengan leading zero jika perlu
        if (rawKode.length === 1) {
          kodeKanwil = "0" + rawKode;
        } else if (rawKode.length === 2) {
          kodeKanwil = rawKode;
        } else if (rawKode.length === 3 && rawKode.startsWith("0")) {
          // Handle '025' -> '25'
          kodeKanwil = rawKode.substring(1);
        } else {
          kodeKanwil = rawKode;
        }
      }
      // console.log('[Kdkppn] Query akan dijalankan dengan kodeKanwil:', kodeKanwil);

      if (!kodeKanwil) {
        // console.log("[Kdkppn] kodeKanwil kosong, tidak fetch data");
        setLoading(false);
        return;
      }
      query = `SELECT kdkppn,nmkppn FROM dbref2025.t_kppn WHERE kdkanwil='${kodeKanwil}'`;
    }
    const encodedQuery = encodeURIComponent(query);

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const encryptedQuery = Encrypt(cleanedQuery);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_DATAKINERJA
            }${encryptedQuery}&user=${username}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('[Kdkppn] Response data:', response.data);
      setData(response.data.result || []); // Default ke array kosong jika data kosong

      // Untuk role 3, setelah data berhasil di-fetch, update parent dengan kdkppn yang diperoleh
      if (
        role === "3" &&
        response.data.result &&
        response.data.result.length > 0
      ) {
        const kppnData = response.data.result[0];
        // console.log('[Kdkppn] Auto-setting KPPN for role 3:', kppnData.kdkppn);
        if (
          props.onChange &&
          kppnData.kdkppn &&
          props.value !== kppnData.kdkppn // hanya update jika value berbeda
        ) {
          setTimeout(() => props.onChange(kppnData.kdkppn), 0);
        }
      }
    } catch (error) {
      const { status, data } = error.response || {};
      console.error("Error fetching KPPN:", error);
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debug log untuk identifikasi masalah
    // console.log('[Kdkppn] useEffect triggered');
    // console.log('- role:', role);
    // console.log('- username:', username);
    // console.log('- props.kdkanwil:', props.kdkanwil);
    // console.log('- props.kdkanwil?.kodeKanwil:', props.kdkanwil?.kodeKanwil);

    if (role === "3" && username) {
      // Untuk user KPPN, langsung fetch berdasarkan username
      // console.log('[Kdkppn] Fetching KPPN data for role 3 user:', username);
      getDataKppn();
    } else if (props.kdkanwil && props.kdkanwil.kodeKanwil) {
      // Untuk role lain, fetch berdasarkan kodeKanwil
      // console.log('[Kdkppn] Fetching KPPN data for kodeKanwil:', props.kdkanwil.kodeKanwil);
      getDataKppn();
    } else {
      // console.log('[Kdkppn] No conditions met, skip fetch. Role:', role, 'Username:', username, 'KodeKanwil:', props.kdkanwil?.kodeKanwil);
    }
  }, [role, username, props.kdkanwil?.kodeKanwil]);

  // Debug log saat menerima props
  useEffect(() => {
    // console.log('[Kdkppn] Props received:', {
    //   role,
    //   username,
    //   'props.kdkanwil': props.kdkanwil,
    //   'props.kdkppn': props.kdkppn,
    //   'props.value': props.value,
    //   'data.length': data.length,
    //   'data': data
    // });
  }, [role, username, props.kdkanwil, props.kdkppn, props.value, data]);

  return (
    <div className="dropdown_epa">
      <label className="dropdown_epa-label text-dark" htmlFor="kppn">
        KPPN
      </label>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="dropdown_epa-select dropdown-animated"
          aria-label=".form-select-sm"
          disabled={role === "3"} // Kunci dropdown untuk user KPPN
        >
          {role === "0" || role === "1" || role === "X" ? (
            <>
              <option value="000">Semua KPPN</option>
              {data.map((item, idx) => (
                <option key={item.kdkppn + "-" + idx} value={item.kdkppn}>
                  {item.kdkppn} - {item.nmkppn}
                </option>
              ))}
            </>
          ) : role === "3" ? (
            // Untuk user KPPN, pastikan selalu tampilkan label nama KPPN
            (() => {
              // console.log('[Kdkppn] Rendering role 3, props.kdkppn:', props.kdkppn, 'props.value:', props.value, 'data:', data);

              if (data.length > 0) {
                // Jika ada data, tampilkan semua data KPPN (seharusnya hanya 1 untuk user KPPN)
                return data.map((item, idx) => (
                  <option key={item.kdkppn + "-" + idx} value={item.kdkppn}>
                    {item.kdkppn} - {item.nmkppn}
                  </option>
                ));
              } else {
                // Jika tidak ada data, tampilkan info
                return (
                  <option value="" disabled>
                    Tidak ada data KPPN untuk user ini
                  </option>
                );
              }
            })()
          ) : role === "2" ? (
            // Untuk user Kanwil, tampilkan semua KPPN di bawah Kanwil-nya
            <>
              <option value="">Pilih KPPN</option>
              {/* Debug log untuk role 2 */}
              {/* {console.log('[Kdkppn] Rendering role 2, data length:', data.length, 'data:', data)} */}
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <option key={item.kdkppn + "-" + idx} value={item.kdkppn}>
                    {item.kdkppn} - {item.nmkppn}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Tidak ada KPPN untuk Kanwil ini (data kosong)
                </option>
              )}
            </>
          ) : (
            <option value="000">Semua KPPN</option>
          )}
        </select>
      )}
    </div>
  );
};

export default Kdkppn;
