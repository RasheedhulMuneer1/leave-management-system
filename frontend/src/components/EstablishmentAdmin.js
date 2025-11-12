import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import { Tabs, TabsContent } from "./ui/tabs";
import { Building2, UserCheck, Edit, Trash2, Search, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/util";
import API from "../api/axios";
import DashboardHeader from "./DashboardHeader";

// --- Static lists ---
const establishments = ["Alpha Company", "Beta Company"];
const roleMap = {
  "Super Admin": 1,
  "System Admin": 2,
  "Establishment Admin": 3,
};
const estbMap = {
  "Alpha Company": 1,
  "Beta Company": 2,
};

function getRoleId(roleName) { return roleMap[roleName] || 1; }
function getRoleName(roleId) { return Object.keys(roleMap).find((key) => roleMap[key] === roleId) || ""; }
function getEstbId(estbName) { return estbMap[estbName] || null; }
function getEstbName(estbId) { return Object.keys(estbMap).find((key) => estbMap[key] === estbId) || ""; }

function AdminForm({ initialData, onSubmit, onCancel }) {
  const [name, setName] = useState(initialData?.name || "");
  const [nic, setNic] = useState(initialData?.nic || "");
  const [userName, setuserName] = useState(initialData?.userName || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [estb, setEstb] = useState(initialData?.establishment || "");
  const [status, setStatus] = useState(initialData?.status || "active");
  const [activeFrom, setActiveFrom] = useState(initialData?.activeFrom || null);

  const handleSubmit = () => {
    if (!name || !nic || !userName || !password || !estb || !status || !activeFrom) {
      alert("Please fill all required fields");
      return;
    }
    onSubmit({
      ...initialData,
      name, nic, userName, password, establishment: estb, status, activeFrom
    });
  };

  return (
    <Card>
        <DashboardHeader/>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          {initialData ? "Edit Admin" : "Assign Admin"}
        </CardTitle>
        <CardDescription>
          {initialData ? "Update this admin's information" : "Assign a new establishment admin"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>NIC</Label>
            <Input value={nic} onChange={(e) => setNic(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>UserName</Label>
            <Input value={userName} onChange={(e) => setuserName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Establishment</Label>
            <Select value={estb} onValueChange={setEstb}>
              <SelectTrigger>
                <SelectValue placeholder="Select establishment" />
              </SelectTrigger>
              <SelectContent>
                {establishments.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Active From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !activeFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {activeFrom ? format(new Date(activeFrom), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={activeFrom} onSelect={setActiveFrom} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>{initialData ? "Update" : "Assign"}</Button>
        </div>
      </CardContent>
    </Card>
  );
}


// list component
function AdminsList({ admins, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredAdmins = admins.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // a.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // a.password.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.establishment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="space-y-2" align="center">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" /> Establishment Admins
        </CardTitle>
        <CardDescription>View and manage establishment administrators</CardDescription>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>NIC</TableHead>
              <TableHead>UserName</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Establishment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.nic}</TableCell>
                <TableCell>{admin.userName}</TableCell>
                <TableCell>{admin.password}</TableCell>
                <TableCell>{admin.establishment}</TableCell>
                <TableCell>
                  <Badge variant={admin.status === "active" ? "default" : "secondary"}>
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell>{admin.activeFrom ? format(new Date(admin.activeFrom), "PPP") : "N/A"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(admin)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Delete "${admin.name}"?`)) onDelete(admin.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


// Parent Component
export default function EstablishmentAdmin() {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showForm, setShowForm] = useState(false);


  // fetch admins
  useEffect(() => {
    async function fetchAdmins() {
      try {
        const res = await API.get("/users");
        const estbAdmins = res.data
          .filter(u => u.role?.name === "Establishment Admin")
          .map(u => ({
            id: u.id,
            name: u.name,
            nic: u.nic,
            userName: u.userName,
            password: u.password,
            establishment: u.establishment?.name || "",
            status: u.status ? "active" : "inactive",
            activeFrom: u.activeFrom || null,
          }));
        setAdmins(estbAdmins);
      } catch (err) { console.error(err); }
    }
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (admin) => {
    try {
      const payload = {
        name: admin.name,
        nic: admin.nic,
        userName: admin.userName,
        password: admin.password,
        roleId: getRoleId("Establishment Admin"),
        establishmentId: getEstbId(admin.establishment),
        status: admin.status === "active",
        activeFrom: admin.activeFrom,
      };
      const res = await API.post("/users", payload);
      setAdmins(prev => [...prev, {
        ...res.data,
        establishment: admin.establishment,
        status: res.data.status ? "active" : "inactive",
      }]);
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const handleUpdateAdmin = async (admin) => {
    try {
      const payload = {
        name: admin.name,
        nic: admin.nic,
        userName: admin.userName,
        password: admin.password,
        establishmentId: getEstbId(admin.establishment),
        status: admin.status === "active",
        activeFrom: admin.activeFrom,
      };
      const res = await API.put(`/users/${admin.id}`, payload);
      setAdmins(prev => prev.map(a => a.id === admin.id ? {
        ...res.data,
        establishment: admin.establishment,
        status: res.data.status ? "active" : "inactive",
      } : a));
      setEditingAdmin(null);
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setShowForm(true);
  };

  return (
    <div className="space-y-2" align="center">
      <Button onClick={() => { setShowForm(true); setEditingAdmin(null); }} className="mb-2">
        Assign Admin
      </Button>

      {showForm && (
        <AdminForm
          initialData={editingAdmin}
          onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin}
          onCancel={() => { setShowForm(false); setEditingAdmin(null); }}
        />
      )}

      <AdminsList admins={admins} onEdit={handleEditAdmin} onDelete={handleDeleteAdmin} />
    </div>
  );
}

export { AdminsList, AdminForm };
