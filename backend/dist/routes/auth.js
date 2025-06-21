"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
// import { createTeacher } from "../controller/teacher";
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signup", auth_1.register);
exports.authRouter.post("/login", auth_1.login);
exports.authRouter.get("/students", auth_1.getStudents);
exports.authRouter.get("/teachers", auth_1.getTeachers);
// authRouter.post("/create/teacher", createTeacher);
exports.authRouter.post("/create/student", auth_1.createStudent);
