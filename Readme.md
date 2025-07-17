```markdown
# Real-Time Chat Application with Socket.io

A real-time chat application demonstrating bidirectional communication between clients and server using Socket.io.

## Features

- User authentication (username-based)
- Global chat room for all users
- Message display with sender's name and timestamp
- Typing indicators
- Online/offline status for users
- Real-time notifications
- Responsive design

## Technologies Used

- Node.js
- Express
- Socket.io
- React
- TypeScript
- Vite
- Tailwind CSS (optional)

## Setup Instructions

### Prerequisites

- Node.js v18+
- pnpm

### Installation

1. Clone the repository
2. Install dependencies for both server and client:

```bash
cd server
pnpm install

cd ../client
pnpm install
```

### Running the Application

1. Start the server:

```bash
cd server
pnpm run dev
```

2. Start the client:

```bash
cd client
pnpm run dev
```

3. Open the client in your browser at `http://localhost:5173`

## Screenshots

![Chat Interface](./screenshots/chat-interface.png)
![User Join](./screenshots/user-join.png)

## Deployment

### Server Deployment

You can deploy the server to services like:
- Render
- Railway
- Heroku

### Client Deployment

You can deploy the client to:
- Vercel
- Netlify
- GitHub Pages

## Future Enhancements

- Private messaging between users
- Multiple chat rooms
- File/image sharing
- Read receipts
- Message reactions
```

