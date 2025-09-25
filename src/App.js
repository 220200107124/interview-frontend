import "./App.css";
import { Routes, Route, useNavigate} from "react-router-dom";
import { useEffect } from "react";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import CreateQuizpage from "./Pages/CreateQuizpage";
import CandidateQuizpage from "./Pages/CandidateQuizpage";
import ThankYouPage from "./Pages/ThankYouPage";
import AdminCandidatePage from "./Pages/AdminCandidatePage";
import AdminResult from "./Pages/AdminResult";
import Layout from "./Components/Layout";


function App() {
  console.log("test");
  return (
    <Routes>
      <Route path="/" element={<LoginWrapper />} />
      <Route path="/admin-login" element={<LoginWrapper />} />
      <Route
        path="/admin"
        element={
          <Layout>
            <AdminDashboard />
          </Layout>
        }
      />
      <Route
        path="/create-quiz"
        element={
          <Layout>
            <CreateQuizpage />
          </Layout>
        }
      />
      <Route path="/quiz/:candidateId" element={<CandidateQuizpage />} />
      <Route path="/quiz/:token" element={<CandidateQuizpage />} />

      <Route path="/quiz/:token" element={<CandidateQuizpage/>}/>
      <Route path="/thank-you" element={<ThankYouPage />} />

      <Route
        path="/admin-candidate"
        element={
          <Layout>
            <AdminCandidatePage />
          </Layout>
        }
      />
      <Route
        path="/admin-result"
        element={
          <Layout>
            <AdminResult />
          </Layout>
        }
      />
      {/* <Route path='/test-candidate' element={<TestCandidatePage/>}/> */}
    </Routes>
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  useEffect(()=>{
    const token=localStorage?.getItem("adminToken");
    if(token){
          navigate("/admin");
    }
    
  },[navigate])

  const handleLogin = () => {

    navigate("/admin");
  };

  return <AdminLogin onLogin={handleLogin} />;
}

export default App;
