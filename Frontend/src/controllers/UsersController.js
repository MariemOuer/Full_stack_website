import { useState } from "react";
import { UserModel } from "../models/UserModel";

export const useUsersController = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await UserModel.fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  return {
    users,
    fetchUsers,
  };
};
