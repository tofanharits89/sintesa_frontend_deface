import Swal from "sweetalert2";

const showToast = (pesan) => {
  Swal.close(); // Menutup notifikasi yang sedang ditampilkan

  setTimeout(() => {
    Swal.fire({
      text: `${pesan} `,
      position: "top-end",
      showConfirmButton: false,
      toast: true,
      timer: 5000,
      background: "black",
      color: "#ffffff",
      showClass: {
        popup: "animate__animated ",
      },
    });
  }, 500); // Menunggu 500ms sebelum menampilkan notifikasi baru
};
const NotifikasiToast = async (pesan) => {
  await Swal.fire({
    text: `${pesan} 👋`,
    position: "top-end",
    showConfirmButton: false,
    toast: true,
    timer: 3000,
    background: "#C16DFA",
    color: "#ffffff",
  });
};

const NotifikasiToastEPA = async (pesan) => {
  await Swal.fire({
    text: `${pesan} `,
    position: "top-start",
    showConfirmButton: false,
    toast: true,
    timer: 3000,
    background: "#17c3fa",
    color: "#ffffff",
  });
};

export const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "custom-toast-font custom-toast-primary-light",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const NotifikasiDisclaimer = async (pesan) => {
  await Swal.fire({
    text: `${pesan} `,
    position: "top-start",
    showConfirmButton: false,
    toast: true,
    timer: 5000,
    background: "#FF5733",
    color: "#ffffff",
    showCloseButton: true,
  });
};

const UserLogin = async (pesan) => {
  await Swal.fire({
    text: `${pesan} `,
    position: "bottom-start",
    showConfirmButton: false,
    toast: true,
    timer: 3000,
    background: "#FF5733",
    color: "#ffffff",
    showCloseButton: true,
    animation: false,
  });
};

export const Omspan = (username, message) => {
  showToast(username, message);
};

export const Tunda = (username) => {
  showToast(username, "Tunda OMSPAN berhasil");
};

export const Pesan = (pesan) => {
  showToast(pesan);
};
export const NotifPesan = (pesan) => {
  NotifikasiToast(pesan);
};

export const NotifDisclaimer = (pesan) => {
  NotifikasiDisclaimer(pesan);
};

export const ToastUserLogin = (pesan) => {
  UserLogin(pesan);
};

export const EPANOTIF = (pesan) => {
  NotifikasiToastEPA(pesan);
};
