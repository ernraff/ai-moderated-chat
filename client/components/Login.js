import { useState } from "react";

const Login = ({ user, socket, username, setUsername, setShowSignUp }) => {
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) return;

    const body = JSON.stringify({ username, password });

    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      console.log("Login successful:", data);
      localStorage.setItem("token", data.token); // Save JWT token
      console.log("token: ", data.token);
      user.current = { username };
      socket.emit("new_user", user.current);

      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Error during login:", err.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-center grid grid-rows-3 gap-2 gradient p-8 rounded-md">
        <h1 className="text-6xl font-bold text-white">Login</h1>
        <h2 className="text-2xl text-white">
          Enter your username and password to log in.
        </h2>

        <input
          type="text"
          className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />
        <input
          type="password"
          className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        <button
          className={`text-xl w-full text-white font-bold py-2 px-3 rounded-md ${
            username && password ? "bg-sky-400" : "bg-slate-400"
          }`}
          disabled={!username || !password}
          onClick={login}
        >
          Login
        </button>

        <div className="text-white text-lg mt-4">
          <span>Don't have an account? </span>
          <button
            className="text-sky-300 underline"
            onClick={() => setShowSignUp(true)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
