// pages/admin/page.tsx
"use client";
import BulkUploadModule from "@/components/BulkUploadModule";
import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import StudentTab from "@/components/admin-student";
import TeacherTab from "@/components/admin-teacher";
import AdminClass from "@/components/admin-class";
import BranchTab from "@/components/BranchTab";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Landmark,
  Upload,
  UserRoundPlus,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface EventData {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface LeadData {
  id: string;
  studentName: string;
  parentName: string;
  contactEmail: string;
  contactPhone: string;
  desiredClass: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [BranchCount, setBranchCount] = useState(0);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    type: "Event",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [rejectingLeadId, setRejectingLeadId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, leadRes, studentRes, teacherRes, classRes, branchRes] =
          await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/leads`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teachers`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/class`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/branches`),
          ]);
        console.log(eventRes.data, leadRes.data);
        setEvents(eventRes.data);
        setLeads(leadRes.data);
        console.log("Branch response", branchRes.data);

        setStudentCount(studentRes.data.length);
        setTeacherCount(teacherRes.data.length);
        setBranchCount(branchRes.data.length);
        setClassCount(classRes.data.data.length);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddEvent = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        newEvent
      );
      setEvents((prev) => [...prev, res.data]);
      setNewEvent({ title: "", date: "", type: "Event" });
    } catch (err) {
      console.error(err);
      setError("Failed to add event");
    }
  };

  const handleApproveLead = async (id: string) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/leads/approve/${id}`
      );

      if (response.data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: "Approved" } : l))
        );
      } else {
        setError(response.data.message || "Failed to approve lead");
      }
    } catch (error) {
      console.error("Failed to approve lead:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to approve lead";
      setError(errorMessage);
    }
  };

  const handleRejectLead = async (id: string, reason: string) => {
    if (!reason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/leads/reject/${id}`,
        { rejectionReason: reason }
      );

      if (response.data.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === id
              ? { ...lead, status: "Rejected", rejectionReason: reason }
              : lead
          )
        );

        setRejectionReasonInput("");
        setRejectingLeadId(null);
      } else {
        setError(response.data.message || "Failed to reject lead");
      }
    } catch (error) {
      console.error("Failed to reject lead:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject lead";
      setError(errorMessage);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classes", label: "Classes", icon: BookOpen },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "Branch", label: "Branch", icon: Landmark },
    { id: "bulkUpload", label: "Bulk Upload", icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-700 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-blue-200">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <div className="bg-gradient-to-br from-purple-100 to-blue-200 p-6 shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              <h2 className="text-2xl font-bold mb-2 text-purple-600">
                Total Events
              </h2>
              <p className="text-3xl font-extrabold text-purple-600 tracking-tight">
                {events.length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-green-200 p-6 shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              <h2 className="text-2xl font-bold mb-2 text-green-600">Leads</h2>
              <p className="text-3xl font-extrabold text-green-600 tracking-tight">
                {leads.length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 to-blue-200 p-6 shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              <h2 className="text-2xl font-bold mb-2 text-blue-800">Branch</h2>
              <p className="text-3xl font-bold text-blue-700">{BranchCount}</p>
            </div>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-800 flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Total Classes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {classCount}
                </div>
                <p className="text-purple-600 text-sm mt-1">
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-800 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Total Teachers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {teacherCount}
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Active faculty members
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow ">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-800 flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Total Students</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {studentCount}
                </div>
                <p className="text-blue-600 text-sm mt-1">Enrolled students</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="space-y-6">
            <div className="bg-white p-6 shadow rounded">
              <h2 className="text-xl font-semibold mb-4">School Calendar</h2>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
              />
            </div>

            <div className="bg-white p-6 shadow rounded">
              <h2 className="text-xl font-semibold mb-4">Add New Event</h2>
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  placeholder="Event Title"
                  className="border p-2 w-full sm:w-auto"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border p-2 w-full sm:w-auto"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
                <select
                  className="border p-2 w-full sm:w-auto"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                >
                  <option value="Event">Academic Event</option>
                  <option value="Test">Test</option>
                  <option value="Exam">Exam</option>
                  <option value="Lecture">Extra Curriculam</option>
                </select>
                <button
                  onClick={handleAddEvent}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "students" && <StudentTab />}
        {activeTab === "teachers" && <TeacherTab />}
        {activeTab === "classes" && <AdminClass />}
        {activeTab === "Branch" && <BranchTab />}

        {activeTab === "bulkUpload" && (
          <div className="animate-fade-in">
            <BulkUploadModule />
          </div>
        )}
        {activeTab === "overview" && (
          <div className="mt-12">
            <h2 className="text-3xl font-italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4 flex items-center gap-3">
              <UserRoundPlus className="w-8 h-8 text-green-600" />
              <span>Leads Overview</span>
            </h2>
            <div className="overflow-x-auto rounded-xl shadow-lg bg-gradient-to-br from-white via-green-50 to-green-100 p-6 border border-green-300">
              <table className="w-full text-sm text-gray-700 border-separate border-spacing-y-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Student</th>
                    <th className="p-2 border">Parent</th>
                    <th className="p-2 border">Class</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="p-2 border">{lead.studentName}</td>
                      <td className="p-2 border">{lead.parentName}</td>
                      <td className="p-2 border">{lead.desiredClass}</td>
                      <td className="p-2 border">{lead.status}</td>
                      <td className="p-2 border">
                        {lead.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveLead(lead.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectingLeadId(lead.id);
                                setRejectionReasonInput("");
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {lead.status === "Rejected" && (
                          <p className="text-sm text-red-600 italic">
                            {lead.rejectionReason}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rejectingLeadId && (
              <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded">
                <h3 className="text-md font-semibold mb-2 text-red-700">
                  Rejection Reason
                </h3>
                <textarea
                  className="w-full border p-2 mb-2"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleRejectLead(rejectingLeadId, rejectionReasonInput)
                    }
                    disabled={!rejectionReasonInput.trim()}
                    className="bg-red-600 text-white px-4 py-1 rounded disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => {
                      setRejectingLeadId(null);
                      setRejectionReasonInput("");
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
