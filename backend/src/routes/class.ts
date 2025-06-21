import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  getClasses,
  updateClass,
} from "../controller/classes";
import { verifyTeacher } from "../middleware";

 const classRouter = express.Router();

classRouter.get("/all", getAllClasses);

classRouter.post("/create", createClass);

classRouter.put("/update", updateClass);

classRouter.get("/:id", getClassById);

classRouter.get("/", getClasses); //  Needed for dashboard count



export default classRouter;