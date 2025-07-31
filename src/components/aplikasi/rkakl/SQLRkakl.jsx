export const getSQL = (queryParams) => {
  const {
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
    soutput,
    soutputradio,
    akun,
    akunradio,
    sdana,
    sdanaradio,
    sfungsi,
    select,
    from,
    komponen,
    komponenradio,
    subkomponen,
    subkomponenradio,
    item,
    itemradio,
    register,
    registerradio,
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
    opsikppn,
    opsikatakppn,
    kanwilkondisipilih,
    kanwilkondisi,
    opsikanwil,
    opsikatakanwil,
    opsisatker,
    opsikatasatker,
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
    suboutputkondisipilih,
    suboutputkondisi,
    opsisuboutput,
    opsikatasuboutput,
    akunkondisipilih,
    akunkondisi,
    opsiakun,
    opsikataakun,
    opsisdana,
    opsikatasdana,
    sdanakondisi,
    opsikomponen,
    opsikatakomponen,
    komponenkondisi,
    opsikatasubkomponen,
    opsisubkomponen,
    subkomponenkondisi,
    opsikataitem,
    opsiitem,
    itemkondisi,
    opsikataregister,
    opsiregister,
    registerkondisi,
    pembulatan,
  } = queryParams;

  // KONDISI AWAL
  let query = "";
  let whereClause = "";
  let whereConditions = [];
  let groupByClause = "";

  let defaultSelect = `  ROUND(SUM(a.pagu) / ${pembulatan}, 0) AS pagu,  ROUND(SUM(a.blokir) / ${pembulatan}, 0) AS blokir `;

  // LIMITASI USER ROLE

  // FUNGSI GENERATE SQL
  function buatQuery() {
    // FUNGSI DEPT

    if (dept !== "XXX") {
      kolom.push("a.kddept");
      group.push("a.kddept");
    }

    if (deptradio === "2") {
      kolom.push("b.nmdept");
      query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
    }
    if (deptradio === "3") {
      kolom.pop("a.kddept");
      kolom.push("b.nmdept");
      query += ` LEFT JOIN dbref.t_dept_${thang} b ON a.kddept=b.kddept`;
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
      kolom.push("c.nmunit");
      query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
    }
    if (unitradio === "3" && kdunit !== "XX") {
      kolom.pop("a.kdunit");
      kolom.push("c.nmunit");
      query += ` LEFT JOIN dbref.t_unit_${thang} c ON a.kddept=c.kddept and a.kdunit=c.kdunit`;
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
      kolom.push("cc.nmdekon");
      query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
    }
    if (dekonradio === "3" && dekon !== "XX") {
      kolom.pop("a.kddekon");
      kolom.push("cc.nmdekon");
      query += ` LEFT JOIN dbref.t_dekon_${thang} cc ON  a.kddekon=cc.kddekon`;
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
      kolom.push("e.nmlokasi");
      query += ` LEFT JOIN dbref.t_lokasi_${thang} e ON a.kdlokasi=e.kdlokasi`;
    }
    if (provradio === "3" && prov !== "XX") {
      kolom.pop("a.kdlokasi");
      kolom.push("e.nmlokasi");
      query += ` LEFT JOIN dbref.t_lokasi_${thang} e ON a.kdlokasi=e.kdlokasi`;
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
      kolom.push("f.nmkabkota");
      query += ` LEFT JOIN dbref.t_kabkota_${thang} f on a.kdlokasi=f.kdlokasi and a.kdkabkota=f.kdkabkota`;
    }
    if (kabkotaradio === "3" && kabkota !== "XX") {
      kolom.pop("a.kdkabkota");
      kolom.push("f.nmkabkota");
      query += ` LEFT JOIN dbref.t_kabkota_${thang} f on a.kdlokasi=f.kdlokasi and a.kdkabkota=f.kdkabkota`;
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
      kolom.push("g.nmkanwil");
      query += ` LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil=g.kdkanwil`;
    }
    if (kanwilradio === "3" && kanwil !== "XX") {
      kolom.pop("a.kdkanwil");
      kolom.push("g.nmkanwil");
      query += ` LEFT JOIN dbref.t_kanwil_2014 g ON a.kdkanwil=g.kdkanwil`;
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
      kolom.push("h.nmkppn");
      query += ` LEFT JOIN dbref.t_kppn_${thang} h ON a.kdkppn=h.kdkppn`;
    }
    if (kppnradio === "3" && kppn !== "XX") {
      kolom.pop("a.kdkppn");
      kolom.push("h.nmkppn");
      query += ` LEFT JOIN dbref.t_kppn_${thang} h ON a.kdkppn=h.kdkppn`;
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
      kolom.push("i.nmsatker");
      query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.kdsatker=i.kdsatker`;
    }
    if (satkerradio === "3" && satker !== "XX") {
      kolom.pop("a.kdsatker");
      kolom.push("i.nmsatker");
      query += ` LEFT JOIN dbref.t_satker_${thang} i ON a.kdsatker=i.kdsatker`;
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
      kolom.push("j.nmfungsi");
      query += ` LEFT JOIN dbref.t_fungsi_${thang} j ON a.kdfungsi=j.kdfungsi`;
    }
    if (fungsiradio === "3" && fungsi !== "XX") {
      kolom.pop("a.kdfungsi");
      kolom.push("j.nmfungsi");
      query += ` LEFT JOIN dbref.t_fungsi_${thang} j ON a.kdfungsi=j.kdfungsi`;
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
      kolom.push("k.nmsfung");
      query += ` LEFT JOIN dbref.t_sfung_${thang} k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
    }
    if (subfungsiradio === "3" && sfungsi !== "XX") {
      kolom.pop("a.kdsfung");
      kolom.push("k.nmsfung");
      query += ` LEFT JOIN dbref.t_sfung_${thang} k on a.kdfungsi=k.kdfungsi and a.kdsfung=k.kdsfung`;
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
      kolom.push("l.nmprogram");
      query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
    }
    if (programradio === "3" && program !== "XX") {
      kolom.pop("a.kdprogram");
      kolom.push("l.nmprogram");
      query += ` LEFT JOIN dbref.t_program_${thang} l on a.kddept = l.kddept and a.kdunit = l.kdunit and a.kdprogram =l.kdprogram`;
    }
    if (programradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(program);
    const nilaiawalprogram = programkondisi.split(",");
    const formatprogram = nilaiawalprogram.map((str) => `'${str}'`);
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
      kolom.push("m.nmgiat");
      query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
    }
    if (kegiatanradio === "3" && giat !== "XX") {
      kolom.pop("a.kdgiat");
      kolom.push("m.nmgiat");
      query += ` LEFT JOIN dbref.t_giat_${thang} m on  a.kdgiat =m.kdgiat`;
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
      kolom.push("n.nmoutput");
      query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
    }
    if (outputradio === "3" && output !== "XX") {
      kolom.pop("a.kdoutput");
      kolom.push("n.nmoutput");
      query += ` LEFT JOIN dbref.t_output_${thang} n on  a.kdoutput = n.kdoutput and a.kdgiat=n.kdgiat`;
    }
    if (outputradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(output);
    const nilaiawaloutput = outputkondisi.split(",");
    const formatoutput = nilaiawaloutput.map((str) => `'${str}'`);
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
      kolom.push("aa.ursoutput");
      query += ` LEFT JOIN dbref.dipa_soutput_${tahunrkakl} aa ON a.kdsatker=aa.kdsatker AND a.kddept=aa.kddept AND a.kdunit=aa.kdunit AND a.kdprogram=aa.kdprogram AND a.kdgiat=aa.kdgiat AND a.kdoutput=aa.kdoutput AND a.kdsoutput=aa.kdsoutput`;
    }
    if (soutputradio === "3" && soutput !== "XX") {
      kolom.pop("a.kdsoutput");
      kolom.push("aa.ursoutput");
      query += ` LEFT JOIN dbref.dipa_soutput_${tahunrkakl} aa ON a.kdsatker=aa.kdsatker AND a.kddept=aa.kddept AND a.kdunit=aa.kdunit AND a.kdprogram=aa.kdprogram AND a.kdgiat=aa.kdgiat AND a.kdoutput=aa.kdoutput AND a.kdsoutput=aa.kdsoutput`;
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
      kolom.push(" p.nmakun");
      query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
    } else if (akunradio === "2" && akun === "BKPK") {
      kolom.push("  o.nmbkpk");
      query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.kdakun,4)=o.kdbkpk`;
    } else if (akunradio === "2" && akun === "JENBEL") {
      kolom.push("  q.nmgbkpk");
      query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
    }

    if (akunradio === "3" && akun === "AKUN") {
      kolom.pop("a.kdakun");
      kolom.push(" p.nmakun");
      query += ` LEFT JOIN dbref.t_akun_${thang} p on a.kdakun=p.kdakun`;
    } else if (akunradio === "3" && akun === "BKPK") {
      kolom.pop("LEFT(a.kdakun,4)");
      kolom.push("  o.nmbkpk");
      query += ` LEFT JOIN dbref.t_bkpk_${thang} o on LEFT(a.kdakun,4)=o.kdbkpk`;
    } else if (akunradio === "3" && akun === "JENBEL") {
      kolom.pop("LEFT(a.kdakun,2)");
      kolom.push("  q.nmgbkpk");
      query += ` LEFT JOIN dbref.t_gbkpk_${thang} q on LEFT(a.kdakun,2)=q.kdgbkpk`;
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

    // FUNGSI KDSDANA

    if (sdana !== "XX") {
      kolom.push("a.kdsdana");
      group.push("a.kdsdana");
    }

    if (sdanaradio === "2" && sdana !== "XX") {
      kolom.push("r.nmsdana2");
      query += ` LEFT JOIN dbref.t_sdana_2014 r ON a.kdsdana=r.kdsdana`;
    }
    if (sdanaradio === "3" && sdana !== "XX") {
      kolom.pop("a.kdsdana");
      kolom.push("r.nmsdana2");
      query += ` LEFT JOIN dbref.t_sdana_2014 r ON a.kdsdana=r.kdsdana`;
    }
    if (sdanaradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(sdana);
    const nilaiawalsdana = sdanakondisi.split(",");
    const formatsdana = nilaiawalsdana.map((str) => `'${str}'`);
    const hasilFormatsdana = formatsdana.join(",");

    if (opsisdana === "pilihsdana") {
      if (sdana !== "XX") {
        whereConditions.push(
          sdana && sdana !== "00" ? `a.kdsdana = '${sdana}'` : ``
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
    } else if (opsisdana === "katasdana") {
      opsikatasdana &&
        whereConditions.push(` r.nmsdana2 like '%${opsikatasdana}%'`);
    }

    // FUNGSI KOMPONEN
    if (komponen !== "XX") {
      kolom.push("a.kdkmpnen");
      group.push("a.kdkmpnen");
    }

    if (komponenradio === "2" && komponen !== "XX") {
      kolom.push("ab.urkmpnen");
      query += ` LEFT JOIN dbref.dipa_kmpnen_${tahunrkakl} ab on a.kdsatker=ab.kdsatker and a.kddept=ab.kddept and a.kdunit=ab.kdunit and a.kdprogram=ab.kdprogram and a.kdgiat = ab.kdgiat and a.kdoutput = ab.kdoutput and a.kdsoutput = ab.kdsoutput and a.kdkmpnen=ab.kdkmpnen`;
    }
    if (komponenradio === "3" && komponen !== "XX") {
      kolom.pop("a.kdkmpnen");
      kolom.push("ab.urkmpnen");
      query += ` LEFT JOIN dbref.dipa_kmpnen_${tahunrkakl} ab on a.kdsatker=ab.kdsatker and a.kddept=ab.kddept and a.kdunit=ab.kdunit and a.kdprogram=ab.kdprogram and a.kdgiat = ab.kdgiat and a.kdoutput = ab.kdoutput and a.kdsoutput = ab.kdsoutput and a.kdkmpnen=ab.kdkmpnen`;
    }
    if (komponenradio === "4") {
      kolom = [];
      query += ` `;
    }
    //console.log(komponen);
    const nilaiawalkomponen = komponenkondisi.split(",");
    const formatkomponen = nilaiawalkomponen.map((str) => `'${str}'`);
    const hasilFormatkomponen = formatkomponen.join(",");

    if (opsikomponen === "pilihkomponen") {
      if (komponen !== "XX") {
        whereConditions.push(
          komponen && komponen !== "SEMUAKOMPONEN"
            ? `a.kdkmpnen = '${komponen}'`
            : ``
        );
      }
    } else if (opsikomponen === "kondisikomponen") {
      if (komponenkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdkmpnen NOT IN (${hasilFormatkomponen
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          komponen !== "XX" ? ` a.kdkmpnen IN (${hasilFormatkomponen})` : ""
        );
      }
    } else if (opsikomponen === "katakomponen") {
      opsikatakomponen &&
        whereConditions.push(` ab.urkmpnen like '%${opsikatakomponen}%'`);
    }

    // FUNGSI SUB KOMPONEN
    if (subkomponen !== "XX") {
      kolom.push("a.kdskmpnen");
      group.push("a.kdskmpnen");
    }

    if (subkomponenradio === "2" && subkomponen !== "XX") {
      kolom.push("ac.urskmpnen");
      query += ` LEFT JOIN dbref.dipa_skmpnen_${tahunrkakl} ac on a.kdsatker=ac.kdsatker and a.kddept=ac.kddept and a.kdunit=ac.kdunit and a.kdprogram=ac.kdprogram and a.kdgiat = ac.kdgiat and a.kdoutput = ac.kdoutput and a.kdsoutput = ac.kdsoutput and a.kdkmpnen=ac.kdkmpnen and a.kdskmpnen=ac.kdskmpnen`;
    }
    if (subkomponenradio === "3" && subkomponen !== "XX") {
      kolom.pop("a.kdskmpnen");
      kolom.push("ac.urskmpnen");
      query += ` LEFT JOIN dbref.dipa_skmpnen_${tahunrkakl} ac on a.kdsatker=ac.kdsatker and a.kddept=ac.kddept and a.kdunit=ac.kdunit and a.kdprogram=ac.kdprogram and a.kdgiat = ac.kdgiat and a.kdoutput = ac.kdoutput and a.kdsoutput = ac.kdsoutput and a.kdkmpnen=ac.kdkmpnen and a.kdskmpnen=ac.kdskmpnen`;
    }
    if (subkomponenradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalsubkomponen = subkomponenkondisi.split(",");
    const formatsubkomponen = nilaiawalsubkomponen.map((str) => `'${str}'`);
    const hasilFormatsubkomponen = formatsubkomponen.join(",");

    if (opsisubkomponen === "pilihsubkomponen") {
      if (subkomponen !== "XX") {
        whereConditions.push(
          subkomponen && subkomponen !== "SEMUASUBKOMPONEN"
            ? `a.kdskmpnen = '${subkomponen}'`
            : ``
        );
      }
    } else if (opsisubkomponen === "kondisisubkomponen") {
      if (subkomponenkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.kdskmpnen NOT IN (${hasilFormatsubkomponen
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          subkomponen !== "XX"
            ? ` a.kdskmpnen IN (${hasilFormatsubkomponen})`
            : ""
        );
      }
    } else if (opsisubkomponen === "katasubkomponen") {
      opsikatasubkomponen &&
        whereConditions.push(`ac.urskmpnen like '%${opsikatasubkomponen}%'`);
    }

    // FUNGSI ITEM
    if (item !== "XX") {
      kolom.push(" a.noitem");
      group.push(" a.noitem");
    }

    if (itemradio === "2" && item !== "XX") {
      kolom.push(` CONCAT(
      CONVERT(a.nmitem USING utf8),
      ' ( VOL : ',
      a.volkeg,
      ' ',
      CONVERT(a.satkeg USING utf8),
      ' x ',
      FORMAT(a.hargasat, 0),
      ')'
  ) AS nmitem`);
    }
    if (itemradio === "3" && item !== "XX") {
      kolom.push(` CONCAT(
      CONVERT(a.nmitem USING utf8),
      ' ( VOL : ',
      a.volkeg,
      ' ',
      CONVERT(a.satkeg USING utf8),
      ' x ',
      FORMAT(a.hargasat, 0),
      ')'
  ) AS nmitem`);
    }
    if (itemradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalitem = itemkondisi.split(",");
    const formatitem = nilaiawalitem.map((str) => `'${str}'`);
    const hasilFormatitem = formatitem.join(",");

    if (opsiitem === "pilihitem") {
      if (item !== "XX") {
        whereConditions.push(
          item && item !== "SEMUAITEM" ? ` a.noitem = '${item}'` : ``
        );
      }
    } else if (opsiitem === "kondisiitem") {
      if (itemkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `   a.noitem NOT IN (${hasilFormatitem
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          item !== "XX" ? ` a.noitem IN (${hasilFormatitem})` : ""
        );
      }
    } else if (opsiitem === "kataitem") {
      if (item === "SEMUAITEM") {
        opsikataitem &&
          whereConditions.push(`a.nmitem LIKE '%${opsikataitem}%'`);
      }
    }

    // FUNGSI REGISTER
    if (register !== "XX") {
      kolom.push("a.register");
      group.push("a.register");
    }

    if (registerradio === "2" && register !== "XX") {
      kolom.push(
        "reg.nonpln,reg.kdvalas,reg.tglnpln,reg.kddonor,reg.kdkreditor,reg.nmdonor,reg.jmlpnrk,reg.closingdate"
      );
      query += ` LEFT JOIN dbref.t_register_${thang} reg ON a.register=reg.register`;
    }
    if (registerradio === "3" && register !== "XX") {
      kolom.pop("a.register");
      kolom.push(
        "reg.nonpln,reg.kdvalas,reg.tglnpln,reg.kddonor,reg.kdkreditor,reg.nmdonor,reg.jmlpnrk,reg.closingdate"
      );
      query += ` left join dbref.t_register_${thang} reg on a.register=reg.register`;
    }
    if (registerradio === "4") {
      kolom = [];
      query += ` `;
    }

    const nilaiawalregister = registerkondisi.split(",");
    const formatregister = nilaiawalregister.map((str) => `'${str}'`);
    const hasilFormatregister = formatregister.join(",");

    if (opsiregister === "pilihregister") {
      if (register !== "XX") {
        whereConditions.push(
          register && register !== "SEMUAREGISTER"
            ? `a.register = '${register}'`
            : ``
        );
      }
    } else if (opsiregister === "kondisiregister") {
      if (registerkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `  a.register NOT IN (${hasilFormatregister
            .replace(/[!'']/g, "")
            .split(",")
            .map((str) => `'${str}'`)
            .join(",")})`
        );
      } else {
        whereConditions.push(
          register !== "XX" ? ` a.register IN (${hasilFormatregister})` : ""
        );
      }
    } else if (opsiregister === "kataregister") {
      opsikataregister &&
        whereConditions.push(` a.register like '%${opsikataregister}%'`);
    }

    // FUNGSI KODE BLOKIR

    if (blokir !== "XX") {
      kolom.push("a.kdblokir,bl.nmblokir");
      group.push("a.kdblokir");
      query += ` LEFT JOIN dbref.t_blokir_${thang} bl on a.kdblokir=bl.kdblokir`;
    }

    if (blokirradio === "2") {
      kolom.push("bl.nmblokir");
      query += ` LEFT JOIN dbref.t_blokir_${thang} bl on a.kdblokir=bl.kdblokir`;
    }
    if (blokirradio === "3") {
      kolom.pop("a.kdblokir");
      kolom.push("bl.nmblokir");
      query += ` LEFT JOIN dbref.t_blokir_${thang} bl on a.kdblokir=bl.kdblokir`;
    }
    if (blokirradio === "4") {
      kolom = [];
      query += ` `;
    }

    if (blokir !== "XX") {
      whereConditions.push(
        blokir && blokir !== "00" ? `a.kdblokir = '${blokir}'` : ``
      );
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
    )}${defaultSelect} FROM ${tabel} ${query} ${finalWhereClause}  ${groupByClause}`;
  }

  // PEMANGGIAN FUNGSI SQL SECARA MENYELURUH

  let kolom = [];
  let group = [];
  let tabel = "";

  let dipadetil = "monev" + thang + ".m_detail_harian_" + thang + " a";
  let dipabiasa = "monev" + thang + ".m_detail_harian_part_" + thang + " a";
  if (
    soutput !== "XX" ||
    komponen !== "XX" ||
    subkomponen !== "XX" ||
    item !== "XX"
  ) {
    tabel = dipadetil;
  } else {
    tabel = dipabiasa;
  }

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
    akun,
    sdana,
    komponen,
    subkomponen,
    item,
    register
  );

  return sqlQuery;
};
