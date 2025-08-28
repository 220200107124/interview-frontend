import React, { useState, useEffect } from "react";
import axios from "axios";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalCandidates: 0,
    activeQuizzes: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/state`
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Quizzes */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-700">Total Quizzes</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {stats.totalQuizzes}
          </p>
        </div>

        {/* Total Candidates */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Candidates
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.totalCandidates}
          </p>
        </div>

        {/* Active Quizzes */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-700">
            Active Quizzes
          </h3>
          <p className="text-3xl font-bold text-pink-600 mt-2">
            {stats.activeQuizzes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
