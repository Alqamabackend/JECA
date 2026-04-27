import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

export default function ManageSeats() {
  const [colleges, setColleges] = useState([]);
  const [seats, setSeats] = useState([]);
  const [branch, setBranch] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [category, setCategory] = useState("GEN");
  const [selectedCollege, setSelectedCollege] = useState("");


  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete?")) {
    await api.delete(`/seat/${id}`);
    fetchData();
  }
};

  const fetchData = async () => {
    const collegeRes = await api.get("/college/");
    const seatRes = await api.get("/seat/");
    setColleges(collegeRes.data);
    setSeats(seatRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!selectedCollege || !branch || !totalSeats) {
    alert("All fields are required");
    return;
  }

  if (Number(totalSeats) <= 0) {
    alert("Seats must be greater than 0");
    return;
  }

    await api.post("/seat/create", {
      college: selectedCollege,
      branch,
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      category,
    });

    setBranch("");
    setTotalSeats("");
    setCategory("GEN");
    setSelectedCollege("");
    fetchData();
  };

  return (
    <DashboardLayout role="admin">
      <h1 className="text-3xl font-bold mb-6">Manage Seats</h1>

      {/* Create Form */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="p-2 rounded bg-gray-700"
          >
            <option value="">Select College</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="p-2 rounded bg-gray-700"
          />

          <input
            type="number"
            placeholder="Total Seats"
            value={totalSeats}
            onChange={(e) => setTotalSeats(e.target.value)}
            className="p-2 rounded bg-gray-700"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded bg-gray-700"
          >
            <option value="GEN">GEN</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 rounded px-4 py-2"
          >
            Create
          </button>
        </form>
      </div>

      {/* Seat Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">College</th>
              <th className="p-3 text-left">Branch</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Available</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {seats.map((s) => (
              <tr key={s._id} className="border-t border-gray-700">
                <td className="p-3">{s.college.name}</td>
                <td className="p-3">{s.branch}</td>
                <td className="p-3">{s.category}</td>
                <td className="p-3">{s.totalSeats}</td>
                <td className="p-3">{s.availableSeats}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}