import React, { useState, useEffect } from "react";

const SleepingCat = () => {
  const [isAwake, setIsAwake] = useState(true);

  useEffect(() => {
    let activityTimer;

    const handleUserActivity = () => {
      setIsAwake(true); // Pengguna aktif, bangunkan kucing
      clearTimeout(activityTimer); // Reset timer
      activityTimer = setTimeout(() => {
        setIsAwake(false); // Tidak ada aktivitas, kucing tidur
      }, 30000); // Atur waktu 30 detik untuk menentukan tidak ada aktivitas
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
    };
  }, []);
  // console.log(isAwake);
  // console.log(`${import.meta.env.VITE_PUBLIC_URL}/foto/cat3.gif`);

  return (
    <div className="sleeping-cat-container">
      {/* Backdrop */}
      {!isAwake && (
        <div className="backdrop" onClick={() => setIsAwake(true)}></div>
      )}

      {/* Kucing */}
      {isAwake ? (
        <div className="awake-test">
          {" "}
          {/* <img src="http://localhost:99/foto/bangun.gif" alt=" Cat" /> */}
        </div>
      ) : (
        <div className="asleep">
          <img
            src={`${import.meta.env.VITE_PUBLIC_URL}/foto/cat3.gif`}
            width="55%"
            height="55%"
            alt="Sleeping Cat"
          />
        </div>
      )}
    </div>
  );
};

export default SleepingCat;
