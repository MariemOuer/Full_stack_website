import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useUsersController } from '../controllers/UsersController';
import UsersView from "../views/UsersView";

jest.mock('../controllers/UsersController');

describe('UsersView', () => {
  const mockUsers = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
  ];

  beforeEach(() => {
    useUsersController.mockReturnValue({
      users: mockUsers,
      fetchUsers: jest.fn(),
    });
  });

  it('should render the component correctly and display the list of users', async () => {
    render(<UsersView />);

    expect(screen.getByText(/Users/i)).toBeInTheDocument();

    await waitFor(() => screen.getByText(/Alice/i));
    await waitFor(() => screen.getByText(/Bob/i));

    expect(screen.getByText(/ID: 1, Name: Alice, Age: 30/i)).toBeInTheDocument();
    expect(screen.getByText(/ID: 2, Name: Bob, Age: 25/i)).toBeInTheDocument();
  });

  it('should display "No users found" when no users are fetched', async () => {
    useUsersController.mockReturnValue({
      users: [],
      fetchUsers: jest.fn(),
    });

    render(<UsersView />);

    await waitFor(() => screen.getByText(/No users found/i));

    expect(screen.getByText(/No users found/i)).toBeInTheDocument();
  });

  it('should call fetchUsers when the refresh button is clicked', async () => {
    const mockFetchUsers = jest.fn();

    useUsersController.mockReturnValue({
      users: mockUsers,
      fetchUsers: mockFetchUsers,
    });

    render(<UsersView />);

    const refreshButton = screen.getByText(/Refresh Users/i);
    fireEvent.click(refreshButton);

    expect(mockFetchUsers).toHaveBeenCalledTimes(1);
  });

  it('should show the users list after calling fetchUsers', async () => {
    const mockFetchUsers = jest.fn().mockResolvedValue(mockUsers);

    useUsersController.mockReturnValue({
      users: mockUsers,
      fetchUsers: mockFetchUsers,
    });

    render(<UsersView />);

    await waitFor(() => screen.getByText(/Alice/i));
    await waitFor(() => screen.getByText(/Bob/i));

    expect(screen.getByText(/ID: 1, Name: Alice, Age: 30/i)).toBeInTheDocument();
    expect(screen.getByText(/ID: 2, Name: Bob, Age: 25/i)).toBeInTheDocument();
  });
});
