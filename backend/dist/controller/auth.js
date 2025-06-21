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
exports.createStudent = exports.getTeachers = exports.getStudents = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nanoid_1 = require("nanoid");
const client_1 = require("@prisma/client");
const token_1 = require("../utils/token");
const prisma = new client_1.PrismaClient();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role, name, phone, address, teacherId, dateOfJoining, qualification, branch, dateOfBirth, admissionDate, classId, occupation, relationship, } = req.body;
        if (!email || !password || !role || !name) {
            res.status(400).json({
                success: false,
                message: "Email, password, role, and name are required",
            });
            return;
        }
        // const validationError = validateRoleSpecificFields(role, req.body);
        // if (validationError) {
        //   res.status(400).json({
        //     success: false,
        //     message: validationError,
        //   } as AuthResponse);
        //   return;
        // }
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
            return;
        }
        const saltRounds = 12;
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: role,
                },
            });
            let profile;
            switch (role) {
                case "ADMIN":
                    profile = yield tx.admin.create({
                        data: {
                            userId: user.id,
                            name,
                        },
                    });
                    break;
                case "TEACHER":
                    profile = yield tx.teacher.create({
                        data: {
                            userId: user.id,
                            teacherId: (0, nanoid_1.nanoid)(10),
                            name,
                            phone,
                            address,
                            dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
                            qualification,
                            branch: "",
                        },
                    });
                    break;
                case "STUDENT":
                    profile = yield tx.student.create({
                        data: {
                            userId: user.id,
                            studentId: (0, nanoid_1.nanoid)(10),
                            name,
                            phone,
                            address,
                            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                            admissionDate: admissionDate ? new Date(admissionDate) : null,
                            classId: classId,
                            branch: "",
                        },
                    });
                    break;
                case "PARENT":
                    profile = yield tx.parent.create({
                        data: {
                            userId: user.id,
                            name,
                            phone,
                            address,
                            occupation,
                            relationship,
                        },
                    });
                    break;
                default:
                    throw new Error("Invalid role specified");
            }
            return { user, profile };
        }));
        const token = (0, token_1.generateToken)(result.user.id, result.user.role);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    role: result.user.role,
                },
                profile: result.profile,
                token,
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: { email },
            include: {
                admin: true,
                teacher: true,
                student: {
                    include: {
                        class: true,
                    },
                },
                parent: true,
            },
        });
        console.log(user, "user is here");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }
        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: "Account is deactivated",
            });
            return;
        }
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //   res.status(401).json({
        //     success: false,
        //     message: "Invalid credentials",
        //   } as AuthResponse);
        //   return;
        // }
        const token = (0, token_1.generateToken)(user.id, user.role);
        let profile;
        switch (user.role) {
            case "ADMIN":
                profile = user.admin;
                break;
            case "TEACHER":
                profile = user.teacher;
                break;
            case "STUDENT":
                profile = user.student;
                break;
            case "PARENT":
                profile = user.parent;
                break;
        }
        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                profile,
                token,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.user.userId },
            include: {
                admin: true,
                teacher: true,
                student: {
                    include: {
                        class: true,
                    },
                },
                parent: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        let profile;
        switch (user.role) {
            case "ADMIN":
                profile = user.admin;
                break;
            case "TEACHER":
                profile = user.teacher;
                break;
            case "STUDENT":
                profile = user.student;
                break;
            case "PARENT":
                profile = user.parent;
                break;
        }
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                },
                profile,
            },
        });
    }
    catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getMe = getMe;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield prisma.student.findMany();
        if (!students) {
            return res.status(400).json({
                message: "no students found",
            });
        }
        return res.json({
            success: true,
            data: students,
        });
    }
    catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getStudents = getStudents;
const getTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teachers = yield prisma.teacher.findMany();
        if (!teachers) {
            return res.status(400).json({
                message: "no teachers found",
            });
        }
        return res.json({
            success: true,
            data: teachers,
        });
    }
    catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getTeachers = getTeachers;
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, address, dateOfBirth, class: classId, } = req.body;
        if (!name || !email || !classId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const user = yield prisma.user.create({
            data: {
                email,
                password: "passhere",
                role: "STUDENT",
            },
        });
        const student = yield prisma.student.create({
            data: {
                userId: user.id,
                studentId: (0, nanoid_1.nanoid)(),
                name,
                phone,
                address,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                admissionDate: new Date(),
                classId: classId,
                branch: "",
            },
            include: {
                user: true,
                class: true,
            },
        });
        return res.status(201).json({ message: "Student created", data: student });
    }
    catch (error) {
        console.error("[CREATE_STUDENT]", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createStudent = createStudent;
