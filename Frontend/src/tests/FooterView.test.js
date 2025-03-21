import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import FooterView from '../views/FooterView';
import '@testing-library/jest-dom';

describe('FooterView', () => {
  beforeEach(() => {
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
    const chatPrompt = screen.getByText('Chat Prompt');
    const createInvitation = screen.getByText('Create Invitation');
    const inviteGuests = screen.getByText('Invite Guests');

    expect(chatPrompt.closest('a')).toHaveAttribute('href', '/chatbot');
    expect(createInvitation.closest('a')).toHaveAttribute('href', '/events');
    expect(inviteGuests.closest('a')).toHaveAttribute('href', '/events');
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
