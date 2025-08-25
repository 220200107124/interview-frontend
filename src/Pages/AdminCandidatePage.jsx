import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCandidatePage.css";
import { useNavigate } from "react-router";



const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9 22,2" />
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

const AdminCandidatePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
const navigate = useNavigate();
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    lname: "",
    email: "",
    tech: "React",
    difficulty: "Easy",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  const totalPages = Math.ceil(candidates.length / pageSize);
  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const techOptions = [
    "General",
    "React",
    "Node",
    "JavaScript",
    "Next js",
    "Graphic Design",
  ];
  const difficultyOptions = ["Easy", "Beginner", "Intermediate", "Advanced"];
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
          
      try {
        
        const [cRes, qRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/candidates`),
          

          axios.get(`${process.env.REACT_APP_API_URL}/api/quizzes`),
        ]);
       console.log(cRes,"api success");
        setCandidates(cRes.data);
        setQuizzes(qRes.data);
       

      } catch (err) {
        console.error("Fetch error:", err);
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        console.error("Config:", err.config.url);
   
      } finally {
        setLoading(false);
      }
    };
    fetchData();
   

  }, []);



  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.lname || !newCandidate.email) {
      return alert("Please fill all fields");
    }

    // const emailExists = candidates.some(
    //   (c) => c.email.toLowerCase() === newCandidate.email.toLowerCase()
    // );
    // if (emailExists) return alert("Candidate with this email already exists.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/candidates`,
        newCandidate
      );
      console.log("response");
      setCandidates((prev) => [...prev, res.data]);
      setNewCandidate({
        name: "",
        lname: "",
        email: "",
        tech: "React",
        difficulty: "Easy",
      });
    } catch (err) {
      console.error("Add error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCandidate = (candidate) =>
    setEditingCandidate({ ...candidate });

  const handleUpdateCandidate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/candidates/${editingCandidate._id}`,
        editingCandidate
      );
      setCandidates(
        candidates.map((c) => (c._id === res.data._id ? res.data : c))
      );
      setEditingCandidate(null);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Are you sure?")) {
      setLoading(true);
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/candidates/${id}`
        );
        
        setCandidates(candidates.filter((c) => c._id !== id));
      } catch (err) {
        console.error("Delete error:", err);
      } finally {
        setLoading(false);
      }
    }
  };


  // Fixed handleSendTest function for the React component
  const handleSendTest = async (candidate) => {
    console.log("Starting handleSendTest for candidate:", candidate._id);

    // Find matching quiz
    const matchingQuiz = quizzes.find(
      (q) =>
        q.category.toLowerCase() === candidate.tech.toLowerCase() &&
        q.difficulty.toLowerCase() === candidate.difficulty.toLowerCase()
    );

    if (!matchingQuiz) {
      alert(`No quiz found for ${candidate.tech} - ${candidate.difficulty}`);
      return;
    }

    console.log("Found matching quiz:", matchingQuiz._id);

    // Confirm action
    if (
      !window.confirm(
        `Are you sure you want to send the ${matchingQuiz.title} test to ${candidate.name} ${candidate.lname}?`
      )
    ) {
      return;
    }

    setSending(true);
    setIsDisabled(true);

    try {
      // Try to assign quiz (POST request)
      console.log("Attempting to assign quiz...");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/assign/${candidate._id}`,
        {
          quizId: matchingQuiz._id,
          title: matchingQuiz.title,
          tech:matchingQuiz.tech,
         
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Assignment successful:", response.data);
      alert(response.data.message || "Quiz assigned successfully!");

      // Close the edit modal
      setEditingCandidate(null);
    } catch (error) {
      console.error("Assignment error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || "Unknown server error";

        console.log("Server error status:", status);
        console.log("Server error message:", message);

        if (status === 404) {
          alert(
            "Candidate or quiz not found. Please refresh the page and try again."
          );
        } else if (status === 400) {
          alert(`Invalid request: ${message}`);
        } else if (status === 500) {
          alert("Server error occurred. Please try again later.");
        } else {
          alert(`Error: ${message}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.log("Network error - no response received");
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        console.log("Unexpected error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSending(false);

      // Re-enable button after 10 seconds instead of 30
      setTimeout(() => {
        setIsDisabled(false);
      }, 10 * 1000);
    }
  };

  return (
    <div>
      <div className="candidate-page">
        <div className="container">
          <h1 className="main-title">Candidate Management</h1>
          {loading && <div className="loader">Loading...</div>}

          <div className="add-candidate-section">
            <h2>Add New Candidate</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="First Name"
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newCandidate.lname}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, lname: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={newCandidate.email}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, email: e.target.value })
                }
              />
              <select
                value={newCandidate.tech}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, tech: e.target.value })
                }
              >
                {techOptions.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <select
                value={newCandidate.difficulty}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    difficulty: e.target.value,
                  })
                }
              >
                {difficultyOptions.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <button onClick={handleAddCandidate}>
                <PlusIcon /> Add
              </button>
            </div>
          </div>

          <div className="candidate-list">
            <h2>Candidate List</h2>
            {candidates.length === 0 ? (
              <p>No candidates added yet.</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Tech</th>
                      <th>Difficulty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCandidates.map((candidate) => (
                      <tr key={candidate._id}>
                        <td>{candidate.name}</td>
                        <td>{candidate.lname}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.tech}</td>
                        <td>{candidate.difficulty}</td>
                        <td>
                          <button
                            onClick={() => handleEditCandidate(candidate)}
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDeleteCandidate(candidate._id)}
                          >
                            <TrashIcon />
                            </button>
                            {
                              candidate.token && 


  <button  onClick={()=>{
    navigate(`/quiz/${candidate.token}`)
  }}> Test </button>
                              
                            }
                          
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={pageNum === currentPage ? "active" : ""}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>

          {editingCandidate && (
            <div className="edit-modal">
              <div className="modal-content">
                <h3>Edit Candidate</h3>
                <input
                  type="text"
                  value={editingCandidate.name}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={editingCandidate.lname}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      lname: e.target.value,
                    })
                  }
                />
                <input
                  type="email"
                  value={editingCandidate.email}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      email: e.target.value,
                    })
                  }
                />
                <select
                  value={editingCandidate.tech}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      tech: e.target.value,
                    })
                  }
                >
                  {techOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={editingCandidate.difficulty}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      difficulty: e.target.value,
                    })
                  }
                >
                  {difficultyOptions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <div className="modal-actions">
                  {sending ? (
                    <div className="loading-container">
                      <div className="loader"></div>
                      <span>Sending test...</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSendTest(editingCandidate)}
                        disabled={isDisabled}
                        className={`action-button primary ${
                          isDisabled ? "disabled" : ""
                        }`}
                        title={
                          isDisabled
                            ? "Please wait before sending another test"
                            : "Send test to candidate"
                        }
                      >
                        <SendIcon />
                        <span>
                          {isDisabled ? "Please wait..." : "Send Test"}
                        </span>
                      </button>

                      <button
                        onClick={handleUpdateCandidate}
                        className="action-button secondary"
                        disabled={sending}
                        title="Save candidate information changes"
                      >
                        Save Changes
                      </button>

                      <button
                        onClick={() => setEditingCandidate(null)}
                        className="action-button cancel"
                        disabled={sending}
                        title="Close without saving changes"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCandidatePage;
