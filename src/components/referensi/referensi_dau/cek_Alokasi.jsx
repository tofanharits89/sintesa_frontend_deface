import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Button, Container, Spinner, Form, Row, Col } from "react-bootstrap";
import numeral from "numeral";

export const CekAlokasi = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");
  const [formData, setFormData] = useState({
    jan1: "0",
    peb1: "0",
    mar1: "0",
    apr1: "0",
    mei1: "0",
    jun1: "0",
    jul1: "0",
    ags1: "0",
    sep1: "0",
    okt1: "0",
    nov1: "0",
    des1: "0",
    alokasi: 0,
  });

  useEffect(() => {
    if (data.length > 0) {
      const alokasiValue = data[0].alokasi * 0.25;
      const updatedFormData = {
        jan1:
          props.bulan < "01" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        peb1:
          props.bulan < "02" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        mar1:
          props.bulan < "03" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        apr1:
          props.bulan < "04" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        mei1:
          props.bulan < "05" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        jun1:
          props.bulan < "06" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        jul1:
          props.bulan < "07" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        ags1:
          props.bulan < "08" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        sep1:
          props.bulan < "09" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        okt1:
          props.bulan < "10" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        nov1:
          props.bulan < "11" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        des1:
          props.bulan < "12" && props.kriteria === "21"
            ? String(alokasiValue)
            : "0",
        alokasi: alokasiValue,
      };
      setFormData(updatedFormData);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    props.onReceiveFormData({ ...formData, [name]: value }); // Mengirim data yang telah diubah ke komponen induk
  };

  useEffect(() => {
    props.kdpemda && getData();
  }, [props.kdpemda, props.periode]);

  useEffect(() => {
    props.kdpemda === "" && setData([]);
  }, [props.kdpemda]);

  useEffect(() => {
    setFormData({
      jan1: "0",
      peb1: "0",
      mar1: "0",
      apr1: "0",
      mei1: "0",
      jun1: "0",
      jul1: "0",
      ags1: "0",
      sep1: "0",
      okt1: "0",
      nov1: "0",
      des1: "0",
      alokasi: "0",
    });
  }, [props.kdpemda, props.kppn, props.periode]);

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

    const encodedQuery =
      encodeURIComponent(`SELECT kdkppn,nmkppn,kdpemda,nmpemda,alokasi FROM tkd.alokasi_bulanan_list
        where kdpemda='${props.kdpemda}' and bulan='${props.periode}' limit 1`);

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
  useEffect(() => {
    props.onReceiveFormData(formData); // Mengirim data yang telah diubah ke komponen induk
  }, [formData]); // Memantau perubahan pada formData

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      alokasi: data.length > 0 ? data[0].alokasi : 0,
    }));
  }, [data]);

  return (
    <>
      <h5 className="fw-bold text-center">
        <hr />
        {data[0]
          ? `   Rp. ${numeral(data[0].alokasi).format("0,0")} `
          : "   Rp. 0"}
        <hr />
      </h5>
      <div>
        <Row>
          <Col md={3}>
            <label>Januari</label>
            <input
              type="number"
              className="form-control my-2"
              id="jan1"
              name="jan1"
              value={formData.jan1}
              placeholder="Penundaan bulan Januari"
              onChange={handleInputChange}
              disabled={props.bulan >= "01" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>Pebruari</label>
            <input
              type="number"
              className="form-control my-2"
              id="peb1"
              name="peb1"
              value={formData.peb1}
              placeholder="Penundaan bulan Pebruari"
              onChange={handleInputChange}
              disabled={props.bulan >= "02" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>Maret</label>
            <input
              type="number"
              className="form-control my-2"
              id="mar1"
              name="mar1"
              value={formData.mar1}
              placeholder="Penundaan bulan Maret"
              onChange={handleInputChange}
              disabled={props.bulan >= "03" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>April</label>
            <input
              type="number"
              className="form-control my-2"
              id="apr1"
              name="apr1"
              value={formData.apr1}
              placeholder="Penundaan bulan April"
              onChange={handleInputChange}
              disabled={props.bulan >= "04" && props.kriteria === "22"}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <label>Mei</label>
            <input
              type="number"
              className="form-control my-2"
              id="mei1"
              name="mei1"
              value={formData.mei1}
              placeholder="Penundaan bulan Mei"
              onChange={handleInputChange}
              disabled={props.bulan >= "05" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>Juni</label>
            <input
              type="number"
              className="form-control my-2"
              id="jun1"
              name="jun1"
              value={formData.jun1}
              placeholder="Penundaan bulan Juni"
              onChange={handleInputChange}
              disabled={props.bulan >= "06" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>Juli</label>
            <input
              type="number"
              className="form-control my-2"
              id="jul1"
              name="jul1"
              value={formData.jul1}
              placeholder="Penundaan bulan Juli"
              onChange={handleInputChange}
              disabled={props.bulan >= "07" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>Agustus</label>
            <input
              type="number"
              className="form-control my-2"
              id="ags1"
              name="ags1"
              value={formData.ags1}
              placeholder="Penundaan bulan Agustus"
              onChange={handleInputChange}
              disabled={props.bulan >= "08" && props.kriteria === "22"}
            />
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <label>September</label>
            <input
              type="number"
              className="form-control my-2"
              id="sep1"
              name="sep1"
              value={formData.sep1}
              placeholder="Penundaan bulan September"
              onChange={handleInputChange}
              disabled={props.bulan >= "09" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>Oktober</label>
            <input
              type="number"
              className="form-control my-2"
              id="okt1"
              name="okt1"
              value={formData.okt1}
              placeholder="Penundaan bulan Oktober"
              onChange={handleInputChange}
              disabled={props.bulan >= "10" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>November</label>
            <input
              type="number"
              className="form-control my-2"
              id="nov1"
              name="nov1"
              value={formData.nov1}
              placeholder="Penundaan bulan November"
              onChange={handleInputChange}
              disabled={props.bulan >= "11" && props.kriteria === "22"}
            />
          </Col>

          <Col md={3}>
            <label>Desember</label>
            <input
              type="number"
              className="form-control my-2"
              id="des1"
              name="des1"
              value={formData.des1}
              placeholder="Penundaan bulan Desember"
              onChange={handleInputChange}
              disabled={props.bulan >= "12" && props.kriteria === "22"}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
