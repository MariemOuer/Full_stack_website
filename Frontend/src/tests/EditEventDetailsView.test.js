import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditEventDetailsView from '../views/EditEventDetailsView';  
import { apiService } from '../services/ApiService';
import '@testing-library/jest-dom';
console.log(EditEventDetailsView);

// Mock the API service
jest.mock('../services/ApiService', () => ({
  apiService: {
    get: jest.fn(),
  },
}));

const mockEvent = {
  event_name: "Test Event",
  event_type: "Birthday",
  event_date: "2023-12-31",
  location: "Test Location",
  theme: "Test Theme",
  budget: "1000"
};

describe('EditEventDetailsView', () => {
  beforeEach(() => {
    apiService.get.mockReset();
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/edit-event/123']}>
        <Routes>
          <Route path="/edit-event/:eventId" element={<EditEventDetailsView />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders event details after loading', async () => {
    apiService.get.mockResolvedValue({ data: mockEvent });

    render(
      <MemoryRouter initialEntries={['/edit-event/123']}>
        <Routes>
          <Route path="/edit-event/:eventId" element={<EditEventDetailsView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Birthday')).toBeInTheDocument();
      expect(screen.getByText('2023-12-31')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('Test Theme')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });
  });

  it('displays error message when event is not found', async () => {
    apiService.get.mockRejectedValue(new Error('Event not found'));

    render(
      <MemoryRouter initialEntries={['/edit-event/123']}>
        <Routes>
          <Route path="/edit-event/:eventId" element={<EditEventDetailsView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Event not found.')).toBeInTheDocument();
    });
  });

  it('calls API with correct event ID', async () => {
    render(
      <MemoryRouter initialEntries={['/edit-event/123']}>
        <Routes>
          <Route path="/edit-event/:eventId" element={<EditEventDetailsView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(apiService.get).toHaveBeenCalledWith('/event/123');
    });
  });
});
