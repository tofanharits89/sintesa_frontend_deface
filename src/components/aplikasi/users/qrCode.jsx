// generateQRCode.js
import QRCode from "qrcode";

export const generateQRCode = async (pin) => {
  try {
    const qrCodeData = await QRCode.toDataURL(pin);
    return qrCodeData;
  } catch (error) {
    throw new Error("Gagal membuat QR code");
  }
};
