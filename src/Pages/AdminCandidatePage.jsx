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

  const techOptions = ["General", "React", "Node", "JavaScript", "Next js", "Graphic Designer"];
  const difficultyOptions = ["Easy", "Beginner", "Intermediate", "Advanced"];
  // const roleOptions = ["candidate"];

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/result`);
        setResults(res.data);
      } catch (err) {
        toast.error("Failed to fetch results");
      }
    };
    fetchResults();
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(candidates.length / pageSize);
  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Formik for add candidate
  const formik = useFormik({
    initialValues: {
      name: "",
      lname: "",
      mobile: "",
      email: "",
      tech: "React",
      difficulty: "Easy",
      // role: "candidate",
      // password: "",
    },
    validationSchema: candidateSchema,
    onSubmit: async (values, { resetForm }) => {
      setServerError("");
      setLoading(true);
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/candidates`, values);
        setCandidates((prev) => [...prev, res.data]);
        resetForm();
        setIsAddModalOpen(false);
        toast.success("Candidate added successfully!");
      } catch (err) {
        if (err.response?.data?.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("Failed to add candidate. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // Fetch candidates and quizzes
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
      toast.error("Failed to load data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Candidate actions
  const handleEditCandidate = (candidate) => setEditingCandidate({ ...candidate });

  const handleUpdateCandidate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/candidates/${editingCandidate._id}`,
        editingCandidate
      );
      setCandidates(candidates.map((c) => (c._id === res.data._id ? res.data : c)));
      setEditingCandidate(null);
      fetchData();
      toast.success("Candidate updated successfully!");
    } catch (err) {
      toast.error("Failed to update candidate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete "${candidateName}"?`)) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/candidates/${id}`);
      setCandidates(candidates.filter((c) => c._id !== id));
      fetchData();
      toast.success("Candidate deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete candidate. Please try again.");
    }
  };

  const handleSendTest = async (candidate) => {
    const matchingQuiz = quizzes.find(
      (q) =>
        q.category.toLowerCase() === candidate.tech.toLowerCase() &&
        q.difficulty.toLowerCase() === candidate.difficulty.toLowerCase()
    );

    if (!matchingQuiz) {
      toast.error(`No quiz found for ${candidate.tech} - ${candidate.difficulty}`);
      return;
    }

    if (!window.confirm(`Send "${matchingQuiz.title}" test to ${candidate.name} ${candidate.lname}?`))
      return;

    setSending(true);
    setIsDisabled(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/assign/${candidate._id}`, {
        quizId: matchingQuiz._id,
        title: matchingQuiz.title,
        tech: matchingQuiz.tech,
      });
      toast.success(response.data.message || "Quiz assigned successfully!");
      fetchData();
    } catch (error) {
      toast.error("Error sending test. Try again later.");
    } finally {
      setSending(false);
      setTimeout(() => setIsDisabled(false), 10000);
    }
  };

  return (
    <div className="py-6 max-w">
      <ToastContainer position="top-right" autoClose={5000} />

      <h1 className="text-3xl font-bold mb-6 text-center">Candidate Management</h1>

      <div className="flex justify-end mb-6">
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-4 rounded-lg hover:bg-blue-700 transition">
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      {/* Add Candidate Modal */}
      {/* Add Candidate Modal */}
{isAddModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
      <button
        onClick={() => setIsAddModalOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✖
      </button>
      <h2 className="text-xl font-semibold mb-4">Add New Candidate</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-3">
        {/* First Name */}
        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded-lg p-2"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}

        {/* Last Name */}
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          value={formik.values.lname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded-lg p-2"
        />
        {formik.touched.lname && formik.errors.lname && (
          <p className="text-red-500 text-sm">{formik.errors.lname}</p>
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded-lg p-2"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        {/* Mobile */}
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded-lg p-2"
        />
        {formik.touched.mobile && formik.errors.mobile && (
          <p className="text-red-500 text-sm">{formik.errors.mobile}</p>
        )}

        {/* Tech */}
        <select
          name="tech"
          value={formik.values.tech}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded-lg p-2"
        >
          {techOptions.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {formik.touched.tech && formik.errors.tech && (
          <p className="text-red-500 text-sm">{formik.errors.tech}</p>
        )}

        {/* Difficulty */}
        <select
          name="difficulty"
          value={formik.values.difficulty}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border rounded-lg p-2"
        >
          {difficultyOptions.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {formik.touched.difficulty && formik.errors.difficulty && (
          <p className="text-red-500 text-sm">{formik.errors.difficulty}</p>
        )}

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
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={18} /> {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {serverError && <p className="text-red-600 mt-2">{serverError}</p>}
    </div>
  </div>
)}


      {/* Candidate Table */}
      <div className="bg-white shadow-lg rounded-2xl py-6 px-4">
        <h2 className="text-xl font-semibold mb-4">Candidate List</h2>
        {candidates.length === 0 ? <p>No candidates added yet.</p> : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w w-full border rounded-lg">
                <thead className="bg-gray-100 hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-2 text-left">First Name</th>
                    <th className="px-4 py-2 text-left">Last Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    {/* <th className="px-4 py-2 text-left">Password</th> */}
                    <th className="px-4 py-2 text-left">Mobile</th>
                    <th className="px-4 py-2 text-left">Tech</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    {/* <th className="px-4 py-2 text-left">Role</th> */}
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCandidates.map((candidate) => (
                    <tr key={candidate._id} className="border-t block md:table-row mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none">
                      <td className="px-4 py-2 block md:table-cell">{candidate.name}</td>
                      <td className="px-4 py-2 block md:table-cell">{candidate.lname}</td>
                      <td className="px-4 py-2 block md:table-cell">{candidate.email}</td>
                      {/* <td className="px-4 py-2 block md:table-cell">{candidate.password}</td> */}
                      <td className="px-4 py-2 block md:table-cell">{candidate.mobile || "NAN"}</td>
                      <td className="px-4 py-2 block md:table-cell">{candidate.tech}</td>
                      <td className="px-4 py-2 block md:table-cell">{candidate.difficulty}</td>
                      {/* <td className="px-4 py-2 block md:table-cell">{candidate.role}</td> */}
                      <td className="px-4 py-2 block md:table-cell">
                        {candidate?.assignment?.status && (
                          <span className="inline-flex items-center rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400">
                            {candidate.assignment.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 block md:table-cell">
                        <div className="flex flex-wrap gap-3">
                          {candidate?.assignment?.token && candidate.assignment.status !== "completed" && (
                            <button onClick={() => { navigate(`/quiz/${candidate.assignment.token}`); toast.success("Navigating to quiz..."); }}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                              <PlayCircle size={16} /> Test
                            </button>
                          )}
                          <button onClick={() => handleEditCandidate(candidate)} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                            <Edit size={16} /> Edit
                          </button>
                          <button onClick={() => handleDeleteCandidate(candidate._id, `${candidate.name} ${candidate.lname}`)} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                            <Trash2 size={16} /> Delete
                          </button>
                          {candidate?.assignment?.status === "completed" && candidate?.result && (
                            <button onClick={() => setSelectedResult({ ...candidate.result, candidateId: candidate })} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                              <BarChart2 size={16} /> Results
                            </button>
                          )}
                        </div>
                        <CandidateModal details={selectedResult} onClose={() => setSelectedResult(null)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`px-3 py-1 border rounded ${pageNum === currentPage ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>{pageNum}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>

      {/* Edit Candidate Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Edit Candidate</h3>
            <div className="grid gap-3">
              <input type="text" className="border p-2 rounded" value={editingCandidate.name} onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })} />
              <input type="text" className="border p-2 rounded" value={editingCandidate.lname} onChange={(e) => setEditingCandidate({ ...editingCandidate, lname: e.target.value })} />
              <input type="email" className="border p-2 rounded" value={editingCandidate.email} onChange={(e) => setEditingCandidate({ ...editingCandidate, email: e.target.value })} />
              <input type="text" className="border p-2 rounded" value={editingCandidate.mobile || ""} onChange={(e) => setEditingCandidate({ ...editingCandidate, mobile: e.target.value })} />
              <select className="border p-2 rounded" value={editingCandidate.tech} onChange={(e) => setEditingCandidate({ ...editingCandidate, tech: e.target.value })}>
                {techOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
              <select className="border p-2 rounded" value={editingCandidate.difficulty} onChange={(e) => setEditingCandidate({ ...editingCandidate, difficulty: e.target.value })}>
                {difficultyOptions.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              {sending ? (
                <span className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div> Sending test...
                </span>
              ) : (
                <>
                  <button onClick={() => handleSendTest(editingCandidate)} disabled={isDisabled} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"><Send size={16} /> {isDisabled ? "Please wait..." : "Send Test"}</button>
                  <button onClick={handleUpdateCandidate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save Changes</button>
                  <button onClick={() => setEditingCandidate(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
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
