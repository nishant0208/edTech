import express from "express";
import { createAssignment, getAssignments } from "../controller/assignment";
export const assignmentRouter = express.Router();

assignmentRouter.post("/create", createAssignment);

assignmentRouter.get("/all", getAssignments);
