import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SavedEventsView from "../views/SavedEventsView";
import { SavedEventsController } from '../controllers/SavedEventsController';
import { useAuth } from '../context/AuthContext';

jest.mock('../controllers/SavedEventsController');
jest.mock('../context/AuthContext');

describe('SavedEventsView', () => {
  const mockCurrentUser = {
    email: 'testuser@example.com',
  };

  const mockEvents = [
    {
      id: 1,
      event_name: 'Event 1',
      event_type: 'Wedding',
      event_date: '2025-06-30',
      event_length: '5 hours',
      guest_count: 100,
      location: 'Venue A',
      catering: 'Buffet',
      theme: 'Romantic',
      entertainment: 'DJ',
      accommodations: 'Hotel A',
      special_requests: 'None',
      event_timeline: 'TBD',
      budget: 5000,
    },
    {
      id: 2,
      event_name: 'Event 2',
      event_type: 'Birthday',
      event_date: '2025-07-15',
      event_length: '3 hours',
      guest_count: 50,
      location: 'Venue B',
      catering: 'Plated',
      theme: 'Fun',
      entertainment: 'Live Band',
      accommodations: 'Hotel B',
      special_requests: 'Vegan Options',
      event_timeline: 'TBD',
      budget: 3000,
    },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({
      currentUser: mockCurrentUser,
    });

    SavedEventsController.fetchEvents.mockResolvedValue(mockEvents);
  });

  it('should render the component correctly and show loading state initially', () => {
    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    expect(screen.getByText(/Loading events.../i)).toBeInTheDocument();
  });

  it('should display saved events when data is loaded', async () => {
    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => screen.getByText(/Event 1/i));
    await waitFor(() => screen.getByText(/Event 2/i));

    expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Event 2/i)).toBeInTheDocument();

    expect(screen.getByText(/Event 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Event 2/i)).toBeInTheDocument();
  });

  it('should display the event details when an event is selected', async () => {
    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => screen.getByText(/Event 1/i));

    fireEvent.change(screen.getByLabelText(/Event/i), {
      target: { value: '2' },
    });

    expect(screen.getByText(/Event Type:/i)).toBeInTheDocument();
    expect(screen.getByText(/Birthday/i)).toBeInTheDocument();
    expect(screen.getByText(/Event Date:/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-07-15/i)).toBeInTheDocument();
    expect(screen.getByText(/Guest Count:/i)).toBeInTheDocument();
    expect(screen.getByText(/50/i)).toBeInTheDocument();
  });

  it('should display "No events found" when no events are fetched', async () => {
    SavedEventsController.fetchEvents.mockResolvedValue([]);

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    await waitFor(() => screen.getByText(/No events found./i));

    expect(screen.getByText(/No events found./i)).toBeInTheDocument();
  });

  it('should display welcome message based on current user', () => {
    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
    expect(screen.getByText(/Current User:/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser@example.com/i)).toBeInTheDocument();
  });

  it('should display "Welcome!" for guest users', () => {
    useAuth.mockReturnValue({
      currentUser: {
        email: 'guest@gmail.com',
      },
    });

    render(
      <Router>
        <SavedEventsView />
      </Router>
    );

    expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
    expect(screen.getByText(/Current User:/i)).toBeInTheDocument();
    expect(screen.getByText(/Guest/i)).toBeInTheDocument();
  });
});
