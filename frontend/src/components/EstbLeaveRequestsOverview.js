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
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "../hooks/use-toast";
import { AuthContext } from "../context/AuthContext";
import DashboardHeader from "./DashboardHeader";

export default function EstbLeaveRequestsOverview() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [establishments, setEstablishments] = useState([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  // fetch all leave applications
  useEffect(() => {
    async function fetchApplications() {
      try {
        if (!user?.token) return;

        const res = await API.get("/leave-applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setApplications(res.data);
        setFilteredApps(res.data);


         // extract unique estb names
        const uniqueEstbs = [
          ...new Set(
            res.data
              .map((app) => app.currentEstablishment?.name)
              .filter(Boolean)
          ),
        ];
        setEstablishments(uniqueEstbs);
      } catch (err) {
        console.error("❌ Error fetching applications:", err);
        toast({
          title: "Error",
          description: "Failed to load leave applications.",
          variant: "destructive",
        });
      }
    }
    fetchApplications();
  }, [user, toast]);

  // Handle filtering
  useEffect(() => {
    let filtered = applications;


    if (selectedEstablishment && selectedEstablishment !== "all") {
  filtered = filtered.filter(
    (app) =>
      app.currentEstablishment?.name?.toLowerCase() ===
      selectedEstablishment.toLowerCase()
  );
}


    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (app) =>
          app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.nic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.rank?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.attachedUserRole?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApps(filtered);
  }, [searchTerm, selectedEstablishment, applications]);

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
        <DashboardHeader/>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
<Select
  value={selectedEstablishment}
  onValueChange={setSelectedEstablishment}
>
  <SelectTrigger className="w-[220px]">
    <SelectValue placeholder="Filter by Establishment" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Establishments</SelectItem>
    {establishments.map((estb, idx) => (
      <SelectItem key={idx} value={estb}>
        {estb}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

            {/* Search Field */}
          <Input
            type="text"
            placeholder="Search by Name, NIC, Rank, Role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[260px]"
          />
        </div>
      </div>

      <Card align="center">
        <CardHeader align="center">
          <CardTitle>Establishment-Level Leave Requests</CardTitle>
          <CardDescription>
            Overview of all leave applications filtered by establishment or search criteria
          </CardDescription>
        </CardHeader>

        <CardContent align="center">
          <Table align="center">
            <TableHeader align="center">
              <TableRow align="center"> 
                <TableHead className="text-black">Name</TableHead>
                <TableHead className="text-black">NIC</TableHead>
                <TableHead className="text-black">Establishment</TableHead>
                {/* <TableHead className="text-black">Role</TableHead> */}
                {/* <TableHead className="text-black">Rank</TableHead> */}
                <TableHead className="text-black">Leave Type</TableHead>
                <TableHead className="text-black">Period</TableHead>
                <TableHead className="text-black">Days</TableHead>
                <TableHead className="text-black">Acting Member</TableHead>
                <TableHead className="text-black">Acting Member Status</TableHead>
                <TableHead className="text-black">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.name || "-"}<br></br> Rank: {app.rank || "-"} <br></br>Role: {app.attachedUserRole?.name || "-"}  </TableCell>
                    <TableCell>{app.nic || "-"}</TableCell>
                    <TableCell>{app.currentEstablishment?.name || "-"}</TableCell>
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
                    <TableCell>{getStatusBadge(app.actingMemberStatus)}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center text-muted-foreground"
                  >
                    No leave applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
