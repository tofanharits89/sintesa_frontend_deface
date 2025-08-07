import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "./components/layout/NotFound";
import Inquiry from "./components/aplikasi/inquiry/formInquiry";
import Rkakl from "./components/aplikasi/rkakl/formRkakl";
import Landing from "./components/aplikasi/profile/landing";
import Footer from "../src/components/layout/Footer";
import { MyContextProvider } from "./auth/Context";
import LoginNew from "../src/auth/Login2";
import "./App.css";
import Dashboard from "./components/aplikasi/dashboard/Dashboard";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import PrivateRoute from "./auth/PrivateRoute";
import MbgOnlyRoute from "./auth/MbgOnlyRoute";
import DetailSatker from "./components/aplikasi/carisatker/Detail";
import CekUserAktif from "./components/layout/CekUserAktif";
import { DataUsers } from "./components/aplikasi/users/dataUser";
import ProfileUser from "./components/aplikasi/users/profileUser";
import AddUser from "./components/aplikasi/users/registerUser";
import HalamanAdmin from "./auth/PrivatePage";
import Tematik from "./components/aplikasi/tematik/formTematik";
import Team from "./components/aplikasi/tentangkami/team";
import Log from "./components/aplikasi/tentangkami/changelog";
import Engine from "./components/aplikasi/tentangkami/engine";
import Developer from "./components/aplikasi/tentangkami/developer";
import Setting from "./components/aplikasi/setting/setting";
import Mode from "./components/aplikasi/notifikasi/Mode";
import InquiryBanos from "./components/aplikasi/bansos/formBansos";
import InquiryDeviasi from "./components/aplikasi/deviasi/formDeviasi";
import InquiryUptup from "./components/aplikasi/uptup/formUptup";
import Harmonisasi from "./components/aplikasi/harmonisasi/rekamdata";
import Tpid from "./components/aplikasi/permasalahan_tpid/rekamtpid";
import SelainKppn from "./auth/SelainKppn";
import DataDispensasi from "./components/aplikasi/dispensasi/datadispensasi";
import HanyaPusat from "./auth/HanyaPusat";
import DataKmk from "./components/aplikasi/dau/dataKmk";
import InquirySp2d from "./components/aplikasi/rowset_sp2d/formSp2d";
import DataReferensi from "./components/aplikasi/referensi/dataReferensi";
import RekamTransaksi from "./components/aplikasi/dau/Transaksi";
import DataKppn from "./components/aplikasi/uploadkppn/datakppn";
// import LaporanMonevStandalone from "./components/aplikasi/uploadkppn/LaporanMonevStandalone";
import SelainKanwil from "./auth/SelainKanwil";
import LandingKinerja from "./components/aplikasi/kinerja/landing";
import ExportPDF from "./components/aplikasi/kinerja/pdf/exportpdf";
import LandingKinerjaCluster from "./components/aplikasi/cluster/landing";
import InquiryRevisi from "./components/aplikasi/revisi/formRevisi";
import Notifikasi from "./components/notifikasi/landing";
import LandingSpending from "./components/aplikasi/spending/landing";
import InquirySpending from "./components/aplikasi/spending_query/formReview";
import Feedback from "./components/aplikasi/tentangkami/feedBack";
import Monitoring from "./components/aplikasi/spending/monitoring";
import Proyeksi from "./components/aplikasi/proyeksi/landing";
import LandingIku from "./components/aplikasi/iku/landing";
import InquiryPenerimaan from "./components/aplikasi/penerimaan/formPenerimaan";
import Offline from "./components/layout/Offline";
import OnlineMode from "./auth/OnlineMode";
import Subsidi from "./components/aplikasi/subsidi/dataSubsidi";
import HanyaAdmin from "./auth/HanyaAdmin";
import DataDispensasiKPPN from "./components/aplikasi/dispensasikppn/datadispensasikppn";
import InquiryKontrak from "./components/aplikasi/kontrak/formKontrak";
import DataWR from "./components/aplikasi/weekly_report/datawr";
import Chat from "./components/aplikasi/ai/chat";
import LandingBot from "./components/aplikasi/Bot/landing";
import TabChat from "./components/aplikasi/Bot/Tab";
import Bansos_dash from "./components/aplikasi/spasial/bansos_dash";
import MonitoringBlokir from "./components/aplikasi/monitoring_blokir/monitoringblokir";
import SftpMenu from "./components/aplikasi/sftp/getFtp";
import { TrackNadine } from "./components/aplikasi/nadine/landing";
import DataKmk25 from "./components/aplikasi/dau25/dataKmk25";
import RekamDataTransaksi25 from "./components/aplikasi/dau25/RekamDataTransaksi25";
import EpaTabs from "./components/aplikasi/epa/referensi/landing";
import MonevPnbp from "./components/aplikasi/monev_pnbp/monevpnbp";
import DashboardMbg from "./components/aplikasi/mbg/DashboardMbg";
import { TabKKMBG } from "./components/aplikasi/mbg/dataKanwil/TabKKMBG";
import LandingAnalisa from "./components/aplikasi/epa/analisa/landing";
import Login from "./components/layout/Login/Components/Pages/Auth/Login";
import LoginOne from "./components/layout/Login/Components/Pages/Auth/LoginOne";
import UpdateMbg from "./components/aplikasi/mbg/updateMBG";
import UpdateDataMbg from "./components/aplikasi/mbg/updateMBG";
import TabDataMbg from "./components/aplikasi/mbg/TabData";
import TabDashboard from "./components/aplikasi/mbg/TabDashboard";
import SocketProvider from "./auth/Socket";
import MyContext from "./auth/Context";
import LandingLogout from "./components/aplikasi/Landing_logout";
import BelanjaWilayah from "./components/aplikasi/belanja_kewilayahan/formWilayah";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  // console.log(InquiryKontrak);
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    const body = document.body;
    if (darkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <BrowserRouter>
        <MyContextProvider>
          <SocketProvider>
            {/* Route logout terpisah dan tidak terproteksi */}
            <Routes>
              <Route path="/v3/landing-logout" element={<LandingLogout />} />
              <Route path="/landing-logout" element={<LandingLogout />} />
            </Routes>

            <PrivateRoute>
              <CekUserAktif />
              <Header toggleMode={toggleMode} darkMode={darkMode} />
              <Sidebar darkMode={darkMode} />
            </PrivateRoute>
            <PrivateRoute>
              <Routes>
                <Route
                  index
                  element={
                    <MbgOnlyRoute>
                      <Dashboard />
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Notifikasi />
                    </MbgOnlyRoute>
                  }
                  path="/v3/notifikasi"
                />{" "}
                <Route
                  element={<TabDashboard darkMode={darkMode} />}
                  path="v3/landing/mbg"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Inquiry />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/belanja"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Rkakl />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/rkakl"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <InquiryKontrak />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/kontrak"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <InquiryBanos />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/bansos"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <InquiryUptup />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/uptup"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <InquiryDeviasi />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/deviasi"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Dashboard />
                    </MbgOnlyRoute>
                  }
                  path="/v3/landing/dashboard"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Landing />
                    </MbgOnlyRoute>
                  }
                  path="/v3/landing/profile"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <LandingKinerja />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                  path="v3/data/form/kinerja"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <Bansos_dash />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                  path="v3/data/form/bansos_dash"
                />
                <Route
                  element={
                    <HanyaAdmin>
                      <BelanjaWilayah />
                    </HanyaAdmin>
                  }
                  path="v3/belwil/update-data/"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <InquiryRevisi />
                    </MbgOnlyRoute>
                  }
                  path="v3/data/form/revisi"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <LandingKinerjaCluster />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                  path="v3/data/form/cluster"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <ExportPDF />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/kinerja/export"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <DetailSatker />
                    </MbgOnlyRoute>
                  }
                  path="/v3/Satker/Detail/:kdsatker"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <InquirySp2d />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                  path="/v3/rowset/form/sp2d"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Subsidi />
                    </MbgOnlyRoute>
                  }
                  path="/v3/rowset/"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <SftpMenu />
                    </MbgOnlyRoute>
                  }
                  path="/v3/connect-ftp"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <TrackNadine />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                  path="/v3/track/nadine"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <DataReferensi />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                  path="/v3/rowset/form/referensi"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <ProfileUser />
                    </MbgOnlyRoute>
                  }
                  path="/v3/profile/user"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <AddUser />
                    </MbgOnlyRoute>
                  }
                  path="/v3/admin/register/user"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Chat />
                    </MbgOnlyRoute>
                  }
                  path="/v3/ai/chat/"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Team />
                    </MbgOnlyRoute>
                  }
                  path="/v3/about/team/"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Log />
                    </MbgOnlyRoute>
                  }
                  path="/v3/about/changelog/"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Engine />
                    </MbgOnlyRoute>
                  }
                  path="/v3/about/engine/"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Developer />
                    </MbgOnlyRoute>
                  }
                  path="/v3/about/developer/beta"
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Feedback />
                    </MbgOnlyRoute>
                  }
                  path="/v3/about/feedback"
                />
                <Route
                  path="/v3/admin/users"
                  element={
                    <MbgOnlyRoute>
                      <HalamanAdmin>
                        <DataUsers />
                      </HalamanAdmin>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <Tematik />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/tematik"
                />
                <Route
                  path="/v3/admin/setting"
                  element={
                    <MbgOnlyRoute>
                      <HalamanAdmin>
                        <Setting />
                      </HalamanAdmin>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/chat/landing"
                  element={
                    <MbgOnlyRoute>
                      <HalamanAdmin>
                        <TabChat />
                      </HalamanAdmin>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/data/form/harmonisasi"
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <Harmonisasi />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/data/form/weekly_report"
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <DataWR />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/data/form/monitoring_blokir"
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <MonitoringBlokir />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/data/form/monev_pnbp"
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <MonevPnbp />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/mbg/kertas-kerja/"
                  element={
                    <SelainKppn>
                      <TabKKMBG />
                    </SelainKppn>
                  }
                />
                <Route
                  path="/v3/mbg/update-data/"
                  element={
                    <SelainKppn>
                      <TabDataMbg />
                    </SelainKppn>
                  }
                />
                <Route
                  path="/v3/data/form/tpid"
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <Tpid />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  element={
                    <MbgOnlyRoute>
                      <InquiryPenerimaan />
                    </MbgOnlyRoute>
                  }
                  path="/v3/data/form/penerimaan"
                />
                <Route
                  path="/v3/spending/alokasi"
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <LandingSpending darkMode={darkMode} />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                />{" "}
                <Route
                  path="/v3/spending/monitoring"
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <Monitoring darkMode={darkMode} />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                />{" "}
                <Route
                  path="/v3/spending/formalokasi"
                  element={
                    <MbgOnlyRoute>
                      <SelainKppn>
                        <InquirySpending darkMode={darkMode} />
                      </SelainKppn>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/data/form/dispensasi"
                  element={
                    <MbgOnlyRoute>
                      <DataDispensasi />
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/tkd/dau/kmk"
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <DataKmk darkMode={darkMode} />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/tkd/dau/transaksi"
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <RekamTransaksi />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/tkd/dau/kmk/2025"
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <DataKmk25 darkMode={darkMode} />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/tkd/dau/transaksi/2025"
                  element={
                    <MbgOnlyRoute>
                      <HanyaPusat>
                        <RekamDataTransaksi25 />
                      </HanyaPusat>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/tkd/kppn/upload"
                  element={
                    <MbgOnlyRoute>
                      <DataKppn />
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/tkd/iku/penilaian"
                  element={
                    <MbgOnlyRoute>
                      <LandingIku />
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/tkd/kppn/proyeksi"
                  element={
                    <MbgOnlyRoute>
                      <SelainKanwil>
                        <Proyeksi />
                      </SelainKanwil>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/data/form/dispensasi/kppn"
                  element={
                    <MbgOnlyRoute>
                      <DataDispensasiKPPN />
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/epa/landing"
                  element={
                    <MbgOnlyRoute>
                      <HanyaAdmin>
                        <HanyaPusat>
                          <EpaTabs darkMode={darkMode} />
                        </HanyaPusat>
                      </HanyaAdmin>
                    </MbgOnlyRoute>
                  }
                />
                <Route
                  path="/v3/epa/detail"
                  element={
                    <MbgOnlyRoute>
                      <HanyaAdmin>
                        <HanyaPusat>
                          <LandingAnalisa darkMode={darkMode} />
                        </HanyaPusat>
                      </HanyaAdmin>
                    </MbgOnlyRoute>
                  }
                />
                {/* Catch-all route untuk 404 - harus di akhir */}
                <Route
                  element={
                    <OnlineMode>
                      <NotFound />{" "}
                    </OnlineMode>
                  }
                  path="*"
                />
              </Routes>
            </PrivateRoute>
            <Routes>
              <Route path="/v3/auth/login" element={<LoginNew />} />
              {/* <Route path="/v3/auth/login" element={<LoginOne />} /> */}
              <Route path="/v3/offline" element={<Offline />} />
            </Routes>
            <Footer />
            <Mode />
          </SocketProvider>
        </MyContextProvider>
      </BrowserRouter>
    </div>
  );
}
