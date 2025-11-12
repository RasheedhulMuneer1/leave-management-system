import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "./AuthContext";

// create context
const LeaveApplicationsContext = createContext();

export const LeaveApplicationsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async function fetchApplications() {
      if (!user?.token) return;

      try {
        const res = await API.get("/leave-applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const validApps = res.data.filter(
          (app) =>
            app.name &&
            app.leaveType &&
            app.currentEstablishment?.name &&
            app.attachedUserRole?.name
        );

        setApplications(validApps);
      } catch (err) {
        console.error("Error fetching leave applications:", err.response?.data || err.message);
      }
    }

    fetchApplications();
  }, [user]);

  return (
    <LeaveApplicationsContext.Provider value={{ applications, setApplications }}>
      {children}
    </LeaveApplicationsContext.Provider>
  );
};


// custom hook to use context safely
export const useLeaveApplications = () => {
  const context = useContext(LeaveApplicationsContext);
  if (!context) {
    throw new Error(
      "useLeaveApplications must be used within a LeaveApplicationsProvider"
    );
  }
  return context;
};

