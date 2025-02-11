import { useState } from "react";

const SignUp = ({ user, socket, username, setUsername, setShowSignUp }) => {
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    if (!username || !password) return;

    const body = JSON.stringify({ username, password });

    try {
      const response = await fetch("http://localhost:3001/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      // Set new user and emit event
      user.current = { username };
      socket.emit("new_user", user.current);

      // Clear input fields
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Error during registration:", err.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-center grid grid-rows-3 gap-2 gradient p-8 rounded-md">
        <h1 className="text-6xl font-bold text-white">Sign Up</h1>
        <h2 className="text-2xl text-white">
          Enter a username and password to create an account.
        </h2>

        <input
          type="text"
          className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && registerUser()}
        />
        <input
          type="password"
          className="text-2xl text-center rounded-md p-2 my-2 text-blue-400 placeholder-blue-300 focus:outline-none"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && registerUser()}
        />

        <button
          className={`text-xl w-full text-white font-bold py-2 px-3 rounded-md ${
            username && password ? "bg-sky-400" : "bg-slate-400"
          }`}
          disabled={!username || !password}
          onClick={registerUser}
        >
          Sign Up
        </button>

        {/* Button to go to Login page */}
        <p className="text-white text-lg mt-4">
          Already have an account?{" "}
          <button
            className="text-sky-300 underline"
            onClick={() => setShowSignUp(false)}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
