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
import Thang from "../bansos/ThangBansos";
import Kdlokasi from "./lokasiBansos";
import Kddept from "../../referensi/Kddept";
import Kdunit from "../../referensi/Kdunit";
import Kddekon from "../../referensi/Kddekon";
import JenisLaporan from "../bansos/JenisLaporanBansos";

import Pembulatan from "../../referensi/Pembulatan";
import pilihanData from "../inquiry/pilihanData";
import { getSQL } from "./SQLBanos";
import { Sql } from "../inquiry/hasilQuery";
import InputDept from "../inquiry/kondisi/InputDept";
import DeptRadio from "../inquiry/radio/deptRadio";
import BansosRadio from "../inquiry/radio/bansosRadio";
import UnitRadio from "../inquiry/radio/unitRadio";
import DekonRadio from "../inquiry/radio/dekonRadio";
import GenerateCSV from "../CSV/generateCSV";
import Kdsatker from "../../referensi/Kdsatker";
import SatkerRadio from "../inquiry/radio/satkerRadio";
import InputSatker from "../inquiry/kondisi/InputSatker";
import "../../layout/query.css";
import Kdbansos from "../../referensi/Kdbansos";
import ProvRadio from "../inquiry/radio/provRadio";
import KabkotaRadio from "../inquiry/radio/kabkotaRadio";
import Kdkabkota from "./kabKotaBansos";
import Kecamatan from "./kecamatanBansos";
import KecamatanRadio from "../inquiry/radio/kecamatanRadio";
import Desa from "./desaBansos";
import DesaRadio from "../inquiry/radio/desaRadio";
import Transaksi from "./transaksiBansos";
import TransaksiRadio from "../inquiry/radio/transaksiRadio";
import HasilQueryBansos from "./hasilQueryBansos";
import { Simpan } from "../simpanquery/simpan";
import moment from "moment";
import InputKataSatker from "../inquiry/kondisi/InputKataSatker";
import Inputkdkabkota from "../inquiry/kondisi/Inputkdkabkota";
import InputKataProv from "../inquiry/kondisi/InputKataProv";
import InputProv from "../inquiry/kondisi/InputProv";
import InputDekon from "../inquiry/kondisi/InputDekon";
import InputUnit from "../inquiry/kondisi/InputUnit";
import InputKataDept from "../inquiry/kondisi/InputKataDept";
import { FaWhatsapp } from "react-icons/fa";
import ConvertToPDF from "../PDF/sharepdf";
import ShareDataComponent from "../PDF/Icon";
import PilihFormat from "../PDF/PilihFormat";
import { ConvertToExcel } from "../PDF/FormatSelector";
import ConvertToJSON from "../PDF/JSON";
import { ConvertToText } from "../PDF/TEXT";
import SaveUserData from "../PDF/simpanTukangAkses";

const InquiryBanos = () => {
  const {
    role,
    telp,
    verified,
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
  const [thang, setThang] = useState("2025");
  const [tanggal, setTanggal] = useState(true);
  const [kddept, setKddept] = useState(true);

  const [unit, setUnit] = useState(false);
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
  const [kppnkondisi, setKppnkondisi] = useState("");
  const [kppnkondisipilih, setKppnkondisipilih] = useState("0");
  // const [satkerkondisi, setSatkerkondisi] = useState("");
  // const [satkerkondisipilih, setSatkerkondisipilih] = useState("0");

  const [sql, setSql] = useState("");
  const [from, setFrom] = useState("");
  const [select, setSelect] = useState("");

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
  const handleSimpan = () => {
    generateSql();
    setShowModalsimpan(true);
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
    let realbulanan =
      " , SUM(jml1) AS JML1, " +
      " SUM(real1)/" +
      pembulatan +
      " AS REAL1, " +
      " SUM(jml2) AS JML2, " +
      " SUM(real2)/" +
      pembulatan +
      " AS REAL2, " +
      " SUM(jml3) AS JML3, " +
      " SUM(real3)/" +
      pembulatan +
      " AS REAL3, " +
      " SUM(jml4) AS JML4, " +
      " SUM(real4)/" +
      pembulatan +
      " AS REAL4, " +
      " SUM(jml5) AS JML5, " +
      " SUM(real5)/" +
      pembulatan +
      " AS REAL5, " +
      " SUM(jml6) AS JML6, " +
      " SUM(real6)/" +
      pembulatan +
      " AS REAL6, " +
      " SUM(jml7) AS JML7, " +
      " SUM(real7)/" +
      pembulatan +
      " AS REAL7, " +
      " SUM(jml8) AS JML8, " +
      " SUM(real8)/" +
      pembulatan +
      " AS REAL8, " +
      " SUM(jml9) AS JML9, " +
      " SUM(real9)/" +
      pembulatan +
      " AS REAL9, " +
      " SUM(jml10) AS JML10, " +
      " SUM(real10)/" +
      pembulatan +
      " AS REAL10, " +
      " SUM(jml11) AS JML11, " +
      " SUM(real11)/" +
      pembulatan +
      " AS REAL11, " +
      " SUM(jml12) AS JML12, " +
      " SUM(real12)/" +
      pembulatan +
      " AS REAL12";

    const realbulananakumulatif = `
  ,SUM(jml1) AS JML1,
  SUM(real1) / ${pembulatan} AS REAL1,
  (SUM(jml1) + SUM(jml2)) AS JML2,
  (SUM(real1) + SUM(real2)) / ${pembulatan} AS REAL2,
  (SUM(jml1) + SUM(jml2) + SUM(jml3)) AS JML3,
  (SUM(real1) + SUM(real2) + SUM(real3)) / ${pembulatan} AS REAL3,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4)) AS JML4,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4)) / ${pembulatan} AS REAL4,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5)) AS JML5,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5)) / ${pembulatan} AS REAL5,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5) + SUM(jml6)) AS JML6,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5) + SUM(real6)) / ${pembulatan} AS REAL6,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5) + SUM(jml6) + SUM(jml7)) AS JML7,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5) + SUM(real6) + SUM(real7)) / ${pembulatan} AS REAL7,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5) + SUM(jml6) + SUM(jml7) + SUM(jml8)) AS JML8,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5) + SUM(real6) + SUM(real7) + SUM(real8)) / ${pembulatan} AS REAL8,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5) + SUM(jml6) + SUM(jml7) + SUM(jml8) + SUM(jml9)) AS JML9,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5) + SUM(real6) + SUM(real7) + SUM(real8) + SUM(real9)) / ${pembulatan} AS REAL9,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5) + SUM(jml6) + SUM(jml7) + SUM(jml8) + SUM(jml9) + SUM(jml10)) AS JML10,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5) + SUM(real6) + SUM(real7) + SUM(real8) + SUM(real9) + SUM(real10)) / ${pembulatan} AS REAL10,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5) + SUM(jml6) + SUM(jml7) + SUM(jml8) + SUM(jml9) + SUM(jml10) + SUM(jml11)) AS JML11,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5) + SUM(real6) + SUM(real7) + SUM(real8) + SUM(real9) + SUM(real10) + SUM(real11)) / ${pembulatan} AS REAL11,
  (SUM(jml1) + SUM(jml2) + SUM(jml3) + SUM(jml4) + SUM(jml5) + SUM(jml6) + SUM(jml7) + SUM(jml8) + SUM(jml9) + SUM(jml10) + SUM(jml11) + SUM(jml12)) AS JML12,
  (SUM(real1) + SUM(real2) + SUM(real3) + SUM(real4) + SUM(real5) + SUM(real6) + SUM(real7) + SUM(real8) + SUM(real9) + SUM(real10) + SUM(real11) + SUM(real12)) / ${pembulatan} AS REAL12
`;

    // PERGERAKAN PAGU BULANAN
    let fromBansos = "monev" + thang + ".bansos_pkh_bulanan a";

    switch (jenlap) {
      case "1":
        setFrom(fromBansos);
        setSelect(
          ",TAHAP " +
            (akumulatif
              ? realbulananakumulatif.toUpperCase()
              : realbulanan.toUpperCase())
        );

        break;
    }
  };
  //BANSOS
  const [kdbansos, setKdbansos] = useState(true);
  const handleKdbansos = (bansos) => {
    setBansos(bansos);
  };
  const [bansosradio, setBansosradio] = useState("1");
  const [bansos, setBansos] = useState("00");

  const getSwitchBansos = (kdbansos) => {
    if (kdbansos) {
      setBansos("00");
    } else {
      setBansos("XX");
    }
    setKdbansos(kdbansos);
  };

  const handleRadioBansos = (bansosRadio) => {
    setBansosradio(bansosRadio);
  };

  const [kdprov, setKdprov] = useState(false);
  const [kdkabkota, setKdkabkota] = useState(false);
  const [prov, setProv] = useState("XX");
  const [kabkota, setKabkota] = useState("XX");

  const handleRadioProv = (provRadio) => {
    setProvradio(provRadio);
  };
  const handleRadioKabkota = (kabkotaRadio) => {
    setKabkotaradio(kabkotaRadio);
  };

  const [kdkecamatan, setKdkecamatan] = useState(false);
  const [kecamatanradio, setKecamatanradio] = useState("1");
  const [kecamatan, setKecamatan] = useState("XX");
  const handleKdkecamatan = (kecamatan) => {
    setKdkecamatan(kecamatan);
    setKecamatan(kecamatan);
  };
  const getSwitchKecamatan = (kdkecamatan) => {
    if (kdkecamatan) {
      setKecamatan("00");
    } else {
      setKecamatan("XX");
    }

    setKdkecamatan(kdkecamatan);
  };
  const handleRadioKecamatan = (kecamatanRadio) => {
    setKecamatanradio(kecamatanRadio);
  };

  const [kddesa, setKddesa] = useState(false);
  const [desaradio, setDesaradio] = useState("1");
  const [desa, setDesa] = useState("XX");
  const handleKddesa = (desa) => {
    setKddesa(desa);
    setDesa(desa);
  };
  const getSwitchDesa = (kddesa) => {
    if (kddesa) {
      setDesa("00");
    } else {
      setDesa("XX");
    }
    setKddesa(kddesa);
  };
  const handleRadioDesa = (desaRadio) => {
    setDesaradio(desaRadio);
  };

  const [kdtransaksi, setKdTransaksi] = useState(false);
  const [transaksiradio, setTransaksiradio] = useState("1");
  const [transaksi, setTransaksi] = useState("XX");
  const handleKdTransaksi = (transaksi) => {
    setKdTransaksi(transaksi);
    setTransaksi(transaksi);
  };
  const getSwitchTransaksi = (kdtransaksi) => {
    if (kdtransaksi) {
      setTransaksi("00");
    } else {
      setTransaksi("XX");
    }
    setKdTransaksi(kdtransaksi);
  };
  const handleRadioTransaksi = (transaksiRadio) => {
    setTransaksiradio(transaksiRadio);
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

  const generateSql = () => {
    const queryParams = {
      transaksi,
      transaksiradio,
      kecamatan,
      kecamatanradio,
      desa,
      desaradio,
      bansos,
      bansosradio,
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
      kppnkondisipilih,
      kppnkondisi,
      satker,
      satkerradio,
      satkerkondisipilih,
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
      sfungsi,
      select,
      from,
      pembulatan,
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
      unitkondisipilih,
      unitkondisi,
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
  //console.log(prov);
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Data Bansos</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Data</a>
              </li>
              {/* <li className="breadcrumb-item">Components</li> */}
              <li className="breadcrumb-item active">Bantuan Sosial</li>
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
                        <pilihanData.SwitchBansos onChange={getSwitchBansos} />
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
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchSatker onChange={getSwitchsatker} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchProvinsi onChange={getSwitchProv} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKabkota
                          onChange={getSwitchKabkota}
                        />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchKecamatan
                          onChange={getSwitchKecamatan}
                        />
                      </Col>{" "}
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchDesa onChange={getSwitchDesa} />
                      </Col>
                      <Col xs={6} md={6} lg={6} xl={3}>
                        <pilihanData.SwitchTransaksi
                          onChange={getSwitchTransaksi}
                        />
                      </Col>
                    </Row>

                    <div className=" mt-3">
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
                  {kdbansos && (
                    <>
                      <Row>
                        <Col xs={4} sm={4} md={4}>
                          <span className="middle  ">Jenis Bansos</span>
                        </Col>

                        <Col xs={4} sm={4} md={4}>
                          <Kdbansos
                            kdbansos={bansos}
                            onChange={handleKdbansos}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <BansosRadio
                            bansosRadio={handleRadioBansos}
                            selectedValue={bansosradio}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
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
                          *) banyak Provinsi gunakan koma, exclude gunakan tanda
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
                          *) banyak Kabkota gunakan koma, exclude gunakan tanda
                          !
                        </Col>
                      </Row>
                    </>
                  )}
                  {kdkecamatan && (
                    <>
                      <Row className="mt-2">
                        <Col xs={4} sm={4} md={4}>
                          <span className="middle  ">Kecamatan</span>
                        </Col>

                        <Col xs={4} sm={4} md={4}>
                          <Kecamatan
                            kecamatan={kdkecamatan}
                            kabkota={kabkota}
                            kdlokasi={prov}
                            onChange={handleKdkecamatan}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <KecamatanRadio
                            kecamatanRadio={handleRadioKecamatan}
                            selectedValue={kecamatanradio}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  {kddesa && (
                    <>
                      <Row className="mt-2">
                        <Col xs={4} sm={4} md={4}>
                          <span className="middle  ">Desa</span>
                        </Col>

                        <Col xs={4} sm={4} md={4}>
                          <Desa
                            kecamatan={kdkecamatan}
                            kabkota={kabkota}
                            kdlokasi={prov}
                            onChange={handleKddesa}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <DesaRadio
                            desaRadio={handleRadioDesa}
                            selectedValue={desaradio}
                          />
                        </Col>
                      </Row>
                    </>
                  )}{" "}
                  {kdtransaksi && (
                    <>
                      <Row className="mt-2">
                        <Col xs={4} sm={4} md={4}>
                          <span className="middle  ">Status Transaksi</span>
                        </Col>

                        <Col xs={4} sm={4} md={4}>
                          <Transaksi onChange={handleKdTransaksi} />
                        </Col>
                        <Col xs={4} sm={4} md={4}>
                          <TransaksiRadio
                            transaksiRadio={handleRadioTransaksi}
                            selectedValue={transaksiradio}
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
            </Col>
          </Row>
        </section>
      </main>
      {jenlap === "1" && showModal ? (
        <HasilQueryBansos
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
          namafile={`v3_CSV_BANSOS_${moment().format("DDMMYY-HHmmss")}`}
        />
      )}
      {loadingExcell && (
        <GenerateExcel
          query3={sql}
          onDataFetchComplete={handleDataFetchComplete}
          namafile={`v3_EXCELL_BANSOS_JENIS_${jenlap}_${moment().format(
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
      )}{" "}
      {showModalsimpan && (
        <Simpan
          query2={sql}
          thang={thang}
          jenis="Bansos"
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
      <SaveUserData userData={telp} menu="banos" />
    </>
  );
};

export default InquiryBanos;
