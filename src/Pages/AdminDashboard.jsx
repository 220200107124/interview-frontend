import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  //  Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 3; // adjust as needed

  useEffect(() => {
    fetchQuizzes();
  }, [setCurrentPage]);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/quizzes`
      );
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    }
  };

  // const handleCreateQuiz = () => navigate("/create-quiz");
  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/admin-login");
  // };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure to delete this quiz?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to delete quiz", err);
    }
  };

  //  Calculate quizzes to show on current page
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
      
      <div>
    
        <div className="quiz-list">
          <h2>Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <p>No quizzes found.</p>
          ) : (
            <><table>
  <thead>
    <tr>
      <th>Title</th>
      <th>Category</th>
      <th>Difficulty</th>
      <th>Questions</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentQuizzes.map((quiz) => (
      <tr key={quiz._id}>
        <td data-label="Title">{quiz.title}</td>
        <td data-label="Category">{quiz.category}</td>
        <td data-label="Difficulty">{quiz.difficulty}</td>
        <td data-label="Questions">{quiz.questions.length}</td>
        <td data-label="Actions">
          <button
            className="manage-btn"
            onClick={() =>
              navigate("/create-quiz", { state: { quiz } })
            }
          >
            Manage
          </button>
          <button
            className="deletes-btn"
            onClick={() => handleDeleteQuiz(quiz._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

              {/*  Pagination buttons */}
              {/*  Pagination buttons with Prev / Next */}
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`pagination-btn ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
        
      </div>
  );
}

export default AdminDashboard;
