import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

export default function ManageColleges() {
  const [colleges, setColleges] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const fetchColleges = async () => {
    const res = await api.get("/college");
    setColleges(res.data);
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/college/create", {
      name,
      location,
    });

    setName("");
    setLocation("");
    fetchColleges();
  };

  return (
    <DashboardLayout role="admin">
      <h1 className="text-3xl font-bold mb-6">Manage Colleges</h1>

      {/* Create College Form */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <input
            type="text"
            placeholder="College Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-gray-700"
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded bg-gray-700"
            required
          />

          <button className="bg-indigo-600 px-4 py-2 rounded">
            Add College
          </button>
        </form>
      </div>

      {/* College List */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl mb-4">Existing Colleges</h2>

        {colleges.map((college) => (
          <div
            key={college._id}
            className="border-b border-gray-700 py-2"
          >
            <p className="font-semibold">{college.name}</p>
            <p className="text-sm text-gray-400">{college.location}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}