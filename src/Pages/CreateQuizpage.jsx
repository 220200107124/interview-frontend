import React, { useState, useEffect } from 'react';
import './CreateQuiz.css';

import {quizAPI}from '../Services/api';


// SVG Icons Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17,21 17,13 7,13 7,21"></polyline>
    <polyline points="7,3 7,8 15,8"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
  </svg>
);

const CreateQuizpage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [saving, setSaving] = useState(false);

  // const navigate = useNavigate();
  const[currentPage ,setCurrentPage]=useState(1);
  const pageSize=4;
  const categories = ['all', 'General', 'React', 'JavaScript', 'Node', 'Graphic', 'NextJs'];
  const difficulties = ['all', 'Easy', 'Beginner', 'Intermediate', 'Advanced'];

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
      console.log('Fetched quizzes:', response);
      setQuizzes(response);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError(err.message || 'Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };


  
          const filteredQuizzes = quizzes.filter(quiz => {
        // match the search 
          const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 quiz.description.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
          const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
            
          return matchesSearch && matchesCategory && matchesDifficulty;
          });


          //pagination start here
        const totalPages=Math.ceil(filteredQuizzes.length/pageSize);
        const paginatedQuizzes=filteredQuizzes.slice(
          (currentPage-1)*pageSize,
          currentPage* pageSize
        );
  // Handle new quiz creation
  const handleCreateNewQuiz = () => {
    const newQuiz = {
      title: 'New Quiz',
      description: 'Quiz description',
      category: 'General',
      difficulty: 'Easy',
      questions: [
        {
          question: 'Sample question?',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 1
        }
      ]
    };        
    setCurrentQuiz(newQuiz);
    setShowQuizEditor(true);
  };


  // Handle edit quiz
  const handleEditQuiz = (quiz) => {
    setCurrentQuiz({ ...quiz });
    console.log("editing quiz:",quiz);
    setShowQuizEditor(true);
  };

  // Handle delete quiz
  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.deleteQuiz(id);
        setQuizzes(quizzes.filter(quiz => quiz._id !== id));
        alert('Quiz deleted successfully!');
      } catch (err) {
        alert('Error deleting quiz: ' + err.message);
      }
    }
  };
  // handle save quiz
  const handleSaveQuiz = async (updatedQuiz) => {
    try {
      setSaving(true);
      if (updatedQuiz._id) {
        const response = await quizAPI.updateQuiz(updatedQuiz._id, updatedQuiz);
        setQuizzes(quizzes.map(quiz => quiz._id === updatedQuiz._id ? response : quiz));
        console.log("quiz upadated",setQuizzes);
        alert('Quiz updated successfully!');
      } else {
        await quizAPI.createQuiz(updatedQuiz);
        await fetchQuizzes();//refresh quizzes list locally
        alert('Quiz created successfully!');
      }
      setShowQuizEditor(false);
      setCurrentQuiz(null);
    } catch (err) {
      alert('Error saving quiz: ' + err.message);
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
      console.log("updating quiz",editedQuiz)
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
              ) 
            }
          : q
      );
      setEditedQuiz({ ...editedQuiz, questions: updatedQuestions });
    };
    //  add question
    const addQuestion = () => {
      const newQuestion = {
        question: 'New question?',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 0
      };
      setEditedQuiz({
        ...editedQuiz,
        questions: [...editedQuiz.questions, newQuestion]
      });
    };
   // remove question
    const removeQuestion = (questionIndex) => {
      if (editedQuiz.questions.length > 1) {
        setEditedQuiz({
          ...editedQuiz,
          questions: editedQuiz.questions.filter((_, index) => index !== questionIndex)
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
        newErrors.description = "Description must be at least 5 characters long";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        onSave(editedQuiz);
      }
    };

    return (
      <div className="quiz-editor-overlay">
        <div className="quiz-editor">
          <div className="editor-header">
            <h2 className="editor-title">
              {quiz._id ? 'Edit Quiz' : 'Create New Quiz'}
            </h2>
            <button onClick={onCancel} className="close-btn" disabled={saving}>
              <CloseIcon/>
            </button>
          </div>
          
          <div className="editor-content">
            <div className="form-grid">
              <div className="form-group">
                <label>Quiz Title</label>
                <input
                  type="text"
                  value={editedQuiz.title}
                  onChange={(e) => updateQuiz('title', e.target.value)}
                  className="form-input"
                  disabled={saving}
                />
                {errors.title && <p className="error">{errors.title}</p>}
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editedQuiz.category}
                  onChange={(e) => updateQuiz('category', e.target.value)}
                  className="form-select"
                  disabled={saving}
                >
                  <option value="General">General</option>
                  <option value="React">React</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Node">NodeJs</option>
                  <option value="Graphic">Graphic Designer</option>
                  <option value="Next Js">NextJs</option>
                </select>
                {errors.category && <p className="error">{errors.category}</p>}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={editedQuiz.difficulty}
                  onChange={(e) => updateQuiz('difficulty', e.target.value)}
                  className="form-select"
                  disabled={saving}
                >
                  <option value="Easy">Easy</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.difficulty && <p className="error">{errors.difficulty}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editedQuiz.description}
                onChange={(e) => updateQuiz('description', e.target.value)}
                rows={3}
                className="form-textarea"
                disabled={saving}
              />
              {errors.description && <p className="error">{errors.description}</p>}
            </div>

            {/* Questions Section */}
            <div className="questions-section">
              <div className="questions-header">
                <h3>Questions</h3>
                <button 
                  onClick={addQuestion} 
                  className="add-question-btn"
                  disabled={saving}
                >
                  <PlusIcon />
                  <span>Add Question</span>
                </button>
              </div>

              {editedQuiz.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="question-card">
                  <div className="question-header">
                    <h4>Question {questionIndex + 1}</h4>
                    {editedQuiz.questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(questionIndex)}
                        className="delete-question-btn"
                        disabled={saving}
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                  
                  <div className="question-input-group">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                      className="question-input"
                      placeholder="Enter your question"
                      disabled={saving}
                    />
                  </div>

                  <div className="options-list">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-item">
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                          className="option-radio"
                          disabled={saving}
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                          className="option-input"
                          placeholder={`Option ${optionIndex + 1}`}
                          disabled={saving}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="editor-footer">
            <button onClick={onCancel} className="cancel-btn" disabled={saving}>
              Cancel
            </button>
            <button onClick={handleSave} className="save-btn" disabled={saving}>
              <SaveIcon/>
              <span>{saving ? 'Saving...' : 'Save Quiz'}</span>
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
      <div className="quiz-management-app">
        
        <div className="container">
          <div className="loading-state">
            <h2>Loading quizzes...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-management-app">
        <div className="container">
          <div className="error-state">
            <h2>Error loading quizzes</h2>
            <p>{error}</p>
            <button onClick={fetchQuizzes} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="quiz-management-app">
        <div className="container">
          {/* Header */}
          <div className="header-section">
            <div className="header-content">
             
              <h1 className="main-title">Quiz Management</h1>
              <button 
                onClick={handleCreateNewQuiz} 
                className="create-quiz-btn"
              >
                <PlusIcon />
                <span>Create New Quiz</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="filters-grid">
              <div className="search-container">
                <span className="search-icon">
                  <SearchIcon/>
                </span>
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-container">
                <span className="filter-icon">
                  <FilterIcon />
                </span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-container">
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="filter-select"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Difficulties' : difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quiz List */}
          <div className="quiz-grid">
            {paginatedQuizzes.map(quiz => (
              <div key={quiz._id} className="quiz-card">
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="quiz-title">{quiz.title}</h3>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditQuiz(quiz)}
                        className="edit-btn"
                        title="Edit Quiz"
                      >
                        <EditIcon/>
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="delete-btn"
                        title="Delete Quiz"
                      >
                        <TrashIcon/>
                      </button>
                    </div>
                  </div>

                  <p className="quiz-description">{quiz.description}</p>

                  <div className="quiz-badges">
                    <span className="category-badge">{quiz.category}</span>
                    <span className={`difficulty-badge difficulty-${quiz.difficulty.toLowerCase()}`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <div className="quiz-meta">
                    <span>{quiz.questions.length} questions</span>
                    <span>Created:{new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>


                
                  {totalPages > 1 && (
                    //pagignamtion pre and next page
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}

         
          {filteredQuizzes.length === 0 && (
            //handle when no data found 
            <div className="empty-state">
              <div className="empty-icon">📝 </div>
              <h3 className="empty-title">No quizzes found</h3>
              <p className="empty-text">
                {quizzes.length ===0 
                  ? 'Create your first quiz to get started!' 
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizpage;
