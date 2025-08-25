import AdminSideBar from "./AdminSideBar";
import DashboardStats from "./DashboardStats";
import Footer from "./Footer";
import Header  from "./Header";
import "./Footer.css";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Layout = ({children}) => {
  
const navigate = useNavigate()
  useEffect(()=>{
    const token = localStorage?.getItem("adminToken")

    if(!token){
      navigate("/")
    }

  },[navigate])
  return (

    <div  className="dashboard-wrapper">
      <AdminSideBar />
      <main  className="dashboard-container">
        <header className="dashboard-header">
        
        <Header/>
        </header> 
        <div className="stats-cards">
        <DashboardStats/>
        </div>
       

        {children}
          
    
  
     <Footer/>
      </main>
     
     
    
    </div>
    
  );
};

export default Layout;
