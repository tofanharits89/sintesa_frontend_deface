import React, { useContext } from "react";
import MyContext from "./Context";
import { Spinner, Container } from "react-bootstrap"; // Import the Spinner component

const CekLogin = () => {
  const { statusLogin } = useContext(MyContext);

  if (!statusLogin) {
    return null;
  }

  return (
    <section className="section dashboard team">
      <div className="corner-icon top-left">
        <i className="bi bi-exclude"></i>
      </div>
      <div className="corner-icon top-right">
        <i className="bi bi-exclude"></i>
      </div>

      {/* {statusLogin && loggedinUsers2 && <Online message="newUser" />} */}
      {/* {statusLogin && (
        <ListGroup style={{ height: "500px" }}>
          {loggedinUsers.map((username, index) => (
            <ListGroup.Item key={index}>{username}</ListGroup.Item>
          ))}
        </ListGroup>
      )} */}

      <Container>
        <div className="spinner-container text-center">
          <div className="my-2">
            <Spinner variant="secondary" animation="border" role="status" />
          </div>
          <div>
            <a href="#" className="d-flex align-items-center">
              <i
                className="bi bi-exclude text-secondary"
                style={{
                  fontSize: "30px",
                  fontWeight: "normal",
                  margin: "8px",
                }}
              ></i>
              <span
                className="d-none d-md-block text-secondary mx-2"
                style={{ fontWeight: "normal", fontSize: "30px" }}
              >
                sintesa
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CekLogin;
