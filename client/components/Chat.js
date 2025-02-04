import { new_user } from "@/assets";
import Image from "next/image";
import { useRef, useEffect } from "react";

const Chat = ({ chat, user }) => {
  const scroller = useRef(null);

  useEffect(() => {
    if (!scroller.current) return;

    scroller.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [chat]);

  return (
    <div className="h-full pb-12 md:p-4">
      <div className="w-full h-full max-h-screen rounded-md overflow-y-auto gradient pt-2 md:pt-6">
        {chat.map((message, index) => {
          message = { ...message, own: message.user?.id === user.id };
          return message.type === "server" ? (
            <ServerMessage key={index} {...message} />
          ) : message.type === "warning" ? (
            <WarningMessage key={index} {...message} />
          ) : (
            <Message key={index} {...message} />
          );
        })}
        <div ref={scroller} className="pb-2 md:pb-6" />
      </div>
    </div>
  );
};

const Message = ({ content, own }) => {
  return (
    <p className={`px-6 py-1 flex ${own && "justify-end"}`}>
      <span
        className={`text-3xl px-6 py-2 rounded-2xl ${
          own ? "bg-sky-400 text-white" : "bg-slate-300"
        }`}
      >
        {content}
      </span>
    </p>
  );
};

const ServerMessage = ({ content }) => {
  return (
    <p className="px-1 md:px-6 py-1 flex">
      <span className="text-xl md:text-3xl text-white flex bg-transparent">
        <Image src={new_user} className="max-w-8 md:w-8 mx-2" alt="new_user" />
        {content}
      </span>
    </p>
  );
};

const WarningMessage = ({ content }) => {
  return (
    <p className="px-1 md:px-6 py-1 flex">
      <span className="text-xl md:text-3xl text-white flex bg-transparent">
        {content}
      </span>
    </p>
  );
};

export default Chat;
