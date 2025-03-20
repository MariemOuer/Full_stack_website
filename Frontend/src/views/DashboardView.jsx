// src/views/DashboardView.jsx
import { Link } from "react-router-dom";
import Navbar from "./NavbarView";
import FooterView from "./FooterView";
import "../styles/home.css";

const DashboardView = () => {
  const teamMembers = [
    {
      name: "Miri Kim",
      role: "Team Leader",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: "/userlogo.png",
    },
    {
      name: "Riya Sharma",
      role: "Team Leader",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: "/userlogo.png",
    },
    {
      name: "Martin Liu",
      role: "Backend Developer",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: "/userlogo.png",
    },
    {
      name: "Mariem Ouertatani",
      role: "Backend Developer",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: "/userlogo.png",
    },
    {
      name: "Diba Jamali",
      role: "Frontend Developer",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: "/userlogo.png",
    },
    {
      name: "Stephenie Oboh",
      role: "Frontend Developer",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image: "/userlogo.png",
    },
  ];

  return (
    <div>
      <div className="homepage-background">
        <div className="homepage-container">
          {/* Top Left: Text Section */}
          <div className="homepage-text">
            <h2>Events Made Easy, Memories Made Forever</h2>
            <p>
              Occasio is your AI-powered event planning assistant, making it effortless to organize gatherings of any size. From scheduling and guest management to personalized recommendations, we
              handle the details so you can focus on making unforgettable memories.
            </p>
            <Link to="/chatbot" className="cta-link">
              {" "}
              Plan your next event now →{" "}
            </Link>
          </div>

          {/* Top Right: Image */}
          <div className="homepage-image">
            <img src="/planner.png" alt="Planner notebook" />
          </div>

          {/* Bottom Left: How It Works */}
          <div className="homepage-how-it-works">
            <img src="/moodboard.png" alt="How it works" className="how-it-works-image" />
            <h3>How it Works</h3>
            <ol>
              <li>
                <strong>Plan Your Event:</strong> Enter event details and preferences.
              </li>
              <li>
                <strong>Get Recommendations:</strong> Receive personalized suggestions for venues, catering, and more.
              </li>
              <li>
                <strong>Create Custom Invitations</strong>
              </li>
              <li>
                <strong>Manage Guests:</strong> Send invites and track RSVPs effortlessly.
              </li>
            </ol>
          </div>

          {/* Bottom Right: Team Section */}
          <div className="homepage-team">
            <h2 className="team-header">Meet the Team</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member-card">
                  <div className="card-top">
                    <img src={member.image} alt="Team Member" className="member-image" />
                    <div className="member-info">
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
};

export default DashboardView;
