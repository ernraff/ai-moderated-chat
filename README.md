# Real-Time Chat App with AI Moderation

## Overview

This is a real-time chat application built with Node.js, Next.js, JavaScript, React, and Socket.io. The app allows users to send and receive messages in real-time, with AI-powered moderation to filter out inappropriate content using the OpenAI API. Chat history is saved to a database for future reference.

## Features

- **Real-Time Messaging**: Users can send and receive messages instantly using WebSockets.
- **AI Moderation**: Messages are checked for inappropriate content using OpenAI's moderation API.
- **Chat History**: All messages are saved to a database for persistence.
- **User-Friendly Interface**: A simple and intuitive UI built with React.

## Tech Stack

- **Frontend**: Next.js (React, JavaScript)
- **Backend**: Node.js, Express, Socket.io, JavaScript
- **Database**: MongoDB
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/) (v16 or higher)** - Required to run both the backend and Next.js frontend
- **[npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)** - To manage dependencies
- **[OpenAI API key](https://openai.com/)** - Required for AI moderation

## Installation

### Clone the repository

```sh
git clone https://github.com/yourusername/realtime-chat-ai.git
cd realtime-chat-ai
```

### Install dependencies

```sh
npm install  # or yarn install
```

### Start the backend server

```sh
npm run server  # or yarn server
```

### Start the frontend

```sh
npm run dev  # or yarn dev
```

## Usage

1. Open the frontend in your browser (default: `http://localhost:3000`).
2. Join the chat and send messages.
3. Messages are checked using AI moderation before being broadcasted.
4. Flagged messages notify the sender without being broadcast.
5. Chat history is stored for persistence. Upon joining the chat, new users will see chat history.
