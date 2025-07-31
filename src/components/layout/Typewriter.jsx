import React, { useState, useEffect } from "react";

const Typewriter = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = -1; // mengubah i menjadi -1
    const timer = setInterval(() => {
      if (i < text.length - 1) {
        // mengubah kondisi untuk menghentikan interval
        i++;
        setDisplayText((prev) => prev + text.charAt(i));
      } else {
        clearInterval(timer);
      }
    }, 100); // ubah kecepatan mengetik di sini (dalam milidetik)

    return () => clearInterval(timer);
  }, [text]);

  return <>{displayText}</>;
};

export default Typewriter;
