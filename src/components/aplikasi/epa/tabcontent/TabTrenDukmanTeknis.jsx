import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const TabTrenDukmanTeknis = () => {
  return (
    <div>
      <h2>Tab 'Tren Dukman/ Teknis'</h2>
      <p>
        Tab 'Tren Dukman/ Teknis' mengulas tren yang muncul dari data dukungan
        dan teknis yang ada.
      </p>

      {/* Grid untuk 4 kartu dengan 2 baris dan 2 kolom */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Card 1</Card.Title>
              <Card.Text>
                Isi kartu 1: Tren dukungan teknis terbaru di sektor A.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Card 2</Card.Title>
              <Card.Text>
                Isi kartu 2: Tren dukungan teknis terbaru di sektor B.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Card 3</Card.Title>
              <Card.Text>
                Isi kartu 3: Tren dukungan teknis terbaru di sektor C.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Card 4</Card.Title>
              <Card.Text>
                Isi kartu 4: Tren dukungan teknis terbaru di sektor D.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TabTrenDukmanTeknis;
