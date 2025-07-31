import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

export const PilihSemua = ({ onChange }) => {
  const [pilihSemua, setPilihSemua] = useState(true);

  const handlePilihSemua = () => {
    const newPilihSemua = !pilihSemua;
    setPilihSemua(newPilihSemua);
    onChange(newPilihSemua);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Cutoff"
        checked={pilihSemua}
        onChange={handlePilihSemua}
        style={{ width: "50px" }}
      />
    </>
  );
};

export const SwitchCutoff = ({ onChange }) => {
  const [switchCutoff, setSwitchCutoff] = useState(true);

  const handleSwitchCutoff = () => {
    const newSwitchCutoff = !switchCutoff;
    setSwitchCutoff(newSwitchCutoff);
    onChange(newSwitchCutoff);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Cutoff"
        checked={switchCutoff}
        onChange={handleSwitchCutoff}
      />
    </>
  );
};

export const SwitchTanggal = ({ onChange, jenlap }) => {
  const [switchTanggal, setSwitchTanggal] = useState(false);

  const handleSwitchTanggal = () => {
    const newSwitchTanggal = !switchTanggal;
    setSwitchTanggal(newSwitchTanggal);
    onChange(newSwitchTanggal);
  };
  // console.log(cutData, switchTanggal);
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Cut Off "
        checked={switchTanggal}
        onChange={handleSwitchTanggal}
        className={`${
          jenlap === "1" ||
          jenlap === "4" ||
          jenlap === "5" ||
          jenlap === "6" ||
          jenlap === "7"
            ? "disabled-switch"
            : ""
        }`}
        disabled={
          jenlap === "1" ||
          jenlap === "4" ||
          jenlap === "5" ||
          jenlap === "6" ||
          jenlap === "7"
        }
      />
    </>
  );
};
export const SwitchKddept = ({ onChange }) => {
  const [switchDept, setswitchDept] = useState(true);
  const handleSwitchDept = () => {
    const newSwitchDept = !switchDept;
    setswitchDept(newSwitchDept);
    onChange(newSwitchDept);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kementerian"
        checked={switchDept}
        onChange={handleSwitchDept}
      />
    </>
  );
};
export const SwitchKdUnit = ({ onChange }) => {
  const [switchUnit, setswitchUnit] = useState(false);
  const handleSwitchUnit = () => {
    const newSwitchUnit = !switchUnit;
    setswitchUnit(newSwitchUnit);
    onChange(newSwitchUnit);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Eselon I"
        checked={switchUnit}
        onChange={handleSwitchUnit}
      />
    </>
  );
};
export const SwitchKddekon = ({ onChange }) => {
  const [switchDekon, setswitchDekon] = useState(false);
  const handleSwitchDekon = () => {
    const newSwitchDekon = !switchDekon;
    setswitchDekon(!switchDekon);
    onChange(newSwitchDekon);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kewenangan"
        checked={switchDekon}
        onChange={handleSwitchDekon}
      />
    </>
  );
};

export const SwitchProvinsi = ({ onChange }) => {
  const [switchProvinsi, setswitchProvinsi] = useState(false);
  const handleSwitchProvinsi = () => {
    const newSwitchProvinsi = !switchProvinsi;
    setswitchProvinsi(!switchProvinsi);
    onChange(newSwitchProvinsi);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Provinsi"
        checked={switchProvinsi}
        onChange={handleSwitchProvinsi}
      />
    </>
  );
};
export const SwitchKabkota = ({ onChange }) => {
  const [switchKabkota, setswitchKabkota] = useState(false);
  const handleSwitchKabkota = () => {
    const newSwitchKabkota = !switchKabkota;
    setswitchKabkota(!switchKabkota);
    onChange(newSwitchKabkota);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kabkota"
        checked={switchKabkota}
        onChange={handleSwitchKabkota}
      />
    </>
  );
};

export const SwitchKanwil = ({ onChange }) => {
  const [switchKanwil, setswitchKanwil] = useState(false);

  const handleSwitchKanwil = () => {
    const newSwitchKanwil = !switchKanwil;
    setswitchKanwil(!switchKanwil);
    onChange(newSwitchKanwil);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kanwil"
        checked={switchKanwil}
        onChange={handleSwitchKanwil}
      />
    </>
  );
};

export const SwitchKppn = ({ onChange }) => {
  const [switchKppn, setswitchKppn] = useState(false);
  const handleSwitchKppn = () => {
    const newSwitchKppn = !switchKppn;
    setswitchKppn(!switchKppn);
    onChange(newSwitchKppn);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="KPPN"
        checked={switchKppn}
        onChange={handleSwitchKppn}
      />
    </>
  );
};
export const SwitchSatker = ({ onChange }) => {
  const [switchSatker, setswitchSatker] = useState(false);
  const handleSwitchSatker = () => {
    const newSwitchSatker = !switchSatker;
    setswitchSatker(!switchSatker);
    onChange(newSwitchSatker);
    setswitchSatker(!switchSatker);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Satker"
        checked={switchSatker}
        onChange={handleSwitchSatker}
      />
    </>
  );
};

export const SwitchFungsi = ({ jenlap, onChange, setKdfungsi, setFungsi }) => {
  const [switchFungsi, setswitchFungsi] = useState(false);
  useEffect(() => {
    switchFungsi ? setFungsi("SEMUAFUNGSI") : setFungsi("XX");
  }, [switchFungsi]);

  useEffect(() => {
    jenlap === "6" && setswitchFungsi(false);
    jenlap === "6" && setKdfungsi(false);
  }, [jenlap]);

  const handleSwitchFungsi = () => {
    const newSwitchFungsi = !switchFungsi;
    setswitchFungsi(!switchFungsi);
    onChange(newSwitchFungsi);
    setswitchFungsi(!switchFungsi);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Fungsi"
        checked={switchFungsi}
        onChange={handleSwitchFungsi}
        // disabled={jenlap === "6"}
      />
    </>
  );
};
export const SwitchSubfungsi = ({
  jenlap,
  onChange,
  setKdsfungsi,
  setSfungsi,
}) => {
  const [switchSubfungsi, setswitchSubfungsi] = useState(false);
  useEffect(() => {
    switchSubfungsi ? setSfungsi("SEMUASUBFUNGSI") : setSfungsi("XX");
  }, [switchSubfungsi]);

  useEffect(() => {
    jenlap === "6" && setswitchSubfungsi(false);
    jenlap === "6" && setKdsfungsi(false);
  }, [jenlap]);

  const handleSwitchSubfungsi = () => {
    const newSwitchSubfungsi = !switchSubfungsi;
    setswitchSubfungsi(!switchSubfungsi);
    onChange(newSwitchSubfungsi);
    setswitchSubfungsi(!switchSubfungsi);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Sub Fungsi"
        checked={switchSubfungsi}
        onChange={handleSwitchSubfungsi}
        // disabled={jenlap === "6"}
      />
    </>
  );
};

export const SwitchProgram = ({ onChange }) => {
  const [switchProgram, setswitchProgram] = useState(false);
  const handleSwitchProgram = () => {
    const newSwitchProgram = !switchProgram;
    setswitchProgram(!switchProgram);
    onChange(newSwitchProgram);
    setswitchProgram(!switchProgram);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Program"
        checked={switchProgram}
        onChange={handleSwitchProgram}
      />
    </>
  );
};

export const SwitchKegiatan = ({ onChange }) => {
  const [switchKegiatan, setswitchKegiatan] = useState(false);
  const handleSwitchKegiatan = () => {
    const newSwitchKegiatan = !switchKegiatan;
    setswitchKegiatan(!switchKegiatan);
    onChange(newSwitchKegiatan);
    setswitchKegiatan(!switchKegiatan);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kegiatan"
        checked={switchKegiatan}
        onChange={handleSwitchKegiatan}
      />
    </>
  );
};

export const SwitchOutput = ({ onChange }) => {
  const [switchOutput, setswitchOutput] = useState(false);
  const handleSwitchOutput = () => {
    const newSwitchOutput = !switchOutput;
    setswitchOutput(!switchOutput);
    onChange(newSwitchOutput);
    setswitchOutput(!switchOutput);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Output/ KRO"
        checked={switchOutput}
        onChange={handleSwitchOutput}
      />
    </>
  );
};

export const SwitchSuboutput = ({
  jenlap,
  onChange,
  setKdsoutput,
  setsOutput,
}) => {
  const [switchSuboutput, setswitchSuboutput] = useState(false);
  const handleSwitchSuboutput = () => {
    const newSwitchSuboutput = !switchSuboutput;
    setswitchSuboutput(!switchSuboutput);
    onChange(newSwitchSuboutput);
  };

  useEffect(() => {
    switchSuboutput ? setsOutput("00") : setsOutput("XX");
  }, [switchSuboutput]);

  useEffect(() => {
    jenlap !== "6" ? setswitchSuboutput(false) : setswitchSuboutput(false);
    jenlap !== "6" ? setKdsoutput(false) : setKdsoutput(false);
  }, [jenlap]);

  return (
    <>
      <Form.Check
        disabled={jenlap !== "6"}
        type="switch"
        id="custom-switch"
        label="Suboutput/ RO"
        checked={switchSuboutput}
        onChange={handleSwitchSuboutput}
      />
    </>
  );
};

export const SwitchAkun = ({ jenlap, onChange, setKdakun, setAkun }) => {
  const [switchAkun, setswitchAkun] = useState(false);

  useEffect(() => {
    switchAkun ? setAkun("AKUN") : setAkun("XX");
  }, [switchAkun]);

  useEffect(() => {
    jenlap === "6" && setswitchAkun(false);
    jenlap === "6" && setKdakun(false);
  }, [jenlap]);

  const handleSwitchAkun = () => {
    const newSwitchAkun = !switchAkun;
    setswitchAkun(!switchAkun);
    onChange(newSwitchAkun);
    setswitchAkun(!switchAkun);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Akun"
        checked={switchAkun}
        onChange={handleSwitchAkun}
        disabled={jenlap === "6"}
      />
    </>
  );
};

export const SwitchSdana = ({ jenlap, onChange, setKdsdana, setSdana }) => {
  const [switchSdana, setswitchSdana] = useState(false);
  useEffect(() => {
    switchSdana ? setSdana("00") : setSdana("XX");
  }, [switchSdana]);

  useEffect(() => {
    jenlap === "6" && setswitchSdana(false);
    jenlap === "6" && setKdsdana(false);
  }, [jenlap]);

  const handleSwitchSdana = () => {
    const newSwitchSdana = !switchSdana;
    setswitchSdana(!switchSdana);
    onChange(newSwitchSdana);
    setswitchSdana(!switchSdana);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Sumber Dana"
        checked={switchSdana}
        onChange={handleSwitchSdana}
        disabled={jenlap === "6"}
      />
    </>
  );
};
export const SwitchRegister = ({
  jenlap,
  onChange,
  setKdregister,
  setRegister,
}) => {
  const [switchRegister, setswitchRegister] = useState(false);
  useEffect(() => {
    switchRegister ? setRegister("SEMUAREGISTER") : setRegister("XX");
  }, [switchRegister]);

  useEffect(() => {
    jenlap === "6" && setswitchRegister(false);
    jenlap === "6" && setKdregister(false);
  }, [jenlap]);

  const handleSwitchRegister = () => {
    const newSwitchRegister = !switchRegister;
    setswitchRegister(!switchRegister);
    onChange(newSwitchRegister);
    setswitchRegister(!switchRegister);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Register"
        checked={switchRegister}
        onChange={handleSwitchRegister}
        disabled={jenlap === "6"}
      />
    </>
  );
};
export const SwitchBansos = ({ bansos, onChange }) => {
  const [switchBansos, setswitchBansos] = useState(true);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(bansos);
  }, [bansos]);
  const handleSwitchBansos = () => {
    const newSwitchBansos = !switchBansos;
    setswitchBansos(!switchBansos);
    onChange(newSwitchBansos);
    setswitchBansos(!switchBansos);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Jenis Bansos"
        checked={switchBansos}
        onChange={handleSwitchBansos}
      />
    </>
  );
};
export const SwitchKecamatan = ({ kecamatan, onChange }) => {
  const [switchKecamatan, setswitchKecamatan] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(kecamatan);
  }, [kecamatan]);
  const handleSwitchKecamatan = () => {
    const newSwitchKecamatan = !switchKecamatan;
    setswitchKecamatan(!switchKecamatan);
    onChange(newSwitchKecamatan);
    setswitchKecamatan(!switchKecamatan);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label=" Kecamatan"
        checked={switchKecamatan}
        onChange={handleSwitchKecamatan}
      />
    </>
  );
};
export const SwitchDesa = ({ desa, onChange }) => {
  const [switchDesa, setswitchDesa] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(desa);
  }, [desa]);
  const handleSwitchDesa = () => {
    const newSwitchDesa = !switchDesa;
    setswitchDesa(!switchDesa);
    onChange(newSwitchDesa);
    setswitchDesa(!switchDesa);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Desa"
        checked={switchDesa}
        onChange={handleSwitchDesa}
      />
    </>
  );
};

export const SwitchTransaksi = ({ transaksi, onChange }) => {
  const [switchTransaksi, setswitchTransaksi] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(transaksi);
  }, [transaksi]);
  const handleSwitchTransaksi = () => {
    const newSwitchTransaksi = !switchTransaksi;
    setswitchTransaksi(!switchTransaksi);
    onChange(newSwitchTransaksi);
    setswitchTransaksi(!switchTransaksi);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Status Transaksi"
        checked={switchTransaksi}
        onChange={handleSwitchTransaksi}
      />
    </>
  );
};

export const SwitchPN = ({ jenlap, kdPN, onChange, setKdPN, setPN }) => {
  const [switchPN, setswitchPN] = useState(false);

  useEffect(() => {
    switchPN ? setPN("00") : setPN("XX");
  }, [switchPN]);

  useEffect(() => {
    jenlap !== "6" ? setswitchPN(false) : setswitchPN(false);
    jenlap !== "6" ? setKdPN(false) : setKdPN(false);
  }, [jenlap]);

  const handleSwitchPN = () => {
    const newSwitchPN = !switchPN;
    setswitchPN(!switchPN);
    onChange(newSwitchPN);
    setswitchPN(!switchPN);
    // jenlap !== "6" ? setswitchPN(true) : setswitchPN(false);
  };
  // console.log(jenlap);
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Prioritas Nasional"
        checked={switchPN}
        onChange={handleSwitchPN}
        disabled={jenlap !== "6"}
      />
    </>
  );
};
export const SwitchPP = ({ jenlap, PP, onChange, setKdPP, setPP }) => {
  const [switchPP, setswitchPP] = useState(false);

  useEffect(() => {
    switchPP ? setPP("00") : setPP("XX");
  }, [switchPP]);

  useEffect(() => {
    jenlap !== "6" ? setswitchPP(false) : setswitchPP(false);
    jenlap !== "6" ? setKdPP(false) : setKdPP(false);
  }, [jenlap]);

  const handleSwitchPP = () => {
    const newSwitchPP = !switchPP;
    setswitchPP(!switchPP);
    onChange(newSwitchPP);
    setswitchPP(!switchPP);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Program Prioritas"
        checked={switchPP}
        onChange={handleSwitchPP}
        disabled={jenlap !== "6"}
      />
    </>
  );
};
export const SwitchKegPP = ({
  jenlap,
  KegPP,
  onChange,
  setKdKegPP,
  setKegPP,
}) => {
  const [switchKegPP, setswitchKegPP] = useState(false);

  useEffect(() => {
    switchKegPP ? setKegPP("00") : setKegPP("XX");
  }, [switchKegPP]);

  useEffect(() => {
    jenlap !== "6" ? setswitchKegPP(false) : setswitchKegPP(false);
    jenlap !== "6" ? setKdKegPP(false) : setKdKegPP(false);
  }, [jenlap]);

  const handleSwitchKegPP = () => {
    const newSwitchKegPP = !switchKegPP;
    setswitchKegPP(!switchKegPP);
    onChange(newSwitchKegPP);
    setswitchKegPP(!switchKegPP);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kegiatan Prioritas"
        checked={switchKegPP}
        onChange={handleSwitchKegPP}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchPRI = ({ jenlap, PRI, onChange, setKdPRI, setPRI }) => {
  const [switchPRI, setswitchPRI] = useState(false);

  useEffect(() => {
    switchPRI ? setPRI("00") : setPRI("XX");
  }, [switchPRI]);

  useEffect(() => {
    jenlap !== "6" ? setswitchPRI(false) : setswitchPRI(false);
    jenlap !== "6" ? setKdPRI(false) : setKdPRI(false);
  }, [jenlap]);

  const handleSwitchPRI = () => {
    const newSwitchPRI = !switchPRI;
    setswitchPRI(!switchPRI);
    onChange(newSwitchPRI);
    setswitchPRI(!switchPRI);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Proyek Prioritas"
        checked={switchPRI}
        onChange={handleSwitchPRI}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchMP = ({ jenlap, MP, onChange, setKdMP, setMP }) => {
  const [switchMP, setswitchMP] = useState(false);

  useEffect(() => {
    switchMP ? setMP("00") : setMP("XX");
  }, [switchMP]);

  useEffect(() => {
    jenlap !== "6" ? setswitchMP(false) : setswitchMP(false);
    jenlap !== "6" ? setKdMP(false) : setKdMP(false);
  }, [jenlap]);

  const handleSwitchMP = () => {
    const newSwitchMP = !switchMP;
    setswitchMP(!switchMP);
    onChange(newSwitchMP);
    setswitchMP(!switchMP);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Major Project"
        checked={switchMP}
        onChange={handleSwitchMP}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchTema = ({ jenlap, Tema, onChange, setKdTema, setTema }) => {
  const [switchTema, setswitchTema] = useState(false);

  useEffect(() => {
    switchTema ? setTema("00") : setTema("XX");
  }, [switchTema]);

  useEffect(() => {
    jenlap !== "6" ? setswitchTema(false) : setswitchTema(false);
    jenlap !== "6" ? setKdTema(false) : setKdTema(false);
  }, [jenlap]);

  const handleSwitchTema = () => {
    const newSwitchTema = !switchTema;
    setswitchTema(!switchTema);
    onChange(newSwitchTema);
    setswitchTema(!switchTema);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Tematik Anggaran"
        checked={switchTema}
        onChange={handleSwitchTema}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchInflasi = ({
  jenlap,
  Inflasi,
  onChange,
  setKdInflasi,
  setInflasi,
}) => {
  const [switchInflasi, setswitchInflasi] = useState(false);

  useEffect(() => {
    switchInflasi ? setInflasi("00") : setInflasi("XX");
  }, [switchInflasi]);

  useEffect(() => {
    jenlap !== "6" ? setswitchInflasi(false) : setswitchInflasi(false);
    jenlap !== "6" ? setKdInflasi(false) : setKdInflasi(false);
  }, [jenlap]);

  const handleSwitchInflasi = () => {
    const newSwitchInflasi = !switchInflasi;
    setswitchInflasi(!switchInflasi);
    onChange(newSwitchInflasi);
    setswitchInflasi(!switchInflasi);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Tematik Inflasi"
        checked={switchInflasi}
        onChange={handleSwitchInflasi}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchStunting = ({
  jenlap,
  Stunting,
  onChange,
  setKdStunting,
  setStunting,
}) => {
  const [switchStunting, setswitchStunting] = useState(false);

  useEffect(() => {
    switchStunting ? setStunting("00") : setStunting("XX");
  }, [switchStunting]);

  useEffect(() => {
    jenlap !== "6" ? setswitchStunting(false) : setswitchStunting(false);
    jenlap !== "6" ? setKdStunting(false) : setKdStunting(false);
  }, [jenlap]);

  const handleSwitchStunting = () => {
    const newSwitchStunting = !switchStunting;
    setswitchStunting(!switchStunting);
    onChange(newSwitchStunting);
    setswitchStunting(!switchStunting);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Tematik Stunting"
        checked={switchStunting}
        onChange={handleSwitchStunting}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchMiskin = ({
  jenlap,
  Miskin,
  onChange,
  setKdMiskin,
  setMiskin,
}) => {
  const [switchMiskin, setswitchMiskin] = useState(false);

  useEffect(() => {
    switchMiskin ? setMiskin("00") : setMiskin("XX");
  }, [switchMiskin]);

  useEffect(() => {
    jenlap !== "6" ? setswitchMiskin(false) : setswitchMiskin(false);
    jenlap !== "6" ? setKdMiskin(false) : setKdMiskin(false);
  }, [jenlap]);

  const handleSwitchMiskin = () => {
    const newSwitchMiskin = !switchMiskin;
    setswitchMiskin(!switchMiskin);
    onChange(newSwitchMiskin);
    setswitchMiskin(!switchMiskin);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kemiskinan Ekstrim"
        checked={switchMiskin}
        onChange={handleSwitchMiskin}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchPemilu = ({
  jenlap,
  Pemilu,
  onChange,
  setKdPemilu,
  setPemilu,
}) => {
  const [switchPemilu, setswitchPemilu] = useState(false);

  useEffect(() => {
    switchPemilu ? setPemilu("00") : setPemilu("XX");
  }, [switchPemilu]);

  useEffect(() => {
    jenlap !== "6" ? setswitchPemilu(false) : setswitchPemilu(false);
    jenlap !== "6" ? setKdPemilu(false) : setKdPemilu(false);
  }, [jenlap]);

  const handleSwitchPemilu = () => {
    const newSwitchPemilu = !switchPemilu;
    setswitchPemilu(!switchPemilu);
    onChange(newSwitchPemilu);
    setswitchPemilu(!switchPemilu);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Belanja Pemilu"
        checked={switchPemilu}
        onChange={handleSwitchPemilu}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchIkn = ({ jenlap, Ikn, onChange, setKdIkn, setIkn }) => {
  const [switchIkn, setswitchIkn] = useState(false);

  useEffect(() => {
    switchIkn ? setIkn("00") : setIkn("XX");
  }, [switchIkn]);

  useEffect(() => {
    jenlap !== "6" ? setswitchIkn(false) : setswitchIkn(false);
    jenlap !== "6" ? setKdIkn(false) : setKdIkn(false);
  }, [jenlap]);

  const handleSwitchIkn = () => {
    const newSwitchIkn = !switchIkn;
    setswitchIkn(!switchIkn);
    onChange(newSwitchIkn);
    setswitchIkn(!switchIkn);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Belanja IKN"
        checked={switchIkn}
        onChange={handleSwitchIkn}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchPangan = ({
  jenlap,
  Pangan,
  onChange,
  setKdPangan,
  setPangan,
}) => {
  const [switchPangan, setswitchPangan] = useState(false);

  useEffect(() => {
    switchPangan ? setPangan("00") : setPangan("XX");
  }, [switchPangan]);

  useEffect(() => {
    jenlap !== "6" ? setswitchPangan(false) : setswitchPangan(false);
    jenlap !== "6" ? setKdPangan(false) : setKdPangan(false);
  }, [jenlap]);

  const handleSwitchPangan = () => {
    const newSwitchPangan = !switchPangan;
    setswitchPangan(!switchPangan);
    onChange(newSwitchPangan);
    setswitchPangan(!switchPangan);
  };

  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Belanja Ketahanan Pangan"
        checked={switchPangan}
        onChange={handleSwitchPangan}
        disabled={jenlap !== "6"}
      />
    </>
  );
};

export const SwitchJeniskontrak = ({ onChange }) => {
  const [switchJeniskontrak, setswitchJeniskontrak] = useState(false);
  const handleSwitchJeniskontrak = () => {
    const newSwitchJeniskontrak = !switchJeniskontrak;
    setswitchJeniskontrak(!switchJeniskontrak);
    onChange(newSwitchJeniskontrak);
    setswitchJeniskontrak(!switchJeniskontrak);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Jenis Kontrak"
        checked={switchJeniskontrak}
        onChange={handleSwitchJeniskontrak}
      />
    </>
  );
};

export default {
  SwitchTanggal,
  SwitchKddept,
  SwitchKdUnit,
  SwitchKddekon,
  SwitchAkun,
  SwitchFungsi,
  SwitchKabkota,
  SwitchKanwil,
  SwitchKegiatan,
  SwitchKppn,
  SwitchOutput,
  SwitchProgram,
  SwitchProvinsi,
  SwitchSubfungsi,
  SwitchSuboutput,
  SwitchSatker,
  SwitchSdana,
  SwitchRegister,
  SwitchBansos,
  SwitchKecamatan,
  SwitchDesa,
  SwitchTransaksi,
  SwitchCutoff,
  PilihSemua,
  SwitchPN,
  SwitchPP,
  SwitchKegPP,
  SwitchPRI,
  SwitchMP,
  SwitchTema,
  SwitchInflasi,
  SwitchStunting,
  SwitchMiskin,
  SwitchPemilu,
  SwitchIkn,
  SwitchPangan,
  SwitchJeniskontrak,
};
