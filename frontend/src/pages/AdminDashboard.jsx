import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [seats, setSeats] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalSeats = seats.reduce((acc, s) => acc + s.totalSeats, 0);

  const usedSeats = seats.reduce(
    (acc, s) => acc + (s.totalSeats - s.availableSeats),
    0,
  );

  const utilization = totalSeats
    ? ((usedSeats / totalSeats) * 100).toFixed(1)
    : 0;

  const fetchData = async () => {
    try {
      const cRes = await api.get("/candidate/all");
      const sRes = await api.get("/seat/");
      const aRes = await api.get("/allotment/all");

      console.log(cRes.data);
      setCandidates(cRes.data);
      setSeats(sRes.data);
      setAllotments(aRes.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const runAllotment = async () => {
    try {
      setLoading(true);
      await api.post("/allotment/run");
      await fetchData();
    } catch (err) {
      alert("Error running allotment");
    } finally {
      setLoading(false);
    }
  };
  const acceptedCount = allotments.filter(
    (a) => a.status === "ACCEPTED",
  ).length;

  const pendingCount = allotments.filter((a) => a.status === "ALLOTTED").length;

  return (
    <DashboardLayout role="admin">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-6 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Total Candidates</h2>
          <p className="text-3xl text-indigo-500 mt-2">{candidates.length}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Total Seats</h2>
          <p className="text-3xl text-indigo-500 mt-2">{seats.length}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Total Allotted</h2>
          <p className="text-3xl text-indigo-500 mt-2">{allotments.length}</p>
        </div>
        {/* Accepted */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Accepted</h2>
          <p className="text-3xl text-green-500 mt-2">{acceptedCount}</p>
        </div>

        {/* Pending */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Pending</h2>
          <p className="text-3xl text-yellow-500 mt-2">{pendingCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-gray-400">Seat Utilization</h2>

          <p className="text-3xl text-purple-500 mt-2">{utilization}%</p>

          <p className="text-sm text-gray-400 mt-1">
            {usedSeats} / {totalSeats} Seats Filled
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-2 rounded mt-3">
            <div
              className="h-2 rounded bg-purple-500"
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={runAllotment}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Allotment"}
      </button>
      <button
        onClick={async () => {
          if (!window.confirm("Reset all allotments?")) return;

          await api.post("/allotment/reset");
          alert("Allotment Reset Successfully");
          fetchData();
        }}
        className="ml-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
      >
        Reset Allotment
      </button>
      {/* export csv  */}
      <button
        onClick={async () => {
          const token = localStorage.getItem("token");

          const response = await fetch(
            "http://localhost:5000/api/allotment/export",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = "allotment-results.csv";
          a.click();
        }}
        className="ml-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
      >
        Export CSV
      </button>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Allotment Results</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Branch</th>
                <th className="p-3 text-left">College</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {allotments.map((a) => (
                <tr key={a._id} className="border-t border-gray-700">
                  <td className="p-3">{a.candidate.user.name}</td>
                  <td className="p-3">{a.candidate.rank}</td>
                  <td className="p-3">{a.candidate.category}</td>
                  <td className="p-3 text-indigo-400">{a.seat.branch}</td>
                  <td className="p-3">{a.seat.college.name}</td>
                  <td className="p-3">
                    <span
                      className={
                        a.status === "ACCEPTED"
                          ? "text-green-400 font-semibold"
                          : "text-yellow-400 font-semibold"
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
