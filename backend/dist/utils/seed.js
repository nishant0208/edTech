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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Clean slate (optional)
        yield prisma.assignment.deleteMany();
        yield prisma.classSubject.deleteMany();
        yield prisma.subject.deleteMany();
        yield prisma.class.deleteMany();
        yield prisma.fee.deleteMany();
        yield prisma.studentParent.deleteMany();
        yield prisma.parent.deleteMany();
        yield prisma.student.deleteMany();
        yield prisma.teacher.deleteMany();
        yield prisma.admin.deleteMany();
        yield prisma.lead.deleteMany();
        yield prisma.event.deleteMany();
        yield prisma.branch.deleteMany();
        yield prisma.user.deleteMany();
        // 1. Users with roles
        const adminU = yield prisma.user.create({
            data: {
                email: "admin@example.com",
                password: "securehash",
                role: client_1.UserRole.ADMIN,
                admin: { create: { name: "Admin One" } },
            },
        });
        const teacherU = yield prisma.user.create({
            data: {
                email: "teacher@example.com",
                password: "securehash",
                role: client_1.UserRole.TEACHER,
                teacher: {
                    create: {
                        teacherId: "T-001",
                        name: "John Teacher",
                        phone: "1234567890",
                        address: "123 Teacher St",
                        dateOfJoining: new Date("2020-01-01"),
                        qualification: "M.Ed",
                        status: client_1.TeacherStatus.ACTIVE,
                        subject: "General",
                        branch: "Main",
                    },
                },
            },
        });
        const studentU = yield prisma.user.create({
            data: {
                email: "student@example.com",
                password: "securehash",
                role: client_1.UserRole.STUDENT,
                student: {
                    create: {
                        studentId: "S-001",
                        name: "Jane Student",
                        phone: "0987654321",
                        address: "456 Elm St",
                        dateOfBirth: new Date("2010-05-01"),
                        admissionDate: new Date("2025-06-01"),
                        branch: "Main",
                    },
                },
            },
        });
        const parentU = yield prisma.user.create({
            data: {
                email: "parent@example.com",
                password: "securehash",
                role: client_1.UserRole.PARENT,
                parent: {
                    create: {
                        name: "Parent One",
                        phone: "1122334455",
                        address: "456 Elm St",
                        occupation: "Engineer",
                        relationship: "Mother",
                    },
                },
            },
        });
        // 2. Link student and parent
        const student = yield prisma.student.findUnique({ where: { userId: studentU.id } });
        const parent = yield prisma.parent.findUnique({ where: { userId: parentU.id } });
        if (student && parent) {
            yield prisma.studentParent.create({
                data: { studentId: student.id, parentId: parent.id },
            });
        }
        // 3. Branch
        const branch = yield prisma.branch.create({
            data: { name: "Main", students: 1, teachers: 1, classes: 0 },
        });
        // 4. Class
        const cls = yield prisma.class.create({
            data: {
                name: "Grade 1-A",
                grade: 1,
                section: "A",
                capacity: 25,
            },
        });
        // assign student to class
        if (student) {
            yield prisma.student.update({ where: { id: student.id }, data: { classId: cls.id } });
        }
        // assign teacher to class
        const teacher = yield prisma.teacher.findUnique({ where: { userId: teacherU.id } });
        if (teacher) {
            yield prisma.class.update({
                where: { id: cls.id },
                data: { teachers: { connect: { id: teacher.id } } },
            });
        }
        // 5. Subjects
        const subject1 = yield prisma.subject.create({
            data: {
                name: "Mathematics",
                code: "MATH101",
                description: "Basic Math",
                credits: 4,
                teacher: { connect: { id: teacher.id } },
            },
        });
        const subject2 = yield prisma.subject.create({
            data: {
                name: "Science",
                code: "SCI101",
                description: "Basic Science",
                credits: 4,
                teacher: { connect: { id: teacher.id } },
            },
        });
        // 6. ClassSubject linking
        for (const subj of [subject1, subject2]) {
            yield prisma.classSubject.create({
                data: { classId: cls.id, subjectId: subj.id },
            });
        }
        // 7. Fee for student
        if (student) {
            yield prisma.fee.create({
                data: {
                    studentId: student.id,
                    amount: 2000,
                    status: "PAID",
                    date: new Date(),
                },
            });
        }
        // 8. Assignments
        for (const [idx, subj] of [subject1, subject2].entries()) {
            yield prisma.assignment.create({
                data: {
                    name: `Assignment for ${subj.name}`,
                    classId: cls.id,
                    subjectId: subj.id,
                    teacherId: teacher.id,
                },
            });
        }
        // 9. Event
        yield prisma.event.create({
            data: { title: "Annual Day", date: new Date("2025-12-15"), type: "Celebration" },
        });
        // 10. Lead
        yield prisma.lead.create({
            data: {
                studentName: "New Prospect",
                parentName: "Prospect Parent",
                contactEmail: "lead@example.com",
                contactPhone: "6677889900",
                desiredClass: "Grade 2",
            },
        });
        // 11. Update branch counts
        yield prisma.branch.update({
            where: { id: branch.id },
            data: { classes: { increment: 1 } },
        });
        console.log("✅ Done seeding database.");
    });
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
