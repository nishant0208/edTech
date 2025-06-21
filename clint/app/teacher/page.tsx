/* eslint-disable */
"use client";
import React, { useState, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  BookOpen,
  ClipboardList,
  Plus,
  Search,
  Filter,
  BarChart3,
} from "lucide-react";
import Welcome from "@/components/teacher-info";
import Stats from "@/components/ui/stats";
import ClassesOfTeacher from "@/components/classes-teacher";
import Assignments from "@/components/assignments-teacher";

export default function EnhancedTeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const getProgressPercentage = (assignment: {
    totalSubmissions: number;
    totalStudents: number;
  }) => {
    return Math.round(
      (assignment.totalSubmissions / assignment.totalStudents) * 100
    );
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        <Welcome />
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3  bg-white border border-gray-200">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="classes"
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Classes</span>
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="flex items-center space-x-2"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden md:inline">Assignments</span>
            </TabsTrigger>
          </TabsList>
          <Stats />
          <ClassesOfTeacher />
          <Assignments />
        </Tabs>
      </div>
    </div>
  );
}
