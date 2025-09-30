
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CandidateQuizPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 1;

  const [candidate, setCandidate] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [assignmentId, setAssignmentId] = useState();
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizDetails, setQuizDetails] = useState(null);

  // Answer change
  const handleAnswerChange = (quizIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizIndex]: optionIndex,
    }));
  };

  // Submit answers
  const handleSubmitAll = async () => {
    if (submitted) return;

    const formattedAnswers = quizzes.map((q, index) => ({
      questionIndex: index,
      selectedOption: selectedAnswers[index] ?? null,
    }));

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
        {
          assignmentId,
          candidateId,
          candidateName: candidate?.name || "",
          candidateEmail: candidate?.email || "",
          technology: candidate?.tech || "",
          answers: formattedAnswers,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setSubmitted(true);
      toast.success(res.data.message || "Quiz submitted successfully!");
      setTimeout(() => navigate("/thank-you"), 2000);
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.error || "Error submitting quiz, please try again."
      );
    }
  };

  // Fetch candidate & quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
        );

        const candidateData = data?.data?.candidateData;
        let quizData = data?.data?.quizData?.questions || [];

        const durationTime = data?.data?.quizData?.duration;
        setQuizDetails(data?.data?.quizData);
        console.log("quizdata", quizData);

        if (quizData && !Array.isArray(quizData)) quizData = [quizData];
        setAssignmentId(data?.data?._id);

        if (!candidateData) throw new Error("Candidate data not found");

        if (data?.data?.status === "submitted") {
          toast.info("You have submitted this quiz.");
          navigate("/candidate/thank-you");
          return;
        }

        setCandidate(candidateData);
        setQuizzes(quizData);
        setTimeLeft(Number(durationTime) * 60);
      } catch (err) {
        toast.error("Unable to load candidate or quizzes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId, navigate]);

  // Timer
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmitAll();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, submitted]);

  // Timer display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Pagination logic
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="candidate-quiz-container max-w-3xl mx-auto p-10 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
          Candidate Quiz Dashboard
        </h1>

        {!submitted && (
          <div className="text-center text-xl font-bold text-red-600 mb-6 animate-pulse">
            Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-5 rounded-2xl shadow-inner mb-8 border border-blue-100">
          <p>
            <strong className="text-blue-600">Name:</strong> {candidate?.name}
          </p>
          <p>
            <strong className="text-blue-600">Email:</strong> {candidate?.email}
          </p>
          <p>
            <strong className="text-blue-600">Tech:</strong> {candidate?.tech}
          </p>

          <p>
            <strong className="text-blue-600">Description:</strong>{" "}
            {quizDetails?.description}
          </p>

          <p>
            <strong className="text-blue-600">Difficulty:</strong>{" "}
            {candidate?.difficulty}
          </p>
        </div>

        {currentQuizzes.length > 0 && !submitted ? (
          currentQuizzes.map((quizItem, i) => {
            const quizIndex = indexOfFirstQuiz + i;
            return (
              <div
                key={quizIndex}
                className="mb-6 p-6 rounded-2xl border border-gray-200 shadow-md bg-white"
              >
                <h3 className="font-semibold mb-4 text-lg text-gray-800">
                  Q{quizIndex + 1}: {quizItem.question}
                </h3>
                <ul className="space-y-3">
                  {quizItem.options?.map((opt, optIdx) => (
                    <li key={optIdx}>
                      <label
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                          selectedAnswers[quizIndex] === optIdx
                            ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${quizIndex}`}
                          value={optIdx}
                          disabled={submitted}
                          checked={selectedAnswers[quizIndex] === optIdx}
                          onChange={() => handleAnswerChange(quizIndex, optIdx)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        ) : submitted ? (
          <p className="text-green-600 font-semibold text-center text-lg">
            You have already submitted this quiz.
          </p>
        ) : (
          <p className="text-gray-600 text-center">No quiz assigned yet.</p>
        )}

        {/* Pagination */}
        {!submitted && totalPages > 1 && (
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {!submitted && quizzes.length > 0 && (
          <button
            className="w-full py-3 mt-2 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 active:scale-95"
            onClick={handleSubmitAll}
          >
            Submit All Answers
          </button>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default CandidateQuizPage;
