import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Button, Container, Spinner, Form } from "react-bootstrap";

const RefPenundaan25 = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    let filterKanwil = "";
    if (role === "2") {
      filterKanwil =
        props.where +
        (props.where ? " AND " : "") +
        `a.kdkanwil = '${kdkanwil}'`;
    } else {
      filterKanwil = props.where;
    }

    const encodedQuery = encodeURIComponent(
      `SELECT DISTINCT(no_kmk) no_kmk,jenis,kriteria,uraian FROM tkd25.ref_kmk_dau where jenis='2'`
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    setSql(cleanedQuery);
    const encryptedQuery = Encrypt(cleanedQuery);
    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
          ? `${
              import.meta.env.VITE_REACT_APP_TKD_REFERENSI_TKD_25
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
        as="select"
        className="form-select form-select-md text-select"
        value={props.refPenundaan}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- Pilih KMK --</option>
        {data
          .filter((item) => item.kriteria === props.kriteria)
          .map((dau, index) => (
            <option key={index} value={dau.no_kmk}>
              {dau.no_kmk}
            </option>
          ))}
      </Form.Control>
    </Form.Group>
  );
};

export default RefPenundaan25;
