import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

export default function MyChoices() {
  const [choices, setChoices] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      const res = await api.get("/candidate/me");
      setProfileCompleted(res.data.profileCompleted);
    };
    checkProfile();
  }, []);

  const fetchChoices = async () => {
    try {
      const res = await api.get("/choice/my");
      setChoices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSeats = async () => {
    try {
      const res = await api.get("/seat");
      setSeats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChoices();
    fetchSeats();
  }, []);

  const addChoice = async (e) => {
    e.preventDefault();
    if (!selectedSeat || !priority) return;

    try {
      setLoading(true);
      await api.post("/choice/add", {
        seat: selectedSeat,
        priority: Number(priority),
      });

      setSelectedSeat("");
      setPriority("");
      await fetchChoices();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding choice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="candidate">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            My Choices
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Manage your preferred branches in priority order.
          </p>
        </div>

        {/* Add Choice Section */}
        {!profileCompleted ? (
          <div className="bg-yellow-900 p-6 rounded-xl mb-8">
            <h2 className="text-lg font-semibold mb-2">⚠ Profile Incomplete</h2>
            <p className="text-sm mb-4">
              Please complete your profile before adding choices.
            </p>
            <a
              href="/profile"
              className="bg-indigo-600 px-4 py-2 rounded inline-block"
            >
              Complete Profile
            </a>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl p-5 sm:p-8 shadow-xl border border-gray-700 mb-8 sm:mb-12">
            <form
              onSubmit={addChoice}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end"
            >
              {/* Seat */}
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-400 mb-2 block">
                  Select Branch & College
                </label>
                <select
                  value={selectedSeat}
                  onChange={(e) => setSelectedSeat(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-700 text-white
                           border border-gray-600 focus:ring-2 
                           focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Choose seat</option>
                  {seats.map((seat) => (
                    <option key={seat._id} value={seat._id}>
                      {seat.branch} — {seat.college.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Priority
                </label>
                <input
                  type="number"
                  min="1"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-700 text-white
                           border border-gray-600 focus:ring-2 
                           focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-indigo-600
                           hover:bg-indigo-700 transition duration-300
                           font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Choice"}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Table Section */}
        {/* Desktop Table */}
        <div className="hidden md:block bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
          <div className="px-8 py-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Your Added Choices
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-8 py-4 text-left">Priority</th>
                  <th className="px-8 py-4 text-left">Branch</th>
                  <th className="px-8 py-4 text-left">College</th>
                  <th className="px-8 py-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {choices.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-gray-700 hover:bg-gray-700/60 transition"
                  >
                    <td className="px-8 py-4">{c.priority}</td>
                    <td className="px-8 py-4 text-indigo-400 font-semibold">
                      {c.seat.branch}
                    </td>
                    <td className="px-8 py-4">{c.seat.college.name}</td>
                    <td className="px-8 py-4">
                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete this choice?")) return;
                          await api.delete(`/choice/${c._id}`);
                          fetchChoices();
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {choices.map((c) => (
            <div
              key={c._id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow"
            >
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Priority</span>
                <span className="font-semibold">{c.priority}</span>
              </div>

              <div className="mb-2">
                <p className="text-indigo-400 font-semibold">{c.seat.branch}</p>
                <p className="text-gray-400 text-sm">{c.seat.college.name}</p>
              </div>

              <button
                onClick={async () => {
                  if (!window.confirm("Delete this choice?")) return;
                  await api.delete(`/choice/${c._id}`);
                  fetchChoices();
                }}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
