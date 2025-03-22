"use client";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(username, password);
    router.push("/");
  };

  return (
    <div className="bg-white p-6 rounded shadow w-96">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
      >
        Login
      </button>
    </div>
  );
}
