import { useEffect, useState } from "react";
import "./AdminResult.css";
// import AdminSideBar from "../Components/AdminSideBar";
// import Footer from "../Components/Footer";
import CandidateModal from "./CandidateModal";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

// import { useNavigate } from "react-router-dom";

function AdminResult() {
  const [results, setResults] = useState([]);
  const [candidateSummary, setCandidateSummary] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  // const handleDashBoard = () => navigate("/admin");

  useEffect(() => {
  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/result`);
      const data = await res.json();
      console.log("=== Raw Results from API ===", data); //  all results from API
      setResults(data);

      const summary = {};
      data.forEach((r) => {
        // Debug log each record
        console.log(
          `Candidate: ${r.candidateName}, Quiz: ${r.quizTitle}, Tech: ${r.tech}, Score: ${r.score}, Total Qs: ${r.totalQuestions}, Status: ${r.status}, Date: ${r.date}`
        );

        // Unique key per candidate + quiz title
        const key = `${r.candidateName}__${r.quizTitle}`;
        if (!summary[key]) {
          summary[key] = {
            candidateName: r.candidateName,
            quizTitle: r.quizTitle,
            tech: r.tech,
            attempts: 0,
            totalScore: 0,
            attemptsData: [],
          };
          console.log(" First entry for:", r.candidateName, "in", r.quizTitle);

        }
        summary[key].attempts += 1;
        summary[key].totalScore += r.score;
        summary[key].attemptsData.push(r);

        console.log(
          ` Updated Summary [${key}]: Attempts=${summary[key].attempts}, TotalScore=${summary[key].totalScore}`
        );
      });

      // Sort each quiz's attempts by latest first
      Object.keys(summary).forEach((key) => {
        summary[key].attemptsData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        console.log(
          ` Sorted Attempts for ${key}:`,
          summary[key].attemptsData.map((x) => ({
            score: x.score,
            date: x.date,
          }))
        );
      });

      console.log(" Final Candidate Summary", summary);
      setCandidateSummary(summary);
    } catch (error) {
      console.error(" Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, []);


  // Chart: average score per quiz per candidate
  const chartData = Object.keys(candidateSummary).map((key) => ({
    candidateName: candidateSummary[key].candidateName,
    quizTitle: candidateSummary[key].quizTitle,
    averageScore:
      candidateSummary[key].totalScore / candidateSummary[key].attempts,
    fill:
      candidateSummary[key].totalScore > 0 ? "#82ca9d" : "#8884d8",
  }));
 

  // Latest attempt for each quiz per candidate
  const latestResults = Object.keys(candidateSummary).map(
    (key) => candidateSummary[key].attemptsData[0]
  );

  console.log("latestResults",latestResults)

  return (
    <>
      <main className="results-container">
        <h1>Quiz Results</h1>
        {/* <button className="back-btn" onClick={handleDashBoard}>
          ← Back to Dashboard
        </button> */}

        {loading ? (
          <p>Loading results...</p>
        ) : results.length === 0 ? (
          <p>No results available yet.</p>
        ) : (
          <>
            {/* Charts */}
            <div className="chart-section">
              <h3>Average Scores per Quiz</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quizTitle" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="averageScore">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quizTitle" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#4facfe"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Quiz</th>
                    <th>Technology</th>
                    <th>Score</th>
                    <th>Attempts</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {latestResults.map((r, idx) => {
                    const key = `${r.candidateName}__${r.quizTitle}`;
                    const attempts = candidateSummary[key]?.attempts || 1;
                    return (
                      <tr key={`${r._id}-${idx}`}>
                        <td>{r?.candidateId?.name}</td>
                        <td>{r.quizTitle}</td>
                        <td>{r.tech}</td>
                        <td>
                          {r.score} / {r.totalQuestions}
                        </td>
                        <td>{attempts}</td>
                        <td>{r.status || "Submitted"}</td>
                        <td>{new Date(r.date).toLocaleString()}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() =>
                              setSelectedCandidate(r)
                            }
                          >
                            View Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
      {/* <Footer /> */}

      {selectedCandidate && (
        <CandidateModal
          details={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
}

export default AdminResult;
