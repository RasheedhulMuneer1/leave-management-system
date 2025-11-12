import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import DashboardLayout from "../components/DashboardLayout";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./SuperAdminDashboard.css";
import { DASHBOARD_CARDS } from "../constants/dashboardCards";

export default function EstablishmentHeadDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const userRole = "Establishment Head";

  const [userData, setUserData] = useState({
    name: "",
    rank: "",
    establishment: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.username || !user?.token) return;

        const response = await API.get(`/users/username/${user.username}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const u = response.data;
        setUserData({
          name: u.name,
          rank: u.rank,
          establishment: u.establishment?.name || "N/A",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const visibleCards = DASHBOARD_CARDS.filter((card) =>
    card.allowedRoles.includes(userRole)
  );

  return (
    <DashboardLayout userName={userData.name} role={userRole}>
      <div className="dashboard-home">
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-info">
              <h2>Welcome, {userData.name || "Loading..."}</h2>
              <p>{userData.rank || "—"}</p>
              <small>{userData.establishment || "—"}</small>
            </div>
          </div>
        </div>

        <div className="cards-grid">
          {visibleCards.length > 0 ? (
            visibleCards.map((card) => (
              <DashboardCard
                key={card.id}
                title={card.title}
                description={card.description}
                icon={card.icon}
                color={card.color}
                onClick={() => navigate(card.path)}
              />
            ))
          ) : (
            <p>No accessible cards for your role.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

