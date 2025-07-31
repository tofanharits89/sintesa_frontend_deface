import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Form } from "react-bootstrap";

const CekKppn = (props) => {
  const { axiosJWT, token, role, kdkppn } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    let filterKppn = role === "3" ? `WHERE kdkppn = '${kdkppn}'` : "";
    const query = `SELECT a.nmkppn, a.kdkppn FROM dbref.t_kppn_2025 a ${filterKppn} ORDER BY a.kdkppn`;
    const encryptedQuery = Encrypt(query);

    try {
      const response = await axiosJWT.get(
        `${
          import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
        }${encryptedQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.result);
      setLoading(false);
    } catch (error) {
      handleHttpError(
        error.response?.status,
        error.response?.data?.error ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      setLoading(false);
    }
  };

  return (
    <Form.Control
      as="select"
      value={props.value}
      className={props.className}
      onChange={(e) => props.onChange(e.target.value)}
    >
      <option value="">-- Pilih KPPN --</option>
      {data.map((dau, index) => (
        <option key={index} value={dau.kdkppn}>
          {dau.kdkppn} - {dau.nmkppn}
        </option>
      ))}
    </Form.Control>
  );
};

export default CekKppn;
