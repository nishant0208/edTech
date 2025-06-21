"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const assignment_1 = require("../controller/assignment");
exports.assignmentRouter = express_1.default.Router();
exports.assignmentRouter.post("/create", assignment_1.createAssignment);
exports.assignmentRouter.get("/all", assignment_1.getAssignments);
