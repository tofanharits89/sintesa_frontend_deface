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
import JenisLaporanRkakl from "../rkakl/JenisLaporanRkakl";
import HasilQueryRkakl from "../rkakl/hasilQueryRkakl";
import { Sql } from "../inquiry/hasilQuery";
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
import Kdakun from "../../referensi/Kdakun";
import Kdsdana from "../../referensi/Kdsdana";
import Kdkomponen from "../../referensi/Kdkomponen";

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
import SdanaRadio from "../../aplikasi/inquiry/radio/sdanaRadio";

import pilihanData from "../../aplikasi/rkakl/pilihanDataRkakl";
import { getSQL } from "../../aplikasi/rkakl/SQLRkakl";
import ThangRkakl from "../../referensi/ThangRkakl";

import Pembulatanrkakl from "../../aplikasi/rkakl/Pembulatanrkakl";
import Kdsoutput from "../../referensi/Kdsoutput";
import SoutputRadio from "../../aplikasi/inquiry/radio/soutputRadio";
import KomponenRadio from "../../aplikasi/inquiry/radio/komponenRadio";
import Kdsubkomponen from "../../referensi/Kdsubkomponen";
import SubkomponenRadio from "../../aplikasi/inquiry/radio/subkomponenRadio";
import ItemRadio from "../../aplikasi/inquiry/radio/itemRadio";
import Kditem from "../../referensi/Kditem";
import Kdregister from "../../referensi/Kdregister";
import RegisterRadio from "../../aplikasi/inquiry/radio/registerRadio";
import GenerateCSV from "../CSV/generateCSV";
import { Simpan } from "../simpanquery/simpan";
import InputKataDept from "../inquiry/kondisi/InputKataDept";

import InputUnit from "../inquiry/kondisi/InputUnit";
import InputKataUnit from "../inquiry/kondisi/InputKataUnit";
import InputDekon from "../inquiry/kondisi/InputDekon";
import InputProv from "../inquiry/kondisi/InputProv";
import InputKataProv from "../inquiry/kondisi/InputKataProv";
import Inputkdkabkota from "../inquiry/kondisi/Inputkdkabkota";
import InputKataKppn from "../inquiry/kondisi/InputKataKppn";
import InputKanwil from "../inquiry/kondisi/InputKanwil";
import InputKataKanwil from "../inquiry/kondisi/InputKataKanwil";
import InputKataSatker from "../inquiry/kondisi/InputKataSatker";
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
import InputSubOutput from "../inquiry/kondisi/InputSubOutput";
import InputKataSubOutput from "../inquiry/kondisi/InputKataSubOutput";
import InputAkun from "../inquiry/kondisi/InputAkun";
import InputKataAkun from "../inquiry/kondisi/InputKataAkun";
import InputSdana from "../inquiry/kondisi/InputSdana";
import InputKataSdana from "../inquiry/kondisi/InputKataSdana";
import InputKomponen from "../inquiry/kondisi/InputKomponen";
import InputKataKomponen from "../inquiry/kondisi/InputKataKOmponen";
import InputSubKomponen from "../inquiry/kondisi/InputSubKomponen";
import InputKataSubKomponen from "../inquiry/kondisi/InputKataSubKomponen";
import InputItem from "../inquiry/kondisi/InputItem";
import InputKataItem from "../inquiry/kondisi/InputKataItem";
import InputRegister from "../inquiry/kondisi/InputRegister";
import InputKataRegister from "../inquiry/kondisi/InputKataRegister";
import moment from "moment";
import Notifikasi from "../notifikasi/notif";
import { Omspan } from "../notifikasi/Omspan";
import { FaWhatsapp } from "react-icons/fa";
import ConvertToPDF from "../PDF/sharepdf";
import ShareDataComponent from "../PDF/Icon";
import PilihFormat from "../PDF/PilihFormat";
import { ConvertToExcel } from "../PDF/FormatSelector";
import ConvertToJSON from "../PDF/JSON";
import { ConvertToText } from "../PDF/TEXT";
import SaveUserData from "../PDF/simpanTukangAkses";
import Blokir from "./jenisBlokir";
import BlokirRadio from "../inquiry/radio/blokirRadio";

const Rkakl = () => {
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
  const [kdkomponen, setkdKomponen] = useState(false);
  const [kdsubkomponen, setkdSubkomponen] = useState(false);
  const [kditem, setkdItem] = useState(false);
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
  const [komponen, setKomponen] = useState("XX");
  const [subkomponen, setSubkomponen] = useState("XX");
  const [item, setItem] = useState("XX");
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
  const [komponenradio, setKomponenradio] = useState("1");
  const [subkomponenradio, setSubkomponenradio] = useState("1");
  const [itemradio, setItemradio] = useState("1");
  const [registerradio, setRegisterradio] = useState("1");

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

    if (total === 0) {
      setLoadingStatus(false);
    }
  };

  const handleSimpan = () => {
    generateSql();
    setShowModalsimpan(true);
  };
  const closeModalsimpan = () => {
    setShowModalsimpan(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModalsql = () => {
    setShowModalsql(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJenlap = (jenlap) => {
    setJenlap(jenlap);
  };

  const handleThang = (thang) => {
    setThang(thang);
  };

  const handlePembulatan = (pembulatan) => {
    setPembulatan(pembulatan);
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

  const handleRadioAkun = (akunRadio) => {
    setAkunradio(akunRadio);
  };
  const handleRadioSdana = (sdanaRadio) => {
    setSdanaradio(sdanaRadio);
  };
  const handleRadiosOutput = (soutputRadio) => {
    setsOutputradio(soutputRadio);
  };
  const handleRadioKomponen = (komponenRadio) => {
    setKomponenradio(komponenRadio);
  };
  const handleRadioSubkomponen = (subkomponenRadio) => {
    setSubkomponenradio(subkomponenRadio);
  };
  const handleRadioItem = (itemRadio) => {
    setItemradio(itemRadio);
  };
  const handleRadioRegister = (registerRadio) => {
    setRegisterradio(registerRadio);
  };

  const handlegetQuery = () => {
    setShowModal(true);
    generateSql();
  };

  const handlegetQuerySQL = () => {
    generateSql();
    setShowModalsql(true);
  };
  const closeModal = () => {
    setShowModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateSql = () => {
    const queryParams = {
      thang,
      jenlap,
      role,
      blokir,
      blokirradio,
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
      soutput,
      soutputradio,
      akun,
      akunradio,
      sdana,
      sdanaradio,

      item,
      itemradio,
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
      outputkondisipilih,
      outputkondisi,
      opsioutput,
      opsikataoutput,
      komponen,
      komponenradio,
      subkomponen,
      subkomponenradio,
      suboutputkondisipilih,
      suboutputkondisi,
      opsisuboutput,
      opsikatasuboutput,
      opsikomponen,
      opsikatakomponen,
      komponenkondisi,
      opsikatasubkomponen,
      opsisubkomponen,
      subkomponenkondisi,
      akunkondisipilih,
      akunkondisi,
      opsiakun,
      opsikataakun,
      opsisdana,
      opsikatasdana,
      sdanakondisi,

      opsikataitem,
      opsiitem,
      itemkondisi,
      opsikataregister,
      opsiregister,
      registerkondisi,
      pembulatan,
      opsikatasatker,
      opsisatker,
    };

    getSQL(queryParams);
    const query = getSQL(queryParams);
    setSql(query);
  };

  // HANDLE KDBLOKIR
  const [kdblokir, setKdBlokir] = useState(false);
  const [blokirradio, setBlokirradio] = useState("1");
  const [blokir, setBlokir] = useState("XX");
  const handleKdBlokir = (blokir) => {
    setKdBlokir(blokir);
    setBlokir(blokir);
  };
  const getSwitchBlokir = (kdblokir) => {
    if (kdblokir) {
      setBlokir("00");
    } else {
      setBlokir("XX");
    }
    setKdBlokir(kdblokir);
  };
  const handleRadioBlokir = (blokirRadio) => {
    setBlokirradio(blokirRadio);
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

  // HANDLE KOMPONEN

  const [komponenkondisi, setkomponenkondisi] = useState("");
  const [opsikatakomponen, setopsiKatakomponen] = useState("");

  const handleKomponen = (komponen) => {
    setKomponen(komponen);
  };

  const getSwitchkomponen = (kdkomponen) => {
    setkdKomponen(kdkomponen);
    if (kdkomponen) {
      setKomponen("SEMUAKOMPONEN");
    } else {
      setkomponenkondisi("");
      setopsiKatakomponen("");
      setKomponen("XX");
    }
  };

  const [komponenkondisipilih, setkomponenkondisipilih] = useState("0");
  const [opsikomponen, setopsikomponen] = useState("pilihkomponen");

  const handlekomponenKondisi = (komponenInput) => {
    setkomponenkondisi(komponenInput);
  };
  const handlekomponenKondisiKata = (komponenkata) => {
    setopsiKatakomponen(komponenkata);
  };
  const handleRadioChangekomponen = (event) => {
    setopsikomponen(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihkomponen" ? 5 : 0;
    setkomponenkondisipilih(value);
    value === 0 ? setKomponenradio("2") : setKomponenradio("1");
  };

  // HANDLE SUB KOMPONEN

  const [subkomponenkondisi, setsubkomponenkondisi] = useState("");
  const [opsikatasubkomponen, setopsiKatasubkomponen] = useState("");

  const handleSubkomponen = (subkomponen) => {
    setSubkomponen(subkomponen);
  };

  const getSwitchsubkomponen = (kdsubkomponen) => {
    setkdSubkomponen(kdsubkomponen);
    if (kdsubkomponen) {
      setSubkomponen("SEMUASUBKOMPONEN");
    } else {
      setsubkomponenkondisi("");
      setopsiKatasubkomponen("");
      setSubkomponen("XX");
    }
  };

  const [subkomponenkondisipilih, setsubkomponenkondisipilih] = useState("0");
  const [opsisubkomponen, setopsisubkomponen] = useState("pilihsubkomponen");

  const handlesubkomponenKondisi = (subkomponenInput) => {
    setsubkomponenkondisi(subkomponenInput);
  };
  const handlesubkomponenKondisiKata = (subkomponenkata) => {
    setopsiKatasubkomponen(subkomponenkata);
  };
  const handleRadioChangesubkomponen = (event) => {
    setopsisubkomponen(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihsubkomponen" ? 5 : 0;
    setsubkomponenkondisipilih(value);
    value === 0 ? setSubkomponenradio("2") : setSubkomponenradio("1");
  };

  // HANDLE ITEM

  const [itemkondisi, setitemkondisi] = useState("");
  const [opsikataitem, setopsiKataitem] = useState("");

  const handleItem = (item) => {
    setItem(item);
  };
  const getSwitchitem = (kditem) => {
    setkdItem(kditem);
    // console.log(opsikataitem);
    if (kditem) {
      setItem("SEMUAITEM");
    } else {
      setitemkondisi("");
      setopsiKataitem("");
      setItem("XX");
    }
  };

  const [itemkondisipilih, setitemkondisipilih] = useState("0");
  const [opsiitem, setopsiitem] = useState("pilihitem");

  const handleitemKondisi = (itemInput) => {
    setitemkondisi(itemInput);
  };
  const handleitemKondisiKata = (itemkata) => {
    setopsiKataitem(itemkata);
  };
  const handleRadioChangeitem = (event) => {
    setopsiitem(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihitem" ? 5 : 0;
    setitemkondisipilih(value);
    value === 0 ? setItemradio("2") : setItemradio("1");
  };

  // HANDLE REGISTER
  const [registerkondisi, setregisterkondisi] = useState("");
  const [opsikataregister, setopsiKataregister] = useState("");

  const handleRegister = (register) => {
    setRegister(register);
  };

  const getSwitchregister = (kdregister) => {
    setkdRegister(kdregister);
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
  const handleRadioChangeregister = (event) => {
    setopsiregister(event.target.value);
    const isChecked = event.target.value;
    const value = isChecked === "pilihregister" ? 5 : 0;
    setregisterkondisipilih(value);
    value === 0 ? setRegisterradio("2") : setRegisterradio("1");
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>RKAKL DIPA</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">RKAKL Detail</li>
              {/* {sql} */}
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
                      <ThangRkakl
                        value={thang}
                        jenlap={jenlap}
                        onChange={handleThang}
                      />
                      <JenisLaporanRkakl
                        value={jenlap}
                        onChange={handleJenlap}
                      />
                      <Pembulatanrkakl
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
                        <pilihanData.SwitchKddept onChange={getSwitchKddept} />
                      </Col>{" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKdUnit onChange={getSwitchUnit} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKddekon onChange={getSwitchDekon} />
                      </Col>{" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchProvinsi onChange={getSwitchProv} />
                      </Col>
                    </Row>
                    <Row>
                      {" "}
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
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSatker onChange={getSwitchsatker} />
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchFungsi
                          onChange={getSwitchfungsi}
                          jenlap={jenlap}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSubfungsi
                          onChange={getSwitchsfungsi}
                          jenlap={jenlap}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchProgram
                          onChange={getSwitchprogram}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKegiatan onChange={getSwitchgiat} />
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchOutput onChange={getSwitchoutput} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchsOutput
                          onChange={getSwitchsOutput}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchAkun
                          onChange={getSwitchakun}
                          jenlap={jenlap}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSdana
                          onChange={getSwitchsdana}
                          jenlap={jenlap}
                        />
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKomponen
                          onChange={getSwitchkomponen}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSubKomponen
                          onChange={getSwitchsubkomponen}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchItem onChange={getSwitchitem} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchRegister
                          jenlap={jenlap}
                          onChange={getSwitchregister}
                          setkdRegister={setkdRegister}
                          setRegister={setRegister}
                        />
                      </Col>
                    </Row>
                    <Row>
                      {" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchBlokir onChange={getSwitchBlokir} />
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
              {kdkomponen && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle  ">Komponen</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Komponen"
                        value="pilihkomponen"
                        checked={opsikomponen === "pilihkomponen"}
                        onChange={handleRadioChangekomponen}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdkomponen
                          onChange={handleKomponen}
                          status={opsikomponen}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <KomponenRadio
                        komponenRadio={handleRadioKomponen}
                        selectedValue={komponenradio}
                        status={opsikomponen}
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
                          value="kondisikomponen"
                          checked={opsikomponen === "kondisikomponen"}
                          onChange={handleRadioChangekomponen}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKomponen
                        komponenkondisi={handlekomponenKondisi}
                        status={opsikomponen}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Komponen gunakan koma, exclude gunakan tanda !
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
                          value="katakomponen"
                          checked={opsikomponen === "katakomponen"}
                          onChange={handleRadioChangekomponen}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataKomponen
                        opsikatakomponen={handlekomponenKondisiKata}
                        status={opsikomponen}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {kdsubkomponen && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle  ">Sub Komponen</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Sub Komponen"
                        value="pilihsubkomponen"
                        checked={opsisubkomponen === "pilihsubkomponen"}
                        onChange={handleRadioChangesubkomponen}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kdsubkomponen
                          onChange={handleSubkomponen}
                          status={opsisubkomponen}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <SubkomponenRadio
                        subkomponenRadio={handleRadioSubkomponen}
                        selectedValue={subkomponenradio}
                        status={opsisubkomponen}
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
                          value="kondisisubkomponen"
                          checked={opsisubkomponen === "kondisisubkomponen"}
                          onChange={handleRadioChangesubkomponen}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputSubKomponen
                        subkomponenkondisi={handlesubkomponenKondisi}
                        status={opsisubkomponen}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Sub Komponen gunakan koma, exclude gunakan tanda
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
                          value="katasubkomponen"
                          checked={opsisubkomponen === "katasubkomponen"}
                          onChange={handleRadioChangesubkomponen}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataSubKomponen
                        opsikatasubkomponen={handlesubkomponenKondisiKata}
                        status={opsisubkomponen}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {kditem && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle  ">Item</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Item"
                        value="pilihitem"
                        checked={opsiitem === "pilihitem"}
                        onChange={handleRadioChangeitem}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <span>
                        <Kditem onChange={handleItem} status={opsiitem} />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <ItemRadio
                        itemRadio={handleRadioItem}
                        selectedValue={itemradio}
                        status={opsiitem}
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
                          value="kondisiitem"
                          checked={opsiitem === "kondisiitem"}
                          onChange={handleRadioChangeitem}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputItem
                        itemkondisi={handleitemKondisi}
                        status={opsiitem}
                      />
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      *) banyak Item gunakan koma, exclude gunakan tanda !
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
                          value="kataitem"
                          checked={opsiitem === "kataitem"}
                          onChange={handleRadioChangeitem}
                        />
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4}>
                      <InputKataItem
                        opsikataitem={handleitemKondisiKata}
                        status={opsiitem}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {kdregister && (
                <>
                  <Row>
                    <Col xs={2} sm={2} md={2}>
                      <span className="middle  ">Register</span>
                    </Col>
                    <Col xs={2} sm={2} md={2}>
                      <Form.Check
                        inline
                        type="radio"
                        label="Pilih Register"
                        value="pilihregister"
                        checked={opsiregister === "pilihregister"}
                        onChange={handleRadioChangeregister}
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
                          onChange={handleRadioChangeregister}
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
                          onChange={handleRadioChangeregister}
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
              {kdblokir && (
                <>
                  <Row className="mt-2">
                    <Col xs={4} sm={4} md={4}>
                      <span className="middle fade-in ">Kode Blokir</span>
                    </Col>

                    <Col xs={4} sm={4} md={4}>
                      <Blokir onChange={handleKdBlokir} />
                    </Col>
                    {/* <Col xs={4} sm={4} md={4}>
                      <BlokirRadio
                        blokirRadio={handleRadioBlokir}
                        selectedValue={blokirradio}
                      />
                    </Col> */}
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
                          className="button  me-2"
                          onClick={handlegetQuery}
                          disabled={loadingStatus || loadingExcell}
                        >
                          {loadingStatus || loadingExcell ? "Tayang" : "Tayang"}
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
                            className="button  me-2"
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
                          className="button  me-2"
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
        </section>
      </main>
      {showModal && (
        <HasilQueryRkakl
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
          namafile={`v3_CSV_RKAKL_${moment().format("DDMMYY-HHmmss")}`}
        />
      )}{" "}
      {loadingExcell && (
        <GenerateExcel
          query3={sql}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_RKAKL_JENIS_${jenlap}_${moment().format(
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
          jenis="Rkakl"
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
      <SaveUserData userData={telp} menu="rkakl" />
    </>
  );
};

export default Rkakl;
