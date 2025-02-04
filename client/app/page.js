"use client";
import { useEffect, useState, useRef } from "react";
import { Chat, Inputs, SignUp } from "@/components";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Home() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const user = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (!user.current) return;
      setChat((prev) => [...prev, msg]);
    });

    socket.on("new_user", (newUser) => {
      if (!user.current) return;
      setChat((prev) => [
        ...prev,
        { content: `${newUser} joined`, type: "server" },
      ]);
    });

    socket.on("flag_message", (flaggedUser) => {
      if (!user.current) return;
      console.log(flaggedUser);
      if (flaggedUser.id === user.current.id) {
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
      ) : (
        <SignUp user={user} socket={socket} input={input} setInput={setInput} />
      )}
    </main>
  );
}
