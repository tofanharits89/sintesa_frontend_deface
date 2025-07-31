import Swal from "sweetalert2";
import "../notifikasi/notif.css";

const NotifikasiSukses = (message) => {
  Swal.fire({
    html: `<div className='text-success mt-4'>${message}</div>`,
    icon: "success", // Tambahkan ikon error
    position: "top",
    buttonsStyling: false,
    customClass: {
      popup: "swal2-animation",
      container: "swal2-animation",
      confirmButton: "swal2-confirm ", // Gunakan kelas CSS kustom untuk tombol
      icon: "swal2-icon", // Gunakan kelas CSS kustom untuk ikon
    },
    confirmButtonText: "Tutup",
  });
};

export default NotifikasiSukses;
