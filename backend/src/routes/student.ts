import express from "express";
import { getStudents, updateStudent, deleteStudent, getStudentById } from "../controller/student";

const router = express.Router();

router.get("/", getStudents);
// router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
