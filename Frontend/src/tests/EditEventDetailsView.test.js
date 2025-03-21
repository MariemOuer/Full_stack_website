import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useParams } from 'react-router-dom';
import EditEventDetailsView from '../views/EditEventDetailsView';
import { apiService } from '../services/ApiService';
import '@testing-library/jest-dom';

// Mock the modules
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

jest.mock('../services/ApiService', () => ({
    apiService: {
        get: jest.fn(),
    },
}));

describe('EditEventDetailsView', () => {
    beforeEach(() => {
        // Clear mocks
        useParams.mockClear();
        apiService.get.mockClear();
    });

    it('renders loading state initially', () => {
        useParams.mockReturnValue({ eventId: '123' });
        apiService.get.mockResolvedValue(new Promise(() => { })); // Never resolves

        render(
            <Router>
                <EditEventDetailsView />
            </Router>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('fetches and displays event details successfully', async () => {
        useParams.mockReturnValue({ eventId: '123' });
        const mockEvent = {
            event_name: 'Test Event',
            event_type: 'Party',
            event_date: '2025-04-01',
            location: 'Test Location',
            theme: 'Test Theme',
            budget: '1000',
        };
        apiService.get.mockResolvedValue({ data: mockEvent });

        render(
            <Router>
                <EditEventDetailsView />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Test Event/i)).toBeInTheDocument();
            expect(screen.getByText(/Event Type:/i)).toBeInTheDocument();
            expect(screen.getByText(/Party/i)).toBeInTheDocument();
            expect(screen.getByText(/Date:/i)).toBeInTheDocument();
            expect(screen.getByText(/2025-04-01/i)).toBeInTheDocument();
            expect(screen.getByText(/Location:/i)).toBeInTheDocument();
            expect(screen.getByText(/Test Location/i)).toBeInTheDocument();
            expect(screen.getByText(/Theme:/i)).toBeInTheDocument();
            expect(screen.getByText(/Test Theme/i)).toBeInTheDocument();
            expect(screen.getByText(/Budget:/i)).toBeInTheDocument();
            expect(screen.getByText(/1000/i)).toBeInTheDocument();
        });
    });

    it('displays "Event not found" when the API returns an error', async () => {
        useParams.mockReturnValue({ eventId: '123' });
        apiService.get.mockRejectedValue(new Error('Event not found'));

        render(
            <Router>
                <EditEventDetailsView />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Event not found.')).toBeInTheDocument();
        });
    });
});
