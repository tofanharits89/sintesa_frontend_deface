import Swal from "sweetalert2";

const Online = (username) => {
  Swal.fire({
    text: `${username} telah login`,
    position: "top-end",
    showConfirmButton: false,
    toast: true,
    timer: 3000,
    background: "#33B8FF",
    color: "#ffffff",
    showCloseButton: true,
  });
};

export default Online;
