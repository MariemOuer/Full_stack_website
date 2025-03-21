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
    // Use `getAllByText` to handle multiple occurrences
    const occasioElements = screen.getAllByText(/Occasio/i);
    expect(occasioElements.length).toBeGreaterThan(0); // At least one should exist
  
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/occasio.planner@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/2025. Occasio. All Rights Reserved./i)).toBeInTheDocument();
  });
  

  it("should have correct links in the footer", () => {
    const links = screen.queryAllByRole("link");
    console.log("Links Found:", links.map(link => link.textContent.trim())); // Trim removes extra spaces
  
    const chatPrompt = screen.queryByRole("link", { name: /Chat Prompt/i });
    const createInvitation = screen.queryByRole("link", { name: /Create Invitation/i });
    const inviteGuests = screen.queryByRole("link", { name: /Invite Guests/i });
  
    console.log("Chat Prompt Link:", chatPrompt);
    console.log("Create Invitation Link:", createInvitation);
    console.log("Invite Guests Link:", inviteGuests);
  
    expect(chatPrompt).toBeTruthy();
    expect(chatPrompt).toHaveAttribute("href", "/chatbot");
  
    expect(createInvitation).toBeTruthy();
    expect(createInvitation).toHaveAttribute("href", "/events");
  
    expect(inviteGuests).toBeTruthy();
    expect(inviteGuests).toHaveAttribute("href", "/events");
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
    const links = screen.queryAllByRole("link");
    console.log("Links found in Footer:", links.map((link) => link.textContent));
    const linkNames = links.map(link => link.textContent);
    
    // Ensure all the links are present in the footer
    expect(linkNames).toContain("Chat Prompt");
    expect(linkNames).toContain("Create Invitation");
    expect(linkNames).toContain("Invite Guests");
  });
});
