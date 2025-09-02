import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CandidateQuizPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [assignmentId, setAssignmentId] = useState();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
        );

        const candidateData = data?.data?.candidateData;
        let quizData = data?.data?.quizData?.questions || [];
        if (quizData && !Array.isArray(quizData)) quizData = [quizData];

        setAssignmentId(data?.data?._id);

        if (!candidateData) {
          throw new Error("Candidate data not found");
        }

        setCandidate(candidateData);
        setQuizzes(quizData);
      } catch (err) {
        console.error("Error fetching candidate or quizzes:", err);
        setMessage({
          type: "error",
          text: "Unable to load candidate or quizzes.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

  const handleAnswerChange = (quizIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizIndex]: optionIndex,
    }));
  };

  //   if (Object.keys(selectedAnswers).length !== quizzes.length) {
  //     setMessage({
  //       type: "error",
  //       text: " Please answer all questions before submitting!",
  //     });
  //     return;
  //   }

  //   const formattedAnswers = quizzes.map((q, index) => ({
  //     questionIndex: index,
  //     selectedOption: selectedAnswers[index],
  //   }));

  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
  //       {
  //         assignmentId,
  //         candidateId,
  //         candidateName: candidate?.name || "",
  //         candidateEmail: candidate?.email || "",
  //         technology: candidate?.tech || "",
  //         answers: formattedAnswers,
  //       },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     setSubmitted(true);
  //     setMessage({
  //       type: "success",
  //       text: res.data.message || " Quiz submitted successfully!",
  //     });
  //     setTimeout(() => navigate("/thank-you"), 2000);
  //   } catch (err) {
  //     console.error("Submission error:", err);
  //     if (
  //       err.response?.status === 400 &&
  //       err.response?.data?.error?.includes("already")
  //     ) {
  //       setMessage({
  //         type: "info",
  //         text: " You have already submitted this quiz.",
  //       });
  //       setSubmitted(true);
  //     } else {
  //       setMessage({
  //         type: "error",
  //         text: " Error submitting quiz, please try again.",
  //       });
  //     }
  //   }
  // };
  const handleSubmitAll = async () => {
    if (Object.keys(selectedAnswers).length !== quizzes.length) {
      toast.error("Please answer all questions before submitting!");
      return;
    }

    const formattedAnswers = quizzes.map((q, index) => ({
      questionIndex: index,
      selectedOption: selectedAnswers[index],
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
      toast.success(res.data.message || " Quiz submitted successfully!");

      // 🔹 Expire token locally (clear quiz)
      setQuizzes([]);
      setTimeout(() => navigate("/thank-you"), 2000);
    } catch (err) {
      console.error("Submission error:", err);

      if (
        err.response?.status === 400 &&
        err.response?.data?.error?.includes("already")
      ) {
        toast.info(" You have already submitted this quiz.");
        setSubmitted(true);
      } else {
        toast.error(" Error submitting quiz, please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-lg font-semibold">
        Candidate not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="candidate-quiz-container max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          Candidate Quiz Dashboard
        </h1>

        {/* Candidate Info */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
          <p className="text-gray-700">
            <strong>Name:</strong> {candidate.name} {candidate.lname || ""}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {candidate.email}
          </p>
          <p className="text-gray-700">
            <strong>Tech:</strong> {candidate.tech}
          </p>
          <p className="text-gray-700">
            <strong>Difficulty:</strong> {candidate.difficulty}
          </p>
        </div>

        {/* Message box */}
        {message && (
          <div
            className={`p-3 mb-4 rounded-lg font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : message.type === "info"
                ? "bg-blue-100 text-blue-700 border border-blue-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Quiz Questions */}
        {quizzes.length > 0 ? (
          quizzes.map((quizItem, quizIndex) => (
            <div
              key={quizIndex}
              className="question-block mb-6 p-5 bg-white border rounded-xl shadow-md transition hover:shadow-lg"
            >
              <h3 className="font-semibold text-gray-800 mb-3">
                Q{quizIndex + 1} of {quizzes.length}: {quizItem.question}
              </h3>
              <ul className="space-y-3">
                {quizItem.options?.map((opt, optIdx) => (
                  <li key={optIdx}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`quiz-${quizIndex}`}
                        value={optIdx}
                        disabled={submitted}
                        checked={selectedAnswers[quizIndex] === optIdx}
                        onChange={() => handleAnswerChange(quizIndex, optIdx)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition">
                        {opt}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No quiz assigned yet.</p>
        )}

        {/* Submit Button */}
        <button
          className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition"
          onClick={handleSubmitAll}
          disabled={submitted}
        >
          {submitted ? " Submitted" : " Submit All Answers"}
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default CandidateQuizPage;
