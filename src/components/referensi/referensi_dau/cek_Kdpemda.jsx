import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Button, Container, Spinner, Form } from "react-bootstrap";

const CekKdpemda = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");

  useEffect(() => {
    props.kppn && getData();
  }, [props.kppn, props.kdpemda]);

  useEffect(() => {
    props.kppn && getData();
    setData([]);
  }, [props.kppn]);

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
      `select kdkppn,nmkppn,kdkabkota,nmkabkota from tkd.t_kppn_lok where kdkppn='${props.kppn}'`
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
        value={props.kdpemda}
        as="select"
        className="form-select form-select-md text-select"
        name={props.name}
        onChange={(e) => props.onChange(e.target.value)} // Pass the selected value to props.onChange
      >
        <option value="">-- Pilih Kabupaten/ Kota --</option>
        {data.map((dau, index) => (
          <option key={index} value={dau.kdkabkota}>
            {dau.kdkabkota} - {dau.nmkabkota}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CekKdpemda;
