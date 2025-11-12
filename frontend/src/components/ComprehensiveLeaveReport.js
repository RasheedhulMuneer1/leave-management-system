import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "./ui/table";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import DashboardHeader from "./DashboardHeader";

export default function ComprehensiveLeaveReport() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [establishments, setEstablishments] = useState([]);
  const [selectedEstablishment, setSelectedEstablishment] = useState("all");
  const [leaveType, setLeaveType] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  // fetch data
  useEffect(() => {
    async function fetchApplications() {
      try {
        if (!user?.token) return;
        const res = await API.get("/leave-applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setApplications(res.data);
        setFilteredApps(res.data);


        // unique establishments
        const uniqueEstb = [
          ...new Set(res.data.map((a) => a.currentEstablishment?.name).filter(Boolean)),
        ];
        setEstablishments(uniqueEstb);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast({
          title: "Error",
          description: "Failed to load leave report data.",
          variant: "destructive",
        });
      }
    }
    fetchApplications();
  }, [user, toast]);


  // filter logic
  useEffect(() => {
    let filtered = [...applications];

    if (selectedEstablishment !== "all") {
      filtered = filtered.filter(
        (a) =>
          a.currentEstablishment?.name?.toLowerCase() ===
          selectedEstablishment.toLowerCase()
      );
    }

    if (leaveType !== "all") {
      filtered = filtered.filter(
        (a) => a.leaveType?.toLowerCase() === leaveType.toLowerCase()
      );
    }

    if (status !== "all") {
      filtered = filtered.filter(
        (a) => a.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name?.toLowerCase().includes(s) || a.nic?.toLowerCase().includes(s)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((a) => {
        const appDate = new Date(a.leaveStartDate);
        return appDate >= new Date(startDate) && appDate <= new Date(endDate);
      });
    }

    setFilteredApps(filtered);
  }, [
    applications,
    selectedEstablishment,
    leaveType,
    status,
    search,
    startDate,
    endDate,
  ]);


  // chart data
  const leaveTypeData = Object.entries(
    filteredApps.reduce((acc, app) => {
      acc[app.leaveType] = (acc[app.leaveType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const statusData = Object.entries(
    filteredApps.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));


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
      
      <Card>
        <CardHeader>
          <CardTitle align="center">Comprehensive Leave Report</CardTitle>
          <CardDescription align="center">
            Analyze leave requests across establishments, leave types, and statuses.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Select
              value={selectedEstablishment}
              onValueChange={setSelectedEstablishment}
            >
              <SelectTrigger>
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


            {/* leave type filter  */}

            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger>
                <SelectValue placeholder="Leave Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
              </SelectContent>
            </Select>


              {/* status filter  */}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* date range  */}
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* search  */}
          <Input
            placeholder="Search by Name or NIC"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2"
          />

          {/* charts  */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle align="center">Leave Requests by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={leaveTypeData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle align="center">Leave Requests by Status</CardTitle>
              </CardHeader>
              <CardContent>

                <ResponsiveContainer width="100%" height={300}>
  <PieChart width="100%" height= "100%">
    <Pie
      data={statusData}
      dataKey="value"
      nameKey="name"
      outerRadius={90}
      label
    >
      {statusData.map((entry, index) => {
        let color = "#ccc"; 
        if (entry.name?.toLowerCase() === "approved") color = "#16a34a"; 
        else if (entry.name?.toLowerCase() === "pending") color = "#ca8a04"; 
        else if (entry.name?.toLowerCase() === "rejected") color = "#dc2626"; 
        return <Cell key={`cell-${index}`} fill={color} />;
      })}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>

              </CardContent>
            </Card>
          </div>

          {/* Table  */}
          <div className="overflow-x-auto mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black text-center">Name</TableHead>
                  <TableHead className="text-black text-center">NIC</TableHead>
                  <TableHead className="text-black text-center">Establishment</TableHead>
                  <TableHead className="text-black text-center">Leave Type</TableHead>
                  <TableHead className="text-black text-center">Start Date</TableHead>
                  <TableHead className="text-black text-center">End Date</TableHead>
                  <TableHead className="text-black text-center">Days</TableHead>
                  <TableHead className="text-black text-center">Acting Member Status</TableHead>
                  <TableHead className="text-black text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.name} <br></br>Rank: {app.rank} <br></br>Role: {app.attachedUserRole?.name}</TableCell>   
                      <TableCell>{app.nic}</TableCell>
                      <TableCell>{app.currentEstablishment?.name}</TableCell>
                      <TableCell>{app.leaveType}</TableCell>
                      <TableCell>
                        {app.leaveStartDate
                          ? format(new Date(app.leaveStartDate), "yyyy-MM-dd")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {app.leaveEndDate
                          ? format(new Date(app.leaveEndDate), "yyyy-MM-dd")
                          : "-"}
                      </TableCell>
                      <TableCell>{app.numberOfDays || "-"}</TableCell>
                      <TableCell>{getStatusBadge(app.actingMemberStatus)}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
