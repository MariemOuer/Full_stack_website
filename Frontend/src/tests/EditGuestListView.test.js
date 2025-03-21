import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditGuestListView from '../views/EditGuestListView';
import { apiService } from '../services/ApiService';
import '@testing-library/jest-dom';

// Mock the API service
jest.mock('../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
  },
}));

const mockGuestList = {
  event_name: "Test Event",
  guests: [
    { id: 1, name: "John Doe", email: "john@example.com", rsvp: "Yes" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", rsvp: "No" },
  ],
};

describe('EditGuestListView', () => {
  beforeEach(() => {
    apiService.get.mockReset();
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/edit-guest-list/123']}>
        <Routes>
          <Route path="/edit-guest-list/:eventId" element={<EditGuestListView />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders guest list details after loading', async () => {
    apiService.get.mockResolvedValue({ data: mockGuestList });

    render(
      <MemoryRouter initialEntries={['/edit-guest-list/123']}>
        <Routes>
          <Route path="/edit-guest-list/:eventId" element={<EditGuestListView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('RSVP: Yes')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('RSVP: No')).toBeInTheDocument();
    });
  });

  it('displays error message when guest list is not found', async () => {
    apiService.get.mockRejectedValue(new Error('Guest list not found'));

    render(
      <MemoryRouter initialEntries={['/edit-guest-list/123']}>
        <Routes>
          <Route path="/edit-guest-list/:eventId" element={<EditGuestListView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Guest list not found.')).toBeInTheDocument();
    });
  });

  it('calls API with correct event ID', async () => {
    render(
      <MemoryRouter initialEntries={['/edit-guest-list/123']}>
        <Routes>
          <Route path="/edit-guest-list/:eventId" element={<EditGuestListView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith('/event/123');
    });
  });
});
