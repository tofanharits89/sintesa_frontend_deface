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

export const SwitchTanggal = ({ onChange, jenlap, pilihtanggal }) => {
  const [switchTanggal, setSwitchTanggal] = useState(true);

  const handleSwitchTanggal = () => {
    const newSwitchTanggal = !switchTanggal;
    setSwitchTanggal(newSwitchTanggal);
    onChange(newSwitchTanggal);
  };
  // console.log(pilihtanggal);
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Bulan"
        checked={switchTanggal}
        disabled
        onChange={handleSwitchTanggal}
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
export const SwitchFungsi = ({ jenlap, onChange }) => {
  const [switchFungsi, setswitchFungsi] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(jenlap);
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
        disabled={jenlap === "6"}
      />
    </>
  );
};
export const SwitchSubfungsi = ({ jenlap, onChange }) => {
  const [switchSubfungsi, setswitchSubfungsi] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(jenlap);
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
        disabled={jenlap === "6"}
      />
    </>
  );
};

export const SwitchProgram = ({ jenlap, onChange }) => {
  const [value, setValue] = useState("");
  const [switchProgram, setswitchProgram] = useState(false);
  const handleSwitchProgram = () => {
    const newSwitchProgram = !switchProgram;
    setswitchProgram(!switchProgram);
    onChange(newSwitchProgram);
  };
  useEffect(() => {
    setValue(jenlap);
    // if (jenlap === "2") {
    //   setswitchProgram(!switchProgram);
    // } else {
    //   setswitchProgram(switchProgram);
    // }
  }, [jenlap]);
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Program"
        checked={switchProgram}
        onChange={handleSwitchProgram}
        disabled={jenlap === "2"}
      />
    </>
  );
};

export const SwitchKegiatan = ({ jenlap, onChange }) => {
  const [value, setValue] = useState("");
  const [switchKegiatan, setswitchKegiatan] = useState(false);
  const handleSwitchKegiatan = () => {
    const newSwitchKegiatan = !switchKegiatan;
    setswitchKegiatan(!switchKegiatan);
    onChange(newSwitchKegiatan);
    setswitchKegiatan(!switchKegiatan);
  };
  useEffect(() => {
    setValue(jenlap);
    // if (jenlap === "2") {
    //   setswitchKegiatan(!switchKegiatan);
    // } else {
    //   setswitchKegiatan(switchKegiatan);
    // }
  }, [jenlap]);
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Kegiatan"
        checked={switchKegiatan}
        onChange={handleSwitchKegiatan}
        disabled={jenlap === "2"}
      />
    </>
  );
};

export const SwitchOutput = ({ jenlap, onChange }) => {
  const [value, setValue] = useState("");
  const [switchOutput, setswitchOutput] = useState(false);
  const handleSwitchOutput = () => {
    const newSwitchOutput = !switchOutput;
    setswitchOutput(!switchOutput);
    onChange(newSwitchOutput);
    setswitchOutput(!switchOutput);
  };
  useEffect(() => {
    setValue(jenlap);
  }, [jenlap]);
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Output/ KRO"
        checked={switchOutput}
        onChange={handleSwitchOutput}
        disabled={jenlap === "2"}
      />
    </>
  );
};

export const SwitchSuboutput = () => {
  const [switchSuboutput, setswitchSuboutput] = useState(false);
  const handleSwitchSuboutput = () => {
    setswitchSuboutput(!switchSuboutput);
  };
  return (
    <>
      <Form.Check
        disabled
        type="switch"
        id="custom-switch"
        label="Suboutput/ RO"
        checked={switchSuboutput}
        onChange={handleSwitchSuboutput}
      />
    </>
  );
};

export const SwitchAkun = ({ jenlap, onChange }) => {
  const [switchAkun, setswitchAkun] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(jenlap);
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
export const SwitchSdana = ({ jenlap, onChange }) => {
  const [switchSdana, setswitchSdana] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(jenlap);
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
  SwitchBansos,
  SwitchKecamatan,
  SwitchDesa,
  SwitchTransaksi,
  SwitchCutoff,
  PilihSemua,
};
