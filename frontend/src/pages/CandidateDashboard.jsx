import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

export default function CandidateDashboard() {
  const [profile, setProfile] = useState(null);
  const [allotment, setAllotment] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/candidate/me");

        if (!res.data.profileCompleted) {
          setProfileCompleted(false);
          setProfile(null);
        } else {
          setProfileCompleted(true);
          setProfile(res.data);
        }

        const allotRes = await api.get("/allotment/my");
        setAllotment(allotRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout role="candidate">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>
      {!profileCompleted && (
        <div className="bg-yellow-900 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-2">⚠ Profile Incomplete</h2>
          <p className="mb-4">
            Please complete your profile to participate in counselling.
          </p>
          <a
            href="/profile"
            className="bg-indigo-600 px-4 py-2 rounded inline-block"
          >
            Complete Profile
          </a>
        </div>
      )}
      {profileCompleted && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Rank Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg text-gray-400">Your Rank</h2>
            <p className="text-3xl font-bold text-indigo-500 mt-2">
              {profile?.rank || "-"}
            </p>
          </div>

          {/* Category Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg text-gray-400">Category</h2>
            <p className="text-2xl font-semibold mt-2">
              {profile?.category || "-"}
            </p>
          </div>

          {/* Allotment Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg text-gray-400">Allotment Status</h2>

            {allotment ? (
              <div className="mt-2 space-y-2">
                {allotment.status === "ALLOTTED" && (
                  <button
                    onClick={async () => {
                      await api.post("/allotment/accept");
                      alert("Seat Accepted");
                      window.location.reload();
                    }}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                  >
                    Accept Seat
                  </button>
                )}
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={
                      allotment.status === "ACCEPTED"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {allotment.status}
                  </span>
                </p>
                <p className="text-indigo-400 font-semibold">
                  {allotment.seat.branch}
                </p>
                <p className="text-sm text-gray-400">
                  {allotment.seat.college.name}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-red-400">Not Allotted Yet</p>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
