import { es } from "date-fns/locale";

export const getSQLTematik = (queryParams) => {
  const {
    tema,
    temaradio,
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
    akunradio,
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
    akun,
    akunkondisi,
    opsiakun,
    opsikataakun,
    sdana,
    sdanakondisi,
    opsisdana,
    pembulatan,
    opsitema,
    opsiinflasi,
    inf,
    inflasiradio,
    // opsistunting,
    stun,
    mbg,
    stuntingradio,
    mbgradio,
    miskin,
    pemilu,
    ikn,
    pangan,
    swasembada,
    programstrategis,
    programstrategisradio,
  } = queryParams;

  // KONDISI AWAL

  let query = "";
  let whereClause = "";
  let whereConditions = [];
  let groupByClause = "";
  let defaultSelect = ` sum(a.pagu)/${pembulatan} as pagu,sum(a.blokir)/${pembulatan} as blokir `;

  let directJenlapTable = ['14']; // untuk mengatur jenis laporan dengan tabel ter-summary (tanpa join)

  // console.log(thang);
  // LIMITASI USER ROLE

  // FUNGSI GENERATE SQL
  function buatQuery() {
    // FUNGSI DEPT

    if (dept !== "XXX") {
      kolom.push("a.kddept");
      group.push("a.kddept");
    }

    if (deptradio === "2") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("b.nmdept");
        query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
      } else {
        kolom.push("a.nmdept");
      }
    }
    if (deptradio === "3") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kddept");
        kolom.push("b.nmdept");
        query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
      } else {
        kolom.pop("a.nmdept");
        kolom.push("a.nmdept");
      }
    }
    if (deptradio === "4") {
      kolom = [];
      group = [];
      query += ` `;
    }

    const nilaiawal = deptkondisi.split(",");
    const format = nilaiawal.map((str) => `'${str}'`);
    const hasilFormat = format.join(",");

    if (opsidept === "pilihdept") {
      if (dept !== "XXX") {
        whereConditions.push(
          dept && dept !== "000" ? `a.kddept = '${dept}'` : ``
        );
      }
    } else if (opsidept === "kondisidept") {
      if (deptkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kddept NOT IN (${hasilFormat
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          dept !== "XXX" ? ` a.kddept IN (${hasilFormat})` : ""
        );
      }
    } else if (opsidept === "katadept") {
      opsikatadept &&
        whereConditions.push(` b.nmdept like '%${opsikatadept}%'`);
    }

    // FUNGSI KDUNIT

    if (kdunit !== "XX") {
      kolom.push("a.kdunit");
      group.push("a.kdunit");
    }

    if (unitradio === "2" && kdunit !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("c.nmunit");
        query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
      } else {
        kolom.push("a.nmunit");
      }
    }
    if (unitradio === "3" && kdunit !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdunit");
        kolom.push("c.nmunit");
        query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
      } else {
        kolom.pop("a.nmunit");
        kolom.push("a.nmunit");
      }
    }

    const nilaiawalunit = unitkondisi.split(",");
    const formatunit = nilaiawalunit.map((str) => `'${str}'`);
    const hasilFormatunit = formatunit.join(",");

    if (opsiunit === "pilihunit") {
      if (kdunit !== "XX") {
        whereConditions.push(
          kdunit && kdunit !== "00" ? `a.kdunit = '${kdunit}'` : ``
        );
      }
    } else if (opsiunit === "kondisiunit") {
      if (unitkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdunit NOT IN (${hasilFormatunit
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kdunit !== "XX" ? ` a.kdunit IN (${hasilFormatunit})` : ""
        );
      }
    } else if (opsiunit === "kataunit") {
      opsikataunit &&
        whereConditions.push(` c.nmunit like '%${opsikataunit}%'`);
    }

    // FUNGSI DEKON

    if (dekon !== "XX") {
      kolom.push("a.kddekon");
      group.push("a.kddekon");
    }

    if (dekonradio === "2" && dekon !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("cc.nmdekon");
        query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
      } else {
        kolom.push("a.nmdekon");
      }
    }
    if (dekonradio === "3" && dekon !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kddekon");
        kolom.push("cc.nmdekon");
        query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
      } else {
        kolom.pop("a.nmdekon");
        kolom.push("a.nmdekon");
      }
    }

    const nilaiawaldekon = dekonkondisi.split(",");
    const formatdekon = nilaiawaldekon.map((str) => `'${str}'`);
    const hasilFormatdekon = formatdekon.join(",");

    if (opsidekon === "pilihdekon") {
      if (dekon !== "XX") {
        whereConditions.push(
          dekon && dekon !== "00" ? `a.kddekon = '${dekon}'` : ``
        );
      }
    } else if (opsidekon === "kondisidekon") {
      if (dekonkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kddekon NOT IN (${hasilFormatdekon
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          dekon !== "XX" ? ` a.kddekon IN (${hasilFormatdekon})` : ""
        );
      }
    }

    // FUNGSI PROVINSI

    if (prov !== "XX") {
      kolom.push("a.kdlokasi");
      group.push("a.kdlokasi");
    }

    if (provradio === "2" && prov !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("e.nmlokasi");
        query += ` LEFT JOIN dbref.t_lokasi_${thang} e ON a.kdlokasi=e.kdlokasi`;
      } else {
        kolom.push("a.nmlokasi");
      }
    }
    if (provradio === "3" && prov !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdlokasi");
        kolom.push("e.nmlokasi");
        query += ` LEFT JOIN dbref.t_lokasi_${thang} e ON a.kdlokasi=e.kdlokasi`;
      } else {
        kolom.pop("a.nmlokasi");
        kolom.push("a.nmlokasi");
      }
    }
    if (provradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalprov = provkondisi.split(",");
    const formatprov = nilaiawalprov.map((str) => `'${str}'`);
    const hasilFormatprov = formatprov.join(",");

    if (opsiprov === "pilihprov") {
      if (prov !== "XX") {
        whereConditions.push(
          prov && prov !== "00" ? `a.kdlokasi = '${prov}'` : ``
        );
      }
    } else if (opsiprov === "kondisiprov") {
      if (provkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdlokasi NOT IN (${hasilFormatprov
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          prov !== "XX" ? ` a.kdlokasi IN (${hasilFormatprov})` : ""
        );
      }
    } else if (opsiprov === "kataprov") {
      opsikataprov &&
        whereConditions.push(` e.nmlokasi like '%${opsikataprov}%'`);
    }

    // FUNGSI KDKABKOTA

    if (kabkota !== "XX") {
      kolom.push("a.kdkabkota");
      group.push("a.kdkabkota");
    }

    if (kabkotaradio === "2" && kabkota !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("f.nmkabkota");
        query += ` LEFT JOIN dbref.t_kabkota_${thang} f on a.kdlokasi=f.kdlokasi and a.kdkabkota=f.kdkabkota`;
      } else {
        kolom.push("a.nmkabkota");
      }
    }
    if (kabkotaradio === "3" && kabkota !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdkabkota");
        kolom.push("f.nmkabkota");
        query += ` LEFT JOIN dbref.t_kabkota_${thang} f on a.kdlokasi=f.kdlokasi and a.kdkabkota=f.kdkabkota`;
      } else {  
        kolom.pop("a.nmkabkota");
        kolom.push("a.nmkabkota");
      }
    }

    const nilaiawalkdkabkota = kdkabkotakondisi.split(",");
    const formatkdkabkota = nilaiawalkdkabkota.map((str) => `'${str}'`);
    const hasilFormatkdkabkota = formatkdkabkota.join(",");

    if (opsikdkabkota === "pilihkdkabkota") {
      if (kabkota !== "XX") {
        whereConditions.push(
          kabkota && kabkota !== "ALL" ? `a.kdkabkota = '${kabkota}'` : ``
        );
      }
    } else if (opsikdkabkota === "kondisikdkabkota") {
      if (kdkabkotakondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdkabkota NOT IN (${hasilFormatkdkabkota
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kabkota !== "XX" ? ` a.kdkabkota IN (${hasilFormatkdkabkota})` : ""
        );
      }
    }
    // console.log(kabkota);
    // FUNGSI KANWIL

    if (kanwil !== "XX") {
      kolom.push("a.kdkanwil");
      group.push("a.kdkanwil");
    }

    if (kanwilradio === "2" && kanwil !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("g.nmkanwil");
        query += ` LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil=g.kdkanwil`;
      } else {
        kolom.push("a.nmkanwil");
      }
    }
    if (kanwilradio === "3" && kanwil !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdkanwil");
        kolom.push("g.nmkanwil");
        query += ` LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil=g.kdkanwil`;
      } else {  
        kolom.pop("a.nmkanwil");
        kolom.push("a.nmkanwil");
      }
    }
    if (kanwilradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalkanwil = kanwilkondisi.split(",");
    const formatkanwil = nilaiawalkanwil.map((str) => `'${str}'`);
    const hasilFormatkanwil = formatkanwil.join(",");

    if (opsikanwil === "pilihkanwil") {
      if (kanwil !== "XX") {
        whereConditions.push(
          kanwil && kanwil !== "00" ? `a.kdkanwil = '${kanwil}'` : ``
        );
      }
    } else if (opsikanwil === "kondisikanwil") {
      if (kanwilkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdkanwil NOT IN (${hasilFormatkanwil
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kanwil !== "XX" ? ` a.kdkanwil IN (${hasilFormatkanwil})` : ""
        );
      }
    } else if (opsikanwil === "katakanwil") {
      opsikatakanwil &&
        whereConditions.push(` g.nmkanwil like '%${opsikatakanwil}%'`);
    }
    // FUNGSI KPPN

    if (kppn !== "XX") {
      kolom.push("a.kdkppn");
      group.push("a.kdkppn");
    }

    if (kppnradio === "2" && kppn !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("h.nmkppn");
        query += ` LEFT JOIN dbref.t_kppn_${thang} h ON a.kdkppn=h.kdkppn`;
      } else {
        kolom.push("a.nmkppn");
      }
    }
    if (kppnradio === "3" && kppn !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdkppn");
        kolom.push("h.nmkppn");
        query += ` LEFT JOIN dbref.t_kppn_${thang} h ON a.kdkppn=h.kdkppn`;
      } else {
        kolom.pop("a.nmkppn");
        kolom.push("a.nmkppn");
      }
    }
    if (kppnradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalkppn = kppnkondisi.split(",");
    const formatkppn = nilaiawalkppn.map((str) => `'${str}'`);
    const hasilFormatkppn = formatkppn.join(",");

    if (opsikppn === "pilihkppn") {
      if (kppn !== "XX") {
        whereConditions.push(
          kppn && kppn !== "00" ? `a.kdkppn = '${kppn}'` : ``
        );
      }
    } else if (opsikppn === "kondisikppn") {
      if (kppnkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdkppn NOT IN (${hasilFormatkppn
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          kppn !== "XX" ? ` a.kdkppn IN (${hasilFormatkppn})` : ""
        );
      }
    } else if (opsikppn === "katakppn") {
      opsikatakppn &&
        whereConditions.push(` h.nmkppn like '%${opsikatakppn}%'`);
    }

    // FUNGSI KDSATKER

    if (satker !== "XX") {
      kolom.push("a.kdsatker");
      group.push("a.kdsatker");
    }

    if (satkerradio === "2" && satker !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("i.nmsatker");
        query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.kdsatker=i.kdsatker`;
      } else {  
        kolom.push("a.nmsatker");
      }
    }
    if (satkerradio === "3" && satker !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdsatker");
        kolom.push("i.nmsatker");
        query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.kdsatker=i.kdsatker`;
      }
    }
    if (satkerradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(satker);
    const nilaiawalsatker = satkerkondisi.split(",");
    const formatsatker = nilaiawalsatker.map((str) => `'${str}'`);
    const hasilFormatsatker = formatsatker.join(",");

    if (opsisatker === "pilihsatker") {
      if (satker !== "XX") {
        whereConditions.push(
          satker && satker !== "SEMUASATKER" ? `a.kdsatker = '${satker}'` : ``
        );
      }
    } else if (opsisatker === "kondisisatker") {
      if (satkerkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdsatker NOT IN (${hasilFormatsatker
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          satker !== "XX" ? ` a.kdsatker IN (${hasilFormatsatker})` : ""
        );
      }
    } else if (opsisatker === "katasatker") {
      opsikatasatker &&
        whereConditions.push(` i.nmsatker like '%${opsikatasatker}%'`);
    }

    // FUNGSI KDFUNGSI

    if (fungsi !== "XX") {
      kolom.push("a.kdfungsi");
      group.push("a.kdfungsi");
    }

    if (fungsiradio === "2" && fungsi !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("j.nmfungsi");
        query += ` LEFT JOIN dbref.t_fungsi_2014 j ON a.kdfungsi=j.kdfungsi`;
      } else {
        kolom.push("a.nmfungsi");
      }
    }
    if (fungsiradio === "3" && fungsi !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdfungsi");
        kolom.push("j.nmfungsi");
        query += ` LEFT JOIN dbref.t_fungsi_2014 j ON a.kdfungsi=j.kdfungsi`;
      } else {
        kolom.pop("a.nmfungsi");
        kolom.push("a.nmfungsi");
      }
    }
    if (fungsiradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalfungsi = fungsikondisi.split(",");
    const formatfungsi = nilaiawalfungsi.map((str) => `'${str}'`);
    const hasilFormatfungsi = formatfungsi.join(",");

    if (opsifungsi === "pilihfungsi") {
      if (fungsi !== "XX") {
        whereConditions.push(
          fungsi && fungsi !== "SEMUAFUNGSI" ? `a.kdfungsi = '${fungsi}'` : ``
        );
      }
    } else if (opsifungsi === "kondisifungsi") {
      if (fungsikondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdfungsi NOT IN (${hasilFormatfungsi
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          fungsi !== "XX" ? ` a.kdfungsi IN (${hasilFormatfungsi})` : ""
        );
      }
    } else if (opsifungsi === "katafungsi") {
      opsikatafungsi &&
        whereConditions.push(` j.nmfungsi like '%${opsikatafungsi}%'`);
    }

    // FUNGSI KD SUB FUNGSI

    if (sfungsi !== "XX") {
      kolom.push("a.kdsfung");
      group.push("a.kdsfung");
    }

    if (subfungsiradio === "2" && sfungsi !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("k.nmsfung");
        query += ` LEFT JOIN dbref.t_sfung k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
      } else {
        kolom.push("a.nmsfung");
      }
    }
    if (subfungsiradio === "3" && sfungsi !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdsfung");
        kolom.push("k.nmsfung");
        query += ` LEFT JOIN dbref.t_sfung k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
      } else {
        kolom.pop("a.nmsfung");
        kolom.push("a.nmsfung");
      }
    }
    if (subfungsiradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(subfungsi);
    const nilaiawalsubfungsi = subfungsikondisi.split(",");
    const formatsubfungsi = nilaiawalsubfungsi.map((str) => `'${str}'`);
    const hasilFormatsubfungsi = formatsubfungsi.join(",");

    if (opsisubfungsi === "pilihsubfungsi") {
      if (sfungsi !== "XX") {
        whereConditions.push(
          sfungsi && sfungsi !== "SEMUASUBFUNGSI"
            ? `a.kdsfung = '${sfungsi}'`
            : ``
        );
      }
    } else if (opsisubfungsi === "kondisisubfungsi") {
      if (subfungsikondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdsfung NOT IN (${hasilFormatsubfungsi
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          sfungsi !== "XX" ? ` a.kdsfung IN (${hasilFormatsubfungsi})` : ""
        );
      }
    } else if (opsisubfungsi === "katasubfungsi") {
      opsikatasubfungsi &&
        whereConditions.push(` k.nmsfung like '%${opsikatasubfungsi}%'`);
    }

    // FUNGSI KD PROGRAM

    if (program !== "XX") {
      kolom.push("a.kdprogram");
      group.push("a.kdprogram");
    }

    if (programradio === "2" && program !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("l.nmprogram");
        query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
      } else {
        kolom.push("a.nmprogram");
      }
    }
    if (programradio === "3" && program !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdprogram");
        kolom.push("l.nmprogram");
        query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
      } else {
        kolom.pop("a.nmprogram");
        kolom.push("a.nmprogram");
      }
    }
    if (programradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(program);
    const nilaiawalprogram = programkondisi.split(",");
    const formatprogram = nilaiawalsubfungsi.map((str) => `'${str}'`);
    const hasilFormatprogram = formatprogram.join(",");

    if (opsiprogram === "pilihprogram") {
      if (program !== "XX") {
        whereConditions.push(
          program && program !== "00" ? `a.kdprogram = '${program}'` : ``
        );
      }
    } else if (opsiprogram === "kondisiprogram") {
      if (programkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdprogram NOT IN (${hasilFormatprogram
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          program !== "XX" ? ` a.kdprogram IN (${hasilFormatprogram})` : ""
        );
      }
    } else if (opsiprogram === "kataprogram") {
      opsikataprogram &&
        whereConditions.push(` l.nmprogram like '%${opsikataprogram}%'`);
    }

    // FUNGSI KD GIAT

    if (giat !== "XX") {
      kolom.push("a.kdgiat");
      group.push("a.kdgiat");
    }

    if (kegiatanradio === "2" && giat !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("m.nmgiat");
        query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
      } else {
        kolom.push("a.nmgiat");
      }
    }
    if (kegiatanradio === "3" && giat !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdgiat");
        kolom.push("m.nmgiat");
        query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
      } else {
        kolom.pop("a.nmgiat");
        kolom.push("a.nmgiat");
      }
    }
    if (kegiatanradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(giat);
    const nilaiawalgiat = giatkondisi.split(",");
    const formatgiat = nilaiawalgiat.map((str) => `'${str}'`);
    const hasilFormatgiat = formatgiat.join(",");

    if (opsigiat === "pilihgiat") {
      if (giat !== "XX") {
        whereConditions.push(
          giat && giat !== "00" ? `a.kdgiat = '${giat}'` : ``
        );
      }
    } else if (opsigiat === "kondisigiat") {
      if (giatkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdgiat NOT IN (${hasilFormatgiat
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          giat !== "XX" ? ` a.kdgiat IN (${hasilFormatgiat})` : ""
        );
      }
    } else if (opsigiat === "katagiat") {
      opsikatagiat &&
        whereConditions.push(` m.nmgiat like '%${opsikatagiat}%'`);
    }

    // FUNGSI KD OUTPUT

    if (output !== "XX") {
      kolom.push("a.kdoutput");
      group.push("a.kdoutput");
    }

    if (outputradio === "2" && output !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("n.nmoutput");
        query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
      } else {
        kolom.push("a.nmoutput");
      }
    }
    if (outputradio === "3" && output !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdoutput");
        kolom.push("n.nmoutput");
        query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
      } else {
        kolom.pop("a.nmoutput");
        kolom.push("a.nmoutput");
      }
    }
    if (outputradio === "4") {
      kolom = [];
      query += ` `;
    }
    // console.log(opsioutput);
    const nilaiawaloutput = outputkondisi.split(",");
    const formatoutput = nilaiawalsubfungsi.map((str) => `'${str}'`);
    const hasilFormatoutput = formatoutput.join(",");

    if (opsioutput === "pilihoutput") {
      if (output !== "XX") {
        whereConditions.push(
          output && output !== "SEMUAOUTPUT" ? `a.kdoutput = '${output}'` : ``
        );
      }
    } else if (opsioutput === "kondisioutput") {
      if (outputkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdoutput NOT IN (${hasilFormatoutput
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          output !== "XX" ? ` a.kdoutput IN (${hasilFormatoutput})` : ""
        );
      }
    } else if (opsioutput === "kataoutput") {
      opsikataoutput &&
        whereConditions.push(` n.nmoutput like '%${opsikataoutput}%'`);
    }
    // FUNGSI SUB OUTPUT

    let tahunrkakl = thang.toString().slice(-2);
    if (soutput !== "XX") {
      kolom.push("a.kdsoutput");
      group.push("a.kdsoutput");
    }

    if (soutputradio === "2" && soutput !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("aa.ursoutput");
        query += ` LEFT JOIN dbref.dipa_soutput_${tahunrkakl} aa ON a.kdsatker=aa.kdsatker AND a.kddept=aa.kddept AND a.kdunit=aa.kdunit AND a.kdprogram=aa.kdprogram AND a.kdgiat=aa.kdgiat AND a.kdoutput=aa.kdoutput AND a.kdsoutput=aa.kdsoutput`;
      } else {
        kolom.push("a.ursoutput");
      }
    }
    if (soutputradio === "3" && soutput !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdsoutput");
        kolom.push("aa.ursoutput");
        query += ` LEFT JOIN dbref.dipa_soutput_${tahunrkakl} aa ON a.kdsatker=aa.kdsatker AND a.kddept=aa.kddept AND a.kdunit=aa.kdunit AND a.kdprogram=aa.kdprogram AND a.kdgiat=aa.kdgiat AND a.kdoutput=aa.kdoutput AND a.kdsoutput=aa.kdsoutput`;
      } else {
        kolom.pop("a.ursoutput");
        kolom.push("a.ursoutput");
      }
    }
    if (soutputradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(soutput);
    const nilaiawalsoutput = suboutputkondisi.split(",");
    const formatsoutput = nilaiawalsoutput.map((str) => `'${str}'`);
    const hasilFormatsoutput = formatsoutput.join(",");

    if (opsisuboutput === "pilihsuboutput") {
      if (soutput !== "XX") {
        whereConditions.push(
          soutput && soutput !== "SEMUASUBOUTPUT"
            ? `a.kdsoutput = '${soutput}'`
            : ``
        );
      }
    } else if (opsisuboutput === "kondisisuboutput") {
      if (suboutputkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdsoutput NOT IN (${hasilFormatsoutput
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          soutput !== "XX" ? ` a.kdsoutput IN (${hasilFormatsoutput})` : ""
        );
      }
    } else if (opsisuboutput === "katasuboutput") {
      opsikatasuboutput &&
        whereConditions.push(` aa.ursoutput like '%${opsikatasuboutput}%'`);
    }
    // FUNGSI KDAKUN
    if (akun === "AKUN") {
      kolom.push("a.kdakun");
      group.push("a.kdakun");
    } else if (akun === "BKPK") {
      kolom.push("LEFT(a.kdakun,4) as KDBKPK");
      group.push("LEFT(a.kdakun,4)");
    } else if (akun === "JENBEL") {
      kolom.push("LEFT(a.kdakun,2) as JENBEL");
      group.push("LEFT(a.kdakun,2) ");
    }

    if (akunradio === "2" && akun === "AKUN") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push(" p.nmakun");
        query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
      } else {
        kolom.push("a.nmakun");
      }
    } else if (akunradio === "2" && akun === "BKPK") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("  o.nmbkpk");
        query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.kdakun,4)=o.kdbkpk`;
      } else {
        kolom.push("a.nmbkpk");
      }
    } else if (akunradio === "2" && akun === "JENBEL") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("  q.nmgbkpk");
        query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
      } else {
        kolom.push("a.nmgbkpk");
      }
    }

    if (akunradio === "3" && akun === "AKUN") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdakun");
        kolom.push(" p.nmakun");
        query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
      } else {
        kolom.pop("a.nmakun");
        kolom.push("a.nmakun");
      }
    } else if (akunradio === "3" && akun === "BKPK") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("LEFT(a.kdakun,4)");
        kolom.push("  o.nmbkpk");
        query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.kdakun,4)=o.kdbkpk`;
      } else {
        kolom.pop("a.nmbkpk");
        kolom.push("a.nmbkpk");
      }
    } else if (akunradio === "3" && akun === "JENBEL") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("LEFT(a.kdakun,2)");
        kolom.push("  q.nmgbkpk");
        query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
      } else {
        kolom.pop("a.nmgbkpk");
        kolom.push("a.nmgbkpk");
      }
    }
    if (akunradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalakun = akunkondisi.split(",");
    const formatakun = nilaiawalakun.map((str) => `'${str}'`);
    const hasilFormatakun = formatakun.join(",");
    const panjangAkun =
      akunkondisi.substring(0, 1) === "!"
        ? akunkondisi.substring(1).indexOf(",") !== -1
          ? akunkondisi.substring(1).indexOf(",") + 1 // Menambahkan 1 untuk menghitung karakter "!"
          : akunkondisi.substring(1).length
        : akunkondisi.indexOf(",") !== -1
          ? akunkondisi.indexOf(",")
          : akunkondisi.length;

    if (opsiakun === "kondisiakun") {
      if (akunkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `${
            akun === "AKUN"
              ? `LEFT(a.kdakun,${panjangAkun})`
              : akun === "BKPK"
                ? `LEFT(a.kdakun,${panjangAkun})`
                : `LEFT(a.kdakun,${panjangAkun})`
          } not in (${hasilFormatakun
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          `${
            akun === "AKUN"
              ? `LEFT(a.kdakun,${panjangAkun})`
              : akun === "BKPK"
                ? `LEFT(a.kdakun,${panjangAkun})`
                : `LEFT(a.kdakun,${panjangAkun})`
          }  in (${hasilFormatakun
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      }
    } else if (opsiakun === "kataakun") {
      if (akun === "AKUN") {
        opsikataakun &&
          whereConditions.push(` p.nmakun like '%${opsikataakun}%'`);
      } else if (akun === "BKPK") {
        opsikataakun &&
          whereConditions.push(` o.nmbkpk like '%${opsikataakun}%'`);
      } else {
        opsikataakun &&
          whereConditions.push(` q.nmgbkpk like '%${opsikataakun}%'`);
      }
    }

    //Ketika jenlap yg dipilih 11 (banper), maka muncul kondisi akun berikut
    if (jenlap === "11") {
      whereConditions.push(`a.kdakun IN ('511521','511522','511529','521231','521232','521233','521234','526111',
'526112','526113','526114','526115','526121','526122','526123','526124','526131','526132','526311','526312','526313',
'526321','526322','526323')`);
    }

    // FUNGSI SUMBER DANA

    if (sdana !== "XX") {
      kolom.push("a.kdsdana");
      group.push("a.kdsdana");
    }

    if (sdanaradio === "2" && sdana !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.push("d.nmsdana2");
        query += ` LEFT JOIN dbref.t_sdana_${thang} d on  a.kdsdana = d.kdsdana`;
      } else {
        kolom.push("a.nmsdana2");
      }
    }
    if (sdanaradio === "3" && sdana !== "XX") {
      if(!directJenlapTable.includes(jenlap)) {
        kolom.pop("a.kdsdana");
        kolom.push("d.nmsdana2");
        query += ` LEFT JOIN dbref.t_sdana_${thang} d on  a.kdsdana = d.kdsdana`;
      } else {
        kolom.pop("a.kdsdana");
        kolom.push("a.nmsdana2");
      }
    }
    if (sdanaradio === "4") {
      kolom = [];
      query += ` `;
    }
    // console.log(opsioutput);
    const nilaiawalsdana = sdanakondisi.split(",");
    const formatsdana = nilaiawalsdana.map((str) => `'${str}'`);
    const hasilFormatsdana = formatsdana.join(",");

    if (opsisdana === "pilihsdana") {
      if (sdana !== "XX") {
        whereConditions.push(
          sdana && sdana !== "SEMUASUMBERDANA" ? `a.kdsdana = '${sdana}'` : ``
        );
      }
    } else if (opsisdana === "kondisisdana") {
      if (sdanakondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdsdana NOT IN (${hasilFormatsdana
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          sdana !== "XX" ? ` a.kdsdana IN (${hasilFormatsdana})` : ""
        );
      }
    }

    // else if (opsisdana === "katasdana") {
    //   opsikatasdana &&
    //     whereConditions.push(` n.nmsdana like '%${opsikatasdana}%'`);
    // }

    if (jenlap === "1") {
      // PRIORITAS NASIONAL

      if (pn !== "XX") {
        kolom.push("a.kdpn");
        group.push("a.kdpn");
        whereConditions.push(pn && `a.kdpn <>'00'`);
      }

      if (pnradio === "2") {
        kolom.push("pn.nmpn");
        query += " left join dbref.t_prinas_" + thang + " pn on a.kdpn=pn.kdpn";
      }
      if (pnradio === "3") {
        kolom.pop("a.kdpn");
        kolom.push("pn.nmpn");
        query += " left join dbref.t_prinas_" + thang + " pn on a.kdpn=pn.kdpn";
      }
      if (pnradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (pn !== "XX") {
        whereConditions.push(pn && pn !== "00" ? `a.kdpn = '${pn}'` : ` `);
      }
      // PROGRAM PRIORITAS

      if (prioritas !== "XX") {
        kolom.push("a.kdpp");
        group.push("a.kdpp");
      }

      if (ppradio === "2") {
        kolom.push("pp.nmpp");
        query +=
          " left join dbref.t_priprog_" +
          thang +
          " pp on a.kdpn=pp.kdpn  and a.kdpp=pp.kdpp";
      }
      if (ppradio === "3") {
        kolom.pop("a.kdpp");
        kolom.push("pp.nmpp");
        query +=
          " left join dbref.t_priprog_" +
          thang +
          " pp on a.kdpn=pp.kdpn  and a.kdpp=pp.kdpp";
      }
      if (ppradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (prioritas !== "XX") {
        whereConditions.push(
          prioritas && prioritas !== "00" ? `a.kdpp = '${prioritas}'` : ` `
        );
      }

      // KEGIATAN PRIORITAS

      if (kp !== "XX") {
        kolom.push("a.kdkp");
        group.push("a.kdkp");
      }

      if (kpradio === "2") {
        kolom.push("kp.nmkp");
        query +=
          " left join dbref.t_prigiat_" +
          thang +
          " kp on a.kdpn=kp.kdpn and a.kdpp=kp.kdpp and a.kdkp=kp.kdkp";
      }
      if (kpradio === "3") {
        kolom.pop("a.kdkp");
        kolom.push("kp.nmkp");
        query +=
          " left join dbref.t_prigiat_" +
          thang +
          " kp on a.kdpn=kp.kdpn and a.kdpp=kp.kdpp and a.kdkp=kp.kdkp";
      }
      if (kpradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (kp !== "XX") {
        whereConditions.push(kp && kp !== "00" ? `a.kdkp = '${kp}'` : ` `);
      }

      // PROYEK PRIORITAS

      if (px !== "XX") {
        kolom.push("a.kdproy");
        group.push("a.kdproy");
      }

      if (pxradio === "2") {
        kolom.push("px.nmproy");
        query +=
          " left join dbref.t_priproy_" +
          thang +
          " px on a.kdpn=px.kdpn and a.kdpp=px.kdpp and a.kdkp=px.kdkp and a.kdproy=px.kdproy";
      }
      if (pxradio === "3") {
        kolom.pop("a.kdproy");
        kolom.push("px.nmproy");
        query +=
          " left join dbref.t_priproy_" +
          thang +
          " px on a.kdpn=px.kdpn and a.kdpp=px.kdpp and a.kdkp=px.kdkp and a.kdproy=px.kdproy";
      }
      if (pxradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (px !== "XX") {
        whereConditions.push(px && px !== "00" ? `a.kdproy = '${px}'` : ` `);
      }
    } else if (jenlap === "2") {
      if (mp !== "XX") {
        kolom.push("a.kdmp");
        group.push("a.kdmp");
      }

      if (mpradio === "2") {
        kolom.push("mp.nmmp");
        query += "  left join dbref.t_mp mp on a.kdmp=mp.kdmp";
      }
      if (mpradio === "3") {
        kolom.pop("a.kdmp");
        kolom.push("mp.nmmp");
        query += "  left join dbref.t_mp mp on a.kdmp=mp.kdmp";
      }
      if (mpradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (mp !== "XX") {
        whereConditions.push(mp && mp !== "00" ? `a.kdmp = '${mp}'` : ` `);
      }
    } else if (jenlap === "3") {
      // TEMATIK
      if (tema !== "XX") {
        kolom.push(" A.KDTEMA");
        group.push(" A.KDTEMA");
      }

      if (temaradio === "2") {
        kolom.push("TEMA.NMTEMA");
        query +=
          "   LEFT JOIN DBREF" +
          thang +
          ".T_TEMA TEMA ON A.KDTEMA=TEMA.KDTEMA ";
      }
      if (temaradio === "3") {
        kolom.pop(" A.KDTEMA");
        kolom.push("TEMA.NMTEMA");
        query +=
          "   LEFT JOIN DBREF" +
          thang +
          ".T_TEMA TEMA ON A.KDTEMA=TEMA.KDTEMA ";
      }
      if (temaradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (tema !== "XX") {
        whereConditions.push(
          opsitema && opsitema !== "00" ? ` A.KDTEMA like '%${opsitema}%'` : ` `
        );
      }
    } else if (jenlap === "4") {
      // console.log(inflasiradio);
      // INFLASI

      if (inflasiradio === "1") {
        kolom.push(" A.inf_intervensi,A.inf_pengeluaran");
        group.push(" A.inf_intervensi,A.inf_pengeluaran");
      }

      if (inflasiradio === "2") {
        kolom.push(
          "A.inf_intervensi,bb.ur_inf_intervensi,A.inf_pengeluaran,ccc.ur_inf_pengeluaran"
        );
        query +=
          "   LEFT JOIN DBREF.ref_inf_intervensi bb  ON A.inf_intervensi=bb.inf_intervensi left join dbref.ref_inf_pengeluaran ccc on a.inf_pengeluaran=ccc.inf_pengeluaran";
        group.push(" A.inf_intervensi,A.inf_pengeluaran");
      }
      if (inflasiradio === "3") {
        kolom.push("bb.ur_inf_intervensi,ccc.ur_inf_pengeluaran");
        query +=
          "   LEFT JOIN DBREF.ref_inf_intervensi bb  ON A.inf_intervensi=bb.inf_intervensi left join dbref.ref_inf_pengeluaran ccc on a.inf_pengeluaran=ccc.inf_pengeluaran";
        group.push(" A.inf_intervensi,A.inf_pengeluaran");
      }
      if (inflasiradio === "4") {
        kolom = [];
        query += ` `;
      }

      whereConditions.push(
        inflasiradio && inflasiradio !== "00"
          ? ` (A.inf_intervensi <> 'NULL' or A.inf_pengeluaran <> 'NULL')`
          : ` `
      );
    } else if (jenlap === "5") {
      // STUNTING
      if (stun !== "XX") {
        kolom.push(" A.STUN_INTERVENSI");
        group.push(" A.STUN_INTERVENSI");
        whereConditions.push(stun && `A.STUN_INTERVENSI IS NOT NULL`);
      }

      if (stuntingradio === "2") {
        kolom.push("STUN.UR_STUN_INTERVENSI");
        query +=
          "   LEFT JOIN DBREF.REF_STUNTING_INTERVENSI STUN ON A.STUN_INTERVENSI=STUN.STUN_INTERVENSI";
      }
      if (stuntingradio === "3") {
        kolom.pop(" A.STUN_INTERVENSI");
        kolom.push("STUN.UR_STUN_INTERVENSI");
        query +=
          "   LEFT JOIN DBREF.REF_STUNTING_INTERVENSI STUN ON A.STUN_INTERVENSI=STUN.STUN_INTERVENSI ";
      }
      if (stuntingradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (stun !== "XX") {
        whereConditions.push(
          stun && stun !== "00" ? `A.STUN_INTERVENSI = '${stun}'` : ` `
        );
      }
    } else if (jenlap === "7") {
      // console.log(inflasiradio);
      // KEMISKINAN EKSTRIM
      if (miskin !== "XX") {
        group.push(" a.kemiskinan_ekstrim");
      }
      whereConditions.push(
        miskin && miskin === "00" ? ` a.kemiskinan_ekstrim <> 'NULL'` : ` `
      );
    } else if (jenlap === "8") {
      // console.log(inflasiradio);
      // BELANJA PEMILU
      if (pemilu !== "XX") {
        group.push(" a.pemilu");
      }
      whereConditions.push(
        pemilu && pemilu === "00" ? ` a.pemilu <> 'NULL'` : ` `
      );
    } else if (jenlap === "9") {
      // console.log(inflasiradio);
      // BELANJA IKN
      if (ikn !== "XX") {
        group.push(" a.ikn");
      }
      whereConditions.push(ikn && ikn === "00" ? ` a.ikn <> 'NULL'` : ` `);
    } else if (jenlap === "10") {
      // console.log(inflasiradio);
      // BELANJA KETAHANAN PANGAN
      if (pangan !== "XX") {
        group.push(" a.pangan");
      }
      whereConditions.push(
        pangan && pangan === "00" ? ` a.pangan <> 'NULL'` : ` `
      );
    } else if (jenlap === "12") {
      // Makanan Bergizi Gratis
      if (mbg !== "XX") {
        kolom.push(" A.MBG");
        group.push(" A.MBG");
        whereConditions.push(mbg && `A.MBG IS NOT NULL`);
      }

      if (mbgradio === "2") {
        kolom.push("MBG.UR_MBG_INTERVENSI");
        query += "   LEFT JOIN DBREF.REF_MBG_INTERVENSI MBG ON A.MBG=MBG.MBG";
      }
      if (mbgradio === "3") {
        kolom.pop(" A.MBG");
        kolom.push("MBG.UR_MBG_INTERVENSI");
        query += "   LEFT JOIN DBREF.REF_MBG_INTERVENSI MBG ON A.MBG=MBG.MBG ";
      }
      if (mbgradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (mbg !== "XX") {
        whereConditions.push(mbg && mbg !== "00" ? `A.MBG = '${mbg}'` : ` `);
      }
    } else if (jenlap === "13") {
      // console.log(inflasiradio);
      // BELANJA SWASEMBADA
      if (swasembada !== "XX") {
        group.push(" a.swasembada");
      }
      whereConditions.push(
        swasembada && swasembada === "00" ? ` a.swasembada <> 'NULL'` : ` `
      );
    } else if (jenlap === "14") {      
      if (programstrategis !== "XX") {
        kolom.push(" a.kdprogis");
        group.push(" a.kdprogis");
      }
      if (programstrategisradio === "2") {
        kolom.push("a.nmprogis");
      }
      if (programstrategisradio === "3") {
        kolom.pop(" a.kdprogis");
        kolom.push("a.nmprogis");
      }

      if (programstrategis !== "00") {
        whereConditions.push(
          programstrategis && programstrategis !== "00"
            ? `a.kdprogis = '${programstrategis}'`
            : ` `
        );
      }
    }

    // MULAI generate QUERY SQL
    if (kolom.length > 0) {
      defaultSelect = "," + defaultSelect;
    }
    if (group.length > 0) {
      const cleanKolom = group
        .map((col) => {
          const cleanCol = col.replace(/\sas\s.*/i, "").trim();

          if (!cleanCol.includes("CONCAT")) {
            return cleanCol;
          }
        })
        .filter(Boolean);

      groupByClause = ` GROUP BY ${cleanKolom.join(",")}`;
    }

    whereConditions = whereConditions.filter(
      (condition) => condition.trim() !== ""
    );

    const hasWhereClause = whereConditions.length > 0;

    let limitakses = "";
    let limitaksesall = "";

    if (role === "3") {
      limitakses = " and a.kdkppn= '" + kodekppn + "'";
    } else if (role === "2") {
      limitakses = " and a.kdkanwil= '" + kodekanwil + "'";
    }
    if (role === "3") {
      limitaksesall = " where a.kdkppn= '" + kodekppn + "'";
    } else if (role === "2") {
      limitaksesall = " where a.kdkanwil= '" + kodekanwil + "'";
    }

    const whereClause = hasWhereClause
      ? ` WHERE  ${whereConditions.join(" AND ")} ${limitakses}`
      : limitaksesall;

    const finalWhereClause =
      whereConditions.length === 1
        ? ` WHERE ${whereConditions[0]} ${limitakses} `
        : whereClause;

    return `SELECT ${kolom.join(
      ","
    )}${select} FROM ${from} ${query} ${finalWhereClause}  ${groupByClause}`;
  }

  // PEMANGGILAN FUNGSI SQL SECARA MENYELURUH

  let kolom = [];
  let group = [];

  const sqlQuery = buatQuery(
    kolom,
    dept,
    kdunit,
    prov,
    kabkota,
    kppn,
    kanwil,
    satker,
    fungsi,
    sfungsi,
    program,
    giat,
    output,
    soutput,
    akun
  );

  return sqlQuery;
};
