import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table,  TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Send, ArrowRight, Building, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import DashboardHeader from "./DashboardHeader";


export function LeaveForwardingManagement() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [forwardingRemarks, setForwardingRemarks] = useState("");
  const { toast } = useToast();

  const handleForwardApplication = (applicationId, orgId, remarks) => {
    

    toast({
      title: "Application Forwarded",
    });

    setSelectedApplication(null);
    setSelectedOrganization("");
    setForwardingRemarks("");
  };

  const handleCancelApplication = (applicationId) => {

    toast({
      title: "Application Cancelled",
      description: "Leave application has been cancelled.",
    });

    setSelectedApplication(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_forward':
        return <Badge variant="outline" className="text-warning border-warning">Pending Forward</Badge>;
      case 'forwarded':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Forwarded</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-destructive border-destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
        <DashboardHeader/>
      
      <div className="grid gap-4 md:grid-cols-4">
        {/* Cards Overview  */}
        <Card align="center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Forward</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
            </div>
            <p className="text-xs text-muted-foreground">Awaiting forwarding</p>
          </CardContent>
        </Card>
      </div>


    // Leave Applications Table 

      <Card align="center">
        <CardHeader align="center">
          <CardTitle>Leave Applications for External Forwarding</CardTitle>
          <CardDescription>Forward leave applications to external organizations or cancel them</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Applicant Name</TableHead>
                <TableHead>NIC</TableHead>
                <TableHead>Establishment</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Period</TableHead> 
                <TableHead>Days</TableHead> 
                <TableHead>Acting Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody align="center">
              {((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.applicantName}</div>
                      <div className="text-sm text-muted-foreground">{application.applicantId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{application.nic}</TableCell>
                  <TableCell>{application.establishment}</TableCell>
                  <TableCell>{application.role}</TableCell>
                  <TableCell>{application.rank}</TableCell>

                  <TableCell>{application.leaveType}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {application.startDate} to {application.endDate}
                    </div>
                  </TableCell>
                  <TableCell>{application.days}</TableCell>
                  <TableCell>{application.actingMember}</TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>

                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          {application.status === 'pending_forward' ? 'Forward' : 'View'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Forward Leave Application</DialogTitle>
                          <DialogDescription>
                            Application ID: {selectedApplication?.id}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                          <div className="space-y-6">
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
