import { useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { handleHttpError } from "../notifikasi/toastError";

const SaveUserData = ({ userData, onSave, menu }) => {
  const { axiosJWT, token, username, verified } = useContext(MyContext);
  const data = { user: username, status: verified, menu: menu };
  useEffect(() => {
    if (userData) {
      const saveData = async () => {
        try {
          await axiosJWT.post(
            import.meta.env.VITE_REACT_APP_LOCAL_SIMPAN_TUKANG_INTIP,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (onSave) onSave(); // Callback untuk memberitahu bahwa penyimpanan berhasil
        } catch (error) {
          const { status, data } = error.response || {};
          handleHttpError(
            status,
            (data && data.error) ||
              "Terjadi Permasalahan Koneksi atau Server Backend"
          );
        }
      };

      saveData();
    }
  }, [userData, onSave]); // Tambahkan dependency jika diperlukan

  return null; // Komponen ini tidak menampilkan apa pun
};

export default SaveUserData;
