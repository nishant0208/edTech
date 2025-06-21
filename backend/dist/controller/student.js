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
exports.deleteStudent = exports.updateStudent = exports.getStudentById = exports.getStudents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getStudents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.student.findMany();
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});
exports.getStudents = getStudents;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || typeof id !== "string") {
            return res.status(400).json({ error: "Invalid student ID" });
        }
        const student = yield prisma.student.findUnique({
            where: { id },
            include: {
                class: true,
                user: {
                    select: { email: true },
                },
            },
        });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        return res.status(200).json(student);
    }
    catch (error) {
        console.error("Error fetching student by ID:", error);
        return res.status(500).json({ error: "Failed to fetch student" });
    }
});
exports.getStudentById = getStudentById;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, phone, classId } = req.body;
    try {
        const updated = yield prisma.student.update({
            where: { id },
            data: {
                name,
                phone,
                classId,
            },
        });
        res.status(200).json(updated);
    }
    catch (err) {
        console.error("Update student error:", err);
        res.status(500).json({ message: "Failed to update student" });
    }
});
exports.updateStudent = updateStudent;
// Delete student
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.student.delete({ where: { id } });
        res.status(200).json({ message: "Student deleted successfully" });
    }
    catch (err) {
        console.error("Delete student error:", err);
        res.status(500).json({ message: "Failed to delete student" });
    }
});
exports.deleteStudent = deleteStudent;
