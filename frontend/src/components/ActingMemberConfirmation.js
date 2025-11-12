import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { useLeaveApplications } from "../context/LeaveApplicationsContext";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import "./ActingMemberConfirmation.css";
import { CheckCircle, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import DashboardHeader from "./DashboardHeader";

export default function ActingMemberConfirmation() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const { applications, setApplications } = useLeaveApplications();

  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionType, setActionType] = useState("");



  // fetch leave applications assigned to this acting member
  useEffect(() => {
    async function fetchApplications() {
      if (!user?.token) return;
      try {
        const res = await API.get("/leave-applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const normalize = (str) => str?.trim().toLowerCase() || "";

        const filtered = res.data.filter(
          (app) => normalize(app.actingMember) === normalize(user.name || user.username)
        );

        const validApps = filtered.filter(
          (app) =>
            app.name &&
            app.leaveType &&
            app.currentEstablishment?.name &&
            app.attachedUserRole?.name
        );

        setApplications(validApps);
      } catch (err) {
        console.error("Error fetching acting member applications:", err);
        toast({
          title: "Fetch Failed",
          description: "Could not load applications. Please try again.",
          variant: "destructive",
        });
      }
    }

    fetchApplications();
  }, [user, setApplications, toast]);



  // submit acting member decision
  const submitMessage = async () => {
    if (!selectedApp) return;

    try {
      await API.patch(`/leave-applications/${selectedApp.id}`, {
        actingMemberStatus: actionType,
        actingMemberRemarks: message,

      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? { ...app, actingMemberStatus: actionType, actingMemberRemarks: message }
            : app
        )
      );

      setShowDialog(false);
      setMessage("");

      toast({
        title: `Leave ${actionType === "approved" ? "Confirmed" : "Rejected"}`,
        description: `You have ${actionType} this leave application and notified the applicant.`,
      });
    } catch (err) {
      console.error("Error submitting status and message:", err);
      toast({
        title: "Action Failed",
        description: "Could not complete the action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDialog = (app, type) => {
    setSelectedApp(app);
    setActionType(type);
    setMessage(app.actingMemberRemarks || "");
    setShowDialog(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="approved-badge">Confirmed</Badge>
      case "rejected":
        return <Badge variant="outline" className="rejected-badge">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="pending-badge">Pending</Badge>;
    }
  };

  return (

  
    
    <div className="space-y-10">
        <DashboardHeader/>
      
      <Card align="center">
        <CardHeader align="center">
          <CardTitle>Acting Member Confirmation</CardTitle>
          <CardDescription>
            Review leave applications where you are assigned as the acting member.
          </CardDescription>

        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Applicant</TableHead>
                <TableHead className="text-black">NIC</TableHead>
                <TableHead className="text-black">Establishment</TableHead>
                <TableHead className="text-black">Leave Type</TableHead>
                <TableHead className="text-black">Period & No of Days</TableHead>
                <TableHead className="text-black">Reason</TableHead>
                <TableHead className="text-black">Address</TableHead>
                <TableHead className="text-black">Contact No</TableHead>
                <TableHead className="text-black">Acting Member Status</TableHead>
                <TableHead className="text-black">Acting Member Remarks</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.name} <br></br>Rank: {app.rank} <br></br> Role: {app.attachedUserRole?.name}</TableCell>
                    <TableCell>{app.nic}</TableCell>
                    <TableCell>{app.currentEstablishment?.name}</TableCell>
                    <TableCell>{app.leaveType}</TableCell>
                    <TableCell>
                      {new Date(app.leaveStartDate).toLocaleDateString()} →{" "}
                      {new Date(app.leaveEndDate).toLocaleDateString()}
                      <br></br> {app.numberOfDays} Days
                    </TableCell>
                    <TableCell>{app.reasonForLeave}</TableCell>
                    <TableCell>{app.addressDuringLeave}</TableCell>
                    <TableCell>{app.contactNumber}</TableCell>
                    <TableCell>{getStatusBadge(app.actingMemberStatus)}</TableCell>
                    <TableCell>{app.actingMemberRemarks || "-"}</TableCell>
                  

                    <TableCell className="action-buttons">
                   <Button  variant="outline"   title="Confirm to be as acting member"onClick={() => openDialog(app, "approved")}  disabled={app.actingMemberStatus === "approved"} >
                          <CheckCircle size={18} />
                   </Button>
                   <Button   variant="outline" title="Reject to be as acting member" onClick={() => openDialog(app, "rejected")} disabled={app.actingMemberStatus === "rejected"}  >
                          <XCircle size={18} />
                  </Button>
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="14" className="no-data">
                    No leave applications awaiting your confirmation.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogOverlay className="dialog-overlay" />
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approved" ? "Confirmation Message" : "Rejection Message"}
            </DialogTitle>
            <DialogDescription>
              Review the leave application details and type your message/remarks to the applicant.
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div style={{ overflowX: "auto", marginTop: "10px" }}>
            <Table className="dialog-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>NIC</TableHead>
                  <TableHead>Establishment</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Period & No of Days</TableHead>
                  {/* <TableHead>Days</TableHead> */}
                  <TableHead>Reason</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedApp.name}</TableCell>
                  <TableCell>{selectedApp.nic}</TableCell>
                  <TableCell>{selectedApp.currentEstablishment.name}</TableCell>
                  <TableCell>{selectedApp.attachedUserRole.name}</TableCell>
                  <TableCell>{selectedApp.rank}</TableCell>
                  <TableCell>{selectedApp.leaveType}</TableCell>
                  <TableCell>
                    {new Date(selectedApp.leaveStartDate).toLocaleDateString()} to{" "}
                    {new Date(selectedApp.leaveEndDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{selectedApp.numberOfDays}</TableCell>
                  <TableCell>{selectedApp.reasonForLeave}</TableCell>
                  <TableCell>{selectedApp.addressDuringLeave}</TableCell>
                  <TableCell>{selectedApp.contactNumber}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </div>
          )}

          <div className="dialog-body">
            <Label htmlFor="message">Remarks:</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            />
          </div>

          <DialogFooter className="dialog-footer">
            <Button className = "logout-btn" variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button className = "logout-btn" onClick={submitMessage} disabled={!message}>
              Send & {actionType === "approved" ? "Confirm Duty" : "Reject Duty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}




