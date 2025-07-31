import React from "react";

const LandingPage = () => {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light " id="mainNav">
        <div className="container px-4 px-lg-5">
          <a className="navbar-brand" href="#page-top">
            Start Bootstrap
          </a>
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#projects">
                  Projects
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#signup">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Masthead */}
      <header className="masthead">
        <div className="container px-4 px-lg-5 d-flex h-100 align-items-center justify-content-center">
          <div className="d-flex justify-content-center">
            <div className="text-center">
              <h1 className="mx-auto my-0 text-uppercase">Grayscale</h1>
              <h2 className="text-white-50 mx-auto mt-2 mb-5">
                A free, responsive, one page Bootstrap theme created by Start
                Bootstrap.
              </h2>
              <a className="btn btn-primary" href="#about">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* About */}
      <section className="about-section text-center" id="about">
        {/* ... (sesuaikan dengan bagian About) */}
      </section>

      {/* Projects */}
      <section className="projects-section bg-light" id="projects">
        {/* ... (sesuaikan dengan bagian Projects) */}
      </section>

      {/* Signup */}
      <section className="signup-section" id="signup">
        {/* ... (sesuaikan dengan bagian Signup) */}
      </section>

      {/* Contact */}
      <section className="contact-section bg-black">
        {/* ... (sesuaikan dengan bagian Contact) */}
      </section>

      {/* Footer */}
      <footer className="footer bg-black small text-center text-white-50">
        <div className="container px-4 px-lg-5">
          Copyright &copy; Your Website 2023
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
