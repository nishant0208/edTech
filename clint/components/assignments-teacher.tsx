/* eslint-disable */
"use client";
import { TabsContent } from "@radix-ui/react-tabs";
import { Badge, Filter, Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { useState, useEffect } from "react";
import { useCreateAssignment, useGetAssignments } from "../hooks/assignment";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/zustand/authstore";
interface Teacher {
  id: string;
  name: string;
  teacherId: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Class {
  id: string;
  name: string;
  grade: string;
  section: string;
  subjects: { subject: Subject }[];
  students: any[];
}

interface Assignment {
  id: string;
  name: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  class: {
    id: string;
    name: string;
    grade: string;
    section: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  teacher: {
    id: string;
    name: string;
    teacherId: string;
  };
}

export default function Assignments() {
  const { auth } = useAuthStore();
  const teacherId = auth?.profile?.id;

  const { toast } = useToast();
  const {
    createAssignment,
    isLoading: isCreating,
    error: createError,
  } = useCreateAssignment();
  const {
    getAssignments,
    isLoading: isFetching,
    error: fetchError,
  } = useGetAssignments();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [newAssignment, setNewAssignment] = useState({
    name: "",
    classId: "",
    subjectId: "",
    description: "",
  });

  const fetchAssignmentsData = async () => {
    try {
      const params = {
        teacherId,
        page: currentPage,
        limit: pageSize,
        ...(filterClass !== "all" && { classId: filterClass }),
        ...(filterSubject !== "all" && { subjectId: filterSubject }),
      };

      const response = await getAssignments(params);

      if (response.success) {
        setAssignments(response.data || []);
        setPagination(response.pagination || pagination);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive",
      });
    }
  };

  const fetchClassesAndSubjects = async () => {
    try {
      const mockClasses: Class[] = [
        {
          id: "1",
          name: "Grade 10-A",
          grade: "10",
          section: "A",
          subjects: [
            { subject: { id: "1", name: "Mathematics", code: "MATH10" } },
            { subject: { id: "2", name: "Physics", code: "PHY10" } },
          ],
          students: [],
        },
        {
          id: "2",
          name: "Grade 11-B",
          grade: "11",
          section: "B",
          subjects: [
            { subject: { id: "1", name: "Mathematics", code: "MATH11" } },
            { subject: { id: "3", name: "Chemistry", code: "CHEM11" } },
          ],
          students: [],
        },
      ];

      const mockSubjects: Subject[] = [
        { id: "1", name: "Mathematics", code: "MATH" },
        { id: "2", name: "Physics", code: "PHY" },
        { id: "3", name: "Chemistry", code: "CHEM" },
      ];

      setClasses(mockClasses);
      setSubjects(mockSubjects);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch classes and subjects",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClassesAndSubjects();
  }, []);

  useEffect(() => {
    fetchAssignmentsData();
  }, [currentPage, filterClass, filterSubject, teacherId]);

  const handleCreateAssignment = async () => {
    console.log("okay there", newAssignment);

    if (
      !newAssignment.name ||
      !newAssignment.classId ||
      !newAssignment.subjectId
    ) {
      console.log("os here");

      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("inside create assignment");

      const data = await createAssignment({
        name: newAssignment.name,
        classId: newAssignment.classId,
        subjectId: newAssignment.subjectId,
        // @ts-ignore
        teacherId,
      });

      console.log("final data", data);

      toast({
        title: "Success",
        description: "Assignment created successfully",
      });

      setNewAssignment({
        name: "",
        classId: "",
        subjectId: "",
        description: "",
      });
      setIsCreateOpen(false);

      fetchAssignmentsData();
    } catch (error) {
      toast({
        title: "Error",
        description: createError || "Failed to create assignment",
        variant: "destructive",
      });
    }
  };
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.class.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const selectedClass = classes.find((c) => c.id === newAssignment.classId);
  const availableSubjects = selectedClass?.subjects || [];

  return (
    <section>
      <TabsContent value="assignments" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
            <p className="text-gray-600 mt-1">
              Manage and track your assignments ({pagination.totalCount} total)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 rounded-md px-4 py-2">
                  <Plus className="h-4 w-4" />
                  Create Assignment
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md p-6 rounded-2xl shadow-xl space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">
                    Create New Assignment
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">
                  {/* Assignment Name */}
                  <div className="space-y-1">
                    <Label htmlFor="assignment-name">Assignment Name *</Label>
                    <Input
                      id="assignment-name"
                      value={newAssignment.name}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter assignment name"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="class-select">Select Class *</Label>
                    <Select
                      value={newAssignment.classId}
                      onValueChange={(value) =>
                        setNewAssignment({
                          ...newAssignment,
                          classId: value,
                          subjectId: "",
                        })
                      }
                    >
                      <SelectTrigger
                        id="class-select"
                        className="rounded-md border px-3 py-2"
                      >
                        <SelectValue placeholder="Choose a class" />
                      </SelectTrigger>
                      <SelectContent className="z-50 rounded-md shadow-md border bg-white">
                        {classes.map((cls) => (
                          <SelectItem
                            key={cls.id}
                            value={cls.id}
                            className="px-3 py-2 cursor-pointer hover:bg-blue-50 focus:bg-blue-100 focus:outline-none"
                          >
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClass && (
                    <div className="space-y-1">
                      <Label htmlFor="subject-select">Select Subject *</Label>
                      <Select
                        value={newAssignment.subjectId}
                        onValueChange={(value) =>
                          setNewAssignment({
                            ...newAssignment,
                            subjectId: value,
                          })
                        }
                      >
                        <SelectTrigger
                          id="subject-select"
                          className="rounded-md border px-3 py-2"
                        >
                          <SelectValue placeholder="Choose a subject" />
                        </SelectTrigger>
                        <SelectContent className="z-50 rounded-md shadow-md border bg-white">
                          {availableSubjects.map((sub) => (
                            <SelectItem
                              key={sub.subject.id}
                              value={sub.subject.id}
                              className="px-3 py-2 cursor-pointer hover:bg-blue-50 focus:bg-blue-100 focus:outline-none"
                            >
                              {sub.subject.name} ({sub.subject.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAssignment.description}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          description: e.target.value,
                        })
                      }
                      placeholder="Assignment description (optional)"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleCreateAssignment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 text-base font-medium"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Assignment"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isFetching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAssignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {assignment.name}
                        </CardTitle>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Class:</span>{" "}
                            {assignment.class.name}
                          </p>
                          <p>
                            <span className="font-medium">Subject:</span>{" "}
                            {assignment.subject.name} ({assignment.subject.code}
                            )
                          </p>
                          <p>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(
                              assignment.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setIsViewOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Handle edit functionality
                          toast({
                            title: "Coming Soon",
                            description:
                              "Edit functionality will be implemented",
                          });
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAssignments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No assignments found</p>
                <p className="text-gray-400 mt-2">
                  Create your first assignment to get started
                </p>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>

                <div className="flex space-x-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assignment Details</DialogTitle>
            </DialogHeader>
            {selectedAssignment && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedAssignment.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Class</p>
                      <p>{selectedAssignment.class.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Subject
                      </p>
                      <p>
                        {selectedAssignment.subject.name} (
                        {selectedAssignment.subject.code})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Teacher
                      </p>
                      <p>{selectedAssignment.teacher.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Created
                      </p>
                      <p>
                        {new Date(
                          selectedAssignment.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TabsContent>
    </section>
  );
}
