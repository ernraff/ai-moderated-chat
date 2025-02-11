"use client";
import { useEffect, useState, useRef } from "react";
import { Chat, Inputs, SignUp, Login } from "@/components";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  const user = useRef(null);

  useEffect(() => {
    socket.on("load_messages", async (newUser) => {
      if (!user.current) return;
      console.log("Loading messages...");
      // upon connection, set chat state with loaded messages
      if (newUser.username === user.current.username) {
        const response = await fetch("http://localhost:3001/messages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error);
          return;
        }

        const messages = data.messages;

        setChat(messages);
        // console.log("Chat: ", chat);
      }
    });
    // console.log(chat);
    socket.on("receive_message", (msg) => {
      // console.log(msg.user);
      if (!user.current) return;
      setChat((prev) => [...prev, msg]);
    });

    socket.on("new_user", (newUser) => {
      if (!user.current) return;
      setChat((prev) => [
        ...prev,
        { content: `${newUser.username} joined`, type: "server" },
      ]);
    });

    socket.on("flag_message", (flaggedUser) => {
      if (!user.current) return;
      // console.log(flaggedUser);
      if (flaggedUser.username === user.current.username) {
        setChat((prev) => [
          ...prev,
          {
            content: `Your message was flagged for inappropriate content.  Message not sent.`,
            type: "warning",
          },
        ]);
      }
    });

    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
      socket.off("new_user");
      socket.off("flag_message");
    };
  });

  return (
    <main className="h-screen max-h-screeen max-w-screen mx-auto md:container md:p-20 md:pt-4">
      {user.current ? (
        <>
          <Chat user={user.current} chat={chat} />
          <Inputs setChat={setChat} user={user.current} socket={socket} />
        </>
      ) : showSignUp ? ( // Toggle between SignUp and Login
        <SignUp
          user={user}
          socket={socket}
          username={username}
          setUsername={setUsername}
          setShowSignUp={setShowSignUp} // Allow switching to Login
        />
      ) : (
        <Login
          user={user}
          socket={socket}
          username={username}
          setUsername={setUsername}
          setShowSignUp={setShowSignUp} // Allow switching to SignUp
        />
      )}
    </main>
  );
}
