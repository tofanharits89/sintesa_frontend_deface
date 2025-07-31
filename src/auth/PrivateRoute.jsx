import React, { useContext, useEffect, useState } from "react";
import MyContext from "../auth/Context";
import { Navigate } from "react-router-dom";
import CekLogin from "./CekLogin";

const PrivateRoute = ({ children }) => {
  const { statusLogin, offline, offlinest } = useContext(MyContext);
  const [authStatusKnown, setAuthStatusKnown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAuthStatusKnown(true);
    }, 1000);
  }, []);

  if (!authStatusKnown) {
    return (
      <div>
        <CekLogin />
      </div>
    );
  }
  // console.log(offline, statusLogin);
  if (!statusLogin && !offline && window.location.pathname !== "/v3/landing-logout" && window.location.pathname !== "/landing-logout") {
    return <Navigate to="/v3/auth/login" replace />;
  } else if (offline && offlinest !== "") {
    return <Navigate to="/v3/offline" replace />;
  } else {
    return children;
  }
};

export default PrivateRoute;
