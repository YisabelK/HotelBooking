import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import "./allUsersPage.css";
import Loading from "../../utils/Loading";
import Modal from "../../utils/Modal";
const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getAllUsers();
        const allUsers = response.userList || [];
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <Loading message="Loading users..." />;
  }

  if (error) {
    return <Modal type="error" message={error} onClose={() => setError("")} />;
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="all-users">
      <h2>All Users</h2>
      <h3>We have {users.length} Users</h3>
      <div className="users-list">
        {currentUsers && currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phoneNumber}</p>
                <p>Role: {user.role}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
      {filteredUsers.length > 0 && (
        <Pagination
          itemsPerPage={usersPerPage}
          totalItems={filteredUsers.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      )}
    </div>
  );
};

export default AllUsersPage;
