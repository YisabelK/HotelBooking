import React from "react";
import "./pagination.css";
import Button from "../../utils/Button";
const Pagination = ({ roomsPerPage, totalRooms, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRooms / roomsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-nav">
      <ul className="pagination-ul">
        {pageNumbers.map((number) => (
          <li key={number} className="pagination-li">
            <Button
              onClick={() => paginate(number)}
              className={`pagination-button ${
                currentPage === number ? "current-page" : ""
              }`}
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
