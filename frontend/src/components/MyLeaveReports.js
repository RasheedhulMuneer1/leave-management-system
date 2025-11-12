import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Download, Search, BarChart3 } from "lucide-react";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

export function MyLeaveReports() {
  const location = useLocation();
  const selectedUserName = location.state?.selectedUserName;
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userDetails, setUserDetails] = useState(null);

 useEffect(() => {
  async function fetchApplications() {
    try {
      if (!user?.token) return;

      const res = await API.get("/leave-applications", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const targetName = selectedUserName || user?.name;

      const userApps = res.data.filter((app) => {
        const appUserName =
          app.user?.name || app.userName || app.name || app.officerName;
        return (
          appUserName?.trim()?.toLowerCase() ===
          targetName?.trim()?.toLowerCase()
        );
      });

      setApplications(userApps);
      setFiltered(userApps);

      // extract and set user details from the first record 
      if (userApps.length > 0) {
        const first = userApps[0];
        setUserDetails({
          name: first.name || first.user?.name || "N/A",
          rank: first.rank || "N/A",
          role: first.attachedUserRole?.name || "N/A",
          establishment: first.currentEstablishment?.name || "N/A",
        });
      }
    } catch (err) {
      console.error("Error fetching leave data:", err);
      toast({
        title: "Error",
        description: "Failed to load leave report.",
        variant: "destructive",
      });
    }
  }

  fetchApplications();
}, [user, toast, selectedUserName]);



  const handleFilter = () => {
    let filteredData = applications;

    if (selectedLeaveType !== "All") {
      filteredData = filteredData.filter(
        (app) => app.leaveType === selectedLeaveType
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = filteredData.filter((app) => {
        const leaveDate = new Date(app.leaveStartDate);
        return leaveDate >= start && leaveDate <= end;
      });
    }

    setFiltered(filteredData);
  };

  const handleExportReport = () => {
    const csvContent = [
      "Leave Type,Start Date,End Date,Days,Status,Acting Member Status",
      ...filtered.map(
        (app) =>
          `${app.leaveType},${app.leaveStartDate},${app.leaveEndDate},${app.numberOfDays},${app.status},${app.actingMemberStatus}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leave-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalDays = filtered.reduce(
    (acc, curr) => acc + (curr.numberOfDays || 0),
    0
  );
  const approvedCount = filtered.filter(
    (a) =>
      a.status?.toLowerCase() === "approved" &&
      a.actingMemberStatus?.toLowerCase() === "approved"
  ).length;
  const pendingCount = filtered.filter(
    (a) =>
      a.status?.toLowerCase() === "pending" ||
      a.actingMemberStatus?.toLowerCase() === "pending"
  ).length;

  const chartData = Object.entries(
    filtered.reduce((acc, curr) => {
      acc[curr.leaveType] = (acc[curr.leaveType] || 0) + (curr.numberOfDays || 0);
      return acc;
    }, {})
  ).map(([type, days]) => ({ leaveType: type, days }));

  const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];

  return (
    <div className="space-y-10" align="center">
        <DashboardHeader/>


        {/* User details card  */}
{userDetails && (
  <Card className="w-full max-w-2xl mx-auto mb-6 text-left">
    <CardHeader>
      <CardTitle>User Information</CardTitle>
      <CardDescription>
        <div><strong>Name:</strong> {userDetails.name}</div>
        <div><strong>Rank:</strong> {userDetails.rank}</div>
        <div><strong>Role:</strong> {userDetails.role}</div>
        <div><strong>Establishment:</strong> {userDetails.establishment}</div>
      </CardDescription>
    </CardHeader>
  </Card>
)}

      
      <Card>
        


        <CardHeader>
                    
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> My Leave Report & Analytics
          </CardTitle>
          <CardDescription>
            Comprehensive report of your leave usage — filter, export and
            visualize data
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-4">
          <div>
            <Label>Leave Type</Label>
            <Select
              value={selectedLeaveType}
              onValueChange={setSelectedLeaveType}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                <SelectItem value="Half Day Leave">Half Day Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Start Date</Label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label>End Date</Label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleFilter} variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" /> Search
            </Button>
            <Button onClick={handleExportReport} className="w-full">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary  */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Approved Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {approvedCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Days Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
          </CardContent>
        </Card>
      </div>

    <div className="flex flex-col items-center w-full mt-8 space-y-6">
  <div className="w-full max-w-2xl px-4">
    <Card>
      <CardHeader>
        <CardTitle>Days Taken by Leave Type</CardTitle>
      </CardHeader>
      <CardContent className="chart1">
        {chartData.length > 0 ? (

          <ResponsiveContainer width="100%" height={300}>
  <BarChart width="100%" height= "100%" data={chartData}>
    <XAxis dataKey="leaveType" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="days" fill="#3B82F6" />
  </BarChart>
</ResponsiveContainer>

        ) : (
          <p className="text-muted-foreground text-sm">No data to display</p>
        )}
      </CardContent>
    </Card>
  </div>

  <div className="w-full max-w-2xl px-4">
    <Card>
      <CardHeader>
        <CardTitle>Leave Distribution</CardTitle>
      </CardHeader>
      <CardContent className="chart2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="days" nameKey="leaveType" label>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm">No data to display</p>
        )}
      </CardContent>
    </Card>
  </div>
</div>



      {/* Detailed UI table  */}
      <Card align="center">
        
        <CardHeader align="center">
          <CardTitle>Detailed Leave Applications</CardTitle>
          <CardDescription>
            View all your leave applications with status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No records found for selected filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black text-center">Leave Type</TableHead>
                  <TableHead className="text-black text-center">Start</TableHead>
                  <TableHead className="text-black text-center">End</TableHead>
                  <TableHead className="text-black text-center">Days</TableHead>
                  <TableHead className="text-black text-center">Acting Member Status</TableHead>
                  <TableHead className="text-black text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.leaveType}</TableCell>
                    <TableCell>
                      {new Date(app.leaveStartDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(app.leaveEndDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{app.numberOfDays}</TableCell>

                    <TableCell>
                 <Badge
    variant="outline"
    className={
      app.actingMemberStatus?.toLowerCase() === "approved"
        ? "approved-badge"
        : app.actingMemberStatus?.toLowerCase() === "pending"
        ? "pending-badge"
        : "rejected-badge"
    }
  >
    {app.actingMemberStatus
      ? app.actingMemberStatus.charAt(0).toUpperCase() +
        app.actingMemberStatus.slice(1).toLowerCase()
      : "-"}
                 </Badge>
                 </TableCell>

<TableCell>
  <Badge
    variant="outline"
    className={
      app.status?.toLowerCase() === "approved"
        ? "approved-badge"
        : app.status?.toLowerCase() === "pending"
        ? "pending-badge"
        : "rejected-badge"
    }
  >
    {app.status
      ? app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()
      : "-"}
  </Badge>
</TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}





