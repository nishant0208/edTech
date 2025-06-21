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
  const [editBranchId, setEditBranchId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Branch>>({});

  const fetchBranches = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/branches`
      );
      setBranches(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load branches");
    }
  };

  const handleAddBranch = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/branches`,
        newBranch
      );
      setNewBranch({ name: "", students: 0, teachers: 0, classes: 0 });
      await fetchBranches();
    } catch (err) {
      console.error(err);
      setError("Failed to add branch");
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/branches/${id}`);
      await fetchBranches();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdateBranch = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/branches/${editBranchId}`,
        editData
      );
      setEditBranchId(null);
      setEditData({});
      await fetchBranches();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manage Branches</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Branch List */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Branch Name</th>
              <th className="border p-2">Students</th>
              <th className="border p-2">Teachers</th>
              <th className="border p-2">Classes</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id} className="text-center">
                <td className="border p-2">
                  {editBranchId === branch.id ? (
                    <input
                      type="text"
                      value={editData.name || branch.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  ) : (
                    branch.name
                  )}
                </td>
                <td className="border p-2">
                  {editBranchId === branch.id ? (
                    <input
                      type="number"
                      value={editData.students ?? branch.students}
                      onChange={(e) =>
                        setEditData({ ...editData, students: +e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  ) : (
                    branch.students
                  )}
                </td>
                <td className="border p-2">
                  {editBranchId === branch.id ? (
                    <input
                      type="number"
                      value={editData.teachers ?? branch.teachers}
                      onChange={(e) =>
                        setEditData({ ...editData, teachers: +e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  ) : (
                    branch.teachers
                  )}
                </td>
                <td className="border p-2">
                  {editBranchId === branch.id ? (
                    <input
                      type="number"
                      value={editData.classes ?? branch.classes}
                      onChange={(e) =>
                        setEditData({ ...editData, classes: +e.target.value })
                      }
                      className="border p-1 w-full"
                    />
                  ) : (
                    branch.classes
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  {editBranchId === branch.id ? (
                    <>
                      <button
                        onClick={handleUpdateBranch}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditBranchId(null)}
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditBranchId(branch.id);
                          setEditData(branch);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Branch Form */}
      <div className="border p-4 rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-4">Add New Branch</h3>
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
            placeholder="No. of Students"
            className="border p-2"
            value={newBranch.students}
            onChange={(e) =>
              setNewBranch({ ...newBranch, students: +e.target.value })
            }
          />
          <input
            type="number"
            placeholder="No. of Teachers"
            className="border p-2"
            value={newBranch.teachers}
            onChange={(e) =>
              setNewBranch({ ...newBranch, teachers: +e.target.value })
            }
          />
          <input
            type="number"
            placeholder="No. of Classes"
            className="border p-2"
            value={newBranch.classes}
            onChange={(e) =>
              setNewBranch({ ...newBranch, classes: +e.target.value })
            }
          />
        </div>
        <button
          onClick={handleAddBranch}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Branch
        </button>
      </div>
    </div>
  );
}
