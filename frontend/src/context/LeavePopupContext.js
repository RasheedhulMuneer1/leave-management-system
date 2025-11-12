import React, { createContext, useState, useContext } from "react";

const LeavePopupContext = createContext();

export const LeavePopupProvider = ({ children }) => {
  const [popupData, setPopupData] = useState(null);

  const showLeavePopup = (leaveData) => setPopupData(leaveData);
  const hideLeavePopup = () => setPopupData(null);

  return (
    <LeavePopupContext.Provider value={{ popupData, showLeavePopup, hideLeavePopup }}>
      {children}
    </LeavePopupContext.Provider>
  );
};

// custom hook for convenience
export const useLeavePopup = () => useContext(LeavePopupContext);
