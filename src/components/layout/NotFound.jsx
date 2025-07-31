import React, { useContext, useEffect } from "react";
import MyContext from "../../auth/Context";
import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const { statusLogin, offline } = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   !statusLogin && navigate("/v3/auth/login");
  // }, [statusLogin]);

  // Jangan redirect jika user sedang di halaman logout
  useEffect(() => {
    // Cek apakah sedang di halaman logout
    const isOnLogoutPage = location.pathname === '/v3/landing-logout' || location.pathname === '/landing-logout';
    
    if (isOnLogoutPage) {
      return; // Jangan redirect sama sekali jika di halaman logout
    }
    
    // Hanya redirect jika bukan di halaman logout
    if (statusLogin) {
      navigate("/v3/landing/profile");
    } else {
      navigate("/v3/auth/login");
    }
  }, [statusLogin, location.pathname, navigate]);

  return (
    <main>
      <div className="container-fluid">
        <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <h1>404</h1>
          <h5>Halaman yang anda cari tidak ada !!!</h5>
        </section>
      </div>
    </main>
  );
};

export default NotFound;
