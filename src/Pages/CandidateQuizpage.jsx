// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CandidateQuizPage = () => {
//   const { candidateId } = useParams();
//   const navigate = useNavigate();

//   const [currentPage, setCurrentPage] = useState(1);
//   const quizzesPerPage = 1;

//   const [candidate, setCandidate] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [assignmentId, setAssignmentId] = useState();
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [quizDetails, setQuizDetails] = useState(null);

//   // ----------------- Submit Answers -----------------
//   const handleSubmitAll = async () => {
//     if (submitted) return;

//     // const formattedAnswers = quizzes.map((q, index) => ({
//     //   questionIndex: index,
//     //   answer: selectedAnswers[index] ?? null,
//     //   type: q.type || "radio",
//     // }));
//     const formattedAnswers = quizzes.map((q, index) => {
//       let ans = selectedAnswers[index];
//       if (q.type === "checkbox" && !Array.isArray(ans)) ans = [];
//       return {
//         questionIndex: index,
//         answer: ans ?? null,
//         type: q.type || "radio",
//       };
//     });

//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
//         {
//           assignmentId,
//           candidateId,
//           candidateName: candidate?.name || "",
//           candidateEmail: candidate?.email || "",
//           technology: candidate?.tech || "",

//           answers: formattedAnswers,
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       setSubmitted(true);
//       toast.success(res.data.message || "Quiz submitted successfully!");
//       setTimeout(() => navigate("/thank-you"), 2000);
//     } catch (err) {
//       console.error("Submission error:", err.response?.data || err.message);
//       toast.error(
//         err.response?.data?.error || "Error submitting quiz, please try again."
//       );
//     }
//   };

//   // ----------------- Fetch Candidate & Quiz -----------------
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
//         );

//         const candidateData = data?.data?.candidateData;
//         let quizData = data?.data?.quizData?.questions || [];

//         const durationTime = data?.data?.quizData?.duration;
//         setQuizDetails(data?.data?.quizData);

//         if (quizData && !Array.isArray(quizData)) quizData = [quizData];
//         setAssignmentId(data?.data?._id);

//         if (!candidateData) throw new Error("Candidate data not found");

//         if (data?.data?.status === "submitted") {
//           toast.info("You have submitted this quiz.");
//           navigate("/thank-you");
//           return;
//         }
//         console.log("status",data.status);

//         setCandidate(candidateData);
//         setQuizzes(quizData);
//         setTimeLeft(Number(durationTime) * 60);
//       } catch (err) {
//         toast.error("Unable to load candidate or quizzes.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [candidateId, navigate]);

//   // ----------------- Timer -----------------
//   useEffect(() => {
//     if (submitted || timeLeft <= 0) return;

//     const timerId = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleSubmitAll();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, submitted]);

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   // ----------------- Pagination -----------------
//   const indexOfLastQuiz = currentPage * quizzesPerPage;
//   const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
//   const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
//   const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen py-12">
//       <div className="candidate-quiz-container max-w-3xl mx-auto p-10 bg-white rounded-3xl shadow-2xl">
//         <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
//           Candidate Quiz Dashboard
//         </h1>

//         {!submitted && (
//           <div className="text-center text-xl font-bold text-red-600 mb-6 animate-pulse">
//             Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//           </div>
//         )}

//         {/* Candidate Info */}
//         <div className="bg-gradient-to-r from-blue-50 to-blue-50 p-5 rounded-2xl shadow-inner mb-8 border border-blue-100">
//           <p>
//             <strong className="text-blue-600">Name:</strong> {candidate?.name}
//           </p>
//           <p>
//             <strong className="text-blue-600">Email:</strong> {candidate?.email}
//           </p>
//           <p>
//             <strong className="text-blue-600">Tech:</strong> {candidate?.tech}
//           </p>
//           <p>
//             <strong className="text-blue-600">Description:</strong>{" "}
//             {quizDetails?.description}
//           </p>
//           <p>
//             <strong className="text-blue-600">Difficulty:</strong>{" "}
//             {quizDetails?.difficulty}
//           </p>
//         </div>

//         {/* Quiz Questions */}
//         {currentQuizzes.length > 0 && !submitted ? (
//           currentQuizzes.map((quizItem, i) => {
//             const quizIndex = indexOfFirstQuiz + i;
//             return (
//               <div
//                 key={quizIndex}
//                 className="mb-6 p-6 rounded-2xl border border-gray-200 shadow-md bg-white"
//               >
//                 <h3 className="font-semibold mb-4 text-lg text-gray-800">
//                   Q{quizIndex + 1}: {quizItem.question}
//                 </h3>

//                 {/* Render based on question type */}
//                 {quizItem.type === "radio" && (
//                   <ul className="space-y-3">
//                     {quizItem.options?.map((opt, optIdx) => (
//                       <li key={optIdx}>
//                         <label
//                           className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
//                             selectedAnswers[quizIndex] === optIdx
//                               ? "bg-blue-100 border-blue-500 text-blue-700 f  ont-medium"
//                               : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//                           }`}
//                         >
//                           <input
//                             type="radio"
//                             name={`quiz-${quizIndex}`}
//                             value={optIdx}
//                             disabled={submitted}
//                             checked={selectedAnswers[quizIndex] === optIdx}
//                             onChange={() =>
//                               setSelectedAnswers((prev) => ({
//                                 ...prev,
//                                 [quizIndex]: optIdx,
//                               }))
//                             }
//                             className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                           />
//                           {opt}
//                         </label>
//                       </li>
//                     ))}
//                   </ul>
//                 )}

//                 {quizItem.type === "checkbox" && (
//                   <ul className="space-y-3">
//                     {quizItem.options?.map((opt, optIdx) => {
//                       const checked =
//                         Array.isArray(selectedAnswers[quizIndex]) &&
//                         selectedAnswers[quizIndex].includes(optIdx);
//                       return (
//                         <li key={optIdx}>
//                           <label
//                             className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
//                               checked
//                                 ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
//                                 : "bg-gray-50 border-gray-200 hover:bg-gray-100"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               value={optIdx}
//                               disabled={submitted}
//                               checked={checked}
//                               // onChange={(e) => {
//                               //   setSelectedAnswers((prev) => {
//                               //     const prevArr = Array.isArray(prev[quizIndex])
//                               //       ? [...prev[quizIndex]]
//                               //       : [];
//                               //     if (e.target.checked) {
//                               //       prevArr.push(optIdx);
//                               //     } else {
//                               //       const idx = prevArr.indexOf(optIdx);
//                               //       if (idx > -1) prevArr.splice(idx, 1);
//                               //     }
//                               //     return { ...prev, [quizIndex]: prevArr };
//                               //   });
//                               // }}
//                               onChange={(e) => {
//                                 setSelectedAnswers((prev) => {
//                                   const prevArr = Array.isArray(prev[quizIndex])
//                                     ? [...prev[quizIndex]]
//                                     : [];
//                                   const optNumber = Number(optIdx); // <-- convert to number
//                                   if (e.target.checked) {
//                                     if (!prevArr.includes(optNumber))
//                                       prevArr.push(optNumber);
//                                   } else {
//                                     const idx = prevArr.indexOf(optNumber);
//                                     if (idx > -1) prevArr.splice(idx, 1);
//                                   }
//                                   return { ...prev, [quizIndex]: prevArr };
//                                 });
//                               }}
//                               className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                             />
//                             {opt}
//                           </label>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}

//                 {quizItem.type === "text" && (
//                   <input
//                     type="text"
//                     placeholder="Enter your answer"
//                     disabled={submitted}
//                     value={selectedAnswers[quizIndex] || ""}
//                     onChange={(e) =>
//                       setSelectedAnswers((prev) => ({
//                         ...prev,
//                         [quizIndex]: e.target.value,
//                       }))
//                     }
//                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 )}
//               </div>
//             );
//           })
//         ) : submitted ? (
//           <p className="text-green-600 font-semibold text-center text-lg">
//             You have already submitted this quiz.
//           </p>
//         ) : (
//           <p className="text-gray-600 text-center">No quiz assigned yet.</p>
//         )}

//         {/* Pagination */}
//         {!submitted && totalPages > 1 && (
//           <div className="flex justify-center gap-3 mb-6">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="px-4 py-2 font-semibold">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {!submitted && quizzes.length > 0 && (
//           <button
//             className="w-full py-3 mt-2 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 active:scale-95"
//             onClick={handleSubmitAll}
//           >
//             Submit All Answers
//           </button>
//         )}
//       </div>

//       <ToastContainer position="top-center" autoClose={2000} />
//     </div>
//   );
// };

// export default CandidateQuizPage;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Clock, FileText, AlertCircle, CheckCircle } from "lucide-react";

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
  const [quizStarted, setQuizStarted] = useState(false); // New state

  // ----------------- Submit Answers -----------------
  const handleSubmitAll = async () => {
    if (submitted) return;

    const formattedAnswers = quizzes.map((q, index) => {
      let ans = selectedAnswers[index];
      if (q.type === "checkbox" && !Array.isArray(ans)) ans = [];
      return {
        questionIndex: index,
        answer: ans ?? null,
        type: q.type || "radio",
      };
    });

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

  // ----------------- Fetch Candidate & Quiz -----------------
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

        if (quizData && !Array.isArray(quizData)) quizData = [quizData];
        setAssignmentId(data?.data?._id);

        if (!candidateData) throw new Error("Candidate data not found");

        if (data?.data?.status === "submitted") {
          toast.info("You have submitted this quiz.");
          navigate("/thank-you");
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

  // ----------------- Timer (only starts when quiz is started) -----------------
  useEffect(() => {
    if (!quizStarted || submitted || timeLeft <= 0) return;

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
  }, [timeLeft, submitted, quizStarted]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ----------------- Pagination -----------------
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  // ----------------- Start Quiz Handler -----------------
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // ----------------- Instructions Screen -----------------
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
                Welcome to Your Quiz
              </h1>
              <p className="text-gray-600 text-lg">
                Please read the instructions carefully before starting
              </p>
            </div>

            {/* Candidate Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8 border border-blue-200">
              <h2 className="text-xl font-bold text-blue-700 mb-4">
                Candidate Information
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Name:</strong> {candidate?.name}
                </p>
                <p>
                  <strong>Email:</strong> {candidate?.email}
                </p>
                <p>
                  <strong>Technology:</strong> {candidate?.tech}
                </p>
              </div>
            </div>

            {/* Quiz Details */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl mb-8 border border-indigo-200">
              <h2 className="text-xl font-bold text-indigo-700 mb-4">
                Quiz Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Questions</p>
                    <p className="font-semibold text-gray-800">
                      {quizzes.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-800">
                      {quizDetails?.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="font-semibold text-gray-800">
                      {quizDetails?.difficulty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-800">
                      {quizDetails?.category}
                    </p>
                  </div>
                </div>
              </div>
              {quizDetails?.description && (
                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <p className="text-sm text-gray-600 mb-1">Description:</p>
                  <p className="text-gray-700">{quizDetails.description}</p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Important Instructions
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    The timer will start immediately when you click "Start
                    Quiz"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    You must complete the quiz within the given time limit
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    The quiz will auto-submit when the timer reaches zero
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    You can navigate between questions using Previous/Next
                    buttons
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Make sure to click "Submit All Answers" when you're done
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Once submitted, you cannot change your answers
                  </span>
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Quiz
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    );
  }

  // ----------------- Quiz Screen -----------------
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="candidate-quiz-container max-w-3xl mx-auto p-10 bg-white rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
          Candidate Quiz Dashboard
        </h1>

        {!submitted && (
          <div className="text-center text-xl font-bold text-red-600 mb-6 animate-pulse">
            Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
        )}

        {/* Candidate Info */}
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
            {quizDetails?.difficulty}
          </p>
        </div>

        {/* Quiz Questions */}
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

                {/* Render based on question type */}
                {quizItem.type === "radio" && (
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
                            onChange={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [quizIndex]: optIdx,
                              }))
                            }
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          {opt}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}

                {quizItem.type === "checkbox" && (
                  <ul className="space-y-3">
                    {quizItem.options?.map((opt, optIdx) => {
                      const checked =
                        Array.isArray(selectedAnswers[quizIndex]) &&
                        selectedAnswers[quizIndex].includes(optIdx);
                      return (
                        <li key={optIdx}>
                          <label
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                              checked
                                ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              value={optIdx}
                              disabled={submitted}
                              checked={checked}
                              onChange={(e) => {
                                setSelectedAnswers((prev) => {
                                  const prevArr = Array.isArray(prev[quizIndex])
                                    ? [...prev[quizIndex]]
                                    : [];
                                  const optNumber = Number(optIdx);
                                  if (e.target.checked) {
                                    if (!prevArr.includes(optNumber))
                                      prevArr.push(optNumber);
                                  } else {
                                    const idx = prevArr.indexOf(optNumber);
                                    if (idx > -1) prevArr.splice(idx, 1);
                                  }
                                  return { ...prev, [quizIndex]: prevArr };
                                });
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            {opt}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {quizItem.type === "text" && (
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    disabled={submitted}
                    value={selectedAnswers[quizIndex] || ""}
                    onChange={(e) =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [quizIndex]: e.target.value,
                      }))
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                )}
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
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
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
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
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