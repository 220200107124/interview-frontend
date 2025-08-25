
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './CandidateQuizpage.css';

const CandidateQuizPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [assignmentId, setAssignmentId] = useState();
  const [message, setMessage] = useState(null); //  store success/error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
        );

  const candidateData = data?.data?.candidateData;
  let quizData = data?.data?.quizData?.questions || [];
  // Defensive: ensure quizData is always an array
  if (quizData && !Array.isArray(quizData)) quizData = [quizData];

  setAssignmentId(data?.data?._id);

        if (!candidateData) {
          throw new Error('Candidate data not found');
        }

        setCandidate(candidateData);
        setQuizzes(quizData);
      } catch (err) {
        console.error('Error fetching candidate or quizzes:', err);
        setMessage({ type: 'error', text: 'Unable to load candidate or quizzes.' });
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

//   


const handleSubmitAll = async () => {
  if (Object.keys(selectedAnswers).length !== quizzes.length) {
    setMessage({ type: 'error', text: 'Please answer all questions before submitting!' });
    return;
  }

  const formattedAnswers = quizzes.map((q, index) => ({
    questionIndex: index,
    selectedOption: selectedAnswers[index]   // <-- store index, not text
  }));

  console.log("Formatted Answers", formattedAnswers);

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
      {
        assignmentId,
        candidateId,
        candidateName: candidate?.name || '',
        candidateEmail: candidate?.email || '',
        technology: candidate?.tech || '',
        answers: formattedAnswers,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Server Response", res.data);

    setSubmitted(true);
    setMessage({ type: 'success', text: res.data.message || 'Quiz submitted successfully!' });
    setTimeout(() => navigate('/thank-you'), 2000);

  } catch (err) {
    console.error('Submission error:', err);
    if (err.response?.status === 400 && err.response?.data?.error?.includes("already")) {
      setMessage({ type: 'info', text: 'You have already submitted this quiz.' });
      setSubmitted(true);
    } else {
      setMessage({ type: 'error', text: 'Error submitting quiz, please try again.' });
    }
  }
};





  if (loading) return <div>Loading...</div>;
  if (!candidate) return <div>Candidate not found</div>;

  return (
    
      <div className="candidate-quiz-container">
        <h1>Candidate Quiz Dashboard</h1>

        <p><strong>Name:</strong> {candidate.name} {candidate.lname || ''}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Tech:</strong> {candidate.tech}</p>
        <p><strong>Difficulty:</strong> {candidate.difficulty}</p>

        {/*  Show messages */}
        {message && (
          <div className={`alert ${message.type}`}>
            {message.text}
          </div>
        )}
          
        {quizzes.length > 0 ? (
          quizzes.map((quizItem, quizIndex) => (
            <div key={quizIndex} className="question-block">
              <h3>Q{quizIndex + 1}: {quizItem.question}</h3>
              <ul>
                {quizItem.options?.map((opt, optIdx) => (
                  <li key={optIdx}>
                    <label>
                      <input
                        type="radio"
                        name={`quiz-${quizIndex}`}
                        value={optIdx}
                        disabled={submitted}
                        checked={selectedAnswers[quizIndex] === optIdx}
                        onChange={() => handleAnswerChange(quizIndex, optIdx)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No quiz assigned yet.</p>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmitAll}
          disabled={submitted}
        >
          {submitted ? 'Submitted' : 'Submit All Answers'}
        </button>
      </div>
    
  );
};

 export default CandidateQuizPage;
