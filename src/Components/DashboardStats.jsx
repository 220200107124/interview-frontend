import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardStats.css";

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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/state`); 
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [setStats]);

  if (loading) {
    return <div className="container"><p>Loading stats...</p></div>;
  }

  return (
    <div className="container">
      <div className="header">
        <div className="stat-box">
          <h3>Total Quizzes</h3>
          <p>{stats.totalQuizzes}</p>
        </div>
        <div className="stat-box">
          <h3>Total Candidates</h3>
          <p>{stats.totalCandidates}</p>
        </div>
        <div className="stat-box">
          <h3>Active Quizzes</h3>
          <p>{stats.activeQuizzes}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
