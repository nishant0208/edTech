"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const teacher_1 = require("../controller/teacher");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signup", auth_1.register);
exports.authRouter.post("/login", auth_1.login);
exports.authRouter.get("/students", auth_1.getStudents);
exports.authRouter.get("/teachers", auth_1.getTeachers);
exports.authRouter.post("/create/teacher", teacher_1.createTeacher);
exports.authRouter.post("/create/student", auth_1.createStudent);
