import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog,  DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select,  SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import DashboardHeader from "./DashboardHeader";

const mockLeaveHistory = [
  {
    id: "LA001",
    leaveType: "Annual Leave",
    startDate: "2024-03-15",
    endDate: "2024-03-20",
    days: 5,
    reason: "Family vacation",
    status: "approved",
    appliedDate: "2024-03-01",
    canEdit: false,
    canCancel: false
  },
  {
    id: "LA002",
    leaveType: "Sick Leave",
    startDate: "2024-04-10",
    endDate: "2024-04-12",
    days: 3,
    reason: "Medical treatment",
    status: "pending",
    appliedDate: "2024-04-08",
    canEdit: true,
    canCancel: true
  },
  {
    id: "LA003",
    leaveType: "Casual Leave",
    startDate: "2024-02-05",
    endDate: "2024-02-07",
    days: 3,
    reason: "Personal work",
    status: "rejected",
    appliedDate: "2024-02-01",
    canEdit: false,
    canCancel: false,
    remarks: "Insufficient leave balance"
  },
  {
    id: "LA004",
    leaveType: "Half Day Leave",
    startDate: "2023-12-15",
    endDate: "2023-12-15",
    days: 0.5,
    reason: "Doctor appointment",
    status: "approved",
    appliedDate: "2023-12-14",
    canEdit: false,
    canCancel: false
  }
];

export function MyLeaveHistory({ showCurrentYearOnly = false }) {
  const [leaves, setLeaves] = useState(mockLeaveHistory);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();
  const filteredLeaves = showCurrentYearOnly 
    ? leaves.filter(leave => new Date(leave.startDate).getFullYear() === currentYear)
    : leaves;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-warning border-warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleEdit = (leave) => {
    setSelectedLeave({ ...leave });
    setEditMode(true);
  };

  const handleCancel = (leaveId, reason) => {
    setLeaves(prev => 
      prev.map(leave => 
        leave.id === leaveId 
          ? { ...leave, status: 'cancelled', cancelReason: reason }
          : leave
      )
    );
    
    toast({
      title: "Leave Cancelled",
      description: "Your leave application has been cancelled successfully.",
    });
    
    setSelectedLeave(null);
    setCancelReason("");
  };

  const handleUpdate = (updatedLeave) => {
    setLeaves(prev => 
      prev.map(leave => 
        leave.id === updatedLeave.id ? updatedLeave : leave
      )
    );
    
    toast({
      title: "Leave Updated",
      description: "Your leave application has been updated successfully.",
    });
    
    setSelectedLeave(null);
    setEditMode(false);
  };

  return (
    <Card>
        <DashboardHeader/>
      
      <CardHeader>
        
        <CardTitle className="flex items-center gap-2" align="center">
          
          <Calendar className="h-5 w-5" />
          {showCurrentYearOnly ? `Leave History - ${currentYear}` : "Complete Leave History"}
        </CardTitle>
        <CardDescription align="center">
          {showCurrentYearOnly 
            ? `View all leave applications for the current year (${currentYear})`
            : "View and manage all your leave applications"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredLeaves.length === 0 ? ( 
          <div className="flex items-center gap-2" align="center">


            No leave applications found {showCurrentYearOnly ? 'for current year' : ''}.
          </div>
        ) : (


          <Table className="flex items-center gap-2" align="center" >
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.id}</TableCell>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {leave.startDate} → {leave.endDate}
                    </div>
                  </TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell>{getStatusBadge(leave.status)}</TableCell>
                  <TableCell>{leave.appliedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedLeave(leave);
                              setEditMode(false);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Leave Application Details</DialogTitle>
                            <DialogDescription>Application ID: {selectedLeave?.id}</DialogDescription>
                          </DialogHeader>
                          
                          {selectedLeave && (
                            <div className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label className="font-semibold">Leave Type</Label>
                                  <div className="p-2 border rounded bg-muted/50">
                                    {selectedLeave.leaveType}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="font-semibold">Status</Label>
                                  <div className="p-2 border rounded bg-muted/50">
                                    {getStatusBadge(selectedLeave.status)}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="font-semibold">Start Date</Label>
                                  <div className="p-2 border rounded bg-muted/50">
                                    {selectedLeave.startDate}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="font-semibold">End Date</Label>
                                  <div className="p-2 border rounded bg-muted/50">
                                    {selectedLeave.endDate}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="font-semibold">Reason</Label>
                                <div className="p-2 border rounded bg-muted/50">
                                  {selectedLeave.reason}
                                </div>
                              </div>
                              
                              {selectedLeave.remarks && (
                                <div className="space-y-2">
                                  <Label className="font-semibold">Remarks</Label>
                                  <div className="p-2 border rounded bg-muted/50">
                                    {selectedLeave.remarks}
                                  </div>
                                </div>
                              )}
                              
                              {selectedLeave.status === 'pending' && (
                                <div className="flex gap-2 pt-4">
                                  {selectedLeave.canEdit && (
                                    <Button 
                                      onClick={() => setEditMode(true)}
                                      className="flex-1"
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Application
                                    </Button>
                                  )}
                                  {selectedLeave.canCancel && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="destructive" className="flex-1">
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Cancel Application
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Cancel Leave Application</DialogTitle>
                                          <DialogDescription>
                                            Please provide a reason for cancelling this leave application.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="cancelReason">Cancellation Reason</Label>
                                            <Textarea
                                              id="cancelReason"
                                              placeholder="Enter reason for cancellation..."
                                              value={cancelReason}
                                              onChange={(e) => setCancelReason(e.target.value)}
                                            />
                                          </div>
                                          <div className="flex gap-2">
                                            <Button 
                                              variant="destructive"
                                              onClick={() => handleCancel(selectedLeave.id, cancelReason)}
                                              disabled={!cancelReason.trim()}
                                              className="flex-1" 
                                            >
                                              Confirm Cancellation 
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          
        )}
      </CardContent>
    </Card>
  );
}
