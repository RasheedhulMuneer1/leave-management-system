import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useToast } from "../hooks/use-toast";
import { AuthContext } from "../context/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import DashboardHeader from "./DashboardHeader";

export default function PendingLeaveRequests() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchApplications = async () => {
    try {
      if (!user?.token) return;

      const res = await API.get("/leave-applications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const userApps = res.data.filter(
        (app) =>
          app.name?.trim()?.toLowerCase() === user?.name?.trim()?.toLowerCase() &&
          (app.status?.trim()?.toLowerCase() === "pending" ||
            app.actingMemberStatus?.trim()?.toLowerCase() === "pending")
      );

      setApplications(userApps);
    } catch (err) {
      console.error("Error fetching applications:", err.response?.data || err.message);
      toast({
        title: "Error",
        description: "Failed to load your leave applications.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user, toast, location.state?.updated]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="pending-badge">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="approved-badge">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="rejected-badge">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDelete = async () => {
    try {
      if (!deleteId || !user?.token) return;
      await API.delete(`/leave-applications/${deleteId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications((prev) => prev.filter((app) => app.id !== deleteId));
      toast({
        title: "Deleted",
        description: "Leave request deleted successfully.",
      });
    } catch (err) {
      console.error("Delete failed:", err);
      toast({
        title: "Error",
        description: "Failed to delete leave request.",
        variant: "destructive",
      });
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-10">
        <DashboardHeader/>
     

      <Card align="center">
        <CardHeader align="center">
          <CardTitle>My Pending Leave Applications</CardTitle>
          <CardDescription>
            View your pending leave applications yet to be confirmed by leave approver member
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Name</TableHead> */}
                {/* <TableHead>NIC</TableHead> */}
                {/* <TableHead>Establishment</TableHead> */}
                {/* <TableHead>Role</TableHead> */}
                {/* <TableHead>Rank</TableHead> */}
                <TableHead className="text-black">Leave Type</TableHead>
                <TableHead className="text-black">Period</TableHead>
                <TableHead className="text-black">Days</TableHead>
                <TableHead className="text-black">Acting Member</TableHead>
                <TableHead className="text-black">Acting Member Remarks</TableHead>
                <TableHead className="text-black">Acting Member Status</TableHead>
                <TableHead className="text-black">Reason For Leave</TableHead>
                <TableHead className="text-black">Address During Leave</TableHead>
                <TableHead className="text-black">Contact No</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    {/* <TableCell>{app.name || "-"}</TableCell> */}
                    {/* <TableCell>{app.nic || "-"}</TableCell> */}
                    {/* <TableCell>{app.currentEstablishment?.name || "-"}</TableCell> */}
                    {/* <TableCell>{app.attachedUserRole?.name || "-"}</TableCell> */}
                    {/* <TableCell>{app.rank || "-"}</TableCell> */}
                    <TableCell>{app.leaveType || "-"}</TableCell>
                    <TableCell>
                      {app.leaveStartDate
                        ? new Date(app.leaveStartDate).toLocaleDateString()
                        : "-"}{" "}
                      → {" "}
                      {app.leaveEndDate
                        ? new Date(app.leaveEndDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{app.numberOfDays || "-"}</TableCell>
                    <TableCell>{app.actingMember || "-"}</TableCell>
                    <TableCell>{app.actingMemberRemarks || "-"}</TableCell>
                    <TableCell>{getStatusBadge(app.actingMemberStatus)}</TableCell>
                    <TableCell>{app.reasonForLeave || "-"}</TableCell>
                    <TableCell>{app.addressDuringLeave || "-"}</TableCell>
                    <TableCell>{app.contactNumber || "-"}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>

                    <TableCell className="action-buttons">

                      <br></br>
                      <br></br>
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        title="Delete"
                        onClick={() => {
                          setDeleteId(app.id);
                          setShowConfirm(true);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={16} className="text-center text-muted-foreground">
                    No pending leave applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

         


          
{showConfirm && (
  <div className="delete-confirmation-popup">
    <div className="delete-modal-box">
      <p className="mb-4 text-lg font-semibold">
        Are you sure you want to delete this leave request?
      </p>

      {/* Display selected leave requests details  */}
      {applications
        .filter((app) => app.id === deleteId)
        .map((app) => (
          <div key={app.id} className="mb-6 text-left">
            <table className="w-full border border-gray-300 text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold border px-2 py-1 w-1/3 bg-gray-50">Leave Type</td>
                  <td className="border px-2 py-1">{app.leaveType || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Period</td>
                  <td className="border px-2 py-1">
                    {app.leaveStartDate
                      ? new Date(app.leaveStartDate).toLocaleDateString()
                      : "-"}{" "}
                    to{" "}
                    {app.leaveEndDate
                      ? new Date(app.leaveEndDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Days</td>
                  <td className="border px-2 py-1">{app.numberOfDays || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Reason</td>
                  <td className="border px-2 py-1">{app.reasonForLeave || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Address During Leave</td>
                  <td className="border px-2 py-1">{app.addressDuringLeave || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Contact No</td>
                  <td className="border px-2 py-1">{app.contactNumber || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={handleDelete}
        >
          Yes, Delete
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}




        </CardContent>
      </Card>
    </div>
  );
}
