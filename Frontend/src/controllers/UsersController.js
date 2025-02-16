import { useState } from "react";
import { apiService } from "../services/ApiService";

export const useUsersController = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      // GET /db-test => returns an array of user objects
      const response = await apiService.get("/db-test");
      // e.g. response.data => [ { id:1, name:'Alice', age:25 }, ... ]
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  return {
    users,
    fetchUsers,
  };
};
