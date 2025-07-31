import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/v3/auth/login");
  }, [navigate]);

  return <div>Loading 2...</div>;
}
