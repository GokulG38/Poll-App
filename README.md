# Poll-App


## Overview

This is a full-stack web application for conducting polls, voting, and commenting on polls.

### Features

- **User Authentication**: Allows users to sign up, log in, and authenticate using JWT tokens.
- **Poll Creation**: Users can create polls with multiple options.
- **Voting**: Registered users can vote on polls.
- **Comments**: Users can comment on polls and reply to comments.
- **Real-time Updates**: Socket.IO integration for real-time updates on voting and commenting.
- **Profile Management**: Users can upload a profile picture.

### Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (using Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **File Uploads**: Multer middleware for handling file uploads

## Folder Structure

frontend/
├── public/
├── src/
├── components/
├── utils/
├── App.js
├── index.js
└── ...


backend/
├── middleware/
├── models/
├── routes/
├── uploads/
└── app.js

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/GokulG38/Poll-App.git
   cd Poll-App


2. **Install dependencies**:

    Frontend:
        cd frontend
        npm install
    Backend:
        cd backend
        npm install

3. **Set up environment variables**:

Create a .env file in the backend directory with the following variables:
    MONGO_URL=<your-mongodb-connection-string>
    USER_JWT_SECRET=<your-jwt-secret>


4. **Start the development servers**:

    Open your browser and go to http://localhost:3000 to view the application.

## API Endpoints

1. **Users**

    POST /signup: Register a new user.
    POST /login: Log in an existing user.

2. **Polls**

    GET /polls: Get all polls.
    GET /polls/:id: Get a specific poll by ID.
    POST /polls/create: Create a new poll.
    POST /polls/:id/vote: Vote on a poll.
    GET /polls/:id/result: Get poll results.

3. **Comments**

    GET /polls/:id/comments: Get all comments for a poll.
    POST /polls/:id/comment: Post a new comment on a poll.# Poll-App
