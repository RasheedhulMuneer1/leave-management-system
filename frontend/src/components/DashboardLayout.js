import React from "react";
import "./DashboardLayout.css";
import armyEmblem from "../pages/sl-army-emblem-logo.png";
import { Link, Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import { FaBell } from "react-icons/fa"; 
import Notifications from "./Notifications";
import { useNavigate } from "react-router-dom";


export default function DashboardLayout({ children, userName, role }) {
  const superAdminOnly = [
    { name: "User Management", path: "/users" },
    { name: "Establishment Leave Status", path: "/leave-overview" },
    { name: "Extensive Report", path: "/reports" },
  ];

  const systemAdminOnly = [
    { name: "Leave Types", path: "/leave-types"},
    { name: "Leave Criteria", path:"/leave-criteria"},
    { name: "Extensive Report", path: "/reports" },

  ]

  const establishmentAdminOnly = [
       { name: "User Management", path: "/users" },
       { name: "Extensive Report", path: "/reports" },

  ]

  const establishmentHeadOnly = [
    { name: "Leave Approvals", path: "/approve-reject-leaves" },
    { name: "Extensive Report", path: "/reports" },

  ]

  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      
      <header className="dashboard-header">
        <div className="header-left">
          <img className="header-img" src={armyEmblem} alt="Sri Lanka Army Emblem" />
          <div className="header-title">
            <h1>Sri Lanka Army Leave Management System</h1>
            <p>Authorized Access Only</p>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="role-badge">{role}</span>
          </div>
          <Link to="/">  <button className="logout-btn">Logout</button></Link>

  <FaBell
    className="cursor-pointer text-yellow-500 text-xl mr-4"
    title="Notifications"
    onClick={() => navigate("/notifications")}
  />

        </div>
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <h3 className="sidebar-title">Navigation</h3>
          <ul className="sidebar-menu">
            <li className="sidebar-item active"><Link to="" className="sidebar-link">Dashboard</Link></li>
            <li className="sidebar-item"><Link to="/apply" className="sidebar-link">Apply Leave</Link></li>
            <li className="sidebar-item"><Link to="/pending-requests" className="sidebar-link">Applied Leave Status</Link></li>
            <li className="sidebar-item"><Link to="/acting-confirmation" className="sidebar-link">Acting Confirmation</Link></li>
            <li className="sidebar-item"><Link to="/pending-requests" className="sidebar-link">Cancel Leave</Link></li>
            <li className="sidebar-item"><Link to="/my-reports" className="sidebar-link">My Leave Report</Link></li>


            {role === "Super Administrator" &&
              superAdminOnly.map((item) => (
                <li key={item.name} className="sidebar-item"><Link to={item.path} className="sidebar-link">{item.name}</Link></li>
              ))
            }

            {role === "System Administrator" &&
              systemAdminOnly.map((item) => (
                <li key={item.name} className="sidebar-item"><Link to={item.path} className="sidebar-link">{item.name}</Link></li>
              ))
            }

            {role === "Establishment Administrator" &&
              establishmentAdminOnly.map((item) => (
                <li key={item.name} className="sidebar-item"><Link to={item.path} className="sidebar-link">{item.name}</Link></li>
              ))
            }

            {role === "Establishment Head" &&
              establishmentHeadOnly.map((item) => (
                <li key={item.name} className="sidebar-item"><Link to={item.path} className="sidebar-link">{item.name}</Link></li>
              ))
            }
          </ul>
        </aside>

        <main className="dashboard-main">
           <div className="dashboard-cards-container"/>
        
        {children}</main>

          
      </div>
    </div>
  );
}

