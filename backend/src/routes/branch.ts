import express from "express";
import { getBranches, createBranch, deleteBranch, updateBranch } from "../controller/branch";
const router = express.Router();

router.get("/", getBranches);
router.post("/", createBranch);
router.delete("/:id", deleteBranch); 
router.put("/:id", updateBranch);
export default router;
