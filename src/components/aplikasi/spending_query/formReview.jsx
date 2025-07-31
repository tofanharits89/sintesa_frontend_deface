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
} from "react-bootstrap";
import GenerateExcel from "../CSV/generateExcell";
import { Pesan } from "../notifikasi/Omspan";
import MyContext from "../../../auth/Context";
import Thang from "../spending_query/ThangSpending";
import Kddept from "../../referensi/Kddept";

import Kdunit from "../../referensi/Kdunit";
import Kddekon from "../../referensi/Kddekon";
import JenisLaporanSpending from "./JenisLaporanSpending";
import Kdprogram from "../../referensi/Kdprogram";
import Kdgiat from "../../referensi/Kdgiat";
import Kdoutput from "../../referensi/Kdoutput";
import Kdakun from "../../referensi/Kdakun";
import Kdsdana from "../../referensi/Kdsdana";

import { getSQLSpending } from "./SQLSpending";
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

import Kdkppn from "../../referensi/Kdkppn";
import KppnRadio from "../inquiry/radio/kppnRadio";

import HasilQuerySpending from "./hasilQuerySpending";
import Kdkanwil from "./Kdkanwil";
import KanwilRadio from "../inquiry/radio/kanwilRadio";
import InputKanwil from "../inquiry/kondisi/InputKanwil";
import InputKataKanwil from "../inquiry/kondisi/InputKataKanwil";
import Kdsoutput from "../../referensi/Kdsoutput";
import SoutputRadio from "../inquiry/radio/soutputRadio";
import PilihanDataSR from "./pilihanDataSR";
import InputSubOutput from "../inquiry/kondisi/InputSubOutput";
import InputKataSubOutput from "../inquiry/kondisi/InputKataSubOutput";
import Kdkomponen from "../../referensi/Kdkomponen";
import KomponenRadio from "../inquiry/radio/komponenRadio";
import InputKataKomponen from "../inquiry/kondisi/InputKataKOmponen";
import Kdsubkomponen from "../../referensi/Kdsubkomponen";
import SubkomponenRadio from "../inquiry/radio/subkomponenRadio";
import InputSubKomponen from "../inquiry/kondisi/InputSubKomponen";
import InputKataSubKomponen from "../inquiry/kondisi/InputKataSubKomponen";
import InputKomponen from "../inquiry/kondisi/InputKomponen";
import JenisAlasan from "../../referensi/JenisAlasan";
import JenisEfisiensi from "./JenisEfisiensi";
// import EfisiensiRadio from "./EfisiensiRadio";

const InquirySpending = () => {
  const {
    role,
    loadingExcell,
    setloadingExcell,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
  } = useContext(MyContext);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalsql, setShowModalsql] = useState(false);
  const [showModalsimpan, setShowModalsimpan] = useState(false);

  const [export2, setExport2] = useState(false);
  const [jenlap, setJenlap] = useState("1");
  const [jenis_efisiensi, setJenis_efisiensi] = useState("00");
  // const [efisiensiradio, setEfisiensiradio] = useState("1");
  const [thang, setThang] = useState("2025");
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
  const [kdsoutput, setKdsoutput] = useState(false);
  const [kdakun, setKdakun] = useState(false);
  const [kdsdana, setKdsdana] = useState(false);
  const [akumulatif, setAkumulatif] = useState(false);
  const [kdsubkomponen, setkdSubkomponen] = useState(false);

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

  //console.log(kdunit);

  const [sql, setSql] = useState("");
  const [from, setFrom] = useState("");
  const [select, setSelect] = useState("");

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

    setShowModal(true);
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
    setJenlap(jenlapopt);
  };

  const handleThang = (thang) => {
    setThang(thang);
  };

  useEffect(() => {
    handleCutoffcek();
  }, [thang, cutoff, pembulatan, jenlap, jenis_efisiensi, akumulatif, select]);

  const handleCutoffcek = () => {
    let selectkontrak =
      ",volkeg,satkeg,hargasat,jumlah as inefisiensi,pagu,keterangan";

    let selectkontrak_persen =
      ",jumlah as inefisiensi,pagu,keterangan";

    let selectkontrak2024 =
      ",volkeg,satkeg,hargasat,jumlah,inefisiensi,keterangan";

    let real = "";

    let from = "spending_review.dt_review_" + thang + " a";

    if (thang === "2024") {
      switch (jenlap) {
        case "1":
          setFrom(from);
          setSelect(selectkontrak2024 + real);
          break;
        // case "2":
        //   setFrom(from);
        //   setSelect(selectkontrak2024 + real);
        //   break;
        case "4":
          setFrom(from);
          setSelect(selectkontrak2024 + real);
          break;
        case "3":
          setFrom(from);
          setSelect(selectkontrak2024 + real);
          break;
        default:
          break;
      }
    } else if (thang === "2025" && jenlap === "1") {
      switch (jenis_efisiensi) {
        case "0":
          setFrom(from);
          setSelect(selectkontrak + real);
          break;
        case "1":
          setFrom(from);
          setSelect(selectkontrak_persen + real);
          break;
        case "00":
          setFrom(from);
          setSelect(selectkontrak + real);
        default:
          break;
      }
    } else if (thang === "2025" && jenlap !== "1") {
      switch (jenlap) {
        case "2":
          setFrom(from);
          setSelect(selectkontrak + real);
          break;
        case "3":
          setFrom(from);
          setSelect(selectkontrak + real);
        default:
          break;
      }
    }
    // } else if (thang === "2025") {
    //   setFrom(from);

    //   if (jenlap === "1") {
    //     if (jenis_efisiensi === "0") {
    //       console.log("Menggunakan SELECT BIASA");
    //       setSelect(selectkontrak + real);
    //     } else {
    //       console.log("Menggunakan SELECT PERSEN");
    //       setSelect(selectkontrak_persen + real);
    //     }
    //   } else if (["2", "3"].includes(jenlap)) {
    //     setSelect(selectkontrak + real);
    //   }
    // }
    else {
      setFrom("");
    }
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
  const handleRadiosOutput = (soutputRadio) => {
    setsOutputradio(soutputRadio);
  };
  const handleRadioKomponen = (komponenRadio) => {
    setKomponenradio(komponenRadio);
  };
  const handleRadioSubkomponen = (subkomponenRadio) => {
    setSubkomponenradio(subkomponenRadio);
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
      output,
      outputradio,
      akun,
      akunradio,
      sdana,
      sdanaradio,
      select,
      from,
      opsidept,
      opsikatadept,
      opsiunit,
      opsikataunit,
      opsidekon,
      dekonkondisi,
      kppnkondisipilih,
      kppnkondisi,
      opsikppn,
      opsikatakppn,

      kanwilkondisipilih,
      kanwilkondisi,
      opsikanwil,
      opsikatakanwil,

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
      soutput,
      soutputradio,
      opsioutput,
      opsikataoutput,
      akunkondisipilih,
      akunkondisi,
      opsiakun,
      opsikataakun,
      opsisdana,
      opsikatasdana,
      sdanakondisi,
      pembulatan,
      opsikatasatker,
      opsisatker,
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
      alasan,
      alasankondisipilih,
      jenis_efisiensi,
    };

    getSQLSpending(queryParams);
    const query = getSQLSpending(queryParams);
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

  // HANDLE SUB OUTPUT

  const [soutput, setsOutput] = useState("XX");
  const [soutputradio, setsOutputradio] = useState("1");
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

  // HANDLE KOMPONEN

  const [komponenkondisi, setkomponenkondisi] = useState("");
  const [opsikatakomponen, setopsiKatakomponen] = useState("");
  const [komponenradio, setKomponenradio] = useState("1");
  const [subkomponenradio, setSubkomponenradio] = useState("1");
  const [komponen, setKomponen] = useState("XX");
  const [subkomponen, setSubkomponen] = useState("XX");
  const [kdkomponen, setkdKomponen] = useState(false);

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

  // HANDLE ALASAN

  const [alasan, setAlasan] = useState(false);
  const [opsialasan, setopsialasan] = useState("pilihalasan");
  const [alasankondisipilih, setalasankondisipilih] = useState("0");
  const [alasannradio, setAlasanradio] = useState("1");

  const getSwitchAlasan = (sebab) => {
    //  setAlasan(sebab);
    if (sebab) {
      setAlasan(true);
    } else {
      setAlasan(false);
      setalasankondisipilih("0");
    }
  };
  const handleRadioChangealasan = (event) => {
    // setopsialasan(event.target.value);
    // const isChecked = event.target.value;
    // const value = isChecked === "pilihalasan" ? 5 : 0;
    // setalasankondisipilih(value);
    // value === 0 ? setAlasanradio("2") : setAlasanradio("1");
  };
  const handleAlasan = (subkomponen) => {
    setalasankondisipilih(subkomponen);
  };
  const handleJnsefisiensi = (jenis_efisiensi) => {
    setJenis_efisiensi(jenis_efisiensi);
  };
  // const handleRadioEfisiensi = (efisiensiRadio) => {
  //   setEfisiensiradio(efisiensiRadio);
  // };
  // console.log(alasan, alasankondisipilih);
  // console.log(jenis_efisiensi);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Inquiry Spending Review</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Laporan</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">Data</li>
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
                    <JenisLaporanSpending
                      value={jenlap}
                      onChange={handleJenlap}
                      thang={thang}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {jenlap === "1" && thang === "2025" && (
            <>
              <Row>
                <Col lg={12}>
                  <Card bg="secondary text-white" className="custom-card">
                    <Card.Body>
                      <Row>
                        <Col xs={2} sm={2} md={2} className="my-2">
                          <span className="fade-in ">Jenis Efisiensi</span>
                        </Col>

                        <Col xs={4} sm={4} md={4} className="my-2">
                          <JenisEfisiensi
                            value={jenis_efisiensi}
                            onChange={handleJnsefisiensi}
                          />
                        </Col>
                        {/* <Col xs={6} sm={6} md={6} className="my-2">
                          <EfisiensiRadio
                            efisiensiRadio={handleRadioEfisiensi}
                            selectedValue={efisiensiradio}
                          />
                        </Col> */}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
          <Row>
            <Col lg={12}>
              <Card bg="secondary text-white">
                <Card.Body>
                  <div className="bagian-query">
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchKddept
                          onChange={getSwitchKddept}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchKdUnit onChange={getSwitchUnit} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchKddekon
                          onChange={getSwitchDekon}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchKanwil
                          onChange={getSwitchkanwil}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchSatker
                          onChange={getSwitchsatker}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchProgram
                          onChange={getSwitchprogram}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchKegiatan
                          onChange={getSwitchgiat}
                        />
                      </Col>{" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchOutput
                          onChange={getSwitchoutput}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchsOutput
                          onChange={getSwitchsOutput}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchKomponen
                          onChange={getSwitchkomponen}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchSubKomponen
                          onChange={getSwitchsubkomponen}
                        />
                      </Col>

                      {/* <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchSdana
                          onChange={getSwitchsdana}
                          jenlap={jenlap}
                          setKdsdana={setKdsdana}
                          setSdana={setSdana}
                        />
                      </Col> */}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchAkun
                          onChange={getSwitchakun}
                          jenlap={jenlap}
                          setKdakun={setKdakun}
                          setAkun={setAkun}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <PilihanDataSR.SwitchAlasan
                          onChange={getSwitchAlasan}
                        />
                      </Col>
                    </Row>
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
                  {kdkomponen && (
                    <>
                      <Row>
                        <Col xs={2} sm={2} md={2}>
                          <span className="middle fade-in ">Komponen</span>
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
                          *) banyak Komponen gunakan koma, exclude gunakan tanda
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
                          <span className="middle fade-in ">Sub Komponen</span>
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
                          *) banyak Sub Komponen gunakan koma, exclude gunakan
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
                  {alasan && (
                    <>
                      <Row>
                        <Col xs={2} sm={2} md={2}>
                          <span className="middle fade-in ">Alasan</span>
                        </Col>
                        <Col xs={2} sm={2} md={2}>
                          <Form.Check
                            inline
                            type="radio"
                            label="Pilih Alasan"
                            value="pilihalasan"
                            checked={opsialasan === "pilihalasan"}
                            onChange={handleRadioChangealasan}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <span>
                            <JenisAlasan
                              onChange={handleAlasan}
                              status={opsisubkomponen}
                            />
                          </span>
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
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </main>
      {(jenlap === "1" || jenlap === "2" || jenlap === "3" || jenlap === "4") && showModal ? (
        <HasilQuerySpending
          query={sql}
          showModal={showModal}
          thang={thang}
          cutoff={cutoff}
          closeModal={closeModal}
          jenis_efisiensi={jenis_efisiensi}
          jenlap={jenlap}
        />
      ) : null}
      {export2 && (
        <GenerateCSV
          query3={sql}
          status={handleStatus}
          namafile={`v3_CSV_SPENDING_${moment().format("DDMMYY-HHmmss")}`}
        />
      )}{" "}
      {loadingExcell && (
        <GenerateExcel
          query3={sql}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_SPENDING_JENIS_${jenlap}_${moment().format(
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
          jenis="Spending"
          showModalsimpan={showModalsimpan}
          closeModalsimpan={closeModalsimpan}
        />
      )}
    </>
  );
};

export default InquirySpending;
