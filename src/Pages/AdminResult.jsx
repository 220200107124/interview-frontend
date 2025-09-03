// import { useEffect, useState } from "react";
// import CandidateModal from "./CandidateModal";
// import { ToastContainer,toast } from "react-toastify";
// import"react-toastify/dist/ReactToastify.css"
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// function AdminResult() {
//   const [results, setResults] = useState([]);
//   const [candidateSummary, setCandidateSummary] = useState({});
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/result`);
//         const data = await res.json();
//         toast.success("Results fetched successfully");

//         // Filter only last 24 hours
//         const now = new Date();
//         const last24hResults = data.filter((r) => {
//           const attemptDate = new Date(r.date);
//           return now - attemptDate <= 48 * 60 * 60 * 1000; // difference ≤ 24h
//         });

//         console.log("=== Last 24h Results ===", last24hResults);
//         setResults(last24hResults);

//         const summary = {};
//         last24hResults.forEach((r) => {
//           const key = `${r.candidateName}__${r.quizTitle}`;
//           if (!summary[key]) {
//             summary[key] = {
//               candidateName: r.candidateName,
//               quizTitle: r.quizTitle,
//               mobile: r.mobile,
//               tech: r.tech,
//               attempts: 0,
//               totalScore: 0,
//               attemptsData: [],
//             };
//           }
//           summary[key].attempts += 1;
//           summary[key].totalScore += r.score;
//           summary[key].attemptsData.push(r);
//         });

//         // Sort attempts by latest first
//         Object.keys(summary).forEach((key) => {
//           summary[key].attemptsData.sort(
//             (a, b) => new Date(b.date) - new Date(a.date)
//           );
//         });

//         setCandidateSummary(summary);
//       } catch (error) {
//         toast.error(" Error fetching results:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, []);

//   // Chart: average score per quiz per candidate
//   const chartData = Object.keys(candidateSummary).map((key) => ({
//     candidateName: candidateSummary[key].candidateName,
//     quizTitle: candidateSummary[key].quizTitle,
//     averageScore:
//       candidateSummary[key].totalScore / candidateSummary[key].attempts,
//     fill: candidateSummary[key].totalScore > 0 ? "#82ca9d" : "#8884d8",
//   }));

//   // Latest attempt for each quiz per candidate
//   const latestResults = Object.keys(candidateSummary).map(
//     (key) => candidateSummary[key].attemptsData[0]
//   );

//   console.log("latestResults", latestResults);

//   return (
//     <>
//       <main className="results-container p-6 bg-gray-50 min-h-screen">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">
//           📊 Quiz Results
//         </h1>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-10">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//             <p className="mt-3  -gray-600">Loading results...</p>
//           </div>
//         ) : results.length === 0 ? (
//           <p className="text-gray-600">No results available yet.</p>
//         ) : (
//           <>
//             {/* Charts Section */}
//             <div className="chart-section grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//               <div className="bg-white p-4 rounded-xl shadow">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-700">
//                   Average Scores per Quiz
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="quizTitle" />
//                     <YAxis domain={[0, 10]} />
//                     <Tooltip />
//                     <Bar
//                       dataKey="averageScore"
//                       barSize={40}
//                       barCategoryGap="20%"
//                     >
//                       {chartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.fill} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="bg-white p-4 rounded-xl shadow">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-700">
//                   Score Trends
//                 </h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="quizTitle" />
//                     <YAxis domain={[0, 10]} />
//                     <Tooltip/>
//                     <Line
//                       type="monotone"
//                       dataKey="averageScore"
//                       stroke="#4facfe"
//                       strokeWidth={1}
//                       activeDot={{ r: 6 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Results Table */}
//             <div className="table-wrapper bg-white rounded-xl shadow overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-max w-full border-collapse">
//                   <thead className="bg-gray-100 text-left hidden md:table-header-group">
//                     <tr>
//                       <th className="px-4 py-2">Candidate</th>
//                       <th className="px-4 py-2">Quiz</th>
//                       <th className="px-4 py-2">Mobile</th>

//                       <th className="px-4 py-2">Technology</th>
//                       <th className="px-4 py-2">Score</th>
//                       <th className="px-4 py-2">Attempts</th>
//                       <th className="px-4 py-2">Status</th>
//                       <th className="px-4 py-2">Date</th>
//                       <th className="px-4 py-2">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {latestResults.map((r, idx) => {
//                       const key = `${r.candidateName}__${r.quizTitle}`;
//                       const attempts = candidateSummary[key]?.attempts || 1;
//                       return (
//                         <tr
//                           key={`${r._id}-${idx}`}
//                           className="border-t hover:bg-gray-50 flex flex-col md:table-row"
//                         >
//                           <td className="px-4 py-2 before:content-['Candidate:'] before:font-semibold md:before:content-none">
//                             {r?.candidateId?.name}
//                           </td>
//                           <td className="px-4 py-2 before:content-['Quiz:'] before:font-semibold md:before:content-none">
//                             {r.quizTitle}
//                           </td>
//                           <td className="px-4 py-2 before:content-['mobile'] before:font-semibold md:before:content-none">
//                             {" "}
//                             {r?.candidateId?.mobile}
//                           </td>
//                           <td className="px-4 py-2 before:content-['Technology:'] before:font-semibold md:before:content-none">
//                             {r.tech}
//                           </td>
//                           <td className="px-4 py-2 font-semibold before:content-['Score:'] before:font-semibold md:before:content-none">
//                             {r.score} / {r.totalQuestions}
//                           </td>
//                           <td className="px-4 py-2 before:content-['Attempts:'] before:font-semibold md:before:content-none">
//                             {attempts}
//                           </td>
//                           <td className="px-4 py-2 before:content-['Status:'] before:font-semibold md:before:content-none">
//                             <span
//                               className={`px-2 py-1 rounded text-xs ${
//                                 r.status === "Passed"
//                                   ? "bg-green-100 text-green-700"
//                                   : "bg-yellow-100 text-yellow-700"
//                               }`}
//                             >
//                               {r.status || "Submitted"}
//                             </span>
//                           </td>
//                           <td className="px-4 py-2 before:content-['Date:'] before:font-semibold md:before:content-none">
//                             {new Date(r.date).toLocaleString()}
//                           </td>
//                           <td className="px-4 py-2 before:content-['Actions:'] before:font-semibold md:before:content-none">
//                             <button
//                               className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//                               onClick={() => setSelectedCandidate(r)}
//                             >
//                               View Detail
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//               <ToastContainer position="top-right" autoClose={3000}/>
//             </div>
//           </>
//         )}
//       </main>

//       {/* <Footer /> */}

//       {selectedCandidate && (
//         <CandidateModal
//           details={selectedCandidate}
//           onClose={() => setSelectedCandidate(null)}
//         />
//       )}
//     </>
//   );
// }

// export default AdminResult;
import { useEffect, useState } from "react";
import CandidateModal from "./CandidateModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

function AdminResult() {
  const [results, setResults] = useState([]);
  const [candidateSummary, setCandidateSummary] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/result`);
        const data = await res.json();
        toast.success("Results fetched successfully");

        // Filter last 48 hours (can adjust to 24h if needed)
        const now = new Date();
        const last48hResults = data.filter((r) => {
          const attemptDate = new Date(r.date);
          return now - attemptDate <= 48 * 60 * 60 * 1000;
        });

        console.log("=== Last 48h Results ===", last48hResults);
        setResults(last48hResults);

        const summary = {};
        last48hResults.forEach((r) => {
          const key = `${r.candidateName}__${r.quizTitle}`;
          if (!summary[key]) {
            summary[key] = {
              candidateName: r.candidateName,
              quizTitle: r.quizTitle,
              mobile: r.mobile,
              tech: r.tech,
              attempts: 0,
              totalScore: 0,
              attemptsData: [],
            };
          }
          summary[key].attempts += 1;
          summary[key].totalScore += r.score;
          summary[key].attemptsData.push(r);
        });

        // Sort attempts by latest first
        Object.keys(summary).forEach((key) => {
          summary[key].attemptsData.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        });

        setCandidateSummary(summary);
      } catch (error) {
        toast.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Chart: average score per quiz per candidate
  const chartData = Object.keys(candidateSummary).map((key) => ({
    candidateName: candidateSummary[key].candidateName,
    quizTitle: candidateSummary[key].quizTitle,
    averageScore:
      candidateSummary[key].totalScore / candidateSummary[key].attempts,
    fill: candidateSummary[key].totalScore > 0 ? "#82ca9d" : "#8884d8",
  }));

  // ✅ All attempts (not just latest)
  const allResults = Object.keys(candidateSummary).flatMap(
    (key) => candidateSummary[key].attemptsData
  );

  return (
    <>
      <main className="results-container p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📊 Quiz Results
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <p className="text-gray-600">No results available yet.</p>
        ) : (
          <>
            {/* Charts Section */}
            <div className="chart-section grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Average Scores per Quiz
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quizTitle" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="averageScore" barSize={40} barCategoryGap="20%">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Score Trends
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quizTitle" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="averageScore"
                      stroke="#4facfe"
                      strokeWidth={1}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Results Table */}
            <div className="table-wrapper bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-max w-full border-collapse">
                  <thead className="bg-gray-100 text-left hidden md:table-header-group">
                    <tr>
                      <th className="px-4 py-2">Candidate</th>
                      <th className="px-4 py-2">Quiz</th>
                      <th className="px-4 py-2">Mobile</th>
                      <th className="px-4 py-2">Technology</th>
                      <th className="px-4 py-2">Score</th>
                      <th className="px-4 py-2">Attempts</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResults.map((r, idx) => {
                      const key = `${r.candidateName}__${r.quizTitle}`;
                      const attempts = candidateSummary[key]?.attempts || 1;
                      return (
                        <tr
                          key={`${r._id}-${idx}`}
                          className="border-t hover:bg-gray-50 flex flex-col md:table-row"
                        >
                          <td className="px-4 py-2">{r?.candidateId?.name}</td>
                          <td className="px-4 py-2">{r.quizTitle}</td>
                          <td className="px-4 py-2">{r?.candidateId?.mobile}</td>
                          <td className="px-4 py-2">{r.tech}</td>
                          <td className="px-4 py-2 font-semibold">
                            {r.score} / {r.totalQuestions}
                          </td>
                          <td className="px-4 py-2">{attempts}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                r.status === "Passed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {r.status || "Submitted"}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {new Date(r.date).toLocaleString()}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              onClick={() => setSelectedCandidate(r)}
                            >
                              View Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </>
        )}
      </main>

      {selectedCandidate && (
        <CandidateModal
          details={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  );
}

export default AdminResult;
