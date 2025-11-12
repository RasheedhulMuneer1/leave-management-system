import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import armyEmblem from "../pages/sl-army-emblem-logo.png";
import "./DashboardLayout.css";

export default function DashboardHeader() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img className="header-img" src={armyEmblem} alt="Sri Lanka Army Emblem" />
        <div className="header-title">
          <h1>Sri Lanka Army Leave Management System</h1>
          {/* <p>Authorized Access Only</p> */}
        </div>
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-info">

            <span className="username">{user.name}</span> 

    
          </div>
        ) : (
          <span>Loading...</span>
        )}

        <Link to="/">
          <button onClick={logout} className="logout-btn">Logout</button>
        </Link>
      </div>
    </header>
  );
}
