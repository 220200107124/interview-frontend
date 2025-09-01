import React, { useState, useEffect } from "react";
import { quizAPI } from "../Services/api";

// SVG Icons Components
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SaveIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17,21 17,13 7,13 7,21"></polyline>
    <polyline points="7,3 7,8 15,8"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);



const CreateQuizpage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [saving, setSaving] = useState(false);

  // const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const categories = [
    "all",
    "General",
    "React",
    "JavaScript",
    "Node",
    "Graphic",
    "NextJs",
  ];
  const difficulties = ["all", "Easy", "Beginner", "Intermediate", "Advanced"];

  // Fetch quizzes from API
  useEffect(() => {
    fetchQuizzes();
    console.log("fetching quizzes");
  }, []);

  // fetch quizzes from database
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null); // clear previous errors
      const response = await quizAPI.getQuizzes();
      console.log("Fetched quizzes:", response);
      setQuizzes(response);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError(err.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    // match the search
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || quiz.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || quiz.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  //pagination start here
  const totalPages = Math.ceil(filteredQuizzes.length / pageSize);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  // Handle new quiz creation
  const handleCreateNewQuiz = () => {
    const newQuiz = {
      title: "New Quiz",
      description: "Quiz description",
      category: "General",
      difficulty: "Easy",
      questions: [
        {
          question: "Sample question?",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 1,
        },
      ],
    };
    setCurrentQuiz(newQuiz);
    setShowQuizEditor(true);
  };

  // Handle edit quiz
  const handleEditQuiz = (quiz) => {
    setCurrentQuiz({ ...quiz });
    console.log("editing quiz:", quiz);
    setShowQuizEditor(true);
  };

  // Handle delete quiz
  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizAPI.deleteQuiz(id);
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
        alert("Quiz deleted successfully!");
      } catch (err) {
        alert("Error deleting quiz: " + err.message);
      }
    }
  };
  // handle save quiz
  const handleSaveQuiz = async (updatedQuiz) => {
    try {
      setSaving(true);
      if (updatedQuiz._id) {
        const response = await quizAPI.updateQuiz(updatedQuiz._id, updatedQuiz);
        setQuizzes(
          quizzes.map((quiz) =>
            quiz._id === updatedQuiz._id ? response : quiz
          )
        );
        console.log("quiz upadated", setQuizzes);
        alert("Quiz updated successfully!");
      } else {
        await quizAPI.createQuiz(updatedQuiz);
        await fetchQuizzes(); //refresh quizzes list locally
        alert("Quiz created successfully!");
      }
      setShowQuizEditor(false);
      setCurrentQuiz(null);
    } catch (err) {
      alert("Error saving quiz: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Quiz Editor Component
  const QuizEditor = ({ quiz, onSave, onCancel }) => {
    const [editedQuiz, setEditedQuiz] = useState(quiz);
    const [errors, setErrors] = useState({});

    const updateQuiz = (field, value) => {
      setEditedQuiz({ ...editedQuiz, [field]: value });
      console.log("updating quiz", editedQuiz);
    };
    // update questions
    const updateQuestion = (questionIndex, field, value) => {
      const updatedQuestions = editedQuiz.questions.map((q, index) =>
        index === questionIndex ? { ...q, [field]: value } : q
      );
      setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
    };
    // update queastions options
    const updateQuestionOption = (questionIndex, optionIndex, value) => {
      const updatedQuestions = editedQuiz.questions.map((q, qIndex) =>
        qIndex === questionIndex
          ? {
              ...q,
              options: q.options.map((option, oIndex) =>
                oIndex === optionIndex ? value : option
              ),
            }
          : q
      );
      setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
    };
    //  add question
    const addQuestion = () => {
      const newQuestion = {
        question: "New question?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0,
      };
      setEditedQuiz({
        ...editedQuiz,
        questions: [...editedQuiz.questions, newQuestion],
      });
    };
    // remove question
    const removeQuestion = (questionIndex) => {
      if (editedQuiz.questions.length > 1) {
        setEditedQuiz({
          ...editedQuiz,
          questions: editedQuiz.questions.filter(
            (_, index) => index !== questionIndex
          ),
        });
      }
    };

    const handleSave = () => {
      const newErrors = {};

      // Validation of basic fields
      if (!editedQuiz.title || editedQuiz.title.trim().length < 3) {
        newErrors.title = "Title must be at least 3 characters long";
      }
      if (!editedQuiz.category) {
        newErrors.category = "Category is required";
      }
      if (!editedQuiz.difficulty) {
        newErrors.difficulty = "Difficulty is required";
      }
      if (!editedQuiz.description || editedQuiz.description.trim().length < 5) {
        newErrors.description =
          "Description must be at least 5 characters long";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        onSave(editedQuiz);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {quiz._id ? "Edit Quiz" : "Create New Quiz"}
            </h2>
            <button
              onClick={onCancel}
              disabled={saving}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Title + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={editedQuiz.title}
                  onChange={(e) => updateQuiz("title", e.target.value)}
                  disabled={saving}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={editedQuiz.category}
                  onChange={(e) => updateQuiz("category", e.target.value)}
                  disabled={saving}
                  className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="General">General</option>
                  <option value="React">React</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Node">NodeJs</option>
                  <option value="Graphic">Graphic Designer</option>
                  <option value="Next Js">NextJs</option>
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <select
                value={editedQuiz.difficulty}
                onChange={(e) => updateQuiz("difficulty", e.target.value)}
                disabled={saving}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="Easy">Easy</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="text-sm text-red-500 mt-1">{errors.difficulty}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={editedQuiz.description}
                onChange={(e) => updateQuiz("description", e.target.value)}
                disabled={saving}
                className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Questions Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Questions
                </h3>
                {/* <button
                  onClick={addQuestion}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  <PlusIcon />
                  <span>Add Question</span>
                  
                </button> */}
              </div>

              <div className="space-y-6">
                {editedQuiz.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border rounded-xl p-4 bg-gray-50"
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">
                        Question {questionIndex + 1}
                      </h4>
                      {editedQuiz.questions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(questionIndex)}
                          disabled={saving}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <TrashIcon />
                        </button>
                        
                      )}
                    </div>

                    {/* Question Input */}
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "question",
                          e.target.value
                        )
                      }
                      disabled={saving}
                      placeholder="Enter your question"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 mb-4"
                    />

                    {/* Options */}
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() =>
                              updateQuestion(
                                questionIndex,
                                "correctAnswer",
                                optionIndex
                              )
                            }
                            disabled={saving}
                            className="text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateQuestionOption(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            disabled={saving}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          />
                          
                        </div>
                      ))}
                    </div>
                
                  </div>
                  
                ))}
              </div>
                <button
                  onClick={addQuestion}
                  disabled={saving}
                  className="inline-flex items-center gap-4 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
                >
                  <PlusIcon />
                  <span>Add Question</span>
                  
                </button>
                     
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-50"
            >
              <SaveIcon />
              <span>{saving ? "Saving..." : "Save Quiz"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showQuizEditor) {
    return (
      <QuizEditor
        quiz={currentQuiz}
        onSave={handleSaveQuiz}
        onCancel={() => {
          setShowQuizEditor(false);
          setCurrentQuiz(null);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="quiz-management-app flex items-center justify-center min-h-screen bg-gray-50">
        <div className="container text-center">
          <div className="loading-state">
            <h2 className="text-xl font-semibold text-gray-700">
              Loading quizzes...
            </h2>
            <div className="mt-4 flex justify-center">
              {/* Simple Spinner */}
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-management-app flex items-center justify-center min-h-screen bg-gray-50">
        <div className="container max-w-md w-full text-center">
          <div className="error-state bg-red-50 border border-red-200 p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold text-red-600">
              Error loading quizzes
            </h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={fetchQuizzes}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max w-7xlmx-auto">
          {/* Header */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Quiz Management
            </h1>
            <button
              onClick={handleCreateNewQuiz}
              className="inline-flex items-center  gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hoover:bg-blue-700 transition"
            >
              <PlusIcon />
              <span>Create New Quiz</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === "all" ? "All Difficulties" : difficulty}
                </option>
              ))}
            </select>
          </div>

          {/* Quiz List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white shadow-lg rounded-2xl p-5 flex flex-col hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {quiz.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>

                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                    {quiz.category}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      quiz.difficulty === "Easy"
                        ? "bg-green-100 text-green-600"
                        : quiz.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {quiz.difficulty}
                  </span>
                </div>

                <div className="text-xs text-gray-500 flex justify-between mt-auto">
                  <span>{quiz.questions.length} questions</span>
                  <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-lg ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}

          {filteredQuizzes.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-lg font-semibold text-gray-700">
                No quizzes found
              </h3>
              <p className="text-gray-500">
                {quizzes.length === 0
                  ? "Create your first quiz to get started!"
                  : "Try adjusting your search criteria."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizpage;
