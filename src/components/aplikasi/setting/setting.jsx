import React, { useState, useContext, useEffect } from "react";
import MyContext from "../../../auth/Context";
import { Col, Row, Tab, Nav, Form, Button } from "react-bootstrap";
import "../users/users.css";
import NotifikasiSukses from "../notifikasi/notifsukses";
import { Loading2 } from "../../layout/LoadingTable";
import { handleHttpError } from "../notifikasi/toastError";
import { LogUser } from "./log_user";
import Log_menu from "./log_menu";
import UserOnline from "./user_online";
import Backend from "./backend";
import KirimNotifikasi from "./kirimNotifikasi";
import LastLogin from "./last_login";
import SocketProvider from "../../../auth/Socket";

export default function Setting() {
  const {
    axiosJWT,
    token,
    setMode,
    setTampil,
    setTampilverify,
    setSession,
    username,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [cek, setCek] = useState(false);
  const [formData, setFormData] = useState({
    mode: "0",
    opsitampilkan: true, // Set as a boolean, not a string
    opsitampilkanverify: true,
    status: "1",
    useraktif: "1",
    session: "1",
    captcha: "0",
    verify: "0",
  });

  useEffect(() => {
    refreshSetting();
    //console.log(formData);
  }, []);

  const refreshSetting = async () => {
    setLoading(true);

    try {
      const response = await axiosJWT.get(
        import.meta.env.VITE_REACT_APP_LOCAL_GETSETTING
          ? `${import.meta.env.VITE_REACT_APP_LOCAL_GETSETTING}`
          : "",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData({
        session: response.data.session || "1",
        captcha: response.data.capcay,
        verify: response.data.verify || "0",
        mode: response.data.mode || "0", // Set default if null
        status: response.data.status || "1", // Set default if null
        opsitampilkan: Boolean(response.data.tampil), // Convert to boolean
        opsitampilkanverify: Boolean(response.data.tampilverify), // Convert to boolean
      });
      setMode(response.data.mode);
      setTampil(Boolean(response.data.tampil));
      setTampilverify(Boolean(response.data.tampilverify));
      setSession(response.data.session);
      setLoading(false);
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked ? 1 : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.patch(
        import.meta.env.VITE_REACT_APP_LOCAL_SETTING,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMode(formData.mode);
      setTampil(Boolean(formData.opsitampilkan));
      setTampilverify(Boolean(formData.opsitampilkanverify));
      setSession(parseInt(formData.session, 10));
      NotifikasiSukses("Setting Berhasil Disimpan");
    } catch (error) {
      const { status, data } = error.response || {};
      handleHttpError(
        status,
        (data && data.error) ||
          "Terjadi Permasalahan Koneksi atau Server Backend"
      );
    }
  };

  const handleCek = () => {
    setCek(true);
    setTimeout(() => {
      setCek(false);
    }, 1000);
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Setting </h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">App</a>
            </li>
            {/* <li className="breadcrumb-item">Components</li> */}
            <li className="breadcrumb-item active">Config</li>
          </ol>
        </nav>
      </div>
      <section className="section profile fade-in">
        <Row>
          <Col xl={12}>
            <div className="card data-max-setting">
              <div className="card-body pt-0 m-2">
                <Tab.Container defaultActiveKey="profile-overview">
                  <Nav
                    variant="tabs"
                    className="nav-tabs-bordered sticky-user is-sticky-user mb-0"
                    role="tablist"
                  >
                    <Nav.Item className="profile-tab">
                      <Nav.Link eventKey="profile-overview" role="tab">
                        General
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="user-log"
                        role="tab"
                        onClick={handleCek}
                      >
                        Log User
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="menu-log"
                        role="tab"
                        onClick={handleCek}
                      >
                        Log Menu
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="user-online"
                        role="tab"
                        onClick={handleCek}
                      >
                        User Online
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="last-login"
                        role="tab"
                        onClick={handleCek}
                      >
                        Last Login
                      </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                      <Nav.Link
                        eventKey="backend"
                        role="tab"
                        onClick={handleCek}
                      >
                        Backend Monitor
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="notifikasi"
                        role="tab"
                        onClick={handleCek}
                      >
                        Broadcast
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content className="pt-2">
                    {loading ? (
                      <>
                        <Loading2 />
                        <br /> <Loading2 />
                        <br /> <Loading2 />
                      </>
                    ) : (
                      <Tab.Pane eventKey="profile-overview" role="tabpanel">
                        <Form onSubmit={handleSubmit}>
                          <div className="row mb-3 mt-2">
                            <Form.Label
                              htmlFor="mode"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Mode
                            </Form.Label>
                            <div className="col-md-8 col-lg-9 mt-2">
                              <Form.Check
                                type="radio"
                                name="mode"
                                value="0"
                                label="Development"
                                defaultChecked={formData.mode === "0"}
                                onChange={handleChange}
                              />
                              <Form.Check
                                type="radio"
                                name="mode"
                                value="1"
                                label="Production"
                                defaultChecked={formData.mode === "1"}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          {formData.mode === "0" && (
                            <div className="row mb-3 mt-2 fade-in">
                              <Form.Label
                                htmlFor="opsitampilkan"
                                className="col-md-4 col-lg-3 col-form-label"
                              ></Form.Label>
                              <div className="col-md-8 col-lg-9 mt-2">
                                <Form.Check
                                  type="checkbox"
                                  name="opsitampilkan"
                                  label="Tampilkan pesan ketika posisi Development"
                                  defaultChecked={formData.opsitampilkan}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          )}
                          <div className="row mb-3 mt-2">
                            <Form.Label
                              htmlFor="status"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Status Aplikasi
                            </Form.Label>
                            <div className="col-md-8 col-lg-9 mt-2">
                              <Form.Check
                                type="radio"
                                name="status"
                                value="1"
                                label="Online"
                                defaultChecked={formData.status === "1"}
                                onChange={handleChange}
                              />
                              <Form.Check
                                type="radio"
                                className="red-radio text-danger fw-bold"
                                name="status"
                                value="0"
                                label="Offline"
                                defaultChecked={formData.status === "0"}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row mb-3 mt-2">
                            <Form.Label
                              htmlFor="status"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              CAPTCHA
                            </Form.Label>
                            <div className="col-md-8 col-lg-9 mt-2">
                              <Form.Check
                                type="radio"
                                className="red-radio "
                                name="captcha"
                                value="0"
                                label="Default"
                                defaultChecked={formData.captcha === "0"}
                                onChange={handleChange}
                              />{" "}
                              <Form.Check
                                type="radio"
                                name="captcha"
                                value="1"
                                label="Google reCaptcha"
                                defaultChecked={formData.captcha === "1"}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row mb-3 mt-2">
                            <Form.Label
                              htmlFor="useraktif"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              User Akses
                            </Form.Label>
                            <div className="col-md-8 col-lg-9 mt-2">
                              <Form.Check
                                type="checkbox"
                                name="useraktif"
                                label="Hanya User Aktif yang diijinkan"
                                defaultChecked
                                disabled
                              />
                            </div>
                          </div>
                          <hr />
                          <div className="row mb-3 mt-2">
                            <Form.Label
                              htmlFor="mode"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              Verifikasi Akun
                            </Form.Label>
                            <div className="col-md-8 col-lg-9 mt-2">
                              <Form.Check
                                type="radio"
                                name="verify"
                                value="0"
                                label="Non Aktif"
                                defaultChecked={formData.verify === "0"}
                                onChange={handleChange}
                              />
                              <Form.Check
                                type="radio"
                                name="verify"
                                value="1"
                                label="Aktif"
                                defaultChecked={formData.verify === "1"}
                                onChange={handleChange}
                              />
                            </div>
                          </div>{" "}
                          {formData.verify === "1" && (
                            <div className="row mb-3 mt-2 fade-in">
                              <Form.Label
                                htmlFor="opsitampilkanverify"
                                className="col-md-4 col-lg-3 col-form-label"
                              ></Form.Label>
                              <div className="col-md-8 col-lg-9 mt-2">
                                <Form.Check
                                  type="checkbox"
                                  name="opsitampilkanverify"
                                  label="Tampilkan pesan ketika posisi belum aktif"
                                  defaultChecked={formData.opsitampilkanverify}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          )}
                          <hr />
                          <div className="row mb-3 mt-2">
                            <Form.Label
                              htmlFor="session"
                              className="col-md-4 col-lg-3 col-form-label"
                            >
                              User Session
                            </Form.Label>
                            <div className="col-md-8 col-lg-9 mt-2">
                              <Form.Check
                                type="checkbox"
                                name="session"
                                label="Single Session"
                                value={formData.session === "1" ? 1 : 0}
                                defaultChecked={formData.session === "1"}
                                onChange={handleChange}
                                // disabled
                              />
                            </div>
                          </div>
                          <div className="text-end">
                            <Button variant="danger" type="submit">
                              Simpan
                            </Button>
                          </div>
                        </Form>
                      </Tab.Pane>
                    )}

                    <Tab.Pane eventKey="user-log" role="tabpanel">
                      <LogUser cek={cek} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="menu-log" role="tabpanel">
                      <Log_menu cek={cek} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="user-online" role="tabpanel">
                      <UserOnline cek={cek} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="last-login" role="tabpanel">
                      <LastLogin cek={cek} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="backend" role="tabpanel">
                      <Backend cek={cek} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="notifikasi" role="tabpanel">
                      <KirimNotifikasi cek={cek} />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </main>
  );
}
