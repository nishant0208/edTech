// pages/parent.tsx
"use client";
import React, { useState } from "react";
import Head from "next/head";
import Script from "next/script";

// --- Dummy Data (Expanded for Student Dashboard) ---
// In a real application, this data would be fetched from a backend API,
// linked to specific parent and student accounts.

// Classes data (reused from admin.tsx context)
const classes = [
  { id: "1", name: "Class 10 A", teacher: "Ms. Smith" },
  { id: "2", name: "Class 10 B", teacher: "Mr. Johnson" },
  { id: "3", name: "Class 11 Science", teacher: "Dr. Lee" },
  { id: "4", name: "Class 9 C", teacher: "Ms. Davis" },
];

// Student data (expanded with grades, attendance, fees, and related info)
const students = [
  {
    id: "s1",
    name: "Alice Smith",
    classId: "1", // Class 10 A
    email: "alice.s@example.com",
    dob: "2009-03-15",
    grades: [
      {
        subject: "Mathematics",
        score: 88,
        max: 100,
        date: "2025-05-20",
        type: "Test",
      },
      {
        subject: "Science",
        score: 92,
        max: 100,
        date: "2025-05-18",
        type: "Exam",
      },
      {
        subject: "English",
        score: 75,
        max: 100,
        date: "2025-04-30",
        type: "Assignment",
      },
    ],
    attendance: [
      { date: "2025-05-25", status: "Present" },
      { date: "2025-05-24", status: "Absent", reason: "Sick" },
      { date: "2025-05-23", status: "Present" },
      { date: "2025-05-22", status: "Present" },
      { date: "2025-05-21", status: "Absent", reason: "Family event" },
    ],
    feesStatus: {
      totalAmount: 12000,
      paidAmount: 10000,
      dueDate: "2025-06-30",
      status: "Partial Paid",
    },
    upcomingEvents: [
      { title: "Math Test - Class 10 A", date: "2025-06-15", type: "Test" },
      { title: "Parent-Teacher Meeting", date: "2025-06-25", type: "Event" },
    ],
  },
  {
    id: "s2",
    name: "Bob Johnson",
    classId: "1", // Class 10 A
    email: "bob.j@example.com",
    dob: "2009-01-20",
    grades: [
      {
        subject: "Mathematics",
        score: 70,
        max: 100,
        date: "2025-05-20",
        type: "Test",
      },
      {
        subject: "Science",
        score: 85,
        max: 100,
        date: "2025-05-18",
        type: "Exam",
      },
    ],
    attendance: [
      { date: "2025-05-25", status: "Present" },
      { date: "2025-05-24", status: "Present" },
    ],
    feesStatus: {
      totalAmount: 12000,
      paidAmount: 12000,
      dueDate: "2025-06-30",
      status: "Paid",
    },
    upcomingEvents: [
      { title: "Math Test - Class 10 A", date: "2025-06-15", type: "Test" },
    ],
  },
  {
    id: "s3",
    name: "Charlie Brown",
    classId: "2", // Class 10 B
    email: "charlie.b@example.com",
    dob: "2009-04-01",
    grades: [],
    attendance: [
      { date: "2025-05-25", status: "Absent", reason: "Doctor appointment" },
    ],
    feesStatus: {
      totalAmount: 11000,
      paidAmount: 0,
      dueDate: "2025-06-30",
      status: "Unpaid",
    },
    upcomingEvents: [],
  },
];

// Announcements (new for parent/student dashboard)
const announcements = [
  {
    id: "a1",
    title: "School Closed - May 30th",
    content:
      "Due to unexpected maintenance, the school will be closed on Friday, May 30th.",
    date: "2025-05-28",
  },
  {
    id: "a2",
    title: "Summer Camp Registration Open",
    content:
      "Register for our exciting summer camp programs! Early bird discounts available until June 10th.",
    date: "2025-05-25",
  },
  {
    id: "a3",
    title: "Annual Sports Day on July 1st",
    content:
      "Get ready for Annual Sports Day! Students are encouraged to participate.",
    date: "2025-05-20",
  },
];

// Roster data for the current week (simplified for student view)
const roster = [
  {
    day: "Monday",
    slots: [
      {
        time: "9:00 AM",
        class: "Class 10 A",
        teacher: "Ms. Smith",
        subject: "Mathematics",
      },
      {
        time: "10:00 AM",
        class: "Class 10 B",
        teacher: "Mr. Johnson",
        subject: "Science",
      },
      {
        time: "11:00 AM",
        class: "Class 10 A",
        teacher: "Dr. Lee",
        subject: "Physics",
      },
    ],
  },
  {
    day: "Tuesday",
    slots: [
      {
        time: "9:00 AM",
        class: "Class 10 A",
        teacher: "Ms. Smith",
        subject: "English",
      },
      {
        time: "10:00 AM",
        class: "Class 10 A",
        teacher: "Mr. Johnson",
        subject: "Chemistry",
      },
    ],
  },
  {
    day: "Wednesday",
    slots: [
      {
        time: "9:00 AM",
        class: "Class 10 A",
        teacher: "Dr. Lee",
        subject: "Biology",
      },
      {
        time: "10:00 AM",
        class: "Class 10 A",
        teacher: "Ms. Smith",
        subject: "Mathematics",
      },
    ],
  },
  {
    day: "Thursday",
    slots: [
      {
        time: "9:00 AM",
        class: "Class 10 A",
        teacher: "Ms. Davis",
        subject: "Social Studies",
      },
      {
        time: "10:00 AM",
        class: "Class 10 A",
        teacher: "Mr. Johnson",
        subject: "Physics",
      },
    ],
  },
  {
    day: "Friday",
    slots: [
      {
        time: "9:00 AM",
        class: "Class 10 A",
        teacher: "Ms. Smith",
        subject: "English",
      },
      {
        time: "10:00 AM",
        class: "Class 10 A",
        teacher: "Ms. Davis",
        subject: "Computer Science",
      },
    ],
  },
];

const ParentPage: React.FC = () => {
  // State to hold the ID of the currently selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    students[0]?.id || null
  );

  // Find the selected student's data
  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const studentClass = selectedStudent
    ? classes.find((c) => c.id === selectedStudent.classId)
    : null;

  // Filter roster for the selected student's class
  const studentRoster = selectedStudent
    ? roster
        .map((day) => ({
          ...day,
          slots: day.slots.filter((slot) => slot.class === studentClass?.name),
        }))
        .filter((day) => day.slots.length > 0) // Only include days with classes for this student
    : [];

  // Calculate attendance summary
  const totalDays = selectedStudent?.attendance.length || 0;
  const presentDays =
    selectedStudent?.attendance.filter((a) => a.status === "Present").length ||
    0;
  const attendancePercentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : "N/A";

  return (
    <div className="font-inter max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Parent Dashboard</title>
        <meta
          name="description"
          content="Parent dashboard to view student details"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-indigo-700">Parent Dashboard</h1>
      </div>

      {/* Student Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-6">
          <label
            htmlFor="student-select"
            className="block text-lg font-semibold text-gray-700 mb-3"
          >
            Select Child to View Dashboard:
          </label>
          <select
            id="student-select"
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            value={selectedStudentId || ""}
            onChange={(e) => setSelectedStudentId(e.target.value)}
          >
            {students.length > 0 ? (
              students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} (
                  {classes.find((c) => c.id === student.classId)?.name})
                </option>
              ))
            ) : (
              <option value="">No children found</option>
            )}
          </select>
        </div>

        {selectedStudent ? (
          <div className="mt-8 animate-fade-in">
            <h2 className="text-3xl font-semibold text-indigo-700 mb-6 pb-3 border-b border-gray-200">
              {selectedStudent.name}&apos;s Dashboard
            </h2>

            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 shadow-md">
                <p className="text-lg font-medium text-indigo-700 mb-2">
                  Student Name:
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedStudent.name}
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 shadow-md">
                <p className="text-lg font-medium text-indigo-700 mb-2">
                  Class:
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {studentClass?.name || "N/A"}
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 shadow-md">
                <p className="text-lg font-medium text-indigo-700 mb-2">
                  Teacher:
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {studentClass?.teacher || "N/A"}
                </p>
              </div>
            </div>

            {/* Academic Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Grades */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                  Grades
                </h3>
                {selectedStudent.grades.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[400px]">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
                            Subject
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
                            Score
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
                            Type
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.grades.map((grade, index) => (
                          <tr
                            key={index}
                            className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                          >
                            <td className="px-4 py-2 border-b border-gray-200">
                              {grade.subject}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200 font-medium">
                              {grade.score}/{grade.max}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">
                              {grade.type}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200">
                              {grade.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">
                    No grades recorded yet for this student.
                  </p>
                )}
              </div>

              {/* Attendance */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                  Attendance
                </h3>
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-lg font-medium text-blue-700">
                    Overall Attendance:
                  </p>
                  <p className="text-3xl font-bold text-blue-800">
                    {attendancePercentage}%
                  </p>
                </div>
                {selectedStudent.attendance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[300px]">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
                            Status
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.attendance.slice(0, 5).map(
                          (
                            att,
                            index // Show only recent 5
                          ) => (
                            <tr
                              key={index}
                              className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 ${
                                att.status === "Absent" ? "bg-red-50" : ""
                              }`}
                            >
                              <td className="px-4 py-2 border-b border-gray-200">
                                {att.date}
                              </td>
                              <td className="px-4 py-2 border-b border-gray-200">
                                <span
                                  className={`px-2 py-1 rounded-md text-xs font-semibold
                                ${
                                  att.status === "Present"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                                >
                                  {att.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 border-b border-gray-200 text-sm italic">
                                {att.reason || "N/A"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">
                    No attendance data available.
                  </p>
                )}
                {selectedStudent.attendance.length > 5 && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Showing recent 5 entries. More details available in full
                    report.
                  </p>
                )}
              </div>
            </div>

            {/* Schedule / Roster */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                My Weekly Schedule
              </h3>
              {studentRoster.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studentRoster.map((daySchedule) => (
                    <div
                      key={daySchedule.day}
                      className="bg-gray-50 border border-gray-100 rounded-lg p-5 shadow-sm"
                    >
                      <h4 className="font-semibold text-xl text-gray-700 mb-4 text-center">
                        {daySchedule.day}
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Time
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Subject
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                                Teacher
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {daySchedule.slots.map((slot, index) => (
                              <tr
                                key={index}
                                className="odd:bg-white even:bg-gray-50"
                              >
                                <td className="px-3 py-2 border-b border-gray-200 text-sm">
                                  {slot.time}
                                </td>
                                <td className="px-3 py-2 border-b border-gray-200 text-sm">
                                  {slot.subject}
                                </td>
                                <td className="px-3 py-2 border-b border-gray-200 text-sm">
                                  {slot.teacher}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">
                  No schedule available for this student.
                </p>
              )}
            </div>

            {/* Upcoming Events (Student specific, or class-specific) */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                Upcoming Events & Tests
              </h3>
              {selectedStudent.upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStudent.upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg shadow-sm border
                      ${
                        event.type === "Test"
                          ? "bg-red-50 border-red-200"
                          : event.type === "Exam"
                          ? "bg-orange-50 border-orange-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p className="text-lg font-semibold text-gray-800">
                        {event.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Date: {event.date}
                      </p>
                      <span
                        className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold
                        ${
                          event.type === "Test"
                            ? "bg-red-100 text-red-700"
                            : event.type === "Exam"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">
                  No upcoming events or tests for this student.
                </p>
              )}
            </div>

            {/* Fees Status */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                Fees Status
              </h3>
              <div
                className={`p-6 rounded-lg text-center shadow-md
                ${
                  selectedStudent.feesStatus.status === "Paid"
                    ? "bg-green-50 border-green-200"
                    : selectedStudent.feesStatus.status === "Partial Paid"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p className="text-xl font-medium mb-2">
                  Total Amount:{" "}
                  <span className="font-bold">
                    ${selectedStudent.feesStatus.totalAmount.toLocaleString()}
                  </span>
                </p>
                <p className="text-xl font-medium mb-2">
                  Amount Paid:{" "}
                  <span className="font-bold">
                    ${selectedStudent.feesStatus.paidAmount.toLocaleString()}
                  </span>
                </p>
                <p className="text-xl font-medium mb-2">
                  Amount Due:{" "}
                  <span className="font-bold">
                    $
                    {(
                      selectedStudent.feesStatus.totalAmount -
                      selectedStudent.feesStatus.paidAmount
                    ).toLocaleString()}
                  </span>
                </p>
                <p className="text-xl font-medium mb-4">
                  Due Date:{" "}
                  <span className="font-bold">
                    {selectedStudent.feesStatus.dueDate}
                  </span>
                </p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-lg font-bold
                  ${
                    selectedStudent.feesStatus.status === "Paid"
                      ? "bg-green-200 text-green-800"
                      : selectedStudent.feesStatus.status === "Partial Paid"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  Status: {selectedStudent.feesStatus.status}
                </span>
              </div>
            </div>

            {/* Latest Announcements */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                Latest School Announcements
              </h3>
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-gray-50 border border-gray-100 p-4 rounded-lg shadow-sm"
                    >
                      <p className="text-lg font-semibold text-gray-800">
                        {announcement.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Published: {announcement.date}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">
                  No announcements at this time.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-600">
            <p className="text-xl">
              Please select a student to view their dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentPage;
