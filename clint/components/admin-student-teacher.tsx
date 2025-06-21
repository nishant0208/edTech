"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Eye } from "lucide-react";

interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  phone: string;
  status: string;
}

export default function AdminStudentTeacherTab() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [editStudentData, setEditStudentData] = useState<Partial<Student>>({});

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

  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">Students Management</h2>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Student ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="p-2 border">{student.studentId}</td>
                <td className="p-2 border">
                  {editStudentId === student.id ? (
                    <input
                      className="border p-1 w-full"
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
                </td>
                <td className="p-2 border">
                  {editStudentId === student.id ? (
                    <input
                      className="border p-1 w-full"
                      value={editStudentData.class || student.class}
                      onChange={(e) =>
                        setEditStudentData({
                          ...editStudentData,
                          class: e.target.value,
                        })
                      }
                    />
                  ) : (
                    student.class
                  )}
                </td>
                <td className="p-2 border">
                  {editStudentId === student.id ? (
                    <input
                      className="border p-1 w-full"
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
                </td>
                <td className="p-2 border">
                  <span className="bg-black text-white px-2 py-1 rounded text-xs">
                    {student.status}
                  </span>
                </td>
                <td className="p-2 border space-x-2">
                  <button className="text-gray-600">
                    <Eye size={16} />
                  </button>
                  {editStudentId === student.id ? (
                    <>
                      <button
                        onClick={handleUpdateStudent}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditStudentId(null)}
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditStudentId(student.id);
                          setEditStudentData(student);
                        }}
                        className="text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
