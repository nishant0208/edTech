"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassById = exports.getAllClasses = exports.updateClass = exports.createClass = exports.getClasses = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classes = yield prisma.class.findMany({
            select: {
                id: true,
                name: true,
                grade: true,
                section: true,
            },
            orderBy: [{ grade: "asc" }, { section: "asc" }],
        });
        return res.json({
            success: true,
            data: classes,
        });
    }
    catch (error) {
        console.error("Get classes error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getClasses = getClasses;
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, grade, section, capacity } = req.body;
        if (!name || !grade || !section) {
            res.status(400).json({
                success: false,
                message: "Name, grade, and section are required",
            });
            return;
        }
        if (typeof grade !== "number" || grade < 1 || grade > 12) {
            res.status(400).json({
                success: false,
                message: "Grade must be a number between 1 and 12",
            });
            return;
        }
        const existingClass = yield prisma.class.findUnique({
            where: {
                grade_section: {
                    grade: grade,
                    section: section,
                },
            },
        });
        if (existingClass) {
            res.status(409).json({
                success: false,
                message: "Class with this grade and section already exists",
            });
            return;
        }
        const newClass = yield prisma.class.create({
            data: {
                name,
                grade,
                section,
                capacity: capacity || null,
            },
            include: {
                students: {
                    select: {
                        id: true,
                        name: true,
                        studentId: true,
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        teacherId: true,
                    },
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: newClass,
        });
    }
    catch (error) {
        console.error("Create class error:", error);
        if (error.code === "P2002") {
            res.status(409).json({
                success: false,
                message: "Class name must be unique",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Failed to create class",
        });
    }
});
exports.createClass = createClass;
const updateClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, grade, section, capacity } = req.body;
        // Check if class exists
        const existingClass = yield prisma.class.findUnique({
            where: { id },
        });
        if (!existingClass) {
            res.status(404).json({
                success: false,
                message: "Class not found",
            });
            return;
        }
        // Validate grade if provided
        if (grade !== undefined &&
            (typeof grade !== "number" || grade < 1 || grade > 12)) {
            res.status(400).json({
                success: false,
                message: "Grade must be a number between 1 and 12",
            });
            return;
        }
        // Check for duplicate grade/section combination if either is being updated
        if (grade !== undefined || section !== undefined) {
            const newGrade = grade !== undefined ? grade : existingClass.grade;
            const newSection = section !== undefined ? section : existingClass.section;
            if (newGrade !== existingClass.grade ||
                newSection !== existingClass.section) {
                const duplicateClass = yield prisma.class.findUnique({
                    where: {
                        grade_section: {
                            grade: newGrade,
                            section: newSection,
                        },
                    },
                });
                if (duplicateClass && duplicateClass.id !== id) {
                    res.status(409).json({
                        success: false,
                        message: "Class with this grade and section already exists",
                    });
                    return;
                }
            }
        }
        // Prepare update data
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (grade !== undefined)
            updateData.grade = grade;
        if (section !== undefined)
            updateData.section = section;
        if (capacity !== undefined)
            updateData.capacity = capacity;
        // Update class
        const updatedClass = yield prisma.class.update({
            where: { id },
            data: updateData,
            include: {
                students: {
                    select: {
                        id: true,
                        name: true,
                        studentId: true,
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        teacherId: true,
                    },
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "Class updated successfully",
            data: updatedClass,
        });
    }
    catch (error) {
        console.error("Update class error:", error);
        if (error.code === "P2002") {
            res.status(409).json({
                success: false,
                message: "Class name must be unique",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Failed to update class",
        });
    }
});
exports.updateClass = updateClass;
const getAllClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classes = yield prisma.class.findMany({
            include: {
                students: {
                    select: {
                        id: true,
                        name: true,
                        studentId: true,
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        teacherId: true,
                    },
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ grade: "asc" }, { section: "asc" }],
        });
        res.status(200).json({
            success: true,
            message: "Classes retrieved successfully",
            data: classes,
        });
    }
    catch (error) {
        console.error("Get classes error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve classes",
        });
    }
});
exports.getAllClasses = getAllClasses;
const getClassById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const classData = yield prisma.class.findUnique({
            where: { name: "Class 3" },
            include: {
                students: {
                    select: {
                        id: true,
                        name: true,
                        studentId: true,
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        teacherId: true,
                    },
                },
                subjects: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                            },
                        },
                    },
                },
                assignments: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });
        if (!classData) {
            res.status(404).json({
                success: false,
                message: "Class not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Class retrieved successfully",
            data: classData,
        });
    }
    catch (error) {
        console.error("Get class error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve class",
        });
    }
});
exports.getClassById = getClassById;
