import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Button,
  Form,
  Spinner,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import GenerateExcel from "../CSV/generateExcell";
import { Pesan } from "../notifikasi/Omspan";
import MyContext from "../../../auth/Context";
import DataApbd from "./formTemaApbd";
import JenisLaporanTematik from "../tematik/JenisLaporanTematik";
import { HasilQuery, Sql } from "../tematik/hasilQueryTematik";
import { Simpan } from "../simpanquery/simpan";

import Kddept from "../../referensi/Kddept";
import Kdunit from "../../referensi/Kdunit";
import Kddekon from "../../referensi/Kddekon";
import Kdlokasi from "../../referensi/Kdlokasi";
import Kdkabkota from "../../referensi/Kdkabkota";
import Kdkanwil from "../../referensi/Kdkanwil";
import Kdkppn from "../../referensi/Kdkppn";
import Kdsatker from "../../referensi/Kdsatker";
import Kdfungsi from "../../referensi/Kdfungsi";
import Kdsfungsi from "../../referensi/Kdsfungsi";
import Kdprogram from "../../referensi/Kdprogram";
import Kdgiat from "../../referensi/Kdgiat";
import Kdoutput from "../../referensi/Kdoutput";
import Kdakun from "./Kdakuntematik";
import Kdsdana from "../../referensi/Kdsdana";

import DeptRadio from "../../aplikasi/inquiry/radio/deptRadio";
import InputDept from "../../aplikasi/inquiry/kondisi/InputDept";
import InputKppn from "../../aplikasi/inquiry/kondisi/InputKppn";
import InputSatker from "../../aplikasi/inquiry/kondisi/InputSatker";

import UnitRadio from "../../aplikasi/inquiry/radio/unitRadio";
import DekonRadio from "../../aplikasi/inquiry/radio/dekonRadio";
import ProvRadio from "../../aplikasi/inquiry/radio/provRadio";
import KabkotaRadio from "../../aplikasi/inquiry/radio/kabkotaRadio";
import KanwilRadio from "../../aplikasi/inquiry/radio/kanwilRadio";
import KppnRadio from "../../aplikasi/inquiry/radio/kppnRadio";
import SatkerRadio from "../../aplikasi/inquiry/radio/satkerRadio";
import FungsiRadio from "../../aplikasi/inquiry/radio/fungsiRadio";
import SubfungsiRadio from "../../aplikasi/inquiry/radio/subfungsiRadio";
import ProgramRadio from "../../aplikasi/inquiry/radio/programRadio";
import KegiatanRadio from "../../aplikasi/inquiry/radio/kegiatanRadio";
import OutputRadio from "../../aplikasi/inquiry/radio/outputRadio";
import AkunRadio from "../../aplikasi/inquiry/radio/akunRadio";
import SdanaRadio from "../inquiry/radio/sdanaRadio";

import PnRadio from "../../aplikasi/inquiry/radio/pnRadio";
import PpRadio from "../../aplikasi/inquiry/radio/ppRadio";
import PxRadio from "../inquiry/radio/pxRadio";
import KpRadio from "../../aplikasi/inquiry/radio/KpRadio";
import MpRadio from "../inquiry/radio/MpRadio";
// import pilihanData from "../../aplikasi/rkakl/pilihanDataRkakl";
// import pilihanData from "./pilihanData";
import pilihanDataTematik from "./pilihanDataTematik";
import { getSQLTematik } from "../tematik/SqlTematik";
import ThangJenlap from "../tematik/ThangJenlap";

import PembulatanTematik from "./PembulatanTematik";
import Kdsoutput from "../../referensi/Kdsoutput";
import SoutputRadio from "../../aplikasi/inquiry/radio/soutputRadio";

import Kdregister from "../../referensi/Kdregister";
import RegisterRadio from "../../aplikasi/inquiry/radio/registerRadio";
import GenerateCSV from "../CSV/generateCSV";

import InputKataDept from "../inquiry/kondisi/InputKataDept";
import InputKataProv from "../inquiry/kondisi/InputKataProv";
import InputUnit from "../inquiry/kondisi/InputUnit";
import InputDekon from "../inquiry/kondisi/InputDekon";
import InputProv from "../inquiry/kondisi/InputProv";
import Inputkdkabkota from "../inquiry/kondisi/Inputkdkabkota";
import InputKanwil from "../inquiry/kondisi/InputKanwil";
import InputFungsi from "../inquiry/kondisi/InputFungsi";
import InputKataFungsi from "../inquiry/kondisi/InputKataFungsi";
import InputSubfungsi from "../inquiry/kondisi/InputSubfungsi";
import InputKataSubfungsi from "../inquiry/kondisi/InputKataSubfungsi";
import InputProgram from "../inquiry/kondisi/InputProgram";
import InputKataProgram from "../inquiry/kondisi/InputKataProgram";
import Inputkegiatan from "../inquiry/kondisi/Inputkegiatan";
import InputKatakegiatan from "../inquiry/kondisi/InputKatakegiatan";
import InputOutput from "../inquiry/kondisi/InputOutput";
import InputKataOutput from "../inquiry/kondisi/InputKataOutput";
import InputKataAkun from "../inquiry/kondisi/InputKataAkun";
import InputKataKanwil from "../inquiry/kondisi/InputKataKanwil";
import InputKataKppn from "../inquiry/kondisi/InputKataKppn";
import InputKataSatker from "../inquiry/kondisi/InputKataSatker";
import InputAkun from "../inquiry/kondisi/InputAkun";
import InputKataSubOutput from "../inquiry/kondisi/InputKataSubOutput";
import InputSubOutput from "../inquiry/kondisi/InputSubOutput";
import InputSdana from "../inquiry/kondisi/InputSdana";

import JenisPN from "../../referensi/JenisPN";
import Prioritas from "./ref_pn_prioritas";
import KegPrioritas from "./ref_keg_prioritas";
import ProyekPrioritas from "./ref_px";
import JenisMP from "../../referensi/JenisMP";
import TemaRadio from "../inquiry/radio/TemaRadio";
import JenisTEMA from "../../referensi/JenisTEMA";
import moment from "moment";
import JenisInflasi from "../../referensi/JenisInflasi";
import InflasiRadio from "../inquiry/radio/InflasiRadio";
import JenisStunting from "../../referensi/JenisStunting";
import StuntingRadio from "../inquiry/radio/StuntingRadio";
import JenisMbg from "../../referensi/JenisMbg";
import MbgRadio from "../inquiry/radio/MbgRadio";

const Tematik = () => {
  const [opsitema, setOpsitema] = useState([]);
  const [opsiinflasi, setOpsiInflasi] = useState([]);
  // const [opsistunting, setOpsiStunting] = useState([]);

  const handleOpsitemaChange = (data) => {
    setOpsitema(data);
  };
  const handleOpsiInflasi = (data) => {
    setOpsiInflasi(data);
  };
  // // console.log(opsiinflasi);
  // const handleOpsiStunting = (data) => {
  //   setOpsiStunting(data);
  // };
  // console.log(opsistunting);

  const [showModalTematik, setShowModalTematik] = useState(false);
  const [showModalsql, setShowModalsql] = useState(false);
  const [showModalsimpan, setShowModalsimpan] = useState(false);
  const {
    role,
    username,
    loadingExcell,
    setloadingExcell,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
  } = useContext(MyContext);

  const [jenlap, setJenlap] = useState("1");
  // console.log(jenlap);
  const [thang, setThang] = useState(new Date().getFullYear());
  const [pn, setPN] = useState("00");
  const [prioritas, setPrioritas] = useState("00");
  const [kp, setKp] = useState("00");
  const [px, setPx] = useState("00");
  const [mp, setMp] = useState("00");
  const [tema, setTema] = useState("00");
  const [inf, setInf] = useState("00");
  const [stun, setStun] = useState("00");
  const [miskin, setMiskin] = useState("00");
  const [pemilu, setPemilu] = useState("00");
  const [ikn, setIkn] = useState("00");
  const [pangan, setPangan] = useState("00");
  const [banper, setBanper] = useState("00");
  const [mbg, setMbg] = useState("00");
  const [swasembada, setSwasembada] = useState("00");

  const [kddept, setKddept] = useState(true);
  const [unit, setUnit] = useState(false);
  const [kddekon, setKddekon] = useState(false);
  const [kdprov, setKdprov] = useState(false);
  const [kdkabkota, setKdkabkota] = useState(false);
  const [kdkanwil, setKdkanwil] = useState(false);
  const [kdkppn, setKdkppn] = useState(false);
  const [kdsatker, setKdsatker] = useState(false);
  const [kdfungsi, setKdfungsi] = useState(false);
  const [kdsfungsi, setKdsfungsi] = useState(false);
  const [kdprogram, setKdprogram] = useState(false);
  const [kdgiat, setKdgiat] = useState(false);
  const [kdoutput, setKdoutput] = useState(false);
  const [kdsoutput, setKdsoutput] = useState(false);
  const [kdakun, setKdakun] = useState(false);
  const [kdsdana, setKdsdana] = useState(false);
  const [kdregister, setkdRegister] = useState(false);

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
  const [soutput, setsOutput] = useState("XX");
  const [akun, setAkun] = useState("XX");
  const [sdana, setSdana] = useState("XX");

  const [register, setRegister] = useState("XX");
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
  const [soutputradio, setsOutputradio] = useState("1");
  const [akunradio, setAkunradio] = useState("1");
  const [sdanaradio, setSdanaradio] = useState("1");

  const [registerradio, setRegisterradio] = useState("1");
  const [pnradio, setPnradio] = useState("1");
  const [ppradio, setPpradio] = useState("1");
  const [kpradio, setKpradio] = useState("1");
  const [pxradio, setPxradio] = useState("1");
  const [mpradio, setMpradio] = useState("1");
  const [temaradio, setTemaradio] = useState("1");
  const [inflasiradio, setInflasiradio] = useState("1");
  const [stuntingradio, setStuntingradio] = useState("1");
  const [mbgradio, setMbgradio] = useState("1");

  const [cekapbd, setCekapbd] = useState(false);

  const [sql, setSql] = useState(null);
  const [from, setFrom] = useState("");
  const [select, setSelect] = useState("");

  const [export2, setExport2] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

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

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  const handleCekapbd = () => {
    setCekapbd(false);
  };

  useEffect(() => {
    setExport2(false);
  }, [sql]);

  const handleCutoffcek = () => {
    let pagu = ", ROUND(sum(a.pagu)/" + pembulatan + ",0) AS PAGU ";

    let pagu_stun = ", ROUND(sum(a.pagu)/" + pembulatan + ",0) AS PAGU ";

    let pagu_banper = ", ROUND(sum(a.pagu)/" + pembulatan + ",0) AS PAGU ";

    let realisasi =
      " ,ROUND(SUM(real1)/" +
      pembulatan +
      ",0) AS JAN, ROUND(SUM(real2)/" +
      pembulatan +
      ", 0) AS FEB,  ROUND(SUM(real3)/" +
      pembulatan +
      ", 0) AS MAR,  ROUND(SUM(real4)/" +
      pembulatan +
      ", 0) AS APR,  ROUND(SUM(real5)/" +
      pembulatan +
      ", 0) AS MEI,  ROUND(SUM(real6)/" +
      pembulatan +
      ", 0) AS JUN,  ROUND(SUM(real7)/" +
      pembulatan +
      ", 0) AS JUL,  ROUND(SUM(real8)/" +
      pembulatan +
      ", 0) AS AGS,  ROUND(SUM(real9)/" +
      pembulatan +
      ", 0) AS SEP,  ROUND(SUM(real10)/" +
      pembulatan +
      ", 0) OKT,  ROUND(SUM(real11)/" +
      pembulatan +
      ", 0) AS NOV,  ROUND(SUM(real12)/" +
      pembulatan +
      ", 0) AS DES, ";

    let realisasi_stun =
      " ,ROUND(SUM(real1)/" +
      pembulatan +
      ",0) AS JAN, ROUND(SUM(real2)/" +
      pembulatan +
      ", 0) AS FEB,  ROUND(SUM(real3)/" +
      pembulatan +
      ", 0) AS MAR,  ROUND(SUM(real4)/" +
      pembulatan +
      ", 0) AS APR,  ROUND(SUM(real5)/" +
      pembulatan +
      ", 0) AS MEI,  ROUND(SUM(real6)/" +
      pembulatan +
      ", 0) AS JUN,  ROUND(SUM(real7)/" +
      pembulatan +
      ", 0) AS JUL,  ROUND(SUM(real8)/" +
      pembulatan +
      ", 0) AS AGS,  ROUND(SUM(real9)/" +
      pembulatan +
      ", 0) AS SEP,  ROUND(SUM(real10)/" +
      pembulatan +
      ", 0) OKT,  ROUND(SUM(real11)/" +
      pembulatan +
      ", 0) AS NOV,  ROUND(SUM(real12)/" +
      pembulatan +
      ", 0) AS DES, ";

    let realisasi_banper =
      " ,ROUND(SUM(real1)/" +
      pembulatan +
      ",0) AS JAN, ROUND(SUM(real2)/" +
      pembulatan +
      ", 0) AS FEB,  ROUND(SUM(real3)/" +
      pembulatan +
      ", 0) AS MAR,  ROUND(SUM(real4)/" +
      pembulatan +
      ", 0) AS APR,  ROUND(SUM(real5)/" +
      pembulatan +
      ", 0) AS MEI,  ROUND(SUM(real6)/" +
      pembulatan +
      ", 0) AS JUN,  ROUND(SUM(real7)/" +
      pembulatan +
      ", 0) AS JUL,  ROUND(SUM(real8)/" +
      pembulatan +
      ", 0) AS AGS,  ROUND(SUM(real9)/" +
      pembulatan +
      ", 0) AS SEP,  ROUND(SUM(real10)/" +
      pembulatan +
      ", 0) OKT,  ROUND(SUM(real11)/" +
      pembulatan +
      ", 0) AS NOV,  ROUND(SUM(real12)/" +
      pembulatan +
      ", 0) AS DES, ";

    let blokir = " ROUND(SUM(a.blokir) /" + pembulatan + ",0) AS BLOKIR";

    let blokir_stun = " ROUND(SUM(a.blokir) /" + pembulatan + ",0) AS BLOKIR";

    let blokir_banper = " ROUND(SUM(a.blokir) /" + pembulatan + ",0) AS BLOKIR";

    let from = "monev" + thang + ".a_pagu_real_bkpk_dja_" + thang + " a";

    let from_stun =
      "monev" + thang + ".a_pagu_real_bkpk_dja_" + thang + "_stunting a";

    let from_banper =
      "monev" + thang + ".pagu_real_detail_harian_" + thang + " a";

    switch (jenlap) {
      case "1":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setPN("00");
        setKp("00");
        setPrioritas("00");
        setPx("00");
        break;
      case "2":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setMp("00");
        break;
      case "3":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setTema("00");
        break;
      case "4":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setInf("00");
        break;
      case "5":
        setFrom(from_stun);
        setSelect(pagu_stun + realisasi_stun + blokir_stun);
        setStun("00");
        break;
      case "7":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setMiskin("00");
        break;
      case "8":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setPemilu("00");
        break;
      case "9":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setIkn("00");
        break;
      case "10":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setPangan("00");
        break;
      case "11":
        setFrom(from_banper);
        setSelect(pagu_banper + realisasi_banper + blokir_banper);
        setBanper("00");
        break;
      case "12":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setMbg("00");
        break;
      case "13":
        setFrom(from);
        setSelect(pagu + realisasi + blokir);
        setSwasembada("00");
        break;
      default:
    }
  };

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
  const handleJenisPN = (jenispn) => {
    //console.log(jenispn);

    setPN(jenispn);
    if (jenispn === "00") {
      setKp("00");
      setPx("00");
      setPrioritas("00");
    }
  };

  const handlePrioritas = (kdpp) => {
    // program prioritas

    setPrioritas(kdpp);
  };
  // console.log(prioritas);
  const handleKp = (kdkp) => {
    setKp(kdkp);
    //console.log(kdkp);
  };
  const handlePx = (kdpx) => {
    setPx(kdpx);
    //console.log(kdpx);
  };
  const handleMp = (kdmp) => {
    setMp(kdmp);
  };
  const handleTema = (kdtema) => {
    setTema(kdtema);
  };

  const handleStunting = (kdstunting) => {
    setStun(kdstunting);
  };

  const handleMbg = (kdmbg) => {
    setMbg(kdmbg);
  };

  const handleRegister = (register) => {
    setRegister(register);
  };

  const handlePembulatan = (pembulatan) => {
    setPembulatan(pembulatan);
  };

  useEffect(() => {
    handleCutoffcek();
  }, [thang, pembulatan, jenlap, select, soutput]);

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
  const handleRadioProv = (provRadio) => {
    setProvradio(provRadio);
  };
  const handleRadioKabkota = (kabkotaRadio) => {
    setKabkotaradio(kabkotaRadio);
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
  const handleRadioFungsi = (fungsiRadio) => {
    setFungsiradio(fungsiRadio);
  };
  const handleRadioSubfungsi = (subfungsiRadio) => {
    setSubfungsiradio(subfungsiRadio);
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
  const handleRadiosOutput = (soutputRadio) => {
    setsOutputradio(soutputRadio);
  };
  const handleRadioAkun = (akunRadio) => {
    setAkunradio(akunRadio);
  };
  const handleRadioSdana = (sdanaRadio) => {
    setSdanaradio(sdanaRadio);
  };
  const handleRadioRegister = (registerRadio) => {
    setRegisterradio(registerRadio);
  };
  const handleRadioPn = (pnRadio) => {
    setPnradio(pnRadio);
  };
  const handleRadioPp = (ppRadio) => {
    setPpradio(ppRadio);
  };
  const handleRadioKp = (kpRadio) => {
    setKpradio(kpRadio);
  };
  const handleRadioPx = (pxRadio) => {
    setPxradio(pxRadio);
  };
  const handleRadioMp = (mpRadio) => {
    setMpradio(mpRadio);
  };
  const handleRadioTema = (temaRadio) => {
    setTemaradio(temaRadio);
  };
  const handleRadioInflasi = (inflasiRadio) => {
    setInflasiradio(inflasiRadio);
  };
  const handleRadioStunting = (stuntingRadio) => {
    setStuntingradio(stuntingRadio);
  };
  const handleRadioMbg = (mbgRadio) => {
    setMbgradio(mbgRadio);
  };

  // KONDISI

  function deptKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    setDeptkondisipilih(value);
    setDept("000");
  }

  function satkerKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    setsatkerkondisipilih(value);
    setSatker("SEMUASATKER");
  }

  const handlegetQuery = () => {
    setShowModalTematik(true);
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
    setShowModalTematik(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const generateSql = () => {
    const queryParams = {
      tema,
      temaradio,
      inflasiradio,
      stuntingradio,
      mbgradio,
      mp,
      mpradio,
      px,
      pxradio,
      kp,
      kpradio,
      pn,
      pnradio,
      prioritas,
      ppradio,
      thang,
      jenlap,
      role,
      kodekppn,
      kodekanwil,
      deptradio,
      dept,
      deptkondisi,
      kdunit,
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
      kppnkondisi,
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
      soutput,
      soutputradio,
      suboutputkondisipilih,
      suboutputkondisi,
      opsisuboutput,
      opsikatasuboutput,
      akun,
      akunradio,
      sdana,
      sdanaradio,
      sfungsi,
      select,
      from,
      opsidept,
      opsikatadept,
      opsiunit,
      opsikataunit,
      opsidekon,
      dekonkondisi,
      opsiprov,
      opsikataprov,
      provkondisi,
      opsikdkabkota,
      kdkabkotakondisi,
      opsikppn,
      opsikatakppn,
      kanwilkondisi,
      opsikanwil,
      opsikatakanwil,
      opsisatker,
      opsikatasatker,
      fungsikondisi,
      opsifungsi,
      opsikatafungsi,
      subfungsikondisi,
      opsisubfungsi,
      opsikatasubfungsi,
      programkondisi,
      opsiprogram,
      opsikataprogram,
      giatkondisi,
      opsigiat,
      opsikatagiat,
      outputkondisi,
      opsioutput,
      opsikataoutput,
      akunkondisi,
      opsiakun,
      opsikataakun,
      sdanakondisi,
      opsisdana,
      pembulatan,
      opsitema,
      opsiinflasi,
      // opsistunting,
      inf,
      stun,
      mbg,
      miskin,
      pemilu,
      ikn,
      pangan,
      banper,
      swasembada,
    };

    getSQLTematik(queryParams);
    const query = getSQLTematik(queryParams);
    setSql(query);
  };
  // console.log(sql);
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

  // HANDLE PROVINSI
  const [provkondisi, setprovkondisi] = useState("");
  const [opsikataprov, setopsiKataprov] = useState("");
  const handleProv = (prov) => {
    setProv(prov);
    if (prov === "XX" || prov === "00") {
      setKabkota("ALL");
    }
  };
  const getSwitchProv = (kdprov) => {
    setKdprov(kdprov);
    if (kdprov) {
      setProv("00");
    } else {
      setprovkondisi("");
      setopsiKataprov("");
      setProv("XX");
    }
  };
  const [provkondisipilih, setprovkondisipilih] = useState("0");
  const [opsiprov, setopsiprov] = useState("pilihprov");

  const handleprovKondisi = (provInput) => {
    setprovkondisi(provInput);
  };
  const handleprovKondisiKata = (provkata) => {
    setopsiKataprov(provkata);
  };
  const handleRadioChangeProv = (event) => {
    setopsiprov(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihprov" ? 5 : 0;
    setprovkondisipilih(value);
    value === 0 ? setProvradio("2") : setProvradio("1");
  };
  // HANDLE KDKABKOTA
  const [kdkabkotakondisi, setkdkabkotakondisi] = useState("");
  const [kdkabkotakondisipilih, setkdkabkotakondisipilih] = useState("0");
  const [opsikdkabkota, setopsikdkabkota] = useState("pilihkdkabkota");

  const handleKabkota = (kabkota) => {
    prov === "XX" ? setKabkota("XX") : setKabkota(kabkota);
    setKabkota(kabkota);
  };
  const getSwitchKabkota = (kdkabkota) => {
    setKdkabkota(kdkabkota);
    if (kdkabkota) {
      setKabkota("ALL");
    } else {
      setkdkabkotakondisi("");
      setKabkota("XX");
    }
  };

  const handlekdkabkotaKondisi = (kdkabkotaInput) => {
    setkdkabkotakondisi(kdkabkotaInput);
  };

  const handleRadioChangekdkabkota = (event) => {
    setopsikdkabkota(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihkdkabkota" ? 5 : 0;
    setkdkabkotakondisipilih(value);
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

  // HANDLE FUNGSI

  const [fungsikondisi, setfungsikondisi] = useState("");
  const [opsikatafungsi, setopsiKatafungsi] = useState("");

  const handleFungsi = (fungsi) => {
    // console.log(fungsi);
    if (fungsi === "00") {
      setFungsi("SEMUAFUNGSI");
      setSfungsi("SEMUASUBFUNGSI");
    } else {
      setFungsi(fungsi);
      setSfungsi("SEMUASUBFUNGSI");
    }
  };
  const getSwitchfungsi = (kdfungsi) => {
    setKdfungsi(kdfungsi);
    //setSfungsi(fungsi);

    if (kdfungsi) {
      setFungsi("SEMUAFUNGSI");
    } else {
      setfungsikondisi("");
      setopsiKatafungsi("");
      setFungsi("XX");
      // setSfungsi("SEMUAFUNGSI");
    }
  };

  const [fungsikondisipilih, setfungsikondisipilih] = useState("0");
  const [opsifungsi, setopsifungsi] = useState("pilihfungsi");

  const handlefungsiKondisi = (fungsiInput) => {
    setfungsikondisi(fungsiInput);
  };
  const handlefungsiKondisiKata = (fungsikata) => {
    setopsiKatafungsi(fungsikata);
  };
  const handleRadioChangefungsi = (event) => {
    setopsifungsi(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihfungsi" ? 5 : 0;
    setfungsikondisipilih(value);
    value === 0 ? setFungsiradio("2") : setFungsiradio("1");
  };

  // HANDLE SUB FUNGSI

  const [subfungsikondisi, setsubfungsikondisi] = useState("");
  const [opsikatasubfungsi, setopsiKatasubfungsi] = useState("");

  const handleSfungsi = (sfungsi) => {
    // setSfungsi(sfungsi);
    // console.log(sfungsi);
    if (sfungsi === "00") {
      setSfungsi("SEMUASUBFUNGSI");
    } else {
      setSfungsi(sfungsi);
      // setSfungsi("SEMUAFUNGSI");
    }
  };

  const getSwitchsfungsi = (kdsfungsi) => {
    setKdsfungsi(kdsfungsi);
    if (kdsfungsi) {
      setSfungsi("SEMUASUBFUNGSI");
    } else {
      setsubfungsikondisi("");
      setopsiKatasubfungsi("");
      setSfungsi("XX");
    }
  };

  const [subfungsikondisipilih, setsubfungsikondisipilih] = useState("0");
  const [opsisubfungsi, setopsisubfungsi] = useState("pilihsubfungsi");

  const handlesubfungsiKondisi = (subfungsiInput) => {
    setsubfungsikondisi(subfungsiInput);
  };
  const handlesubfungsiKondisiKata = (subfungsikata) => {
    setopsiKatasubfungsi(subfungsikata);
  };
  const handleRadioChangesubfungsi = (event) => {
    setopsisubfungsi(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihsubfungsi" ? 5 : 0;
    setsubfungsikondisipilih(value);
    value === 0 ? setSubfungsiradio("2") : setSubfungsiradio("1");
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

  // HANDLE SUB OUTPUT

  const [suboutputkondisi, setsuboutputkondisi] = useState("");
  const [opsikatasuboutput, setopsiKatasuboutput] = useState("");

  const getSwitchsOutput = (kdsoutput) => {
    setKdsoutput(kdsoutput);
    if (kdsoutput) {
      setsOutput("SEMUASUBOUTPUT");
    } else {
      setoutputkondisi("");
      setopsiKatasuboutput("");
      setsOutput("XX");
    }
  };
  const handlesOutput = (soutput) => {
    setsOutput(soutput);
  };

  const [suboutputkondisipilih, setsuboutputkondisipilih] = useState("0");
  const [opsisuboutput, setopsisuboutput] = useState("pilihsuboutput");

  const handlesuboutputKondisi = (suboutputInput) => {
    setsuboutputkondisi(suboutputInput);
  };
  const handlesuboutputKondisiKata = (suboutputkata) => {
    setopsiKatasuboutput(suboutputkata);
  };
  const handleRadioChangekesuboutputan = (event) => {
    setopsisuboutput(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihsuboutput" ? 5 : 0;
    setsuboutputkondisipilih(value);
    value === 0 ? setsOutputradio("2") : setsOutputradio("1");
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
  //console.log(akun);
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
  // const [opsikatasdana, setopsiKatasdana] = useState("");

  const getSwitchsdana = (kdsdana) => {
    setKdsdana(kdsdana);
    if (kdsdana) {
      setSdana("SEMUASUMBERDANA");
    } else {
      setopsisdana("pilihsdana");
      setsdanakondisi("");
      // setopsiKatasdana("");
      setSdana("XX");
    }
  };
  //console.log(sdana);
  const handleSdana = (sdana) => {
    setSdana(sdana);
  };
  const [sdanakondisipilih, setsdanakondisipilih] = useState("0");
  const [opsisdana, setopsisdana] = useState("pilihsdana");

  const handlesdanaKondisi = (sdanaInput) => {
    setsdanakondisi(sdanaInput);
  };
  // const handlesdanaKondisiKata = (sdanakata) => {
  //   setopsiKatasdana(sdanakata);
  // };
  const handleRadioChangesdana = (event) => {
    setopsisdana(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihsdana" ? 5 : 0;
    setsdanakondisipilih(value);
    value === 0 ? setSdanaradio("2") : setSdanaradio("1");
  };

  // console.log(opsiinflasi);
  // console.log(inflasiradio);
  // console.log(sql);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Tematik</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">Tematik Anggaran</li>
            </ol>
          </nav>
        </div>
        <section className="section dashboard">
          <Tab.Container defaultActiveKey="tematik-apbn">
            <Nav
              variant="tabs"
              className="nav-tabs-bordered sticky-user is-sticky-user mb-1 bg-white"
              role="tablist"
            >
              <Nav.Item className="tematik-tab">
                <Nav.Link eventKey="tematik-apbn" role="tab">
                  <i></i> <strong>APBN</strong>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="tematik-apbd"
                  role="tab"
                  onClick={handleCekapbd}
                >
                  <i></i> <strong>APBD</strong>
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="tematik-apbn" role="tab">
                <Row>
                  <Col lg={12}>
                    <Card bg="secondary text-white">
                      <Card.Body>
                        <div className="bagian-query">
                          <div className="custom-content">
                            <ThangJenlap
                              value={thang}
                              jenlap={jenlap}
                              onChange={handleThang}
                            />
                            <JenisLaporanTematik
                              value={jenlap}
                              onChange={handleJenlap}
                            />
                            <PembulatanTematik
                              value={pembulatan}
                              onChange={handlePembulatan}
                            />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                {jenlap === "1" && (
                  <>
                    <Row>
                      <Col lg={12}>
                        <Card bg="secondary text-white" className="custom-card">
                          <Card.Body>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span> Jenis PN</span>
                              </Col>

                              <Col xs={4} sm={4} md={4} className="my-2">
                                <JenisPN value={pn} onChange={handleJenisPN} />
                              </Col>
                              <Col xs={6} sm={6} md={6} className="my-2">
                                <PnRadio
                                  pnRadio={handleRadioPn}
                                  selectedValue={pnradio}
                                  status="pilihPN"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span className="fade-in ">
                                  Program Prioritas
                                </span>
                              </Col>

                              <Col xs={4} sm={4} md={4} className="my-2">
                                <Prioritas
                                  kdpn={pn}
                                  kdpp={prioritas}
                                  onChange={handlePrioritas}
                                />
                              </Col>
                              <Col xs={6} sm={6} md={6} className="my-2">
                                <PpRadio
                                  ppRadio={handleRadioPp}
                                  selectedValue={ppradio}
                                  status="pilihPP"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span>Kegiatan Prioritas</span>
                              </Col>

                              <Col xs={4} sm={4} md={4} className="my-2">
                                <KegPrioritas
                                  kdpn={pn}
                                  kdpp={prioritas}
                                  kdkp={kp}
                                  onChange={handleKp}
                                  thang={thang}
                                />
                              </Col>
                              <Col xs={6} sm={6} md={6} className="my-2">
                                <KpRadio
                                  kpRadio={handleRadioKp}
                                  selectedValue={kpradio}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span>Proyek Prioritas</span>
                              </Col>

                              <Col xs={4} sm={4} md={4} className="my-2">
                                <ProyekPrioritas
                                  kdpn={pn}
                                  kdpp={prioritas}
                                  kdkp={kp}
                                  kdpx={px}
                                  onChange={handlePx}
                                  thang={thang}
                                />
                              </Col>
                              <Col xs={6} sm={6} md={6} className="my-2">
                                <PxRadio
                                  pxRadio={handleRadioPx}
                                  selectedValue={pxradio}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
                {jenlap === "2" && (
                  <>
                    <Row>
                      <Col lg={12}>
                        <Card bg="secondary text-white" className="custom-card">
                          <Card.Body>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span className="fade-in ">
                                  {" "}
                                  Jenis Major Project
                                </span>
                              </Col>

                              <Col xs={4} sm={4} md={4} className="my-2">
                                <JenisMP value={mp} onChange={handleMp} />
                              </Col>
                              <Col xs={6} sm={6} md={6} className="my-2">
                                <MpRadio
                                  mpRadio={handleRadioMp}
                                  selectedValue={mpradio}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
                {jenlap === "3" && (
                  <>
                    <Row>
                      <Col lg={12}>
                        <Card bg="secondary text-white" className="custom-card">
                          <Card.Body>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span className="fade-in ">
                                  {" "}
                                  Jenis Tema Anggaran
                                </span>
                              </Col>

                              <Col xs={6} sm={6} md={6} className="my-2">
                                <JenisTEMA
                                  onOpsitemaChange={handleOpsitemaChange}
                                />
                              </Col>
                              <Col xs={4} sm={4} md={4} className="my-2">
                                <TemaRadio
                                  temaRadio={handleRadioTema}
                                  selectedValue={temaradio}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>{" "}
                  </>
                )}
                {jenlap === "4" && (
                  <>
                    <Row>
                      <Col lg={12}>
                        <Card bg="secondary text-white" className="custom-card">
                          <Card.Body>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span className="fade-in "> Opsi</span>
                              </Col>

                              <Col xs={6} sm={6} md={6} className="my-2">
                                <JenisInflasi
                                  onOpsiChange={handleOpsiInflasi}
                                />
                              </Col>
                              <Col xs={4} sm={4} md={4} className="my-2">
                                <InflasiRadio
                                  inflasiRadio={handleRadioInflasi}
                                  selectedValue={inflasiradio}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>{" "}
                  </>
                )}
                {jenlap === "5" && (
                  <>
                    <Row>
                      <Col lg={12}>
                        <Card bg="secondary text-white" className="custom-card">
                          <Card.Body>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span className="fade-in ">Intervensi</span>
                              </Col>

                              <Col xs={4} sm={4} md={4} className="my-2">
                                <JenisStunting
                                  value={stun}
                                  onChange={handleStunting}
                                />
                              </Col>
                              <Col xs={6} sm={6} md={6} className="my-2">
                                <StuntingRadio
                                  stuntingRadio={handleRadioStunting}
                                  selectedValue={stuntingradio}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
                {jenlap === "7" && (
                  <>
                    {/* <Row>
                <Col lg={12}>
                  <Card bg="secondary text-white" className="custom-card">
                    <Card.Body>
                      <Row>
                        <Col xs={2} sm={2} md={2} className="my-2">
                          <span className="fade-in "> Kemiskinan Esktrim</span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>{" "} */}
                  </>
                )}
                {jenlap === "8" && (
                  <>
                    {/* <Row>
                <Col lg={12}>
                  <Card bg="secondary text-white" className="custom-card">
                    <Card.Body>
                      <Row>
                        <Col xs={2} sm={2} md={2} className="my-2">
                          <span className="fade-in "> Belanja Pemilu</span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>{" "} */}
                  </>
                )}
                {jenlap === "9" && (
                  <>
                    {/* <Row>
                <Col lg={12}>
                  <Card bg="secondary text-white" className="custom-card">
                    <Card.Body>
                      <Row>
                        <Col xs={2} sm={2} md={2} className="my-2">
                          <span className="fade-in "> Ibu Kota Nusantara</span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>{" "} */}
                  </>
                )}
                {jenlap === "10" && (
                  <>
                    {/* <Row>
                <Col lg={12}>
                  <Card bg="secondary text-white" className="custom-card">
                    <Card.Body>
                      <Row>
                        <Col xs={2} sm={2} md={2} className="my-2">
                          <span className="fade-in "> Ketahanan Pangan</span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>{" "} */}
                  </>
                )}
                {jenlap === "11" && (
                  <>
                    {/* <Row>
                <Col lg={12}>
                  <Card bg="secondary text-white" className="custom-card">
                    <Card.Body>
                      <Row>
                        <Col xs={2} sm={2} md={2} className="my-2">
                          <span className="fade-in "> Ketahanan Pangan</span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>{" "} */}
                  </>
                )}
                {jenlap === "12" && (
                  <>
                    <Row>
                      <Col lg={12}>
                        <Card bg="secondary text-white" className="custom-card">
                          <Card.Body>
                            <Row>
                              <Col xs={2} sm={2} md={2} className="my-2">
                                <span className="fade-in ">Intervensi</span>
                              </Col>

                              <Col xs={4} sm={4} md={4} className="my-2">
                                <JenisMbg value={mbg} onChange={handleMbg} />
                              </Col>
                              <Col xs={6} sm={6} md={6} className="my-2">
                                <MbgRadio
                                  mbgRadio={handleRadioMbg}
                                  selectedValue={mbgradio}
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
                {jenlap === "13" && (
                  <>
                    {/* <Row>
                <Col lg={12}>
                  <Card bg="secondary text-white" className="custom-card">
                    <Card.Body>
                      <Row>
                        <Col xs={2} sm={2} md={2} className="my-2">
                          <span className="fade-in "> Swasembada Pangan</span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>{" "} */}
                  </>
                )}
                <Row>
                  <Col lg={12}>
                    <Card bg="secondary text-white">
                      <Card.Body>
                        <div className="bagian-query">
                          <Row>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchKddept
                                onChange={getSwitchKddept}
                              />
                            </Col>{" "}
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchKdUnit
                                onChange={getSwitchUnit}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchKddekon
                                onChange={getSwitchDekon}
                              />
                            </Col>{" "}
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchProvinsi
                                onChange={getSwitchProv}
                              />
                            </Col>
                          </Row>
                          <Row>
                            {" "}
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchKabkota
                                onChange={getSwitchKabkota}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchKanwil
                                onChange={getSwitchkanwil}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchKppn
                                onChange={getSwitchkppn}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchSatker
                                onChange={getSwitchsatker}
                              />
                            </Col>
                          </Row>
                          <Row>
                            {" "}
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchFungsi
                                onChange={getSwitchfungsi}
                                jenlap={jenlap}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchSubfungsi
                                onChange={getSwitchsfungsi}
                                jenlap={jenlap}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchProgram
                                onChange={getSwitchprogram}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchKegiatan
                                onChange={getSwitchgiat}
                              />
                            </Col>
                          </Row>
                          <Row>
                            {" "}
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchOutput
                                onChange={getSwitchoutput}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchsOutput
                                onChange={getSwitchsOutput}
                                jenlap={jenlap}
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchAkun
                                onChange={getSwitchakun}
                                jenlap={jenlap}
                                status="pilihakun"
                              />
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={3}>
                              <pilihanDataTematik.SwitchSdana
                                onChange={getSwitchsdana}
                                jenlap={jenlap}
                              />
                            </Col>
                          </Row>
                          <Row></Row>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Card className="custom-card  text-white" bg="secondary">
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
                    {kdprov && (
                      <>
                        <Row>
                          <Col xs={2} sm={2} md={2}>
                            <span>Provinsi</span>
                          </Col>
                          <Col xs={2} sm={2} md={2}>
                            <Form.Check
                              inline
                              type="radio"
                              label="Pilih Provinsi"
                              value="pilihprov"
                              checked={opsiprov === "pilihprov"}
                              onChange={handleRadioChangeProv}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <span>
                              <Kdlokasi
                                value={prov}
                                onChange={handleProv}
                                status={opsiprov}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <ProvRadio
                              provRadio={handleRadioProv}
                              selectedValue={provradio}
                              status={opsiprov}
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
                                value="kondisiprov"
                                checked={opsiprov === "kondisiprov"}
                                onChange={handleRadioChangeProv}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputProv
                              provkondisi={handleprovKondisi}
                              status={opsiprov}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            *) banyak Provinsi gunakan koma, exclude gunakan
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
                                value="kataprov"
                                checked={opsiprov === "kataprov"}
                                onChange={handleRadioChangeProv}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputKataProv
                              opsikataprov={handleprovKondisiKata}
                              status={opsiprov}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                    {kdkabkota && (
                      <>
                        <Row>
                          <Col xs={2} sm={2} md={2}>
                            <span className="middle fade-in ">Kabkota</span>
                          </Col>

                          <Col xs={2} sm={2} md={2}>
                            <Form.Check
                              inline
                              type="radio"
                              label="Pilih Kabkota"
                              value="pilihkdkabkota"
                              checked={opsikdkabkota === "pilihkdkabkota"}
                              onChange={handleRadioChangekdkabkota}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <span>
                              <Kdkabkota
                                kabkota={kabkota}
                                kdlokasi={prov}
                                onChange={handleKabkota}
                                status={opsikdkabkota}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <KabkotaRadio
                              kabkotaRadio={handleRadioKabkota}
                              selectedValue={kabkotaradio}
                              status={opsikdkabkota}
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
                                value="kondisikdkabkota"
                                checked={opsikdkabkota === "kondisikdkabkota"}
                                onChange={handleRadioChangekdkabkota}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <Inputkdkabkota
                              kdkabkotakondisi={handlekdkabkotaKondisi}
                              status={opsikdkabkota}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            *) banyak Kabkota gunakan koma, exclude gunakan
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
                            *) banyak kanwil gunakan koma, exclude gunakan tanda
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
                            *) banyak Satker gunakan koma, exclude gunakan tanda
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
                    {kdfungsi && (
                      <>
                        <Row>
                          <Col xs={2} sm={2} md={2}>
                            <span className="middle fade-in ">Fungsi</span>
                          </Col>
                          <Col xs={2} sm={2} md={2}>
                            <Form.Check
                              inline
                              type="radio"
                              label="Pilih Fungsi"
                              value="pilihfungsi"
                              checked={opsifungsi === "pilihfungsi"}
                              onChange={handleRadioChangefungsi}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <span>
                              <Kdfungsi
                                kdfungsi={fungsi}
                                onChange={handleFungsi}
                                status={opsifungsi}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <FungsiRadio
                              fungsiRadio={handleRadioFungsi}
                              selectedValue={fungsiradio}
                              status={opsifungsi}
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
                                value="kondisifungsi"
                                checked={opsifungsi === "kondisifungsi"}
                                onChange={handleRadioChangefungsi}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputFungsi
                              fungsikondisi={handlefungsiKondisi}
                              status={opsifungsi}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            *) banyak Fungsi gunakan koma, exclude gunakan tanda
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
                                value="katafungsi"
                                checked={opsifungsi === "katafungsi"}
                                onChange={handleRadioChangefungsi}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputKataFungsi
                              opsikatafungsi={handlefungsiKondisiKata}
                              status={opsifungsi}
                            />
                          </Col>
                        </Row>
                      </>
                    )}

                    {kdsfungsi && (
                      <>
                        <Row>
                          <Col xs={2} sm={2} md={2}>
                            <span className="middle fade-in ">Sub Fungsi</span>
                          </Col>
                          <Col xs={2} sm={2} md={2}>
                            <Form.Check
                              inline
                              type="radio"
                              label="Pilih Sub Fungsi"
                              value="pilihsubfungsi"
                              checked={opsisubfungsi === "pilihsubfungsi"}
                              onChange={handleRadioChangesubfungsi}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <span>
                              <Kdsfungsi
                                kdfungsi={fungsi}
                                kdsfungsi={sfungsi}
                                onChange={handleSfungsi}
                                status={opsisubfungsi}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <SubfungsiRadio
                              subfungsiRadio={handleRadioSubfungsi}
                              selectedValue={subfungsiradio}
                              status={opsisubfungsi}
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
                                value="kondisisubfungsi"
                                checked={opsisubfungsi === "kondisisubfungsi"}
                                onChange={handleRadioChangesubfungsi}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputSubfungsi
                              subfungsikondisi={handlesubfungsiKondisi}
                              status={opsisubfungsi}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            *) banyak Subfungsi gunakan koma, exclude gunakan
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
                                value="katasubfungsi"
                                checked={opsisubfungsi === "katasubfungsi"}
                                onChange={handleRadioChangesubfungsi}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputKataSubfungsi
                              opsikatasubfungsi={handlesubfungsiKondisiKata}
                              status={opsisubfungsi}
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
                            *) banyak Program gunakan koma, exclude gunakan
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
                            *) banyak kegiatan gunakan koma, exclude gunakan
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
                            *) banyak Output gunakan koma, exclude gunakan tanda
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
                    {kdsoutput && (
                      <>
                        <Row>
                          <Col xs={2} sm={2} md={2}>
                            <span className="middle fade-in ">Sub Output</span>
                          </Col>
                          <Col xs={2} sm={2} md={2}>
                            <Form.Check
                              inline
                              type="radio"
                              label="Pilih Sub Output"
                              value="pilihsuboutput"
                              checked={opsisuboutput === "pilihsuboutput"}
                              onChange={handleRadioChangekesuboutputan}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <span>
                              <Kdsoutput
                                kdsoutput={soutput}
                                kdgiat={giat}
                                kdprogram={program}
                                kddept={dept}
                                kdunit={kdunit}
                                onChange={handlesOutput}
                                status={opsisuboutput}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <SoutputRadio
                              soutputRadio={handleRadiosOutput}
                              selectedValue={soutputradio}
                              status={opsisuboutput}
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
                                value="kondisisuboutput"
                                checked={opsisuboutput === "kondisisuboutput"}
                                onChange={handleRadioChangekesuboutputan}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputSubOutput
                              suboutputkondisi={handlesuboutputKondisi}
                              status={opsisuboutput}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            *) banyak Sub Output gunakan koma, exclude gunakan
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
                                value="katasuboutput"
                                checked={opsisuboutput === "katasuboutput"}
                                onChange={handleRadioChangekesuboutputan}
                              />
                            </span>
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <InputKataSubOutput
                              opsikatasuboutput={handlesuboutputKondisiKata}
                              status={opsisuboutput}
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
                              // jenlap={jenlap}
                            />
                          </Col>
                          <Col xs={4} sm={4} md={4}>
                            <span>
                              <Kdakun
                                onChange={handleAkun}
                                status={opsiakun}
                                jenis="tematik"
                                jenlap={jenlap}
                              />
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
                                jenis="tematik"
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
                        {/* <Row>
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
                  </Row> */}
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
                              {loadingStatus || loadingExcell
                                ? "Tayang"
                                : "Tayang"}
                            </Button>

                            <Dropdown as={ButtonGroup}>
                              <Button
                                variant="primary"
                                className="button-download "
                              >
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
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="tematik-apbd" role="tab">
                <DataApbd cekapbd={cekapbd} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>
      </main>
      {showModalTematik && (
        <HasilQuery
          query={sql}
          thang={thang}
          cutoff={cutoff}
          id="result"
          showModal={showModalTematik}
          closeModal={closeModal}
        />
      )}
      {export2 && (
        <GenerateCSV
          query3={sql}
          status={handleStatus}
          namafile={`v3_CSV_TEMATIK_${moment().format("DDMMYY-HHmmss")}`}
        />
      )}
      {loadingExcell && (
        <GenerateExcel
          query3={sql}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_TEMATIK_JENIS_${jenlap}_${moment().format(
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
          jenis="Tematik"
          showModalsimpan={showModalsimpan}
          closeModalsimpan={closeModalsimpan}
        />
      )}
    </>
  );
};

export default Tematik;
