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

export const SwitchTanggal = ({ onChange }) => {
  const [switchTanggal, setSwitchTanggal] = useState(true);

  const handleSwitchTanggal = () => {
    const newSwitchTanggal = !switchTanggal;
    setSwitchTanggal(newSwitchTanggal);
    onChange(newSwitchTanggal);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Tanggal"
        checked={switchTanggal}
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

export const SwitchProvinsiApbd = ({ onChange }) => {
  const [switchProvinsiApbd, setswitchProvinsiApbd] = useState(true);
  const handleSwitchProvinsiApbd = () => {
    const newSwitchProvinsiApbd = !switchProvinsiApbd;
    setswitchProvinsiApbd(!switchProvinsiApbd);
    onChange(newSwitchProvinsiApbd);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Provinsi"
        checked={switchProvinsiApbd}
        onChange={handleSwitchProvinsiApbd}
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
        label="SKPD/Satker"
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
        // disabled={jenlap === "6"}
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
        // disabled={jenlap === "6"}
      />
    </>
  );
};

export const SwitchUrusan = ({ jenlap, onChange }) => {
  const [switchUrusan, setswitchUrusan] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(jenlap);
  }, [jenlap]);

  const handleSwitchUrusan = () => {
    const newSwitchUrusan = !switchUrusan;
    setswitchUrusan(!switchUrusan);
    onChange(newSwitchUrusan);
    setswitchUrusan(!switchUrusan);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Urusan"
        checked={switchUrusan}
        onChange={handleSwitchUrusan}
        // disabled={jenlap === "6"}
      />
    </>
  );
};

export const SwitchBidurusan = ({ jenlap, onChange }) => {
  const [switchBidurusan, setswitchBidurusan] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(jenlap);
  }, [jenlap]);
  const handleSwitchBidurusan = () => {
    const newSwitchBidurusan = !switchBidurusan;
    setswitchBidurusan(!switchBidurusan);
    onChange(newSwitchBidurusan);
    setswitchBidurusan(!switchBidurusan);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Bidang Urusan"
        checked={switchBidurusan}
        onChange={handleSwitchBidurusan}
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

export const SwitchSubkegiatan = ({ onChange }) => {
  const [switchSubkegiatan, setswitchSubkegiatan] = useState(false);
  const handleSwitchSubkegiatan = () => {
    const newSwitchSubkegiatan = !switchSubkegiatan;
    setswitchSubkegiatan(!switchSubkegiatan);
    onChange(newSwitchSubkegiatan);
    setswitchSubkegiatan(!switchSubkegiatan);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Subkegiatan"
        checked={switchSubkegiatan}
        onChange={handleSwitchSubkegiatan}
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
// export const SwitchSuboutput = ({
//     jenlap,
//     onChange,
//     setKdsoutput,
//     setsOutput,
// }) => {
//     const [switchSuboutput, setswitchSuboutput] = useState(false);
//     const handleSwitchSuboutput = () => {
//         const newSwitchSuboutput = !switchSuboutput;
//         setswitchSuboutput(!switchSuboutput);
//         onChange(newSwitchSuboutput);
//     };

//     useEffect(() => {
//         switchSuboutput ? setsOutput("00") : setsOutput("XX");
//     }, [switchSuboutput]);

//     useEffect(() => {
//         jenlap !== "6" ? setswitchSuboutput(false) : setswitchSuboutput(false);
//         jenlap !== "6" ? setKdsoutput(false) : setKdsoutput(false);
//     }, [jenlap]);

//     return (
//         <>
//             <Form.Check
//                 disabled={jenlap !== "6"}
//                 type="switch"
//                 id="custom-switch"
//                 label="Suboutput/ RO"
//                 checked={switchSuboutput}
//                 onChange={handleSwitchSuboutput}
//             />
//         </>
//     );
// };
export const SwitchsOutput = ({
  onChange,
  jenlap,
  setsOutput,
  setKdsoutput,
}) => {
  const [switchsOutput, setswitchsOutput] = useState(false);
  const handleSwitchsOutput = () => {
    const newSwitchsOutput = !switchsOutput;
    setswitchsOutput(!switchsOutput);
    onChange(newSwitchsOutput);
    setswitchsOutput(!switchsOutput);
  };

  // useEffect(() => {
  //     switchsOutput ? setsOutput("00") : setsOutput("XX");
  // }, [switchsOutput]);

  // useEffect(() => {
  //     jenlap === "11" ? setswitchsOutput(false) : setswitchsOutput(false);
  //     jenlap === "11" ? setKdsoutput(false) : setKdsoutput(false);
  // }, [jenlap]);
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Suboutput/ RO"
        checked={switchsOutput}
        onChange={handleSwitchsOutput}
        disabled={jenlap === "11"}
      />
    </>
  );
};
export const SwitchKomponen = ({ onChange }) => {
  const [switchKomponen, setswitchKomponen] = useState(false);
  const handleSwitchKomponen = () => {
    const newSwitchKomponen = !switchKomponen;
    setswitchKomponen(!switchKomponen);
    onChange(newSwitchKomponen);
    setswitchKomponen(!switchKomponen);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Komponen"
        checked={switchKomponen}
        onChange={handleSwitchKomponen}
      />
    </>
  );
};
export const SwitchSubKomponen = ({ onChange }) => {
  const [switchSubKomponen, setswitchSubKomponen] = useState(false);
  const handleSwitchSubKomponen = () => {
    const newSwitchSubKomponen = !switchSubKomponen;
    setswitchSubKomponen(!switchSubKomponen);
    onChange(newSwitchSubKomponen);
    setswitchSubKomponen(!switchSubKomponen);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Sub Komponen"
        checked={switchSubKomponen}
        onChange={handleSwitchSubKomponen}
      />
    </>
  );
};

export const SwitchItem = ({ onChange }) => {
  const [switchItem, setswitchItem] = useState(false);
  const handleSwitchItem = () => {
    const newSwitchItem = !switchItem;
    setswitchItem(!switchItem);
    onChange(newSwitchItem);
    setswitchItem(!switchItem);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Item"
        checked={switchItem}
        onChange={handleSwitchItem}
      />
    </>
  );
};
export const SwitchRegister = ({ onChange }) => {
  const [switchRegister, setswitchRegister] = useState(false);
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
        // disabled={jenlap === "6"}
      />
    </>
  );
};

export const SwitchLevel = ({ jenlap, onChange }) => {
  const [switchLevel, setswitchLevel] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(jenlap);
  }, [jenlap]);
  const handleSwitchLevel = () => {
    const newSwitchLevel = !switchLevel;
    setswitchLevel(!switchLevel);
    onChange(newSwitchLevel);
    setswitchLevel(!switchLevel);
  };
  return (
    <>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Level"
        checked={switchLevel}
        onChange={handleSwitchLevel}
        // disabled={jenlap === "6"}
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
        // disabled={['14'].includes(jenlap)}
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
  SwitchLevel,
  SwitchFungsi,
  SwitchKabkota,
  SwitchKanwil,
  SwitchKegiatan,
  SwitchSubkegiatan,
  SwitchKppn,
  SwitchOutput,
  SwitchProgram,
  SwitchProvinsi,
  SwitchProvinsiApbd,
  SwitchSubfungsi,
  SwitchUrusan,
  SwitchBidurusan,
  SwitchsOutput,
  // SwitchSuboutput,
  SwitchKomponen,
  SwitchSubKomponen,
  SwitchRegister,
  SwitchItem,
  SwitchSatker,
  SwitchSdana,
  SwitchCutoff,
  PilihSemua,
};
