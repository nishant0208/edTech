/* eslint-disable */

"use client";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Bell,
  BookOpen,
  ClipboardList,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function Stats() {
  const [stats, setStats] = useState({
    totalClasses: 5,
    totalSubjects: 3,
    totalStudents: 125,
    totalAssignments: 18,
    pendingGrading: 7,
    averageGrade: 85,
  });
  const [classes, setClasses] = useState([
    {
      id: "1",
      name: "Grade 10-A",
      grade: 10,
      section: "A",
      students: [
        {
          id: "1",
          name: "Alice Johnson",
          studentId: "STU001",
          email: "alice@student.edu",
          avgGrade: 88,
        },
        {
          id: "2",
          name: "Bob Smith",
          studentId: "STU002",
          email: "bob@student.edu",
          avgGrade: 92,
        },
        {
          id: "3",
          name: "Carol Davis",
          studentId: "STU003",
          email: "carol@student.edu",
          avgGrade: 76,
        },
      ],
      subjects: [
        { subject: { id: "1", name: "Advanced Mathematics", code: "MATH201" } },
        { subject: { id: "2", name: "Statistics", code: "STAT101" } },
      ],
      schedule: "Mon, Wed, Fri - 9:00 AM",
      room: "Room 204",
    },
    {
      id: "2",
      name: "Grade 11-B",
      grade: 11,
      section: "B",
      students: [
        {
          id: "4",
          name: "David Wilson",
          studentId: "STU004",
          email: "david@student.edu",
          avgGrade: 94,
        },
        {
          id: "5",
          name: "Emma Brown",
          studentId: "STU005",
          email: "emma@student.edu",
          avgGrade: 89,
        },
      ],
      subjects: [{ subject: { id: "3", name: "Physics", code: "PHY301" } }],
      schedule: "Tue, Thu - 11:00 AM",
      room: "Lab 3",
    },
  ]);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      message: "3 new submissions for Quadratic Equations Test",
      time: "2 hours ago",
      type: "submission",
    },
    {
      id: "2",
      message: "Parent meeting scheduled for tomorrow",
      time: "5 hours ago",
      type: "meeting",
    },
    {
      id: "3",
      message: "Grade 10-A attendance below 85%",
      time: "1 day ago",
      type: "alert",
    },
  ]);

  return (
    <div>
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Classes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalClasses}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalStudents}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Assignments
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalAssignments}
                  </p>
                </div>
                <ClipboardList className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pendingGrading}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-pink-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Grade</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageGrade}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalSubjects}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === "submission"
                          ? "bg-green-500"
                          : notification.type === "meeting"
                          ? "bg-blue-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Class Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.map((cls) => {
                  const avgGrade =
                    cls.students.reduce(
                      (sum, student) => sum + student.avgGrade,
                      0
                    ) / cls.students.length;
                  return (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{cls.name}</p>
                        <p className="text-sm text-gray-600">
                          {cls.students.length} students
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {Math.round(avgGrade)}%
                        </p>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            avgGrade >= 90
                              ? "bg-green-100 text-green-800"
                              : avgGrade >= 80
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {avgGrade >= 90
                            ? "Excellent"
                            : avgGrade >= 80
                            ? "Good"
                            : "Needs Attention"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
}
