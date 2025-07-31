import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Button, Container, Spinner, Form } from "react-bootstrap";

const RefPencabutan = (props) => {
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
      `select kmktunda,no_kmkcabut,tglcabut,uraiancabut,thangcabut FROM tkd.ref_kmk_cabut`
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
        as="select"
        className="form-select form-select-md text-select"
        value={props.refPenundaan}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- Pilih KMK --</option>
        {data
          .filter((item) => item.kmktunda === props.refPencabutan)
          .map((dau, index) => (
            <option
              key={index}
              value={`${dau.no_kmkcabut}*${dau.tglcabut}*${dau.uraiancabut}*${dau.thangcabut}`}
            >
              {dau.no_kmkcabut}
            </option>
          ))}
      </Form.Control>
    </Form.Group>
  );
};

export default RefPencabutan;
