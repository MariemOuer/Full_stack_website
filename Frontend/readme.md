# Full-Stack Web Application - Backend

## Project Overview
This is the backend of a full-stack web application that handles event management, guest management, invites, and suggestions. The backend is built using Node.js and Express, and it connects to a database for data storage. It also includes an email service for sending event-related notifications.

## Folder Structure
```
Backend/
src/
config/
db.js        # Database configuration
mail.js      # Email configuration
routes/
email.js      # Email-related API routes
event.js      # Event management API routes
guests.js     # Guest management API routes
invites.js    # Invitation management API routes
suggestions.js # User suggestions API routes
app.js           # Express app setup
index.js         # Server entry point
package.json         # Project dependencies
package-lock.json    # Lock file for package versions
readme.md            # Documentation
vercel.json          # Deployment configuration

```
## Installation & Setup
### Prerequisites
- Node.js (>= 14.x)
- npm (>= 6.x)
- MongoDB or another configured database

### Steps
1. open the terminal:
   cd Backend
   
2. Install dependencies:
   
   npm install
   
3. Start the server:
   
   npm start
   
   The server should now be running on `http://localhost:3000/`.

## API Documentation
### 1. Event Management
- **GET /events** - Retrieve all events
- **POST /events** - Create a new event
- **PUT /events/:id** - Update an existing event
- **DELETE /events/:id** - Delete an event

### 2. Guest Management
- **GET /guests** - Retrieve all guests
- **POST /guests** - Add a guest
- **DELETE /guests/:id** - Remove a guest

### 3. Invitations
- **POST /invites** - Send an event invite
- **GET /invites** - Retrieve all invites

### 4. Suggestions
- **GET /suggestions** - Retrieve suggestions
- **POST /suggestions** - Add a new suggestion

### 5. Email Notifications
- **POST /email/send** - Send an email notification

## Database Configuration
The application connects to a MongoDB database using `db.js`. Ensure the `DATABASE_URL` environment variable is correctly set up.

## Email Service
The email service is handled in `mail.js` and `email.js`. Make sure to configure the mail service credentials in the `.env` file.

##  Deploy on Vercel
Install Vercel CLI (if not installed)
npm install -g vercel

Log in to Vercel
vercel login
Follow the prompts to authenticate with your Vercel account.

Deploy for the First Time
vercel --prod
This will generate a live URL like: https://your-project-name.vercel.app


##  Deploy After Updates
Whenever you update your backend, redeploy with:
vercel --prod

Note: This will generate a new URL, so you may need to update your frontend environment variables accordingly. Also to prevent CORS issues, you may need to go to vercel and disable vercel authentication under "Deployment Protections", note if this is for real software you MUST do some sort of api auth like json tokens so your app cant be hacked! Look into how you can only allow access from specfic origins and how to protect your APIs!

To test if you have cors issues:
curl -i [api] on your terminal

