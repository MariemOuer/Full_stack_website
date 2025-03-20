import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewInvitationView from "../views/ViewInvitationView";
import { apiService } from '../services/ApiService';

jest.mock('../services/ApiService');

describe('ViewInvitationView', () => {
  const eventData = {
    event_name: 'Birthday Bash',
    event_date: '2025-06-30',
    location: '123 Party St.',
    theme: 'Rainbow Wonderland',
    catering: 'Gourmet Finger Food',
    entertainment: 'DJ Party',
    special_requests: 'Vegan Options',
    guest_count: 150,
  };

  beforeEach(() => {
    apiService.get.mockResolvedValue({ data: eventData });
  });

  it('should render the component correctly', async () => {
    render(
      <Router>
        <ViewInvitationView />
      </Router>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => screen.getByText(/Birthday Bash/i));

    expect(screen.getByText(/Birthday Bash/i)).toBeInTheDocument();
    expect(screen.getByText(/Date: 2025-06-30/i)).toBeInTheDocument();
    expect(screen.getByText(/Location: 123 Party St./i)).toBeInTheDocument();
    expect(screen.getByText(/Theme: Rainbow Wonderland/i)).toBeInTheDocument();
  });

  it('should change invitation style when selecting a different option', async () => {
    render(
      <Router>
        <ViewInvitationView />
      </Router>
    );

    await waitFor(() => screen.getByText(/Birthday Bash/i));

    fireEvent.change(screen.getByLabelText(/Choose an invitation style:/i), {
      target: { value: 'classic' },
    });

    expect(screen.getByText(/You're Invited!/i)).toBeInTheDocument();
    expect(screen.getByText(/Celebrate Birthday Bash/i)).toBeInTheDocument();
    expect(screen.getByText(/Date: 2025-06-30/i)).toBeInTheDocument();
    expect(screen.getByText(/Location: 123 Party St./i)).toBeInTheDocument();
  });

  it('should display event not found message when no event data is returned', async () => {
    apiService.get.mockRejectedValueOnce(new Error('Event not found'));

    render(
      <Router>
        <ViewInvitationView />
      </Router>
    );

    await waitFor(() => screen.getByText(/Event not found./i));
  });

  it('should show loading state initially', () => {
    render(
      <Router>
        <ViewInvitationView />
      </Router>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should display "Invalid selection" when an invalid style is selected', async () => {
    render(
      <Router>
        <ViewInvitationView />
      </Router>
    );

    await waitFor(() => screen.getByText(/Birthday Bash/i));

    fireEvent.change(screen.getByLabelText(/Choose an invitation style:/i), {
      target: { value: 'invalid-style' },
    });

    expect(screen.getByText(/❌ Invalid selection/i)).toBeInTheDocument();
  });
});
