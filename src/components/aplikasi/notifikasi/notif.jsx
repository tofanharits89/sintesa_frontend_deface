import Swal from "sweetalert2";
import "../notifikasi/notif.css";

const Notifikasi = (message) => {
  Swal.fire({
    html: `<div className='text-danger mt-4'>${message}</div>`,
    icon: "error", // Tambahkan ikon error
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

export default Notifikasi;
