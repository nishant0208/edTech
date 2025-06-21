import express from "express";
import {
  createStudent,
  getStudents,
  getTeachers,
  login,
  register,
} from "../controller/auth";
// import { createTeacher } from "../controller/teacher";
export const authRouter = express.Router();
authRouter.post("/signup", register);
authRouter.post("/login", login);
authRouter.get("/students", getStudents);
authRouter.get("/teachers", getTeachers);
// authRouter.post("/create/teacher", createTeacher);
authRouter.post("/create/student", createStudent);
