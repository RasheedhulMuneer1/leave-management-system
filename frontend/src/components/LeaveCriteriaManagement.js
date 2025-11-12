import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "./ui/table";
import { Plus } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import { FaEdit, FaTrash } from "react-icons/fa";

export function LeaveCriteriaManagement() {
  const [criteria, setCriteria] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    leaveType: "",
    minServiceYears: "",
    maxPerYear: "",
    carryOver: "yes",
    approvalRequired: "yes",
    date: new Date().toISOString().split("T")[0],
  });

  // fetch data

  useEffect(() => {
    API.get("/leave-type-criteria").then((res) => setCriteria(res.data));
    API.get("/leave-types").then((res) => setLeaveTypes(res.data));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        minServiceYears: parseInt(form.minServiceYears) || 0,
        maxPerYear: parseInt(form.maxPerYear) || 0,
        carryOver: form.carryOver === "yes",
        approvalRequired: form.approvalRequired === "yes",
      };

      let res;
      if (editingId) {
        res = await API.put(`/leave-type-criteria/${editingId}`, payload);
        setCriteria((prev) =>
          prev.map((c) => (c.id === editingId ? res.data : c))
        );
      } else {
        res = await API.post("/leave-type-criteria", payload);
        setCriteria((prev) => [...prev, res.data]);
      }

      setIsAdding(false);
      setEditingId(null);
      setForm({
        leaveType: "",
        minServiceYears: "",
        maxPerYear: "",
        carryOver: "yes",
        approvalRequired: "yes",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      alert(
        "Failed to save criteria: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/leave-type-criteria/${deleteId}`);
      setCriteria((prev) => prev.filter((c) => c.id !== deleteId));
      setShowConfirm(false);
      setDeleteId(null);
    } catch (err) {
      alert("Error deleting criteria: " + err.message);
    }
  };

  const handleEdit = (c) => {
    setForm({
      leaveType: c.leaveType,
      minServiceYears: c.minServiceYears,
      maxPerYear: c.maxPerYear,
      carryOver: c.carryOver ? "yes" : "no",
      approvalRequired: c.approvalRequired ? "yes" : "no",
      date: c.date.split("T")[0],
    });
    setEditingId(c.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-10">
      <DashboardHeader />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div align="center">
              <CardTitle>Leave Criteria Management</CardTitle>
              <CardDescription>
                Define rules for each leave type
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
              }}
            >
              <Plus className="mr-2" /> Add Criteria
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isAdding && (
            <div className="p-4 border rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Leave Type</Label>
                  <Select
                    value={form.leaveType || ""}
                    onValueChange={(val) =>
                      setForm({ ...form, leaveType: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.length > 0 ? (
                        leaveTypes.map((lt) => {
                          const isUsed = criteria.some(
                            (c) => c.leaveType === (lt.name || lt.leaveType)
                          );
                          return (
                            <SelectItem
                              key={lt.id}
                              value={lt.name || lt.leaveType}
                              disabled={isUsed}
                              className={
                                isUsed
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                            >
                              {lt.name || lt.leaveType}
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem disabled>
                          No leave types available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minServiceYears">Min Service Years</Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-gray-700"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          minServiceYears:
                            (prev.minServiceYears || 0) + 1,
                        }))
                      }
                    >
                      +
                    </button>
                    <span className="px-4 py-1 border rounded text-center w-12">
                      {form.minServiceYears || 0}
                    </span>
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-gray-700"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          minServiceYears: Math.max(
                            0,
                            (prev.minServiceYears || 0) - 1
                          ),
                        }))
                      }
                    >
                      –
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPerYear">Max Days Per Year</Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-gray-700"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          maxPerYear: (prev.maxPerYear || 0) + 1,
                        }))
                      }
                    >
                      +
                    </button>
                    <span className="px-4 py-1 border rounded text-center w-12">
                      {form.maxPerYear || 0}
                    </span>
                    <button
                      type="button"
                      className="px-2 py-1 border rounded text-gray-700"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          maxPerYear: Math.max(
                            0,
                            (prev.maxPerYear || 0) - 1
                          ),
                        }))
                      }
                    >
                      –
                    </button>
                  </div>
                </div>

                <div className="text-black">
                  <Label>Carry Over</Label>
                  <Select
                    value={form.carryOver}
                    onValueChange={(val) =>
                      setForm({ ...form, carryOver: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-black">
                  <Label>Approval Required</Label>
                  <Select
                    value={form.approvalRequired}
                    onValueChange={(val) =>
                      setForm({ ...form, approvalRequired: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-black">
                  <Label>Created Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black text-center">
                  Leave Type
                </TableHead>
                <TableHead className="text-black text-center">
                  Min Service Years
                </TableHead>
                <TableHead className="text-black text-center">
                  Max Days Per Year
                </TableHead>
                <TableHead className="text-black text-center">
                  Carry Over
                </TableHead>
                <TableHead className="text-black text-center">
                  Approval Required
                </TableHead>
                <TableHead className="text-black text-center">
                  Date
                </TableHead>
                <TableHead className="text-black text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.leaveType}</TableCell>
                  <TableCell>{c.minServiceYears}</TableCell>
                  <TableCell>{c.maxPerYear}</TableCell>
                  <TableCell>{c.carryOver ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {c.approvalRequired ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    {new Date(c.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="action-buttons">
                      <FaEdit
                        className="cursor-pointer text-blue-500"
                        title="Edit"
                        onClick={() => handleEdit(c)}
                      />
                      <br />
                      <br />
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        title="Delete"
                        onClick={() => confirmDelete(c.id)}
                      />
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
                  Are you sure you want to delete this criteria?
                </p>

                {criteria
                  .filter((c) => c.id === deleteId)
                  .map((c) => (
                    <div key={c.id} className="mb-6 text-left">
                      <table className="w-full border border-gray-300 text-sm">
                        <tbody>
                          <tr>
                            <td className="font-semibold border px-2 py-1 bg-gray-50 w-1/3">
                              Leave Type
                            </td>
                            <td className="border px-2 py-1">{c.leaveType}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold border px-2 py-1 bg-gray-50">
                              Min Service Years
                            </td>
                            <td className="border px-2 py-1">
                              {c.minServiceYears}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold border px-2 py-1 bg-gray-50">
                              Max Days Per Year
                            </td>
                            <td className="border px-2 py-1">
                              {c.maxPerYear}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold border px-2 py-1 bg-gray-50">
                              Carry Over
                            </td>
                            <td className="border px-2 py-1">
                              {c.carryOver ? "Yes" : "No"}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold border px-2 py-1 bg-gray-50">
                              Approval Required
                            </td>
                            <td className="border px-2 py-1">
                              {c.approvalRequired ? "Yes" : "No"}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold border px-2 py-1 bg-gray-50">
                              Date
                            </td>
                            <td className="border px-2 py-1">
                              {new Date(c.date).toLocaleDateString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}

                <div className="flex justify-center gap-4">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleDelete}
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
