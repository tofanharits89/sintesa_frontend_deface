import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Dropdown,
  ButtonGroup,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import GenerateExcel from "../CSV/generateExcell";
import { Pesan } from "../notifikasi/Omspan";
import MyContext from "../../../auth/Context";
import { Sql } from "../tematik/hasilQueryTematik";
import { Simpan } from "../simpanquery/simpan";
import Kddept from "../../referensi/Kddept";
import Kdunit from "../../referensi/Kdunit";
import Kddekon from "../../referensi/Kddekon";
import Kdkanwil from "../../referensi/Kdkanwil";
import Kdkppn from "../../referensi/Kdkppn";
import Kdsatker from "../../referensi/Kdsatker";
import DeptRadio from "../inquiry/radio/deptRadio";
import InputDept from "../inquiry/kondisi/InputDept";
import InputKppn from "../inquiry/kondisi/InputKppn";
import InputSatker from "../inquiry/kondisi/InputSatker";
import UnitRadio from "../inquiry/radio/unitRadio";
import DekonRadio from "../inquiry/radio/dekonRadio";
import KanwilRadio from "../inquiry/radio/kanwilRadio";
import KppnRadio from "../inquiry/radio/kppnRadio";
import SatkerRadio from "../inquiry/radio/satkerRadio";
import AkunRadio from "../inquiry/radio/akunRadio";
import pilihanData from "../inquiry/pilihanData";
import { getSQLRevisi } from "./SQLRevisi";
import Thang from "./ThangRevisi";
import GenerateCSV from "../CSV/generateCSV";
import JenisLaporanRevisi from "./JenisLaporanRevisi";
import BulanRevisi from "./bulanRevisi";
import HasilQueryRevisi from "./hasilQueryRevisi";

import Kdakun from "../../referensi/Kdakun";
import moment from "moment";
import InputKataAkun from "../inquiry/kondisi/InputKataAkun";
import InputKataSatker from "../inquiry/kondisi/InputKataSatker";
import InputKataKppn from "../inquiry/kondisi/InputKataKppn";
import InputKataKanwil from "../inquiry/kondisi/InputKataKanwil";
import InputKataDept from "../inquiry/kondisi/InputKataDept";
import InputUnit from "../inquiry/kondisi/InputUnit";
import InputDekon from "../inquiry/kondisi/InputDekon";
import InputKanwil from "../inquiry/kondisi/InputKanwil";
import InputAkun from "../inquiry/kondisi/InputAkun";
import JenisRevisi from "./jenisRevisi";
import KewenanganRevisi from "./kewenanganRevisi";
import SubJenisRevisi from "./subjenisRevisi";
import { FaWhatsapp } from "react-icons/fa";
import ConvertToPDF from "../PDF/sharepdf";
import ShareDataComponent from "../PDF/Icon";
import PilihFormat from "../PDF/PilihFormat";
import { ConvertToExcel } from "../PDF/FormatSelector";
import ConvertToJSON from "../PDF/JSON";
import { ConvertToText } from "../PDF/TEXT";
import SaveUserData from "../PDF/simpanTukangAkses";

const InquiryRevisi = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const [showModal, setShowModal] = useState(false);
  const [showModalsql, setShowModalsql] = useState(false);
  const [showModalsimpan, setShowModalsimpan] = useState(false);
  const {
    role,
    telp,
    verified,
    loadingExcell,
    setloadingExcell,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
  } = useContext(MyContext);
  const [jenlap, setJenlap] = useState("1");
  const [thang, setThang] = useState(new Date().getFullYear());
  const [tanggal, setTanggal] = useState(true);

  const [kddept, setKddept] = useState(true);
  const [unit, setUnit] = useState(false);
  const [kddekon, setKddekon] = useState(false);
  const [kdkanwil, setKdkanwil] = useState(false);
  const [kdkppn, setKdkppn] = useState(false);
  const [kdsatker, setKdsatker] = useState(false);
  const [kdakun, setKdakun] = useState(false);
  const [cutoff, setCutoff] = useState("00");
  const [dept, setDept] = useState("000");
  const [kdunit, setKdunit] = useState("XX");
  const [dekon, setDekon] = useState("XX");
  const [kanwil, setKanwil] = useState("XX");
  const [kppn, setKppn] = useState("XX");
  const [satker, setSatker] = useState("XX");
  const [akun, setAkun] = useState("XX");
  // console.log(kanwil);
  const [kewenanganRevisi, setkewenanganRevisi] = useState("XX");
  const [jenisRevisi, setjenisRevisi] = useState("XX");
  const [subjenisRevisi, setsubjenisRevisi] = useState("XX");

  // RADIO HANDLER
  const [deptradio, setDeptradio] = useState("1");
  const [unitradio, setUnitradio] = useState("1");
  const [dekonradio, setDekonradio] = useState("1");

  const [kanwilradio, setKanwilradio] = useState("1");
  const [kppnradio, setKppnradio] = useState("1");
  const [satkerradio, setSatkerradio] = useState("1");

  const [akunradio, setAkunradio] = useState("1");

  const [sql, setSql] = useState("");
  const [from, setFrom] = useState("");
  const [select, setSelect] = useState("");
  const [export2, setExport2] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // SHARE PDF

  const [showModalPDF, setShowModalPDF] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const handleShowPDF = () => setShowModalPDF(true);
  const handleClosePDF = () => setShowModalPDF(false);
  const handlePDF = () => {
    generateSql();
    setShowModalPDF(true);
  };

  const handleGenerateExcel = () => {
    generateSql();
    setloadingExcell(true);
  };
  const handleDataFetchComplete = (total) => {
    if (total > 0) {
      Pesan(`${total} data berhasil diexport`);
    } else {
      Pesan("Tidak Ada Data");
    }
    setloadingExcell(false);
  };

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);
    //  console.log(total);
    if (total === 0) {
      setLoadingStatus(false);
    }
  };
  useEffect(() => {
    setExport2(false);
  }, [sql]);

  const handleCutoffcek = () => {
    let realisasi = ``;
    let from = "monev" + thang + ".dja_revisi_kanwil_" + thang + "  a";

    switch (jenlap) {
      case "1":
        setFrom(from);
        setSelect(realisasi);

        break;

      default:
    }
  };
  const handleCutoff = (cutoff) => {
    setCutoff(cutoff);
  };
  const handleKewenanganRevisi = (kewenangan) => {
    setkewenanganRevisi(kewenangan);
  };
  const handleJenisRevisi = (jenis) => {
    setjenisRevisi(jenis);
    if (jenis === "00") {
      setsubjenisRevisi("00");
    }
  };
  const handleSubJenisRevisi = (subjenis) => {
    setsubjenisRevisi(subjenis);
  };
  // console.log(cutoff, kewenanganRevisi, jenisRevisi, subjenisRevisi);
  const closeModalsql = () => {
    setShowModalsql(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalsimpan = () => {
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlegetQuerySQL = () => {
    generateSql();
    setShowModalsql(true);
  };
  const handleSimpan = () => {
    generateSql();
    setShowModalsimpan(true);
  };
  const handleJenlap = (jenlap) => {
    setJenlap(jenlap);
  };

  const handleThang = (thang) => {
    setThang(thang);
  };

  useEffect(() => {
    if (jenlap === "2") {
      setProgram("XX");
      setGiat("XX");
      setOutput("XX");
    }
  }, [jenlap]);

  useEffect(() => {
    handleCutoffcek();
  }, [thang, jenlap, select]);
  // HANDLE RADIO
  const handleRadioDept = (deptRadio) => {
    setDeptradio(deptRadio);
  };
  const handleRadioUnit = (unitRadio) => {
    setUnitradio(unitRadio);
  };
  const handleRadioDekon = (dekonRadio) => {
    setDekonradio(dekonRadio);
  };

  const handleRadioKanwil = (kanwilRadio) => {
    setKanwilradio(kanwilRadio);
  };
  const handleRadioKppn = (kppnRadio) => {
    setKppnradio(kppnRadio);
  };
  const handleRadioSatker = (satkerRadio) => {
    setSatkerradio(satkerRadio);
  };
  const handleRadioProgram = (programRadio) => {
    setProgramradio(programRadio);
  };
  const handleRadioKegiatan = (kegiatanRadio) => {
    setKegiatanradio(kegiatanRadio);
  };
  const handleRadioOutput = (outputRadio) => {
    setOutputradio(outputRadio);
  };
  const handleRadioAkun = (akunRadio) => {
    setAkunradio(akunRadio);
  };

  // KONDISI
  // const handledeptKondisi = (deptInput) => {
  //   setDeptkondisi(deptInput);
  // };
  function deptKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    setDeptkondisipilih(value);
    setDept("000");
  }
  // const handlekppnKondisi = (kppnInput) => {
  //   setKppnkondisi(kppnInput);
  // };
  function kppnKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    setKppnkondisipilih(value);
    setKppn("000");
  }
  // const handlesatkerKondisi = (satkerInput) => {
  //   setSatkerkondisi(satkerInput);
  // };
  function satkerKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    setSatkerkondisipilih(value);
    setSatker("SEMUASATKER");
  }

  const handlegetQuery = () => {
    setShowModal(true);
    generateSql();
  };
  const handlegetExcell = () => {
    generateSql();
    setExport2(true);
  };
  const handlestatus = () => {
    setExport2(false);
  };

  const closeModal = () => {
    setShowModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const generateSql = () => {
    const queryParams = {
      kanwil,
      kanwilradio,
      kppn,
      kppnradio,
      opsikanwil,
      opsikatakanwil,
      opsikppn,
      opsikatakppn,
      thang,
      jenlap,
      role,
      kodekppn,
      kodekanwil,
      deptradio,
      dept,
      deptkondisipilih,
      deptkondisi,
      kdunit,
      unitkondisipilih,
      unitkondisi,
      unitradio,
      dekon,
      dekonradio,
      satker,
      satkerradio,
      satkerkondisi,
      kanwilkondisipilih,
      kanwilkondisi,
      kppnkondisipilih,
      kppnkondisi,
      select,
      from,
      opsidept,
      opsikatadept,
      opsiunit,
      opsikataunit,
      opsidekon,
      dekonkondisi,
      cutoff,
      jenisRevisi,
      subjenisRevisi,
      kewenanganRevisi,
      opsisatker,
      opsikatasatker,
    };

    getSQLRevisi(queryParams);
    const query = getSQLRevisi(queryParams);
    setSql(query);
  };
  // HANDLE KDDEPT
  const [deptkondisi, setDeptkondisi] = useState("");
  const [deptkondisipilih, setDeptkondisipilih] = useState("0");
  const [opsikatadept, setopsiKataDept] = useState("");

  const handleKddept = (dept) => {
    setDept(dept);
    setopsiDept("pilihdept");

    if (dept === "XXX") {
      setProgram("XX");
      setGiat("XX");
      setKdunit("XX");
      setOutput("XX");
    } else if (dept === "000") {
      setProgram("XX");
      setGiat("XX");
      setKdunit("00");
      setOutput("XX");
    }
  };
  const getSwitchKddept = (kddept) => {
    setKddept(kddept);
    setDeptradio("1");
    if (kddept) {
      setDept("000");
    } else {
      setDept("XXX");
      setopsiKataDept("");
      setDeptkondisi("");
    }
  };

  const [opsidept, setopsiDept] = useState("pilihdept");
  const handledeptKondisi = (deptInput) => {
    setDeptkondisi(deptInput);
  };
  const handledeptKondisiKata = (deptkata) => {
    setopsiKataDept(deptkata);
  };
  const handleRadioChange = (event) => {
    setopsiDept(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihdept" ? 5 : 0;
    setDeptkondisipilih(value);
    value === 0 ? setDeptradio("2") : setDeptradio("1");
  };

  // HANDLE KDUNIT
  const [unitkondisi, setUnitkondisi] = useState("");
  const [opsikataunit, setopsiKataUnit] = useState("");
  const [unitkondisipilih, setUnitkondisipilih] = useState("0");
  const [opsiunit, setopsiUnit] = useState("pilihunit");

  const handleUnit = (kdunit) => {
    setKdunit(kdunit);
  };
  const getSwitchUnit = (unit) => {
    setUnit(unit);
    if (unit) {
      setKdunit("00");
    } else {
      setKdunit("XX");
      setUnitkondisi("");
      setopsiKataUnit("");
    }
  };
  const handleunitKondisi = (unitInput) => {
    setUnitkondisi(unitInput);
  };
  const handleunitKondisiKata = (unitkata) => {
    setopsiKataUnit(unitkata);
  };
  const handleRadioChangeUnit = (event) => {
    setopsiUnit(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihunit" ? 5 : 0;
    setUnitkondisipilih(value);
  };

  // HANDLE KEWENANGAN
  const [dekonkondisi, setDekonkondisi] = useState("");
  const [dekonkondisipilih, setDekonkondisipilih] = useState("0");
  const [opsidekon, setopsiDekon] = useState("pilihdekon");

  const handleDekon = (dekon) => {
    setDekon(dekon);
  };
  const getSwitchDekon = (kddekon) => {
    setKddekon(kddekon);
    if (kddekon) {
      setDekon("00");
    } else {
      setDekon("XX");
      setDekonkondisi("");
    }
  };

  const handledekonKondisi = (dekonInput) => {
    setDekonkondisi(dekonInput);
  };

  const handleRadioChangeDekon = (event) => {
    setopsiDekon(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihdekon" ? 5 : 0;
    setDekonkondisipilih(value);
  };

  // HANDLE KDKANWIL
  const [kanwilkondisi, setkanwilkondisi] = useState("");
  const [opsikatakanwil, setopsiKatakanwil] = useState("");

  const handleKanwil = (kanwil) => {
    setKanwil(kanwil);
    if (kanwil === "XX") {
      setKabkota("XX");
    }
  };
  const getSwitchkanwil = (kdkanwil) => {
    setKdkanwil(kdkanwil);
    if (kdkanwil) {
      setKanwil("00");
    } else {
      setkanwilkondisi("");
      setopsiKatakanwil("");
      setKanwil("XX");
    }
  };

  const [kanwilkondisipilih, setkanwilkondisipilih] = useState("0");
  const [opsikanwil, setopsikanwil] = useState("pilihkanwil");
  // console.log(opsikanwil);
  const handlekanwilKondisi = (kanwilInput) => {
    setkanwilkondisi(kanwilInput);
  };
  const handlekanwilKondisiKata = (kanwilkata) => {
    setopsiKatakanwil(kanwilkata);
  };
  const handleRadioChangekanwil = (event) => {
    setopsikanwil(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihkanwil" ? 5 : 0;
    setkanwilkondisipilih(value);
    value === 0 ? setKanwilradio("2") : setKanwilradio("1");
  };

  // HANDLE KDKPPN
  const [kppnkondisi, setkppnkondisi] = useState("");
  const [opsikatakppn, setopsiKatakppn] = useState("");
  const handleKppn = (kppn) => {
    setKppn(kppn);
    if (kppn === "XX") {
      setKabkota("XX");
    }
  };
  const getSwitchkppn = (kdkppn) => {
    setKdkppn(kdkppn);
    if (kdkppn) {
      setKppn("00");
    } else {
      setkppnkondisi("");
      setopsiKatakppn("");
      setKppn("XX");
    }
  };

  const [kppnkondisipilih, setkppnkondisipilih] = useState("0");
  const [opsikppn, setopsikppn] = useState("pilihkppn");

  const handlekppnKondisi = (kppnInput) => {
    setkppnkondisi(kppnInput);
  };
  const handlekppnKondisiKata = (kppnkata) => {
    setopsiKatakppn(kppnkata);
  };
  const handleRadioChangekppn = (event) => {
    setopsikppn(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihkppn" ? 5 : 0;
    setkppnkondisipilih(value);
    value === 0 ? setKppnradio("2") : setKppnradio("1");
  };

  // HANDLE SATKER
  const [satkerkondisi, setsatkerkondisi] = useState("");
  const [opsikatasatker, setopsiKatasatker] = useState("");

  const handleSatker = (satker) => {
    setSatker(satker);
  };
  const getSwitchsatker = (kdsatker) => {
    setKdsatker(kdsatker);
    if (kdsatker) {
      setSatker("SEMUASATKER");
    } else {
      setsatkerkondisi("");
      setopsiKatasatker("");
      setSatker("XX");
    }
    // console.log(satker);
  };

  const [satkerkondisipilih, setsatkerkondisipilih] = useState("0");
  const [opsisatker, setopsisatker] = useState("pilihsatker");

  const handlesatkerKondisi = (satkerInput) => {
    setsatkerkondisi(satkerInput);
  };
  const handlesatkerKondisiKata = (satkerkata) => {
    setopsiKatasatker(satkerkata);
  };
  const handleRadioChangesatker = (event) => {
    setopsisatker(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihsatker" ? 5 : 0;
    setsatkerkondisipilih(value);
    value === 0 ? setSatkerradio("2") : setSatkerradio("1");
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Data Revisi DIPA</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">DIPA</a>
              </li>
              <li className="breadcrumb-item active fade-in">Revisi</li>
            </ol>
          </nav>
        </div>
        <section className="section dashboard">
          <Row>
            <Col lg={12}>
              <Card bg="secondary text-white">
                <Card.Body>
                  <div className="bagian-query">
                    <div className="custom-content">
                      <Thang
                        value={thang}
                        jenlap={jenlap}
                        onChange={handleThang}
                      />
                      <JenisLaporanRevisi
                        jenlap={jenlap}
                        onChange={handleJenlap}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card bg="secondary text-white">
                <Card.Body>
                  <div className="bagian-query">
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKddept onChange={getSwitchKddept} />
                      </Col>{" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKdUnit onChange={getSwitchUnit} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKddekon onChange={getSwitchDekon} />
                      </Col>{" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSatker onChange={getSwitchsatker} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKanwil onChange={getSwitchkanwil} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKppn onChange={getSwitchkppn} />
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="custom-card  text-white" bg="secondary">
            <Card.Body>
              <Row>
                <Col xs={4} sm={4} md={4}>
                  <span className=" fade-in ">Bulan Posting</span>
                </Col>

                <Col xs={4} sm={4} md={4}>
                  <span className="fade-in left-side">
                    <BulanRevisi
                      value={cutoff}
                      jenlap={jenlap}
                      pilihtanggal={tanggal}
                      onChange={handleCutoff}
                      thang={thang}
                    />
                  </span>
                </Col>
              </Row>
              <Row>
                <Col xs={4} sm={4} md={4}>
                  <span className=" fade-in ">Kewenangan Revisi</span>
                </Col>

                <Col xs={4} sm={4} md={4}>
                  <span className="fade-in left-side">
                    <KewenanganRevisi
                      onChange={handleKewenanganRevisi}
                      thang={thang}
                    />
                  </span>
                </Col>
              </Row>
              <Row>
                <Col xs={4} sm={4} md={4}>
                  <span className=" fade-in ">Jenis Revisi</span>
                </Col>

                <Col xs={4} sm={4} md={4}>
                  <span className="fade-in left-side">
                    <JenisRevisi onChange={handleJenisRevisi} thang={thang} />
                  </span>
                </Col>
              </Row>
              <Row>
                <Col xs={4} sm={4} md={4}>
                  <span className=" fade-in ">Sub Jenis Revisi</span>
                </Col>

                <Col xs={4} sm={4} md={4}>
                  <span className="fade-in left-side">
                    <SubJenisRevisi
                      onChange={handleSubJenisRevisi}
                      jenisRevisi={jenisRevisi}
                      thang={thang}
                    />
                  </span>
                </Col>
              </Row>
              <hr />
              {kddept && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Kementerian</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih K/L"
                        value="pilihdept"
                        checked={opsidept === "pilihdept"}
                        onChange={handleRadioChange}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kddept
                          value={dept}
                          onChange={handleKddept}
                          status={opsidept}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <DeptRadio
                        deptRadio={handleRadioDept}
                        selectedValue={deptradio}
                        status={opsidept}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Kondisi"
                          value="kondisidept"
                          checked={opsidept === "kondisidept"}
                          onChange={handleRadioChange}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputDept
                        deptkondisi={handledeptKondisi}
                        status={opsidept}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak KL gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Mengandung Kata"
                          value="katadept"
                          checked={opsidept === "katadept"}
                          onChange={handleRadioChange}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataDept
                        opsikatadept={handledeptKondisiKata}
                        status={opsidept}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {unit && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Eselon I</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Unit"
                        value="pilihunit"
                        checked={opsiunit === "pilihunit"}
                        onChange={handleRadioChangeUnit}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdunit
                          value={dept}
                          kdunit={kdunit}
                          onChange={handleUnit}
                          status={opsiunit}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <UnitRadio
                        unitRadio={handleRadioUnit}
                        selectedValue={unitradio}
                        status={opsiunit}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Kondisi"
                          value="kondisiunit"
                          checked={opsiunit === "kondisiunit"}
                          onChange={handleRadioChangeUnit}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputUnit
                        unitkondisi={handleunitKondisi}
                        status={opsiunit}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Unit gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                </>
              )}
              {kddekon && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle fade-in ">Kewenangan</span>
                    </Col>

                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Kewenangan"
                        value="pilihdekon"
                        checked={opsidekon === "pilihdekon"}
                        onChange={handleRadioChangeDekon}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kddekon
                          value={dekon}
                          onChange={handleDekon}
                          status={opsidekon}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <DekonRadio
                        dekonRadio={handleRadioDekon}
                        selectedValue={dekonradio}
                        status={opsidekon}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Kondisi"
                          value="kondisidekon"
                          checked={opsidekon === "kondisidekon"}
                          onChange={handleRadioChangeDekon}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputDekon
                        dekonkondisi={handledekonKondisi}
                        status={opsidekon}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Kewenangan gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                </>
              )}
              {kdkanwil && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Kanwil</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Kanwil"
                        value="pilihkanwil"
                        checked={opsikanwil === "pilihkanwil"}
                        onChange={handleRadioChangekanwil}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdkanwil
                          value={kanwil}
                          onChange={handleKanwil}
                          status={opsikanwil}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <KanwilRadio
                        kanwilRadio={handleRadioKanwil}
                        selectedValue={kanwilradio}
                        status={opsikanwil}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Kondisi"
                          value="kondisikanwil"
                          checked={opsikanwil === "kondisikanwil"}
                          onChange={handleRadioChangekanwil}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKanwil
                        kanwilkondisi={handlekanwilKondisi}
                        status={opsikanwil}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak kanwil gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Mengandung Kata"
                          value="katakanwil"
                          checked={opsikanwil === "katakanwil"}
                          onChange={handleRadioChangekanwil}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataKanwil
                        opsikatakanwil={handlekanwilKondisiKata}
                        status={opsikanwil}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {kdkppn && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>KPPN</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih KPPN"
                        value="pilihkppn"
                        checked={opsikppn === "pilihkppn"}
                        onChange={handleRadioChangekppn}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdkppn
                          value={kppn}
                          onChange={handleKppn}
                          status={opsikppn}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <KppnRadio
                        kppnRadio={handleRadioKppn}
                        selectedValue={kppnradio}
                        status={opsikppn}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Kondisi"
                          value="kondisikppn"
                          checked={opsikppn === "kondisikppn"}
                          onChange={handleRadioChangekppn}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKppn
                        kppnkondisi={handlekppnKondisi}
                        status={opsikppn}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak KPPN gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Mengandung Kata"
                          value="katakppn"
                          checked={opsikppn === "katakppn"}
                          onChange={handleRadioChangekppn}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataKppn
                        opsikatakppn={handlekppnKondisiKata}
                        status={opsikppn}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {kdsatker && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle fade-in ">Satker</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Satker"
                        value="pilihsatker"
                        checked={opsisatker === "pilihsatker"}
                        onChange={handleRadioChangesatker}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdsatker
                          kddept={dept}
                          kdunit={kdunit}
                          onChange={handleSatker}
                          status={opsisatker}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <SatkerRadio
                        satkerRadio={handleRadioSatker}
                        selectedValue={satkerradio}
                        status={opsisatker}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Kondisi"
                          value="kondisisatker"
                          checked={opsisatker === "kondisisatker"}
                          onChange={handleRadioChangesatker}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputSatker
                        satkerkondisi={handlesatkerKondisi}
                        status={opsisatker}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Satker gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Mengandung Kata"
                          value="katasatker"
                          checked={opsisatker === "katasatker"}
                          onChange={handleRadioChangesatker}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataSatker
                        opsikatasatker={handlesatkerKondisiKata}
                        status={opsisatker}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {kdakun && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle fade-in ">Detail Akun</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Akun"
                        value="pilihakun"
                        checked={opsiakun === "pilihakun"}
                        onChange={handleRadioChangeakun}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdakun onChange={handleAkun} status={opsiakun} />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <AkunRadio
                        akunRadio={handleRadioAkun}
                        selectedValue={akunradio}
                        status={opsiakun}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Kondisi"
                          value="kondisiakun"
                          checked={opsiakun === "kondisiakun"}
                          onChange={handleRadioChangeakun}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputAkun
                        akunkondisi={handleakunKondisi}
                        status={opsiakun}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Akun gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2} sm={2} md={2}></Col>

                    <Col xs={2} sm={2} md={2}>
                      <span>
                        <Form.Check
                          inline
                          type="radio"
                          label="Mengandung Kata"
                          value="kataakun"
                          checked={opsiakun === "kataakun"}
                          onChange={handleRadioChangeakun}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataAkun
                        opsikataakun={handleakunKondisiKata}
                        status={opsiakun}
                      />
                    </Col>
                  </Row>
                </>
              )}

              <>
                <hr />
                <div className="button-query">
                  <Row>
                    <Col lg={12}>
                      <Button
                        variant="success"
                        size="sm"
                        className="button fade-in me-2"
                        onClick={handlegetQuery}
                        disabled={loadingStatus || loadingExcell}
                      >
                        {loadingStatus || loadingExcell ? "Tayang" : "Tayang"}
                      </Button>
                      <Dropdown as={ButtonGroup}>
                        <Button variant="primary" className="button-download ">
                          {loadingStatus ||
                            (loadingExcell && (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                className="me-2"
                                role="status"
                                aria-hidden="true"
                              />
                            ))}
                          {loadingStatus || loadingExcell
                            ? "Loading..."
                            : "Download"}
                        </Button>

                        <Dropdown.Toggle
                          variant="primary"
                          className="button-download-split me-2 dropup"
                          disabled={loadingStatus || loadingExcell}
                        />

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              setLoadingStatus(true);
                              generateSql();
                              setExport2(true);
                            }}
                          >
                            <i className="bi bi-file-earmark-font text-danger fw-bold"></i>{" "}
                            CSV
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              handleGenerateExcel();
                            }}
                          >
                            <i className="bi bi-file-earmark-excel text-success fw-bold"></i>{" "}
                            EXCELL
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      {role === "0" || role === "X" ? (
                        <Button
                          variant="danger"
                          size="sm"
                          className="button fade-in me-2"
                          onClick={handlegetQuerySQL}
                        >
                          SQL
                        </Button>
                      ) : null}{" "}
                      <Button
                        variant="info"
                        size="sm"
                        className="button me-2 fw-normal text-dark"
                        onClick={handlePDF}
                      >
                        <FaWhatsapp
                          style={{ fontSize: "20px" }}
                          className="me-1 text-white fw-bold"
                        />
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="button fade-in me-2"
                        onClick={handleSimpan}
                      >
                        Simpan
                      </Button>
                    </Col>
                  </Row>
                </div>
              </>
            </Card.Body>
          </Card>
        </section>
      </main>
      {showModal && (
        <HasilQueryRevisi
          query={sql}
          thang={thang}
          cutoff={cutoff}
          id="result"
          showModal={showModal}
          closeModal={closeModal}
        />
      )}
      {export2 && (
        <GenerateCSV
          query3={sql}
          status={handleStatus}
          namafile={`v3_CSV_REVISI_${moment().format("DDMMYY-HHmmss")}`}
        />
      )}
      {loadingExcell && (
        <GenerateExcel
          query3={sql}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_REVISI_JENIS_${jenlap}_${moment().format(
            "DDMMYY-HHmmss"
          )}.xlsx`}
        />
      )}
      {showModalsql && (
        <Sql
          query2={sql}
          showModalsql={showModalsql}
          closeModalsql={closeModalsql}
        />
      )}
      {showModalsimpan && (
        <Simpan
          query2={sql}
          thang={thang}
          jenis="UP"
          showModalsimpan={showModalsimpan}
          closeModalsimpan={closeModalsimpan}
        />
      )}{" "}
      <Modal
        show={showModalPDF}
        onHide={handleClosePDF}
        animation={false}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title className="d-flex justify-content-start align-items-center w-100">
            <div className="d-flex flex-column align-items-start">
              <ShareDataComponent fileType={selectedFormat} />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-0 d-flex justify-content-center align-items-center flex-column">
            <PilihFormat
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
            />
          </div>{" "}
          <div className="file-preview mt-0">
            {selectedFormat === "pdf" && (
              <div className="text-center">
                <ConvertToPDF sql={sql} />
              </div>
            )}
            {selectedFormat === "excel" && (
              <div className="text-center">
                <ConvertToExcel sql={sql} />
              </div>
            )}
            {selectedFormat === "json" && (
              <div className="text-center">
                <ConvertToJSON sql={sql} />
              </div>
            )}
            {selectedFormat === "text" && (
              <div className="text-center">
                <ConvertToText sql={sql} />
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          {verified === "TRUE" && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>file akan dikirim ke nomor WhatsApp {telp}</Tooltip>
              }
            >
              <Button variant="light" size="sm">
                <FaWhatsapp style={{ fontSize: "25px", color: "green" }} />
              </Button>
            </OverlayTrigger>
          )}
          <Button variant="danger" size="sm" onClick={handleClosePDF}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
      <SaveUserData userData={telp} menu="revisi" />
    </>
  );
};

export default InquiryRevisi;
