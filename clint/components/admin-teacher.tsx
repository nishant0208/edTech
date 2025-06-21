/* eslint-disable */

"use client";

import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { getTeachers, useCreateTeacher } from "@/hooks/auth";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Pencil } from "lucide-react";
interface Teacher {
  id: string;
  teacherId: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
  qualification: string;
  status: string;
  subjects?: { name: string; code?: string }[];
}

export default function TeacherTab() {
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [teacher, setTeachers] = useState<Teacher[]>([]);
  const [editTeacherId, setEditTeacherId] = useState<string | null>(null);
  const [editTeacherData, setEditTeacherData] = useState<
    Partial<Teacher & { subjects?: { name: string; code?: string }[] }>
  >({});
  const [newSubject, setNewSubject] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const queryClient = useQueryClient();
  const { data } = getTeachers();
  const { mutate: createTeacher, isPending } = useCreateTeacher();

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/teachers`
      );
      console.log(res.data, "res data");

      setTeachers(res.data);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  console.log(teacher, "backed teachers ");

  // console.log(teachers);

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/teachers/${id}`);
      fetchTeacher();
    } catch (error) {
      console.error("Failed to delete teacher", error);
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      const updateData = {
        ...editTeacherData,
        subjects: editTeacherData.subjects || [],
      };
      console.log("Sending update data:", updateData);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/teachers/${editTeacherId}`,
        updateData
      );
      setEditTeacherId(null);
      setEditTeacherData({});
      fetchTeacher();
    } catch (error) {
      console.error("Failed to update teacher", error);
    }
  };

  const teachers = teacher.map((teacher: any, index: number) => ({
    id: teacher.id || index.toString(),
    teacherId: teacher.teacherId || `TEA${String(index + 1).padStart(3, "0")}`,
    name: teacher.name || "N/A",
    subjects: Array.isArray(teacher.subjects) ? teacher.subjects : [],
    phone: teacher.phone || "N/A",
    email: teacher.user?.email || "N/A",
    qualification: teacher.qualification || "N/A",
    status: teacher.status || "Active",
    branch: teacher.branch || "N/A",
  }));

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    qualification: "",
    address: "",
    branch: "",
  });

  const handleAddTeacher = () => {
    createTeacher(
      {
        ...newTeacher,
        subject: newTeacher.subject ? [newTeacher.subject] : [], // Convert single subject to array
      },
      {
        onSuccess: () => {
          setNewTeacher({
            name: "",
            phone: "",
            email: "",
            subject: "",
            qualification: "",
            address: "",
            branch: "",
          });
          setIsAddTeacherOpen(false);
        },
        onError: (err) => {
          console.error("Failed to create teacher:", err);
        },
      }
    );
  };

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;

    const updatedSubjects = [
      ...(editTeacherData.subjects || []),
      { name: newSubject.trim() },
    ];

    setEditTeacherData({
      ...editTeacherData,
      subjects: updatedSubjects,
    });
    setNewSubject("");
  };

  const handleRemoveSubject = (subjectName: string) => {
    const updatedSubjects = (editTeacherData.subjects || []).filter(
      (s) => s.name !== subjectName
    );
    setEditTeacherData({
      ...editTeacherData,
      subjects: updatedSubjects,
    });
  };

  const filteredTeachers = teachers.filter((teacher: any) => {
    const matchName = teacher.name
      ? teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const subjectString = Array.isArray(teacher.subjects)
      ? teacher.subjects.map((s: any) => s.name).join(", ")
      : "";
    const matchSubject = subjectString
      .toLowerCase()
      .includes(filterSubject.toLowerCase());
    const matchStatus =
      filterStatus === "All" || teacher.status === filterStatus;
    return matchName && matchSubject && matchStatus;
  });

  return (
    <main>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Teachers Management
            </h2>
            <p className="text-gray-600">Manage faculty members and staff</p>
          </div>
          <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Enter the teacher's information below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="teacherName">Full Name</Label>
                    <Input
                      id="teacherName"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, name: e.target.value })
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherEmail">Email</Label>
                    <Input
                      id="teacherEmail"
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherPhone">Phone</Label>
                    <Input
                      id="teacherPhone"
                      value={newTeacher.phone}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherQualification">Qualification</Label>
                    <Input
                      id="teacherQualification"
                      value={newTeacher.qualification}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          qualification: e.target.value,
                        })
                      }
                      placeholder="e.g., B.Ed, M.Sc"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherSubject">Subject</Label>
                    <Input
                      id="teacherSubject"
                      value={newTeacher.subject}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          subject: e.target.value,
                        })
                      }
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherBranch">Branch</Label>
                    <Input
                      id="teacherBranch"
                      value={newTeacher.branch}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          branch: e.target.value,
                        })
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherAddress">Address</Label>
                    <Input
                      id="teacherAddress"
                      value={newTeacher.address}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          address: e.target.value,
                        })
                      }
                      placeholder="e.g., 123 Main St"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddTeacher}
                  className="w-full"
                  disabled={!newTeacher.name || !newTeacher.email || isPending}
                >
                  {isPending ? "Adding..." : "Add Teacher"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 🔍 Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
          <Input
            placeholder="Search by Subject"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-48"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher: any) => (
                  <TableRow key={teacher.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {teacher.teacherId}
                    </TableCell>

                    <TableCell>
                      {editTeacherId === teacher.id ? (
                        <Input
                          value={editTeacherData.name || teacher.name}
                          onChange={(e) =>
                            setEditTeacherData({
                              ...editTeacherData,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        teacher.name
                      )}
                    </TableCell>

                    <TableCell>
                      {editTeacherId === teacher.id ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {editTeacherData.subjects &&
                            editTeacherData.subjects.length > 0 ? (
                              editTeacherData.subjects.map((subj, idx) => (
                                <span
                                  key={subj.code || subj.name || idx}
                                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                                >
                                  {subj.name}
                                  <button
                                    onClick={() =>
                                      handleRemoveSubject(subj.name)
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400">
                                No subjects assigned
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={newSubject}
                              onChange={(e) => setNewSubject(e.target.value)}
                              placeholder="Add new subject"
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddSubject();
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleAddSubject}
                              disabled={!newSubject.trim()}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects && teacher.subjects.length > 0 ? (
                            teacher.subjects.map((subj: any, idx: number) => (
                              <span
                                key={subj.code || subj.name || idx}
                                className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"
                              >
                                {subj.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      {editTeacherId === teacher.id ? (
                        <Input
                          value={
                            editTeacherData.qualification ||
                            teacher.qualification
                          }
                          onChange={(e) =>
                            setEditTeacherData({
                              ...editTeacherData,
                              qualification: e.target.value,
                            })
                          }
                        />
                      ) : (
                        teacher.qualification
                      )}
                    </TableCell>

                    <TableCell>
                      {editTeacherId === teacher.id ? (
                        <select
                          className="border p-1 rounded"
                          value={editTeacherData.status || teacher.status}
                          onChange={(e) =>
                            setEditTeacherData({
                              ...editTeacherData,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="ON_LEAVE">On Leave</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      ) : (
                        <Badge
                          variant={
                            teacher.status === "ON_LEAVE"
                              ? "outline"
                              : teacher.status === "INACTIVE"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {teacher.status}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            alert(JSON.stringify(teacher, null, 2))
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {editTeacherId === teacher.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleUpdateTeacher}
                              className="text-green-600"
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditTeacherId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditTeacherId(teacher.id);
                                setEditTeacherData({
                                  name: teacher.name,
                                  qualification: teacher.qualification,
                                  status: teacher.status,
                                  subjects: teacher.subjects || [],
                                });
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteTeacher(teacher.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
