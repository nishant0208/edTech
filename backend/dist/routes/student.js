"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_1 = require("../controller/student");
const router = express_1.default.Router();
router.get("/", student_1.getStudents);
// router.get("/:id", getStudentById);
router.put("/:id", student_1.updateStudent);
router.delete("/:id", student_1.deleteStudent);
exports.default = router;
