import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import DashboardHeader from "./DashboardHeader";



export function ServiceMembersReport() {
  const [selectedEstablishment, setSelectedEstablishment] = useState("");

  return (
    <Card className="space-y-2" align="center" >
        <DashboardHeader/>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Service Members Report
        </CardTitle>
        <CardDescription>
          View detailed reports of all service members
        </CardDescription>

        <div className="flex gap-4 items-center">
          <div className="w-64">
            <Select value={selectedEstablishment} onValueChange={setSelectedEstablishment}>
              <SelectTrigger>
                <SelectValue placeholder="Select establishment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Establishments</SelectItem>
                <SelectItem value="alpha">Alpha Company</SelectItem>
                <SelectItem value="beta">Beta Company</SelectItem>
                {/* <SelectItem value="charlie">Charlie Company</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {selectedEstablishment && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <h3 className="font-medium text-primary">
              {selectedEstablishment === "all" ? "All Establishments" :
               selectedEstablishment === "alpha" ? "Alpha Company" :
               selectedEstablishment === "beta" ? "Beta Company" : "all"}
            </h3>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>NIC</TableHead>
              <TableHead>Current Estb</TableHead>
              <TableHead>Attached User Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(member => (
              <TableRow key={member.eno} className="cursor-pointer hover:bg-muted/50">
                
                <TableCell><Badge variant="outline">{member.rank}</Badge></TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.nic}</TableCell>
                <TableCell>{member.currentEstb}</TableCell>
                <TableCell>
                  <Badge variant={member.attachedUserRole === 'System Admin' ? 'default' : 'secondary'}>
                    {member.attachedUserRole}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Double-click on any row to display an exclusive report for that member</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function IndividualMemberReport({ memberName }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Member Report</CardTitle>
        <CardDescription>Detailed report for {memberName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Personal Information</Label>
              <div className="mt-2 space-y-1">
                <p className="text-sm">Name: {memberName}</p>
                <p className="text-sm">Rank: Lieutenant</p>

              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Assignment Details</Label>
              <div className="mt-2 space-y-1">
                <p className="text-sm">Current Establishment: Alpha Company</p>
                <p className="text-sm">User Role: Standard Member</p>
                <p className="text-sm">Status: Active</p>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Leave History</Label>
            <div className="mt-2 p-3 border rounded">
              <p className="text-sm text-muted-foreground">Leave history and details would be displayed here</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ children, className }) {
  return <div className={className}>{children}</div>;
}
