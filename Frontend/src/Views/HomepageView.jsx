// src/views/HomeView.jsx
import React, { useState } from "react";
import { useAuthController } from "../controllers/AuthController";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

// const HomeView = () => {
//   return (
//     <div className="home-page">
//       {/* Top Section */}
//       <div className="top-section">
//         {/* Top Left: Events Made Easy Text */}
//         <div className="top-left">
//           <h1>Events Made Easy, Memories Made Forever</h1>
//           <p className="description">
//             Occasio is your AI-powered event planning assistant, making it effortless to organize gatherings of any size. From scheduling and guest management to personalized recommendations, we handle the details so you can focus on making unforgettable memories.
//           </p>
//           <Link to="/signup" className="cta-link">
//             Plan your next event now →
//           </Link>
//         </div>

//         {/* Top Right: Planner Image */}
//         <div className="top-right">
//           <img src="/planner.png" alt="Planner" className="planner-image" />
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="bottom-section">
//         {/* Bottom Left: Moodboard Image and How It Works Text */}
//         <div className="bottom-left">
//           <img src="/moodboard.png" alt="Moodboard" className="moodboard-image" />
//           <div className="how-it-works">
//             <h2>How it Works</h2>
//             <ol>
//                 <li><strong>Plan Your Event:</strong> Enter event details and preferences.</li>
//                 <li><strong>Get Recommendations:</strong> Receive personalized suggestions for venues, catering, and more.</li>
//                 <li><strong>Create Custom Invitations</strong></li>
//                 <li><strong>Manage Guests:</strong> Send invites and track RSVPs effortlessly.</li>
//             </ol>
//           </div>
//         </div>

//         {/* Bottom Right: Meet the Team Text and Team Member Cards */}
//         <div className="bottom-right">
//           <h2>Meet the Team</h2>
//           <div className="team-grid">
//             {/* Team Member 1 */}
//             <div className="team-member">
//               <h3>Member Name</h3>
//               <p className="role">Team Leader</p>
//               <p className="description">Lorem ipsum dolor sit amet consectetur.</p>
//             </div>

//             {/* Team Member 2 */}
//             <div className="team-member">
//               <h3>Member Name</h3>
//               <p className="role">Team Leader</p>
//               <p className="description">Lorem ipsum dolor sit amet consectetur.</p>
//             </div>

//             {/* Team Member 3 */}
//             <div className="team-member">
//               <h3>Member Name</h3>
//               <p className="role">Team Leader</p>
//               <p className="description">Lorem ipsum dolor sit amet consectetur.</p>
//             </div>

//             {/* Team Member 4 */}
//             <div className="team-member">
//               <h3>Member Name</h3>
//               <p className="role">Team Leader</p>
//               <p className="description">Lorem ipsum dolor sit amet consectetur.</p>
//             </div>

//             {/* Team Member 5 */}
//             <div className="team-member">
//               <h3>Member Name</h3>
//               <p className="role">Team Leader</p>
//               <p className="description">Lorem ipsum dolor sit amet consectetur.</p>
//             </div>

//             {/* Team Member 6 */}
//             <div className="team-member">
//               <h3>Member Name</h3>
//               <p className="role">Team Leader</p>
//               <p className="description">Lorem ipsum dolor sit amet consectetur.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeView;

const HomepageView = () => {
    return (
        <div className="homepage-container">
            {/* Top Left: Text Section */}
            <div className="homepage-text">
                <h2>Events Made Easy, Memories Made Forever</h2>
                <p>
                    Occasio is your AI-powered event planning assistant, making it effortless
                    to organize gatherings of any size. From scheduling and guest management
                    to personalized recommendations, we handle the details so you can focus
                    on making unforgettable memories.
                </p>
                <Link to="/signup" className="cta-link"> Plan your next event now → </Link>
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
                    <li><strong>Plan Your Event:</strong> Enter event details and preferences.</li>
                    <li><strong>Get Recommendations:</strong> Receive personalized suggestions for venues, catering, and more.</li>
                    <li><strong>Create Custom Invitations</strong></li>
                    <li><strong>Manage Guests:</strong> Send invites and track RSVPs effortlessly.</li>
                </ol>
            </div>

            {/* Bottom Right: Team Section */}
            <div className="homepage-team">
                <h2 className="team-header">Meet the Team</h2>
                <div className="team-grid">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="team-member-card">
                            <div className="card-top">
                                <img src="/userlogo.png" alt="Team Member" className="member-image" />
                                <div className="member-info">
                                    <h4>Member Name</h4>
                                    <p>Team Leader</p>
                                </div>
                            </div>
                            <p className="member-description">
                                Lorem ipsum dolor sit amet consectetur.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomepageView;