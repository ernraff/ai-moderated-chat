import { useState } from "react";

const SignUp = ({ user, socket, username, setUsername }) => {
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    const body = JSON.stringify({ username: username, password });
    if (!username || !password) return;

    try {
      const response = await fetch("http://localhost:3001/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      user.current = { username: username };
      socket.emit("new_user", user.current);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Error during registration:", err.message);
    }
  };

  return (
    <div className="w-full h-full flex flex=col items-center justify-center">
      <div className="text-center grid grid-rows-3 gap-2 gradient p-8 rounded-md">
        <h1 className="text-6xl font-bold text-white">Sign Up</h1>
        <h2 className="text-2xl text-white">
          Enter a username and password to join
        </h2>
        <input
          type="text"
          className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && username && password) {
              registerUser();
            }
          }}
        />
        <input
          type="text"
          className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && username && password) {
              registerUser();
            }
          }}
        />
        <button
          className={`text-xl w-full text-white font-bold py-2 px-3 rounded-md ${
            username ? "bg-sky-400" : "bg-slate-400"
          }`}
          disabled={!username}
          onClick={registerUser}
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default SignUp;
