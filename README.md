# Chat Application Backend

This is the backend server for a real-time chat application built with Node.js, Express, TypeScript, MongoDB, and Socket.IO.

## Features

- User authentication (local and Google OAuth)
- Real-time messaging
- Group chat support
- Friend management
- Message encryption
- Redis-based message queue for processing

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Redis

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chat-app-backend.git
   cd chat-app-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   REDIS_URL=your_redis_url
   ```

## Running the Application

npm run start

## Project Structure

```
src/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
└── app.ts
```

## API Endpoints

- POST /auth/register - Register a new user
- POST /auth/login - Login user
- GET /auth/google - Google OAuth login
- POST /chat/rooms - Create a new chat room
- GET /chat/rooms/:roomId/messages - Get messages for a chat room
- POST /chat/rooms/:roomId/messages - Send a message to a chat room
- GET /chat/rooms - List all chat rooms for the authenticated user
- POST /users/addFriend - Add a friend
- GET /users/all - List all users except the authenticated user

## Socket.IO Events

- 'connection' - User connects
- 'disconnect' - User disconnects
- 'join-room' - Join a chat room
- 'leave-room' - Leave a chat room
- 'send-message' - Send a message