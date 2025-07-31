import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import Encrypt from "../../../auth/Random";
import { handleHttpError } from "../../aplikasi/notifikasi/toastError";
import { Button, Container, Spinner, Form, Col, Row } from "react-bootstrap";
import moment from "moment";

const RefPenundaanTransaksi25 = (props) => {
  const { axiosJWT, token, username, role, kdkanwil } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sql, setSql] = useState("");
  const [pilihkmk, setPilihkmk] = useState("");
  const [showCabutPenundaan, setShowCabutPenundaan] = useState(false);
  const [bulanValues, setBulanValues] = useState({
    IDDATA: "",
    JAN: "0",
    PEB: "0",
    MAR: "0",
    APR: "0",
    MEI: "0",
    JUN: "0",
    JUL: "0",
    AGS: "0",
    SEP: "0",
    OKT: "0",
    NOV: "0",
    DES: "0",
    NO_KMK: "",

    KMK_CABUT: "",
    BULANCABUT: "",
  });
  const [selectedMonth, setSelectedMonth] = useState(12);
  const [bulandicabut, setBulanDicabut] = useState(12);

  useEffect(() => {
    if (props.kriteria === "") {
      setShowCabutPenundaan(false);
      setData([]);
      setBulanValues({
        IDDATA: "",
        JAN: "0",
        PEB: "0",
        MAR: "0",
        APR: "0",
        MEI: "0",
        JUN: "0",
        JUL: "0",
        AGS: "0",
        SEP: "0",
        OKT: "0",
        NOV: "0",
        DES: "0",
        NO_KMK: "",

        KMK_CABUT: "",
        BULANCABUT: "",
      });
    } else {
      getData();
    }
  }, [props.kriteria, bulandicabut]);

  useEffect(() => {
    if (pilihkmk === "") {
      setData([]);
      setBulanValues({
        IDDATA: "",
        JAN: "0",
        PEB: "0",
        MAR: "0",
        APR: "0",
        MEI: "0",
        JUN: "0",
        JUL: "0",
        AGS: "0",
        SEP: "0",
        OKT: "0",
        NOV: "0",
        DES: "0",
        NO_KMK: "",

        KMK_CABUT: "",
        BULANCABUT: "",
      });
    }
  }, [pilihkmk, props.kriteria]);

  useEffect(() => {
    if (pilihkmk === "") {
      props.setKriteria("");
      setData([]);
    }
  }, [pilihkmk]);

  useEffect(() => {
    if (props.kmk === "") {
      const [bulanValues, setBulanValues] = useState({
        IDDATA: "",
        JAN: "0",
        PEB: "0",
        MAR: "0",
        APR: "0",
        MEI: "0",
        JUN: "0",
        JUL: "0",
        AGS: "0",
        SEP: "0",
        OKT: "0",
        NOV: "0",
        DES: "0",
        NO_KMK: "",

        KMK_CABUT: "",
        BULANCABUT: "",
      });
      setData([]);
    }
  }, [props.kmk]);

  const handleOptionChange = (selectedValue) => {
    const selectedData = data.find((dau) => dau.IDDATA == `${selectedValue}`);

    if (selectedData) {
      setBulanValues({
        IDDATA: selectedData.IDDATA || "0",
        JAN: selectedData.JAN || "0",
        PEB: selectedData.PEB || "0",
        MAR: selectedData.MAR || "0",
        APR: selectedData.APR || "0",
        MEI: selectedData.MEI || "0",
        JUN: selectedData.JUN || "0",
        JUL: selectedData.JUL || "0",
        AGS: selectedData.AGS || "0",
        SEP: selectedData.SEP || "0",
        OKT: selectedData.OKT || "0",
        NOV: selectedData.NOV || "0",
        DES: selectedData.DES || "0",
        NO_KMK: selectedData.NO_KMK || "",
        KMK_CABUT: selectedData.KMKCABUT || "",
        BULANCABUT: selectedData.BULANCABUT || "",
      });
    }
  };

  useEffect(() => {
    handleOptionChange(pilihkmk);
    if (pilihkmk !== "") {
      setShowCabutPenundaan(true);
    } else {
      setShowCabutPenundaan(false);
    }
    // setSelectedMonth(parseInt(bulanValues.BULANCABUT));
  }, [pilihkmk, data]);

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
    let syarat;
    if (bulandicabut) {
      // Tambahkan kondisi WHERE SQL
      syarat = `AND MONTH(A.TGLCABUT) <= ${bulandicabut}`;
    } else {
      syarat = "";
    }

    const encodedQuery = encodeURIComponent(
      `SELECT 
      IDDATA, 
      CASE WHEN MONTH(A.TGLCABUT) < 1 THEN 0 ELSE B.JAN END AS JAN,
      CASE WHEN MONTH(A.TGLCABUT) < 2 THEN 0 ELSE B.PEB END AS PEB,
      CASE WHEN MONTH(A.TGLCABUT) < 3 THEN 0 ELSE B.MAR END AS MAR,
      CASE WHEN MONTH(A.TGLCABUT) < 4 THEN 0 ELSE B.APR END AS APR,
      CASE WHEN MONTH(A.TGLCABUT) < 5 THEN 0 ELSE B.MEI END AS MEI,
      CASE WHEN MONTH(A.TGLCABUT) < 6 THEN 0 ELSE B.JUN END AS JUN,
      CASE WHEN MONTH(A.TGLCABUT) < 7 THEN 0 ELSE B.JUL END AS JUL,
      CASE WHEN MONTH(A.TGLCABUT) < 8 THEN 0 ELSE B.AGS END AS AGS,
      CASE WHEN MONTH(A.TGLCABUT) < 9 THEN 0 ELSE B.SEP END AS SEP,
      CASE WHEN MONTH(A.TGLCABUT) < 10 THEN 0 ELSE B.OKT END AS OKT,
      CASE WHEN MONTH(A.TGLCABUT) < 11 THEN 0 ELSE B.NOV END AS NOV,
      CASE WHEN MONTH(A.TGLCABUT) < 12 THEN 0 ELSE B.DES END AS DES,
   
     
      A.NO_KMK, 
      MONTH(A.TGLCABUT) AS BULANCABUT, 
      A.KRITERIA, 
      A.NO_KMK, 
      A.NO_KMKCABUT AS KMKCABUT, 
      A.TGLCABUT, 
      A.KDKPPN, 
      A.KDPEMDA, 
      A.TGL_KMK 
  FROM tkd25.REF_KMK_DAU A 
  LEFT OUTER JOIN (
      SELECT 
          B.ID AS IDDATA, 
          B.KDKPPN, 
          B.KDPEMDA, 
          B.JENIS, 
          B.KRITERIA, 
          B.NO_KMK, 
          B.ALIAS, 
          B.JAN, 
          B.PEB, 
          B.MAR, 
          B.APR, 
          B.MEI, 
          B.JUN, 
          B.JUL, 
          B.AGS, 
          B.SEP, 
          B.OKT, 
          B.NOV, 
          B.DES 
      FROM tkd25.REF_KMK_PENUNDAAN B
  ) B ON A.KDKPPN = B.KDKPPN 
      AND A.KDPEMDA = B.KDPEMDA 
      AND A.KRITERIA = B.KRITERIA 
      AND A.NO_KMK = B.NO_KMK 
  WHERE 
      A.KRITERIA = '${props.kriteria}' 
      AND A.KDKPPN = '${props.kppn}' 
      AND A.KDPEMDA = '${props.kdpemda}' 
      ${syarat}
      AND !ISNULL(B.ALIAS) 
  GROUP BY A.NO_KMK
  `
    );

    const cleanedQuery = decodeURIComponent(encodedQuery)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // console.log(cleanedQuery);
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
      const bulanData = response.data.result;
      if (bulanData && bulanData.length > 0) {
        const selectedData = bulanData[0]; // Ambil objek pertama sebagai default

        // Menyiapkan objek untuk semua bulan
        const allBulanValues = bulanData.reduce((acc, data) => {
          acc[data.IDDATA] = {
            IDDATA: data.IDDATA || "",
            JAN: data.JAN || "0",
            PEB: data.PEB || "0",
            MAR: data.MAR || "0",
            APR: data.APR || "0",
            MEI: data.MEI || "0",
            JUN: data.JUN || "0",
            JUL: data.JUL || "0",
            AGS: data.AGS || "0",
            SEP: data.SEP || "0",
            OKT: data.OKT || "0",
            NOV: data.NOV || "0",
            DES: data.DES || "0",
            NO_KMK: data.NO_KMK || "",
            KMK_CABUT: data.KMKCABUT || "",
            BULANCABUT: data.BULANCABUT || "",
          };
          return acc;
        }, {});

        setBulanValues(allBulanValues);
        setLoading(false);
      } else {
        setLoading(false);
        // handle jika tidak ada data bulan
      }
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
  const formattedDate = (date) => {
    return moment(date).format("DD-MM-YYYY");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBulanValues({
      ...bulanValues,
      [name]: value,
    });
  };

  const renderMonthInput = (monthName, monthValue) => {
    if (monthValue !== "0") {
      return (
        <>
          <label>{monthName}</label>
          <input
            type="number"
            className="form-control my-2"
            id={monthName}
            name={monthName}
            value={monthValue}
            placeholder={`Penundaan bulan ${monthName}`}
            onChange={handleInputChange}
            disabled
          />
        </>
      );
    }
    return null;
  };
  // console.log(bulandicabut);
  // useEffect(() => {
  //   renderMonthInput();
  // }, [bulandicabut]);
  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Pebruari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];
  // useEffect(() => {
  //   getData();
  // }, [selectedMonth]);

  //KIRIM HASIL KE KOMPONEN INDUK
  useEffect(() => {
    if (pilihkmk !== "") {
      sendAllValuesToParent();
    }
  }, [bulanValues, pilihkmk]);

  const sendAllValuesToParent = () => {
    const allValues = {
      ...bulanValues,
      BULANCABUT: bulanValues.BULANCABUT, // Perbarui nilai BULANCABUT dengan selectedMonth
    };
    props.sendValues(allValues);
  };

  return (
    <div>
      <Form.Group controlId="inputState">
        <Form.Control
          as="select"
          className="form-select form-select-md text-select"
          onChange={(e) => {
            setPilihkmk(e.target.value); // Memperbarui nilai pilihkmk saat terjadi perubahan
            handleOptionChange(e.target.value); // Memanggil fungsi handleOptionChange dengan nilai baru
          }}
          disabled={!data.length}
        >
          <option value="">-- Pilih KMK --</option>
          {data.map((dau, index) => (
            <option key={index} value={dau.IDDATA}>
              Penundaan: {dau.NO_KMK} Tgl {formattedDate(dau.TGL_KMK)},
              Pencabutan: {dau.KMKCABUT} Tgl {formattedDate(dau.TGLCABUT)}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {pilihkmk !== "" && props.kriteria !== "" ? (
        <div
          className={`cabut_penundaan ${
            showCabutPenundaan ? "active" : "non-active"
          }`}
        >
          <Row className="my-3">
            <Col md={3}>
              <label>Januari</label>
              <input
                type="number"
                className="form-control my-2"
                id="JAN"
                name="JAN"
                value={bulanValues.JAN}
                placeholder="Penundaan bulan Januari"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>Februari</label>
              <input
                type="number"
                className="form-control my-2"
                id="PEB"
                name="PEB"
                value={bulanValues.PEB}
                placeholder="Penundaan bulan Februari"
                onChange={handleInputChange}
                disabled
              />
            </Col>
            <Col md={3}>
              <label>Maret</label>
              <input
                type="number"
                className="form-control my-2"
                id="MAR"
                name="MAR"
                value={bulanValues.MAR}
                placeholder="Penundaan bulan Maret"
                onChange={handleInputChange}
                disabled
              />
            </Col>
            <Col md={3}>
              <label>April</label>
              <input
                type="number"
                className="form-control my-2"
                id="APR"
                name="APR"
                value={bulanValues.APR}
                placeholder="Penundaan bulan April"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>Mei</label>
              <input
                type="number"
                className="form-control my-2"
                id="MEI"
                name="MEI"
                value={bulanValues.MEI}
                placeholder="Penundaan bulan Mei"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>Juni</label>
              <input
                type="number"
                className="form-control my-2"
                id="JUN"
                name="JUN"
                value={bulanValues.JUN}
                placeholder="Penundaan bulan Juni"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>Juli</label>
              <input
                type="number"
                className="form-control my-2"
                id="JUL"
                name="JUL"
                value={bulanValues.JUL}
                placeholder="Penundaan bulan Juli"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>Agustus</label>
              <input
                type="number"
                className="form-control my-2"
                id="AGS"
                name="AGS"
                value={bulanValues.AGS}
                placeholder="Penundaan bulan Agustus"
                onChange={handleInputChange}
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <label>September</label>
              <input
                type="number"
                className="form-control my-2"
                id="SEP"
                name="SEP"
                value={bulanValues.SEP}
                placeholder="Penundaan bulan September"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>Oktober</label>
              <input
                type="number"
                className="form-control my-2"
                id="OKT"
                name="OKT"
                value={bulanValues.OKT}
                placeholder="Penundaan bulan Oktober"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>November</label>
              <input
                type="number"
                className="form-control my-2"
                id="NOV"
                name="NOV"
                value={bulanValues.NOV}
                placeholder="Penundaan bulan November"
                onChange={handleInputChange}
                disabled
              />
            </Col>

            <Col md={3}>
              <label>Desember</label>
              <input
                type="number"
                className="form-control my-2"
                id="DES"
                name="DES"
                value={bulanValues.DES}
                placeholder="Penundaan bulan Desember"
                onChange={handleInputChange}
                disabled
              />
            </Col>
          </Row>

          <hr />
          <div className="data-cabut">
            <Row>
              <Col sm={12} md={12} lg={12} xl={12} className={`my-1`}>
                <label className="form-check-label fw-bold" htmlFor="cabut">
                  Cabut Penundaan
                </label>
              </Col>
            </Row>
            {!isNaN(selectedMonth) && (
              <Row className="my-3">
                <Col md={4}>
                  {Object.entries(bulanValues)
                    .filter(
                      ([monthName]) =>
                        ![
                          "IDDATA",
                          "NO_KMK",
                          "KMK_CABUT",
                          "BULANCABUT",
                        ].includes(monthName)
                    )
                    .map(([month, value]) => renderMonthInput(month, value))}
                </Col>

                <Col sm={4}>
                  <Form.Label htmlFor="cair">Dicairkan bulan</Form.Label>
                  <Form.Control
                    as="select"
                    className="form-select form-select-md text-select"
                    name="cair"
                    value={bulanValues.BULANCABUT}
                    onChange={(e) => setBulanDicabut(parseInt(e.target.value))}
                  >
                    {months.map((month) => (
                      <option
                        key={month.value}
                        value={month.value}
                        disabled={month.value !== bulanValues.BULANCABUT}
                      >
                        {month.label}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RefPenundaanTransaksi25;
