import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ViewInvitationView from '../views/ViewInvitationView';
import { apiService } from "../services/ApiService";
import '@testing-library/jest-dom';

// Mock API service
jest.mock("../services/ApiService", () => ({
  apiService: {
    get: jest.fn(),
  },
}));

jest.mock('../views/ViewInvitationView', () => () => <div data-testid="mock-view-invitation">Mock View Invitation</div>);

// Mock Navbar and Footer components
jest.mock('../views/NavbarView', () => () => <div data-testid="navbar">Mock Navbar</div>);
jest.mock('../views/FooterView', () => () => <div data-testid="footer">Mock Footer</div>);

const mockEvent = {
  event_name: "Test Event",
  event_date: "2023-12-31",
  location: "Test Location",
  theme: "Test Theme",
  catering: "Test Catering",
  entertainment: "Test Entertainment",
  special_requests: "Test Requests",
  guest_count: 100,
};

describe('ViewInvitationView', () => {
  beforeEach(() => {
    apiService.get.mockResolvedValue({ data: mockEvent });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/event/123']}>
        <Routes>
          <Route path="/event/:eventId" element={<ViewInvitationView />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders event details after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/event/123']}>
        <Routes>
          <Route path="/event/:eventId" element={<ViewInvitationView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('2023-12-31')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });
  });

  it('changes invitation style when dropdown is changed', async () => {
    render(
      <MemoryRouter initialEntries={['/event/123']}>
        <Routes>
          <Route path="/event/:eventId" element={<ViewInvitationView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });

    const styleSelect = screen.getByLabelText('Choose an invitation style:');
    fireEvent.change(styleSelect, { target: { value: 'classic' } });

    expect(screen.getByText("💌 You're Invited!")).toBeInTheDocument();
  });

  it('displays error message when event is not found', async () => {
    apiService.get.mockRejectedValue(new Error('Event not found'));

    render(
      <MemoryRouter initialEntries={['/event/123']}>
        <Routes>
          <Route path="/event/:eventId" element={<ViewInvitationView />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Event not found.')).toBeInTheDocument();
    });
  });

  it('renders Navbar and Footer', () => {
    render(
      <MemoryRouter initialEntries={['/event/123']}>
        <Routes>
          <Route path="/event/:eventId" element={<ViewInvitationView />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders all style options in the dropdown', () => {
    render(
      <MemoryRouter initialEntries={['/event/123']}>
        <Routes>
          <Route path="/event/:eventId" element={<ViewInvitationView />} />
        </Routes>
      </MemoryRouter>
    );

    const styleSelect = screen.getByLabelText('Choose an invitation style:');
    const options = Array.from(styleSelect.options).map(option => option.value);

    expect(options).toEqual(['whimsical', 'classic', 'professional', 'fun']);
  });
});
