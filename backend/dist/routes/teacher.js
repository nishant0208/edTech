"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacher_1 = require("../controller/teacher");
const router = express_1.default.Router();
router.get("/", teacher_1.getTeachers); // With filters
// router.get("/:id", getTeacherById);
router.post("/", teacher_1.createTeacher);
router.put("/:id", teacher_1.updateTeacher);
router.delete("/:id", teacher_1.deleteTeacher);
router.get("/:id", (req, res, next) => {
    (0, teacher_1.getTeacherById)(req, res)
        .then((response) => {
        next(response);
    })
        .catch((error) => {
        next(error);
    });
});
exports.default = router;
