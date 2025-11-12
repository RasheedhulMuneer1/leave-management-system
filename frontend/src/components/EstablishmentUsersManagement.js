// import { useState } from "react";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
// import { Search, User, Users, Shield, UserCheck } from "lucide-react";
// import { useToast } from "../hooks/use-toast";
// import DashboardHeader from "./DashboardHeader";

// const mockEstablishmentUsers = [
//   {
//     id: "EMP001",
//     name: "John Smith",
//     // officerRegNo: "OF001",
//     // eno: "E12345",
//     nic: "891234567V",
//     role: "std_member",
//     status: "active",
//     joinDate: "2023-01-15"
//   },
//   {
//     id: "EMP002",
//     name: "Sarah Johnson",
//     // officerRegNo: "OF002",
//     // eno: "E12346",
//     nic: "901234567V",
//     role: "estb_admin",
//     status: "active",
//     joinDate: "2022-08-20"
//   },
//   {
//     id: "EMP003",
//     name: "Mike Wilson",
//     // officerRegNo: "OF003",
//     // eno: "E12347",
//     nic: "851234567V",
//     role: "leave_approve_member",
//     status: "active",
//     joinDate: "2021-11-10"
//   }
// ];

// export function EstablishmentUsersManagement() {
//   const [users, setUsers] = useState(mockEstablishmentUsers);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchType, setSearchType] = useState("name");

//   const filteredUsers = users.filter(user => {
//     const searchValue = searchTerm.toLowerCase();
//     switch (searchType) {
//       case "nic":
//         return user.nic.toLowerCase().includes(searchValue);
//       default:
//         return user.name.toLowerCase().includes(searchValue);
//     }
//   });

//   const getRoleBadge = (role) => {
//     switch (role) {
//       case 'std_member':
//         return <Badge variant="outline">Standard Member</Badge>;
//       case 'estb_admin':
//         return <Badge variant="outline" className="text-blue-600 border-blue-600">Establishment Admin</Badge>;
//       case 'leave_approve_member':
//         return <Badge variant="outline" className="text-green-600 border-green-600">Leave Approve Member</Badge>;
//       default:
//         return <Badge variant="outline">Unknown</Badge>;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{users.length}</div>
//             <p className="text-xs text-muted-foreground">In establishment</p>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Standard Members</CardTitle>
//             <User className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {users.filter(user => user.role === 'std_member').length}
//             </div>
//             <p className="text-xs text-muted-foreground">Regular employees</p>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Admins</CardTitle>
//             <Shield className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {users.filter(user => user.role === 'estb_admin').length}
//             </div>
//             <p className="text-xs text-muted-foreground">Establishment admins</p>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Approvers</CardTitle>
//             <UserCheck className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {users.filter(user => user.role === 'leave_approve_member').length}
//             </div>
//             <p className="text-xs text-muted-foreground">Leave approvers</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Establishment Users</CardTitle>
//           <CardDescription>Manage users in your establishment</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-4 mb-6">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search users..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <Select value={searchType} onValueChange={setSearchType}>
//               <SelectTrigger className="w-48">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="name">Search by Name</SelectItem>
//                 <SelectItem value="nic">Search by NIC</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>NIC</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell className="font-medium">{user.name}</TableCell>
//                   <TableCell>{user.nic}</TableCell>
//                   <TableCell>{user.department}</TableCell>
//                   <TableCell>{getRoleBadge(user.role)}</TableCell>
//                   <TableCell>
//                     <Button variant="outline" size="sm">
//                       View Details
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export function UserRoleAssignment() {
//   const [selectedUser, setSelectedUser] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [users] = useState(mockEstablishmentUsers);
//   const { toast } = useToast();

//   const handleRoleAssignment = () => {
//     if (!selectedUser || !selectedRole) {
//       toast({
//         title: "Error",
//         description: "Please select both user and role.",
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Role Assigned",
//       description: `Role successfully assigned to user.`,
//     });

//     setSelectedUser("");
//     setSelectedRole("");
//   };

//   return (
//     <div className="space-y-6">
//         <DashboardHeader/>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>Assign User Roles</CardTitle>
//           <CardDescription>Assign additional roles to establishment members</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="user-select">Select User</Label>
//               <Select value={selectedUser} onValueChange={setSelectedUser}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Find and select a user" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {users.map((user) => (
//                     <SelectItem key={user.id} value={user.id}>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="role-select">Assign Role</Label>
//               <Select value={selectedRole} onValueChange={setSelectedRole}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose user role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="std_member">Standard Member (Default)</SelectItem>
//                   <SelectItem value="estb_admin">Establishment Admin</SelectItem>
//                   <SelectItem value="leave_approve_member">Leave Approve Member</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="p-4 border rounded-lg bg-muted/50">
//             <h4 className="font-medium mb-2">Role Descriptions:</h4>
//             <ul className="text-sm text-muted-foreground space-y-1">
//               <li><strong>Standard Member:</strong> Default role assigned to all users</li>
//               <li><strong>Establishment Admin:</strong> Can manage users and assign roles within the establishment</li>
//               <li><strong>Leave Approve Member:</strong> Can approve/reject leave applications</li>
//             </ul>
//           </div>

//           <Button onClick={handleRoleAssignment} className="w-full md:w-auto">
//             Assign Role
//           </Button>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Current Role Assignments</CardTitle>
//           <CardDescription>Overview of current user roles in the establishment</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>User</TableHead>
//                 <TableHead>Current Role</TableHead>
//                 <TableHead>Assigned Date</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell className="font-medium">{user.name}</TableCell>
//                   {/* <TableCell>{user.officerRegNo}</TableCell> */}
//                   <TableCell>
//                     {user.role === 'std_member' && <Badge variant="outline">Standard Member</Badge>}
//                     {user.role === 'estb_admin' && <Badge variant="outline" className="text-blue-600 border-blue-600">Establishment Admin</Badge>}
//                     {user.role === 'leave_approve_member' && <Badge variant="outline" className="text-green-600 border-green-600">Leave Approve Member</Badge>}
//                   </TableCell>
//                   <TableCell>{user.joinDate}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
