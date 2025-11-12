import API from "../api/axios";
import { useState, useEffect } from "react";
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
import { Textarea } from "./ui/textarea";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import { FaEdit, FaTrash } from "react-icons/fa";


export function LeaveTypesManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState({
    leaveType: "",
    description: "",
    maxDays: "",
    status: "active",
    createdDate: new Date().toISOString().split("T")[0],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);



  // fetch leave types from backend
  useEffect(() => {
    async function fetchLeaveTypes() {
      try {
        const res = await API.get("/leave-types");
        setLeaveTypes(res.data);
      } catch (err) {
        console.error("Failed to fetch leave types:", err);
      }
    }
    fetchLeaveTypes();
  }, []);


  // handles input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewLeaveType({ ...newLeaveType, [id]: value });
  };



  // save new leave type directly to backend

const handleSave = async () => {
  if (!newLeaveType.name || !newLeaveType.maxDays) {
    alert("Please fill in Leave Type Name and Maximum Days");
    return;
  }

  const payload = {
    leaveType: newLeaveType.name,
    description: newLeaveType.description,
    maxDays: parseInt(newLeaveType.maxDays, 10),
    status: newLeaveType.status === "active" ? 1 : 0,
  };

  try {
    if (newLeaveType.id) {
      // Edits existing leave type 
      const res = await API.patch(`/leave-types/${newLeaveType.id}`, payload); // uses PATCH
      setLeaveTypes((prev) =>
        prev.map((lt) => (lt.id === newLeaveType.id ? res.data : lt))
      );
    } else {
      // Adding new leave type 
      const res = await API.post("/leave-types", {
        ...payload,
        createdAt: new Date().toISOString(), 
      });
      setLeaveTypes((prev) => [...prev, res.data]);
    }

    // Reset form 
    setIsAdding(false);
    setNewLeaveType({
      leaveType: "",
      description: "",
      maxDays: "",
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
    });
  } catch (err) {
    console.error("Failed to save leave type:", err.response?.data || err.message);
    alert(
      "Error saving leave type: " +
        (err.response?.data?.message || err.message)
    );
  }
};



  // Delete leave type 
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave type?")) return;
    try {
      await API.delete(`/leave-types/${id}`);
      setLeaveTypes((prev) => prev.filter((lt) => lt.id !== id));
    } catch (err) {
      console.error("Failed to delete leave type:", err.response?.data || err.message);
      alert("Error deleting leave type: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-10" align="center">
        <DashboardHeader/>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Types
              </CardTitle>
              <CardDescription>
                Manage different types of leave available in the system
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Leave Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-4">Add New Leave Type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Leave Type Name</Label>
                  <Input id="name" value={newLeaveType.name} onChange={handleChange} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newLeaveType.description}
                    onChange={handleChange}
                  />
                </div>
                

               <div className="space-y-2">
  <Label htmlFor="maxDays">Maximum Days</Label>
  <div className="flex items-center gap-2">


   <button
      type="button"
      className="px-2 py-1 border rounded text-gray-700"
      onClick={() =>
        setNewLeaveType((prev) => ({
          ...prev,
          maxDays: (prev.maxDays || 1) + 1,
        }))
      }
    >
      +
    </button>

    <span className="px-4 py-1 border rounded text-center w-12">
      {newLeaveType.maxDays || 1}
    </span>
   

    <button
      type="button"
      className="px-2 py-1 border rounded text-gray-700"
      onClick={() =>
        setNewLeaveType((prev) => ({
          ...prev,
          maxDays: Math.max(1, (prev.maxDays || 1) - 1), // min 1
        }))
      }
    >
      – 
    </button>
   
  </div>
</div>


                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(val) =>
                      setNewLeaveType({ ...newLeaveType, status: val })
                    }
                    defaultValue={newLeaveType.status}
                  >
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
                  <Label htmlFor="createdDate">Created Date</Label>
                  <Input
                    id="createdDate"
                    type="date"
                    value={newLeaveType.createdDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Leave Type</Button>
              </div>
            </div>
          )}

         <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-black text-center">Leave Type</TableHead>
      <TableHead className="text-black text-center">Description</TableHead>
      <TableHead className="text-black text-center">Max Days</TableHead>
      <TableHead className="text-black text-center">Status</TableHead>
      <TableHead className="text-black text-center">Created Date</TableHead>
      <TableHead className="text-black text-center">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {leaveTypes.map((leaveType) => (
      <TableRow key={leaveType.id}>
        <TableCell className="font-medium">{leaveType.leaveType}</TableCell>
        <TableCell>{leaveType.description}</TableCell>
        <TableCell>{leaveType.maxDays}</TableCell>
        <TableCell>
          <Badge
  variant={leaveType.status ? "default" : "secondary"}
  className={
    leaveType.status
      ? "bg-blue-500 text-gray"
      : "bg-transparent border border-gray-400 text-gray-700"
  }
>
  {leaveType.status ? "Active" : "Inactive"}
</Badge>

        </TableCell>


        {/* Fixed created date  */}
        <TableCell>
          {leaveType.createdAt
            ? new Date(leaveType.createdAt).toLocaleDateString()
            : "—"}
        </TableCell>

        <TableCell>
          <div className="flex gap-2">

              <div className="action-buttons">
  <FaEdit
    className="cursor-pointer text-blue-500"
    title="Edit"
    onClick={() => {
      setIsAdding(true);
      setNewLeaveType({
        id: leaveType.id,
        name: leaveType.leaveType,
        description: leaveType.description,
        maxDays: leaveType.maxDays,
        status: leaveType.status ? "active" : "inactive",
        createdDate: leaveType.createdAt
          ? leaveType.createdAt.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }}
  />
  <br />
  <br />

  <FaTrash
  className="cursor-pointer text-red-500"
  title="Delete"
  onClick={() => {
    setDeleteId(leaveType.id);
    setShowConfirm(true);
  }}
/>

</div>

          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


{showConfirm && (
  <div className="delete-confirmation-popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="delete-modal-box bg-white p-6 rounded-lg shadow-lg w-96">
      <p className="mb-4 text-lg font-semibold text-center">
        Are you sure you want to delete this leave type?
      </p>

      {/* Display selected leave type details  */}
      {leaveTypes
        .filter((lt) => lt.id === deleteId)
        .map((lt) => (
          <div key={lt.id} className="mb-6 text-left">
            <table className="w-full border border-gray-300 text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold border px-2 py-1 w-1/3 bg-gray-50">Leave Type</td>
                  <td className="border px-2 py-1">{lt.leaveType || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Description</td>
                  <td className="border px-2 py-1">{lt.description || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Max Days</td>
                  <td className="border px-2 py-1">{lt.maxDays || "-"}</td>
                </tr>
                <tr>
                  <td className="font-semibold border px-2 py-1 bg-gray-50">Status</td>
                  <td className="border px-2 py-1">
                    {lt.status ? "Active" : "Inactive"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={async () => {
            await handleDelete(deleteId);
            setShowConfirm(false);
          }}
        >
          Yes, Delete
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


          
        </CardContent>
      </Card>
    </div>
  );
}