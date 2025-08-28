// export default AdminCandidatePage;
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Plus, Edit, Trash2, Send, PlayCircle, BarChart2 } from "lucide-react";

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
  const pageSize = 5;
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
        setCandidates(cRes.data);
        setQuizzes(qRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
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

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/candidates`,
        newCandidate
      );
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

  const handleSendTest = async (candidate) => {
    const matchingQuiz = quizzes.find(
      (q) =>
        q.category.toLowerCase() === candidate.tech.toLowerCase() &&
        q.difficulty.toLowerCase() === candidate.difficulty.toLowerCase()
    );

    if (!matchingQuiz) {
      alert(`No quiz found for ${candidate.tech} - ${candidate.difficulty}`);
      return;
    }

    if (
      !window.confirm(
        `Send ${matchingQuiz.title} test to ${candidate.name} ${candidate.lname}?`
      )
    ) {
      return;
    }

    setSending(true);
    setIsDisabled(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/assign/${candidate._id}`,
        {
          quizId: matchingQuiz._id,
          title: matchingQuiz.title,
          tech: matchingQuiz.tech,
        }
      );

      alert(response.data.message || "Quiz assigned successfully!");
      setEditingCandidate(null);
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Error sending test. Try again later.");
    } finally {
      setSending(false);
      setTimeout(() => setIsDisabled(false), 10000);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Candidate Management
      </h1>

      {loading && <div className="text-center">Loading...</div>}

      {/* Add Candidate */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Candidate</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            type="text"
            placeholder="First Name"
            className="border rounded-lg p-2"
            value={newCandidate.name}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border rounded-lg p-2"
            value={newCandidate.lname}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, lname: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg p-2"
            value={newCandidate.email}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, email: e.target.value })
            }
          />
          <select
            className="border rounded-lg p-2"
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
            className="border rounded-lg p-2"
            value={newCandidate.difficulty}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, difficulty: e.target.value })
            }
          >
            {difficultyOptions.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Buttons aligned inline */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddCandidate}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add
          </button>
          <button
            onClick={() => {
              setEditingCandidate(null);
              setNewCandidate({
                name: "",
                lname: "",
                email: "",
                tech: "",
                difficulty: "",
              });
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Candidate List */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Candidate List</h2>
        {candidates.length === 0 ? (
          <p>No candidates added yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table
                className="  min-w-max
              w-full border rounded-lg "
              >
                <thead className="bg-gray-100 hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Tech</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCandidates.map((candidate) => (
                    <tr
                      key={candidate._id}
                      className="border-t block md:table-row mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none"
                    >
                      <td
                        className="px-4 py-2 block md:table-cell"
                        data-label="First Name"
                      >
                        {candidate.name}
                      </td>
                      <td
                        className="px-4 py-2 block md:table-cell"
                        data-label="Last Name"
                      >
                        {candidate.lname}
                      </td>
                      <td
                        className="px-4 py-2 block md:table-cell"
                        data-label="Email"
                      >
                        {candidate.email}
                      </td>
                      <td
                        className="px-4 py-2 block md:table-cell"
                        data-label="Tech"
                      >
                        {candidate.tech}
                      </td>
                      <td
                        className="px-4 py-2 block md:table-cell"
                        data-label="Difficulty"
                      >
                        {candidate.difficulty}
                      </td>
                      <td
                        className="px-4 py-2 block md:table-cell"
                        data-label="Actions"
                      >
                        <div className="flex flex-wrap gap-3">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleEditCandidate(candidate)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                          >
                            <Edit size={16} />
                            Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteCandidate(candidate._id)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>

                          {/* Test Button */}
                          {candidate.token && (
                            <button
                              onClick={() =>
                                navigate(`/quiz/${candidate.token}`)
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <PlayCircle size={16} />
                              Test
                            </button>
                          )}

                          {/* Result Button */}
                          <button
                            onClick={() => navigate("/admin-result")}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            <BarChart2 size={16} />
                            Result
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Candidate</h3>
            <div className="grid gap-3">
              <input
                type="text"
                className="border p-2 rounded"
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
                className="border p-2 rounded"
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
                className="border p-2 rounded"
                value={editingCandidate.email}
                onChange={(e) =>
                  setEditingCandidate({
                    ...editingCandidate,
                    email: e.target.value,
                  })
                }
              />
              <select
                className="border p-2 rounded"
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
                className="border p-2 rounded"
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
            </div>
            <div className="flex justify-end gap-3 mt-4">
              {sending ? (
                <span>Sending test...</span>
              ) : (
                <>
                  <button
                    onClick={() => handleSendTest(editingCandidate)}
                    disabled={isDisabled}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send size={16} />
                    {isDisabled ? "Please wait..." : "Send Test"}
                  </button>
                  <button
                    onClick={handleUpdateCandidate}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingCandidate(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
  );
};

export default AdminCandidatePage;
