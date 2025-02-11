"use client";
import { useEffect, useState, useRef } from "react";
import { Chat, Inputs, SignUp, Login } from "@/components";
import { io } from "socket.io-client";

export default function Home() {
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [isClient, setIsClient] = useState(false); // Ensures only client-side rendering
  const [socket, setSocket] = useState(null); // Prevents SSR execution

  const user = useRef(null);

  // Ensure component only renders on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize socket only on client
  useEffect(() => {
    if (!isClient) return;

    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Clean up socket on unmount
    };
  }, [isClient]);

  // Handle incoming socket events
  useEffect(() => {
    if (!socket) return;

    const loadMessages = async (newUser) => {
      if (!user.current) return;
      console.log("Loading messages...");

      if (newUser.username === user.current.username) {
        try {
          const token = localStorage.getItem("token"); // Retrieve token
          const response = await fetch("http://localhost:3001/messages", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach JWT token
            },
          });

          const data = await response.json();
          if (!response.ok) {
            alert(data.error);
            return;
          }
          setChat(data.messages);
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      }
    };

    socket.on("load_messages", loadMessages);
    socket.on("receive_message", (msg) => {
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
      if (flaggedUser.username === user.current.username) {
        setChat((prev) => [
          ...prev,
          {
            content: `Your message was flagged for inappropriate content. Message not sent.`,
            type: "warning",
          },
        ]);
      }
    });

    return () => {
      socket.off("load_messages", loadMessages);
      socket.off("receive_message");
      socket.off("new_user");
      socket.off("flag_message");
    };
  }, [socket]);

  // Prevents hydration error by returning nothing until mounted
  if (!isClient) return null;

  return (
    <main className="h-screen max-h-screen max-w-screen mx-auto md:container md:p-20 md:pt-4">
      {user.current ? (
        <>
          <Chat user={user.current} chat={chat} />
          <Inputs setChat={setChat} user={user.current} socket={socket} />
        </>
      ) : showSignUp ? (
        <SignUp
          user={user}
          socket={socket}
          username={username}
          setUsername={setUsername}
          setShowSignUp={setShowSignUp}
        />
      ) : (
        <Login
          user={user}
          socket={socket}
          username={username}
          setUsername={setUsername}
          setShowSignUp={setShowSignUp}
        />
      )}
    </main>
  );
}
