"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Branch {
  id: string;
  name: string;
  students: number;
  teachers: number;
  classes: number;
}

export default function BranchTab() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newBranch, setNewBranch] = useState({
    name: "",
    students: 0,
    teachers: 0,
    classes: 0,
  });

  // Fetch all branches
  const fetchBranches = async () => {
    try {
      const branchRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/branches`
      );
      setBranches(branchRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load branches");
    }
  };

  const handleAddBranch = async () => {
    try {
      const branchRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/branches`,
        newBranch
      );
      setBranches((prev) => [...prev, branchRes.data]); // add to list
      setNewBranch({ name: "", students: 0, teachers: 0, classes: 0 });
    } catch (err) {
      console.error(err);
      setError("Failed to add branch");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Branch Management</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Add Branch Form */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Add New Branch</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Branch Name"
            className="border p-2"
            value={newBranch.name}
            onChange={(e) =>
              setNewBranch({ ...newBranch, name: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Students"
            className="border p-2"
            value={newBranch.students}
            onChange={(e) =>
              setNewBranch({ ...newBranch, students: +e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Teachers"
            className="border p-2"
            value={newBranch.teachers}
            onChange={(e) =>
              setNewBranch({ ...newBranch, teachers: +e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Classes"
            className="border p-2"
            value={newBranch.classes}
            onChange={(e) =>
              setNewBranch({ ...newBranch, classes: +e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAddBranch}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Branch
        </button>
      </div>

      {/* Display Branches */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">All Branches</h3>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Students</th>
                <th className="p-2 border">Teachers</th>
                <th className="p-2 border">Classes</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id}>
                  <td className="p-2 border">{branch.name}</td>
                  <td className="p-2 border">{branch.students}</td>
                  <td className="p-2 border">{branch.teachers}</td>
                  <td className="p-2 border">{branch.classes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {branches.length === 0 && (
            <p className="text-center text-gray-500 py-4">No branches found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
