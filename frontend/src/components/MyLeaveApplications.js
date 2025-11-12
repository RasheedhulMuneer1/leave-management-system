import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import DashboardHeader from "./DashboardHeader";

export default function MyLeaveApplications() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [carryOverSummary, setCarryOverSummary] = useState({});
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveCriteria, setLeaveCriteria] = useState([]);



  // Fetch applications, leave types and criteria
  useEffect(() => {
    if (!user?.token) return;

    async function fetchApplications() {
      try {
        const res = await API.get("/leave-applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });


        // filter by logged in user and approved statuses
        const userApps = res.data.filter(
          (app) =>
            app.name?.trim()?.toLowerCase() ===
              user?.name?.trim()?.toLowerCase() &&
            app.status?.trim()?.toLowerCase() === "approved" &&
            app.actingMemberStatus?.trim()?.toLowerCase() === "approved"
        );

        setApplications(userApps);
      } catch (err) {
        console.error("Error fetching applications:", err);
        toast({
          title: "Error",
          description: "Failed to load your leave applications.",
          variant: "destructive",
        });
      }
    }

    async function fetchLeaveTypes() {
      try {
        const res = await API.get("/leave-types", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaveTypes(res.data);
      } catch (err) {
        console.error("Error fetching leave types:", err);
      }
    }

    async function fetchLeaveCriteria() {
      try {
        const res = await API.get("/leave-type-criteria", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaveCriteria(res.data);
      } catch (err) {
        console.error("Error fetching leave criteria:", err);
      }
    }

    fetchApplications();
    fetchLeaveTypes();
    fetchLeaveCriteria(); 
  }, [user, toast]);



  // Computes carry-over summary
useEffect(() => {
  if (applications.length === 0 || leaveTypes.length === 0) return;

  const summary = {};

  leaveTypes
    .filter(
      (lt) =>
        lt.carryOver === true || String(lt.carryOver).toLowerCase() === "yes"
    )
    .forEach((lt) => {
      const usedDays = applications
        .filter(
          (a) =>
            a.leaveType?.trim().toLowerCase() ===
            (lt.name || lt.leaveType)?.trim().toLowerCase()
        )
        .reduce((sum, a) => sum + (a.numberOfDays || 0), 0);

      const maxPerYear = lt.maxPerYear || lt.maxDays || 0;
      const carryOverDays = lt.carryOverDays || 0;


      // Computes remaining and effective max days correctly
      const remaining = Math.max(effectiveMaxThisYear - usedDays, 0);
      const effectiveMaxThisYear = remaining + carryOverDays;


      summary[lt.name || lt.leaveType] = {
        carryOverDays,
        maxPerYear,
        usedDays,
        remaining,
        effectiveMaxThisYear,
      };
    });

  setCarryOverSummary(summary);
}, [applications, leaveTypes]);




  // Combine carry-over and criteria logic
  useEffect(() => {
    if (applications.length === 0 || leaveCriteria.length === 0) return;

    const summary = {};
    const currentYear = new Date().getFullYear();

    leaveCriteria.forEach((criteria) => {
      const leaveType = criteria.leaveType?.trim()?.toLowerCase();

      const usedDays = applications
        .filter(
          (a) =>
            a.leaveType?.trim()?.toLowerCase() === leaveType &&
            new Date(a.leaveStartDate).getFullYear() === currentYear &&
            new Date(a.leaveEndDate).getFullYear() === currentYear
        )
        .reduce((sum, a) => sum + (a.numberOfDays || 0), 0);

      const maxPerYear = criteria.maxPerYear || 0;
      const carryOverDays = criteria.carryOver ? criteria.carryOverDays || 0 : 0;
      const effectiveMaxThisYear = maxPerYear + carryOverDays;
      const remaining = Math.max(effectiveMaxThisYear - usedDays, 0);

      summary[criteria.leaveType] = {
        carryOverDays,
        maxPerYear,
        usedDays,
        remaining,
        effectiveMaxThisYear,
      };
    });

    setCarryOverSummary(summary);
  }, [applications, leaveCriteria]);


  // Status badge generate
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

  return (
    <div className="space-y-10">
        <DashboardHeader/> <Card align="center">
        <CardHeader align="center">
          <CardTitle>My Completed Leave Applications</CardTitle>
          <CardDescription>View your approved leave applications</CardDescription>
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
                <TableHead  className="text-black text-center">Leave Type</TableHead>
                <TableHead  className="text-black text-center">Period</TableHead>
                <TableHead  className="text-black text-center">Days</TableHead>
                <TableHead  className="text-black text-center">Acting Member</TableHead>
                <TableHead  className="text-black text-center">Acting Member Remarks</TableHead>
                <TableHead  className="text-black text-center">Acting Member Status</TableHead>
                <TableHead  className="text-black text-center">Reason For Leave</TableHead>
                <TableHead  className="text-black text-center">Address During Leave</TableHead>
                <TableHead  className="text-black text-center">Contact No</TableHead>
                <TableHead  className="text-black text-center">Leave Approve Member Remarks</TableHead>
                <TableHead  className="text-black text-center">Status</TableHead>
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
                      to{" "}
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
                    <TableCell>{app.leaveApproveMemberRemarks || "-"}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={16} className="text-center text-muted-foreground">
                    No completed (approved) leave applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          

          {/* Summary Table  */}

          <Card className="space-y-10" align="center">
  <CardHeader align="center">
    <CardTitle>Remaining Leave Summary (Carry Over Types)</CardTitle>
    <CardDescription>
      Shows how many leave days you have left for each carry-over leave type this year
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow className="bg-blue-100">
          <TableHead className="text-black text-center">Leave Type</TableHead>
          <TableHead className="text-black text-center">Max Days Per Year</TableHead>
          <TableHead className="text-black text-center">Carry Over Days</TableHead>
          <TableHead className="text-black text-center">Used Days</TableHead>
          <TableHead className="text-black text-center">Remaining Days (This Year)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(carryOverSummary).length > 0 ? (
          Object.entries(carryOverSummary).map(([type, data]) => (
            <TableRow key={type}>
              <TableCell className="text-center">{type}</TableCell>
              <TableCell className="text-center">{data.maxPerYear}</TableCell>
              <TableCell className="text-center">{data.carryOverDays}</TableCell>
              <TableCell className="text-center">{data.usedDays}</TableCell>
              <TableCell className="text-center">{data.remaining}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No carry-over leave types found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </CardContent>
</Card>

        </CardContent>
      </Card>
    </div>
  );
}
