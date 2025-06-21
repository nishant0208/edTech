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
// src/routes/teacherBulkRoutes.ts
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Helper to safely parse enum string
function parseTeacherStatus(statusString) {
    if (!statusString)
        return undefined;
    const upperStatus = statusString.toUpperCase();
    if (Object.values(client_1.TeacherStatus).includes(upperStatus)) {
        return upperStatus;
    }
    return undefined; // Or throw an error if strict validation is needed
}
// Endpoint: POST /api/teachers/bulk-upload
router.post('/bulk-upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherRecords = req.body;
    if (!Array.isArray(teacherRecords) || teacherRecords.length === 0) {
        return res.status(400).json({ message: 'Invalid data format or empty array.' });
    }
    const errors = [];
    const successfulUploads = [];
    for (const record of teacherRecords) {
        try {
            // 1. Basic Validation
            if (!record.email || !record.name) {
                throw new Error('Missing required fields (email, name).');
            }
            // 2. Find or Create User
            let user = yield prisma.user.findUnique({ where: { email: record.email } });
            if (!user) {
                const temporaryPassword = Math.random().toString(36).substring(2, 10);
                const hashedPassword = yield bcryptjs_1.default.hash(temporaryPassword, 10);
                user = yield prisma.user.create({
                    data: {
                        email: record.email,
                        password: hashedPassword,
                        role: client_1.UserRole.TEACHER, // Assign correct role
                        isActive: true,
                    },
                });
                console.log(`Created new user for teacher: ${record.email}`);
            }
            else if (user.role !== client_1.UserRole.TEACHER) {
                throw new Error(`Email ${record.email} exists with role ${user.role}. Cannot register as Teacher.`);
            }
            // 3. Create Teacher Record
            const newTeacher = yield prisma.teacher.create({
                data: {
                    userId: user.id, // Link to the User
                    name: record.name,
                    phone: record.phone || null,
                    address: record.address || null,
                    dateOfJoining: record.dateOfJoining ? new Date(record.dateOfJoining) : null,
                    qualification: record.qualification || null,
                    status: parseTeacherStatus(record.status) || client_1.TeacherStatus.ACTIVE, // Default to ACTIVE
                    subject: record.subject || null, // Primary subject string
                    branch: record.branch || null,
                    // teacherId is @unique @default(cuid()) so Prisma generates it
                },
            });
            // 4. Handle multiple subjects and classes if provided (using comma-separated strings)
            if (record.subjects_taught) {
                const subjectNames = String(record.subjects_taught).split(',').map(s => s.trim()).filter(Boolean);
                for (const subjectName of subjectNames) {
                    let subject = yield prisma.subject.findUnique({ where: { name: subjectName } });
                    if (!subject) {
                        // Option 1: Throw error if subject doesn't exist
                        console.warn(`Subject "${subjectName}" not found. Skipping linking for ${newTeacher.name}.`);
                        continue; // Skip this subject
                        // Option 2: Create subject if it doesn't exist (less common for bulk-upload, usually subjects are pre-defined)
                        // subject = await prisma.subject.create({ data: { name: subjectName, code: 'AUTO_GEN', description: 'Auto-generated during bulk upload' } });
                    }
                    if (subject) {
                        // Link teacher to subject (assuming a direct teacherId on Subject, or a join table)
                        // Based on your schema, Subject has teacherId. We'll update the subject to link.
                        // This might mean a subject can only have ONE teacher.
                        // If a teacher teaches MULTIPLE subjects, you'd need a TeacherSubject join table.
                        // Your schema: `teacherId String?` on Subject. This means a Subject can belong to a Teacher.
                        // If it means a Teacher teaches MANY subjects, you need a join table.
                        // For now, let's assume `subject` field on Teacher is the primary one, and `subjects_taught` is just descriptive.
                        // If you need Many-to-Many, we'd need a `TeacherSubjects` model.
                        // If subject has a single teacher, this would update subject.teacherId
                        // await prisma.subject.update({
                        //   where: { id: subject.id },
                        //   data: { teacherId: newTeacher.id }
                        // });
                        // For this schema, `Teacher.subject` is a string, and `subjects` is a relation.
                        // So, `subjects_taught` should create/link `Subject` records.
                        // Your schema has `Subject[]` on Teacher, and `teacherId` on Subject.
                        // This suggests a one-to-many from Teacher to Subject (a teacher has many subjects, but a subject has one teacher).
                        // So, for each subject in `subjects_taught`, we update that subject's teacherId to this teacher.
                        yield prisma.subject.update({
                            where: { name: subjectName },
                            data: { teacherId: newTeacher.id },
                        });
                        console.log(`Linked subject ${subjectName} to teacher ${newTeacher.name}`);
                    }
                }
            }
            if (record.classes_taught_names) {
                const classNames = String(record.classes_taught_names).split(',').map(c => c.trim()).filter(Boolean);
                for (const className of classNames) {
                    const teacherClass = yield prisma.class.findUnique({ where: { name: className } });
                    if (!teacherClass) {
                        console.warn(`Class "${className}" not found. Skipping linking for teacher ${newTeacher.name}.`);
                        continue;
                    }
                    // Link teacher to class (assuming Class has teacherId, or a ClassTeacher join table)
                    // Your schema has `teachers Class[]` on Teacher, and no direct teacherId on Class.
                    // This implies a many-to-many relationship using a join table, but you don't have one defined
                    // between Teacher and Class currently.
                    // The `Teacher.classes Class[]` implies that Class has a field that references Teacher.
                    // Your Class model has `teachers: Teacher[]`. This is actually the other way around.
                    // It implies `Teacher` has a relation field back to `Class`.
                    // For Many-to-Many `Teacher` to `Class`, you'd need a `ClassTeacher` join table.
                    // For now, I'll skip this part as the Prisma schema for Class-Teacher many-to-many is not clear for direct linking here.
                    // If a class has a single primary teacher, `teacherId String?` would be on `Class` model.
                    // If a teacher teaches multiple classes and a class has multiple teachers, a `_ClassToTeacher` implicit join table or explicit `ClassTeacher` model is needed.
                    // Given your `Class.teachers: Teacher[]`, you *might* mean a Teacher has a reference back to Class.
                    // But `Class.teachers: Teacher[]` on Class model means a Class can have many teachers.
                    // Let's assume you'd add a join table like `TeacherClass` if needed for many-to-many.
                    // As your schema implies a direct relation from Teacher to Class for a single `classId` in Student,
                    // but Class has `teachers: Teacher[]`, this implies a Class can have many teachers.
                    // The current teacher model: `classes Class[]`. This indicates a Teacher can be linked to multiple Classes.
                    // This would typically involve Prisma's implicit many-to-many join table.
                    // So, to link, we need to update the Class to connect this Teacher.
                    // To link `newTeacher` to `teacherClass`:
                    // This assumes `Class` has a relation field to `Teacher` (e.g., `teachers: Teacher[]`)
                    // Prisma handles the implicit join table.
                    yield prisma.class.update({
                        where: { id: teacherClass.id },
                        data: {
                            teachers: {
                                connect: { id: newTeacher.id }
                            }
                        }
                    });
                    console.log(`Linked teacher ${newTeacher.name} to class ${className}`);
                }
            }
            successfulUploads.push({ email: record.email, name: record.name, status: 'success' });
        }
        catch (e) {
            console.error(`Error processing teacher record (${record.email || record.name || JSON.stringify(record)}):`, e.message);
            errors.push({ record: record, error: e.message });
        }
    }
    if (errors.length > 0) {
        return res.status(207).json({
            message: `${successfulUploads.length} teacher records uploaded successfully, ${errors.length} failed.`,
            successfulUploads,
            errors,
        });
    }
    return res.status(200).json({
        message: `Successfully uploaded ${successfulUploads.length} teacher records.`,
        count: successfulUploads.length,
    });
}));
exports.default = router;
