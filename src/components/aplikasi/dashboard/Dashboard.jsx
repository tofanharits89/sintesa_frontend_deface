import React, { useContext } from "react";
import MyContext from "../../../auth/Context";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { statusLogin } = useContext(MyContext);
  const navigate = useNavigate(); // Perhatikan penambahan tanda kurung () di sini

  // useEffect(() => {
  //   if (statusLogin) {
  //     navigate("/v3/landing/profile");
  //   }
  // }, [statusLogin]);

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">v3</a>
            </li>
            {/* <li className="breadcrumb-item">Components</li> */}
            <li className="breadcrumb-item active">Home</li>
          </ol>
        </nav>
      </div>
      <section className="section dashboard team"></section>
    </main>
  );
};

export default Dashboard;
