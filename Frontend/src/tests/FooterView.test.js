import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FooterView from '../views/FooterView';
import '@testing-library/jest-dom';

// Mock CSS files - these must be the first jest.mocks
jest.mock("../styles/footer.css", () => ({}), { virtual: true });

const mockNavigate = jest.fn();

// Mock modules with explicit references to our mock functions
jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault(); // Prevent default anchor behavior
        mockNavigate(to); // Simulate navigation
      }}
      {...props}
    >
      {children}
    </a>
  ),
  Outlet: () => null,
}));

describe('FooterView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <Router>
        <FooterView />
      </Router>
    );
  });

  it('renders the Occasio title', () => {
    expect(screen.getByText('Occasio')).toBeInTheDocument();
  });

  it('displays the contact information', () => {
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('occasio.planner@gmail.com')).toBeInTheDocument();
  });

  it('renders the Navigation section', () => {
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('contains links to Chat Prompt, Create Invitation, and Invite Guests', () => {
    // Find the links by their text content
    const chatPrompt = screen.getByRole('link', { name: /Chat Prompt/i });
    const createInvitation = screen.getByRole('link', { name: /Create Invitation/i });
    const inviteGuests = screen.getByRole('link', { name: /Invite Guests/i });

    // Verify the links have the correct "href" attributes
    expect(chatPrompt).toHaveAttribute('href', '/chatbot');
    expect(createInvitation).toHaveAttribute('href', '/events');
    expect(inviteGuests).toHaveAttribute('href', '/events');
  });

  it('navigates to the correct pages when links are clicked', () => {
    // Find the links by their text content
    const chatPrompt = screen.getByRole('link', { name: /Chat Prompt/i });
    const createInvitation = screen.getByRole('link', { name: /Create Invitation/i });
    const inviteGuests = screen.getByRole('link', { name: /Invite Guests/i });

    // Simulate clicks on the links
    fireEvent.click(chatPrompt);
    fireEvent.click(createInvitation);
    fireEvent.click(inviteGuests);

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith('/chatbot');
    expect(mockNavigate).toHaveBeenCalledWith('/events');
    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  it('displays the copyright notice', () => {
    expect(screen.getByText('2025. Occasio. All Rights Reserved.')).toBeInTheDocument();
  });

  it('renders within a footer element', () => {
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass('footer');
  });

  it('contains two main sections: footer-container and footer-bottom', () => {
    const footerContainer = screen.getByText('Occasio').closest('.footer-container');
    const footerBottom = screen.getByText('2025. Occasio. All Rights Reserved.').closest('.footer-bottom');

    expect(footerContainer).toBeInTheDocument();
    expect(footerBottom).toBeInTheDocument();
  });
});