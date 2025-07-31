import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../notifikasi/toastError";
import { Form } from "react-bootstrap";

const CekKanwil = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");

  useEffect(() => {
    getData();
  }, [props.kanwil]);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil = `where kdkanwil = '${kdkanwil}' and kdkanwil<>'00'`;
    } else {
      filterKanwil = "where kdkanwil<>'00'";
    }

    const encodedQuery = encodeURIComponent(
      `SELECT kdkanwil,nmkanwil from dbref.t_kanwil_2014 ${filterKanwil}`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_TKD_REFERENSI_TKD
            }${encryptedQuery}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.result);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
      setLoading(false);
    }
  };
  return (
    <Form.Group controlId="inputState">
      <Form.Control
        value={props.kanwil}
        as="select"
        className="form-select form-select-md text-select"
        name={props.name}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- Pilih Kanwil --</option>
        {data.map((dau, index) => (
          <option key={index} value={dau.kdkanwil}>
            {dau.kdkanwil} - {dau.nmkanwil}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CekKanwil;
