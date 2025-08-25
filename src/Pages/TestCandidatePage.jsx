import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CandidateQuizpage.css";

function TestCandidatePage() {
  const navigate = useNavigate();

  // Static quiz data
  const quiz = {
    title: "React Fundamentals Quiz",
    category: "React",
    description:
      "This quiz covers the basics of React components, props, and state.",
    instructions:
      "Answer all questions carefully. Each question has one correct answer.",
    questions: [
      {
        text: "What is JSX?",
        options: [
          "A JavaScript library",
          "A syntax extension for JavaScript",
          "A CSS framework",
          "A database",
        ],
        correct: "A syntax extension for JavaScript",
      },
      {
        text: "Which hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correct: "useState",
      },
    ],
  };

  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(""));

  const handleSelect = (qIdx, option) => {
    const updated = [...answers];
    updated[qIdx] = option;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    navigate("/thank-you"); // static redirect
  };

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate("/")} className="back-btn">
        ← Back
      </button>
      <div className="candidate-quiz-container">
        <h1>{quiz.title}</h1>
        <p>
          <strong>Technology:</strong> {quiz.category}
        </p>
        <p>{quiz.description}</p>
        <h3>Instructions</h3>
        <p>{quiz.instructions}</p>
        <h3>Questions</h3>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="question-block">
            <p>
              {idx + 1}. {q.text}
            </p>
            <ul>
              {q.options.map((opt, oIdx) => (
                <li key={oIdx}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleSelect(idx, opt)}
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default TestCandidatePage;
