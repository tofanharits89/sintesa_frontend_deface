import axios from "axios";

const BACKEND_STATUS_URL =
  import.meta.env.VITE_BACKEND_STATUS_URL || "http://localhost:88/next/status";

/**
 * Check if backend is online
 * @returns {Promise<boolean>} true if backend is online, false otherwise
 */
export const checkBackendStatus = async () => {
  try {
    const response = await axios.get(BACKEND_STATUS_URL, {
      timeout: 5000, // 5 second timeout
    });

    return response.status === 200 && response.data.status === "OK";
  } catch (error) {
    console.error("Backend status check failed:", error.message);
    return false;
  }
};

/**
 * Redirect to offline page
 */
export const redirectToOffline = () => {
  window.location.href = "/offline";
};

/**
 * Check backend status and redirect to offline page if backend is down
 */
export const checkAndRedirectIfOffline = async () => {
  const isOnline = await checkBackendStatus();

  if (!isOnline) {
    redirectToOffline();
  }

  return isOnline;
};
