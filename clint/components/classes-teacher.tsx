/* eslint-disable */

"use client";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Badge,
  Plus,
  X,
  Users,
  BookOpen,
  Trophy,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCreateClass, useGetClasses } from "@/hooks/class";

// const mockClasses = [
//   {
//     id: 1,
//     name: "Mathematics Advanced",
//     grade: 10,
//     section: "A",
//     capacity: 30,
//     students: [
//       { id: 1, name: "Alice Johnson", studentId: 95 },
//       { id: 2, name: "Bob Smith", studentId: 92 },
//       { id: 3, name: "Carol Davis", studentId: 89 },
//       { id: 4, name: "David Wilson", studentId: 87 },
//     ],
//     subjects: [
//       { subject: { id: 1, name: "Algebra" } },
//       { subject: { id: 2, name: "Geometry" } },
//       { subject: { id: 3, name: "Calculus" } },
//     ],
//   },
//   {
//     id: 2,
//     name: "Science Explorers",
//     grade: 9,
//     section: "B",
//     capacity: 25,
//     students: [
//       { id: 5, name: "Emma Brown", studentId: 94 },
//       { id: 6, name: "Frank Miller", studentId: 91 },
//       { id: 7, name: "Grace Lee", studentId: 88 },
//     ],
//     subjects: [
//       { subject: { id: 4, name: "Physics" } },
//       { subject: { id: 5, name: "Chemistry" } },
//       { subject: { id: 6, name: "Biology" } },
//     ],
//   },
// ];

export default function ClassesOfTeacher() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    section: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState<any>(null);
  const [formAnimation, setFormAnimation] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showAddForm) {
      setTimeout(() => setIsVisible(true), 50);
      setTimeout(() => setFormAnimation(true), 100);
    } else {
      setIsVisible(false);
      setFormAnimation(false);
    }
  }, [showAddForm]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const { data: mockClasses } = useGetClasses();
  const createClassMutation = useCreateClass();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const classData = {
      name: formData.name.trim(),
      grade: parseInt(formData.grade),
      section: formData.section.trim().toUpperCase(),
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
    };

    try {
      const output = await createClassMutation.mutateAsync(classData);
      console.log(output);

      // @ts-ignore
      setClasses((prev) => [...prev, output]);
      setFormData({ name: "", grade: "", section: "", capacity: "" });
      setShowAddForm(false);
      setErrors({});
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to create class:", error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormAnimation(false);
    setTimeout(() => {
      setFormData({ name: "", grade: "", section: "", capacity: "" });
      setErrors({});
      setShowAddForm(false);
    }, 200);
  };

  const toggleCardExpansion = (cardId: any) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <TabsContent value="classes" className="space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <GraduationCap className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Classes</h2>
              <p className="text-gray-600">Manage and track your classes</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
            }}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Add Class
          </button>
        </div>

        {showAddForm && (
          <div
            className={`fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ${
              isVisible
                ? "opacity-100 backdrop-blur-sm"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={(e) => e.target === e.currentTarget && handleCancel()}
          >
            <Card
              className={`w-full max-w-md mx-4 transform transition-all duration-300 ${
                formAnimation
                  ? "scale-100 translate-y-0"
                  : "scale-95 translate-y-4"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Plus className="text-blue-600" size={16} />
                    </div>
                    <CardTitle className="text-xl">Add New Class</CardTitle>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Class Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Grade 10-A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Grade *
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select Grade</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (grade) => (
                          <option key={grade} value={grade}>
                            Grade {grade}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Section *
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., A, B, C"
                      maxLength={2}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Capacity (Optional)
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Maximum students"
                      min="1"
                    />
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </div>
                      ) : (
                        "Create Class"
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockClasses?.map((cls) => (
            <Card
              key={cls.id}
              className={`group cursor-pointer transition-all duration-300 border-l-4 border-l-blue-500 hover:shadow-xl hover:scale-[1.02] bg-white ${
                hoveredCard === cls.id ? "shadow-xl" : "shadow-md"
              }`}
              onMouseEnter={() => setHoveredCard(cls.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => toggleCardExpansion(cls.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-200">
                        <BookOpen className="text-blue-600" size={16} />
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-700 transition-colors duration-200">
                        {cls.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-3 py-1 rounded-full font-semibold">
                        SECTION {cls.section}
                      </span>
                      <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                        GRADE {cls.grade}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 font-semibold">
                      <Users size={12} className="mr-1" />
                      {cls.students?.length || 0} students
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-gray-600" />
                    <h4 className="font-semibold text-gray-900">Subjects</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cls.subjects?.map((sub) => (
                      <span
                        key={sub.subject.id}
                        className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200"
                      >
                        {sub.subject.name}
                      </span>
                    )) || (
                      <span className="text-gray-500 text-sm italic">
                        No subjects assigned yet
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    expandedCard === cls.id
                      ? "max-h-96 opacity-100"
                      : "max-h-24 opacity-90"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy size={16} className="text-yellow-600" />
                    <h4 className="font-semibold text-gray-900">
                      Top Performers
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {cls.students && cls.students.length > 0 ? (
                      cls.students
                        .slice(
                          0,
                          expandedCard === cls.id ? cls.students.length : 3
                        )
                        .map((student, index) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <span className="text-gray-700 font-medium">
                                {student.name}
                              </span>
                            </div>
                            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {student.studentId}%
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4">
                        <Users
                          size={32}
                          className="mx-auto text-gray-300 mb-2"
                        />
                        <p className="text-gray-500 text-sm">
                          No students enrolled yet
                        </p>
                      </div>
                    )}
                  </div>

                  {cls.students && cls.students.length > 3 && (
                    <div className="mt-3 text-center">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200">
                        {expandedCard === cls.id
                          ? "Show less"
                          : `+${cls.students.length - 3} more students`}
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockClasses?.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="animate-bounce text-gray-300 mb-6">
              <GraduationCap size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No classes yet
            </h3>
            <p className="text-gray-500 mb-6 text-lg">
              Create your first class to get started with teaching
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
            >
              <Plus size={18} />
              Add Your First Class
            </button>
          </div>
        )}
      </TabsContent>
    </div>
  );
}
