/* eslint-disable */
"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  User,
  ArrowLeft,
  Loader2,
  FileText,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
// Note: axios would be imported in a real implementation

// Types
interface Student {
  id: string;
  name: string;
  studentId: string;
}

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

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: {
    id: string;
    name: string;
    description: string;
  };
}

interface RawAssignment {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  subject?: {
    id: string;
    name: string;
    description: string;
  };
}

interface ClassData {
  id: string;
  name: string;
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  assignments: Assignment[];
}

export default function Student() {
  const [step, setStep] = useState<"select-class" | "view-details">(
    "select-class"
  );
  const [classOptions, setClassOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // const classOptions = [
  //   { value: "hey", label: "Grade 10 A" },
  //   { value: "grade-10-b", label: "Grade 10 B" },
  //   { value: "grade-11-science", label: "Grade 11 Science" },
  //   { value: "grade-11-commerce", label: "Grade 11 Commerce" },
  //   { value: "grade-12-science", label: "Grade 12 Science" },
  //   { value: "grade-12-arts", label: "Grade 12 Arts" },
  // ];
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/class`);
        const classes = res.data?.data || [];

        const formattedOptions = classes.map((cls: any) => ({
          value: cls.id,
          label: cls.name.replace(/-/g, " "),
        }));

        setClassOptions(formattedOptions);
      } catch (error) {
        console.error("Failed to fetch class options:", error);
      }
    };
    fetchClasses();
  }, []);

  const fetchClassDetails = async (id: string): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/class/${id}`
      );
      const rawData = response.data.data;

      const assignments: Assignment[] =
        rawData.assignments?.map((a: any) => ({
          id: a.id,
          title: a.name,
          description: a.description || "No description",
          dueDate: a.dueDate || "No due date",
          subject: {
            id: a.subject?.id || "unknown",
            name: a.subject?.name || "Unknown Subject",
            description: a.subject?.description || "No description",
          },
        })) || [];

      // const assignments: Assignment[] = (rawData.assignments || []).map(
      //   (a: any) => ({
      //     id: a.id,
      //     title: a.name,
      //     description: a.description ?? "No description",
      //     dueDate: a.dueDate ?? "No due date",
      //     subject: {
      //       id: a.subject?.id ?? "unknown",
      //       name: a.subject?.name ?? "Unknown Subject",
      //       description: a.subject?.description ?? "No description",
      //     },
      //   })
      // );

      const normalizedData: ClassData = {
        id: rawData.id,
        name: rawData.name,
        students: rawData.students || [],
        teachers: rawData.teachers || [],
        subjects: rawData.subjects || [],
        assignments: assignments,
      };

      setClassData(normalizedData);
      setStep("view-details");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error fetching class details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClassSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (selectedClass) {
      fetchClassDetails(selectedClass);
    }
  };

  const handleBackToSelection = (): void => {
    setStep("select-class");
    setClassData(null);
    setSelectedClass("");
    setError("");
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (step === "select-class") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 hover:bg-primary/20 hover:scale-110">
              <GraduationCap className="h-8 w-8 text-primary transition-transform duration-300 hover:rotate-12" />
            </div>
            <CardTitle className="text-2xl animate-fade-in">
              Welcome, Student!
            </CardTitle>
            <CardDescription className="animate-fade-in-delay">
              Please select your class to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleClassSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="class-select"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select Your Class
                </label>
                <Select
                  value={selectedClass}
                  onValueChange={setSelectedClass}
                  required
                >
                  <SelectTrigger className="transition-all duration-200 hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Choose a class..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="transition-colors duration-200 hover:bg-primary/5"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                disabled={loading || !selectedClass}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          .animate-fade-in-delay {
            animation: fade-in 0.8s ease-out;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  if (step === "view-details" && classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <Card className="transform transition-all duration-300 hover:shadow-lg animate-slide-in-top">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl transition-colors duration-300 hover:text-primary">
                    {classData.name?.replace(/-/g, " ") || "Class Dashboard"}
                  </CardTitle>
                  <CardDescription>Class ID: {classData.id}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBackToSelection}
                  className="transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  Change Class
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 animate-slide-in-left">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:text-blue-500 hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-colors duration-300 hover:text-blue-600">
                  {classData.students.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total classmates
                </p>
              </CardContent>
            </Card>

            <Card
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 animate-slide-in-left"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                <User className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:text-green-500 hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-colors duration-300 hover:text-green-600">
                  {classData.teachers?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Faculty members</p>
              </CardContent>
            </Card>

            <Card
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 animate-slide-in-left"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:text-purple-500 hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-colors duration-300 hover:text-purple-600">
                  {classData.subjects?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Course subjects</p>
              </CardContent>
            </Card>

            <Card
              className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 animate-slide-in-left"
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assignments
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:text-orange-500 hover:scale-110" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold transition-colors duration-300 hover:text-orange-600">
                  {classData.assignments?.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active assignments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Students List */}
            <Card className="transform transition-all duration-300 hover:shadow-xl animate-slide-in-bottom">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 transition-colors duration-300 hover:text-blue-600">
                  <Users className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                  Classmates
                </CardTitle>
                <CardDescription>
                  Students in your class ({classData.students?.length || 0})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {classData.students?.length > 0 ? (
                    classData.students.map((student, index) => (
                      <div
                        key={student.id}
                        className="flex items-center space-x-3 rounded-lg border p-3 transition-all duration-300 hover:shadow-md hover:bg-blue-50 hover:border-blue-200 hover:scale-102 cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Avatar className="transition-transform duration-300 hover:scale-110">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none transition-colors duration-300 hover:text-blue-600">
                            {student.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {student.studentId}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No students found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Teachers List */}
            <Card
              className="transform transition-all duration-300 hover:shadow-xl animate-slide-in-bottom"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 transition-colors duration-300 hover:text-green-600">
                  <User className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                  Teachers
                </CardTitle>
                <CardDescription>
                  Faculty members ({classData.teachers?.length || 0})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {classData.teachers?.length > 0 ? (
                    classData.teachers.map((teacher, index) => (
                      <div
                        key={teacher.id}
                        className="flex items-center space-x-3 rounded-lg border p-3 transition-all duration-300 hover:shadow-md hover:bg-green-50 hover:border-green-200 hover:scale-102 cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Avatar className="transition-transform duration-300 hover:scale-110">
                          <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 font-semibold">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none transition-colors duration-300 hover:text-green-600">
                            {teacher.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {teacher.teacherId}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No teachers found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subjects */}
          <Card
            className="transform transition-all duration-300 hover:shadow-xl animate-slide-in-bottom"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 transition-colors duration-300 hover:text-purple-600">
                <BookOpen className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                Subjects
              </CardTitle>
              <CardDescription>
                Course subjects for this class (
                {classData.subjects?.length || 0})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classData.subjects?.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {classData.subjects.map((subjectData, index) => (
                    <div
                      key={subjectData.id}
                      className="rounded-lg border p-4 transition-all duration-300 hover:shadow-lg hover:bg-purple-50 hover:border-purple-200 hover:scale-105 cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium transition-colors duration-300 hover:text-purple-600">
                            {subjectData.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="transition-all duration-300 hover:bg-purple-100 hover:text-purple-700"
                          >
                            {subjectData.code}
                          </Badge>
                        </div>
                        <BookOpen className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:text-purple-500 hover:scale-110" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No subjects found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card
            className="transform transition-all duration-300 hover:shadow-xl animate-slide-in-bottom"
            style={{ animationDelay: "0.6s" }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 transition-colors duration-300 hover:text-orange-600">
                <FileText className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                Assignments
              </CardTitle>
              <CardDescription>
                Assignments for this class ({classData.assignments?.length || 0}
                )
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classData.assignments?.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {classData.assignments.map((assignmentData, index) => (
                    <div
                      key={assignmentData.id}
                      className="rounded-lg border p-4 transition-all duration-300 hover:shadow-lg hover:bg-orange-50 hover:border-orange-200 hover:scale-105 cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium transition-colors duration-300 hover:text-orange-600">
                            {assignmentData.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="transition-all duration-300 hover:bg-orange-100 hover:text-orange-700"
                          >
                            {assignmentData.description}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-2">
                            Due: {assignmentData.dueDate}
                          </p>
                        </div>
                        <FileText className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:text-orange-500 hover:scale-110" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No Assignments found
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <style jsx>{`
          @keyframes slide-in-top {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slide-in-left {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slide-in-bottom {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-in-top {
            animation: slide-in-top 0.6s ease-out;
          }
          .animate-slide-in-left {
            animation: slide-in-left 0.6s ease-out;
          }
          .animate-slide-in-bottom {
            animation: slide-in-bottom 0.6s ease-out;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
          .hover\\:scale-102:hover {
            transform: scale(1.02);
          }
        `}</style>
      </div>
    );
  }

  return null;
}
