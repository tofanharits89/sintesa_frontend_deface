import React, {
  useState,
  useContext,
  useEffect,
  lazy,
  Suspense,
  startTransition,
} from "react";

import { Col, Row, Card, Image } from "react-bootstrap";
import "../profile/profile.css";
import Pilihan from "./pilihan";
import MyContext from "../../../auth/Context";
import numeral from "numeral";
import {
  getSQL,
  getSQLJenbel,
  getSQLProgram,
  getSqlBkpk,
  getSqlDukman,
  getSqlPerbandingan,
  getSqlRpd,
  getSqlSatker,
  getSqlTren,
  getSqlTrenJenbel,
  getSqlIkpa,
} from "./getSQL";
import { LoadingChart } from "../../layout/LoadingTable";
import Dukman from "../../chart/belanja/chartdukman";
import TrenJenbel from "../../chart/belanja/charttrenjenbel";
import Ikpa from "./Ikpa";
import { JumlahDipa } from "./hasilQuery";

// const Persen = lazy(() => import("./hasilQuery"));
const Jenbel = lazy(() => import("../../chart/belanja/chartjenbel"));
const Program = lazy(() => import("../../chart/belanja/chartprogram"));
const Perbandingan = lazy(() =>
  import("../../chart/belanja/chartperbandingan")
);
const Rpd = lazy(() => import("../../chart/belanja/chartrpd"));
const Satker = lazy(() => import("../../chart/belanja/chartsatker"));
const Tren = lazy(() => import("../../chart/belanja/charttren"));
const Bkpk = lazy(() => import("../../chart/belanja/chartbkpk"));

const Landing = () => {
  const [pilihan, setPilihan] = useState({
    thang: "2024",
    dept: "000",
    unit: "00",
    prov: "00",
  });
  const [kanwil, setKanwil] = useState("00");
  const handleInputChange = (id, value) => {
    if (id === "dept" && value === "000") {
      setPilihan((prevValues) => ({
        ...prevValues,
        unit: "00",
        [id]: value,
      }));
    } else {
      setPilihan((prevValues) => ({
        ...prevValues,
        [id]: value,
      }));
    }
  };

  useEffect(() => {
    startTransition(() => {
      generateSql();
      generateSqlJenbel();
      generateSqlProgram();
      generateSqlPerbandingan();
      generateSqlRpd();
      generateSqlSatker();
      generateSqlTren();
      generateSqlBkpk();
      generateSqlDukman();
      generateSqlTrenJenbel();
      generateSqlIkpa();
      setKanwil(pilihan.prov);
    });
  }, [pilihan]);

  const {
    role,
    persentase,
    kdkppn: kodekppn,
    kdkanwil: kodekanwil,
  } = useContext(MyContext);

  const [sql, setSql] = useState("");
  const [from] = useState("dashboard_v3.dipa_satker_rekap");
  const [select] = useState(
    " ,SUM(jml) jumlahdipa,SUM(pagu)/1000000000000 pagu,SUM(realisasi)/1000000000000 realisasi "
  );

  const [sqlJenbel, setSqlJenbel] = useState("");
  const [fromJenbel] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectJenbel] = useState(
    " ,left(kdbkpk,2) as jenbel,SUM(real1+ real2+ real3+ real4+ real5+ real6+ real7+ real8+ real9+ real10+ real11+ real12)/SUM(pagu)*100 persen  "
  );

  const [sqlPerbandingan, setSqlPerbandingan] = useState("");
  const [fromPerbandingan] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectPerbandingan] = useState(
    " ,thang,SUM(real1+ real2+ real3+ real4+ real5+ real6+ real7+ real8+ real9+ real10+ real11+ real12)/SUM(pagu)*100 persen"
  );

  const [sqlProgram, setSqlProgram] = useState("");
  const [fromProgram] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectProgram] = useState(
    " ,thang,kdprogram,SUM(real1+ real2+ real3+ real4+ real5+ real6+ real7+ real8+ real9+ real10+ real11+ real12)/1000000000000 realisasi  "
  );

  const [sqlRpd, setSqlRpd] = useState("");
  const [fromRpd] = useState("dashboard_v3.rencana_real_harian_output");
  const [selectRpd] = useState(
    ",thang, SUM(renc1)/1000000000000 renc1,SUM(real1)/1000000000000 real1,SUM(renc2)/1000000000000 renc2,SUM(real2)/1000000000000 real2,SUM(renc3)/1000000000000 renc3,SUM(real3)/1000000000000 real3,SUM(renc4)/1000000000000 renc4,SUM(real4)/1000000000000 real4,SUM(renc5)/1000000000000 renc5,SUM(real5)/1000000000000 real5,SUM(renc6)/1000000000000 renc6,SUM(real6)/1000000000000 real6,SUM(renc7)/1000000000000 renc7,SUM(real7)/1000000000000 real7,SUM(renc8)/1000000000000 renc8,SUM(real8)/1000000000000 real8,SUM(renc9)/1000000000000 renc9,SUM(real9)/1000000000000 real9,SUM(renc10)/1000000000000 renc10,SUM(real10)/1000000000000 real10,SUM(renc11)/1000000000000 renc10,SUM(real11)/1000000000000 real11,SUM(renc12)/1000000000000 renc12,SUM(real12)/1000000000000 real12,SUM(renc1) / SUM(real1) AS persen1,  SUM(renc2) / SUM(real2) AS persen2,  SUM(renc3) / SUM(real3) AS persen3,  SUM(renc4) / SUM(real4) AS persen4,  SUM(renc5) / SUM(real5) AS persen5,  SUM(renc6) / SUM(real6) AS persen6,  SUM(renc7) / SUM(real7) AS persen7,  SUM(renc8) / SUM(real8) AS persen8,  SUM(renc9) / SUM(real9) AS persen9,  SUM(renc10) / SUM(real10) AS persen10,  SUM(renc11) / SUM(real11) AS persen11,  SUM(renc12) / SUM(real12) AS persen12"
  );

  const [sqlSatker, setSqlSatker] = useState("");
  const [fromSatker] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectSatker] = useState(
    ",thang, kdsatker,SUM(real1+ real2+ real3+ real4+ real5+ real6+ real7+ real8+ real9+ real10+ real11+ real12)/1000000000000 realisasi"
  );

  const [sqlTren, setSqlTren] = useState("");
  const [fromTren] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectTren] = useState(
    " ,thang,SUM(real1)/SUM(pagu)*100 jan,SUM(real2)/SUM(pagu)*100 feb,SUM(real3)/SUM(pagu)*100 mar,SUM(real4)/SUM(pagu)*100 apr,SUM(real5)/SUM(pagu)*100 mei,SUM(real6)/SUM(pagu)*100 jun,SUM(real7)/SUM(pagu)*100 jul,SUM(real8)/SUM(pagu)*100 agt,SUM(real9)/SUM(pagu)*100 sep,SUM(real10)/SUM(pagu)*100 okt,SUM(real11)/SUM(pagu)*100 nov,SUM(real12)/SUM(pagu)*100 des"
  );

  const [sqlBkpk, setSqlBkpk] = useState("");
  const [fromBkpk] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectBkpk] = useState(
    ",thang, kdbkpk,SUM(real1+ real2+ real3+ real4+ real5+ real6+ real7+ real8+ real9+ real10+ real11+ real12)/1000000000 realisasi"
  );

  const [sqlDukman, setSqlDukman] = useState("");
  const [fromDukman] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectDukman] = useState(
    ",'pagu_teknis' AS jenis_pagu,SUM(CASE WHEN kdprogram = 'WA' THEN pagu ELSE 0 END) / SUM(pagu)*100 AS nilai_pagu "
  );

  const [sqlTrenJenbel, setSqlTrenJenbel] = useState("");
  const [fromTrenJenbel] = useState("dashboard_v3.pagu_real_dashboard");
  const [selectTrenJenbel] = useState(
    ",left(kdbkpk,2) kdjenbel,SUM(pagu) AS pagu_per_jenbel,(SUM(pagu) / total.total_pagu) * 100 AS persentase_pagu "
  );

  const [sqlIkpa, setSqlIkpa] = useState("");
  const [fromIkpa] = useState("");
  const [selectIkpa] = useState(" ");

  const input = pilihan.dept;
  const parts = input.split("//");
  const number = parts[0];
  const text = parts[1];

  const generateSql = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      select,
      from,
    };

    getSQL(queryParams);
    const query = getSQL(queryParams);
    setSql(query);
  };
  const generateSqlJenbel = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectJenbel,
      fromJenbel,
    };

    getSQLJenbel(queryParams);
    const queryJenbel = getSQLJenbel(queryParams);
    setSqlJenbel(queryJenbel);
  };

  const generateSqlProgram = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectProgram,
      fromProgram,
    };

    getSQLProgram(queryParams);
    const queryProgram = getSQLProgram(queryParams);
    setSqlProgram(queryProgram);
  };

  const generateSqlPerbandingan = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectPerbandingan,
      fromPerbandingan,
    };

    getSqlPerbandingan(queryParams);
    const queryPerbandingan = getSqlPerbandingan(queryParams);
    setSqlPerbandingan(queryPerbandingan);
  };

  const generateSqlRpd = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectRpd,
      fromRpd,
    };

    getSqlRpd(queryParams);
    const queryRpd = getSqlRpd(queryParams);
    setSqlRpd(queryRpd);
  };

  const generateSqlSatker = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectSatker,
      fromSatker,
    };

    getSqlSatker(queryParams);
    const querySatker = getSqlSatker(queryParams);
    setSqlSatker(querySatker);
  };

  const generateSqlTren = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectTren,
      fromTren,
    };

    getSqlTren(queryParams);
    const queryTren = getSqlTren(queryParams);
    setSqlTren(queryTren);
  };

  const generateSqlBkpk = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectBkpk,
      fromBkpk,
    };

    getSqlBkpk(queryParams);
    const queryBkpk = getSqlBkpk(queryParams);
    setSqlBkpk(queryBkpk);
  };

  const generateSqlDukman = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectDukman,
      fromDukman,
    };

    getSqlDukman(queryParams);
    const queryDukman = getSqlDukman(queryParams);
    setSqlDukman(queryDukman);
  };

  const generateSqlTrenJenbel = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectTrenJenbel,
      fromTrenJenbel,
    };

    getSqlTrenJenbel(queryParams);
    const queryTrenJenbel = getSqlTrenJenbel(queryParams);
    setSqlTrenJenbel(queryTrenJenbel);
  };

  const generateSqlIkpa = () => {
    const queryParams = {
      thang: pilihan.thang,
      dept: number,
      unit: pilihan.unit,
      prov: pilihan.prov,
      kodekppn,
      kodekanwil,
      role,
      selectIkpa,
      fromIkpa,
    };

    getSqlIkpa(queryParams);
    const queryIkpa = getSqlIkpa(queryParams);
    setSqlIkpa(queryIkpa);
  };

  return (
    <main id="main" className="main img">
      <div className="pagetitle ">
        <h1>Dashboard Kementerian/ Lembaga</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Dashboard</a>
            </li>
            <li className="breadcrumb-item active">K/L</li>
          </ol>
        </nav>
      </div>
      <section className="section dashboard">
        <Pilihan onInputChange={handleInputChange} />
        <div className="row align-items-top">
          <div className="content-profile">
            <Row>
              <Col xs={12} md={6} lg={6} xl={3}>
                <Card className="card-profile">
                  <Card.Body>
                    <div className="card-content">
                      <h6>
                        {number === "000"
                          ? "SEMUA KEMENTERIAN/ LEMBAGA"
                          : `BA - ${number}`}
                        <br />
                        {text && text.length > 30
                          ? `${text.substring(0, 30)}...`
                          : text}
                      </h6>
                      <div className="image-container ">
                        <Image
                          src={
                            pilihan.dept !== "000"
                              ? `/logo/${number}.png`
                              : "/logo/indo.gif"
                          }
                          alt={`${number}`}
                          className="fade-in"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "/logo/null.png"; // Path to fallback image
                          }}
                        />
                      </div>
                    </div>
                    <hr className="garis-dipa" />
                    <div
                      className="item-dipa fade-in"
                      style={{
                        bottom: "0",
                      }}
                    >
                      PERSENTASE <br />
                      {persentase} %
                      {/* <div
                        className="subitem-dipa "
                        style={{
                          position: "absolute",
                          bottom: "0",
                          margin: "20px",
                          textAlign: "center",
                        }}
                      >
                        PERSENTASE <br />
                        {persentase} %
                      </div> */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={6} xl={3}>
                <Card className=" card-profile">
                  <Card.Body>
                    <JumlahDipa query={sql} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={12} lg={12} xl={6}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className="card-profile">
                    <Card.Body>
                      <Perbandingan query={sqlPerbandingan} />
                    </Card.Body>
                  </Card>
                </Suspense>
              </Col>
              <Col xs={12} md={12} lg={6} xl={3}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    <Card.Body>
                      <Jenbel query={sqlJenbel} />
                    </Card.Body>
                  </Card>
                </Suspense>
              </Col>
              <Col xs={12} md={6} lg={6} xl={3}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    <Bkpk query={sqlBkpk} />
                  </Card>
                </Suspense>
              </Col>
              <Col xs={12} md={12} lg={6} xl={6}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    <Card.Body>
                      <Program query={sqlProgram} />
                    </Card.Body>
                  </Card>
                </Suspense>
              </Col>
              <Col xs={12} md={6} lg={6} xl={3}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    <Satker query={sqlSatker} />
                  </Card>
                </Suspense>
              </Col>
              <Col xs={12} md={12} lg={12} xl={5}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    <Tren query={sqlTren} />
                  </Card>
                </Suspense>
              </Col>
              <Col xs={12} md={12} lg={12} xl={4}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    <Card.Body>
                      <div className="mb-2">
                        Porsi Total Alokasi 3 Tahun Terakhir
                      </div>
                      <div className="dual-charts-container">
                        <div className="chart">
                          <Dukman query={sqlDukman} />
                        </div>

                        <div className="chart">
                          <TrenJenbel query={sqlTrenJenbel} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Suspense>
              </Col>
            </Row>

            <Row className="batas-bawah">
              <Col xs={12} md={12} lg={12} xl={6}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    {/* {sqlIkpa} */}
                    <Ikpa query={sqlIkpa} kanwil={kanwil} />
                  </Card>
                </Suspense>
              </Col>
              <Col xs={12} md={12} lg={12} xl={6}>
                <Suspense fallback={<LoadingChart />}>
                  <Card className=" card-profile">
                    <Card.Body>
                      <Rpd query={sqlRpd} />
                    </Card.Body>
                  </Card>
                </Suspense>
              </Col>
            </Row>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
