import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "candidate",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
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
          <FaUserPlus className="text-indigo-500 text-4xl mb-2" />
          <h2 className="text-2xl font-bold text-white">
            JECA Register
          </h2>
          <p className="text-gray-400 text-sm">
            Create your account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 p-3 rounded-lg text-white font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-500 hover:text-indigo-400 font-semibold"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}