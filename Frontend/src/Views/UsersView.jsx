import React, { useEffect } from "react";
import { useUsersController } from "../controllers/UsersController";

const UsersView = () => {
  const { users, fetchUsers } = useUsersController();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              ID: {user.id}, Name: {user.name}, Age: {user.age}
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: "20px" }}>
        <button onClick={fetchUsers}>Refresh Users</button>
      </div>
    </div>
  );
};

export default UsersView;
