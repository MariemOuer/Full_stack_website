import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import FooterView from "../views/FooterView";
import "@testing-library/jest-dom"; // Ensure Jest DOM matchers are imported

describe("FooterView", () => {
  beforeEach(() => {
    render(
      <Router>
        <FooterView />
      </Router>
    );
  });

  it("should render the footer correctly", () => {
    // Be more specific to avoid multiple matches
    expect(screen.getByText(/Occasio/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/occasio.planner@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/2025. Occasio. All Rights Reserved./i)).toBeInTheDocument();
  });

  it("should have correct links in the footer", () => {
    // Ensure the links are rendered as <Link> components
    expect(screen.getByRole("link", { name: /Chat Prompt/i })).toHaveAttribute("href", "/chatbot");
    expect(screen.getByRole("link", { name: /Create Invitation/i })).toHaveAttribute("href", "/events");
    expect(screen.getByRole("link", { name: /Invite Guests/i })).toHaveAttribute("href", "/events");
  });

  it("should render the footer with the correct classes", () => {
    const footer = screen.getByRole("contentinfo"); // Semantic role for <footer>
    expect(footer).toHaveClass("footer");
    expect(footer.querySelector(".footer-container")).toBeInTheDocument();
    expect(footer.querySelector(".footer-section")).toBeInTheDocument();
    expect(footer.querySelector(".footer-bottom")).toBeInTheDocument();
  });

  // Additional test for handling the presence of the links
  it("should render all navigation links correctly", () => {
    const links = screen.getAllByRole("link");
    const linkNames = links.map(link => link.textContent);
    
    // Ensure all the links are present in the footer
    expect(linkNames).toContain("Chat Prompt");
    expect(linkNames).toContain("Create Invitation");
    expect(linkNames).toContain("Invite Guests");
  });
});
