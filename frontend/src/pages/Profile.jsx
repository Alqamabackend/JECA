import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

export default function Profile() {
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("GEN");
  const [qualification, setQualification] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/candidate/create", {
      rank: Number(rank),
      category,
      qualification,
    });

    alert("Profile Saved");
  };

  return (
    <DashboardLayout role="candidate">
      <h1 className="text-2xl font-bold mb-6">Complete Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="number"
          placeholder="Rank"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
        >
          <option value="GEN">GEN</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>

        <input
          type="text"
          placeholder="Qualification"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          className="w-full p-3 rounded bg-gray-700"
        />

        <button className="bg-indigo-600 px-4 py-2 rounded">
          Save
        </button>
      </form>
    </DashboardLayout>
  );
}