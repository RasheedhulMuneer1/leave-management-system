import React, { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useLocation, useNavigate } from "react-router-dom";
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
import { CalendarIcon, Send } from "lucide-react";
import { cn } from "../lib/util";
import { format } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { AuthContext } from "../context/AuthContext";
// import {DashboardHeader} from "./DashboardHeader";
import DashboardHeader from "./DashboardHeader";
import DashboardNavigation from "./DashboardLayout";

export default function LeaveApplicationsManagement() {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [actingMembers, setActingMembers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [criteria, setCriteria] = useState([]); 
  const [showLeaveCreatedPopup, setShowLeaveCreatedPopup] = useState(false);
  const [newLeaveData, setNewLeaveData] = useState(null);
  const [highlightId, setHighlightId] = useState(null);



  const location = useLocation();
  const editApp = location.state?.app || null;
  const navigate = useNavigate();



  // Calculate no of days already taken for a leave type in the current year
  const getTakenDaysThisYear = (leaveType) => {
    const year = new Date().getFullYear();
    return applications
      .filter(
        (app) =>
          app.leaveType === leaveType &&
          new Date(app.leaveStartDate).getFullYear() === year &&
          app.status === "approved"
      )
      .reduce((sum, app) => sum + (app.numberOfDays || 0), 0);
  };

  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    rank: "",
    role: "",
    estb: "",
    attachedUserRoleId: null,
    currentEstablishmentId: null,
    leaveType: "",
    firstAppointmentDate: null,
    startDate: null,
    endDate: null,
    days: "",
    reason: "",
    actingMember: "",
    address: "",
    contactNo: "",
  });

  // Fetch acting members
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await API.get("/users");
        const filteredUsers = res.data.filter(
          (u) =>
            u.username !== user?.username &&
            u.name?.trim().toLowerCase() !== user?.name?.trim().toLowerCase()
        );
        setActingMembers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
      }
    }
    if (user?.username) fetchUsers();
  }, [user]);


  // Fetch leave types
  useEffect(() => {
    async function fetchLeaveTypes() {
      try {
        const res = await API.get("/leave-types");
        setLeaveTypes(res.data);
      } catch (err) {
        console.error("Error fetching leave types:", err.response?.data || err.message);
      }
    }
    fetchLeaveTypes();
  }, []);

  // Fetch leave critera (for annually max days)
  useEffect(() => {
    async function fetchCriteria() {
      try {
        const res = await API.get("/leave-type-criteria");
        setCriteria(res.data);
      } catch (err) {
        console.error("Error fetching criteria:", err.response?.data || err.message);
      }
    }
    fetchCriteria();
  }, []);



  // prefill logged in user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!user?.username || !user?.token) return;
        const res = await API.get(`/users/username/${user.username}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const u = res.data;
        setFormData((prev) => ({
          ...prev,
          name: u.name || "",
          nic: u.nic || "",
          rank: u.rank || "",
          role: u.role?.name || "",
          estb: u.establishment?.name || "",
          attachedUserRoleId: u.role?.id || null,
          currentEstablishmentId: u.establishment?.id
            ? Number(u.establishment.id)
            : null,
          firstAppointmentDate: u.activeFrom ? new Date(u.activeFrom) : null,
        }));
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
    fetchUserData();
  }, [user]);


  useEffect(() => {
  if (editApp) {
    setFormData({
      ...formData,
      name: editApp.name || "",
      nic: editApp.nic || "",
      rank: editApp.rank || "",
      role: editApp.role || editApp.attachedUserRole?.name || "",
      estb: editApp.establishment || editApp.currentEstablishment?.name || "",
      leaveType: editApp.leaveType || "",
      firstAppointmentDate: editApp.dateOfFirstAppointment
        ? new Date(editApp.dateOfFirstAppointment)
        : null,
      startDate: editApp.leaveStartDate ? new Date(editApp.leaveStartDate) : null,
      endDate: editApp.leaveEndDate ? new Date(editApp.leaveEndDate) : null,
      days: editApp.numberOfDays?.toString() || "",
      reason: editApp.reasonForLeave || "",
      actingMember: editApp.actingMember || "",
      address: editApp.addressDuringLeave || "",
      contactNo: editApp.contactNumber || "",
      attachedUserRoleId: editApp.attachedUserRoleId || null,
      currentEstablishmentId: editApp.currentEstablishmentId || null,
    });
  }
}, [editApp]);



  // Auto calculate days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const diffTime = Math.abs(formData.endDate - formData.startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData((prev) => ({ ...prev, days: diffDays.toString() }));
    }
  }, [formData.startDate, formData.endDate]);


  // Fetch user applications
  useEffect(() => {
    async function fetchApplications() {
      try {
        if (!user?.token || !formData.nic) return;
        const res = await API.get("/leave-applications", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const userApps = res.data.filter(
          (app) => app.nic?.trim() === formData.nic?.trim()
        );
        setApplications(userApps);
      } catch (err) {
        console.error("Error fetching applications:", err.response?.data || err.message);
      }
    }
    if (formData.nic) fetchApplications();
  }, [formData.nic, user]);


    useEffect(() => {
    const idFromLocation = location.state?.highlightId;
    const idFromStorage = localStorage.getItem("highlightLeaveId");
    if (idFromLocation) {
      setHighlightId(Number(idFromLocation));
      localStorage.setItem("highlightLeaveId", idFromLocation);
    } else if (idFromStorage) {
      setHighlightId(Number(idFromStorage));
    }
  }, [location.state]);

  useEffect(() => {
    if (highlightId && applications.length > 0) {
      const targetRow = document.getElementById(`leave-${highlightId}`);
      if (targetRow) {
        targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
        targetRow.classList.add("highlight-row");
        setTimeout(() => {
          targetRow.classList.remove("highlight-row");
          localStorage.removeItem("highlightLeaveId"); 
        }, 3000);
      }
    }
  }, [highlightId, applications]);



  
  const handleLeaveTypeChange = (value) => {
    const selectedLeave = leaveTypes.find((lt) => lt.leaveType === value);
    const leaveCriterion = criteria.find((c) => c.leaveType === value);

    const maxDays = selectedLeave?.maxDays || 0;
    const maxPerYear = leaveCriterion?.maxPerYear || maxDays;
    const takenDays = getTakenDaysThisYear(value);

    setFormData((prev) => ({
      ...prev,
      leaveType: value,
      maxDays, // per application
      maxPerYear, // yearly limit
      daysTaken: takenDays, // already used this year
      endDate: null,
      days: "",
    }));
  };

  // Submit validation
  const handleSubmit = async (e) => {
    e.preventDefault();


    if (
      !formData.leaveType ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.actingMember
    ) {
      
      
      toast({
  title: editApp ? "Leave Application Updated" : "Leave Application Submitted",
  description: "Your application has been saved successfully.",
});


// redirect back to PendingLeaveRequests and trigger reload
navigate("/pending", { state: { updated: true } });

      return;


    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.startDate < today || formData.endDate < today) {
      toast({
        title: "Invalid Dates",
        description:
          "Start date and end date cannot be in the past. Please select future dates.",
        variant: "destructive",
      });
      return;
    }

    if (formData.endDate <= formData.startDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after the start date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedActingMember = actingMembers.find(
        (u) => u.id === Number(formData.actingMember)
      );
      if (!selectedActingMember) {
        toast({
          title: "Invalid Acting Member",
          description: "Please select a valid acting member.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        name: formData.name,
        nic: formData.nic,
        rank: formData.rank,
        role: formData.role,
        leaveType: formData.leaveType,
        dateOfFirstAppointment: formData.firstAppointmentDate?.toISOString(),
        leaveStartDate: formData.startDate?.toISOString(),
        leaveEndDate: formData.endDate?.toISOString(),
        numberOfDays: parseInt(formData.days, 10),
        actingMember: selectedActingMember.name,
        reasonForLeave: formData.reason,
        addressDuringLeave: formData.address,
        contactNumber: formData.contactNo,
        attachedUserRoleId: Number(formData.attachedUserRoleId),
        currentEstablishmentId: Number(formData.currentEstablishmentId),
        status: "pending",
        actingMemberStatus: "pending",
      };

      

      let res;
if (editApp) {
  // update existing leave application
  res = await API.put(`/leave-applications/${editApp.id}`, payload, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
  toast({
    title: "Leave Application Updated",
    description: "Your application has been updated successfully.",
  });
} else {

  // create new leave application
  res = await API.post("/leave-applications", payload, {
    headers: { Authorization: `Bearer ${user.token}` },
  });

  setNewLeaveData(res.data);
  setShowLeaveCreatedPopup(true); // to display the notification popup

  toast({
    title: "Leave Application Submitted",
    description: "Your application has been saved successfully.",
  });
}



      

      setApplications((prev) => {
  if (editApp) {
    // update existing leave
    return prev.map((app) =>
      app.id === editApp.id
        ? {
            ...app,
            ...payload,
            currentEstablishment: { name: formData.estb },
            attachedUserRole: { name: formData.role },
          }
        : app
    );
  } else {

    // add new leave
    return [
      ...prev,
      {
        ...payload,
        id: res.data.id || Date.now(),
        currentEstablishment: { name: formData.estb },
        attachedUserRole: { name: formData.role },
      },
    ];
  }
});


      toast({
        title: "Leave Application Submitted",
        description: "Your application has been saved successfully.",
      });



      setFormData((prev) => ({
        ...prev,
        leaveType: "",
        startDate: null,
        endDate: null,
        days: "",
        reason: "",
        actingMember: "",
        address: "",
        contactNo: "",
      }));
    } catch (error) {
      console.error("Error saving leave application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error saving your leave application.",
        variant: "destructive",
      });

    }


  };


  const getStatusBadge = (status) => {
  if (!status) return <Badge variant="outline">Pending</Badge>;

  switch (status.toLowerCase()) {
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
      return <Badge variant="outline">Pending</Badge>;
  }
};



  return (

     
    
  <div className="space-y-10">
    <div className="space-y-2"> 
  <DashboardHeader/>


    </div>
  


    <Card>
      <CardHeader>
        <CardTitle align="center">Apply for Leave</CardTitle>
        <CardDescription align="center">Fill in all required details for your leave application </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" align="center">
          <div className="grid gap-6 md:grid-cols-2">

            {/* Read-only fields  */}
            {["name", "nic", "rank", "role", "estb"].map((field) => (
              <div key={field} className="space-y-2">
                <Label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input value={formData[field]} readOnly className="bg-muted" />
              </div>
            ))}

            <div className="space-y-2">
              <Label>Date of First Appointment</Label>
              <Input
                value={
                  formData.firstAppointmentDate
                    ? format(formData.firstAppointmentDate, "PPP")
                    : ""
                }
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={formData.leaveType} onValueChange={handleLeaveTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.length > 0 ? (
                    leaveTypes.map((type) => (
                      <SelectItem key={type.id} value={type.leaveType}>
                        {type.leaveType}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No leave types available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>



            <div className="space-y-2">
              <Label>Leave Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left w-full",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? format(formData.startDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => {
                      if (!date) return;

                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) {
                        toast({
                          title: "Invalid Start Date",
                          description: "Start date cannot be in the past.",
                          variant: "destructive",
                        });
                        return;
                      }

                      setFormData((prev) => ({
                        ...prev,
                        startDate: date,
                        endDate: null,
                        days: "",
                      }));
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            

<div className="space-y-2">
  <Label>Leave End Date</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "justify-start text-left w-full",
          !formData.endDate && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formData.endDate
          ? format(formData.endDate, "PPP")
          : "Select date"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={formData.endDate}
        onSelect={(date) => {
          if (!formData.startDate) {
            toast({
              title: "Select Start Date First",
              description: "Please select the start date before the end date.",
              variant: "destructive",
            });
            return;
          }

          if (!date || date <= formData.startDate) {
            toast({
              title: "Invalid End Date",
              description: "End date must be after the start date.",
              variant: "destructive",
            });
            return;
          }

          const diffTime = date.getTime() - formData.startDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          const remainingDays =
            (formData.maxPerYear || formData.maxDays || 0) - (formData.daysTaken || 0);

          if (diffDays > formData.maxDays) {
            toast({
              title: "Exceeds Max Days Per Application",
              description: `You can only take up to ${formData.maxDays} days for ${formData.leaveType} at a time.`,
              variant: "destructive",
            });
            return;
          }

          if (diffDays > remainingDays) {
            toast({
              title: "Exceeds Yearly Limit",
              description: `You have only ${remainingDays} remaining day(s) for ${formData.leaveType} this year.`,
              variant: "destructive",
            });
            return;
          }

          setFormData((prev) => ({
            ...prev,
            endDate: date,
            days: diffDays,
          }));
        }}
        disabled={(date) => !formData.startDate || date <= formData.startDate}
      />
    </PopoverContent>
  </Popover>
</div>


            <div className="space-y-2">
              <Label>Number of Days</Label>
              <Input
                value={formData.days || "0"}
                readOnly
                className="bg-muted"
                placeholder={`Remaining this year: ${
                  (formData.maxPerYear || formData.maxDays || 0) -
                  (formData.daysTaken || 0)
                } days`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Acting Member</Label>
            <Select
              value={formData.actingMember}
              onValueChange={(value) =>
                setFormData((p) => ({ ...p, actingMember: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select acting member" />
              </SelectTrigger>
              <SelectContent>
                {actingMembers.length > 0 ? (
                  actingMembers.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.nic} — {u.name} — {u.role.name} — {u.rank} —{" "}
                      {u.establishment.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No users available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reason for Leave</Label>
            <Textarea
              placeholder="Enter reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData((p) => ({ ...p, reason: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Address During Leave</Label>
              <Textarea
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, address: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                placeholder="Enter contact number"
                value={formData.contactNo}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, contactNo: e.target.value }))
                }
                required
              />
            </div>
          </div>

         

         <div className="flex gap-4 mt-4">                
  <Button type="submit" className="flex-1 bg-black-600 hover:bg-bl-700 text-white">
    <Send className="w-4 h-4 mr-2" /> Submit Application
  </Button>

  <Button type="button"  onClick={() => window.location.reload()}  className="flex-1 bg-blue-600 hover:bg-red-700 text-black"
  >
    Cancel
  </Button>
         </div>



        </form>
      </CardContent>
    </Card>

    {/* Table Section  */}

    <Card align="center">
      <CardHeader align="center">
        <CardTitle>My Leave Applications</CardTitle>
        <CardDescription>
          Track the status of your applied leaves
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-900"> 
              <TableHead className="text-black">Leave Type</TableHead>
              <TableHead className="text-black">Period</TableHead>
              <TableHead className="text-black">Days</TableHead>
              <TableHead className="text-black">Acting Member</TableHead>
              <TableHead className="text-black">Acting Member Remarks</TableHead>
              <TableHead className="text-black">Acting Member Status</TableHead>
              <TableHead className="text-black">Reason For Leave</TableHead>
              <TableHead className="text-black">Address During Leave</TableHead>
              <TableHead className="text-black">Contact No</TableHead>
              <TableHead className="text-black">Leave Approve Member Remarks</TableHead>
              <TableHead className="text-black">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {applications.length > 0 ? (
    applications.map((app) => {
      const isFullyApproved =
        app.actingMemberStatus?.toLowerCase() === "Approved" &&
        app.status?.toLowerCase() === "Approved";

      return (
      

        <TableRow  key={app.id}  className={isFullyApproved ? "!bg-blue-700 hover:!bg-blue-900 text-black" : ""}>

        
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
          <TableCell>{app.leaveApproveMemberRemarks || "-"}</TableCell>
          <TableCell>{getStatusBadge(app.status)}</TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={14} className="text-center text-muted-foreground">
        No leave applications found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </CardContent>
    </Card>
    {showLeaveCreatedPopup && newLeaveData && (
  <div className="delete-confirmation-popup">
    <div className="delete-modal-box">
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
            <td className="border px-2 py-1">{newLeaveData.name || "-"}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2 py-1 bg-gray-50">Leave Type</td>
            <td className="border px-2 py-1">{newLeaveData.leaveType || "-"}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2 py-1 bg-gray-50">Period</td>
            <td className="border px-2 py-1">
              {newLeaveData.leaveStartDate
                ? new Date(newLeaveData.leaveStartDate).toLocaleDateString()
                : "-"}{" "}
              to {" "}
              {newLeaveData.leaveEndDate
                ? new Date(newLeaveData.leaveEndDate).toLocaleDateString()
                : "-"}
            </td>
          </tr>
          <tr>
            <td className="font-semibold border px-2 py-1 bg-gray-50">Days</td>
            <td className="border px-2 py-1">{newLeaveData.numberOfDays || "-"}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2 py-1 bg-gray-50">Reason</td>
            <td className="border px-2 py-1">{newLeaveData.reasonForLeave || "-"}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2 py-1 bg-gray-50">Acting Member</td>
            <td className="border px-2 py-1">{newLeaveData.actingMember || "-"}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2 py-1 bg-gray-50">Address During Leave</td>
            <td className="border px-2 py-1">{newLeaveData.addressDuringLeave || "-"}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2 py-1 bg-gray-50">Contact No</td>
            <td className="border px-2 py-1">{newLeaveData.contactNumber || "-"}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-center">
        <button
          onClick={() => setShowLeaveCreatedPopup(false)}
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







