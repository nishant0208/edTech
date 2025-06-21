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
        const adminUser = yield prisma.user.create({
            data: {
                email: "admin@example.com",
                password: "adminpass",
                role: "ADMIN",
                admin: {
                    create: {
                        name: "Admin One",
                    },
                },
            },
        });
        const teacherUser = yield prisma.user.create({
            data: {
                email: "teacher@example.com",
                password: "teacherpass",
                role: "TEACHER",
                teacher: {
                    create: {
                        name: "John Doe",
                        teacherId: "T-001",
                        phone: "1234567890",
                        address: "123 Teacher St",
                        dateOfJoining: new Date("2020-01-01"),
                        qualification: "M.Ed",
                    },
                },
            },
        });
        const studentUser = yield prisma.user.create({
            data: {
                email: "student@example.com",
                password: "studentpass",
                role: "STUDENT",
                student: {
                    create: {
                        name: "Jane Student",
                        studentId: "S-001",
                        phone: "9876543210",
                        address: "456 Student Ave",
                        dateOfBirth: new Date("2010-06-15"),
                        admissionDate: new Date("2022-06-01"),
                    },
                },
            },
        });
        const teacher = yield prisma.teacher.findUnique({
            where: { userId: teacherUser.id },
        });
        const student = yield prisma.student.findUnique({
            where: { userId: studentUser.id },
        });
        const class1 = yield prisma.class.create({
            data: {
                name: "Class 6A",
                grade: 6,
                section: "A",
                capacity: 30,
            },
        });
        yield prisma.student.update({
            where: { id: student === null || student === void 0 ? void 0 : student.id },
            data: {
                class: {
                    connect: { id: class1.id },
                },
            },
        });
        yield prisma.class.update({
            where: { id: class1.id },
            data: {
                teachers: {
                    connect: { id: (teacher === null || teacher === void 0 ? void 0 : teacher.id) || "" },
                },
            },
        });
        const subjects = yield Promise.all(Array.from({ length: 10 }).map((_, i) => prisma.subject.create({
            data: {
                name: `Subject ${i + 1}`,
                code: `SUBJ${i + 1}`,
                description: `Description for Subject ${i + 1}`,
                credits: 3,
                teacher: {
                    connect: { id: (teacher === null || teacher === void 0 ? void 0 : teacher.id) || "" },
                },
            },
        })));
        yield Promise.all(subjects.map((subject) => prisma.classSubject.create({
            data: {
                class: { connect: { id: class1.id } },
                subject: { connect: { id: subject.id } },
            },
        })));
        yield Promise.all(subjects.map((subject, i) => prisma.assignment.create({
            data: {
                name: `Assignment ${i + 1}`,
                class: { connect: { id: class1.id } },
                subject: { connect: { id: subject.id } },
                teacher: { connect: { id: (teacher === null || teacher === void 0 ? void 0 : teacher.id) || "" } },
            },
        })));
        console.log("✅ Database seeded successfully!");
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
