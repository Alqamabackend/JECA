import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { FaUserGraduate } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-[380px] border border-gray-700"
      >
        
        <div className="flex flex-col items-center mb-6">
          <FaUserGraduate className="text-indigo-500 text-4xl mb-2" />
          <h2 className="text-2xl font-bold text-white">
            JECA Counselling Login
          </h2>
          <p className="text-gray-400 text-sm">
            Enter your credentials to continue
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 p-3 rounded-lg text-white font-semibold"
          >
            Login
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-500 hover:text-indigo-400 font-semibold"
          >
            Register
          </Link>
        </p>

        <p className="text-gray-500 text-xs text-center mt-6">
          © 2026 JECA Counselling. All rights reserved.
        </p>

      </motion.div>
    </div>
  );
}