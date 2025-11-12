import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import "./ActingMemberConfirmation.css";
import DashboardHeader from "./DashboardHeader";

export default function ApprovingOrRejectingLeaves() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionType, setActionType] = useState("");
  const [message, setMessage] = useState("");


  // fetch leave applications
  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await API.get("/leave-applications", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        const filteredByEstablishment = res.data.filter(
          (app) => app.currentEstablishment?.name === user?.establishment
        );

        setApplications(filteredByEstablishment);
        setFiltered(filteredByEstablishment);
      } catch (err) {
        console.error("Error fetching applications:", err);
        toast({
          title: "Fetch Failed",
          description: "Could not load leave applications.",
          variant: "destructive",
        });
      }
    }
    if (user?.establishment) {
      fetchApplications();
    }
  }, [user, toast]);


   // filter search
  useEffect(() => {
    const filteredApps = applications.filter((app) => {
      const value =
        filterType === "name"
          ? app.name
          : filterType === "nic"
          ? app.nic
          : filterType === "establishment"
          ? app.currentEstablishment?.name
          : filterType === "role"
          ? app.attachedUserRole?.name
          : filterType === "rank"
          ? app.rank
          : filterType === "leaveType"
          ? app.leaveType
          : "";
      return value?.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFiltered(filteredApps);
  }, [searchQuery, filterType, applications]);


  // submit approval / rejection
  const submitMessage = async () => {
    if (!selectedApp) return;
    try {
      await API.patch(
  `/leave-applications/${selectedApp.id}`,
  {
    leaveApproveMemberStatus: actionType,
    leaveApproveMemberRemarks: message, 
    status: actionType,
  },
  { headers: { Authorization: `Bearer ${user?.token}` } }
);


      setApplications((prev) =>
  prev.map((app) =>
    app.id === selectedApp.id
      ? {
          ...app,
          leaveApproveMemberStatus: actionType,
          leaveApproveMemberRemarks: message, 
          status: actionType,
        }
      : app
  )
);


      setShowDialog(false);
      setMessage("");

      toast({
        title: `Leave ${actionType === "approved" ? "Approved" : "Rejected"}`,
        description: `You have ${actionType} this leave and notified the applicant.`,
      });
    } catch (err) {
      console.error("Error submitting message:", err);
      toast({
        title: "Action Failed",
        description: "Could not update leave application.",
        variant: "destructive",
      });
    }
  };

  const openDialog = (app, type) => {
  setSelectedApp(app);
  setActionType(type);
  setMessage(app.leaveApproveMemberRemarks || ""); 
  setShowDialog(true);
};



  // status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge variant = "outline" className="approved-badge">Approved</Badge>;
      case "rejected":
        return <Badge variant = "outline" className="rejected-badge">Rejected</Badge>;
      default:
        return <Badge variant = "outline" className="pending-badge">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-10">
        <DashboardHeader/>
      
      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <Card align="center">
          <CardHeader className="flex justify-between pb-2">
            
            <CardTitle className="text-sm font-medium">
              Pending Applications
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(
                (a) =>
                  a.leaveApproveMemberStatus === "pending" ||
                  a.status === "pending" ||
                  a.status === "pending_forward"
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting your decision</p>
          </CardContent>
        </Card>
      </div>



       {/* search and filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="w-40">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="nic">NIC</SelectItem>
              <SelectItem value="establishment">Establishment</SelectItem>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="leaveType">Leave Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search by ${filterType}...`}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

    
      {/* main table */}
      <Card align="center">
        <CardHeader>
          <CardTitle>Leave Applications for Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">ID</TableHead>
                <TableHead className="text-black">Name</TableHead>
                <TableHead className="text-black">NIC</TableHead>
                <TableHead className="text-black">Establishment</TableHead>
                <TableHead className="text-black">Leave Type</TableHead>
                <TableHead className="text-black">Period & No of Days</TableHead>
                <TableHead className="text-black">Acting Member</TableHead>
                <TableHead className="text-black">Acting Member Status</TableHead>
                <TableHead className="text-black">Acting Member Remarks</TableHead>
                <TableHead className="text-black">Action</TableHead>
                <TableHead className="text-black">Leave Approve Member Remarks</TableHead>
                <TableHead className="text-black">Final Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.name} Rank: {app.rank} Role: {app.attachedUserRole?.name || "-"} </TableCell>
                    <TableCell>{app.nic}</TableCell>
                    <TableCell>{app.currentEstablishment?.name || "-"}</TableCell>
                    <TableCell>{app.leaveType}</TableCell>
                    <TableCell>
                      {new Date(app.leaveStartDate).toLocaleDateString()} → {" "}
                      {new Date(app.leaveEndDate).toLocaleDateString()} <br></br> <br></br>
                      {app.numberOfDays} Days
                    </TableCell>
                    <TableCell>{app.actingMember}</TableCell>
                    <TableCell>{getStatusBadge(app.actingMemberStatus)}</TableCell>
                    <TableCell>{app.actingMemberRemarks || "-"}</TableCell>


                         {/* Approve / Reject buttons */}
                    <TableCell className="action-buttons">
                      <Button
                        variant="outline"
                        title="Approve Leave Request"
                        onClick={() => openDialog(app, "approved")}
                        disabled={
                          app.leaveApproveMemberStatus === "approved" ||
                          app.leaveApproveMemberStatus === "rejected" ||
                          app.actingMemberStatus !== "approved"
                        }
                        className={
                          app.actingMemberStatus !== "approved"
                            ? "blurred-button"
                            : ""
                        }
                      >
                        <CheckCircle size={18} />
                      </Button>



                      <Button
                        variant="outline"
                        title="Reject Leave Request"
                        onClick={() => openDialog(app, "rejected")}
                        disabled={
                          app.leaveApproveMemberStatus === "approved" ||
                          app.leaveApproveMemberStatus === "rejected" ||
                          app.actingMemberStatus !== "approved"
                        }
                        className={
                          app.actingMemberStatus !== "approved"
                            ? "blurred-button"
                            : ""
                        }
                      >
                        <XCircle size={18} />
                      </Button>
                    </TableCell>

                   

                    <TableCell>{app.leaveApproveMemberRemarks || "-"}</TableCell>
                    <TableCell>
                      {getStatusBadge(app.leaveApproveMemberStatus || app.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="15" className="text-center text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>



        {/* Popup Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogOverlay className="dialog-overlay" />
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approved" ? "Confirmation Message" : "Rejection Message"}
            </DialogTitle>
            <DialogDescription>
              Review the leave details and type your message to the applicant.
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <Table className="dialog-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>NIC</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Period & No of Days</TableHead>
                  <TableHead>Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedApp.name}</TableCell>
                  <TableCell>{selectedApp.nic}</TableCell>
                  <TableCell>{selectedApp.leaveType}</TableCell>
                  <TableCell>
                    {new Date(selectedApp.leaveStartDate).toLocaleDateString()} →{" "}
                    {new Date(selectedApp.leaveEndDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{selectedApp.numberOfDays}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}

          <div className="dialog-body">
            <Label htmlFor="message">Message/Remarks:</Label>
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
              Send & {actionType === "approved" ? "Approve Leave" : "Reject Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}



