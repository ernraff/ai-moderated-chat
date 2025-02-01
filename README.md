# Real-Time Chat App with AI Moderation

## Overview
This is a **real-time chat application** built with **Node.js**, **TypeScript**, **React**, and **Socket.io**. The app allows users to send and receive messages in real-time, with AI-powered moderation to filter out inappropriate content using the **OpenAI API**. Chat history is saved to a database for future reference.

---

## Features
- **Real-Time Messaging**: Users can send and receive messages instantly using WebSockets.
- **AI Moderation**: Messages are checked for inappropriate content using OpenAI's moderation API.
- **Chat History**: All messages are saved to a database for persistence.
- **User-Friendly Interface**: A simple and intuitive UI built with React.

---

## Tech Stack
- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express, Socket.io, TypeScript
- **Database**: MongoDB (or SQLite for simplicity)
- **AI Integration**: OpenAI API
- **Deployment**: Vercel (frontend), Render/Heroku (backend)

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (sign up at [OpenAI](https://openai.com/api/))

### Project Structure
```bash
- real-time-chat-app/
├── backend/                  # Backend code
│   ├── src/                  # Source files
│   │   ├── server.ts         # Express server with Socket.io
│   │   ├── openai.ts         # OpenAI moderation logic
│   │   └── db.ts            # Database connection and models
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
├── frontend/                 # Frontend code
│   ├── src/                  # Source files
│   │   ├── components/       # React components
│   │   ├── App.tsx           # Main React component
│   │   └── index.tsx         # Entry point
│   ├── package.json          # Frontend dependencies
│   └── tsconfig.json         # TypeScript configuration
└── README.md                 # Project documentation

