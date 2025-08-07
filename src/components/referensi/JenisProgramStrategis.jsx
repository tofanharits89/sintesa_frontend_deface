import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import MyContext from "../../auth/Context";
import Encrypt from "../../auth/Random";


const JenisProgramStrategis = (props) => {
  const [data, setData] = useState([]);
  const { axiosJWT, token, username } = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProgramStrategisOptions = async () => {
      setIsLoading(true);
      try {        
        const query = `SELECT DISTINCT kdprogis, nmprogis FROM dbref.t_progis_2025`;
        const encryptedQuery = Encrypt(query);
        
        const response = await axiosJWT.get(import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL
            ? `${import.meta.env.VITE_REACT_APP_LOCAL_SPASIAL}${encodeURIComponent(encryptedQuery)}`
            : "",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // console.log("Response from JenisProgramStrategis:", response.data);
        
        if (response.data && response.data.result) {
          const options = [
            { value: "00", label: "Semua Program Strategis" },
            ...response.data.result.map(item => ({
              value: item.kdprogis,
              label: `${item.kdprogis} - ${item.nmprogis}`
            }))
          ];
          setData(options);
          console.log("Data fetched for JenisProgramStrategis:", options);
        }
      } catch (err) {
        // console.error('Error fetching regional options:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Regional',
          text: 'Terjadi permasalahan saat mengambil data regional. Silakan coba lagi nanti.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgramStrategisOptions();
  }, [axiosJWT, token]);
  
  return isLoading ? (
    <div>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>  
      Loading...
    </div>
  ) : (
    <>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="form-select form-select-sm text-select"
        aria-label=".form-select-sm"
        disabled={isLoading}
      >
        {data.map((row, index) => (
          <option key={index} value={row.value}>
            {row.label}
          </option>
        ))}
      </select>
    </>
  )
};

export default JenisProgramStrategis;
