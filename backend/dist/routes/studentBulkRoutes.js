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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/studentBulkRoutes.ts
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Endpoint: POST /api/students/bulk-upload
router.post('/bulk-upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentRecords = req.body; // Array of objects from CSV
    if (!Array.isArray(studentRecords) || studentRecords.length === 0) {
        return res.status(400).json({ message: 'Invalid data format or empty array.' });
    }
    const errors = [];
    const successfulUploads = [];
    for (const record of studentRecords) {
        try {
            // 1. Basic Validation
            if (!record.email || !record.name) {
                throw new Error('Missing required fields (email, name).');
            }
            // 2. Find or Create User
            let user = yield prisma.user.findUnique({ where: { email: record.email } });
            if (!user) {
                // Generate a temporary password (HIGHLY IMPORTANT FOR SECURITY)
                const temporaryPassword = Math.random().toString(36).substring(2, 10); // Simple temp pass
                const hashedPassword = yield bcryptjs_1.default.hash(temporaryPassword, 10);
                user = yield prisma.user.create({
                    data: {
                        email: record.email,
                        password: hashedPassword,
                        role: client_1.UserRole.STUDENT,
                        isActive: true,
                        // You might want to store the temporaryPassword somewhere secure
                        // or send it via email/SMS immediately after user creation in a real app.
                    },
                });
                console.log(`Created new user for student: ${record.email}`);
            }
            else if (user.role !== client_1.UserRole.STUDENT) {
                // Handle case where email exists but for a different role
                throw new Error(`Email ${record.email} exists with role ${user.role}. Cannot register as Student.`);
            }
            // 3. Resolve Class ID by name
            let classId;
            if (record.class_name) {
                const studentClass = yield prisma.class.findUnique({ where: { name: record.class_name } });
                if (!studentClass) {
                    console.warn(`Class "${record.class_name}" not found for student ${record.name}. Student will not be assigned to a class.`);
                    classId = undefined; // Do not assign if class not found
                }
                else {
                    classId = studentClass.id;
                }
            }
            // 4. Create Student Record
            const newStudent = yield prisma.student.create({
                data: {
                    studentId: '',
                    userId: user.id,
                    name: record.name,
                    phone: record.phone || null,
                    address: record.address || null,
                    dateOfBirth: record.dateOfBirth ? new Date(record.dateOfBirth) : null,
                    admissionDate: record.admissionDate ? new Date(record.admissionDate) : new Date(),
                    classId: classId || null,
                    branch: record.branch || null,
                    // studentId is @unique @default(cuid()) so Prisma generates it
                },
            });
            // 5. Link Student to Parent (if parent_email provided)
            if (record.parent_email) {
                const parentUser = yield prisma.user.findUnique({ where: { email: record.parent_email } });
                if (parentUser && parentUser.role === client_1.UserRole.PARENT) {
                    const parent = yield prisma.parent.findUnique({ where: { userId: parentUser.id } });
                    if (parent) {
                        yield prisma.studentParent.create({
                            data: {
                                studentId: newStudent.id,
                                parentId: parent.id,
                            },
                        });
                        console.log(`Linked student ${newStudent.name} to parent ${parent.name}`);
                    }
                    else {
                        console.warn(`Parent user found for ${record.parent_email} but no corresponding Parent profile.`);
                    }
                }
                else {
                    console.warn(`Parent with email ${record.parent_email} not found or is not a parent role.`);
                }
            }
            successfulUploads.push({ email: record.email, name: record.name, status: 'success' });
        }
        catch (e) {
            console.error(`Error processing student record (${record.email || record.name || JSON.stringify(record)}):`, e.message);
            errors.push({ record: record, error: e.message });
        }
    }
    if (errors.length > 0) {
        return res.status(207).json({
            message: `${successfulUploads.length} student records uploaded successfully, ${errors.length} failed.`,
            successfulUploads,
            errors,
        });
    }
    return res.status(200).json({
        message: `Successfully uploaded ${successfulUploads.length} student records.`,
        count: successfulUploads.length,
    });
}));
exports.default = router;
