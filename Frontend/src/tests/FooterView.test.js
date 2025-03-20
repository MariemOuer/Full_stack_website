import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; 
import FooterView from "../views/FooterView";

describe("FooterView", () => {
  it("should render the footer correctly", () => {
    render(
      <Router>
        <FooterView />
      </Router>
    );

    expect(screen.getByText(/Occasio/i)).toBeInTheDocument();

    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/occasio.planner@gmail.com/i)).toBeInTheDocument();

    expect(screen.getByText(/Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Chat Prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Invitation/i)).toBeInTheDocument();
    expect(screen.getByText(/Invite Guests/i)).toBeInTheDocument();

    expect(screen.getByText(/2025. Occasio. All Rights Reserved./i)).toBeInTheDocument();
  });

  it("should have correct links in the footer", () => {
    render(
      <Router>
        <FooterView />
      </Router>
    );

    const chatPromptLink = screen.getByText(/Chat Prompt/i);
    expect(chatPromptLink).toHaveAttribute("href", "/chatbot");

    const createInvitationLink = screen.getByText(/Create Invitation/i);
    expect(createInvitationLink).toHaveAttribute("href", "/events");

    const inviteGuestsLink = screen.getByText(/Invite Guests/i);
    expect(inviteGuestsLink).toHaveAttribute("href", "/events");
  });

  it("should render the footer with the correct classes", () => {
    const { container } = render(
      <Router>
        <FooterView />
      </Router>
    );

    expect(container.querySelector("footer")).toHaveClass("footer");

    expect(container.querySelector(".footer-container")).toBeInTheDocument();
    expect(container.querySelector(".footer-section")).toBeInTheDocument();
    expect(container.querySelector(".footer-bottom")).toBeInTheDocument();
  });
});
