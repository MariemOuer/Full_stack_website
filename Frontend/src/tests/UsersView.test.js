import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UsersView from "../views/UsersView";
import { useUsersController } from "../controllers/UsersController";
import "@testing-library/jest-dom";

jest.mock("../controllers/UsersController", () => ({
  useUsersController: jest.fn(),
}));

describe("UsersView", () => {
  beforeEach(() => {
    useUsersController.mockReset();
  });

  it("renders 'No users found' when there are no users", () => {
    useUsersController.mockReturnValue({
      users: [],
      fetchUsers: jest.fn(),
    });

    render(<UsersView />);

    expect(screen.getByText(/No users found./i)).toBeInTheDocument();
  });

  it("renders the list of users", () => {
    const mockUsers = [
      { id: 1, name: "John", age: 30 },
      { id: 2, name: "Jane", age: 25 },
    ];
    useUsersController.mockReturnValue({
      users: mockUsers,
      fetchUsers: jest.fn(),
    });

    render(<UsersView />);

    expect(screen.getByText(/ID: 1, Name: John, Age: 30/i)).toBeInTheDocument();
    expect(screen.getByText(/ID: 2, Name: Jane, Age: 25/i)).toBeInTheDocument();
  });

  it("calls fetchUsers when the 'Refresh Users' button is clicked", () => {
    const mockFetchUsers = jest.fn();
    useUsersController.mockReturnValue({
      users: [],
      fetchUsers: mockFetchUsers,
    });
  
    render(<UsersView />);
  
    const refreshButton = screen.getByText(/Refresh Users/i);
    
    mockFetchUsers.mockClear(); 
  
    fireEvent.click(refreshButton);
  
    expect(mockFetchUsers).toHaveBeenCalledTimes(1);
  });
  

  it("fetches users on mount", () => {
    const mockFetchUsers = jest.fn();
    useUsersController.mockReturnValue({
      users: [],
      fetchUsers: mockFetchUsers,
    });

    render(<UsersView />);

    expect(mockFetchUsers).toHaveBeenCalledTimes(1);
  });
});
