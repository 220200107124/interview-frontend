import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 p-6 overflow-y-auto max-h-[90vh]">
        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">
          Details for {details?.candidateId?.name} {details?.candidateId?.lname}
        </h2>

        {/* Candidate Info */}
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Email:</strong> {details?.candidateId?.email}
          </p>
          <p>
            <strong>Technology:</strong> {details?.candidateId?.tech}
          </p>
          <p>
            <strong>Difficulty:</strong> {details?.candidateId?.difficulty}
          </p>
        </div>

        {/* Quiz Info */}
        <div className="mt-4 space-y-2 text-gray-700">
          <p>
            <strong>Quiz Title:</strong> {details?.quizTitle}
          </p>
          <p>
            <strong>Mobile: </strong>{details?.candidateId?.mobile}
          </p>
          <p>
            <strong>Score:</strong> {details?.score}/{details?.totalQuestions}
          </p>
          <p>
            <strong>Percentage:</strong> {details?.percentage}%
          </p>
          <p>
            <strong>Total Attempts:</strong> {details?.attempts}
          </p>
          <p>
            <strong>Status:</strong> {details?.status}
          </p>
          <p>
            <strong>Date:</strong> {new Date(details?.date).toLocaleString()}
          </p>
        </div>

        {/* Chart */}
        <h4 className="text-lg font-semibold mt-6 mb-2">Attempts Chart</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attemptsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, details?.totalQuestions || 10]} />
              <Tooltip />
              <Bar dataKey="score" fill="#28ee6aff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            ← Back
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateModal;
