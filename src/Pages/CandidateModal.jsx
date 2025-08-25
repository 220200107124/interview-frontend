import "./AdminResult.css";
import "./CandidateModal.css";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function CandidateModal({ details, onClose }) {
  if (!details) return null;

  // Prepare attempts data (you can extend this to multiple attempts if needed)
  const attemptsData = [
    {
      quizTitle: details.quizTitle,
      score: details.score,
      totalQuestions: details.totalQuestions,
      date: new Date(details.date).toLocaleDateString(),
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>
          Details for {details?.candidateId?.name} {details?.candidateId?.lname}
        </h2>

        <p><strong>Email:</strong> {details?.candidateId?.email}</p>
        <p><strong>Technology:</strong> {details?.candidateId?.tech}</p>
        <p><strong>Difficulty:</strong> {details?.candidateId?.difficulty}</p>

        <p><strong>Quiz Title:</strong> {details?.quizTitle}</p>
        <p>
          <strong>Score:</strong> {details?.score}/{details?.totalQuestions}
        </p>
        <p><strong>Percentage:</strong> {details?.percentage}%</p>
        <p><strong>Total Attempts:</strong> {details?.attempts}</p>
        <p><strong>Status:</strong> {details?.status}</p>
        <p><strong>Date:</strong> {new Date(details?.date).toLocaleString()}</p>

        <h4>Attempts Chart</h4>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attemptsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, details.totalQuestions || 10]} />
              <Tooltip />
              <Bar dataKey="score" fill="#28ee6aff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="modal-buttons">
          <button className="back-btn" onClick={onClose}>← Back</button>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default CandidateModal;
