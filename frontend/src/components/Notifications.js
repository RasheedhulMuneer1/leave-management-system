import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Bell } from "lucide-react";
import { useLeavePopup } from "../context/LeavePopupContext"; //  global popup context

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // from global popup context 
  const { showPopup, popupData, hidePopup } = useLeavePopup();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        if (!user?.token) return;

        const res = await API.get(`/notifications/user/${user.username}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // merge with any locally saved temporary notifications 
        const tempNotifs = JSON.parse(localStorage.getItem("tempNotifications") || "[]");
        const merged = [...tempNotifs, ...res.data];
        setNotifications(merged);

        localStorage.removeItem("tempNotifications");
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead && notif.id && user?.token) {
        await API.put(
          `/notifications/${notif.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      }


      // if it's a leave notification - show popup globally 
      switch (notif.type) {
        case "leave_application":
          if (notif.leaveData) {
            // show the same dialog popup globally 
            showPopup(notif.leaveData);
          } else {
            navigate("/leave-applications", { state: { highlightId: notif.refId } });
          }
          break;

        case "acting_member":
          navigate("/acting-member-confirmation", { state: { highlightId: notif.refId } });
          break;

        case "approve_reject_leave":
          navigate("/approve-reject-leaves", { state: { highlightId: notif.refId } });
          break;

        case "user_creation":
          navigate("/user-management", { state: { newUserId: notif.refId } });
          break;

        case "leave_type":
          navigate("/leave-types", { state: { highlight: true } });
          break;

        case "leave_criteria":
          navigate("/leave-criteria", { state: { highlight: true } });
          break;

        default:
          console.log("Unknown notification type:", notif.type);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-4 relative">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <Badge variant="outline">{notifications.length} total</Badge>
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No notifications available.
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id || Math.random()}
                  onClick={() => handleNotificationClick(notif)}
                  className={`cursor-pointer rounded-lg p-4 border transition-all ${
                    notif.isRead
                      ? "bg-white hover:bg-gray-100"
                      : "bg-blue-50 border-blue-300 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{notif.title}</p>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                    </div>
                    {!notif.isRead && (
                      <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>





      {showPopup && popupData && (
        <div className="delete-confirmation-popup fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="delete-modal-box bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <p className="mb-4 text-lg font-semibold text-center text-green-700">
              Leave Application Created Successfully ✅
            </p>
            <p className="mb-4 text-center text-gray-700">
              Below are the details of your leave request:
            </p>

            <table className="w-full border border-gray-300 text-sm mb-6">
              <tbody>
                <tr>
                  <td className="font-semibold border px-2 py-1 w-1/3 bg-gray-50">Name</td>
                  <td className="border px-2 py-1">{popupData.name || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Leave Type</td>
                  <td className="border px-2 py-1">{popupData.leaveType || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Period</td>
                  <td className="border px-2 py-1">
                    {popupData.leaveStartDate
                      ? new Date(popupData.leaveStartDate).toLocaleDateString()
                      : "-"}{" "}
                    to{" "}
                    {popupData.leaveEndDate
                      ? new Date(popupData.leaveEndDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Days</td>
                  <td className="border px-2 py-1">{popupData.numberOfDays || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Reason</td>
                  <td className="border px-2 py-1">{popupData.reasonForLeave || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Acting Member</td>
                  <td className="border px-2 py-1">{popupData.actingMember || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">
                    Address During Leave
                  </td>
                  <td className="border px-2 py-1">{popupData.addressDuringLeave || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Contact No</td>
                  <td className="border px-2 py-1">{popupData.contactNumber || "-"}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center">
              <button
                onClick={hidePopup}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


