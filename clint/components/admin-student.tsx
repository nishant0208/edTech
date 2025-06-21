/* eslint-disable */

"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import {
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  X,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
import { useState } from "react";
import { getStudents, useCreateStudent } from "@/hooks/auth";
import axios from "axios";
interface Students {
  id: string;
  studentId: string;
  name: string;
  class: string;
  phone: string;
  status: string;
}
export default function StudentTab() {
  const [student, setStudents] = useState<Students[]>([]);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [editStudentData, setEditStudentData] = useState<Partial<Students>>({});

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data, isLoading, error } = getStudents();
  const students = data?.data || [];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/students`
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${editStudentId}`,
        editStudentData
      );
      setEditStudentId(null);
      setEditStudentData({});
      fetchStudents();
    } catch (error) {
      console.error("Failed to update student", error);
    }
  };
  const handleViewStudent = (student: Students) => {
    setEditStudentId(student.id);
    setEditStudentData({
      studentId: student.studentId,
      name: student.name,
      class: student.class,
      phone: student.phone,
      status: student.status,
    });
  };

  const classes = [
    {
      id: "cmb9x4ja4000irlhda3638zgr",
      name: "Grade 9 - A",
      students: 25,
      teacher: "Dr. Sarah Williams",
    },
    {
      id: "cmb9x4ja4000jrlhdc9n5a8vy",
      name: "Grade 9 - B",
      students: 28,
      teacher: "Prof. David Brown",
    },
    {
      id: "cmb9x4ja5000krlhdqcak3kwg",
      name: "Grade 10 - A",
      students: 22,
      teacher: "Dr. Sarah Williams",
    },
    {
      id: "cmb9x4ja5000lrlhd6gxt4nr5",
      name: "Grade 10 - B",
      students: 26,
      teacher: "Prof. David Brown",
    },
  ];

  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    email: "",
    class: "",
    dateOfBirth: "",
    address: "",
    branch: "",
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newStudent.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!newStudent.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(newStudent.phone.trim())) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!newStudent.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!newStudent.class) {
      errors.class = "Please select a class";
    }
    if (!newStudent.branch) {
      errors.branch = "Please select a branch";
    }

    if (!newStudent.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }

    return errors;
  };

  const resetForm = () => {
    setNewStudent({
      name: "",
      phone: "",
      email: "",
      class: "",
      dateOfBirth: "",
      address: "",
      branch: "",
    });
    setFormErrors({});
  };
  const createStudentMutation = useCreateStudent();

  const handleAddStudent = async () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      console.log(newStudent, "new student here");
      const out = await createStudentMutation.mutateAsync(newStudent);
      console.log(out, "ot is here");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Creating student with data:", newStudent);

      resetForm();
      setIsAddStudentOpen(false);
    } catch (error) {
      console.error("Failed to create student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsAddStudentOpen(open);
  };

  const filteredStudents = students.filter((student: any) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const className = classes.find((c) => c.id === student.classId)?.name;
    const matchesClass = selectedClass === "all" || className === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load students</div>;

  return (
    <main>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Students Management
            </h2>
            <p className="text-gray-600">
              Manage student records and information
            </p>
          </div>
          <Dialog open={isAddStudentOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border-0 w-full max-w-2xl max-h-[95vh] overflow-hidden z-50">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold">
                        Add New Student
                      </DialogTitle>
                      <DialogDescription className="text-blue-100 mt-1">
                        Create a new student record with their details
                      </DialogDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDialogOpenChange(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-gray-700 font-semibold mb-4">
                      <User className="h-5 w-5 text-blue-600" />
                      <span>Personal Information</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="studentName"
                          className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                        >
                          <User className="h-4 w-4 text-gray-500" />
                          <span>
                            Full Name <span className="text-red-500">*</span>
                          </span>
                        </Label>
                        <Input
                          id="studentName"
                          value={newStudent.name}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter student's full name"
                          className={`h-12 border-2 transition-all duration-200 ${
                            formErrors.name
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-lg`}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-red-600 mt-2 flex items-center space-x-1">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">
                              !
                            </span>
                            <span>{formErrors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="studentDOB"
                          className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                        >
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            Date of Birth{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        </Label>
                        <Input
                          id="studentDOB"
                          type="date"
                          value={newStudent.dateOfBirth}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className={`h-12 border-2 transition-all duration-200 ${
                            formErrors.dateOfBirth
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-lg`}
                        />
                        {formErrors.dateOfBirth && (
                          <p className="text-sm text-red-600 mt-2 flex items-center space-x-1">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">
                              !
                            </span>
                            <span>{formErrors.dateOfBirth}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="studentAddress"
                          className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                        >
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>Address</span>
                        </Label>
                        <Input
                          id="studentAddress"
                          value={newStudent.address}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              address: e.target.value,
                            })
                          }
                          placeholder="Enter student's address"
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-all duration-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact & Academic Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-gray-700 font-semibold mb-4">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span>Contact & Academic Info</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="studentPhone"
                          className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                        >
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>
                            Phone Number <span className="text-red-500">*</span>
                          </span>
                        </Label>
                        <Input
                          id="studentPhone"
                          value={newStudent.phone}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Enter phone number"
                          className={`h-12 border-2 transition-all duration-200 ${
                            formErrors.phone
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-lg`}
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-red-600 mt-2 flex items-center space-x-1">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">
                              !
                            </span>
                            <span>{formErrors.phone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="studentEmail"
                          className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                        >
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </span>
                        </Label>
                        <Input
                          id="studentEmail"
                          type="email"
                          value={newStudent.email}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter email address"
                          className={`h-12 border-2 transition-all duration-200 ${
                            formErrors.email
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500"
                          } rounded-lg`}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-600 mt-2 flex items-center space-x-1">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">
                              !
                            </span>
                            <span>{formErrors.email}</span>
                          </p>
                        )}
                      </div>
                      <div></div>

                      <div>
                        <Label
                          htmlFor="studentClass"
                          className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                        >
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span>
                            Class <span className="text-red-500">*</span>
                          </span>
                        </Label>
                        <Select
                          value={newStudent.class}
                          onValueChange={(value) =>
                            setNewStudent({ ...newStudent, class: value })
                          }
                        >
                          <SelectTrigger
                            className={`h-12 border-2 transition-all duration-200 ${
                              formErrors.class
                                ? "border-red-300 focus:border-red-500"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-lg`}
                          >
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem
                                key={cls.id}
                                value={cls.id}
                                className="py-3"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {cls.name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    Teacher: {cls.teacher}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.class && (
                          <p className="text-sm text-red-600 mt-2 flex items-center space-x-1">
                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">
                              !
                            </span>
                            <span>{formErrors.class}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogOpenChange(false)}
                    className="px-6 py-2 border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStudent}
                    className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding Student...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Student</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Phone</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student: any) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {student.studentId}
                    </TableCell>
                    <TableCell>
                      {editStudentId === student.id ? (
                        <Input
                          value={editStudentData.name || student.name}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        student.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editStudentId === student.id ? (
                        <Select
                          value={editStudentData.class || student.class}
                          onValueChange={(value) =>
                            setEditStudentData({
                              ...editStudentData,
                              class: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls: any) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        classes.find((c) => c.id === student.classId)?.name ||
                        "Unknown"
                      )}
                    </TableCell>
                    <TableCell>
                      {editStudentId === student.id ? (
                        <Input
                          value={editStudentData.phone || student.phone}
                          onChange={(e) =>
                            setEditStudentData({
                              ...editStudentData,
                              phone: e.target.value,
                            })
                          }
                        />
                      ) : (
                        student.phone
                      )}
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant={student.status === "Active" ? "default" : "outline"}>
                        {student.status}
                      </Badge>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {editStudentId === student.id ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={handleUpdateStudent}
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditStudentId(null)}
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
                                setEditStudentId(student.id);
                                setEditStudentData(student);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDeleteStudent(student.id)}
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
