import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import {
  Col,
  Row,
  Tab,
  Nav,
  Image,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "../users/users.css";
import EditProfile from "./editProfile";
import UbahPassword from "./ubahPassword";
import DataQuery from "./dataQuery";
import { Loading2 } from "../../layout/LoadingTable";
import { handleHttpError } from "../notifikasi/toastError";
import moment from "moment";
import GetLokasiMap from "../lokasi/getLokasiMap";
import VerifikasiAkun from "./verifikasiAkun";

export default function ProfileUser() {
  const { role, nmrole, axiosJWT, token, iduser, setUrl } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [cek, setCek] = useState(0); // Inisialisasi dengan 0 atau nilai lainnya
  const [dataerror, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile-overview");

  // Function to fetch user data
  const refreshUser = async () => {
    setLoading(true);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_GETUSER
          ? `${
              import.meta.env.VITE_REACT_APP_LOCAL_GETUSER
            }?id=${iduser}&token=${token}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setUrl(response.data.url);

      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );

      setLoading(false);
    }
  };

  // Fetch data when the component mounts and when iduser changes
  useEffect(() => {
    iduser && refreshUser();
  }, [iduser]);

  // Function to handle tab change
  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);

    // Change cek value when "query" tab is selected
    if (tabKey === "query") {
      setCek((prevCek) => prevCek + 1); // Increment cek value
    }
  };

  // Fetch data when the active tab changes
  useEffect(() => {
    refreshUser();
  }, [activeTab]);
  // console.log(cek, activeTab);

  return (
    <div>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Profile User </h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Profile</a>
              </li>
              <li className="breadcrumb-item active">User</li>
            </ol>
          </nav>
        </div>
        <section className="section profile fade-in">
          <Row>
            <Col xl={4}>
              <div className="card ">
                <div className="card-body profile-card profile-user pt-4 d-flex flex-column align-items-center m-2">
                  <div className="corner-icon-user top-left-user">
                    <i className="bi bi-exclude"></i>
                  </div>
                  {loading ? (
                    <>
                      <Loading2 />
                      <br /> <Loading2 />
                    </>
                  ) : (
                    <>
                      <Image
                        src={data.url ? data.url : "/foto/null.png"}
                        className="rounded-circle fade-in"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = "/foto/null.png"; // Path to fallback image
                        }}
                      />
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <h5>
                          {data.name}{" "}
                          {data.verified === "TRUE" && (
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip id="tooltip-verified">
                                  Akun terverifikasi
                                </Tooltip>
                              }
                            >
                              <i className="text-success bi bi-person-check-fill verified"></i>
                            </OverlayTrigger>
                          )}
                        </h5>{" "}
                      </div>
                      <h3>{nmrole}</h3>
                      <h1 className="mb-4">
                        {role === "X" ? (
                          <>
                            <i className="bi bi-emoji-sunglasses text-danger"></i>
                          </>
                        ) : (
                          <i className="bi bi-emoji-laughing text-success"></i>
                        )}
                      </h1>{" "}
                    </>
                  )}
                </div>
              </div>
            </Col>

            <Col xl={8}>
              <div className="card">
                <div className="card-body profile-user pt-0 m-2">
                  <Tab.Container
                    defaultActiveKey="profile-overview"
                    onSelect={handleTabSelect}
                  >
                    <Nav
                      variant="tabs"
                      className="nav-tabs-bordered sticky-user is-sticky-user mb-0"
                      role="tablist"
                    >
                      <Nav.Item className="profile-tab">
                        <Nav.Link eventKey="profile-overview" role="tab">
                          Overview
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="profile-tab">
                        <Nav.Link eventKey="verifikasiakun" role="tab">
                          Verifikasi Akun
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="profile-lokasi" role="tab">
                          Lokasi
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="profile-edit" role="tab">
                          Profile
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="ubahpassword" role="tab">
                          Ubah Password
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="query"
                          role="tab"
                          onClick={() => handleTabSelect("query")}
                        >
                          Query Data
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content className="pt-2">
                      {loading ? (
                        <Loading2 />
                      ) : (
                        <Tab.Pane eventKey="profile-overview" role="tabpanel">
                          <h5 className="card-title">Nama</h5>
                          <p className="small fst-italic">{data.name}</p>

                          <h5 className="card-title">Profile Pengguna</h5>

                          <Row>
                            <Col lg={3} md={4} className="label">
                              LIMITASI K/L
                            </Col>
                            <Col lg={9} md={8}>
                              {data.dept_limit}
                            </Col>
                          </Row>

                          <Row>
                            <Col lg={3} md={4} className="label">
                              Telepon
                            </Col>
                            <Col lg={9} md={8}>
                              {data.telp}
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={3} md={4} className="label">
                              Email
                            </Col>
                            <Col lg={9} md={8}>
                              {data.email}
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={3} md={4} className="label">
                              Status
                            </Col>
                            <Col lg={9} md={8}>
                              {data.active === "1" ? (
                                <i className="bi bi-record-fill text-success"></i>
                              ) : (
                                <i className="bi bi-record-fill text-danger"></i>
                              )}
                            </Col>
                          </Row>

                          <Row>
                            <Col lg={3} md={4} className="label">
                              Login
                            </Col>
                            <Col lg={9} md={8}>
                              {data &&
                                data.log_users &&
                                data.log_users.map((item) => (
                                  <span key={item.id}>
                                    {moment(item.date_login).format(
                                      "DD-MM-YYYY HH:mm:ss"
                                    )}
                                    <br />
                                  </span>
                                ))}
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={3} md={4} className="label">
                              IP
                            </Col>
                            <Col lg={9} md={8}>
                              {data &&
                                data.log_users &&
                                data.log_users.map((item) =>
                                  item.ip.replace("::ffff:", "")
                                )}
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={3} md={4} className="label">
                              Browser
                            </Col>
                            <Col lg={9} md={8}>
                              {data &&
                                data.log_users &&
                                data.log_users.map((item) => item.browser)}
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={3} md={4} className="label">
                              Platform
                            </Col>
                            <Col lg={9} md={8}>
                              {data &&
                                data.log_users &&
                                data.log_users.map((item) => item.platform)}
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={3} md={4} className="label">
                              Verifikasi
                            </Col>
                            <Col lg={9} md={8}>
                              {data.verified === "TRUE" ? (
                                <>
                                  Sudah Verifikasi{" "}
                                  <i className="text-success bi bi-person-check-fill mx-2"></i>
                                </>
                              ) : (
                                "Belum Verifikasi"
                              )}
                            </Col>
                          </Row>
                        </Tab.Pane>
                      )}
                      <EditProfile
                        name={data.name}
                        id={data.id}
                        email={data.email}
                        telp={data.telp}
                        url={data.url}
                      />
                      <Tab.Pane eventKey="verifikasiakun" role="tabpanel">
                        <VerifikasiAkun
                          cek={activeTab}
                          telp={data.telp}
                          status={data.verified}
                          pin={data.pin}
                        />
                      </Tab.Pane>
                      <UbahPassword id={data.id} />
                      <Tab.Pane eventKey="profile-lokasi" role="tabpanel">
                        <GetLokasiMap />
                      </Tab.Pane>
                      <Tab.Pane eventKey="query" role="tabpanel">
                        <DataQuery cek={cek} />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </main>
    </div>
  );
}
