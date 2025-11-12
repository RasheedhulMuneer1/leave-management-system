import { useEffect, useState } from "react";
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
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, UserPlus, Edit, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/util";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { FaEdit, FaTrash } from "react-icons/fa";


const establishments = ["Alpha Company", "Beta Company", "Sigma Company", "Delta Company"];
const roleMap = {
  "Super Admin": 1,
  "System Admin": 2,
  "Establishment Admin": 3,
  "Establishment Head & Leave Approve Member": 4,
  "Standard Member": 5,
};
const estbMap = { "Alpha Company": 1, "Beta Company": 2, "Sigma Company": 3, "Delta Company" : 4  };

const getRoleId = (name) => roleMap[name] || 1;
const getRoleName = (id) =>
  Object.keys(roleMap).find((r) => roleMap[r] === id) || "";
const getEstbId = (name) => estbMap[name] || null;
const getEstbName = (id) =>
  Object.keys(estbMap).find((e) => estbMap[e] === id) || "";

function CreateUserForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData?.name || "");
  const [rank, setRank] = useState(initialData?.rank || "");
  const [nic, setNic] = useState(initialData?.nic || "");
  const [userName, setUserName] = useState(initialData?.userName || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [status, setStatus] = useState(initialData?.status || "active");
  const [estb, setEstb] = useState(initialData?.estb || "");
  const [activeFrom, setActiveFrom] = useState(initialData?.activeFrom || null);
  const [activeTo, setActiveTo] = useState(initialData?.activeTo || null);

  const handleSubmit = () => {
    if (
      !name ||
      !rank ||
      !nic ||
      !userName ||
      !password ||
      !role ||
      !status ||
      !estb ||
      !activeFrom ||
      !activeTo
    ) {
      alert("Please fill all required fields");
      return;
    }

    const user = {
      ...initialData,
      name,
      rank,
      nic,
      userName,
      password,
      role,
      status,
      estb,
      activeFrom: new Date(activeFrom).toISOString(),
      activeTo: new Date(activeTo).toISOString(),
    };
    onSubmit(user);
  };

  return (
    <Card className="space-y-10">
      <CardHeader>
        <CardTitle className="space-y-2">  
          
            
          <UserPlus className="h-5 w-5" />
          {initialData ? "Edit User" : "Create New User"}
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Update this user's information"
            : "Add a new user"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>NIC</Label><Input value={nic} onChange={(e) => setNic(e.target.value)} /></div>
          <div><Label>Rank</Label><Input value={rank} onChange={(e) => setRank(e.target.value)} /></div>
          <div><Label>UserName</Label><Input value={userName} onChange={(e) => setUserName(e.target.value)} /></div>
          <div><Label>Password</Label><Input value={password} onChange={(e) => setPassword(e.target.value)} /></div>

          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                {Object.keys(roleMap).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Establishment</Label>
            <Select value={estb} onValueChange={setEstb}>
              <SelectTrigger><SelectValue placeholder="Select establishment" /></SelectTrigger>
              <SelectContent>
                {establishments.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Active From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !activeFrom && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {activeFrom ? format(new Date(activeFrom), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent><Calendar mode="single" selected={activeFrom} onSelect={setActiveFrom} /></PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Active To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !activeTo && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {activeTo ? format(new Date(activeTo), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent><Calendar mode="single" selected={activeTo} onSelect={setActiveTo} /></PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>{initialData ? "Update User" : "Create User"}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UsersList({ users, onEditUser, onDeleteUser, onCreateUserClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredUsers = users.filter((u) =>
    [u.name, u.rank, u.nic, u.userName, u.role, u.estb]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="space-y-10" align="center">
        <DashboardHeader/>
      
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Manage users in the system</CardDescription>

        <div className="flex items-center gap-3 mt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, NIC, Role or Establishment"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button size="sm" onClick={onCreateUserClick}>
            <UserPlus className="h-4 w-4 mr-2" /> 
             Create User
          </Button>

        
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">Name</TableHead>
              <TableHead className="text-black">NIC</TableHead>
              <TableHead className="text-black">Rank</TableHead>
              <TableHead className="text-black">Role</TableHead>
              <TableHead className="text-black">Status</TableHead>
              <TableHead className="text-black">Establishment</TableHead>
              <TableHead className="text-black">Active From</TableHead>
              <TableHead className="text-black">Active To</TableHead>
              <TableHead className="text-black">Actions</TableHead>
              <TableHead className="text-black">Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.nic}</TableCell>
                <TableCell>{user.rank}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
  <Badge
    className={
      user.status?.toLowerCase() === "active"
        ? "bg-blue-500 text-gray"
        : "bg-transparent border border-gray-400 text-gray-700"
    }
  >
    {user.status}
  </Badge>

 


</TableCell>

                <TableCell>{user.estb}</TableCell>
                <TableCell>{user.activeFrom ? format(new Date(user.activeFrom), "PPP") : "N/A"}</TableCell>
                <TableCell>{user.activeTo ? format(new Date(user.activeTo), "PPP") : "N/A"}</TableCell>
                <TableCell>
  <div className="action-buttons">
    <br></br>
    <br></br>
    <FaTrash
      className="cursor-pointer text-red-500"
      title="Delete"
      onClick={() => {
        if (window.confirm(`Delete user "${user.name}"?`)) {
          onDeleteUser(user.id);
        }
      }}
    />
  </div>
</TableCell>

                <TableCell verient="outline">
                  <Button className="logout-btn" onClick={() => navigate("/my-reports", { state: { selectedUserName: user.name } })}>View Report</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await API.get("/users");
        const mapped = res.data.map((u) => ({
          ...u,
          role: u.role?.name || getRoleName(u.roleId),
          estb: u.establishment?.name || getEstbName(u.establishmentId),
          status: u.status ? "Active" : "Inactive",
        }));
        setUsers(mapped);
      } catch (err) {
        console.error("Failed to fetch users:", err.response?.data || err.message);
      }
    }
    fetchUsers();
  }, []);

  const handleCreateUser = async (user) => {
    try {
      const payload = {
        name: user.name,
        rank: user.rank,
        nic: user.nic,
        userName: user.userName,
        password: user.password,
        status: user.status === "active",
        roleId: getRoleId(user.role),
        establishmentId: getEstbId(user.estb),
        activeFrom: user.activeFrom,
        activeTo: user.activeTo,
      };

      const res = await API.post("/users", payload);
      const newUser = {
        ...res.data,
        role: getRoleName(res.data.roleId),
        estb: getEstbName(res.data.establishmentId),
        status: res.data.status ? "Active" : "Inactive",
      };

      setUsers((prev) => [...prev, newUser]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create user:", err.response?.data || err.message);
    }
  };

  const handleUpdateUser = async (user) => {
    try {
      const payload = {
        name: user.name,
        rank: user.rank,
        nic: user.nic,
        userName: user.userName,
        password: user.password,
        status: user.status === "active",
        roleId: getRoleId(user.role),
        establishmentId: getEstbId(user.estb),
        activeFrom: user.activeFrom,
        activeTo: user.activeTo,
      };

      const res = await API.put(`/users/${user.id}`, payload);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...res.data,
                role: getRoleName(res.data.roleId),
                estb: getEstbName(res.data.establishmentId),
                status: res.data.status ? "Active" : "Inactive",
              }
            : u
        )
      );
      setShowForm(false);
      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err.response?.data || err.message);
      alert("Error updating user: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err.response?.data || err.message);
    }
  };

  return (
    <div className="space-y-2" align="center">
      {showForm && (
        <CreateUserForm
          initialData={editingUser}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}

      <UsersList
        users={users}
        onEditUser={setEditingUser}
        onDeleteUser={handleDeleteUser}
        onCreateUserClick={() => {
          setShowForm(true);
          setEditingUser(null);
        }}
      />
    </div>
  );
}

export { CreateUserForm, UsersList };
