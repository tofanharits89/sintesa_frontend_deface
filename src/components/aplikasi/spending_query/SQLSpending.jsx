export const getSQLSpending = (queryParams) => {
  const {
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
    efisiensiradio,
  } = queryParams;

  // KONDISI AWAL
  let query = "";
  let groupByClause = "";
  let whereConditions = [];
  let defaultSelect = `   `;

  // FUNGSI GENERATE SQL
  function buatQuery() {
    // FUNGSI SELECT

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

    // console.log(panjangAkun);

    if (opsiakun === "kondisiakun") {
      if (akunkondisi.substring(0, 1) === "!") {
        whereConditions.push(
          `${akun === "AKUN"
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
          `${akun === "AKUN"
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

    if (thang === "2025" && jenlap === "1") {
      // JENIS EFISIENSI
      if (jenis_efisiensi !== "XX") {
        kolom.push("(CASE WHEN A.JENIS_EFISIENSI = 0 THEN 'Volume/Harga Satuan' ELSE 'Persentase' END) AS JENIS_EFISIENSI");
        // group.push(" A.JENIS_EFISIENSI");
        whereConditions.push(jenis_efisiensi && `A.JENIS_EFISIENSI IS NOT NULL`);
      }

      if (efisiensiradio === "2") {
        kolom.push("(CASE WHEN A.JENIS_EFISIENSI = 0 THEN 'Volume/Harga Satuan' ELSE 'Persentase' END) AS NAMA_JENIS_EFISIENSI");
        // query +=
        //   "   LEFT JOIN DBREF.REF_STUNTING_INTERVENSI STUN ON A.STUN_INTERVENSI=STUN.STUN_INTERVENSI";
      }
      if (efisiensiradio === "3") {
        kolom.pop(" A.JENIS_EFISIENSI");
        kolom.push("(CASE WHEN A.JENIS_EFISIENSI = 0 THEN 'Volume/Harga Satuan' ELSE 'Persentase' END) AS NAMA_JENIS_EFISIENSI");
        // query +=
        //   "   LEFT JOIN DBREF.REF_STUNTING_INTERVENSI STUN ON A.STUN_INTERVENSI=STUN.STUN_INTERVENSI ";
      }
      if (efisiensiradio === "4") {
        kolom = [];
        query += ` `;
      }
      if (jenlap === "1" && jenis_efisiensi !== "00") {
        whereConditions.push(
          jenis_efisiensi && jenis_efisiensi !== "00" ? `A.JENIS_EFISIENSI = '${jenis_efisiensi}'` : ` `
        );
      }
    }
    // console.log(jenis_efisiensi);
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

    // whereConditions = whereConditions.filter(
    //   (condition) => condition.trim() !== ""
    // );
    whereConditions = whereConditions.filter(
      (condition) => typeof condition === "string" && condition.trim() !== ""
    );

    const hasWhereClause = whereConditions.length > 0;

    let limitakses = "";
    let limitaksesall = "";
    let kdreview = "";

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

    if (role !== "2") {
      if (jenlap === "1" && !hasWhereClause) {
        kdreview = "where a.kdreview='1'";
      } else if (jenlap === "2" && !hasWhereClause) {
        kdreview = "where a.kdreview='2'";
      } else if (jenlap === "4" && !hasWhereClause) {
        kdreview = "where a.kdreview='4'";
      } else if (jenlap === "1" && hasWhereClause) {
        kdreview = "and a.kdreview='1'";
      } else if (jenlap === "2" && hasWhereClause) {
        kdreview = "and a.kdreview='2'";
      } else if (jenlap === "4" && hasWhereClause) {
        kdreview = "and a.kdreview='4'";
      } else {
        kdreview = "";
      }
    }
    if (role === "2") {
      if (jenlap === "1" && !hasWhereClause) {
        kdreview = "and a.kdreview='1'";
      } else if (jenlap === "2" && !hasWhereClause) {
        kdreview = "and a.kdreview='2'";
      } else if (jenlap === "4" && !hasWhereClause) {
        kdreview = "and a.kdreview='4'";
      } else if (jenlap === "1" && hasWhereClause) {
        kdreview = "and a.kdreview='1'";
      } else if (jenlap === "2" && hasWhereClause) {
        kdreview = "and a.kdreview='2'";
      } else if (jenlap === "4" && hasWhereClause) {
        kdreview = "and a.kdreview='4'";
      } else {
        kdreview = "";
      }
    }
    let syarat = "";
    if (jenlap === "1") {
      syarat = "where";
    } else if (jenlap === "2") {
      syarat = "where";
    } else {
      syarat = "";
    }

    const whereClause = hasWhereClause
      ? ` WHERE  ${whereConditions.join(" AND ")} ${limitakses}`
      : limitaksesall;
    let kondisi = whereClause === "" ? "" : `${syarat}`;
    const finalWhereClause =
      whereConditions.length === 1
        ? ` WHERE  ${whereConditions[0]} ${limitakses} ${kdreview} `
        : `${whereClause}   ${kdreview} `;
    // console.log(
    //   `SELECT  (CASE WHEN a.kdreview = 1 THEN 'Inefisiensi' ELSE 'Einmaligh' END) AS JNS_REVIEW , ${kolom.join(
    //     ","
    //   )}${select} FROM ${from} ${query} ${finalWhereClause} `
    // );
    // console.log(alasan, alasankondisipilih);
    let sebab = alasan ? "SEBAB ," : "";

    return `SELECT  (CASE WHEN a.kdreview = 1 THEN 'Inefisiensi'
    WHEN a.kdreview = 2 THEN 'Administrasi'
    ELSE 'Einmalig' END) AS JNS_REVIEW ,${sebab} ${kolom.join(
      ","
    )}${select} FROM ${from} ${query} ${finalWhereClause} `;
  }

  // PEMANGGIAN FUNGSI SQL SECARA MENYELURUH

  let kolom = [];
  let group = [];

  const sqlQuery = buatQuery(kolom, dept, kdunit, satker);

  return sqlQuery;
};
