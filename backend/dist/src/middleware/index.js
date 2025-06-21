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
exports.verifyTeacher = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Authenticate JWT Token
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Access token is required",
            });
            return;
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
            return;
        }
        req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
        };
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }
        if (error.name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                message: "Token expired",
            });
            return;
        }
        console.error("Authentication error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "Insufficient permissions",
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
const verifyTeacher = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }
        if (req.user.role !== "TEACHER" && req.user.role !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "Teacher access required",
            });
            return;
        }
        if (req.user.role === "TEACHER") {
            const teacher = yield prisma.teacher.findUnique({
                where: { userId: req.user.userId },
            });
            if (!teacher) {
                res.status(403).json({
                    success: false,
                    message: "Teacher profile not found",
                });
                return;
            }
            req.teacher = {
                id: teacher.id,
                teacherId: teacher.teacherId,
                name: teacher.name,
            };
        }
        next();
    }
    catch (error) {
        console.error("Teacher verification error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.verifyTeacher = verifyTeacher;
