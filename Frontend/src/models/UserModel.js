import { apiService } from "../services/ApiService";

export const UserModel = {
  fetchUsers: async () => {
    // GET /db-test => returns an array of user objects
    const response = await apiService.get("/db-test");
    return response.data;
  },
};
