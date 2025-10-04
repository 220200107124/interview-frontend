
// export default CreateQuizpage;
import React, { useState, useEffect } from "react";
import { quizAPI } from "../Services/api";
import { Search, Edit, Trash2, Save, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const categories = [
    "General",
    "React",
    "JavaScript",
    "Node",
    "Graphic Designer",
    "NextJs",
  ];
  const difficulties = ["all", "Easy", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    fetchQuizzes();
  }, []);

  /**
   * Fetches quizzes using the provided API service.
   */
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      // ✅ Using actual API call
      const response = await quizAPI.getQuizzes();
      setQuizzes(response);
    } catch (err) {
      console.error("API Error fetching quizzes:", err);
      toast.error("Error fetching quizzes: " + (err.message || "Failed to connect to API"));
      setError(err.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || quiz.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredQuizzes.length / pageSize);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, difficultyFilter]);
  

  const handleCreateNewQuiz = () => {
    const newQuiz = {
      title: "New Quiz",
      description: "Quiz description",
      category: "General",
      difficulty: "Easy",
      duration: 10,
      questions: [
        {
          type: "radio", // ✅ Corrected type: lowercase for API compatibility
          question: "Sample multiple choice question?",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: 0,
        },
      ],
    };
    setCurrentQuiz(newQuiz);
    setShowQuizEditor(true);
  };

  const handleEditQuiz = (quiz) => {
    setCurrentQuiz({ ...quiz });
    setShowQuizEditor(true);
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await quizAPI.deleteQuiz(id); 
        
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
        toast.success("Quiz deleted successfully!");
      } catch (err) {
        toast.error("Error deleting quiz: " + (err.message || "Failed to delete"));
      }
    }
  };

  const handleSaveQuiz = async (updatedQuiz) => {
    try {
      setSaving(true);
      if (!updatedQuiz.duration || updatedQuiz.duration <= 0) {
        toast.error("Duration must be greater than 0");
        return;
      }
      
      let response;

      if (updatedQuiz._id) {
        // --- UPDATING existing quiz ---
        response = await quizAPI.updateQuiz(updatedQuiz._id, updatedQuiz);
        setQuizzes(
          quizzes.map((quiz) =>
            quiz._id === updatedQuiz._id ? response : quiz
          )
        );
        toast.success("Quiz updated successfully!");
      } else {
        // --- CREATING new quiz ---
        response = await quizAPI.createQuiz(updatedQuiz);
        
        if (!response || !response._id) {
            throw new Error("Server failed to return created quiz ID.");
        }
        
        // ✅ FIX: Update state immediately with the new quiz object (with ID)
        setQuizzes((prevQuizzes) => [response, ...prevQuizzes]);
        toast.success("Quiz created successfully!");
      }
      
      setShowQuizEditor(false);
      setCurrentQuiz(null);
    } catch (err) {
      console.error("API Error saving quiz:", err);
      // Use the server's error message if available
      const errorMessage = err.response?.data?.error || err.message || "Failed to save.";
      toast.error("Error saving quiz: " + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------------------------------------
  // Quiz Editor Component
  // -----------------------------------------------------------------------
  const QuizEditor = ({ quiz, onSave, onCancel }) => {
    const [editedQuiz, setEditedQuiz] = useState(quiz);
    const [errors, setErrors] = useState({});

    const updateQuiz = (field, value) => {
      setEditedQuiz({ ...editedQuiz, [field]: value });
    };

    const updateQuestion = (questionIndex, field, value) => {
      const updatedQuestions = editedQuiz.questions.map((q, index) => {
        if (index === questionIndex) {
          const updatedQuestion = { ...q, [field]: value };
          
          const defaultOptions = ["Option 1", "Option 2", "Option 3", "Option 4"];
          const existingOptions = Array.isArray(q.options) && q.options.length > 0 ? q.options : defaultOptions;

          // ✅ FIX: Use lowercase type strings when switching types
          if (field === "type") {
            if (value === "text") { // FIX
              updatedQuestion.correctAnswer = "";
              updatedQuestion.options = [];
            } else if (value === "radio") { // FIX
              updatedQuestion.correctAnswer = 0;
              updatedQuestion.options = existingOptions;
            } else if (value === "checkbox") { // FIX
              updatedQuestion.correctAnswer = [];
              updatedQuestion.options = existingOptions;
            }
          }

          return updatedQuestion;
        }
        return q;
      });
      setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
    };

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
    
    const toggleCheckboxAnswer = (questionIndex, optionIndex) => {
        const updatedQuestions = editedQuiz.questions.map((q, qIndex) => {
            if (qIndex === questionIndex && q.type.toLowerCase() === "checkbox") {
                const currentAnswers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
                const updatedAnswers = currentAnswers.includes(optionIndex)
                    ? currentAnswers.filter((i) => i !== optionIndex)
                    : [...currentAnswers, optionIndex];
                return { ...q, correctAnswer: updatedAnswers.sort((a, b) => a - b) };
            }
            return q;
        });
        setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
    };


    const addQuestion = () => {
      const newQuestion = {
        type: "radio", // ✅ FIX: Use lowercase
        question: "New question?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0,
      };
      setEditedQuiz({
        ...editedQuiz,
        questions: [...editedQuiz.questions, newQuestion],
      });
    };

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
      const quizToSave = { ...editedQuiz };

      // --- Main Quiz Validation ---
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
        newErrors.description = "Description must be at least 5 characters long";
      }
      if (!editedQuiz.duration || editedQuiz.duration <= 0) {
        newErrors.duration = "Duration must be greater than 0";
      }

      // --- Question Validation & Final Type Formatting ---
      quizToSave.questions = quizToSave.questions.map(q => ({
          ...q,
          // Ensure type is always lowercase before passing to onSave/API
          type: q.type.toLowerCase()
      }));

      quizToSave.questions.forEach((q, index) => {
        if (!q.question || q.question.trim().length === 0) {
            newErrors[`question_${index}`] = "Question text is required";
        }
        
        // ✅ FIX: Use lowercase types in validation
        if (q.type === "text" && (!q.correctAnswer || String(q.correctAnswer).trim() === "")) {
          newErrors[`question_${index}`] = "Fill in the Blank questions must have a correct answer";
        }
        if (q.type === "checkbox" && (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0)) {
          newErrors[`question_${index}`] = "Select at least one correct answer for Multi-Select questions";
        }
        
        if ((q.type === "radio" || q.type === "checkbox") && Array.isArray(q.options)) {
            const hasEmptyOption = q.options.some(opt => !opt || opt.trim() === "");
            if (hasEmptyOption) {
                newErrors[`question_${index}_options`] = "All options must be filled out.";
            }
        }
      });

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        onSave({ ...quizToSave, duration: Number(quizToSave.duration) });
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
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Title + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={editedQuiz.title}
                  onChange={(e) => updateQuiz("title", e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editedQuiz.category}
                  onChange={(e) => updateQuiz("category", e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Difficulty + Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={editedQuiz.difficulty}
                  onChange={(e) => updateQuiz("difficulty", e.target.value)}
                  disabled={saving}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                >
                  {difficulties
                    .filter((d) => d !== "all")
                    .map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                </select>
                {errors.difficulty && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.difficulty}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={editedQuiz.duration || ""}
                  onChange={(e) => updateQuiz("duration", Number(e.target.value))}
                  disabled={saving}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                />
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editedQuiz.description}
                onChange={(e) => updateQuiz("description", e.target.value)}
                disabled={saving}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 resize-none transition-colors"
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
              </div>

              <div className="space-y-6">
                {editedQuiz.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">
                        Question {questionIndex + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        {/* Question Type Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            question.type.toLowerCase() === "radio"
                              ? "bg-blue-100 text-blue-700"
                              : question.type.toLowerCase() === "text"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {question.type.toLowerCase() === "radio"
                            ? "Multiple Choice"
                            : question.type.toLowerCase() === "text"
                            ? "Fill in the Blank"
                            : "Multi-Select"}
                        </span>
                        {editedQuiz.questions.length > 1 && (
                          <button
                            onClick={() => removeQuestion(questionIndex)}
                            disabled={saving}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1 rounded-md hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {errors[`question_${questionIndex}`] && (
                        <p className="text-sm text-red-500 mb-2">
                            {errors[`question_${questionIndex}`]}
                        </p>
                    )}

                    {/* Question Type Selector */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type
                      </label>
                      <select
                        value={question.type.toLowerCase() || "radio"} // Ensure value is lowercase
                        onChange={(e) =>
                          updateQuestion(questionIndex, "type", e.target.value)
                        }
                        disabled={saving}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                      >
                        <option value="radio">Multiple Choice (Single Answer)</option>
                        <option value="checkbox">Multiple Choice (Multiple Answers)</option>
                        <option value="text">Fill in the Blank (Exact Match)</option>
                      </select>
                    </div>

                    {/* Question Input */}
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(questionIndex, "question", e.target.value)
                      }
                      disabled={saving}
                      placeholder="Enter your question"
                      className="w-full px-3 py-2 mb-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                    />

                    {/* Conditional Rendering for Options/Answer */}
                    {question.type.toLowerCase() === "radio" || question.type.toLowerCase() === "checkbox" ? (
                      // RADIO/CHECKBOX - Multiple Choice Options
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Options (Select {question.type.toLowerCase() === "radio" ? "One" : "All"} Correct Answer(s) on the Left)
                        </label>
                        {question.options &&
                          question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                (question.type.toLowerCase() === "radio" && question.correctAnswer === optionIndex) ||
                                (question.type.toLowerCase() === "checkbox" && Array.isArray(question.correctAnswer) && question.correctAnswer.includes(optionIndex))
                                    ? "bg-green-50 border border-green-300" 
                                    : "hover:bg-gray-100"
                              }`}
                            >
                              <input
                                type={question.type.toLowerCase() === "radio" ? "radio" : "checkbox"}
                                name={`question-${questionIndex}`}
                                checked={
                                    question.type.toLowerCase() === "radio" 
                                        ? question.correctAnswer === optionIndex
                                        : Array.isArray(question.correctAnswer) && question.correctAnswer.includes(optionIndex)
                                }
                                onChange={() =>
                                  question.type.toLowerCase() === "radio"
                                    ? updateQuestion(questionIndex, "correctAnswer", optionIndex)
                                    : toggleCheckboxAnswer(questionIndex, optionIndex)
                                }
                                disabled={saving}
                                // FIX: Use accent-color for visibility
                                className={`w-4 h-4 ${
                                    question.type.toLowerCase() === "radio"
                                        ? "accent-blue-600 focus:ring-blue-500"
                                        : "accent-purple-600 focus:ring-purple-500"
                                } disabled:opacity-50`}
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
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                              />
                            </div>
                          ))}
                            {errors[`question_${questionIndex}_options`] && (
                                <p className="text-sm text-red-500 mt-1">{errors[`question_${questionIndex}_options`]}</p>
                            )}
                      </div>
                    ) : (
                      // TEXT - Fill in the Blank Answer
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer (Exact match required)
                        </label>
                        <input
                          type="text"
                          value={question.correctAnswer || ""}
                          onChange={(e) =>
                            updateQuestion(
                              questionIndex,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          disabled={saving}
                          placeholder="Enter the exact correct answer"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Students will need to type this exact answer.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addQuestion}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Quiz"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  // -----------------------------------------------------------------------

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
      <div className="min-h-screen rounded-lg bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Quiz Management Dashboard
            </h1>
            <button
              onClick={handleCreateNewQuiz}
              className="inline-flex items-center mt-4 md:mt-0 gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              <PlusIcon />
              <span>Create New Quiz</span>
            </button>
          </div>
          
          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Search className="w-5 h-5"/>
              </span>
              <input
                type="text"
                placeholder="Search quizzes by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
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
          
          {filteredQuizzes.length > 0 ? (
            <>
                {/* Quiz List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedQuizzes.map((quiz) => (
                    <div
                      key={quiz._id}
                      className="bg-white shadow-lg rounded-2xl p-5 flex flex-col hover:shadow-xl transition h-full"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 leading-snug pr-2">
                          {quiz.title}
                        </h3>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditQuiz(quiz)}
                            className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition-colors"
                          >
                            <Edit className="w-4 h-4"/>
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
                          {quiz.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                          {quiz.category}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            quiz.difficulty === "Easy" || quiz.difficulty === "Beginner"
                              ? "bg-green-100 text-green-600"
                              : quiz.difficulty === "Intermediate"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {quiz.difficulty}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 flex justify-between pt-2 border-t border-gray-100 mt-auto">
                        <span>
                            {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                        </span>
                        <span>{quiz.duration} min</span>
                        <span>
                            Created: {new Date(quiz.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 border rounded-lg font-medium transition-colors ${
                            page === currentPage
                                ? "bg-blue-600 text-white border-blue-600"
                                : "hover:bg-gray-100 border-gray-300"
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
                        className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                    >
                        Next
                    </button>
                    </div>
                )}
            </>
          ) : (
             <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl shadow-md">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-lg font-semibold text-gray-700">
                    No quizzes found
                </h3>
                <p className="text-gray-500">
                    {quizzes.length === 0
                      ? "Create your first quiz to get started!"
                      : "Try adjusting your search or filter criteria."}
                </p>
                {quizzes.length > 0 && (
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setCategoryFilter("all");
                            setDifficultyFilter("all");
                        }}
                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateQuizpage;
