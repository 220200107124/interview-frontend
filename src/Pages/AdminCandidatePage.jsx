// export default AdminCandidatePage;
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Plus, Edit, Trash2, Send, PlayCircle, BarChart2 } from "lucide-react";
import { useFormik } from "formik";
import { candidateSchema } from "../utils/Schema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CandidateModal from "./CandidateModal";

const AdminCandidatePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/result`
        );
        setResults(res.data);
      } catch (err) {
        toast.error("failed to fetch results", err);
      }
    };
    fetchResults();
  }, []);

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
    "Graphic Designer",
  ];
  const difficultyOptions = ["Easy", "Beginner", "Intermediate", "Advanced"];

  const formik = useFormik({
    initialValues: {
      name: "",
      lname: "",
      mobile: "",
      email: "",
      tech: "React",
      difficulty: "Easy",
    },
    validationSchema: candidateSchema,
    onSubmit: async (values, { resetForm }) => {
      setServerError("");
      setLoading(true);

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/candidates`,
          values
        );

        console.log("add response", res.data);
        setCandidates((prev) => [...prev, res.data]);
        resetForm();
        setIsAddModalOpen(false);

        // Success toast
        toast.success("Candidate added successfully!");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        // Error toast
        toast.error("Failed to add candidate. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchData = async () => {
    setLoading(true);

    try {
      const [cRes, qRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/candidates`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/quizzes`),
      ]);
      setCandidates(cRes.data);
      setQuizzes(qRes.data);
      console.log("candidate info", cRes.data);
    } catch (err) {
      toast.error("Fetch error:", err);
      toast.error("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      fetchData();
      toast.success("Candidate updated successfully!");
    } catch (err) {
      toast.error("Update error:", err);
      toast.error("Failed to update candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id, candidateName) => {
    if (window.confirm(`Are you sure you want to delete "${candidateName}"?`)) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/candidates/${id}`
        );
        setCandidates(candidates.filter((c) => c._id !== id));
        fetchData();
        toast.success("Candidate deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete candidate. Please try again.");
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
      toast.error(
        `No quiz found for ${candidate.tech} - ${candidate.difficulty}`
      );
      return;
    }

    if (
      !window.confirm(
        `Send "${matchingQuiz.title}" test to ${candidate.name} ${candidate.lname}?`
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

      toast.success(response.data.message || "Quiz assigned successfully!");
      setEditingCandidate(null);
      fetchData();
    } catch (error) {
      toast.error("Error sending test. Try again later.");
    } finally {
      setSending(false);
      setTimeout(() => {
        setIsDisabled(false);
        toast.info("You can send tests again now!");
      }, 10000);
    }
  };

  return (
    <div className="py-6 max-w">
      {/* Add ToastContainer component */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h1 className="text-3xl font-bold mb-6 text-center">
        Candidate Management
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-4 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      {/* Add Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            {/* Close button */}
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">Add New Candidate</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-3">
              {/* First Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="First Name"
                  className="w-full border rounded-lg p-2"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                  className="w-full border rounded-lg p-2"
                  value={formik.values.lname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lname && formik.errors.lname && (
                  <p className="text-red-500 text-sm">{formik.errors.lname}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border rounded-lg p-2"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>
              {/* Mobile Number */}
              <div>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="w-full border rounded-lg p-2"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="text-red-500 text-sm">{formik.errors.mobile}</p>
                )}
              </div>

              {/* Tech */}
              <div>
                <select
                  name="tech"
                  className="w-full border rounded-lg p-2"
                  value={formik.values.tech}
                  onChange={formik.handleChange}
                >
                  {techOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <select
                  name="difficulty"
                  className="w-full border rounded-lg p-2"
                  value={formik.values.difficulty}
                  onChange={formik.handleChange}
                >
                  {difficultyOptions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Plus size={18} /> {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>

            {serverError && <p className="text-red-600 mt-2">{serverError}</p>}
          </div>
        </div>
      )}

      {/* Candidate List */}
      <div className="bg-white shadow-lg rounded-2xl py-6 px-4">
        <h2 className="text-xl font-semibold mb-4">Candidate List</h2>
        {candidates.length === 0 ? (
          <p>No candidates added yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w w-full border rounded-lg">
                <thead className="bg-gray-100 hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Mobile</th>

                    <th className="px-4 py-2 text-left">Tech</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Status</th>
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
                        data-label="Mobile"
                      >
                        {candidate?.mobile || "nan"}
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
                        data-label="Status"
                      >
                        {candidate?.assignment?.status && (
                          <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 inset-ring inset-ring-green-500/20">
                            {" "}
                            {candidate?.assignment?.status}
                          </span>
                        )}
                      </td>
                      <td
                        className="px-4 py-2 block md:table-cell"
                        data-label="Actions"
                      >
                        <div className="flex flex-wrap gap-3">
                          {candidate?.assignment?.token && (
                            <div className="flex flex-wrap gap-3">
                              {/* Test Button */}
                              {candidate.assignment.status !== "completed" && (
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/quiz/${candidate.assignment.token}`
                                    );
                                    toast.success("Navigating to quiz...");
                                  }}
                                  className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                  <PlayCircle size={16} /> Test
                                </button>
                              )}
                            </div>
                          )}

                          <button
                            onClick={() => handleEditCandidate(candidate)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                          >
                            <Edit size={16} /> Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteCandidate(
                                candidate._id,
                                `${candidate.name} ${candidate.lname}`
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <Trash2 size={16} /> Delete
                          </button>

                          {candidate?.assignment?.status === "completed" &&
                            candidate?.result && (
                              <button
                                onClick={() =>
                                  setSelectedResult({
                                    ...candidate.result,
                                    candidateId: candidate,
                                  })
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              >
                                <BarChart2 size={16} /> Results
                              </button>
                            )}

                          <CandidateModal
                            details={selectedResult}
                            onClose={() => setSelectedResult(null)}
                          />
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
              {/*  Mobile Number field */}
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Enter mobile number"
                value={editingCandidate.mobile || "NAN"}
                onChange={(e) =>
                  setEditingCandidate({
                    ...editingCandidate,
                    mobile: e.target.value,
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
                <span className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Sending test...
                </span>
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
