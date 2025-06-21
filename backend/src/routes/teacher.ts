import express from "express";
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controller/teacher";

const router = express.Router();

router.get("/", getTeachers); // With filters
// router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);
router.get("/:id", (req, res, next) => {
  getTeacherById(req, res)
    .then((response) => {
      next(response);
    })
    .catch((error) => {
      next(error);
    });
});
export default router;
