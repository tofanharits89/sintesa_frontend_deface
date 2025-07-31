import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Container,
  Spinner,
} from "react-bootstrap";
import MyContext from "../../../auth/Context";
import Thang from "../../referensi/ThangKontrak";
import Kddept from "../../referensi/Kddept";
import CutOff from "../../referensi/CutOff";
import Kdunit from "../../referensi/Kdunit";
import Kddekon from "../../referensi/Kddekon";

import Kdprogram from "../../referensi/Kdprogram";
import Kdgiat from "../../referensi/Kdgiat";
import Kdoutput from "../../referensi/Kdoutput";
import Kdakun from "../../referensi/Kdakun";
import Kdsdana from "../../referensi/Kdsdana";
import Pembulatan from "../../referensi/Pembulatan";
import pilihanData from "../inquiry/pilihanData";

import { Sql } from "./../../aplikasi/inquiry/hasilQuery";
import InputDept from "../inquiry/kondisi/InputDept";
import DeptRadio from "../inquiry/radio/deptRadio";
import UnitRadio from "../inquiry/radio/unitRadio";
import DekonRadio from "../inquiry/radio/dekonRadio";
import ProgramRadio from "../inquiry/radio/programRadio";
import KegiatanRadio from "../inquiry/radio/kegiatanRadio";
import OutputRadio from "../inquiry/radio/outputRadio";
import AkunRadio from "../inquiry/radio/akunRadio";
import SdanaRadio from "../inquiry/radio/sdanaRadio";
import GenerateCSV from "../CSV/generateCSV";

import Kdsatker from "../../referensi/Kdsatker";
import SatkerRadio from "../inquiry/radio/satkerRadio";
import InputSatker from "../inquiry/kondisi/InputSatker";
import "../../layout/query.css";
import { Simpan } from "../simpanquery/simpan";
import InputDekon from "../inquiry/kondisi/InputDekon";
import InputUnit from "../inquiry/kondisi/InputUnit";
import InputKataDept from "../inquiry/kondisi/InputKataDept";
import InputKataSatker from "../inquiry/kondisi/InputKataSatker";
import InputKataOutput from "../inquiry/kondisi/InputKataOutput";
import InputOutput from "../inquiry/kondisi/InputOutput";
import InputKatakegiatan from "../inquiry/kondisi/InputKatakegiatan";
import Inputkegiatan from "../inquiry/kondisi/Inputkegiatan";
import InputKataProgram from "../inquiry/kondisi/InputKataProgram";
import InputProgram from "../inquiry/kondisi/InputProgram";
import InputKataSdana from "../inquiry/kondisi/InputKataSdana";
import InputSdana from "../inquiry/kondisi/InputSdana";
import InputKataAkun from "../inquiry/kondisi/InputKataAkun";
import InputAkun from "../inquiry/kondisi/InputAkun";
import moment from "moment";
import InputKataKppn from "../inquiry/kondisi/InputKataKppn";
import InputKppn from "../inquiry/kondisi/InputKppn";
import InputKataKanwil from "../inquiry/kondisi/InputKataKanwil";
import InputKanwil from "../inquiry/kondisi/InputKanwil";
import Kdkanwil from "../../referensi/Kdkanwil";
import Kdkppn from "../../referensi/Kdkppn";
import KppnRadio from "../inquiry/radio/kppnRadio";
import KanwilRadio from "../inquiry/radio/kanwilRadio";
import HasilQuerySp2d from "./hasilQuerySp2d";
import JenisLaporanRowset from "../../referensi/JenisLaporanRowset";
import { getSQL } from "./SQLSp2d";

const InquirySP2D = () => {
  const {
    role,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
  } = useContext(MyContext);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalsql, setShowModalsql] = useState(false);
  const [showModalsimpan, setShowModalsimpan] = useState(false);

  const [export2, setExport2] = useState(false);
  const [jenlap, setJenlap] = useState("1");
  const [thang, setThang] = useState(new Date().getFullYear());
  const [tanggal, setTanggal] = useState(true);
  const [kddept, setKddept] = useState(true);
  const [unit, setUnit] = useState(false);
  const [kdkanwil, setKdkanwil] = useState(false);
  const [kdkppn, setKdkppn] = useState(false);
  const [kdsatker, setKdsatker] = useState(false);
  const [kddekon, setKddekon] = useState(false);
  const [kdprogram, setKdprogram] = useState(false);
  const [kdgiat, setKdgiat] = useState(false);
  const [kdoutput, setKdoutput] = useState(false);
  const [kdakun, setKdakun] = useState(false);
  const [kdsdana, setKdsdana] = useState(false);
  const [akumulatif, setAkumulatif] = useState(false);

  const [cutoff, setCutoff] = useState("1");
  const [dept, setDept] = useState("000");
  const [kdunit, setKdunit] = useState("XX");
  const [dekon, setDekon] = useState("XX");
  const [prov, setProv] = useState("XX");
  const [kabkota, setKabkota] = useState("XX");
  const [kanwil, setKanwil] = useState("XX");
  const [kppn, setKppn] = useState("XX");
  const [satker, setSatker] = useState("XX");
  const [fungsi, setFungsi] = useState("XX");
  const [sfungsi, setSfungsi] = useState("XX");
  const [program, setProgram] = useState("XX");
  const [giat, setGiat] = useState("XX");
  const [output, setOutput] = useState("XX");
  const [akun, setAkun] = useState("XX");
  const [sdana, setSdana] = useState("XX");
  const [pembulatan, setPembulatan] = useState("1");

  // RADIO HANDLER
  const [deptradio, setDeptradio] = useState("1");
  const [unitradio, setUnitradio] = useState("1");
  const [dekonradio, setDekonradio] = useState("1");
  const [provradio, setProvradio] = useState("1");
  const [kabkotaradio, setKabkotaradio] = useState("1");
  const [kanwilradio, setKanwilradio] = useState("1");
  const [kppnradio, setKppnradio] = useState("1");
  const [satkerradio, setSatkerradio] = useState("1");
  const [fungsiradio, setFungsiradio] = useState("1");
  const [subfungsiradio, setSubfungsiradio] = useState("1");
  const [programradio, setProgramradio] = useState("1");
  const [kegiatanradio, setKegiatanradio] = useState("1");
  const [outputradio, setOutputradio] = useState("1");
  const [akunradio, setAkunradio] = useState("1");
  const [sdanaradio, setSdanaradio] = useState("1");

  // const [deptkondisi, setDeptkondisi] = useState("");
  // const [deptkondisipilih, setDeptkondisipilih] = useState("0");
  // const [kppnkondisi, setKppnkondisi] = useState("");
  // const [kppnkondisipilih, setKppnkondisipilih] = useState("0");
  // const [satkerkondisi, setSatkerkondisi] = useState("");
  // const [satkerkondisipilih, setSatkerkondisipilih] = useState("0");

  const [sql, setSql] = useState("");
  const [from, setFrom] = useState("");
  const [select, setSelect] = useState(
    ", CAST(sum(a.pagu) AS UNSIGNED INTEGER) as PAGU, CAST(sum(a.real1) AS UNSIGNED INTEGER) as REALISASI, CAST(sum(a.blokir) AS UNSIGNED INTEGER) as BLOKIR"
  );

  const handlegetQuery = () => {
    generateSql();
    if (jenlap === "1") {
      setShowModal(true);
    } else {
    }
  };

  const handlegetQuerySQL = () => {
    generateSql();
    setShowModalsql(true);
  };
  const handleSimpan = () => {
    generateSql();
    setShowModalsimpan(true);
  };

  // HANDLE MODAL TAYANG
  const closeModal = () => {
    setShowModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalsql = () => {
    setShowModalsql(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalsimpan = () => {
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJenlap = (jenlapopt) => {
    const { akumulatif, selectedValue } = jenlapopt;
    setAkumulatif(akumulatif);
    setJenlap(selectedValue);
  };

  const handleThang = (thang) => {
    setThang(thang);
  };
  const handleCutoff = (cutoff) => {
    setCutoff(cutoff);
  };
  const handlePembulatan = (pembulatan) => {
    setPembulatan(pembulatan);
  };
  useEffect(() => {
    handleCutoffcek();
  }, [thang, cutoff, pembulatan, jenlap, akumulatif, select]);

  const handleCutoffcek = () => {
    let selectkontrak =
      " ,RUPIAH,NOSP2D,TGSP2D,NOSPM,TGSPM,URAIAN,JENSP2D,JENSPM,TGPOS";

    let real =
      ", ROUND(SUM(realisasi)/" + pembulatan + ",0) AS REALISASI_KONTRAK";

    let from = "monev" + thang + ".pa_realisasi_" + thang + " a";

    if (cutoff === "1") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "2") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "3") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "4") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "5") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "6") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);
        default:
          break;
      }
    } else if (cutoff === "7") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "8") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "9") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);
        default:
          break;
      }
    } else if (cutoff === "10") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else if (cutoff === "11") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);
        default:
          break;
      }
    } else if (cutoff === "12") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak);

        default:
          break;
      }
    } else {
      setFrom("");
    }
  };

  // const handleKddept = (dept) => {
  //   setDept(dept);

  //   if (dept === "XXX") {
  //     setProgram("XX");
  //     setGiat("XX");
  //     setKdunit("XX");
  //     setOutput("XX");
  //   } else if (dept === "000") {
  //     setProgram("XX");
  //     setGiat("XX");
  //     setKdunit("XX");
  //     setOutput("XX");
  //   } else {
  //     // setKdunit(kdunit);
  //   }
  // };
  // const handleUnit = (kdunit) => {
  //   setKdunit(kdunit);
  // };
  // const handleDekon = (dekon) => {
  //   setDekon(dekon);
  // };
  // const handleSatker = (satker) => {
  //   setSatker(satker);
  // };
  // const handleProgram = (program) => {
  //   setProgram(program);
  // };
  // const handleGiat = (giat) => {
  //   setGiat(giat);
  // };
  // const handleOutput = (output) => {
  //   setOutput(output);
  // };
  // const handleAkun = (akun) => {
  //   setAkun(akun);
  // };
  // const handleSdana = (sdana) => {
  //   setSdana(sdana);
  // };

  // PILIH JENIS OPTION //

  const getSwitchTanggal = (tanggal) => {
    setTanggal(tanggal);
    setCutoff("1");
  };
  // const getSwitchKddept = (kddept) => {
  //   setKddept(kddept);
  //   setDept("XXX");
  // };
  // const getSwitchUnit = (unit) => {
  //   setUnit(unit);
  //   setKdunit("XX");
  // };
  // const getSwitchDekon = (kddekon) => {
  //   setKddekon(kddekon);
  //   setDekon("XX");
  // };
  // const getSwitchsatker = (kdsatker) => {
  //   setSatker("XXX");
  //   setKdsatker(kdsatker);
  // };

  // const getSwitchprogram = (kdprogram) => {
  //   setProgram("XX");
  //   setKdprogram(kdprogram);
  // };
  // const getSwitchgiat = (kdgiat) => {
  //   setGiat("XX");
  //   setKdgiat(kdgiat);
  // };
  // const getSwitchoutput = (kdoutput) => {
  //   setOutput("XX");
  //   setKdoutput(kdoutput);
  // };
  // const getSwitchakun = (kdakun) => {
  //   setAkun("XX");
  //   setKdakun(kdakun);
  // };
  // const getSwitchsdana = (kdsdana) => {
  //   setSdana("XX");
  //   setKdsdana(kdsdana);
  // };

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
  const handleRadioSdana = (sdanaRadio) => {
    setSdanaradio(sdanaRadio);
  };
  const handleRadioKanwil = (kanwilRadio) => {
    setKanwilradio(kanwilRadio);
  };
  const handleRadioKppn = (kppnRadio) => {
    setKppnradio(kppnRadio);
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
  // const handlesatkerKondisi = (satkerInput) => {
  //   setSatkerkondisi(satkerInput);
  // };
  function satkerKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    setSatkerkondisipilih(value);
    setSatker("SEMUASATKER");
  }
  const generateSql = () => {
    const queryParams = {
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
      prov,
      provradio,
      kabkota,
      kabkotaradio,
      kanwil,
      kanwilradio,
      kppn,
      kppnradio,
      satker,
      satkerradio,
      satkerkondisi,
      fungsi,
      fungsiradio,
      subfungsiradio,
      program,
      programradio,
      giat,
      kegiatanradio,
      output,
      outputradio,
      // soutput,
      // soutputradio,
      akun,
      akunradio,
      sdana,
      sdanaradio,
      // komponen,
      // komponenradio,
      // subkomponen,
      // subkomponenradio,
      // item,
      // itemradio,
      // register,
      // registerradio,
      // sfungsi,
      select,
      from,
      opsidept,
      opsikatadept,
      opsiunit,
      opsikataunit,
      opsidekon,
      dekonkondisi,
      // opsiprov,
      // opsikataprov,
      // provkondisipilih,
      // provkondisi,
      // opsikdkabkota,
      // kdkabkotakondisi,
      kppnkondisipilih,
      kppnkondisi,
      opsikppn,
      opsikatakppn,
      kanwilkondisipilih,
      kanwilkondisi,
      opsikanwil,
      opsikatakanwil,
      // fungsikondisipilih,
      // fungsikondisi,
      // opsifungsi,
      // opsikatafungsi,
      // subfungsikondisipilih,
      // subfungsikondisi,
      // opsisubfungsi,
      // opsikatasubfungsi,
      programkondisipilih,
      programkondisi,
      opsiprogram,
      opsikataprogram,
      giatkondisipilih,
      giatkondisi,
      opsigiat,
      opsikatagiat,
      outputkondisipilih,
      outputkondisi,
      opsioutput,
      opsikataoutput,
      // suboutputkondisipilih,
      // suboutputkondisi,
      // opsisuboutput,
      // opsikatasuboutput,
      akunkondisipilih,
      akunkondisi,
      opsiakun,
      opsikataakun,
      opsisdana,
      opsikatasdana,
      sdanakondisi,
      // opsikomponen,
      // opsikatakomponen,
      // komponenkondisi,
      // opsikatasubkomponen,
      // opsisubkomponen,
      // subkomponenkondisi,
      // opsikataitem,
      // opsiitem,
      // itemkondisi,
      // opsikataregister,
      // opsiregister,
      // registerkondisi,
      pembulatan,
      opsikatasatker,
      opsisatker,
    };

    getSQL(queryParams);
    const query = getSQL(queryParams);
    setSql(query);
  };

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);

    if (total === 0) {
      setLoadingStatus(false);
    }
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

  // HANDLE PROGRAM

  const [programkondisi, setprogramkondisi] = useState("");
  const [opsikataprogram, setopsiKataprogram] = useState("");

  const getSwitchprogram = (kdprogram) => {
    setKdprogram(kdprogram);
    if (kdprogram) {
      setProgram("00");
    } else {
      setprogramkondisi("");
      setopsiKataprogram("");
      setProgram("XX");
    }
  };

  const handleProgram = (program) => {
    setProgram(program);
  };

  const [programkondisipilih, setprogramkondisipilih] = useState("0");
  const [opsiprogram, setopsiprogram] = useState("pilihprogram");

  const handleprogramKondisi = (programInput) => {
    setprogramkondisi(programInput);
  };
  const handleprogramKondisiKata = (programkata) => {
    setopsiKataprogram(programkata);
  };
  const handleRadioChangeprogram = (event) => {
    setopsiprogram(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihprogram" ? 5 : 0;
    setprogramkondisipilih(value);
    value === 0 ? setProgramradio("2") : setProgramradio("1");
  };

  // HANDLE KDGIAT

  const [giatkondisi, setgiatkondisi] = useState("");
  const [opsikatagiat, setopsiKatagiat] = useState("");

  const getSwitchgiat = (kdgiat) => {
    setKdgiat(kdgiat);
    if (kdgiat) {
      setGiat("00");
    } else {
      setgiatkondisi("");
      setopsiKatagiat("");
      setGiat("XX");
    }
  };

  const handleGiat = (giat) => {
    setGiat(giat);
  };

  const [giatkondisipilih, setgiatkondisipilih] = useState("0");
  const [opsigiat, setopsigiat] = useState("pilihgiat");

  const handlekegiatanKondisi = (giatInput) => {
    setgiatkondisi(giatInput);
  };
  const handlekegiatanKondisiKata = (giatkata) => {
    setopsiKatagiat(giatkata);
  };
  const handleRadioChangekegiatan = (event) => {
    setopsigiat(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihgiat" ? 5 : 0;
    setgiatkondisipilih(value);
    value === 0 ? setKegiatanradio("2") : setKegiatanradio("1");
  };

  // HANDLE OUTPUT

  const [outputkondisi, setoutputkondisi] = useState("");
  const [opsikataoutput, setopsiKataoutput] = useState("");

  const handleOutput = (output) => {
    setOutput(output);
  };

  const getSwitchoutput = (kdoutput) => {
    setKdoutput(kdoutput);
    if (kdoutput) {
      setOutput("SEMUAOUTPUT");
    } else {
      setoutputkondisi("");
      setopsiKataoutput("");
      setOutput("XX");
    }
  };

  const [outputkondisipilih, setoutputkondisipilih] = useState("0");
  const [opsioutput, setopsioutput] = useState("pilihoutput");

  const handleoutputKondisi = (outputInput) => {
    setoutputkondisi(outputInput);
  };
  const handleoutputKondisiKata = (outputkata) => {
    setopsiKataoutput(outputkata);
  };
  const handleRadioChangekeoutputan = (event) => {
    setopsioutput(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihoutput" ? 5 : 0;
    setoutputkondisipilih(value);
    value === 0 ? setOutputradio("2") : setOutputradio("1");
  };

  // HANDLE AKUN

  const [akunkondisi, setakunkondisi] = useState("");
  const [opsikataakun, setopsiKataakun] = useState("");

  const getSwitchakun = (kdakun) => {
    setKdakun(kdakun);
    if (kdakun) {
      setAkun("AKUN");
    } else {
      setopsiakun("pilihakun");
      setakunkondisi("");
      setopsiKataakun("");
      setAkun("XX");
    }
  };
  const handleAkun = (akun) => {
    setAkun(akun);
  };
  const [akunkondisipilih, setakunkondisipilih] = useState("0");
  const [opsiakun, setopsiakun] = useState("pilihakun");

  const handleakunKondisi = (akunInput) => {
    setakunkondisi(akunInput);
  };
  const handleakunKondisiKata = (akunkata) => {
    setopsiKataakun(akunkata);
  };
  const handleRadioChangeakun = (event) => {
    setopsiakun(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihakun" ? 5 : 0;
    setakunkondisipilih(value);
    value === 0 ? setAkunradio("2") : setAkunradio("1");
  };

  // HANDLE SDANA

  const [sdanakondisi, setsdanakondisi] = useState("");
  const [opsikatasdana, setopsiKatasdana] = useState("");

  const handleSdana = (sdana) => {
    setSdana(sdana);
  };

  const getSwitchsdana = (kdsdana) => {
    setKdsdana(kdsdana);
    if (kdsdana) {
      setSdana("00");
    } else {
      setsdanakondisi("");
      setopsiKatasdana("");
      setSdana("XX");
    }
  };

  const [sdanakondisipilih, setsdanakondisipilih] = useState("0");
  const [opsisdana, setopsisdana] = useState("pilihsdana");

  const handlesdanaKondisi = (sdanaInput) => {
    setsdanakondisi(sdanaInput);
  };
  const handlesdanaKondisiKata = (sdanakata) => {
    setopsiKatasdana(sdanakata);
  };
  const handleRadioChangesdana = (event) => {
    setopsisdana(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihsdana" ? 5 : 0;
    setsdanakondisipilih(value);
    value === 0 ? setSdanaradio("2") : setSdanaradio("1");
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Rowset SP2D</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">SP2D</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard">
          <Row>
            <Col lg={12}>
              <Card bg="secondary text-white">
                <Card.Body>
                  <div className="bagian-query">
                    <Thang
                      value={thang}
                      jenlap={jenlap}
                      onChange={handleThang}
                    />
                    <JenisLaporanRowset
                      value={jenlap}
                      akumulatifopt={akumulatif}
                      onChange={handleJenlap}
                    />

                    <Pembulatan
                      value={pembulatan}
                      onChange={handlePembulatan}
                    />
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
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKdUnit onChange={getSwitchUnit} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKddekon onChange={getSwitchDekon} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKppn onChange={getSwitchkppn} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSatker onChange={getSwitchsatker} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchProgram
                          onChange={getSwitchprogram}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKegiatan onChange={getSwitchgiat} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSdana
                          onChange={getSwitchsdana}
                          jenlap={jenlap}
                          setKdsdana={setKdsdana}
                          setSdana={setSdana}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchOutput onChange={getSwitchoutput} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchAkun
                          onChange={getSwitchakun}
                          jenlap={jenlap}
                          setKdakun={setKdakun}
                          setAkun={setAkun}
                        />
                      </Col>
                    </Row>

                    <div className="fade-in mt-3">
                      TA : {thang}, TIPE LAPORAN : {jenlap}, AKUMULATIF :
                      {akumulatif ? " TRUE " : " FALSE "}, PEMBULATAN :{" "}
                      {pembulatan}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card className="custom-card" bg="secondary text-white">
                <Card.Body>
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
                            babi="tampil"
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
                          *) banyak Kewenangan gunakan koma, exclude gunakan
                          tanda !
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
                  {kdprogram && (
                    <>
                      <Row>
                        <Col xs={2} sm={2} md={2}>
                          <span>Program</span>
                        </Col>
                        <Col xs={2} sm={2} md={2}>
                          <Form.Check
                            inline
                            type="radio"
                            label="Pilih Program"
                            value="pilihprogram"
                            checked={opsiprogram === "pilihprogram"}
                            onChange={handleRadioChangeprogram}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <span>
                            <Kdprogram
                              kdprogram={program}
                              kddept={dept}
                              kdunit={kdunit}
                              onChange={handleProgram}
                              status={opsiprogram}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <ProgramRadio
                            programRadio={handleRadioProgram}
                            selectedValue={programradio}
                            status={opsiprogram}
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
                              value="kondisiprogram"
                              checked={opsiprogram === "kondisiprogram"}
                              onChange={handleRadioChangeprogram}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <InputProgram
                            programkondisi={handleprogramKondisi}
                            status={opsiprogram}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          *) banyak Program gunakan koma, exclude gunakan tanda
                          !
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
                              value="kataprogram"
                              checked={opsiprogram === "kataprogram"}
                              onChange={handleRadioChangeprogram}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <InputKataProgram
                            opsikataprogram={handleprogramKondisiKata}
                            status={opsiprogram}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  {kdgiat && (
                    <>
                      <Row>
                        <Col xs={2} sm={2} md={2}>
                          <span>Kegiatan</span>
                        </Col>
                        <Col xs={2} sm={2} md={2}>
                          <Form.Check
                            inline
                            type="radio"
                            label="Pilih Kegiatan"
                            value="pilihgiat"
                            checked={opsigiat === "pilihgiat"}
                            onChange={handleRadioChangekegiatan}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <span>
                            <Kdgiat
                              kdgiat={giat}
                              kdprogram={program}
                              kddept={dept}
                              kdunit={kdunit}
                              onChange={handleGiat}
                              status={opsigiat}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <KegiatanRadio
                            kegiatanRadio={handleRadioKegiatan}
                            selectedValue={kegiatanradio}
                            status={opsigiat}
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
                              value="kondisigiat"
                              checked={opsigiat === "kondisigiat"}
                              onChange={handleRadioChangekegiatan}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <Inputkegiatan
                            kegiatankondisi={handlekegiatanKondisi}
                            status={opsigiat}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          *) banyak kegiatan gunakan koma, exclude gunakan tanda
                          !
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
                              value="katagiat"
                              checked={opsigiat === "katagiat"}
                              onChange={handleRadioChangekegiatan}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <InputKatakegiatan
                            opsikatakegiatan={handlekegiatanKondisiKata}
                            status={opsigiat}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  {kdoutput && (
                    <>
                      <Row>
                        <Col xs={2} sm={2} md={2}>
                          <span className="middle fade-in ">Output</span>
                        </Col>
                        <Col xs={2} sm={2} md={2}>
                          <Form.Check
                            inline
                            type="radio"
                            label="Pilih Output"
                            value="pilihoutput"
                            checked={opsioutput === "pilihoutput"}
                            onChange={handleRadioChangekeoutputan}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <span>
                            <Kdoutput
                              kdoutput={output}
                              kdgiat={giat}
                              kdprogram={program}
                              kddept={dept}
                              kdunit={kdunit}
                              onChange={handleOutput}
                              status={opsioutput}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <OutputRadio
                            outputRadio={handleRadioOutput}
                            selectedValue={outputradio}
                            status={opsioutput}
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
                              value="kondisioutput"
                              checked={opsioutput === "kondisioutput"}
                              onChange={handleRadioChangekeoutputan}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <InputOutput
                            outputkondisi={handleoutputKondisi}
                            status={opsioutput}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          *) banyak Output gunakan koma, exclude gunakan tanda !
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
                              value="kataoutput"
                              checked={opsioutput === "kataoutput"}
                              onChange={handleRadioChangekeoutputan}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <InputKataOutput
                            opsikataoutput={handleoutputKondisiKata}
                            status={opsioutput}
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
                  {kdsdana && (
                    <>
                      <Row>
                        <Col xs={2} sm={2} md={2}>
                          <span className="middle fade-in ">Sumber Dana</span>
                        </Col>
                        <Col xs={2} sm={2} md={2}>
                          <Form.Check
                            inline
                            type="radio"
                            label="Pilih Sumber Dana"
                            value="pilihsdana"
                            checked={opsisdana === "pilihsdana"}
                            onChange={handleRadioChangesdana}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <span>
                            <Kdsdana
                              onChange={handleSdana}
                              status={opsisdana}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <SdanaRadio
                            sdanaRadio={handleRadioSdana}
                            selectedValue={sdanaradio}
                            status={opsisdana}
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
                              value="kondisisdana"
                              checked={opsisdana === "kondisisdana"}
                              onChange={handleRadioChangesdana}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <InputSdana
                            sdanakondisi={handlesdanaKondisi}
                            status={opsisdana}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          *) banyak Sumber Dana gunakan koma, exclude gunakan
                          tanda !
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
                              value="katasdana"
                              checked={opsisdana === "katasdana"}
                              onChange={handleRadioChangesdana}
                            />
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <InputKataSdana
                            opsikatasdana={handlesdanaKondisiKata}
                            status={opsisdana}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  {tanggal && (
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
                              disabled={loadingStatus}
                            >
                              {loadingStatus ? "Tayang" : "Tayang"}
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              className="button fade-in me-2"
                              onClick={() => {
                                setLoadingStatus(true);
                                generateSql();
                                setExport2(true);
                              }}
                              disabled={loadingStatus} // Menonaktifkan tombol saat loading
                            >
                              {loadingStatus && (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  className="me-2"
                                  role="status"
                                  aria-hidden="true"
                                />
                              )}
                              {loadingStatus ? "Loading..." : "Download"}
                            </Button>
                            {role === "0" || role === "1" || role === "X" ? (
                              <Button
                                variant="danger"
                                size="sm"
                                className="button fade-in me-2"
                                onClick={handlegetQuerySQL}
                              >
                                SQL
                              </Button>
                            ) : null}
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
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </main>

      {jenlap === "1" && showModal ? (
        <HasilQuerySp2d
          query={sql}
          showModal={showModal}
          thang={thang}
          cutoff={cutoff}
          closeModal={closeModal}
        />
      ) : null}
      {export2 && (
        <GenerateCSV
          query3={sql}
          status={handleStatus}
          namafile={`v3_CSV_SP2D_${moment().format("DDMMYY-HHmmss")}`}
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
          jenis="Kontrak"
          showModalsimpan={showModalsimpan}
          closeModalsimpan={closeModalsimpan}
        />
      )}
    </>
  );
};

export default InquirySP2D;
