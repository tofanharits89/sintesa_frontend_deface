import React, { useState, useEffect, useContext } from "react";
import { FaWhatsapp, FaWhatsappSquare } from "react-icons/fa";
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
  ToggleButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Simpan } from "../simpanquery/simpan";
import MyContext from "../../../auth/Context";
import Thang from "../../referensi/Thang";
import Kddept from "../../referensi/Kddept";
import CutOff from "../../referensi/CutOff";
import Kdunit from "../../referensi/Kdunit";
import Kddekon from "../../referensi/Kddekon";
import Kdlokasi from "../../referensi/Kdlokasi";
import Kdkabkota from "../../referensi/Kdkabkota";
import JenisLaporan from "../../referensi/JenisLaporan";
import Kdkanwil from "../../referensi/Kdkanwil";
import Kdkppn from "../../referensi/Kdkppn";
import Kdsatker from "../../referensi/Kdsatker";
import Kdfungsi from "../../referensi/Kdfungsi";
import Kdsfungsi from "../../referensi/Kdsfungsi";
import Kdprogram from "../../referensi/Kdprogram";
import Kdgiat from "../../referensi/Kdgiat";
import Kdoutput from "../../referensi/Kdoutput";
import Kdakun from "../../referensi/Kdakun";
import Kdsdana from "../../referensi/Kdsdana";
import Kdregister from "../../referensi/Kdregister";
import Pembulatan from "../../referensi/Pembulatan";
import pilihanData from "../inquiry/pilihanData";

import { getSQL } from "../inquiry/SQL";
import HasilQueryApbn from "./../../aplikasi/inquiry/hasilQueryApbn";
import HasilQueryAkumulasi from "../inquiry/hasilQueryAkumulasi";

import InputDept from "../inquiry/kondisi/InputDept";
import InputKppn from "../inquiry/kondisi/InputKppn";
import InputSatker from "../inquiry/kondisi/InputSatker";

import DeptRadio from "../inquiry/radio/deptRadio";
import UnitRadio from "../inquiry/radio/unitRadio";
import DekonRadio from "../inquiry/radio/dekonRadio";
import ProvRadio from "../inquiry/radio/provRadio";
import KabkotaRadio from "../inquiry/radio/kabkotaRadio";
import KanwilRadio from "../inquiry/radio/kanwilRadio";
import KppnRadio from "../inquiry/radio/kppnRadio";
import SatkerRadio from "../inquiry/radio/satkerRadio";
import FungsiRadio from "../inquiry/radio/fungsiRadio";
import SubfungsiRadio from "../inquiry/radio/subfungsiRadio";
import ProgramRadio from "../inquiry/radio/programRadio";
import KegiatanRadio from "../inquiry/radio/kegiatanRadio";
import OutputRadio from "../inquiry/radio/outputRadio";
import AkunRadio from "../inquiry/radio/akunRadio";
import SdanaRadio from "../inquiry/radio/sdanaRadio";
import RegisterRadio from "./radio/registerRadio";

import HasilQueryBulanan from "../inquiry/hasilQueryBulanan";
import HasilQueryBlokir from "../inquiry/hasilQueryBlokir";
import HasilQueryPN from "../inquiry/hasilQueryPN";
import GenerateCSV from "../CSV/generateCSV";
import { HasilQuery, Sql } from "../inquiry/hasilQuery";
import HasilQueryPN2 from "../inquiry/hasilQueryPN2";
import HasilQueryJnsblokir from "./hasilQueryJnsblokir";
import InputKataDept from "./kondisi/InputKataDept";
import InputUnit from "./kondisi/InputUnit";
import InputDekon from "./kondisi/InputDekon";
import InputKataProv from "./kondisi/InputKataProv";
import InputProv from "./kondisi/InputProv";
import Inputkdkabkota from "./kondisi/Inputkdkabkota";
import InputKataOutput from "./kondisi/InputKataOutput";
import InputOutput from "./kondisi/InputOutput";
import InputKatakegiatan from "./kondisi/InputKatakegiatan";
import Inputkegiatan from "./kondisi/Inputkegiatan";
import InputKataProgram from "./kondisi/InputKataProgram";
import InputProgram from "./kondisi/InputProgram";
import InputKataSubfungsi from "./kondisi/InputKataSubfungsi";
import InputSubfungsi from "./kondisi/InputSubfungsi";
import InputKataFungsi from "./kondisi/InputKataFungsi";
import InputFungsi from "./kondisi/InputFungsi";
import InputKataSatker from "./kondisi/InputKataSatker";
import InputKataKppn from "./kondisi/InputKataKppn";
import InputKataKanwil from "./kondisi/InputKataKanwil";
import InputKanwil from "./kondisi/InputKanwil";
import InputKataSdana from "./kondisi/InputKataSdana";
import InputSdana from "./kondisi/InputSdana";
import InputKataAkun from "./kondisi/InputKataAkun";
import InputAkun from "./kondisi/InputAkun";
import InputKataRegister from "./kondisi/InputKataRegister";
import InputRegister from "./kondisi/InputRegister";
import moment from "moment";
import KodePN from "../../referensi/KdPN";

import InputPN from "./kondisi/InputPN";
import PnRadio from "./radio/pnRadio";
import KodePP from "../../referensi/KdPP";
import PpRadio from "./radio/ppRadio";
import InputPP from "./kondisi/InputPP";
import InputKegPP from "./kondisi/InputKegPP";
import KegPpRadio from "./radio/kegppRadio";
import KodeKegPP from "../../referensi/KdKegPP";
import InputPRI from "./kondisi/InputPRI";
import PriRadio from "./radio/priRadio";
import KodePRI from "../../referensi/KdPRI";
import GenerateExcell from "../CSV/generateExcell";
import { Pesan } from "../notifikasi/Omspan";
import Kdsoutput from "../../referensi/Kdsoutput";
import SoutputRadio from "./radio/soutputRadio";
import InputSubOutput from "./kondisi/InputSubOutput";
import InputKataSubOutput from "./kondisi/InputKataSubOutput";

import InputMP from "./kondisi/InputMP";
import MpRadio from "../inquiry/radio/MpRadio";
import JenisMP from "../../referensi/JenisMP";
import InputTema from "./kondisi/InputTema";
import TemaRadio from "../inquiry/radio/TemaRadio";
import JenisTematik from "../../referensi/JenisTematik";
import InflasiRadio from "../inquiry/radio/InflasiRadio";
import JenisInflasiInquiry from "../../referensi/JenisInflasiInquiry";
import StuntingRadio from "../inquiry/radio/StuntingRadio";
import JenisStuntingInquiry from "../../referensi/JenisStuntingInquiry";
import MiskinRadio from "../inquiry/radio/MiskinRadio";
import JenisMiskin from "../../referensi/JenisMiskin";
import PemiluRadio from "../inquiry/radio/PemiluRadio";
import JenisPemilu from "../../referensi/JenisPemilu";
import IknRadio from "../inquiry/radio/IknRadio";
import JenisIkn from "../../referensi/JenisIkn";
import PanganRadio from "../inquiry/radio/PanganRadio";
import JenisPangan from "../../referensi/JenisPangan";
import ConvertToPDF from "../PDF/sharepdf";
import { ConvertToExcel } from "../PDF/FormatSelector";
import PilihFormat from "../PDF/PilihFormat";
import ConvertToJSON from "../PDF/JSON";
import { ConvertToText } from "../PDF/TEXT";
import ShareDataComponent from "../PDF/Icon";
import SaveUserData from "../PDF/simpanTukangAkses";

const Inquiry = () => {
  const {
    role,
    telp,
    verified,
    loadingExcell,
    setloadingExcell,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
    settampilAI,
  } = useContext(MyContext);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalKedua, setShowModalKedua] = useState(false);
  const [showModalsql, setShowModalsql] = useState(false);
  const [showModalApbn, setShowModalApbn] = useState(false);
  const [showModalAkumulasi, setShowModalAkumulasi] = useState(false);
  const [showModalBulanan, setShowModalBulanan] = useState(false);
  const [showModalBlokir, setShowModalBlokir] = useState(false);
  const [showModalPN, setShowModalPN] = useState(false);
  const [showModalPN2, setShowModalPN2] = useState(false);
  const [showModalJnsblokir, setShowModalJnsblokir] = useState(false);
  const [export2, setExport2] = useState(false);

  // SHARE PDF

  const [showModalPDF, setShowModalPDF] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const handleShowPDF = () => setShowModalPDF(true);
  const handleClosePDF = () => setShowModalPDF(false);
  const handlePDF = () => {
    generateSql();
    setShowModalPDF(true);
  };

  const [showModalsimpan, setShowModalsimpan] = useState(false);
  const [jenlap, setJenlap] = useState("2");
  const [thang, setThang] = useState(new Date().getFullYear());
  const [tanggal, setTanggal] = useState(false);
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
  const [kdregister, setKdregister] = useState(false);
  const [akumulatif, setAkumulatif] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Add 1 because getMonth() returns zero-based index

  const [cutoff, setCutoff] = useState("12");
  const [PN, setPN] = useState("XX");
  const [PP, setPP] = useState("XX");
  const [KegPP, setKegPP] = useState("XX");
  const [PRI, setPRI] = useState("XX");
  const [MP, setMP] = useState("XX");
  const [Tema, setTema] = useState("XX");
  const [Inflasi, setInflasi] = useState("XX");
  const [Stunting, setStunting] = useState("XX");
  const [Miskin, setMiskin] = useState("XX");
  const [Pemilu, setPemilu] = useState("XX");
  const [Ikn, setIkn] = useState("XX");
  const [Pangan, setPangan] = useState("XX");
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

  const [sql, setSql] = useState("");
  const [from, setFrom] = useState("");
  const [select, setSelect] = useState(
    ", round(sum(a.pagu),0) as PAGU, round(sum(a.real1),0) as REALISASI, round(sum(a.blokir) ,0) as BLOKIR"
  );

  const openModalKedua = () => {
    setShowModalKedua(true);
    settampilAI(true);
  };
  const closeModalKedua = () => {
    setShowModalKedua(false);
    settampilAI(false);
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

  const handlegetQuery = () => {
    generateSql();
    if (jenlap === "1") {
      setShowModalApbn(true);
    } else if (jenlap === "2") {
      setShowModal(true);
      setShowModalKedua(true);
      settampilAI(true);
    } else if (jenlap === "3") {
      setShowModalAkumulasi(true);
    } else if (jenlap === "4") {
      setShowModalBulanan(true);
    } else if (jenlap === "5") {
      setShowModalBlokir(true);
    } else if (jenlap === "6" && thang > "2020") {
      setShowModalPN(true);
    } else if (jenlap === "6" && thang < "2021") {
      setShowModalPN2(true);
    } else if (jenlap === "7" && thang >= "2024") {
      setShowModalJnsblokir(true);
    } else {
    }
  };

  const handlegetQuerySQL = () => {
    generateSql();
    setShowModalsql(true);
  };

  // HANDLE MODAL TAYANG
  const closeModal = () => {
    setShowModal(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalsql = () => {
    setShowModalsql(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalApbn = () => {
    setShowModalApbn(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalAkumulasi = () => {
    setShowModalAkumulasi(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalBulanan = () => {
    setShowModalBulanan(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalBlokir = () => {
    setShowModalBlokir(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalPN = () => {
    setShowModalPN(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalPN2 = () => {
    setShowModalPN2(false);
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModalJnsblokir = () => {
    setShowModalJnsblokir(false);
    setShowModalsimpan(false);
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
  const handleSimpan = () => {
    generateSql();
    setShowModalsimpan(true);
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
  }, [thang, cutoff, pembulatan, jenlap, akumulatif, select, tanggal]);

  const handleCutoffcek = () => {
    let paguapbn =
      ",  ROUND(SUM(CONVERT(a.pagu_apbn, SIGNED))/" +
      pembulatan +
      ",0) AS PAGU_APBN, ROUND(sum(a.pagu_dipa)/" +
      pembulatan +
      ",0) AS PAGU_DIPA";

    let realapbn =
      ", ROUND(SUM(real1+real2+real3+real4+real5+real6+real7+real8+real9+real10+real11+real12)/" +
      pembulatan +
      ",0) AS REALISASI";

    let blokir = ", ROUND(SUM(a.blokir) /" + pembulatan + ",0) AS BLOKIR";

    // let jnsblokir = ", a.kdblokir, ROUND(SUM(a.blokir) /" + pembulatan + ",0) AS BLOKIR";

    let fromapbn =
      "monev" + thang + ".pagu_real_detail_harian_dipa_apbn_" + thang + " a";
    // QUERY BELANJA
    let pagu = ",  ROUND(SUM(a.pagu)/" + pembulatan + ",0) AS PAGU_DIPA";
    let realColumns = "";
    for (let i = "1"; i <= cutoff; i++) {
      realColumns += "real" + i;
      if (i !== cutoff) {
        realColumns += "+ ";
      }
    }
    if (cutoff !== "1") {
      realColumns = realColumns.slice(0, -2);
    }
    let selectClause = `, ROUND(SUM(${realColumns}) /${pembulatan} ,0) AS REALISASI`;
    // QUERY BULANAN
    let realbulanan =
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
      ", 0) AS DES";
    let realbulananakumulatif =
      ", ROUND(SUM(real1)/" +
      pembulatan +
      ", 0) AS JAN,  ROUND(SUM(real1 + real2)/" +
      pembulatan +
      ", 0) AS FEB,  ROUND(SUM(real1 + real2 + real3)/" +
      pembulatan +
      ", 0) AS MAR,  ROUND(SUM(real1 + real2 + real3 + real4)/" +
      pembulatan +
      ", 0) AS APR,  ROUND(SUM(real1 + real2 + real3 + real4 + real5)/" +
      pembulatan +
      ", 0) AS MEI,  ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6)/" +
      pembulatan +
      ", 0) AS JUN,  ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7)/" +
      pembulatan +
      ", 0) AS JUL,  ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8)/" +
      pembulatan +
      ", 0) AS AGS,  ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9)/" +
      pembulatan +
      ", 0) SEP,  ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10)/" +
      pembulatan +
      ", 0) AS OKT,  ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11)/" +
      pembulatan +
      ", 0) AS NOV,  ROUND(SUM(real1 + real2 + real3 + real4 + real5 + real6 + real7 + real8 + real9 + real10 + real11 + real12)/" +
      pembulatan +
      ", 0) AS DES";
    // PERGERAKAN PAGU BULANAN
    let fromBulanan =
      "monev" + thang + ".pagu_real_detail_bulan_" + thang + " a";
    let realBulanan =
      ", ROUND(sum(pagu1)/" +
      pembulatan +
      ", 0) AS JAN,ROUND(sum(pagu2)/" +
      pembulatan +
      ", 0) AS FEB,ROUND(sum(pagu3)/" +
      pembulatan +
      ", 0) AS MAR,ROUND(sum(pagu4)/" +
      pembulatan +
      ", 0) AS APR,ROUND(sum(pagu5)/" +
      pembulatan +
      ", 0) AS MEI,ROUND(sum(pagu6)/" +
      pembulatan +
      ", 0) AS JUN,ROUND(sum(pagu7)/" +
      pembulatan +
      ", 0) AS JUL,ROUND(sum(pagu8)/" +
      pembulatan +
      ", 0) AS AGS,ROUND(sum(pagu9)/" +
      pembulatan +
      ", 0) AS SEP,ROUND(sum(pagu10)/" +
      pembulatan +
      ", 0) AS OKT,ROUND(sum(pagu11)/" +
      pembulatan +
      ", 0) AS NOV,ROUND(sum(pagu12)/" +
      pembulatan +
      ", 0) AS DES";
    let blokirBulanan =
      ", ROUND(sum(blokir1)/" +
      pembulatan +
      ", 0) AS JAN,ROUND(sum(blokir2)/" +
      pembulatan +
      ", 0) AS FEB,ROUND(sum(blokir3)/" +
      pembulatan +
      ", 0) AS MAR,ROUND(sum(blokir4)/" +
      pembulatan +
      ", 0) AS APR,ROUND(sum(blokir5)/" +
      pembulatan +
      ", 0) AS MEI,ROUND(sum(blokir6)/" +
      pembulatan +
      ", 0) AS JUN,ROUND(sum(blokir7)/" +
      pembulatan +
      ", 0) AS JUL,ROUND(sum(blokir8)/" +
      pembulatan +
      ", 0) AS AGS,ROUND(sum(blokir9)/" +
      pembulatan +
      ", 0) AS SEP,ROUND(sum(blokir10)/" +
      pembulatan +
      ", 0) AS OKT,ROUND(sum(blokir11)/" +
      pembulatan +
      ", 0) AS NOV,ROUND(sum(blokir12)/" +
      pembulatan +
      ", 0) AS DES";

    let jnsblokirBulanan;
    if (thang === "2024") {
      jnsblokirBulanan =
        ", ROUND(sum(blokir7)/" +
        pembulatan +
        ", 0) AS JUL" +
        ", ROUND(sum(blokir8)/" +
        pembulatan +
        ", 0) AS AGS" +
        ", ROUND(sum(blokir9)/" +
        pembulatan +
        ", 0) AS SEP" +
        ", ROUND(sum(blokir10)/" +
        pembulatan +
        ", 0) AS OKT" +
        ", ROUND(sum(blokir11)/" +
        pembulatan +
        ", 0) AS NOV" +
        ", ROUND(sum(blokir12)/" +
        pembulatan +
        ", 0) AS DES";
    } else {
      jnsblokirBulanan =
        ", ROUND(sum(blokir1)/" +
        pembulatan +
        ", 0) AS JAN" +
        ", ROUND(sum(blokir2)/" +
        pembulatan +
        ", 0) AS FEB" +
        ", ROUND(sum(blokir3)/" +
        pembulatan +
        ", 0) AS MAR" +
        ", ROUND(sum(blokir4)/" +
        pembulatan +
        ", 0) AS APR" +
        ", ROUND(sum(blokir5)/" +
        pembulatan +
        ", 0) AS MEI" +
        ", ROUND(sum(blokir6)/" +
        pembulatan +
        ", 0) AS JUN" +
        ", ROUND(sum(blokir7)/" +
        pembulatan +
        ", 0) AS JUL" +
        ", ROUND(sum(blokir8)/" +
        pembulatan +
        ", 0) AS AGS" +
        ", ROUND(sum(blokir9)/" +
        pembulatan +
        ", 0) AS SEP" +
        ", ROUND(sum(blokir10)/" +
        pembulatan +
        ", 0) AS OKT" +
        ", ROUND(sum(blokir11)/" +
        pembulatan +
        ", 0) AS NOV" +
        ", ROUND(sum(blokir12)/" +
        pembulatan +
        ", 0) AS DES";
    }

    const selectcaput =
      thang < "2021"
        ? ", a.sat as satuan, SUM(vol) AS vol, capai_persen, capai_nilai,sum(a.pagu) as pagu ,sum(real1) as jan ,sum(real2) as feb ,sum(real3) as mar ,sum(real4) as apr ,sum(real5) as mei ,sum(real6) as jun ,sum(real7) as jul ,sum(real8) as ags ,sum(real9) as sep ,sum(real10) as okt ,sum(real11) as nov ,sum(real12) as des"
        : ", a.sat as satuan, SUM(vol) AS vol, sum(a.pagu) as pagu, sum(real1) as rjan, sum(persen1) as pjan, sum(realfisik1) as rpjan, sum(real2) as rfeb, sum(persen2) as pfeb, sum(realfisik2) as rpfeb, sum(real3) as rmar, sum(persen3) as pmar, sum(realfisik3) as rpmar, sum(real4) as rapr, sum(persen4) as papr, sum(realfisik4) as rpapr, sum(real5) as rmei, sum(persen5) as pmei, sum(realfisik5) as rpmei, sum(real6) as rjun, sum(persen6) as pjun, sum(realfisik6) as rpjun, sum(real7) as rjul, sum(persen7) as pjul, sum(realfisik7) as rpjul, sum(real8) as rags, sum(persen8) as pags, sum(realfisik8) as rpags, sum(real9) as rsep, sum(persen9) as psep, sum(realfisik9) as rpsep, sum(real10) as rokt, sum(persen10) as pokt, sum(realfisik10) as rpokt, sum(real11) as rnov, sum(persen11) as pnov, sum(realfisik11) as rpnov, sum(real12) as rdes, sum(persen12) as pdes, sum(realfisik12) as rpdes, os, a.ket";

    const fromcaput =
      thang < "2021"
        ? "monev" + thang + ".pagu_output_" + thang + " a"
        : "monev" + thang + ".pagu_output_" + thang + "_new a";

    const blokircaput = thang > "2020" ? "" : blokir;

    //PEMBENTUKAN JENIS BLOKIR PER BULAN
    let fromJnsblokir =
      "monev" + thang + ".pa_pagu_blokir_akun_" + thang + "_bulanan a";

    // const selectjnsblokir = ",a.kdblokir";

    if (cutoff === "1") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_januari_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_januari_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );

          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "2") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_februari_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_februari_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "3") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_maret_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_maret_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "4") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_april_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_april_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "5") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_mei_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_mei_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "6") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_juni_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_juni_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "7") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_juli_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom("dbhistori.pagu_real_detail_harian_juli_" + thang + " a")
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "8") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_agustus_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_agustus_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "9") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_september_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_september_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "10") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_oktober_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_oktober_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "11") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_november_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom(
                "dbhistori.pagu_real_detail_harian_november_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else if (cutoff === "12") {
      switch (jenlap) {
        case "1":
          setFrom(fromapbn);
          setSelect(paguapbn + realapbn + blokir);
          break;
        case "2":
          tanggal
            ? setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          setSelect(pagu + selectClause + blokir);
          break;
        case "3":
          tanggal
            ? setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              )
            : setFrom(
                "monev" + thang + ".pagu_real_detail_harian_" + thang + " a"
              );
          jenlap === "3" && akumulatif
            ? setSelect(pagu + realbulananakumulatif + blokir)
            : setSelect(pagu + realbulanan + blokir);
          break;
        case "4":
          setFrom(fromBulanan);
          setSelect(realBulanan);
          break;
        case "5":
          setFrom(fromBulanan);
          setSelect(blokirBulanan);
          break;
        case "6":
          setFrom(fromcaput);
          setSelect(selectcaput + blokircaput);
          break;
        case "7":
          setFrom(fromJnsblokir);
          setSelect(jnsblokirBulanan);
          break;
        default:
          break;
      }
    } else {
      setFrom("");
    }
  };

  // PILIH JENIS OPTION //

  const getSwitchTanggal = (tanggal) => {
    setTanggal(tanggal);
    tanggal ? setCutoff("1") : setCutoff("12");
  };

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
  const handleRadioKegPP = (kegppRadio) => {
    setKegPpradio(kegppRadio);
  };
  const handleRadioPri = (priRadio) => {
    setPriradio(priRadio);
  };
  const handleRadioMP = (mpRadio) => {
    setMPradio(mpRadio);
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
  const handleRadioMiskin = (miskinRadio) => {
    setMiskinradio(miskinRadio);
  };
  const handleRadioPemilu = (pemiluRadio) => {
    setPemiluradio(pemiluRadio);
  };
  const handleRadioIkn = (iknRadio) => {
    setIknradio(iknRadio);
  };
  const handleRadioPangan = (panganRadio) => {
    setPanganradio(panganRadio);
  };

  function kppnKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    // setKppnkondisipilih(value);
    setKppn("000");
  }

  function satkerKondisiPilih(event) {
    const isChecked = event.target.checked;
    const value = isChecked ? 5 : 0;
    // setSatkerkondisipilih(value);
    setSatker("SEMUASATKER");
  }

  // HANDLE SUB OUTPUT

  const [suboutputkondisi, setsuboutputkondisi] = useState("");
  const [opsikatasuboutput, setopsiKatasuboutput] = useState("");

  const getSwitchsOutput = (kdsoutput) => {
    setKdsoutput(kdsoutput);
    if (kdsoutput) {
      setsOutput("00");
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

      akun,
      akunradio,
      sdana,
      sdanaradio,
      register,
      registerradio,

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
      provkondisipilih,
      provkondisi,
      opsikdkabkota,
      kdkabkotakondisi,
      kppnkondisipilih,
      kppnkondisi,
      opsikppn,
      opsikatakppn,
      kanwilkondisipilih,
      kanwilkondisi,
      opsikanwil,
      opsikatakanwil,
      fungsikondisipilih,
      fungsikondisi,
      opsifungsi,
      opsikatafungsi,
      subfungsikondisipilih,
      subfungsikondisi,
      opsisubfungsi,
      opsikatasubfungsi,
      programkondisipilih,
      programkondisi,
      opsiprogram,
      opsikataprogram,
      giatkondisipilih,
      giatkondisi,
      opsigiat,
      opsikatagiat,
      output,
      outputkondisipilih,
      outputkondisi,
      opsioutput,
      opsikataoutput,
      outputradio,
      akunkondisipilih,
      akunkondisi,
      opsiakun,
      opsikataakun,
      opsisdana,
      opsikatasdana,
      sdanakondisi,
      opsiregister,
      opsikataregister,
      registerkondisi,

      pembulatan,
      opsikatasatker,
      opsisatker,
      PN,
      opsiPN,
      pnradio,
      opsikataPN,
      PNkondisi,
      PP,
      opsiPP,
      ppradio,
      opsikataPP,
      PPkondisi,
      KegPP,
      opsiKegPP,
      kegppradio,
      opsikataKegPP,
      KegPPkondisi,
      PRI,
      opsiPRI,
      priradio,
      opsikataPRI,
      PRIkondisi,
      MP,
      opsiMP,
      mpradio,
      opsikataMP,
      MPkondisi,
      Tema,
      opsiTema,
      temaradio,
      opsikataTema,
      Temakondisi,
      Inflasi,
      inflasiradio,
      opsiInflasi,
      Stunting,
      stuntingradio,
      opsiStunting,
      Miskin,
      miskinradio,
      opsiMiskin,
      Pemilu,
      pemiluradio,
      opsiPemilu,
      Ikn,
      iknradio,
      opsiIkn,
      Pangan,
      panganradio,
      opsiPangan,

      soutput,
      soutputradio,
      opsisuboutput,
      suboutputkondisi,
      opsikatasuboutput,
    };

    getSQL(queryParams);
    const query = getSQL(queryParams);
    setSql(query);
  };

  const handleStatus = (status, total) => {
    setLoadingStatus(status);
    setExport2(status);
    //  console.log(total);
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
  // console.log(kdunit);
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
  // console.log(opsiakun);
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

  // HANDLE REGISTER
  const [registerkondisi, setregisterkondisi] = useState("");
  const [opsikataregister, setopsiKataregister] = useState("");

  const handleRegister = (register) => {
    setRegister(register);
  };

  const getSwitchregister = (kdregister) => {
    setKdregister(kdregister);
    if (kdregister) {
      setRegister("SEMUAREGISTER");
    } else {
      setregisterkondisi("");
      setopsiKataregister("");
      setRegister("XX");
    }
  };

  const [registerkondisipilih, setregisterkondisipilih] = useState("0");
  const [opsiregister, setopsiregister] = useState("pilihregister");

  const handleregisterKondisi = (registerInput) => {
    setregisterkondisi(registerInput);
  };
  const handleregisterKondisiKata = (registerkata) => {
    setopsiKataregister(registerkata);
  };
  const handleRadioChangekeregisteran = (event) => {
    setopsiregister(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihregister" ? 5 : 0;
    setregisterkondisipilih(value);
    value === 0 ? setRegisterradio("2") : setRegisterradio("1");
  };

  // HANDLE PN
  const [KdPN, setKdPN] = useState(false);
  const [pnradio, setPnradio] = useState("1");
  const [PNkondisi, setPNkondisi] = useState("");
  const [opsikataPN, setopsiKataPN] = useState("");

  const handlePN = (PN) => {
    setPN(PN);
    // if (PN === "00") {
    //   setPN("00");
    //   setPP("00");
    //   setKegPP("00");
    //   setPRI("00");
    // }
  };

  const getSwitchPN = (kdPN) => {
    setKdPN(kdPN);
    if (kdPN) {
      //setPN("00");
      // setPP("00");
      // setKegPP("00");
    } else {
      setPNkondisi("");
      setopsiKataPN("");
      setPN("XX");
    }
  };

  const [PNkondisipilih, setPNkondisipilih] = useState("0");
  const [opsiPN, setopsiPN] = useState("pilihPN");

  const handlePNKondisi = (PNpilih) => {
    setPNkondisi(PNpilih);
  };
  const handlePNKondisiKata = (PNkata) => {
    setopsiKataPN(PNkata);
  };
  const handleRadioChangePN = (event) => {
    setopsiPN(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihPN" ? 5 : 0;
    setPNkondisipilih(value);
    value === 0 ? setPnradio("2") : setPnradio("1");
  };

  // HANDLE PP
  const [KdPP, setKdPP] = useState(false);
  const [ppradio, setPpradio] = useState("1");
  const [PPkondisi, setPPkondisi] = useState("");
  const [opsikataPP, setopsiKataPP] = useState("");

  const handlePP = (PP) => {
    setPP(PP);
  };

  const getSwitchPP = (KdPP) => {
    setKdPP(KdPP);
    if (KdPP) {
      //setPP("00");
      // setKegPP("00");
    } else {
      setPPkondisi("");
      setopsiKataPP("");
      setPP("XX");
    }
  };
  // console.log(PP);
  const [PPkondisipilih, setPPkondisipilih] = useState("0");
  const [opsiPP, setopsiPP] = useState("pilihPP");

  const handlePPKondisi = (PPpilih) => {
    setPPkondisi(PPpilih);
  };
  const handlePPKondisiKata = (PPkata) => {
    setopsiKataPP(PPkata);
  };
  const handleRadioChangePP = (event) => {
    setopsiPP(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihPP" ? 5 : 0;
    setPPkondisipilih(value);
    value === 0 ? setPpradio("2") : setPpradio("1");
  };

  // HANDLE Kegiatan Prioritas
  const [KdKegPP, setKdKegPP] = useState(false);
  const [kegppradio, setKegPpradio] = useState("1");
  const [KegPPkondisi, setKegPPkondisi] = useState("");
  const [opsikataKegPP, setopsiKataKegPP] = useState("");

  const handleKegPP = (KegPP) => {
    setKegPP(KegPP);
  };

  const getSwitchKegPP = (KdKegPP) => {
    setKdKegPP(KdKegPP);
    if (KdKegPP) {
      setKegPP("00");
    } else {
      setKegPPkondisi("");
      setopsiKataKegPP("");
      setKegPP("XX");
    }
  };
  //console.log(KegPP);
  const [KegPPkondisipilih, setKegPPkondisipilih] = useState("0");
  const [opsiKegPP, setopsiKegPP] = useState("pilihKegPP");

  const handleKegPPKondisi = (KegPPpilih) => {
    setKegPPkondisi(KegPPpilih);
  };
  const handleKegPPKondisiKata = (KegPPkata) => {
    setopsiKataKegPP(KegPPkata);
  };
  const handleRadioChangeKegPP = (event) => {
    setopsiKegPP(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihKegPP" ? 5 : 0;
    setKegPPkondisipilih(value);
    value === 0 ? setKegPpradio("2") : setKegPpradio("1");
  };

  // HANDLE Proyek Prioritas
  const [KdPRI, setKdPRI] = useState(false);
  const [priradio, setPriradio] = useState("1");
  const [PRIkondisi, setPRIkondisi] = useState("");
  const [opsikataPRI, setopsiKataPRI] = useState("");

  const handlePRI = (PRI) => {
    setPRI(PRI);
  };

  const getSwitchPRI = (KdPRI) => {
    setKdPRI(KdPRI);
    if (KdPRI) {
      // setPRI("00");
    } else {
      setPRIkondisi("");
      setopsiKataPRI("");
      setPRI("XX");
    }
  };
  //console.log(PRI);
  const [PRIkondisipilih, setPRIkondisipilih] = useState("0");
  const [opsiPRI, setopsiPRI] = useState("pilihPRI");

  const handlePRIKondisi = (PRIpilih) => {
    setPRIkondisi(PRIpilih);
  };
  const handlePRIKondisiKata = (PRIkata) => {
    setopsiKataPRI(PRIkata);
  };
  const handleRadioChangePRI = (event) => {
    setopsiPRI(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihPRI" ? 5 : 0;
    setPRIkondisipilih(value);
    value === 0 ? setPriradio("2") : setPriradio("1");
  };

  // HANDLE MAJOR PROJECT
  const [KdMP, setKdMP] = useState(false);
  const [mpradio, setMPradio] = useState("1");
  const [MPkondisi, setMPkondisi] = useState("");
  const [opsikataMP, setopsiKataMP] = useState("");

  const handleMP = (MP) => {
    setMP(MP);
  };

  const getSwitchMP = (KdMP) => {
    setKdMP(KdMP);
    if (KdMP) {
      setMP("00");
    } else {
      setMPkondisi("");
      setopsiKataMP("");
      setMP("XX");
    }
  };
  //console.log(MP);
  const [MPkondisipilih, setMPkondisipilih] = useState("0");
  const [opsiMP, setopsiMP] = useState("pilihMP");

  const handleMPKondisi = (MPpilih) => {
    setMPkondisi(MPpilih);
  };
  const handleMPKondisiKata = (MPkata) => {
    setopsiKataMP(MPkata);
  };
  const handleRadioChangeMP = (event) => {
    setopsiMP(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihMP" ? 5 : 0;
    setMPkondisipilih(value);
    value === 0 ? setMPradio("2") : setMPradio("1");
  };

  // HANDLE TEMATIK ANGGARAN
  const [KdTema, setKdTema] = useState(false);
  const [temaradio, setTemaradio] = useState("1");
  const [Temakondisi, setTemakondisi] = useState("");
  const [opsikataTema, setopsiKataTema] = useState("");

  const handleTema = (Tema) => {
    setTema(Tema);
  };

  const getSwitchTema = (KdTema) => {
    setKdTema(KdTema);
    if (KdTema) {
      setTema("00");
    } else {
      setTemakondisi("");
      setopsiKataTema("");
      setTema("XX");
    }
  };
  //console.log(Tema);
  const [Temakondisipilih, setTemakondisipilih] = useState("0");
  const [opsiTema, setopsiTema] = useState("pilihTema");

  const handleTemaKondisi = (Temapilih) => {
    setTemakondisi(Temapilih);
  };
  const handleTemaKondisiKata = (Temakata) => {
    setopsiKataTema(Temakata);
  };
  const handleRadioChangeTema = (event) => {
    setopsiTema(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihTema" ? 5 : 0;
    setTemakondisipilih(value);
    value === 0 ? setTemaradio("2") : setTemaradio("1");
  };

  // HANDLE INFLASI
  const [KdInflasi, setKdInflasi] = useState(false);
  const [opsiInflasi, setOpsiInflasi] = useState("pilihInflasi");
  const [inflasiradio, setInflasiradio] = useState("1");
  const [Inflasikondisipilih, setInflasikondisipilih] = useState("0");

  const handleInflasi = (Inflasi) => {
    setInflasi(Inflasi);
  };

  const getSwitchInflasi = (KdInflasi) => {
    setKdInflasi(KdInflasi);
    if (KdInflasi) {
      setInflasi("00");
    } else {
      setInflasi("XX");
    }
    setKdInflasi(KdInflasi);
  };

  const handleRadioChangeInflasi = (event) => {
    setOpsiInflasi(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihInflasi" ? 5 : 0;
    setInflasikondisipilih(value);
    value === 0 ? setInflasiradio("2") : setInflasiradio("1");
  };

  // HANDLE STUNTING
  const [KdStunting, setKdStunting] = useState(false);
  const [opsiStunting, setOpsiStunting] = useState("pilihStunting");
  const [stuntingradio, setStuntingradio] = useState("1");
  const [Stuntingkondisipilih, setStuntingkondisipilih] = useState("0");

  const handleStunting = (Stunting) => {
    setStunting(Stunting);
  };

  const getSwitchStunting = (KdStunting) => {
    setKdStunting(KdStunting);
    if (KdStunting) {
      setStunting("00");
    } else {
      setStunting("XX");
    }
    setKdStunting(KdStunting);
  };

  const handleRadioChangeStunting = (event) => {
    setOpsiStunting(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihStunting" ? 5 : 0;
    setStuntingkondisipilih(value);
    value === 0 ? setStuntingradio("2") : setStuntingradio("1");
  };

  // HANDLE KEMISKINAN EKSTRIM
  const [KdMiskin, setKdMiskin] = useState(false);
  const [opsiMiskin, setOpsiMiskin] = useState("pilihMiskin");
  const [miskinradio, setMiskinradio] = useState("1");
  const [Miskinkondisipilih, setMiskinkondisipilih] = useState("0");

  const handleMiskin = (Miskin) => {
    setMiskin(Miskin);
  };

  const getSwitchMiskin = (KdMiskin) => {
    setKdMiskin(KdMiskin);
    if (KdMiskin) {
      setMiskin("00");
    } else {
      setMiskin("XX");
    }
    setKdMiskin(KdMiskin);
  };

  const handleRadioChangeMiskin = (event) => {
    setOpsiMiskin(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihMiskin" ? 5 : 0;
    setMiskinkondisipilih(value);
    value === 0 ? setMiskinradio("2") : setMiskinradio("1");
  };

  // HANDLE BELANJA PEMILU
  const [KdPemilu, setKdPemilu] = useState(false);
  const [opsiPemilu, setOpsiPemilu] = useState("pilihPemilu");
  const [pemiluradio, setPemiluradio] = useState("1");
  const [Pemilukondisipilih, setPemilukondisipilih] = useState("0");

  const handlePemilu = (Pemilu) => {
    setPemilu(Pemilu);
  };

  const getSwitchPemilu = (KdPemilu) => {
    setKdPemilu(KdPemilu);
    if (KdPemilu) {
      setPemilu("00");
    } else {
      setPemilu("XX");
    }
    setKdPemilu(KdPemilu);
  };

  const handleRadioChangePemilu = (event) => {
    setOpsiPemilu(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihPemilu" ? 5 : 0;
    setPemilukondisipilih(value);
    value === 0 ? setPemiluradio("2") : setPemiluradio("1");
  };

  // HANDLE BELANJA IKN
  const [KdIkn, setKdIkn] = useState(false);
  const [opsiIkn, setOpsiIkn] = useState("pilihIkn");
  const [iknradio, setIknradio] = useState("1");
  const [Iknkondisipilih, setIknkondisipilih] = useState("0");

  const handleIkn = (Ikn) => {
    setIkn(Ikn);
  };

  const getSwitchIkn = (KdIkn) => {
    setKdIkn(KdIkn);
    if (KdIkn) {
      setIkn("00");
    } else {
      setIkn("XX");
    }
    setKdIkn(KdIkn);
  };

  const handleRadioChangeIkn = (event) => {
    setOpsiIkn(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihIkn" ? 5 : 0;
    setIknkondisipilih(value);
    value === 0 ? setIknradio("2") : setIknradio("1");
  };

  // HANDLE BELANJA KETAHANAN PANGAN
  const [KdPangan, setKdPangan] = useState(false);
  const [opsiPangan, setOpsiPangan] = useState("pilihPangan");
  const [panganradio, setPanganradio] = useState("1");
  const [Pangankondisipilih, setPangankondisipilih] = useState("0");

  const handlePangan = (Pangan) => {
    setPangan(Pangan);
  };

  const getSwitchPangan = (KdPangan) => {
    setKdPangan(KdPangan);
    if (KdPangan) {
      setPangan("00");
    } else {
      setPangan("XX");
    }
    setKdPangan(KdPangan);
  };

  const handleRadioChangePangan = (event) => {
    setOpsiPangan(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihPangan" ? 5 : 0;
    setPangankondisipilih(value);
    value === 0 ? setPanganradio("2") : setPanganradio("1");
  };
  //console.log(kdsoutput, kdoutput);
  // console.log(sql);
  return (
    <>
      <main id="main" className={`main `}>
        <div className=" pagetitle">
          <h1>Inquiry Belanja</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">Belanja</li>
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
                      <JenisLaporan
                        value={jenlap}
                        akumulatifopt={akumulatif}
                        onChange={handleJenlap}
                      />
                      <Pembulatan
                        value={pembulatan}
                        onChange={handlePembulatan}
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
                        <pilihanData.SwitchTanggal
                          onChange={getSwitchTanggal}
                          jenlap={jenlap}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKddept onChange={getSwitchKddept} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKdUnit onChange={getSwitchUnit} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKddekon onChange={getSwitchDekon} />
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchProvinsi onChange={getSwitchProv} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKabkota
                          onChange={getSwitchKabkota}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKanwil onChange={getSwitchkanwil} />
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
                        <pilihanData.SwitchFungsi
                          onChange={getSwitchfungsi}
                          jenlap={jenlap}
                          setKdfungsi={setKdfungsi}
                          setFungsi={setFungsi}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSubfungsi
                          onChange={getSwitchsfungsi}
                          jenlap={jenlap}
                          setKdsfungsi={setKdsfungsi}
                          setSfungsi={setSfungsi}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchProgram
                          onChange={getSwitchprogram}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKegiatan onChange={getSwitchgiat} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchOutput onChange={getSwitchoutput} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSuboutput
                          onChange={getSwitchsOutput}
                          jenlap={jenlap}
                          setKdsoutput={setKdsoutput}
                          setsOutput={setsOutput}
                        />
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
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSdana
                          onChange={getSwitchsdana}
                          jenlap={jenlap}
                          setKdsdana={setKdsdana}
                          setSdana={setSdana}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchRegister
                          jenlap={jenlap}
                          onChange={getSwitchregister}
                          setKdregister={setKdregister}
                          setRegister={setRegister}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchPN
                          onChange={getSwitchPN}
                          kdPN={KdPN}
                          jenlap={jenlap}
                          setKdPN={setKdPN}
                          setPN={setPN}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchPP
                          onChange={getSwitchPP}
                          jenlap={jenlap}
                          setKdPP={setKdPP}
                          setPP={setPP}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKegPP
                          onChange={getSwitchKegPP}
                          jenlap={jenlap}
                          setKdKegPP={setKdKegPP}
                          setKegPP={setKegPP}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchPRI
                          onChange={getSwitchPRI}
                          jenlap={jenlap}
                          setKdPRI={setKdPRI}
                          setPRI={setPRI}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchMP
                          onChange={getSwitchMP}
                          jenlap={jenlap}
                          setKdMP={setKdMP}
                          setMP={setMP}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchTema
                          onChange={getSwitchTema}
                          jenlap={jenlap}
                          setKdTema={setKdTema}
                          setTema={setTema}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchInflasi
                          onChange={getSwitchInflasi}
                          jenlap={jenlap}
                          setKdInflasi={setKdInflasi}
                          setInflasi={setInflasi}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchStunting
                          onChange={getSwitchStunting}
                          jenlap={jenlap}
                          setKdStunting={setKdStunting}
                          setStunting={setStunting}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchMiskin
                          onChange={getSwitchMiskin}
                          jenlap={jenlap}
                          setKdMiskin={setKdMiskin}
                          setMiskin={setMiskin}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchPemilu
                          onChange={getSwitchPemilu}
                          jenlap={jenlap}
                          setKdPemilu={setKdPemilu}
                          setPemilu={setPemilu}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchIkn
                          onChange={getSwitchIkn}
                          jenlap={jenlap}
                          setKdIkn={setKdIkn}
                          setIkn={setIkn}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchPangan
                          onChange={getSwitchPangan}
                          jenlap={jenlap}
                          setKdPangan={setKdPangan}
                          setPangan={setPangan}
                        />
                      </Col>
                    </Row>

                    <div className=" mt-3">
                      TA : {thang}, TIPE LAPORAN : {jenlap}, AKUMULATIF :
                      {akumulatif ? " TRUE " : " FALSE "}, PEMBULATAN :
                      {pembulatan}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card className="custom-card" bg="secondary text-white">
            <Card.Body>
              <>
                <Row>
                  <Col xs={4} sm={4} md={4}>
                    <span className="  ">Cut Off</span>
                  </Col>

                  <Col xs={4} sm={4} md={4}>
                    <span className=" left-side">
                      <CutOff
                        value={cutoff}
                        jenlap={jenlap}
                        pilihtanggal={tanggal}
                        onChange={handleCutoff}
                        thang={thang}
                      />
                    </span>
                  </Col>
                </Row>
              </>

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
                      <span className="middle  ">Kewenangan</span>
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
                      *) banyak Provinsi gunakan koma, exclude gunakan tanda !
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
                      <span className="middle  ">Kabkota</span>
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
                      *) banyak Kabkota gunakan koma, exclude gunakan tanda !
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
                      <span className="middle  ">Satker</span>
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
              {kdfungsi && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle  ">Fungsi</span>
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
                      *) banyak Fungsi gunakan koma, exclude gunakan tanda !
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
                      <span className="middle  ">Sub Fungsi</span>
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
                      *) banyak Subfungsi gunakan koma, exclude gunakan tanda !
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
                      *) banyak Program gunakan koma, exclude gunakan tanda !
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
                      *) banyak kegiatan gunakan koma, exclude gunakan tanda !
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
                      <span className="middle  ">Output</span>
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
              {kdsoutput && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle  ">Sub Output</span>
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
                      *) banyak Sub Output gunakan koma, exclude gunakan tanda !
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
                      <span className="middle  ">Detail Akun</span>
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
                      <span className="middle  ">Sumber Dana</span>
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
                        <Kdsdana onChange={handleSdana} status={opsisdana} />
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
                      *) banyak Sumber Dana gunakan koma, exclude gunakan tanda
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
              {kdregister && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle fade-in ">Register</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Semua Register"
                        value="pilihregister"
                        checked={opsiregister === "pilihregister"}
                        onChange={handleRadioChangekeregisteran}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdregister
                          onChange={handleRegister}
                          status={opsiregister}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <RegisterRadio
                        registerRadio={handleRadioRegister}
                        selectedValue={registerradio}
                        status={opsiregister}
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
                          value="kondisiregister"
                          checked={opsiregister === "kondisiregister"}
                          onChange={handleRadioChangekeregisteran}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputRegister
                        registerkondisi={handleregisterKondisi}
                        status={opsiregister}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) Isikan kode register dengan lengkap
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
                          value="kataregister"
                          checked={opsiregister === "kataregister"}
                          onChange={handleRadioChangekeregisteran}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataRegister
                        opsikataregister={handleregisterKondisiKata}
                        status={opsiregister}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) Isikan beberapa karakter dari kode register
                    </Col>
                  </Row>
                </>
              )}
              {KdPN && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Prioritas Nasional</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Prioritas Nasional"
                        value="pilihPN"
                        checked={opsiPN === "pilihPN"}
                        onChange={handleRadioChangePN}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <KodePN
                          value={PN}
                          kdPN={KdPN}
                          onChange={handlePN}
                          status={opsiPN}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <PnRadio
                        pnRadio={handleRadioPn}
                        selectedValue={pnradio}
                        status={opsiPN}
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
                          value="kondisiPN"
                          checked={opsiPN === "kondisiPN"}
                          onChange={handleRadioChangePN}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputPN PNkondisi={handlePNKondisi} status={opsiPN} />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak PN gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                </>
              )}
              {KdPP && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Program Prioritas </span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Program Prioritas"
                        value="pilihPP"
                        checked={opsiPP === "pilihPP"}
                        onChange={handleRadioChangePP}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <KodePP
                          kdPN={PN}
                          value={PP}
                          kdPP={KdPP}
                          onChange={handlePP}
                          status={opsiPP}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <PpRadio
                        ppRadio={handleRadioPp}
                        selectedValue={ppradio}
                        status={opsiPP}
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
                          value="kondisiPP"
                          checked={opsiPP === "kondisiPP"}
                          onChange={handleRadioChangePP}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputPP PPkondisi={handlePPKondisi} status={opsiPP} />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak PP gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                </>
              )}
              {KdKegPP && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Kegiatan Prioritas </span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Kegiatan Prioritas"
                        value="pilihKegPP"
                        checked={opsiKegPP === "pilihKegPP"}
                        onChange={handleRadioChangeKegPP}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <KodeKegPP
                          kdPN={PN}
                          kdPP={PP}
                          value={KegPP}
                          thang={thang}
                          kdKegPP={KdKegPP}
                          onChange={handleKegPP}
                          status={opsiKegPP}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <KegPpRadio
                        kegppRadio={handleRadioKegPP}
                        selectedValue={kegppradio}
                        status={opsiKegPP}
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
                          value="kondisiKegPP"
                          checked={opsiKegPP === "kondisiKegPP"}
                          onChange={handleRadioChangeKegPP}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKegPP
                        KegPPkondisi={handleKegPPKondisi}
                        status={opsiKegPP}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Kegiatan Prioritas gunakan koma, exclude gunakan
                      tanda !
                    </Col>
                  </Row>
                </>
              )}
              {KdPRI && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Proyek Prioritas </span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Proyek Prioritas"
                        value="pilihPRI"
                        checked={opsiPRI === "pilihPRI"}
                        onChange={handleRadioChangePRI}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <KodePRI
                          kdPN={PN}
                          kdPP={PP}
                          value={PRI}
                          KegPP={KegPP}
                          kdPRI={KdPRI}
                          thang={thang}
                          onChange={handlePRI}
                          status={opsiPRI}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <PriRadio
                        priRadio={handleRadioPri}
                        selectedValue={priradio}
                        status={opsiPRI}
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
                          value="kondisiPRI"
                          checked={opsiPRI === "kondisiPRI"}
                          onChange={handleRadioChangePRI}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputPRI
                        PRIkondisi={handlePRIKondisi}
                        status={opsiPRI}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Proyek Prioritas gunakan koma, exclude gunakan
                      tanda !
                    </Col>
                  </Row>
                </>
              )}
              {KdMP && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Major Project</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Major Project"
                        value="pilihMP"
                        checked={opsiMP === "pilihMP"}
                        onChange={handleRadioChangeMP}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisMP
                          value={MP}
                          kdMP={KdMP}
                          onChange={handleMP}
                          status={opsiMP}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <MpRadio
                        mpRadio={handleRadioMP}
                        selectedValue={mpradio}
                        status={opsiMP}
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
                          value="kondisiMP"
                          checked={opsiMP === "kondisiMP"}
                          onChange={handleRadioChangeMP}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputMP MPkondisi={handleMPKondisi} status={opsiMP} />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak MP gunakan koma, exclude gunakan tanda !
                    </Col>
                  </Row>
                </>
              )}
              {KdTema && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Tema Anggaran</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Tema Anggaran"
                        value="pilihTema"
                        checked={opsiTema === "pilihTema"}
                        onChange={handleRadioChangeTema}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisTematik
                          value={Tema}
                          kdTema={KdTema}
                          onChange={handleTema}
                          status={opsiTema}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <TemaRadio
                        temaRadio={handleRadioTema}
                        selectedValue={temaradio}
                        status={opsiTema}
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
                          value="kondisiTema"
                          checked={opsiTema === "kondisiTema"}
                          onChange={handleRadioChangeTema}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputTema
                        Temakondisi={handleTemaKondisi}
                        status={opsiTema}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Tema Anggaran gunakan koma, exclude gunakan
                      tanda !
                    </Col>
                  </Row>
                </>
              )}
              {KdInflasi && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Belanja Pengendalian Inflasi</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Belanja Inflasi"
                        value="pilihInflasi"
                        checked={opsiInflasi === "pilihInflasi"}
                        onChange={handleRadioChangeInflasi}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisInflasiInquiry
                          value={Inflasi}
                          kdInflasi={KdInflasi}
                          onChange={handleInflasi}
                          status={opsiInflasi}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InflasiRadio
                        inflasiRadio={handleRadioInflasi}
                        selectedValue={inflasiradio}
                        status={opsiInflasi}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {KdStunting && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Belanja Penurunan Stunting</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Belanja Stunting"
                        value="pilihStunting"
                        checked={opsiStunting === "pilihStunting"}
                        onChange={handleRadioChangeStunting}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisStuntingInquiry
                          value={Stunting}
                          kdStunting={KdStunting}
                          onChange={handleStunting}
                          status={opsiStunting}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <StuntingRadio
                        stuntingRadio={handleRadioStunting}
                        selectedValue={stuntingradio}
                        status={opsiStunting}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {KdMiskin && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Belanja Kemiskinan Ekstrim</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Belanja Kemiskinan Ekstrim"
                        value="pilihMiskin"
                        checked={opsiMiskin === "pilihMiskin"}
                        onChange={handleRadioChangeMiskin}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisMiskin
                          value={Miskin}
                          kdMiskin={KdMiskin}
                          onChange={handleMiskin}
                          status={opsiMiskin}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <MiskinRadio
                        miskinRadio={handleRadioMiskin}
                        selectedValue={miskinradio}
                        status={opsiMiskin}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {KdPemilu && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Belanja Pemilu</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Belanja Pemilu"
                        value="pilihPemilu"
                        checked={opsiPemilu === "pilihPemilu"}
                        onChange={handleRadioChangePemilu}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisPemilu
                          value={Pemilu}
                          kdPemilu={KdPemilu}
                          onChange={handlePemilu}
                          status={opsiPemilu}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <PemiluRadio
                        pemiluRadio={handleRadioPemilu}
                        selectedValue={pemiluradio}
                        status={opsiPemilu}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {KdIkn && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Belanja Ibu Kota Nusantara</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Belanja IKN"
                        value="pilihIkn"
                        checked={opsiIkn === "pilihIkn"}
                        onChange={handleRadioChangeIkn}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisIkn
                          value={Ikn}
                          kdIkn={KdIkn}
                          onChange={handleIkn}
                          status={opsiIkn}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <IknRadio
                        iknRadio={handleRadioIkn}
                        selectedValue={iknradio}
                        status={opsiIkn}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {KdPangan && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span>Belanja Ketahanan Pangan</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Belanja Ketahanan Pangan"
                        value="pilihPangan"
                        checked={opsiPangan === "pilihPangan"}
                        onChange={handleRadioChangePangan}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <JenisPangan
                          value={Pangan}
                          kdPangan={KdPangan}
                          onChange={handlePangan}
                          status={opsiPangan}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <PanganRadio
                        panganRadio={handleRadioPangan}
                        selectedValue={panganradio}
                        status={opsiPangan}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {/* BUTTON TANGGAL */}
              <>
                <hr />
                <div className="button-query">
                  <Row>
                    <Col lg={12}>
                      <Button
                        variant="success"
                        size="sm"
                        className="button  me-2"
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
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            className="button  me-2"
                            onClick={handlegetQuerySQL}
                          >
                            SQL
                          </Button>
                        </>
                      ) : null}

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
                        className="button  me-2"
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

      {jenlap === "1" && showModalApbn ? (
        <HasilQueryApbn
          queryApbn={sql}
          showModalApbn={showModalApbn}
          thang={thang}
          cutoff={cutoff}
          closeModalApbn={closeModalApbn}
        />
      ) : jenlap === "2" && showModal ? (
        <HasilQuery
          query={sql}
          showModal={showModal}
          thang={thang}
          cutoff={cutoff}
          closeModal={closeModal}
          openModalKedua={verified === "TRUE" ? showModalKedua : false}
          closeModalKedua={closeModalKedua}
        />
      ) : jenlap === "3" && showModalAkumulasi ? (
        <HasilQueryAkumulasi
          queryAkumulasi={sql}
          thang={thang}
          cutoff={cutoff}
          showModalAkumulasi={showModalAkumulasi}
          closeModalAkumulasi={closeModalAkumulasi}
        />
      ) : jenlap === "4" && showModalBulanan ? (
        <HasilQueryBulanan
          queryBulanan={sql}
          thang={thang}
          cutoff={cutoff}
          showModalBulanan={showModalBulanan}
          closeModalBulanan={closeModalBulanan}
        />
      ) : jenlap === "5" && showModalBlokir ? (
        <HasilQueryBlokir
          queryBlokir={sql}
          thang={thang}
          cutoff={cutoff}
          showModalBlokir={showModalBlokir}
          closeModalBlokir={closeModalBlokir}
        />
      ) : showModalPN && jenlap === "6" && thang > "2020" ? (
        <HasilQueryPN
          queryPN={sql}
          thang={thang}
          cutoff={cutoff}
          showModalPN={showModalPN}
          closeModalPN={closeModalPN}
        />
      ) : showModalPN2 && jenlap === "6" && thang < "2021" ? (
        <HasilQueryPN2
          queryPN2={sql}
          thang={thang}
          cutoff={cutoff}
          showModalPN2={showModalPN2}
          closeModalPN2={closeModalPN2}
        />
      ) : jenlap === "7" && showModalJnsblokir ? (
        <HasilQueryJnsblokir
          queryJnsblokir={sql}
          thang={thang}
          cutoff={cutoff}
          showModalJnsblokir={showModalJnsblokir}
          closeModalJnsblokir={closeModalJnsblokir}
        />
      ) : null}
      {export2 && (
        <GenerateCSV
          query3={sql}
          status={handleStatus}
          namafile={`v3_CSV_INQUIRY_BELANJA_JENIS_${jenlap}_${moment().format(
            "DDMMYY-HHmmss"
          )}`}
        />
      )}
      {loadingExcell && (
        <GenerateExcell
          query3={sql}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_INQUIRY_BELANJA_JENIS_${jenlap}_${moment().format(
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
          jenis={"Inquiry" + jenlap}
          showModalsimpan={showModalsimpan}
          closeModalsimpan={closeModalsimpan}
        />
      )}
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
        <SaveUserData userData={telp} menu="inquiry" />
      </Modal>
    </>
  );
};

export default Inquiry;
