import React from "react";
import * as Icons from "lucide-react";

export default function DashboardCard({ title, description, icon, color, onClick }) {
  const IconComponent = Icons[icon] || Icons.LayoutDashboard;

  return (
    <div
      onClick={onClick}
      className="dashboard-card"
      style={{
        border: `2px solid ${color}`,
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "10px",
        textAlign: "left",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // width: "100%",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`)
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px",
          marginRight: "50px",
          marginTop: "10px"
        }}
      >
        <IconComponent size={24} color={color} />
        <h3 style={{ fontSize: "18px", fontWeight: "600", color }}>{title}</h3>
      </div>
      <p style={{ fontSize: "14px", color: "#555" }}>{description}</p>
    </div>
  );
}
