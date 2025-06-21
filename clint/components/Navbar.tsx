/* eslint-disable */

"use client";
import { Bell, GraduationCap, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Navbar() {
  const [teacher, setTeacher] = useState({
    name: "Dr. Sarah Johnson",
    teacherId: "TCH001",
    email: "sarah.johnson@school.com",
    phone: "+1234567890",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616c27644e2?w=150&h=150&fit=crop&crop=face",
    department: "Mathematics & Science",
    experience: "8 years",
  });
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
      {" "}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EduPortal</h1>
                  <p className="text-sm text-gray-500">Teacher Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>

              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-full">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {teacher.name}
                  </p>
                  <p className="text-xs text-gray-500">{teacher.teacherId}</p>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
