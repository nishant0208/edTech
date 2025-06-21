"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoleSpecificFields = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, "pawan", 
    // @ts-ignore
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};
exports.generateToken = generateToken;
const validateRoleSpecificFields = (role, data) => {
    switch (role) {
        case "TEACHER":
            if (!data.teacherId)
                return "Teacher ID is required for teachers";
            break;
        case "STUDENT":
            if (!data.studentId)
                return "Student ID is required for students";
            if (!data.classId)
                return "Class ID is required for students";
            break;
        default:
            break;
    }
    return null;
};
exports.validateRoleSpecificFields = validateRoleSpecificFields;
