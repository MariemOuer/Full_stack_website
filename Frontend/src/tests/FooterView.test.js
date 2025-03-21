import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import FooterView from "../views/FooterView";
import "@testing-library/jest-dom";

describe("FooterView", () => {
  beforeEach(() => {
    render(
      <Router>
        <FooterView />
      </Router>
    );
  });

  it("renders the Occasio title", () => {
    expect(screen.getByText("Occasio")).toBeInTheDocument();
  });

  it("displays the contact information", () => {
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("occasio.planner@gmail.com")).toBeInTheDocument();
  });

  it("renders the Navigation section", () => {
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("contains text for Chat Prompt, Create Invitation, and Invite Guests", () => {
    // Find the navigation section
    const navigationSection = screen.getByText("Navigation").closest(".footer-section");

    // Check that the navigation section contains the expected text
    expect(navigationSection).toHaveTextContent("Chat Prompt");
    expect(navigationSection).toHaveTextContent("Create Invitation");
    expect(navigationSection).toHaveTextContent("Invite Guests");
  });

  it("displays the copyright notice", () => {
    expect(screen.getByText("2025. Occasio. All Rights Reserved.")).toBeInTheDocument();
  });

  it("renders within a footer element", () => {
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass("footer");
  });

  it("contains two main sections: footer-container and footer-bottom", () => {
    const footerContainer = screen.getByText("Occasio").closest(".footer-container");
    const footerBottom = screen.getByText("2025. Occasio. All Rights Reserved.").closest(".footer-bottom");
    expect(footerContainer).toBeInTheDocument();
    expect(footerBottom).toBeInTheDocument();
  });
});
