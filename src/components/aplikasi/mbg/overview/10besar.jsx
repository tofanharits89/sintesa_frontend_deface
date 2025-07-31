import React, { useState } from "react";
import { Card, Badge, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import numeral from "numeral";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const SepuluhBesar = ({ data, darkMode }) => {
  const safeData = Array.isArray(data) ? data : [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(safeData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = safeData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={`mt-4 mb-0 ${darkMode ? "bg-dark text-light" : ""}`}>
      {currentData.map((item, idx) => (
        <motion.div
          key={idx}
          style={{ marginBottom: "4px" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
        >
          <Card
            className={`shadow-sm border card-hover hover-shadow mt-3 ${
              darkMode ? "bg-dark text-light " : "bg-light border-light"
            }`}
            style={{
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              width: "100%",
              marginBottom: "0px",
            }}
          >
            <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-1 py-1 px-2">
              <div className="d-flex align-items-center">
                <Card.Title className="mb-0 p-0 text-end">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{item.provinsi}</Tooltip>}
                  >
                    <h6
                      style={{
                        fontSize: "0.85em",
                        margin: 0,
                        padding: 0,
                        color: darkMode ? "white" : "black",
                      }}
                    >
                      {item.provinsi.slice(0, 15)}
                    </h6>
                  </OverlayTrigger>
                </Card.Title>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant={darkMode ? "secondary" : "light"}
                  size="sm"
                  className="mb-0 p-1"
                >
                  <h6
                    style={{
                      fontSize: "1em",
                      margin: 0,
                      padding: 0,
                      fontWeight: "bold",
                    }}
                  >
                    {numeral(item.penerimasppg).format("0,0")}{" "}
                    <Badge
                      bg="danger"
                      text="light"
                      className="fw-bold mx-2"
                      style={{ fontSize: "0.8em" }}
                    >
                      {numeral(item.persen_penerima).format("0,0")}%
                    </Badge>
                  </h6>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      ))}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-0">
        <Button
          variant={darkMode ? "outline-light" : "outline-primary"}
          size="sm"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <i className="bi bi-chevron-left" />
        </Button>
        <span className={`small ${darkMode ? "text-light" : "text-muted"}`}>
          Halaman {currentPage} dari {totalPages}
        </span>
        <Button
          variant={darkMode ? "outline-light" : "outline-primary"}
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <i className="bi bi-chevron-right" />
        </Button>
      </div>
    </div>
  );
};

export default SepuluhBesar;
