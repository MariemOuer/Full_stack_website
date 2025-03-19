🏗️ Frontend

🚀 Overview

This project is built with React 18, following a lightweight MVC-inspired architecture:

🖥️ Views: Presentational components (JSX) that render the UI.

🧠 Controllers: The logic behind those views (e.g., fetching data, handling events).

🔌 Services: Shared logic for API calls or external microservices (e.g., apiService.js).

🔑 AuthContext: A React Context for authentication and global state (“memory”) across the app.

We do not use the traditional components/ approach. Instead, each screen or page is a View, and its logic (fetching data, handling events) lives in a Controller. This keeps Views focused on rendering/UI, while Controllers manage logic and external API calls.

🏛️ Architecture Breakdown

1️⃣ Views (UI Layer)

📂 Located in src/views/

Each “page” or screen has its own .jsx file (e.g., LoginView.jsx, SignupView.jsx, DogView.jsx).

Purpose: Display data & UI elements, get user input, and forward actions to the Controller.

📌 How to create a new View:

Create a new JSX file in src/views/ (e.g., ProfileView.jsx).

Import any relevant controllers or context hooks.

Write your UI in the returned JSX:

function ProfileView() {
  return (
    <div>
      <h2>Profile</h2>
      {/* UI Elements */}
    </div>
  );
}

export default ProfileView;

Add a Route for this new view in App.js if needed.

2️⃣ Controllers (Logic Layer)

📂 Located in src/controllers/

Handles fetching data from the apiService, authentication tasks, or local state management.

📌 How to create a new Controller:

Create a file in src/controllers/ (e.g., ProfileController.js).

Export a function or custom hook that encapsulates the logic:

import { useState } from "react";
import { apiService } from "../services/apiService";

export const useProfileController = () => {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await apiService.get("/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  return { profile, fetchProfile };
};

In your View (ProfileView.jsx), import useProfileController, call the hook, and use the data.

3️⃣ Services (API Layer)

📂 Located in src/services/

Centralized logic for calling external APIs or microservices.

apiService.js includes generic get, post, put, patch, and delete functions.

📌 How to use the API service:

Import apiService in your Controller:

import { apiService } from "../services/apiService";

Use the service to call external APIs:

const response = await apiService.get("/300/200");

4️⃣ AuthContext (Global Memory & Authentication)

📂 Located in src/context/AuthContext.jsx

Stores:

The currently logged-in user (via Firebase authentication).

Any custom “memory” (global variables shared across views).

📌 How to use AuthContext:

Import the custom hook:

import { useAuth } from "../context/AuthContext";

Call:

const { currentUser, customData, setVariable, logout } = useAuth();

You can:

✅ Check if a user is logged in: currentUser !== null

✅ Retrieve/set memory variables: setVariable("someKey", someValue)

✅ Logout the user: logout()

🔹 Since we wrap the entire app in <AuthProvider>, any View or Controller can access authentication and shared memory.

🎯 Why This Structure?

✅ Clarity: Separates UI (Views) from logic (Controllers), keeping code modular.
✅ Scalability: Adding new views and features is easy.
✅ Global State: Avoids prop-drilling by using AuthContext.
✅ Flexibility: Services and controllers can be easily expanded for microservices.

🔧 Quick Steps to Add a New Page

Create a new Controller in src/controllers/, e.g. ProfileController.js.

Create a new View in src/views/, e.g. ProfileView.jsx.

In the View, import your Controller and use its functions.

In App.js, add a new Route for your page:

import ProfileView from "./views/ProfileView";

<Route path="/profile" element={currentUser ? <ProfileView /> : <Navigate to="/login" />} />

🏁 Getting Started / How to Run

Install dependencies:

npm install

Create a .env file with your Firebase keys and REACT_APP_DOG_API_DOMAIN.

Start the development server:

npm start

Open http://localhost:3000.

🔹 Sign up or log in.
🔹 Explore the Dashboard and Dog Page.
🔹 Test API fetching from the /dogs route.

✨ This architecture keeps Views focused on UI, Controllers handling logic, and Services managing API calls—all while using AuthContext for memory across the app. 🎉

